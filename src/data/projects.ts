// Изображения объектов лежат в @/assets/projects. Загружаем все и выбираем
// нужные по уникальному фрагменту имени (имена с кириллицей сохранены как есть).
const imgs = import.meta.glob('../assets/projects/*.{jpg,jpeg,png}', {
	eager: true,
	query: '?url',
	import: 'default',
}) as Record<string, string>

function pick(token: string, mobile = false): string {
	const entry = Object.entries(imgs).find(([path]) => {
		const name = path.split('/').pop() ?? ''
		const isMob = name.includes('_моб')
		return name.includes(token) && (mobile ? isMob : !isMob)
	})
	if (!entry) throw new Error(`project image not found: ${token}${mobile ? ' (mobile)' : ''}`)
	return entry[1]
}

export interface Project {
	title: string
	credit: string
	src: string
	srcMobile: string
}

/** 9 объектов из секции Objects (порядок и подписи сохранены дословно). */
export const projects: Project[] = [
	{ title: 'Порт в Усть-Луге', credit: 'Фото: www.gazprom.ru', src: pick('Усть-луга'), srcMobile: pick('Усть-луга') },
	{ title: 'Аэропорт Шереметьево', credit: '', src: pick('Шереметьево'), srcMobile: pick('Шереметьево', true) },
	{ title: 'Большой Москворецкий мост', credit: 'Фото: www.msmap.ru', src: pick('Москворецкий'), srcMobile: pick('Москворецкий', true) },
	{ title: 'Бизнес-центр Сколково', credit: 'Фото: Школа управления «Сколково»', src: pick('Сколково'), srcMobile: pick('Сколково', true) },
	{ title: 'Крымский мост', credit: '', src: pick('Крымский'), srcMobile: pick('Крымский', true) },
	{ title: 'Дом правительства Российской Федерации', credit: 'Фото: Риа Новости | Екатерина Чеснокова', src: pick('правительства'), srcMobile: pick('правительства', true) },
	{ title: 'Живописный мост', credit: 'Фото: М. Денисова. Mos.ru', src: pick('Живописный'), srcMobile: pick('Живописный', true) },
	{ title: 'Большой ледовый дворец', credit: '', src: pick('ледовый'), srcMobile: pick('ледовый', true) },
	{ title: 'Мост через Каму', credit: '', src: pick('Каму'), srcMobile: pick('Каму') },
]
