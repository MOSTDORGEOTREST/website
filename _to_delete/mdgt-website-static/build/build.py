# -*- coding: utf-8 -*-
import json, re, os

import pathlib
BASE = pathlib.Path(__file__).parent
T = open(BASE/'template.html', encoding='utf-8').read()
imgs = json.load(open(BASE/'data/imgs.json'))
logos = json.load(open(BASE/'data/logos.json'))

def libs(html):
    html = html.replace('{{FONTS_CSS}}', open(BASE/'data/fonts.css', encoding='utf-8').read())
    html = html.replace('{{GSAP_CORE}}', open(BASE/'vendor/gsap.min.js', encoding='utf-8').read())
    html = html.replace('{{GSAP_ST}}', open(BASE/'vendor/ScrollTrigger.min.js', encoding='utf-8').read())
    html = html.replace('{{LENIS}}', open(BASE/'vendor/lenis.min.js', encoding='utf-8').read())
    return html

def logos_rows(html):
    items = list(logos.values())
    def chip(v):
        name = os.path.splitext(v['name'])[0].replace('_',' ').replace('-',' ')
        return f'<span class="logo-chip"><img src="{v["uri"]}" alt="{name}" loading="lazy"></span>'
    html = html.replace('{{LOGOS_ROW_1}}', ''.join(chip(v) for v in items[:19]))
    html = html.replace('{{LOGOS_ROW_2}}', ''.join(chip(v) for v in items[19:]))
    return html

SECS = ['LOADER','HUD','HERO','DESCENT','STRIP1','EQUIP','STRIP2','OBJECTS','TESTS','CALC','EDU','CLIENTS']

def get_sec(name):
    m = re.search(r'<!--SEC:%s-->\n?(.*?)\n?<!--/SEC:%s-->' % (name,name), T, re.S)
    return m.group(1)

def drop_secs(html, names):
    for n in names:
        html = re.sub(r'<!--SEC:%s-->\n?.*?\n?<!--/SEC:%s-->' % (n,n), '', html, flags=re.S)
    return html

def unwrap_markers(html):
    return re.sub(r'<!--/?SEC:\w+-->\n?', '', html)

PAGEHEAD = '''
<section class="page-head" aria-label="Заголовок страницы">
  <div class="wrap">
    <a class="ph-back" href="index.html">&larr;&nbsp;На главную</a>
    <span class="d-eyebrow" style="color:var(--amber-d)">{EYEBROW}</span>
    <h1 class="ph-title">{TITLE}</h1>
    <p class="sec-sub">{SUB}</p>
  </div>
</section>
'''

PAGEHEAD_CSS = '''
<style>
.page-head{padding:clamp(150px,22vh,220px) 0 clamp(20px,4vh,40px); background:var(--paper); color:var(--ink-d)}
.ph-back{display:block; width:max-content; font-family:var(--font-m); font-size:12px; letter-spacing:.12em; color:var(--mut-d); margin-bottom:26px; transition:color .25s}
.ph-back:hover{color:var(--amber-d)}
.foot-row{padding-right:0}
.page-head + section{padding-top:clamp(24px,5vh,50px)!important}
.ph-title{font-family:var(--font-d); font-weight:800; font-size:clamp(32px,5.6vw,76px); line-height:1.04; margin:14px 0 16px; letter-spacing:-.01em}
.soft-grid{display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:14px}
.soft-card{border:1.5px dashed rgba(166,106,20,.4); border-radius:22px; padding:clamp(26px,3vw,42px); background:var(--paper-card); min-height:230px; display:flex; flex-direction:column; gap:12px; transition:border-color .3s,transform .3s var(--ease)}
.soft-card:hover{border-color:var(--amber-d); transform:translateY(-4px)}
.soft-card .sc-icon{width:52px; height:52px; border-radius:14px; display:grid; place-items:center; background:linear-gradient(145deg,rgba(232,163,61,.18),rgba(232,163,61,.04))}
.soft-card .sc-icon svg{width:26px; height:26px; stroke:var(--amber-d)}
.soft-card h3{font-family:var(--font-d); font-weight:600; font-size:19px}
.soft-card p{font-size:14px; color:var(--mut-d)}
.soft-badge{align-self:flex-start; font-family:var(--font-m); font-size:10px; letter-spacing:.24em; text-transform:uppercase; color:var(--amber-d); border:1px solid rgba(166,106,20,.4); border-radius:99px; padding:6px 13px; margin-top:auto}
</style>
'''

SOFT_SECTION = '''
<section id="soft" class="light-sec" style="padding:clamp(30px,6vh,60px) 0 clamp(90px,14vh,150px); background:var(--paper); color:var(--ink-d)">
  <div class="wrap">
    <div class="soft-grid">
      <article class="soft-card">
        <span class="sc-icon"><svg viewBox="0 0 24 24" fill="none" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 17l6-6-6-6M12 19h8"/></svg></span>
        <h3>Обработка испытаний</h3>
        <p>Программные инструменты лаборатории для обработки результатов испытаний грунтов.</p>
        <span class="soft-badge">Скоро</span>
      </article>
      <article class="soft-card">
        <span class="sc-icon"><svg viewBox="0 0 24 24" fill="none" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a7 7 0 0 1 7 7c0 3-2 4.5-2 7H7c0-2.5-2-4-2-7a7 7 0 0 1 7-7zM9 20h6M10 23h4"/></svg></span>
        <h3>ИИ-сервисы для геотехники</h3>
        <p>Прогнозирование характеристик грунтов и поиск аномалий на базе методов машинного обучения.</p>
        <span class="soft-badge">Скоро</span>
      </article>
      <article class="soft-card">
        <span class="sc-icon"><svg viewBox="0 0 24 24" fill="none" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M3 9h18M8 21h8"/></svg></span>
        <h3>Личный кабинет заказчика</h3>
        <p>Статусы испытаний и протоколы онлайн — раздел готовится к публикации.</p>
        <span class="soft-badge">Скоро</span>
      </article>
    </div>
  </div>
</section>
'''

