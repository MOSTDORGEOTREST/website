#!/usr/bin/env bash
#
# Единая точка управления проектом mdgt.ru (Ubuntu 24.04, Bash 4+).
#
set -Eeuo pipefail
IFS=$'\n\t'

readonly SCRIPT_VERSION="1.0.0"
PROJECT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
readonly PROJECT_DIR
readonly PROD_FILE="$PROJECT_DIR/docker-compose.yml"
readonly DEV_FILE="$PROJECT_DIR/docker-compose.dev.yml"
readonly COCON_FILE="$PROJECT_DIR/docker-compose.cocon.yml"
readonly COCON_MARKER="$PROJECT_DIR/.start-cocon-enabled"
readonly LOG_DIR="$PROJECT_DIR/.start-logs"
readonly BACKUP_ROOT="$PROJECT_DIR/Mysor"

COMMAND="${1:-help}"
ASSUME_YES="${START_ASSUME_YES:-false}"
if [[ "${2:-}" == "--yes" || "${1:-}" == "--yes" ]]; then
  ASSUME_YES=true
fi

mkdir -p "$LOG_DIR"
LOG_FILE="$LOG_DIR/$(date +%Y%m%d_%H%M%S)_${COMMAND//[^a-zA-Z0-9_-]/_}.log"
touch "$LOG_FILE"
exec > >(tee -a "$LOG_FILE") 2>&1

if [[ -t 1 ]]; then
  readonly RED=$'\033[31m' GREEN=$'\033[32m' YELLOW=$'\033[33m'
  readonly BLUE=$'\033[34m' BOLD=$'\033[1m' RESET=$'\033[0m'
else
  readonly RED="" GREEN="" YELLOW="" BLUE="" BOLD="" RESET=""
fi

timestamp() { date '+%Y-%m-%d %H:%M:%S'; }
info() { printf '%s[INFO] [%s] %s%s\n' "$BLUE" "$(timestamp)" "$*" "$RESET"; }
ok() { printf '%s[OK] [%s] %s%s\n' "$GREEN" "$(timestamp)" "$*" "$RESET"; }
warn() { printf '%s[WARN] [%s] %s%s\n' "$YELLOW" "$(timestamp)" "$*" "$RESET"; }
die() {
  printf '%s[ERROR] [%s] %s%s\n' "$RED" "$(timestamp)" "$*" "$RESET" >&2
  exit 1
}

on_error() {
  local code=$? line="${BASH_LINENO[0]:-${LINENO}}" command="${BASH_COMMAND:-unknown}"
  printf '%s[ERROR] [%s] Сбой на строке %s (код %s): %s%s\n' \
    "$RED" "$(timestamp)" "$line" "$code" "$command" "$RESET" >&2
  printf 'Полный журнал: %s\n' "$LOG_FILE" >&2
  exit "$code"
}
trap on_error ERR

checkpoint() {
  local title="$1"
  shift
  info "Проверка: $title"
  "$@"
  ok "$title"
}

have() { command -v "$1" >/dev/null 2>&1; }

require_base() {
  [[ "$(uname -s)" == "Linux" ]] || die "Скрипт предназначен для Linux (проверен на Ubuntu 24.04)."
  have git || die "Не найден git. Установите: sudo apt-get install git"
  have docker || die "Не найден Docker. Установите Docker Engine с Compose plugin."
  docker compose version >/dev/null 2>&1 ||
    die "Не найден Docker Compose v2 (команда 'docker compose')."
  docker info >/dev/null 2>&1 ||
    die "Docker daemon недоступен. Запустите Docker или добавьте пользователя в группу docker."
}

require_compose_file() {
  [[ -f "$1" ]] || die "Не найден Compose-файл: $1"
  docker compose -f "$1" config --quiet
}

confirm_dangerous() {
  local action="$1" answer
  if [[ "$ASSUME_YES" == "true" ]]; then
    warn "Подтверждение пропущено через --yes/START_ASSUME_YES=true."
    return
  fi
  [[ -t 0 ]] || die "$action Требуется интерактивное подтверждение или флаг --yes."
  printf '%sВНИМАНИЕ: %s\nВведите YES для продолжения: %s' "$RED" "$action" "$RESET"
  read -r answer
  [[ "$answer" == "YES" ]] || die "Операция отменена."
}

