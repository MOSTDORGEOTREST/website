import { pickByToken } from '@/lib/pickAsset'

const docs = import.meta.glob('../assets/docs/*.pdf', {
	eager: true,
	query: '?url',
	import: 'default',
}) as Record<string, string>

export const politicaHref = pickByToken(docs, 'Политика')
export const soglasieHref = pickByToken(docs, 'Согласие')

export const politicaLabel = 'Политика по обработке персональных данных'
export const soglasieLabel = 'Согласие на обработку персональных данных'
