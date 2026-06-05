import { Phone } from '@/components/ui/icons'
import { phones } from '@/data/nav'

/** Плавающая кнопка звонка (только на мобильных). */
export function FloatCall() {
	return (
		<a
			href={phones[0].href}
			title="Позвонить нам"
			className="group fixed bottom-6 left-6 z-40 grid size-14 place-items-center rounded-full bg-[linear-gradient(135deg,var(--color-brand-600),var(--color-teal-500))] text-white shadow-[0_16px_40px_-14px_rgba(13,148,136,0.85)] lg:hidden"
		>
			<span className="absolute inset-0 animate-pulse-glow rounded-full ring-2 ring-brand-500/40" />
			<Phone className="size-6" />
		</a>
	)
}