prod_compose() {
  PROD_COMPOSE=(docker compose -f "$PROD_FILE")
  if [[ -f "$COCON_MARKER" ]]; then
    PROD_COMPOSE+=(-f "$COCON_FILE")
  fi
}

git_update() {
  local stamp backup entry status path second
  checkpoint "Git-репозиторий доступен" git -C "$PROJECT_DIR" rev-parse --is-inside-work-tree

  if [[ -n "$(git -C "$PROJECT_DIR" status --porcelain=v1 --untracked-files=all)" ]]; then
    stamp="$(date +%Y-%m-%d_%H-%M-%S)"
    backup="$BACKUP_ROOT/$stamp"
    mkdir -p "$backup/files"
    warn "Есть локальные изменения. Переношу копии в: $backup"

    git -C "$PROJECT_DIR" status --short >"$backup/status.txt"
    git -C "$PROJECT_DIR" diff --binary >"$backup/unstaged.patch"
    git -C "$PROJECT_DIR" diff --cached --binary >"$backup/staged.patch"

    while IFS= read -r -d '' entry; do
      status="${entry:0:2}"
      path="${entry:3}"
      if [[ -e "$PROJECT_DIR/$path" || -L "$PROJECT_DIR/$path" ]]; then
        (cd "$PROJECT_DIR" && cp -a --parents -- "$path" "$backup/files/")
      fi
      if [[ "$status" == R* || "$status" == C* || "${status:1:1}" == "R" || "${status:1:1}" == "C" ]]; then
        IFS= read -r -d '' second || true
        if [[ -n "${second:-}" && ( -e "$PROJECT_DIR/$second" || -L "$PROJECT_DIR/$second" ) ]]; then
          (cd "$PROJECT_DIR" && cp -a --parents -- "$second" "$backup/files/")
        fi
      fi
    done < <(git -C "$PROJECT_DIR" status --porcelain=v1 -z --untracked-files=all)

    git -C "$PROJECT_DIR" reset --hard HEAD
    git -C "$PROJECT_DIR" clean -fd -e Mysor/ -e .start-logs/ -e .start-cocon-enabled
    ok "Локальные файлы сохранены в $backup и рабочее дерево очищено."
  else
    ok "Локальных изменений нет."
  fi

  checkpoint "Получение обновлений Git (только fast-forward)" \
    git -C "$PROJECT_DIR" pull --ff-only
}

remove_all_containers() {
  local ids
  ids="$(docker ps -aq)"
  if [[ -n "$ids" ]]; then
    # shellcheck disable=SC2086
    docker rm -f $ids
  else
    info "Docker-контейнеров для удаления нет."
  fi
}

clean_all_docker() {
  confirm_dangerous "Будут удалены ВСЕ контейнеры, неиспользуемые образы, сети, volumes и build cache на сервере."
  checkpoint "Удаление всех Docker-контейнеров" remove_all_containers
  checkpoint "Полная очистка Docker" docker system prune -af --volumes
  checkpoint "Очистка build cache" docker builder prune -af
}

wait_for_container() {
  local name="$1" timeout="${2:-120}" elapsed=0 state health
  info "Ожидание готовности контейнера '$name' (до ${timeout} с)..."
  while (( elapsed < timeout )); do
    if docker inspect "$name" >/dev/null 2>&1; then
      state="$(docker inspect -f '{{.State.Status}}' "$name")"
      health="$(docker inspect -f '{{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}}' "$name")"
      if [[ "$state" == "running" && ( "$health" == "healthy" || "$health" == "none" ) ]]; then
        ok "Контейнер '$name' работает (health: $health)."
        return 0
      fi
      if [[ "$state" == "exited" || "$state" == "dead" ]]; then
        docker logs --tail 100 "$name" || true
        die "Контейнер '$name' завершился (state: $state)."
      fi
    fi
    sleep 2
    elapsed=$((elapsed + 2))
  done
  docker logs --tail 100 "$name" || true
  die "Контейнер '$name' не стал готов за ${timeout} секунд."
}

verify_http() {
  if have curl; then
    checkpoint "Локальный HTTPS healthcheck" \
      curl --insecure --fail --silent --show-error --max-time 10 https://127.0.0.1/healthz
  else
    warn "curl не установлен: HTTP healthcheck пропущен."
  fi
}