TESTS_PROTO_BTN = '''
    <div class="tests-note" style="margin-top:26px">
      <p>Образцы протоколов, выдаваемых лабораторией, — по каждому виду испытаний.</p>
      <a class="btn btn-ghost" href="https://mdgt.ru" target="_blank" rel="noopener"><span class="btn-fill" aria-hidden="true"></span><span>Образцы протоколов</span></a>
    </div>
'''

def make_page(fname, *, secs_keep, home, body_light, act, pagehead=None, extra_after_main=None, subpage=True, title=None, replaces=()):
    html = T
    html = drop_secs(html, [s for s in SECS if s not in secs_keep])
    html = unwrap_markers(html)
    html = html.replace('{{HOME}}', home)
    for key in ['ACT_EQ','ACT_EDU','ACT_SOFT']:
        html = html.replace('{{%s}}' % key, 'class="active"' if act==key else '')
    if body_light:
        html = html.replace('<body id="body">', '<body id="body" class="on-light">')
    if pagehead:
        block = PAGEHEAD_CSS + PAGEHEAD.format(**pagehead)
        if extra_after_main:
            block += extra_after_main
        html = html.replace('<main>', '<main>\n' + block)
    if subpage:
        html = html.replace('<div class="fin-watermark" aria-hidden="true">−48 м</div>', '')
        html = html.replace('<span class="d-eyebrow">Финал · Забой достигнут</span>', '<span class="d-eyebrow">Контакты</span>')
        html = html.replace(' · 55.87N 37.66E · z = −48.0 м', '')
    if title:
        html = re.sub(r'<title>.*?</title>', '<title>%s</title>' % title, html, count=1)
    for a,b in replaces:
        assert a in html, (fname, a[:40])
        html = html.replace(a, b)
    html = libs(html)
    html = logos_rows(html)
    for k,v in imgs.items():
        html = html.replace('{{%s}}' % k, v)
    # выброс неиспользованных плейсхолдеров логотипов (если CLIENTS вырезан)
    html = html.replace('{{LOGOS_ROW_1}}','').replace('{{LOGOS_ROW_2}}','')
    left = re.findall(r'\{\{(\w+)\}\}', html)
    assert not left, (fname, left[:5])
    out = BASE.parent/'site'
    os.makedirs(out, exist_ok=True)
    open(out/fname, 'w', encoding='utf-8').write(html)
    print(fname, round(len(html)/1e6, 2), 'MB')

# ГЛАВНАЯ: земля + слои + объекты + расчёты + заказчики + финал
make_page('index.html',
    secs_keep=['LOADER','HUD','HERO','DESCENT','STRIP1','OBJECTS','CLIENTS'],
    home='', body_light=False, act=None, subpage=False,
    title='МОСТДОРГЕОТРЕСТ — Геотехническая лаборатория. Испытания грунтов',
    replaces=[('Акт 04 · Наверху','Акт 03 · Наверху'),('Акт 08 · Доверие','Акт 04 · Доверие')])

# ОБОРУДОВАНИЕ + образцы протоколов
eq_page_extra = None
make_page('oborudovanie.html',
    secs_keep=['EQUIP','STRIP2','TESTS','CALC'],
    home='index.html', body_light=True, act='ACT_EQ',
    pagehead={'EYEBROW':'Инструменты и методы','TITLE':'Оборудование лаборатории','SUB':'Парк современного оборудования, виды испытаний и образцы протоколов, выдаваемых лабораторией.'},
    title='Оборудование и испытания — МОСТДОРГЕОТРЕСТ',
    replaces=[('<span class="d-eyebrow">Акт 03 · Инструменты</span>',''),
              ('<h2 id="eq-title">Парк оборудования</h2>','<h2 id="eq-title" class="visually-hidden" style="position:absolute;left:-9999px">Парк оборудования</h2>'),
              ('<p class="sec-sub">Полный штат современного оборудования отечественных и зарубежных производителей — непрерывно обновляется и дополняется новейшими исследовательскими приборами.</p>',''),
              ('Акт 05 · Методы','Методы'),
              ('Акт 06 · Модель','Расчёты и моделирование')])

# КУРСЫ
make_page('kursy.html',
    secs_keep=['EDU'],
    home='index.html', body_light=True, act='ACT_EDU',
    pagehead={'EYEBROW':'Знания','TITLE':'Курсы повышения квалификации','SUB':'Искусственный интеллект в геотехнике, Plaxis и Midas — от ведущих сотрудников лаборатории.'},
    title='Курсы повышения квалификации — МОСТДОРГЕОТРЕСТ',
    replaces=[('<span class="d-eyebrow">Акт 07 · Знания</span>',''),
              ('<h2 id="edu-title">Курсы повышения квалификации</h2>','<h2 id="edu-title" style="position:absolute;left:-9999px">Курсы повышения квалификации</h2>')])

# СОФТЫ (заделка)
make_page('soft.html',
    secs_keep=[],
    home='index.html', body_light=True, act='ACT_SOFT',
    pagehead={'EYEBROW':'Продукты','TITLE':'Наши софты','SUB':'Раздел в разработке — здесь появятся программные продукты лаборатории.'},
    extra_after_main=SOFT_SECTION,
    title='Наши софты — МОСТДОРГЕОТРЕСТ')
EOFMARKER_NOT_USED = 1
