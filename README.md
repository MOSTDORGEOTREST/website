# МОСТДОРГЕОТРЕСТ — сайт геотехнической лаборатории

Основной сайт проекта на Astro. Он статически собирается в `dist/`, а в
production раздаётся через nginx с HTTPS, автоматическим обновлением
сертификатов и проксированием HLS-трансляций.

## Структура проекта

```text
.
├── src/
│   ├── pages/             # страницы: главная, оборудование, курсы, ПО
│   ├── layouts/           # общий каркас страниц
│   ├── components/        # секции и интерфейс сайта
│   ├── scripts/           # анимации, WebGL, Lenis и GSAP
│   └── styles/            # глобальные стили и шрифты
├── public/
│   ├── img/               # изображения оборудования, объектов и логотипы
│   ├── fonts/             # локальные WOFF2-шрифты
│   └── assets/            # прайс-листы и протоколы
├── Dockerfile.web         # production-сборка Astro + nginx
├── docker-compose.yml     # production + ACME
├── docker-compose.dev.yml # dev-сервер Astro с HMR
├── nginx.conf             # общая конфигурация nginx
├── server/                # HTTPS, кэш, HLS и nginx entrypoint
├── acme/                  # автоматическое обновление сертификатов
└── cert/                  # сертификаты и служебные SSL-скрипты
```

## Локальная разработка

Нужен Node.js 18 или новее.

```bash
npm ci
npm run dev
```

Сайт откроется на [http://localhost:4321](http://localhost:4321). Изменения в
`src/` и `public/` применяются через HMR без production-пересборки.

Проверка production-сборки локально:

```bash
npm run build
npm run preview
```

## Разработка через Docker

```bash
docker compose -f docker-compose.dev.yml up
```

Dev-сайт также доступен на [http://localhost:4321](http://localhost:4321).

Полная очистка всего Docker на машине с последующим запуском dev-окружения:

```bash
./docker-clean-and-dev.sh
```

Скрипт удаляет все Docker-контейнеры, образы, volumes, пользовательские сети и
build-кэш, поэтому перед очисткой требует вручную ввести `YES`.

## Production

```bash
docker compose up -d --build
```

По умолчанию nginx занимает порты 80 и 443. При необходимости порты можно
переопределить:

```bash
HTTP_PORT=8080 HTTPS_PORT=8443 docker compose up -d --build
```

Production-конфигурация сохраняет:

- HTTPS для `mdgt.ru` и `www.mdgt.ru`;
- ACME webroot и автоматическое обновление сертификатов;
- временный self-signed сертификат при первом запуске;
- прокси `/hls/` на `172.17.0.1:6767` для лабораторных трансляций;
- долгий кэш хэшированных Astro-бандлов и недельный кэш статики;
- свежую выдачу HTML без кэширования.

Логи и остановка:

```bash
docker compose logs -f
docker compose down
```

## Где менять контент

- тексты и секции — `src/components/`;
- страницы — `src/pages/`;
- оборудование — `src/components/Equipment.astro`;
- логотипы — `public/img/logos/` и `src/logos.json`;
- прайс — `public/assets/price.pdf` и `public/assets/price.xlsx`;
- цвета и типографика — `src/styles/global.css`.
