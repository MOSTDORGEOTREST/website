const imgs = import.meta.glob('../assets/calculations/*.png', {
	eager: true,
	query: '?url',
	import: 'default',
}) as Record<string, string>

export const calculationsHeading = 'Расчеты'

export const calculationsDescription =
	'В нашей лаборатории проводятся геотехнические расчеты грунтовых сооружений, таких как насыпи, откосы, грунтовые дамбы и др., методом конечных элементов с использованием нелинейных моделей грунтов, и аналитическими методами. Также в лаборатории проводится проектирование средств инженерной защиты (грунтовые стенки, анкерные системы, геосинтетические конструкции и др.).'

export const calculationsImage = Object.values(imgs)[0]
