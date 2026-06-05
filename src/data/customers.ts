import { pickByToken } from '@/lib/pickAsset'

const logos = import.meta.glob('../assets/customers/*.{png,svg,gif,jpg,jpeg}', {
	eager: true,
	query: '?url',
	import: 'default',
}) as Record<string, string>

export interface CustomerLogo {
	src: string
	alt: string
}

// 36 логотипов заказчиков (порядок сохранён из исходной секции Customers).
const defs: { token: string; alt: string }[] = [
	{ token: 'АВТОДОПРОЕКТ', alt: 'Автодопроект' },
	{ token: 'Аналитический', alt: 'Аналитический Центр МГУ' },
	{ token: 'ГеоИнжСтрой', alt: 'ГеоИнжСтрой' },
	{ token: 'ГеоСпецИзыскания', alt: 'ГеоСпецИзыскания' },
	{ token: 'ИнжГео', alt: 'ИнжГео' },
	{ token: 'ЛЕНМОРНИИПРОЕКТ', alt: 'Ленморниипроект' },
	{ token: 'МАГЭ', alt: 'МАГЭ' },
	{ token: 'ПЕТРАКОМПЛЕКТ', alt: 'Петракомплект' },
	{ token: 'Метрогипртранс', alt: 'Метрогипртранс' },
	{ token: 'Основа', alt: 'НПЦ Основа' },
	{ token: 'ЭНЕРГОИЗЫСКАНИЯ', alt: 'СПБ НИИ Энергоизыскания' },
	{ token: 'Росгеология', alt: 'Росгеология' },
	{ token: 'Мосгеопроект', alt: 'Мосгеопроект' },
	{ token: 'Русская', alt: 'Русская Буровая Компания' },
	{ token: 'mosgiptotrans', alt: 'Мосгипротранс' },
	{ token: 'СпецПроектПуть', alt: 'СпецПроектПуть' },
	{ token: 'ЭНЕРГОТРАНСПРОЕКТ', alt: 'Энерготранспроект' },
	{ token: 'НПЦИЗ', alt: 'НПЦИЗ' },
	{ token: 'РОСЖЕЛДОРПРОЕКТ', alt: 'Росжелдорпроект' },
	{ token: 'ГИПРОСТРОЙМОСТ', alt: 'Гипростроймост' },
	{ token: 'rosatom', alt: 'Росатом ГСПИ' },
	{ token: 'Стройизыскания', alt: 'Стройизыскания' },
	{ token: 'Дельта40', alt: 'Дельта40' },
	{ token: '/ЖЕЛДОРПРОЕКТ.svg', alt: 'Желдорпроект' },
	{ token: 'Геоградстрой', alt: 'Геоградстрой' },
	{ token: 'МосЭнергоПроет', alt: 'МосЭнергоПроект' },
	{ token: 'Нижегордапроект', alt: 'Нижегородапроект' },
	{ token: '/ниц.png', alt: 'НИЦ' },
	{ token: 'Пермапрост', alt: 'Пермапрост-Инжиниринг' },
	{ token: 'Проинжгрупп', alt: 'Проинжгрупп' },
	{ token: 'Сахалин', alt: 'Сахалин ТИСИЗ' },
	{ token: 'СоюзГео', alt: 'СоюзГеоСтройСервис' },
	{ token: 'Тихоокеанская', alt: 'Тихоокеанская инж. компания' },
	{ token: 'ЭУСП', alt: 'ЭУСП' },
	{ token: 'Московская', alt: 'Московская Коллегия Адвокатов' },
	{ token: '/ЦГИ.gif', alt: 'ЦГИ' },
]

export const customerLogos: CustomerLogo[] = defs.map(({ token, alt }) => ({
	src: pickByToken(logos, token),
	alt,
}))
