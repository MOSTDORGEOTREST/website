#!/usr/bin/env bash
#
# Быстрый запуск сайта mdgt.ru в Docker.
#
#   ./daemon.sh            полная пересборка (как раньше): чистка Docker, логов, git pull, сборка с нуля
#   ./daemon.sh lite       лёгкий: git pull, чистка логов, пересборка только изменённого (с кэшем)
#   ./daemon.sh start      просто поднять контейнеры в фоне, без git и пересборки
#   ./daemon.sh fg         то же, что lite, но в консоли (без -d), остановка — Ctrl+C
#   ./daemon.sh restart    перезапустить контейнеры
#   ./daemon.sh stop       остановить контейнеры проекта
#   ./daemon.sh logs       удалить логи (Docker-логи контейнеров и журналы в папке проекта)
#   ./daemon.sh status     состояние контейнеров и место на диске
#
set -Eeuo pipefail

PROJECT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
cd "$PROJECT_DIR"

MODE="${1:-full}"
SERVICE="sitelab"
COCON_MARKER="$PROJECT_DIR/.start-cocon-enabled"

# BuildKit нужен для кэша npm в Dockerfile.web (RUN --mount=type=cache)
export DOCKER_BUILDKIT=1 COMPOSE_DOCKER_CLI_BUILD=1
# Лимит CPU сайта = все ядра сервера: совпадает с nginx worker_processes auto
WEB_CPUS="${WEB_CPUS:-$(nproc 2>/dev/null || echo 1)}"
export WEB_CPUS

if [[ -t 1 ]]; then
  C_INFO=$'\033[34m' C_OK=$'\033[32m' C_WARN=$'\033[33m' C_ERR=$'\033[31m' C_END=$'\033[0m'
else
  C_INFO="" C_OK="" C_WARN="" C_ERR="" C_END=""
fi
info() { printf '%s==>%s %s\n' "$C_INFO" "$C_END" "$*"; }
ok()   { printf '%s ok%s %s\n' "$C_OK" "$C_END" "$*"; }
warn() { printf '%s !!%s %s\n' "$C_WARN" "$C_END" "$*" >&2; }
die()  { printf '%sERR%s %s\n' "$C_ERR" "$C_END" "$*" >&2; exit 1; }
have() { command -v "$1" >/dev/null 2>&1; }

have docker || die "Docker не установлен."
if docker compose version >/dev/null 2>&1; then
  COMPOSE=(docker compose)
elif have docker-compose; then
  COMPOSE=(docker-compose)
else
  die "Не найден ни 'docker compose', ни 'docker-compose'."
fi
COMPOSE+=(-f docker-compose.yml)
UP_TARGET=()
if [[ -f "$COCON_MARKER" ]]; then
  # режим cocon из start.sh: только изолированный sitelab, без acme
  COMPOSE+=(-f docker-compose.cocon.yml)
  UP_TARGET=(--no-deps "$SERVICE")
fi

# root не нужен, если пользователь в группе docker; sudo — только для чужих файлов логов
as_root() {
  if (( EUID == 0 )); then "$@"
  elif have sudo; then sudo -n "$@" 2>/dev/null
  else return 1
  fi
}

