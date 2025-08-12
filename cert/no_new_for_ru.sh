#!/usr/bin/env bash
set -o errexit
set -o nounset
set -o pipefail

###########################
# Конфигурация (редактируй)
###########################
DOMAIN="${1:-mdgt.ru}"                           # можно передать первым аргументом
EMAIL="${2:-sheepdolly2023@gmail.com}"           # можно передать вторым аргументом
PROJECT_ROOT="${3:-$(pwd)}"                      # корень проекта (где docker-compose.yml), по умолчанию текущая папка
COMPOSE_FILE="${4:-$PROJECT_ROOT/docker-compose.yml}"
SERVICE_NAME="${5:-sitelab}"                     # имя сервиса в compose, по умолчанию sitelab
CERT_DIR="${6:-/root/mdgt.ru/website/cert}"      # куда копировать итоговые crt/key (по твоему)
ALLOW_DOWNTIME="${ALLOW_DOWNTIME:-false}"        # установить true, если разрешён временный даунтайм
CHALLENGE_DIR="$PROJECT_ROOT/letsencrypt-challenges"
DATE_NOW() { date +%Y%m%d_%H%M%S; }

# Цвета и статусы
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'
INFO="ℹ️"; OK="✅"; ERR="❌"; WARN="⚠️"

log() { echo -e "${BLUE}${INFO} $*${NC}"; }
ok()  { echo -e "${GREEN}${OK} $*${NC}"; }
warn(){ echo -e "${YELLOW}${WARN} $*${NC}"; }
err() { echo -e "${RED}${ERR} $*${NC}"; }

###########################
# Проверки прав
###########################
if [ "$(id -u)" -ne 0 ]; then
  err "Запусти скрипт с правами root (sudo)."
  exit 2
fi

###########################
# Утилиты
###########################
command_exists() { command -v "$1" >/dev/null 2>&1; }

ensure_certbot() {
  if ! command_exists certbot; then
    warn "certbot не найден. Попытка установить (apt-get)..."
    if command_exists apt-get; then
      apt-get update -y >/dev/null
      apt-get install -y certbot >/dev/null || { err "Не удалось установить certbot через apt-get"; exit 3; }
      ok "certbot установлен"
    else
      err "apt-get отсутствует — установи certbot вручную"
      exit 3
    fi
  else
    ok "certbot найден"
  fi
}

###########################
# Создаём challenge папку
###########################
prepare_challenge_dir() {
  log "Создаём/проверяем директорию для ACME challenges: $CHALLENGE_DIR"
  mkdir -p "$CHALLENGE_DIR"
  chmod 755 "$CHALLENGE_DIR"
  chown root:root "$CHALLENGE_DIR" || true
  ok "Каталог готов"
}

###########################
# Проверка docker-compose / docker
###########################
detect_docker_compose() {
  DOCKER_COMPOSE_CMD=""
  if [ -f "$COMPOSE_FILE" ]; then
    if command_exists docker-compose; then
      DOCKER_COMPOSE_CMD="docker-compose -f $COMPOSE_FILE"
    elif command_exists docker && docker compose version >/dev/null 2>&1; then
      DOCKER_COMPOSE_CMD="docker compose -f $COMPOSE_FILE"
    else
      warn "docker-compose не найден (или 'docker compose' отсутствует). Если ты запускаешь контейнеры - перезагрузка nginx в контейнере может не сработать автоматически."
      DOCKER_COMPOSE_CMD=""
    fi
  else
    warn "docker-compose.yml не найден по $COMPOSE_FILE — не смогу управлять контейнерами автоматически."
  fi
}

container_using_port80() {
  # возвращает 0 если контейнер пробросил 0.0.0.0:80
  if command_exists docker; then
    docker ps --format '{{.ID}} {{.Names}} {{.Ports}}' | grep -E '0.0.0.0:80' >/dev/null 2>&1 && return 0 || return 1
  fi
  return 1
}

###########################
# Получение сертификата (webroot)
###########################
get_via_webroot() {
  log "Попытка получить сертификат через webroot (директория: $CHALLENGE_DIR)"
  if certbot certonly --non-interactive --agree-tos --email "$EMAIL" --webroot -w "$CHALLENGE_DIR" -d "$DOMAIN"; then
    ok "Сертификат получен через webroot"
    return 0
  else
    warn "certbot webroot вернул ошибку."
    return 1
  fi
}

