# МОСТДОРГЕОТРЕСТ — сайт геотехнической лаборатории

Статический мультистраничный сайт (самодостаточные HTML: шрифты, изображения,
GSAP и Lenis зашиты внутрь — внешних зависимостей при деплое нет).

```
mdgt-website/
├── site/                  # сам сайт
│   ├── index.html         # главная: планета → погружение → 6 лабораторий → объекты → заказчики
│   ├── oborudovanie.html  # парк оборудования + испытания и протоколы
│   ├── kursy.html         # курсы (ИИ в геотехнике, Plaxis, Midas)
│   ├── soft.html          # «Наши софты» — заделка под продукты
│   └── assets/            # прайс-лист (xlsx/pdf) для кнопок скачивания в модалке
├── build/                 # сборка страниц из шаблона
│   ├── template.html      # единый шаблон (секции размечены <!--SEC:NAME-->)
│   ├── build.py           # python3 build.py → собирает 4 страницы в ../site/
│   ├── data/              # imgs.json, logos.json (base64), fonts.css (woff2 inline)
│   └── vendor/            # gsap.min.js, ScrollTrigger.min.js, lenis.min.js
├── Dockerfile             # prod-образ (nginx)
├── nginx.conf             # конфиг nginx (gzip, кэш, заголовки)
├── docker-compose.yml     # PROD: nginx
└── docker-compose.dev.yml # DEV: без nginx, с live-монтированием site/
```

## Продакшен (nginx)

```bash
docker compose up -d --build
# сайт на http://localhost  (другой порт: PORT=8080 docker compose up -d --build)
```

## Разработка (без nginx)

```bash
docker compose -f docker-compose.dev.yml up
# сайт на http://localhost:8080, папка site/ примонтирована — правки видны по F5
```

## Обновление контента

- Прайс-лист: замените `site/assets/price.pdf` и `site/assets/price.xlsx`
  (онлайн-таблица в модалке тянется из опубликованного Google Sheets — ссылка в html).
- Страницы собираются из шаблона: правьте `build/template.html`
  и запускайте `python3 build/build.py` (нужен только Python 3, без зависимостей).
  Контент секций, тексты и цвета слоёв — всё в шаблоне.
