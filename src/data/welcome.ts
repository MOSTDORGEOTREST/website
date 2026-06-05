import phys from '@/assets/welcome/scales-2-line.svg'
import mech from '@/assets/welcome/mech.png'
import wave from '@/assets/welcome/wave.svg'
import snow from '@/assets/welcome/snowflake.svg'
import rock from '@/assets/welcome/rock.svg'
import chem from '@/assets/welcome/bxs-flask.svg'

export interface LabCategory {
	icon: string
	label: string
}

/** 6 направлений лаборатории (контент из секции Welcome). */
export const labCategories: LabCategory[] = [
	{ icon: phys, label: 'Определение физических свойств грунтов' },
	{ icon: mech, label: 'Определение механических свойств грунтов' },
	{ icon: wave, label: 'Динамическая лаборатория' },
	{ icon: snow, label: 'Мерзлотная лаборатория' },
	{ icon: rock, label: 'Скальная лаборатория' },
	{ icon: chem, label: 'Химическая лаборатория' },
]

export const heroTitleLines = ['Лидер в лабораторных', 'испытаниях грунтов']

export const heroSubtitle =
	'В нашей лаборатории для выполнения испытаний грунтов мы используем самое передовое оборудование отечественных и зарубежных производителей'
