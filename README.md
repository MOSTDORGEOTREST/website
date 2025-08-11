
# MDGT site

#### [Официальный домен](http://mdgt.ru/)
#### [Тестовый домен](http://mdgt.site/)

## Установка проекта
### 1) Для установки перейдите в нужную директорию в которой будет лежать папка с проктом:

```bash
cd your/path
```
### 2) И выполните клонирование в нужную папку:

```bash
git clone https://github.com/MOSTDORGEOTREST/website.git
```
### 3) И теперь вы можете перейти к нужной директории:
```bash
cd website
```

---

## Быстрый старт (локально)

### 1) Установите зависимости

```bash
npm install
```
#### или
```bash
yarn install
```
#### или
```bash
pnpm install
```

### 2) Запуск в режиме разработки ([http://localhost:3000](http://localhost:3000))

```bash
npm start
```

### 3) Сборка (production)

```bash
npm run build
```

---

## Запуск в Docker

### С использованием docker-compose


#### чтобы собрать и запустить в фоне (daemon):
```bash
docker-compose up --build -d
```

#### Посмотреть логи:
```bash
docker-compose logs -f
```

#### Остановить:
```bash
docker-compose down
```

---

## Отладка и полезные команды

* `npm run lint` — проверка линтером (если настроено).
* `npm test` — запуск тестов.
* `docker-compose logs -f` — просмотр логов сервисов.
* `docker ps` / `docker logs <container>` — проверить контейнеры и логи.
* `curl -I http://localhost:3000` — проверить, отвечает ли сервер. (локальная версия)
* `curl -I https://mdgt.ru` — проверить, отвечает ли сервер. (продакшн версия)
---

## Команды для полной очистки docker:
### Для отчистки контейнеров:
```bash
docker system prune -af
docker rm $(docker ps -a -q) -f
docker rmi $(docker images -a -q) -f
```
### Очистка лог файлов:
```bash
sudo rm -rf /var/log/*
```

---

## Контакты и авторы
<p align="left">
  <img src="https://s3.timeweb.com/cw78444-3db3e634-248a-495a-8c38-9f7322725c84/site/logo_500.jpg" alt="MDGT logo" width="100" />
</p>

* Разработчик: Olesya Selivanova
* Почта для связи: support@mdgt.ru

---