#!/usr/bin/env bash
set -Eeuo pipefail

ACME_DOMAINS="${ACME_DOMAINS:-${DOMAIN:-mdgt.ru,www.mdgt.ru}}"
CERTBOT_EMAIL="${CERTBOT_EMAIL:-}"
WEBROOT="${WEBROOT:-/var/www/letsencrypt}"
CERT_DIR="${CERT_DIR:-/cert-out}"
RENEW_BEFORE_DAYS="${RENEW_BEFORE_DAYS:-30}"
RENEW_INTERVAL_SECONDS="${RENEW_INTERVAL_SECONDS:-43200}"
CHECK_URL="${CHECK_URL:-http://mdgt.ru/}"
CHECK_TIMEOUT="${CHECK_TIMEOUT:-15}"
NGINX_CONTAINER="${NGINX_CONTAINER:-sitelab}"
ACME_STAGING="${ACME_STAGING:-false}"
RUN_ONCE="${RUN_ONCE:-false}"

DOMAINS=()
CERT_NAME="${CERT_NAME:-}"

log() {
  printf '[acme] %s\n' "$*"
}

fail() {
  log "ERROR: $*"
  return 1
}

normalize_domains() {
  local raw="${ACME_DOMAINS//,/ }"
  DOMAINS=()

  for domain in $raw; do
    if [ -n "$domain" ]; then
      DOMAINS+=("$domain")
    fi
  done

  if [ "${#DOMAINS[@]}" -eq 0 ]; then
    fail "ACME_DOMAINS is empty"
    return 1
  fi

  CERT_NAME="${CERT_NAME:-${DOMAINS[0]}}"
}

ensure_config() {
  if [ -z "$CERTBOT_EMAIL" ]; then
    fail "CERTBOT_EMAIL is required"
    return 1
  fi

  mkdir -p "$WEBROOT/.well-known/acme-challenge" "$CERT_DIR"
}

needs_renewal() {
  local cert_path="$CERT_DIR/crt.crt"
  local check_seconds=$((RENEW_BEFORE_DAYS * 86400))

  if [ ! -s "$cert_path" ]; then
    log "Certificate file is missing, requesting a certificate"
    return 0
  fi

  if ! openssl x509 -in "$cert_path" -noout >/dev/null 2>&1; then
    log "Certificate file is not a valid x509 certificate, requesting a certificate"
    return 0
  fi

  if openssl x509 -in "$cert_path" -checkend "$check_seconds" -noout >/dev/null 2>&1; then
    log "Certificate is still valid for more than ${RENEW_BEFORE_DAYS} days, skipping"
    return 1
  fi

  log "Certificate is close to expiration, renewal is needed"
  return 0
}

check_site_health() {
  if [ -z "$CHECK_URL" ]; then
    return 0
  fi

  log "Checking site health: $CHECK_URL"
  curl --fail --silent --show-error --max-time "$CHECK_TIMEOUT" "$CHECK_URL" >/dev/null
}

check_acme_webroot() {
  local token="acme-health-$(date +%s)-$$"
  local challenge_dir="$WEBROOT/.well-known/acme-challenge"
  local challenge_file="$challenge_dir/$token"
  local domain
  local response

  mkdir -p "$challenge_dir"
  printf '%s\n' "$token" > "$challenge_file"

  for domain in "${DOMAINS[@]}"; do
    log "Checking ACME webroot for $domain"
    response="$(curl --fail --silent --show-error --max-time "$CHECK_TIMEOUT" "http://${domain}/.well-known/acme-challenge/${token}")" || {
      rm -f "$challenge_file"
      fail "ACME challenge is not reachable for $domain"
      return 1
    }

    if [ "$response" != "$token" ]; then
      rm -f "$challenge_file"
      fail "ACME challenge response for $domain is unexpected"
      return 1
    fi
  done

  rm -f "$challenge_file"
}

request_certificate() {
  local args=(
    certonly
    --webroot
    -w "$WEBROOT"
    --cert-name "$CERT_NAME"
    --non-interactive
    --agree-tos
    --email "$CERTBOT_EMAIL"
    --keep-until-expiring
  )
  local domain

  for domain in "${DOMAINS[@]}"; do
    args+=(-d "$domain")
  done

  if [ "$ACME_STAGING" = "true" ]; then
    args+=(--staging)
  fi

  log "Requesting certificate for: ${DOMAINS[*]}"
  certbot "${args[@]}"
}