start_prod_detached() {
  prod_compose
  if [[ -f "$COCON_MARKER" ]]; then
    warn "Режим cocon включён: запускается только изолированный sitelab, ACME отключён."
    "${PROD_COMPOSE[@]}" up -d --build --force-recreate --no-deps sitelab
  else
    "${PROD_COMPOSE[@]}" up -d --build --force-recreate
  fi
  wait_for_container sitelab 180
  verify_http
}

cmd_prod() {
  require_base
  require_compose_file "$PROD_FILE"
  git_update
  clean_all_docker
  checkpoint "Чистая production-сборка без cache" docker compose -f "$PROD_FILE" build --no-cache --pull
  start_prod_detached
}

cmd_prod_lite() {
  require_base
  require_compose_file "$PROD_FILE"
  git_update
  start_prod_detached
}

cmd_dev() {
  require_base
  require_compose_file "$DEV_FILE"
  git_update
  clean_all_docker
  checkpoint "Запуск чистого dev-окружения" \
    docker compose -f "$DEV_FILE" up -d --force-recreate --renew-anon-volumes
  wait_for_container mdgt-website-dev 120
}

cmd_dev_lite() {
  require_base
  require_compose_file "$DEV_FILE"
  git_update
  checkpoint "Запуск/обновление dev-окружения" docker compose -f "$DEV_FILE" up -d
  wait_for_container mdgt-website-dev 120
}

cmd_info() {
  require_base
  prod_compose
  printf '\n%s=== Production ===%s\n' "$BOLD" "$RESET"
  "${PROD_COMPOSE[@]}" ps -a || true
  printf '\n%s=== Development ===%s\n' "$BOLD" "$RESET"
  docker compose -f "$DEV_FILE" ps -a || true
  printf '\n%s=== Последние 100 строк production-логов ===%s\n' "$BOLD" "$RESET"
  "${PROD_COMPOSE[@]}" logs --tail 100 --timestamps || true
  printf '\n%s=== Использование диска Docker ===%s\n' "$BOLD" "$RESET"
  docker system df || true
}

cmd_down() {
  require_base
  prod_compose
  checkpoint "Остановка production-контейнеров" "${PROD_COMPOSE[@]}" down
  checkpoint "Остановка dev-контейнеров" docker compose -f "$DEV_FILE" down
}

cmd_del() {
  require_base
  confirm_dangerous "Будут безвозвратно удалены ВСЕ Docker-контейнеры на сервере."
  checkpoint "Удаление всех Docker-контейнеров" remove_all_containers
}

cmd_reboot() {
  require_base
  prod_compose
  if [[ -f "$COCON_MARKER" ]]; then
    checkpoint "Перезапуск изолированного sitelab" "${PROD_COMPOSE[@]}" restart sitelab
  else
    checkpoint "Перезапуск production-контейнеров" "${PROD_COMPOSE[@]}" restart
  fi
  wait_for_container sitelab 120
  verify_http
}

cmd_non_d() {
  require_base
  require_compose_file "$PROD_FILE"
  prod_compose
  info "Запуск в foreground. Для остановки нажмите Ctrl+C."
  if [[ -f "$COCON_MARKER" ]]; then
    "${PROD_COMPOSE[@]}" up --build --force-recreate --no-deps sitelab
  else
    "${PROD_COMPOSE[@]}" up --build --force-recreate
  fi
}

certificate_pair_valid() {
  local crt="$PROJECT_DIR/cert/crt.crt" key="$PROJECT_DIR/cert/key.key"
  [[ -s "$crt" && -s "$key" ]] || die "Не найдены cert/crt.crt и/или cert/key.key."
  openssl x509 -in "$crt" -noout >/dev/null
  openssl pkey -in "$key" -noout >/dev/null
  local cert_pub key_pub
  cert_pub="$(openssl x509 -in "$crt" -pubkey -noout | openssl sha256)"
  key_pub="$(openssl pkey -in "$key" -pubout | openssl sha256)"
  [[ "$cert_pub" == "$key_pub" ]] || die "Сертификат и закрытый ключ не образуют пару."
}

