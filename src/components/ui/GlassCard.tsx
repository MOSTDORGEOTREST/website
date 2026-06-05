import { motion, type HTMLMotionProps } from 'motion/react'
import { cn } from '@/lib/cn'

interface GlassCardProps extends HTMLMotionProps<'div'> {
	hover?: boolean
	tone?: 'light' | 'dark'
}

/** Карточка из матового стекла с мягкой глубиной и (опц.) hover-подъёмом. */
export function GlassCard({ className, hover = false, tone = 'light', children, ...rest }: GlassCardProps) {
	return (
		<motion.div
			className={cn(
				tone === 'dark' ? 'glass-dark' : 'glass',
				'rounded-3xl',
				hover && 'transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_-24px_rgba(13,148,136,0.5)]',
				className
			)}
			{...rest}
		>
			{children}
		</motion.div>
	)
}
