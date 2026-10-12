/* Прайс-лист из public/assets/price.xlsx — разбирается при сборке сайта.
   Источник один: тот же файл, что скачивают посетители. Обновили price.xlsx (и price.pdf),
   пересобрали сайт — мобильный прайс обновился сам, ничего вручную править не нужно.

   Без зависимостей: xlsx — это zip с XML внутри. Читаем центральный каталог zip,
   распаковываем нужные части через zlib и вытаскиваем значения ячеек (для формул —
   закешированный результат, как его видит Excel / Google Таблицы).

   Разбор структуры листа:
   • «1 Раздел», «1.1 Подраздел» — строка, где заполнена только колонка B и текст начинается с номера;
   • строка-шапка начинается с «Наименование и характеристика работ»: последняя заполненная
     колонка шапки — это колонка итоговой цены этой таблицы (G, а в трёхосных и ASTM-таблицах — F);
     колонка C с «Пункт … СБЦ» — код по справочнику, «Количество» / «Используемый стандарт» — единица и ГОСТ;
   • строка позиции — текст в B и число в колонке цены (или «Цена: 21 000 руб.» в любой ячейке);
   • прочие строки только с B: «Примечание …» — примечание раздела, остальное — подзаголовок группы;
   • после «Научный руководитель…» идёт подпись (пропускаем), после «ДОПОЛНИТЕЛЬНЫЕ ОПЦИИ» — опции. */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { inflateRawSync } from 'node:zlib';

export type PriceItem = { n: string; p: number; d: number; code?: string; unit?: string; std?: string };   /* d — знаков после запятой, как в формате ячейки */
export type PriceGroup = { label?: string; items: PriceItem[] };
export type PriceSub = { title: string; groups: PriceGroup[]; notes: string[] };
export type PriceSection = { num: string; title: string; subs: PriceSub[]; notes: string[] };
export type PriceList = { vat: string; sections: PriceSection[]; notes: string[]; options: string[]; count: number };

function unzip(buf: Buffer): Map<string, Buffer> {
  const out = new Map<string, Buffer>();
  let eocd = -1;
  for (let i = buf.length - 22; i >= Math.max(0, buf.length - 65557); i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) { eocd = i; break; }
  }
  if (eocd < 0) throw new Error('price.xlsx: не найден каталог zip');
  const total = buf.readUInt16LE(eocd + 10);
  let p = buf.readUInt32LE(eocd + 16);
  for (let k = 0; k < total; k++) {
    if (buf.readUInt32LE(p) !== 0x02014b50) throw new Error('price.xlsx: битый каталог zip');
    const method = buf.readUInt16LE(p + 10);
    const csize = buf.readUInt32LE(p + 20);
    const nlen = buf.readUInt16LE(p + 28), xlen = buf.readUInt16LE(p + 30), clen = buf.readUInt16LE(p + 32);
    const local = buf.readUInt32LE(p + 42);
    const name = buf.toString('utf8', p + 46, p + 46 + nlen);
    const lstart = local + 30 + buf.readUInt16LE(local + 26) + buf.readUInt16LE(local + 28);
    const data = buf.subarray(lstart, lstart + csize);
    if (method !== 0 && method !== 8) throw new Error(`price.xlsx: неподдерживаемое сжатие (${method}) у ${name}`);
    out.set(name, method === 8 ? inflateRawSync(data) : Buffer.from(data));
    p += 46 + nlen + xlen + clen;
  }
  return out;
}

