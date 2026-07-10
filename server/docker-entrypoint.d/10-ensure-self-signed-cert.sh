#!/bin/sh
set -eu

CERT_DIR="/etc/nginx/cert"
CRT="$CERT_DIR/crt.crt"
KEY="$CERT_DIR/key.key"

mkdir -p "$CERT_DIR"

if [ ! -s "$CRT" ] || [ ! -s "$KEY" ]; then
  echo "Creating temporary self-signed certificate in $CERT_DIR"
  openssl req \
    -x509 \
    -nodes \
    -newkey rsa:2048 \
    -days "${SELF_SIGNED_CERT_DAYS:-7}" \
    -keyout "$KEY" \
    -out "$CRT" \
    -subj "${SELF_SIGNED_CERT_SUBJECT:-/CN=mdgt.ru}" \
    >/dev/null 2>&1

  chmod 644 "$CRT"
  chmod 600 "$KEY"
fi