###########################
# Получение сертификата (standalone) — с временной остановкой docker-compose, если нужно
###########################
get_via_standalone_with_compose_control() {
  if [ "$ALLOW_DOWNTIME" != "true" ]; then
    warn "standalone fallback возможен только при ALLOW_DOWNTIME=true"
    return 2
  fi

  if [ -z "$DOCKER_COMPOSE_CMD" ]; then
    warn "docker-compose управление недоступно, но попытка standalone всё равно будет предпринята."
  fi

  # остановим compose, если он есть
  if [ -n "$DOCKER_COMPOSE_CMD" ]; then
    log "Останавливаем docker-compose сервисы (файл: $COMPOSE_FILE) для освобождения порта 80..."
    $DOCKER_COMPOSE_CMD down || warn "Не удалось корректно остановить docker-compose"
    sleep 2
  else
    # попытаемся остановить по имени контейнера, если он запущен
    if command_exists docker && docker ps --filter "name=$SERVICE_NAME" --format '{{.ID}}' | grep -q .; then
      log "Останавливаем контейнеры с именем, содержащим $SERVICE_NAME..."
      docker ps --filter "name=$SERVICE_NAME" --format '{{.ID}}' | xargs -r docker stop
      sleep 2
    fi
  fi

  # Запускаем standalone
  log "Запускаем certbot standalone..."
  if certbot certonly --non-interactive --agree-tos --email "$EMAIL" --standalone -d "$DOMAIN"; then
    ok "Сертификат получен через standalone"
    # Поднимем compose обратно
    if [ -n "$DOCKER_COMPOSE_CMD" ]; then
      log "Поднимаем docker-compose обратно..."
      $DOCKER_COMPOSE_CMD up -d || warn "Не удалось запустить docker-compose, запусти вручную."
    else
      # не знаем точный контейнер — ничего не делаем
      warn "docker-compose недоступен — убедись, что сервисы подняты вручную."
    fi
    return 0
  else
    err "certbot standalone не смог получить сертификат"
    # попытка поднять compose даже после провала
    if [ -n "$DOCKER_COMPOSE_CMD" ]; then
      log "Пытаемся поднять docker-compose обратно..."
      $DOCKER_COMPOSE_CMD up -d || warn "Не удалось запустить docker-compose"
    fi
    return 1
  fi
}

###########################
# Копирование и архаивирование существующих файлов
###########################
archive_and_copy_certs() {
  SRCDIR="/etc/letsencrypt/live/$DOMAIN"
  if [ ! -f "$SRCDIR/fullchain.pem" ] || [ ! -f "$SRCDIR/privkey.pem" ]; then
    err "Ожидаемые файлы сертифкатов не найдены в $SRCDIR"
    return 1
  fi

  mkdir -p "$CERT_DIR"
  chmod 750 "$CERT_DIR" || true

  ts="$(DATE_NOW)"
  # archive existing
  if [ -f "$CERT_DIR/crt.crt" ]; then
    mv "$CERT_DIR/crt.crt" "$CERT_DIR/crt_ru_${ts}.crt"
    ok "Старый crt переименован в crt_ru_${ts}.crt"
  fi
  if [ -f "$CERT_DIR/key.key" ]; then
    mv "$CERT_DIR/key.key" "$CERT_DIR/key_ru_${ts}.key"
    ok "Старый key переименован в key_ru_${ts}.key"
  fi

  # copy
  cp "$SRCDIR/fullchain.pem" "$CERT_DIR/crt.crt"
  cp "$SRCDIR/privkey.pem" "$CERT_DIR/key.key"

  chmod 644 "$CERT_DIR/crt.crt"
  chmod 600 "$CERT_DIR/key.key"
  chown root:root "$CERT_DIR/crt.crt" "$CERT_DIR/key.key" || true

  ok "Сертификаты скопированы в $CERT_DIR (crt.crt / key.key). Права установлены."
  return 0
}

