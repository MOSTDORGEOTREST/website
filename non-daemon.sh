#!/bin/bash

# Удаление всех контейнеров
docker rm $(docker ps -a -q) -f

# Проверка и удаление приложений, использующих порт 80
fuser -k 80/tcp

# Проверка и удаление приложений, использующих порт 443
fuser -k 443/tcp

# Удаление всех образов
docker rmi $(docker images -a -q) -f

# Очистка системы Docker
docker system prune -a -f

# Обновление кода с помощью git pull
git pull

# Пересоздание и запуск контейнеров с помощью Docker Compose
docker-compose up --force-recreate --build -d

