# Монохромные «чернильные» версии логотипов: один цвет, плотность = насколько пиксель тёмный (по яркости).
# Белые детали становятся прозрачными (как негативное пространство), цветные — сплошной краской.
# Запуск из корня проекта после добавления/замены логотипа в public/img/logos/ и src/logos.json:
#   python3 scripts/logo-ink.py
# Результат — public/img/logos/ink/ (их и показывает блок «Нам доверяют»). Нужен Pillow.
import json, os, re, sys
from PIL import Image
ROOT = sys.argv[1] if len(sys.argv) > 1 else os.getcwd()
INK = (0x22, 0x1A, 0x0E)
src = os.path.join(ROOT, 'public/img/logos')
dst = os.path.join(src, 'ink')
os.makedirs(dst, exist_ok=True)
logos = json.load(open(os.path.join(ROOT, 'src/logos.json')))
for l in logos:
    name = l['file'].split('/')[-1]
    p = os.path.join(src, name)
    if name.endswith('.svg'):
        s = open(p, encoding='utf8').read()
        s = re.sub(r'fill="#[0-9A-Fa-f]{3,6}"', 'fill="#221A0E"', s)
        open(os.path.join(dst, name), 'w', encoding='utf8').write(s)
        continue
    im = Image.open(p).convert('RGBA')
    W, H = im.size
    px = im.load()
    out = Image.new('RGBA', (W, H), INK + (0,))
    op = out.load()
    for y in range(H):
        for x in range(W):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            L = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255.0
            ink = (a / 255.0) * min(1.0, (1.0 - L) * 1.35)
            op[x, y] = INK + (int(round(ink * 255)),)
    out.save(os.path.join(dst, name), optimize=True)
print('ok', len(logos))
