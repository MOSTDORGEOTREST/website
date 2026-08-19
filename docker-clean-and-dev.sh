#!/usr/bin/env sh

set -eu

PROJECT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
DEV_COMPOSE_FILE="$PROJECT_DIR/docker-compose.dev.yml"

if ! command -v docker >/dev/null 2>&1; then
  echo "Ошибка: Docker не установлен или недоступен в PATH." >&2
  exit 1
fi

if ! docker info >/dev/null 2>&1; then
  echo "Ошибка: Docker daemon не запущен или недоступен." >&2
  exit 1
fi

if [ ! -f "$DEV_COMPOSE_FILE" ]; then
  echo "Ошибка: не найден $DEV_COMPOSE_FILE" >&2
  exit 1
fi

if [ "${DOCKER_CLEAN_CONFIRM:-}" != "YES" ]; then
  echo "ВНИМАНИЕ: будут удалены ВСЕ Docker-контейнеры, образы, volumes,"
  echo "пользовательские сети и build-кэш на этой машине."
  printf "Для продолжения введите YES: "
  read -r answer

  if [ "$answer" != "YES" ]; then
    echo "Очистка отменена."
    exit 0
  fi
fi

echo "Останавливаю и удаляю все контейнеры..."
docker ps -aq | while IFS= read -r container_id; do
  [ -n "$container_id" ] && docker rm -f "$container_id"
done

echo "Удаляю все локальные образы..."
docker images -aq | sort -u | while IFS= read -r image_id; do
  [ -n "$image_id" ] && docker rmi -f "$image_id"
done

echo "Удаляю все Docker volumes..."
docker volume ls -q | while IFS= read -r volume_name; do
  [ -n "$volume_name" ] && docker volume rm -f "$volume_name"
done

echo "Удаляю неиспользуемые пользовательские сети..."
docker network prune -f

echo "Очищаю build-кэш и оставшиеся Docker-данные..."
docker builder prune -af
docker system prune -af --volumes

echo "Запускаю dev-окружение..."
cd "$PROJECT_DIR"
docker compose -f "$DEV_COMPOSE_FILE" up -d --force-recreate

echo "Dev-сайт запущен: http://localhost:4321"
docker compose -f "$DEV_COMPOSE_FILE" ps
