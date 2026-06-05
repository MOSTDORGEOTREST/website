import type { CSSProperties, ReactNode } from 'react'
import { cn } from '@/lib/cn'

/**
 * Бесконечная горизонтальная лента. Дублирует контент и сдвигает трек на -50%
 * (seamless благодаря trailing-gap у каждой группы). Пауза при наведении.
 */
export function Marquee({
	children,
	duration = 50,
	gap = '2.75rem',
	reverse = false,
	className,
}: {
	children: ReactNode
	duration?: number
	gap?: string
	reverse?: boolean
	className?: string
}) {
	const groupStyle: CSSProperties = { gap, paddingRight: gap }
	return (
		<div className={cn('group relative flex overflow-hidden mask-fade-x', className)}>
			<div
				className="flex w-max animate-marquee group-hover:[animation-play-state:paused]"
				style={
					{
						['--marquee-duration' as string]: `${duration}s`,
						animationDirection: reverse ? 'reverse' : undefined,
					} as CSSProperties
				}
			>
				<div className="flex shrink-0 items-center" style={groupStyle}>
					{children}
				</div>
				<div className="flex shrink-0 items-center" aria-hidden style={groupStyle}>
					{children}
				</div>
			</div>
		</div>
	)
}
