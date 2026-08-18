# МОСТДОРГЕОТРЕСТ — сайт геотехнической лаборатории

Мультистраничный сайт на **Astro** (статическая генерация, ноль фреймворк-рантайма
в браузере). Анимации — GSAP + ScrollTrigger, плавный скролл — Lenis, планета и
погружение — собственный WebGL-шейдер. Прелоадер с дешифровкой букв инлайновый:
стартует на первом кадре и показывает реальный прогресс загрузки страницы.

## Структура

```
mdgt-website/
├── src/
│   ├── pages/             # роуты: index, oborudovanie, kursy, soft
│   ├── layouts/Base.astro # общий каркас: head, Nav, модалка прайса, main.js
│   ├── components/        # секции: Hero, Descent (слои), Objects, Equipment,
│   │                      # Tests, Calc, Edu, Clients, Contacts, Loader, Hud…
│   ├── scripts/main.js    # вся анимационная логика (gsap, lenis, шейдер)
│   ├── styles/            # global.css + fonts.css
│   └── logos.json         # список логотипов заказчиков
├── public/
│   ├── img/               # devices/, objects/, logos/, mdgt.png
│   ├── fonts/             # woff2 (Unbounded, Inter, JetBrains Mono)
│   └── assets/            # прайс-лист (price.pdf, price.xlsx)
├── Dockerfile             # prod: сборка в node → раздача nginx
├── nginx.conf             # gzip, immutable-кэш бандлов, no-cache html
├── docker-compose.yml     # PROD
└── docker-compose.dev.yml # DEV: astro dev с HMR, без nginx
```

## Запуск локально (нужен Node.js ≥ 18)

```bash
npm install
npm run dev        # http://localhost:4321, горячая перезагрузка
npm run build      # прод-сборка в dist/
npm run preview    # посмотреть прод-сборку локально
```

## Запуск через Docker

Продакшен (nginx, сборка внутри контейнера — Node на хосте не нужен):

```bash
docker compose up -d --build
# сайт: http://localhost   (другой порт: PORT=8080 docker compose up -d --build)
```

Разработка (без nginx, dev-сервер Astro с мгновенным HMR):

```bash
docker compose -f docker-compose.dev.yml up
# сайт: http://localhost:4321 — правки src/ и public/ видны сразу
```

## Как редактировать

- **Тексты и секции** — компоненты в `src/components/` (обычный HTML внутри .astro).
- **Слои грунта** (цвета, тексты, типы) — `src/components/Descent.astro`;
  анимации слоёв и частицы — в `src/scripts/main.js` (блок «живые анимации слоёв»).
- **Оборудование** — карточки в `src/components/Equipment.astro`.
- **Логотипы заказчиков** — файлы в `public/img/logos/` + список `src/logos.json`.
- **Прайс-лист** — файлы `public/assets/price.pdf|xlsx`; онлайн-таблица в модалке —
  ссылка на Google Sheets в `src/components/PriceModal.astro`.
- **Софты** — карточки-заделки в `src/components/SoftGrid.astro`.
- **Цвета/типографика** — CSS-переменные в начале `src/styles/global.css`.

## Замечания

- Страницы лёгкие (~30 КБ html), ассеты грузятся параллельно; JS-бандл
  (gsap+lenis+логика) один на все страницы, ~59 КБ gzip, кэшируется навсегда.
- `prefers-reduced-motion` уважается: анимации отключаются, контент статичен.
- Прелоадер есть только на главной; глубиномер — тоже.
