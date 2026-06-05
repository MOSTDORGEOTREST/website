import { cn } from '@/lib/cn'

/**
 * Анимированный градиент-меш (зелёный→бирюза) — фон для hero и акцентных секций.
 * Движение блобов отключается при prefers-reduced-motion (см. index.css).
 */
export function GradientMesh({
	className,
	intensity = 'normal',
}: {
	className?: string
	intensity?: 'soft' | 'normal' | 'strong'
}) {
	const opacity =
		intensity === 'strong' ? 'opacity-90' : intensity === 'soft' ? 'opacity-50' : 'opacity-70'
	return (
		<div
			aria-hidden
			className={cn('pointer-events-none absolute inset-0 overflow-hidden', opacity, className)}
		>
			<div className="blob-1 absolute -left-24 -top-40 h-[44rem] w-[44rem] rounded-full bg-brand-400/45 blur-[120px]" />
			<div className="blob-2 absolute -right-32 top-10 h-[40rem] w-[40rem] rounded-full bg-teal-400/45 blur-[120px]" />
			<div className="blob-3 absolute -bottom-48 left-1/3 h-[38rem] w-[38rem] rounded-full bg-emerald-400/40 blur-[120px]" />
			<div className="absolute right-1/4 top-1/3 h-[22rem] w-[22rem] rounded-full bg-cyan-400/25 blur-[100px] blob-1" />
		</div>
	)
}

/** Тонкая сетка-паттерн поверх фона для «технологичности». */
export function GridOverlay({ className }: { className?: string }) {
	return (
		<div
			aria-hidden
			className={cn(
				'pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]',
				className
			)}
			style={{
				backgroundImage:
					'linear-gradient(rgba(10,127,11,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(10,127,11,0.07) 1px, transparent 1px)',
				backgroundSize: '54px 54px',
			}}
		/>
	)
}
