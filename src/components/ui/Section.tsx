import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Reveal } from './motion'

export function Section({
	id,
	className,
	children,
}: {
	id?: string
	className?: string
	children: ReactNode
}) {
	return (
		<section id={id} className={cn('relative scroll-mt-24', className)}>
			{children}
		</section>
	)
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
	return (
		<span
			className={cn(
				'inline-flex items-center gap-2 rounded-full border border-brand-600/20 bg-white/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-brand-700 backdrop-blur',
				className
			)}
		>
			<span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-brand-500 to-teal-500" />
			{children}
		</span>
	)
}

export function SectionHeading({
	eyebrow,
	title,
	subtitle,
	align = 'left',
	className,
}: {
	eyebrow?: ReactNode
	title: ReactNode
	subtitle?: ReactNode
	align?: 'left' | 'center'
	className?: string
}) {
	return (
		<div className={cn('flex flex-col gap-5', align === 'center' && 'items-center text-center', className)}>
			{eyebrow && (
				<Reveal>
					<Eyebrow>{eyebrow}</Eyebrow>
				</Reveal>
			)}
			<Reveal delay={0.05}>
				<h2 className="text-3xl font-semibold sm:text-4xl lg:text-[2.9rem]">{title}</h2>
			</Reveal>
			{subtitle && (
				<Reveal delay={0.1}>
					<p className={cn('max-w-2xl text-base leading-relaxed text-muted sm:text-lg', align === 'center' && 'mx-auto')}>
						{subtitle}
					</p>
				</Reveal>
			)}
		</div>
	)
}
