export interface NavLink {
	label: string
	href: string
}

/** Пункты меню (якоря совпадают с id секций). */
export const navLinks: NavLink[] = [
	{ label: 'Главная', href: '#welcome' },
	{ label: 'О лаборатории', href: '#about' },
	{ label: 'Испытания грунтов', href: '#tests' },
	{ label: 'Расчеты', href: '#Calculations' },
	{ label: 'Контакты', href: '#contacts' },
]

export const brandTitle = {
	line1: 'ГЕОТЕХНИЧЕСКАЯ ЛАБОРАТОРИЯ',
	line2: 'МОСТДОРГЕОТРЕСТ',
}

export interface Phone {
	display: string
	href: string
}

export const phones: Phone[] = [
	{ display: '+7 495 656 69 10', href: 'tel:+74956566910' },
	{ display: '+7 495 656 65 80', href: 'tel:+74956566580' },
	{ display: '+7 495 656 68 59', href: 'tel:+74956566859' },
]