validate_certificate_pair() {
  local crt="$1"
  local key="$2"
  local cert_pub
  local key_pub

  openssl x509 -in "$crt" -noout >/dev/null
  openssl pkey -in "$key" -noout >/dev/null

  cert_pub="$(openssl x509 -in "$crt" -pubkey -noout | openssl sha256)"
  key_pub="$(openssl pkey -in "$key" -pubout | openssl sha256)"

  if [ "$cert_pub" != "$key_pub" ]; then
    fail "Certificate and private key do not match"
    return 1
  fi
}

reload_nginx() {
  if ! docker ps --format '{{.Names}}' | grep -Fx "$NGINX_CONTAINER" >/dev/null 2>&1; then
    fail "Nginx container '$NGINX_CONTAINER' is not running"
    return 1
  fi

  log "Testing nginx config before reload"
  docker exec "$NGINX_CONTAINER" nginx -t

  log "Reloading nginx"
  docker kill --signal=HUP "$NGINX_CONTAINER" >/dev/null
}

install_certificate() {
  local live_dir="/etc/letsencrypt/live/$CERT_NAME"
  local source_crt="$live_dir/fullchain.pem"
  local source_key="$live_dir/privkey.pem"
  local tmp_crt
  local tmp_key
  local backup_crt=""
  local backup_key=""
  local ts

  if [ ! -s "$source_crt" ] || [ ! -s "$source_key" ]; then
    fail "Certbot did not produce expected files in $live_dir"
    return 1
  fi

  tmp_crt="$(mktemp "$CERT_DIR/crt.crt.XXXXXX")"
  tmp_key="$(mktemp "$CERT_DIR/key.key.XXXXXX")"

  install -m 0644 "$source_crt" "$tmp_crt"
  install -m 0600 "$source_key" "$tmp_key"
  validate_certificate_pair "$tmp_crt" "$tmp_key"

  ts="$(date +%Y%m%d_%H%M%S)"
  if [ -s "$CERT_DIR/crt.crt" ]; then
    backup_crt="$CERT_DIR/crt_${ts}.crt.bak"
    cp -p "$CERT_DIR/crt.crt" "$backup_crt"
  fi

  if [ -s "$CERT_DIR/key.key" ]; then
    backup_key="$CERT_DIR/key_${ts}.key.bak"
    cp -p "$CERT_DIR/key.key" "$backup_key"
  fi

  mv "$tmp_crt" "$CERT_DIR/crt.crt"
  mv "$tmp_key" "$CERT_DIR/key.key"

  if ! reload_nginx; then
    log "Restoring previous certificate after failed nginx validation/reload"
    if [ -n "$backup_crt" ]; then
      cp -p "$backup_crt" "$CERT_DIR/crt.crt"
    fi
    if [ -n "$backup_key" ]; then
      cp -p "$backup_key" "$CERT_DIR/key.key"
    fi
    reload_nginx || true
    return 1
  fi

  if [ -n "$CHECK_URL" ]; then
    sleep 2
    curl --fail --silent --show-error --max-time "$CHECK_TIMEOUT" "$CHECK_URL" >/dev/null || {
      log "WARNING: post-reload site health check failed: $CHECK_URL"
    }
  fi

  log "Certificate installed into $CERT_DIR/crt.crt and $CERT_DIR/key.key"
}

run_once() {
  normalize_domains
  ensure_config

  if ! needs_renewal; then
    return 0
  fi

  check_site_health
  check_acme_webroot
  request_certificate
  install_certificate
}

main() {
  if [ "$RUN_ONCE" = "true" ]; then
    run_once
    return
  fi

  while true; do
    if ! run_once; then
      log "Renewal attempt failed; keeping the current certificate"
    fi

    log "Sleeping for ${RENEW_INTERVAL_SECONDS} seconds"
    sleep "$RENEW_INTERVAL_SECONDS"
  done
}

main "$@"
