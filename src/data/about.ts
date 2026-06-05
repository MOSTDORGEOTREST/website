import { pickByToken } from '@/lib/pickAsset'

import wille from '@/assets/devices/Wille.png'
import resonant from '@/assets/devices/Resonant.png'
import shearRock from '@/assets/devices/Shear_rock.png'
import willeRock from '@/assets/devices/Wille_rock.png'
import stamp from '@/assets/devices/Stamp.png'
import fridge from '@/assets/devices/Fridge.png'
import trixal from '@/assets/devices/Trixal.png'
import odometr from '@/assets/devices/Odometr.png'
import mosgosexpert from '@/assets/docs/mosgosexpert.pdf'

const aoFiles = import.meta.glob('../assets/docs/AO_docs/*.pdf', {
	eager: true,
	query: '?url',
	import: 'default',
}) as Record<string, string>

const oooFiles = import.meta.glob('../assets/docs/OOO_docs/*.pdf', {
	eager: true,
	query: '?url',
	import: 'default',
}) as Record<string, string>

export const aboutHeading = 'О лаборатории'

export const aboutParagraphs: string[] = [
	'Геотехническая лаборатория АО «МОСТДОРГЕОТРЕСТ» была создана в 2008 году и за время своего существования вышла на одно из ведущих мест среди организаций, занимающихся лабораторным анализом грунтов и грунтовых вод.',
	'Наша геотехническая лаборатория предлагает высококвалифицированные услуги по определению физико-механических свойств грунтов, анализу химического состава грунтов и грунтовых вод, определению их свойств в целях классификации согласно международным стандартам ASTM и отечественным ГОСТам.',
	'Геотехническая лаборатория оснащена высокоточным аналитическим оборудованием отечественного и зарубежного производства, в том числе pH-метры, системы капиллярного электрофореза, установки трехосного сжатия, вибростабилометры и др.',
	'Геотехническая лаборатория АО «МОСТДОРГЕОТРЕСТ» аккредитована в Системе аккредитации испытательных лабораторий (центров) согласно ГОСТ ISO/IEC 17025-2019. Используемая в работе система менеджмента качества обеспечивает контроль за проведением анализа на каждой стадии, что гарантирует высокую точность измерений.',
	'Услуги, которые предоставляет геологическая лаборатория, включают в себя инженерно-геологические, геотехнические лабораторные исследования. Благодаря совершенному техническому оснащению, высочайшему уровню ответственности, квалификации и опыту специалистов лаборатория способна проводить исследования любой сложности.',
]

export const tour3dHref = '/3d/output-3/index.html'
export const tour3dLabel = '3D-тур по лаборатории'

export interface EquipmentBlock {
	title: string
	text: string
	images: [string, string]
}

export const equipmentBlocks: EquipmentBlock[] = [
	{
		title: 'Определение динамических характеристик грунтов',
		text: 'Лаборатория оснащена приборами для определения динамических характеристик: динамический стабилометр Wille Geotechnik и резонансная колонка НПП Геотек. Данное оборудование позволяет получать входные параметры для моделей HSS, коэффициенты демпфирования и т.д.',
		images: [wille, resonant],
	},
	{
		title: 'Определение характеристик скальных грунтов',
		text: 'Для испытаний скальных грунтов лаборатория имеет прибор трехосного сжатия Wille Geotechnik, срезовой прибор НПП Геотек, несколько прессов ПСН – 0.16.10 и др.',
		images: [shearRock, willeRock],
	},
	{
		title: 'Определение характеристик мерзлых грунтов',
		text: 'В нашем расположении 3 большие морозильные камеры с большим диапазоном отрицательных рабочих температур. Камеры имеют калибровку «Ростест». Одна камера для хранения и распиловки кернов, две другие для проведения испытаний. Данное оборудование помогает получить все необходимые ГОСТом 12248-2010 характеристики мерзлых грунтов.',
		images: [stamp, fridge],
	},
	{
		title: 'Определение механических характеристик грунтов',
		text: 'Обеспечение входными параметрами модели HS, SS, SSC, MC.',
		images: [trixal, odometr],
	},
]

export interface DocItem {
	label: string
	href: string
}

export interface DocCard {
	title: string
	subtitle: string
	items: DocItem[]
}

export const documentCards: DocCard[] = [
	{
		title: 'Разрешительные документы',
		subtitle: 'Акционерное общество МОСТДОРГЕОТРЕСТ',
		items: [
			{ label: 'Аттестат аккредитации ФСА Росаккредитация', href: pickByToken(aoFiles, 'Росаккредитация') },
			{ label: 'Выписка из реестра ФСА Росаккредитация', href: pickByToken(aoFiles, 'РОСС') },
			{ label: 'Аттестат аккредитации АО “МОССТРОЙСЕРТИФИКАЦИЯ”', href: pickByToken(aoFiles, 'Мосстройсертификация') },
			{ label: 'Выписка из Реестра членов СРО', href: pickByToken(aoFiles, 'СРО') },
			{ label: 'Евро-Регистр Сертификат Соответствия ГОСТ Р ИСО 9001-2015', href: pickByToken(aoFiles, 'Сертификат') },
		],
	},
	{
		title: 'Разрешительные документы',
		subtitle: 'Стуктурное подразделение ООО МОСТДОРГЕОТРЕСТ',
		items: [
			{ label: 'Выписка из Реестра членов СРО', href: pickByToken(oooFiles, 'СРО') },
			{ label: 'Аттестат аккредитации АО “НТЦ “Промышленная безопасность”', href: pickByToken(oooFiles, 'Промышленная') },
			{ label: 'Аттестат аккредитации АО “МОССТРОЙСЕРТИФИКАЦИЯ”', href: pickByToken(oooFiles, 'Мосстройсертификация') },
			{ label: 'Евро-Регистр Сертификат Соответствия ГОСТ Р ИСО 9001-2015', href: pickByToken(oooFiles, 'Сертификат') },
		],
	},
]

export const expertCouncil = {
	title: 'Положение',
	subtitle: 'об Экспертном Совете Московской государственной экспертизы',
	href: mosgosexpert,
}
