/* /price.json — прайс-лист для мобильного окна, собирается из public/assets/price.xlsx при сборке */
import type { APIRoute } from 'astro';
import { loadPriceList } from '../lib/price-xlsx';

export const GET: APIRoute = () =>
  new Response(JSON.stringify(loadPriceList() ?? { vat: '', sections: [], notes: [], options: [], count: 0 }), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