const ENT: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" };
const unxml = (s: string) =>
  s.replace(/&(#x[0-9a-f]+|#\d+|\w+);/gi, (m, e) =>
    e[0] === '#' ? String.fromCodePoint(e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : +e.slice(1)) : ENT[e] ?? m);
const tidy = (s: string) => s.replace(/\s+/g, ' ').trim();
/* типографика для названий: «т. п.», «0,6 МПа», «10 мм», «3 шт» не разрываются переносом строки */
const NB = '\u00a0';
const typo = (s: string) =>
  s.replace(/(^|[\s(])([тТ])\.\s+([пдеч])\./g, `$1$2.${NB}$3.`)   /* \b для кириллицы не работает */
   .replace(/(\d)\s+(МПа|кПа|мм|см|м|кг|г|шт|ч|сут|мес|%|руб\.?|₽)(?=[\s,.;:)]|$)/g, `$1${NB}$2`)
   .replace(/\s+(—|–)\s+/g, `${NB}$1 `)
   .replace(/\s(и|или)\s+(т\.\u00a0[пд]\.)/g, ` $1${NB}$2`);   /* «и т. п.» — одним куском */

type Rows = Map<number, Map<string, string | number>>;
type Decs = Map<string, number>;   /* «G45» → сколько знаков после запятой показывает формат ячейки */

function readSheet(files: Map<string, Buffer>): { rows: Rows; decs: Decs } {
  const get = (n: string) => files.get(n)?.toString('utf8') ?? '';
  /* форматы чисел: встроенные 1/3 — целые, 2/4 — копейки; свои — по числу нулей после точки */
  const styles = get('xl/styles.xml');
  const custom = new Map<string, string>();
  for (const m of styles.matchAll(/<numFmt\b[^>]*numFmtId="(\d+)"[^>]*formatCode="([^"]*)"/g)) custom.set(m[1], unxml(m[2]));
  const xfBlock = styles.match(/<cellXfs[^>]*>([\s\S]*?)<\/cellXfs>/)?.[1] ?? '';
  const xfDec = [...xfBlock.matchAll(/<xf\b[^>]*>/g)].map((m) => {
    const id = m[0].match(/numFmtId="(\d+)"/)?.[1] ?? '0';   /* без атрибута — «Общий» */
    if (id === '1' || id === '3') return 0;
    if (id === '2' || id === '4') return 2;
    const code = custom.get(id);
    if (code) return (code.split(';')[0].match(/\.(0+)/)?.[1].length) ?? 0;
    return -1;   /* «Общий» — как получится */
  });
  const shared: string[] = [];
  for (const si of get('xl/sharedStrings.xml').match(/<si>[\s\S]*?<\/si>/g) ?? []) {
    shared.push(unxml((si.match(/<t[^>]*>[\s\S]*?<\/t>/g) ?? []).map((t) => t.replace(/<[^>]+>/g, '')).join('')));
  }
  /* первый лист книги — по порядку в workbook.xml и связям */
  const wb = get('xl/workbook.xml'), rels = get('xl/_rels/workbook.xml.rels');
  const rid = wb.match(/<sheet\b[^>]*r:id="([^"]+)"/)?.[1];
  const target = rid ? rels.match(new RegExp(`Id="${rid}"[^>]*Target="([^"]+)"|Target="([^"]+)"[^>]*Id="${rid}"`)) : null;
  const path = 'xl/' + ((target?.[1] || target?.[2]) ?? 'worksheets/sheet1.xml').replace(/^\/?xl\//, '');
  const xml = get(path);
  const rows: Rows = new Map(), decs: Decs = new Map();
  for (const m of xml.matchAll(/<c r="([A-Z]+)(\d+)"([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
    const [, col, rowS, attrs, inner] = m;
    if (!inner) continue;
    const sIdx = attrs.match(/\bs="(\d+)"/)?.[1];
    if (sIdx !== undefined && xfDec[+sIdx] !== undefined) decs.set(col + rowS, xfDec[+sIdx]);
    const t = attrs.match(/\bt="(\w+)"/)?.[1];
    let val: string | number | undefined;
    if (t === 'inlineStr') val = unxml((inner.match(/<t[^>]*>([\s\S]*?)<\/t>/g) ?? []).map((x) => x.replace(/<[^>]+>/g, '')).join(''));
    else {
      const v = inner.match(/<v>([\s\S]*?)<\/v>/)?.[1];
      if (v === undefined) continue;
      if (t === 's') val = shared[+v];
      else if (t === 'str' || t === 'e') val = unxml(v);
      else if (t === 'b') val = v;
      else val = +v;
    }
    if (val === undefined || val === '') continue;
    const r = +rowS;
    if (!rows.has(r)) rows.set(r, new Map());
    rows.get(r)!.set(col, val);
  }
  return { rows, decs };
}

const colNum = (c: string) => [...c].reduce((n, ch) => n * 26 + ch.charCodeAt(0) - 64, 0);   /* A→1, Z→26, AA→27 */

/* как в Excel: округление по формату ячейки, половина — вверх (с поправкой на двоичную погрешность) */
const roundTo = (x: number, d: number) => { const k = 10 ** d; return Math.round((x + Math.sign(x) * 1e-9) * k) / k; };

export function loadPriceList(file = join(process.cwd(), 'public', 'assets', 'price.xlsx')): PriceList | null {
  let rows: Rows, decs: Decs;
  try { ({ rows, decs } = readSheet(unzip(readFileSync(file)))); }
  catch (e) { console.warn('[price] не удалось прочитать price.xlsx:', (e as Error).message); return null; }

  const list: PriceList = { vat: '', sections: [], notes: [], options: [], count: 0 };
  let sec: PriceSection | null = null, sub: PriceSub | null = null, grp: PriceGroup | null = null;
  let priceCol = '', codeCol = '', unitCol = '', stdCol = '';
  let mode: 'items' | 'sign' | 'options' = 'items';
  let skipNumbering = false;
  const ensureSub = () => {
    if (!sec) { sec = { num: '', title: '', subs: [], notes: [] }; list.sections.push(sec); }
    if (!sub) { sub = { title: '', groups: [], notes: [] }; sec.subs.push(sub); }
    if (!grp) { grp = { items: [] }; sub.groups.push(grp); }
  };

  for (const r of [...rows.keys()].sort((a, b) => a - b)) {
    const row = rows.get(r)!;
    const cols = [...row.keys()].filter((c) => c !== 'A').sort((a, b) => colNum(a) - colNum(b));
    const B = typeof row.get('B') === 'string' ? tidy(row.get('B') as string) : row.get('B');
    if (B === undefined) continue;
    const onlyB = cols.length === 1 && cols[0] === 'B';
    const text = typeof B === 'string' ? B : '';

    if (mode === 'options') { if (text) list.options.push(text); continue; }
    if (/^ДОПОЛНИТЕЛЬНЫЕ ОПЦИИ/i.test(text)) { mode = 'options'; continue; }
    if (/^Научный руководитель/i.test(text)) { mode = 'sign'; continue; }
    if (mode === 'sign') continue;

    if (!list.sections.length && onlyB && !/^\d+\s/.test(text)) { if (/НДС/i.test(text)) list.vat = text; continue; }

    if (text.startsWith('Наименование и характеристика работ')) {
      priceCol = cols[cols.length - 1];
      codeCol = unitCol = stdCol = '';
      for (const c of cols) {
        const h = String(row.get(c));
        if (/Пункт/i.test(h)) codeCol = c;
        else if (/Количество/i.test(h)) unitCol = c;
        else if (/стандарт/i.test(h)) stdCol = c;
      }
      skipNumbering = true;
      if (!(grp && grp.label && !grp.items.length)) grp = null;   /* подпись перед шапкой остаётся за этой таблицей */
      continue;
    }
    if (skipNumbering && typeof B === 'number') { skipNumbering = false; continue; }
    skipNumbering = false;

    if (onlyB) {
      const m = text.match(/^(\d+(?:\.\d+)*)\.?\s+(.+)$/);
      if (m && !m[1].includes('.')) {
        sec = { num: m[1], title: m[2], subs: [], notes: [] }; list.sections.push(sec); sub = null; grp = null;
      } else if (m) {
        if (!sec) { sec = { num: '', title: '', subs: [], notes: [] }; list.sections.push(sec); }
        sub = { title: `${m[1]} ${typo(m[2])}`, groups: [], notes: [] }; sec.subs.push(sub); grp = null;
      } else if (/^Примечани/i.test(text)) {
        const note = typo(text.replace(/^Примечани[ея]\s*[–—-]\s*/i, ''));
        const seen = list.sections.some((s) => s.notes.includes(note) || s.subs.some((u) => u.notes.includes(note)));
        if (!seen) (sub ?? sec)?.notes.push(note);              /* повтор того же примечания в конце листа не дублируем */
      } else if (/скидк/i.test(text) && sec && sub && !sub.groups.some((g) => g.items.length)) {
        sub.notes.push(text);                                   /* «Скидка на испытания … 75%» под заголовком */
      } else if (/[.]$/.test(text)) {
        list.notes.push(text);                                  /* общая оговорка («Указанные скидки включают…») */
      } else if (sec) {
        ensureSub(); grp = { label: text, items: [] }; sub!.groups.push(grp);
      } else list.notes.push(text);
      continue;
    }

    /* позиция */
    let price: number | undefined, dec = -1;
    const pc = priceCol ? row.get(priceCol) : undefined;
    if (typeof pc === 'number') { price = pc; dec = decs.get(priceCol + r) ?? -1; }
    if (price === undefined) {
      for (const c of cols) {
        const v = row.get(c);
        const mm = typeof v === 'string' ? v.match(/Цена:\s*(\d[\d\s\u00a0]*(?:[.,]\d+)?)/) : null;
        if (mm) { price = +mm[1].replace(/[\s\u00a0]/g, '').replace(',', '.'); break; }
      }
    }
    if (!text || price === undefined || !isFinite(price)) continue;
    ensureSub();
    if (dec < 0) dec = Number.isInteger(roundTo(price, 2)) ? 0 : 2;
    const it: PriceItem = { n: typo(text), p: roundTo(price, dec), d: dec };
    const code = codeCol && row.get(codeCol); if (code !== undefined && code !== '' && !/Цена:/i.test(String(code))) it.code = tidy(String(code));
    const unit = unitCol && row.get(unitCol); if (unit) it.unit = tidy(String(unit));
    const std = stdCol && row.get(stdCol); if (std) it.std = tidy(String(std)).replace(/;\s*/g, '; ');
    grp!.items.push(it);
    list.count++;
  }
  list.sections = list.sections.filter((s) => s.subs.some((u) => u.groups.some((g) => g.items.length)));
  /* подписи групп: «Hardening Soil (HS)» без строк, за которой идут «Глинистые грунты» / «Песчаные грунты», —
     родитель, его имя переходит в подписи детей; подпись без строк перед безымянной таблицей
     («Скальные грунты» → шапка → строки) отдаётся этой таблице */
  const SOIL = /^(глинист|песчан|скальн|крупнообломоч|мерзл|талы)\S*\s+грунт/i;
  for (const s of list.sections) for (const u of s.subs) {
    const out: PriceGroup[] = [];
    let parent = '';
    for (let i = 0; i < u.groups.length; i++) {
      const g = u.groups[i], next = u.groups[i + 1];
      if (g.label && !g.items.length) {
        if (next && next.label && next.items.length && SOIL.test(next.label)) parent = g.label;
        else if (next && !next.label) { next.label = g.label; parent = ''; }
        continue;
      }
      if (g.label && parent && SOIL.test(g.label)) g.label = `${parent} · ${g.label}`;
      else if (g.label) parent = '';
      if (g.items.length) out.push(g);
    }
    u.groups = out;
  }
  if (list.count < 20) { console.warn(`[price] в price.xlsx распознано всего ${list.count} позиций — мобильный прайс отключён`); return null; }
  return list;
}
