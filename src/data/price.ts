const pdfFiles = import.meta.glob('../assets/price/*.pdf', {
	eager: true,
	query: '?url',
	import: 'default',
}) as Record<string, string>

const xlsxFiles = import.meta.glob('../assets/price/*.xlsx', {
	eager: true,
	query: '?url',
	import: 'default',
}) as Record<string, string>

export const pricePdf = Object.values(pdfFiles)[0]
export const priceXlsx = Object.values(xlsxFiles)[0]

/** Опубликованная таблица Google Sheets с прайс-листом. */
export const priceSheetUrl =
	'https://docs.google.com/spreadsheets/d/e/2PACX-1vQLoYEIufBCl7SBZYYdec5lZx_pvtEfxdqjGOaFWyKiJ33-ur4aRtuyc1TO3CG2IQ/pubhtml?gid=1270024983&single=true&widget=true&headers=false'