cmd_ssl() {
  have openssl || die "Не найден openssl."
  checkpoint "Локальный сертификат и ключ корректны" certificate_pair_valid
  openssl x509 -in "$PROJECT_DIR/cert/crt.crt" -noout -subject -issuer -serial -dates \
    -fingerprint -sha256
  if openssl x509 -in "$PROJECT_DIR/cert/crt.crt" -checkend $((30 * 86400)) -noout; then
    ok "Сертификат действителен ещё минимум 30 дней."
  else
    warn "Срок сертификата истекает менее чем через 30 дней (или уже истёк)."
    return 2
  fi

  if have timeout; then
    info "Проверка сертификата, который реально отдаёт mdgt.ru:443..."
    timeout 15 openssl s_client -connect mdgt.ru:443 -servername mdgt.ru </dev/null 2>/dev/null |
      openssl x509 -noout -subject -issuer -dates -fingerprint -sha256
    ok "Удалённый TLS-сертификат получен и разобран."
  fi
}

cmd_ssl_hard() {
  require_base
  [[ ! -f "$COCON_MARKER" ]] ||
    die "В режиме cocon ACME отключён. Сначала выполните: ./start.sh cocon_off"
  confirm_dangerous "Let's Encrypt будет принудительно запрошен новый сертификат (учитывайте rate limits)."
  checkpoint "Production Compose корректен" require_compose_file "$PROD_FILE"
  docker compose -f "$PROD_FILE" up -d sitelab
  wait_for_container sitelab 120
  checkpoint "Принудительный перевыпуск сертификата" \
    docker compose -f "$PROD_FILE" run --rm \
      -e RUN_ONCE=true -e FORCE_RENEWAL=true acme
  cmd_ssl
}

cmd_arma() {
  require_base
  require_compose_file "$PROD_FILE"
  local failed=0 checked=0 cid service running_image expected_image changes mount source
  info "Пересборка эталонных образов из текущего проекта..."
  docker compose -f "$PROD_FILE" build

  while IFS= read -r cid; do
    [[ -n "$cid" ]] || continue
    checked=$((checked + 1))
    service="$(docker inspect -f '{{ index .Config.Labels "com.docker.compose.service" }}' "$cid")"
    running_image="$(docker inspect -f '{{.Image}}' "$cid")"
    expected_image="$(docker compose -f "$PROD_FILE" images -q "$service" | head -n 1)"
    info "Контейнер $(docker inspect -f '{{.Name}}' "$cid" | tr -d '/') (service: $service)"

    if [[ -z "$expected_image" || "$running_image" != "$expected_image" ]]; then
      warn "Образ контейнера отличается от образа, собранного из текущего проекта."
      failed=1
    else
      ok "Контейнер запущен из актуального эталонного образа: $running_image"
    fi

    changes="$(docker diff "$cid" | grep -Ev \
      '^[ACD] /(run|var/run|var/cache/nginx|var/log/nginx|tmp)(/|$)' || true)"
    if [[ -n "$changes" ]]; then
      warn "Неожиданные изменения в записываемом слое контейнера:"
      printf '%s\n' "$changes"
      failed=1
    else
      ok "Неожиданных изменений файловой системы контейнера не найдено."
    fi

    while IFS='|' read -r source mount; do
      [[ -n "$mount" ]] || continue
      case "$service:$mount" in
        sitelab:/etc/nginx/cert|sitelab:/var/www/letsencrypt|\
        acme:/cert-out|acme:/etc/letsencrypt|acme:/var/www/letsencrypt|\
        acme:/var/run/docker.sock) ;;
        *)
          warn "Неожиданное монтирование: $source -> $mount"
          failed=1
          ;;
      esac
    done < <(docker inspect -f '{{range .Mounts}}{{.Source}}|{{.Destination}}{{println}}{{end}}' "$cid")
  done < <(docker compose -f "$PROD_FILE" ps -q)

  (( checked > 0 )) || die "Нет запущенных production-контейнеров для проверки."
  if (( failed )); then
    die "ARMA обнаружила расхождения. Смотрите предупреждения выше; автоматических удалений не выполнено."
  fi
  ok "ARMA: проверенные контейнеры соответствуют текущему проекту, неожиданных изменений нет."
  warn "Проверка целостности снижает риск, но не доказывает отсутствие эксплуатации в памяти или внешних томах."
}