###########################
# Перезагрузка nginx в контейнере / системе
###########################
reload_nginx() {
  # 1) docker-compose exec
  if [ -n "$DOCKER_COMPOSE_CMD" ]; then
    log "Пытаемся перезагрузить nginx внутри docker-compose сервиса $SERVICE_NAME..."
    if $DOCKER_COMPOSE_CMD exec -T "$SERVICE_NAME" nginx -s reload >/dev/null 2>&1; then
      ok "nginx перезагружен внутри контейнера ($SERVICE_NAME) через docker-compose exec"
      return 0
    else
      warn "Не получилось через docker-compose exec; попробуем перезапустить сервис."
      if $DOCKER_COMPOSE_CMD restart "$SERVICE_NAME" >/dev/null 2>&1; then
        ok "Сервис $SERVICE_NAME перезапущен через docker-compose"
        return 0
      else
        warn "Не удалось перезапустить сервис через docker-compose."
      fi
    fi
  fi

  # 2) docker exec по имени контейнера
  if command_exists docker && docker ps --filter "name=$SERVICE_NAME" --format '{{.ID}}' | grep -q .; then
    cid="$(docker ps --filter "name=$SERVICE_NAME" --format '{{.ID}}' | head -n1)"
    log "Пытаемся перезагрузить nginx через docker exec контейнера $cid..."
    if docker exec "$cid" nginx -s reload >/dev/null 2>&1; then
      ok "nginx перезагружен внутри контейнера $cid"
      return 0
    else
      warn "Не получилось перезагрузить nginx в контейнере $cid; попробуем docker restart."
      docker restart "$cid" >/dev/null 2>&1 || warn "Не удалось перезапустить контейнер $cid"
      return 0
    fi
  fi

  # 3) systemd nginx
  if command_exists systemctl; then
    log "Пытаемся перезагрузить systemd nginx..."
    if systemctl reload nginx >/dev/null 2>&1; then
      ok "systemd nginx перезагружен"
      return 0
    else
      warn "systemctl reload nginx не сработал"
    fi
  fi

  warn "Не удалось автоматически перезагрузить nginx. Перезагрузите вручную контейнер/сервис."
  return 1
}

###########################
# Основной flow
###########################
main() {
  log "DOMAIN=$DOMAIN EMAIL=$EMAIL"
  ensure_certbot
  prepare_challenge_dir
  detect_docker_compose

  # Предупреждение/инструкция: пользователь должен примонтировать CHALLENGE_DIR в контейнер
  log "Важно: убедись, что каталог $CHALLENGE_DIR примонтирован в контейнере nginx и доступен по пути, например, /var/www/letsencrypt"
  log "Добавь в конфиг nginx внутри контейнера блок:
location ^~ /.well-known/acme-challenge/ {
    alias /var/www/letsencrypt/;
    try_files \$uri =404;
}
и в docker-compose добавь volume: $CHALLENGE_DIR:/var/www/letsencrypt"

  # Попытка webroot
  if get_via_webroot; then
    :
  else
    warn "Webroot метод не прошёл."
    # Если port 80 занят docker-контейнером и ALLOW_DOWNTIME=true — пробуем standalone с остановкой compose
    if container_using_port80; then
      warn "Выявлено, что порт 80 проброшен контейнерами Docker."
      if [ "$ALLOW_DOWNTIME" = "true" ]; then
        ok "ALLOW_DOWNTIME=true — попробуем временно остановить docker-compose и выполнить standalone"
        if get_via_standalone_with_compose_control; then
          :
        else
          err "Не удалось получить сертификат ни webroot, ни standalone."
          exit 5
        fi
      else
        err "Чтобы автоматически решить проблему с занятым портом, установи ALLOW_DOWNTIME=true и перезапусти скрипт, либо вручную останови контейнеры, либо настрой монтирование $CHALLENGE_DIR в контейнер и повтори."
        exit 4
      fi
    else
      err "Webroot не прошёл, порт 80 не занят Docker. Проверь логи certbot ( /var/log/letsencrypt/letsencrypt.log )"
      exit 6
    fi
  fi

  # Копируем сертификаты в целевую папку с архивированием старых
  if archive_and_copy_certs; then
    ok "Копирование сертифкатов выполнено"
  else
    err "Ошибка при копировании сертификатов"
    exit 7
  fi

  # Перезагружаем nginx
  reload_nginx || warn "Проверь, что nginx в контейнере читает сертификаты из $CERT_DIR (см. volumes в docker-compose)."

  # Показываем дату окончания срока действия
  if openssl x509 -in "$CERT_DIR/crt.crt" -noout -enddate >/dev/null 2>&1; then
    endd=$(openssl x509 -in "$CERT_DIR/crt.crt" -noout -enddate | cut -d= -f2)
    ok "Сертификат действителен до: $endd"
  fi

  ok "Готово."
}

main "$@"
