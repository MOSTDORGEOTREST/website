# МОСТДОРГЕОТРЕСТ — сайт геотехнической лаборатории

Статический сайт на Astro 5. Собирается в `dist/`, в production раздаётся nginx
с HTTPS, автоматическим обновлением сертификатов и проксированием HLS-трансляций.
Дизайн-система описана в `DESIGN-SYSTEM.md`.

## Структура проекта

```text
.
├── src/
│   ├── pages/             # /, /oborudovanie/, /kursy/, /soft/, /dokumenty/, price.json
│   ├── lib/price-xlsx.ts  # разбор price.xlsx при сборке (мобильный прайс)
├── scripts/logo-ink.py    # одноцветные версии логотипов заказчиков
│   ├── layouts/Base.astro # каркас: head, nav, прайс-модалка, скрипты
│   ├── components/        # секции-«акты» главной и модули подстраниц
│   ├── scripts/main.js    # GSAP + ScrollTrigger, Lenis, WebGL-планета, reveal
│   └── styles/            # global.css (токены и все стили), fonts.css
├── public/
│   ├── img/               # оборудование, объекты, логотипы, продукты
│   ├── fonts/             # локальные WOFF2
│   └── assets/
│       ├── docs/          # разрешительные документы (PDF) + prev/ (превью WebP)
│       ├── edu/           # программы курсов (PDF)
│       ├── protocols/     # образцы протоколов испытаний (PDF)
│       └── price.pdf/xlsx # прайс-лист
├── Dockerfile.web         # production-сборка Astro + nginx
├── docker-compose.yml     # production + ACME
├── docker-compose.dev.yml # dev-сервер Astro с HMR
├── nginx.conf, server/    # nginx, HTTPS, кэш, HLS
├── acme/, cert/           # сертификаты
└── DESIGN-SYSTEM.md       # дизайн-система
```

## Страницы и секции

| Страница | Секции (`src/components`) |
|---|---|
| `/` | Loader · Hud · Hero · Descent · StripTests · Objects · Clients · Live · Docs · Contacts |
| `/oborudovanie/` | PageHead · Equipment · StripObjects · Tests · Calc · Contacts |
| `/kursy/` | PageHead · Edu · Contacts |
| `/soft/` | PageHead · SoftGrid · Contacts |

## Локальная разработка

Нужен Node.js 18+.

```bash
npm ci
npm run dev        # http://localhost:4321
npm run build && npm run preview
```

Через Docker: `docker compose -f docker-compose.dev.yml up`.

## Production

```bash
docker compose up -d --build
```

Порты по умолчанию 80/443 (`HTTP_PORT=8080 HTTPS_PORT=8443 docker compose up -d --build` — чтобы переопределить).
Конфигурация сохраняет HTTPS для `mdgt.ru`/`www.mdgt.ru`, ACME webroot, прокси `/hls/` на
`172.17.0.1:6767`, долгий кэш `/_astro/`, недельный кэш `/assets/`, `/img/`, `/fonts/` и HTML без кэша.

Логи и остановка: `docker compose logs -f`, `docker compose down`.

## Где менять контент

- тексты секций — `src/components/*.astro`;
- оборудование — `src/components/Equipment.astro`, фото — `public/img/devices/`;
- логотипы клиентов — `public/img/logos/` и `src/logos.json` (`w`/`h` — размер содержимого без пустых полей:
  по ним считается оптический размер знака; новый логотип лучше сразу обрезать по содержимому).
  На сайте показываются одноцветные версии из `public/img/logos/ink/` — после добавления или замены
  логотипа их нужно пересоздать: `python3 scripts/logo-ink.py` (нужен Pillow);
- разрешительные документы (страница `/dokumenty/`) — массив `docs` в `src/components/Docs.astro`, файлы — `public/assets/docs/`;
  превью первой страницы: `pdftoppm -f 1 -l 1 -r 110 -png файл.pdf` → WebP 1200px (`{id}.webp`) и 560px (`{id}-t.webp`) в `public/assets/docs/prev/`;
- курсы — `src/components/Edu.astro`, программа — `public/assets/edu/`;
- публикации и продукты — `src/components/SoftGrid.astro`;
- прайс — `public/assets/price.pdf`, `public/assets/price.xlsx` и ссылка на Google-таблицу в `src/components/PriceModal.astro`.
  На компьютере окно показывает Google-таблицу, на телефоне и планшете — собственный список с поиском,
  который собирается при сборке из `price.xlsx` (`src/lib/price-xlsx.ts` → `/price.json`). Чтобы обновить
  цены: заменить `price.xlsx` и `price.pdf` (и Google-таблицу) и пересобрать сайт. Если структура
  листа изменится настолько, что позиций не найдётся, сборка напишет предупреждение `[price]`;
- цвета и типографика — переменные в начале `src/styles/global.css`;
- анимации — `src/scripts/main.js`.

Сроки действия документов считаются в браузере по полю `until`: за 90 дней до истечения карточка
подсвечивается янтарным, после — красным. При замене документа обновите PDF, превью и дату.