cmd_cocon_on() {
  require_base
  (( EUID == 0 )) || die "Для смены владельца TLS-ключа запустите: sudo ./start.sh cocon_on"
  [[ -f "$COCON_FILE" ]] || die "Не найден $COCON_FILE"
  certificate_pair_valid
  confirm_dangerous "ACME-контейнер будет остановлен; sitelab запустится read-only без root и без docker.sock."
  touch "$COCON_MARKER"
  chmod 640 "$PROJECT_DIR/cert/key.key"
  chown 0:101 "$PROJECT_DIR/cert/key.key" 2>/dev/null ||
    warn "Не удалось сменить группу key.key на GID 101; запуск проверит доступ."
  prod_compose
  "${PROD_COMPOSE[@]}" down --remove-orphans
  checkpoint "Запуск cocon-режима" \
    "${PROD_COMPOSE[@]}" up -d --force-recreate --no-deps sitelab
  wait_for_container sitelab 120
  verify_http
  ok "Cocon включён. Автопродление SSL приостановлено до cocon_off."
}

cmd_cocon_off() {
  require_base
  (( EUID == 0 )) || die "Для восстановления прав TLS-ключа запустите: sudo ./start.sh cocon_off"
  if [[ ! -f "$COCON_MARKER" ]]; then
    info "Cocon уже выключен."
    return
  fi
  docker compose -f "$PROD_FILE" -f "$COCON_FILE" down --remove-orphans
  rm -f "$COCON_MARKER"
  chown 0:0 "$PROJECT_DIR/cert/key.key" 2>/dev/null || true
  chmod 600 "$PROJECT_DIR/cert/key.key" 2>/dev/null || true
  checkpoint "Запуск обычного production-режима" docker compose -f "$PROD_FILE" up -d
  wait_for_container sitelab 120
  verify_http
  ok "Cocon выключен; ACME снова работает."
}

cmd_check() {
  require_base
  have openssl || die "Не найден openssl."
  checkpoint "Синтаксис start.sh" bash -n "$PROJECT_DIR/start.sh"
  checkpoint "Production Compose" require_compose_file "$PROD_FILE"
  checkpoint "Development Compose" require_compose_file "$DEV_FILE"
  checkpoint "Cocon Compose" docker compose -f "$PROD_FILE" -f "$COCON_FILE" config --quiet
  checkpoint "Git worktree" git -C "$PROJECT_DIR" rev-parse --is-inside-work-tree
  ok "Все статические и системные проверки пройдены."
}

usage() {
  cat <<'EOF'
Использование: ./start.sh <команда> [--yes]

  prod       Git update, полная очистка всего Docker и чистый production
  prod_lite  Git update и production update без предварительного down
  dev        Git update, полная очистка всего Docker и чистый dev
  dev_lite   Git update и запуск/обновление dev
  git        Сохранить локальные изменения в Mysor/<дата> и выполнить pull
  ssl        Проверить локальный и удалённый TLS-сертификат
  ssl_hard   Принудительно перевыпустить сертификат Let's Encrypt
  info       Показать контейнеры, последние логи и использование диска
  down       Остановить production и dev проекта
  del        Удалить все контейнеры на сервере
  reboot     Перезапустить production-контейнеры
  non_d      Запустить production в foreground (без -d)
  arma       Сверить контейнеры с образами, собранными из текущего проекта
  cocon_on   Включить строгую изоляцию sitelab (без root/ACME/docker.sock)
  cocon_off  Вернуть обычный production-режим
  check      Проверить зависимости, Bash и Compose-конфигурации

Опасные команды требуют ввода YES. Для автоматизации: --yes или
START_ASSUME_YES=true. Журналы сохраняются в .start-logs/.
EOF
}

cd "$PROJECT_DIR"
info "start.sh v$SCRIPT_VERSION; команда: $COMMAND; журнал: $LOG_FILE"
case "$COMMAND" in
  prod) cmd_prod ;;
  prod_lite) cmd_prod_lite ;;
  dev) cmd_dev ;;
  dev_lite) cmd_dev_lite ;;
  git) require_base; git_update ;;
  ssl) cmd_ssl ;;
  ssl_hard) cmd_ssl_hard ;;
  info) cmd_info ;;
  down) cmd_down ;;
  del) cmd_del ;;
  reboot) cmd_reboot ;;
  non_d) cmd_non_d ;;
  arma) cmd_arma ;;
  cocon_on) cmd_cocon_on ;;
  cocon_off) cmd_cocon_off ;;
  check) cmd_check ;;
  help|-h|--help) usage ;;
  *) usage; die "Неизвестная команда: $COMMAND" ;;
esac
ok "Команда '$COMMAND' завершена успешно. Журнал: $LOG_FILE"