clean_logs() {
  info "Удаление логов"
  local cid path
  # Docker-логи контейнеров проекта (сюда же пишут access/error логи nginx)
  while IFS= read -r cid; do
    [[ -n "$cid" ]] || continue
    path="$(docker inspect -f '{{.LogPath}}' "$cid" 2>/dev/null || true)"
    [[ -n "$path" ]] || continue
    as_root sh -c ': > "$1"; rm -f "$1".*' sh "$path" ||
      warn "Нет прав очистить $path (запустите через sudo)."
  done < <("${COMPOSE[@]}" ps -aq 2>/dev/null || true)
  # журналы в папке проекта
  rm -rf "$PROJECT_DIR"/.start-logs/* 2>/dev/null || true
  rm -f "$PROJECT_DIR"/wget-log* "$PROJECT_DIR"/*.log "$PROJECT_DIR"/npm-debug.log* 2>/dev/null || true
  ok "Логи удалены."
}

git_pull() {
  if git -C "$PROJECT_DIR" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    info "git pull"
    git -C "$PROJECT_DIR" pull --ff-only || warn "git pull не удался — запускаю текущую версию кода."
  else
    warn "Папка не является git-репозиторием, обновление пропущено."
  fi
}

wait_healthy() {
  local timeout="${1:-120}" t=0 state health
  info "Жду готовности $SERVICE (до ${timeout} с)"
  while (( t < timeout )); do
    state="$(docker inspect -f '{{.State.Status}}' "$SERVICE" 2>/dev/null || echo none)"
    health="$(docker inspect -f '{{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}}' "$SERVICE" 2>/dev/null || echo none)"
    if [[ "$state" == "running" && ( "$health" == "healthy" || "$health" == "none" ) ]]; then
      ok "Сайт работает (health: $health)."
      return 0
    fi
    if [[ "$state" == "exited" || "$state" == "dead" ]]; then
      docker logs --tail 50 "$SERVICE" || true
      die "$SERVICE остановился (state: $state)."
    fi
    sleep 2; t=$((t + 2))
  done
  docker logs --tail 50 "$SERVICE" || true
  die "$SERVICE не стал готов за ${timeout} с."
}

free_ports() {
  have fuser || return 0
  fuser -k 80/tcp 443/tcp >/dev/null 2>&1 || true
}

cmd_full() {
  info "Полная пересборка"
  "${COMPOSE[@]}" down --remove-orphans >/dev/null 2>&1 || true
  clean_logs
  local ids
  ids="$(docker ps -aq)"
  # shellcheck disable=SC2086
  [[ -z "$ids" ]] || docker rm -f $ids >/dev/null
  free_ports
  ids="$(docker images -aq)"
  # shellcheck disable=SC2086
  [[ -z "$ids" ]] || docker rmi -f $ids >/dev/null 2>&1 || true
  docker system prune -af >/dev/null
  docker builder prune -af >/dev/null 2>&1 || true
  ok "Docker очищен."
  git_pull
  "${COMPOSE[@]}" build --pull
  "${COMPOSE[@]}" up -d --force-recreate --remove-orphans "${UP_TARGET[@]}"
  wait_healthy 180
}

cmd_lite() {
  info "Лёгкий запуск"
  git_pull
  clean_logs
  "${COMPOSE[@]}" up -d --build --remove-orphans "${UP_TARGET[@]}"
  # старые слои после пересборки и build-кэш старше недели
  docker image prune -f >/dev/null 2>&1 || true
  docker builder prune -f --filter until=168h >/dev/null 2>&1 || true
  wait_healthy 120
}

cmd_start() {
  info "Старт без пересборки"
  "${COMPOSE[@]}" up -d "${UP_TARGET[@]}"
  wait_healthy 120
}

cmd_fg() {
  git_pull
  clean_logs
  info "Запуск в консоли, остановка — Ctrl+C"
  "${COMPOSE[@]}" up --build --remove-orphans "${UP_TARGET[@]}"
}

cmd_status() {
  "${COMPOSE[@]}" ps -a
  echo
  docker stats --no-stream $("${COMPOSE[@]}" ps -q) 2>/dev/null || true
  echo
  docker system df
}

case "$MODE" in
  full|"")        cmd_full ;;
  lite)           cmd_lite ;;
  start)          cmd_start ;;
  fg)             cmd_fg ;;
  restart)        "${COMPOSE[@]}" restart; wait_healthy 120 ;;
  stop)           "${COMPOSE[@]}" down --remove-orphans ;;
  logs|clean-logs) clean_logs ;;
  status)         cmd_status ;;
  -h|--help|help) sed -n '3,13p' "$0" | sed 's/^# \{0,1\}//' ;;
  *)              sed -n '3,13p' "$0" | sed 's/^# \{0,1\}//'; die "Неизвестный режим: $MODE" ;;
esac
