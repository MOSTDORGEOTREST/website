import { motion, type HTMLMotionProps } from 'motion/react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Variant = 'solid' | 'outline' | 'ghost'

const base =
	'group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-7 py-3.5 text-[0.95rem] font-semibold tracking-wide transition-all duration-300 will-change-transform'

const variants: Record<Variant, string> = {
	solid:
		'text-white shadow-[0_18px_44px_-16px_rgba(13,148,136,0.75)] bg-[linear-gradient(100deg,var(--color-brand-600),var(--color-emerald-500)_55%,var(--color-teal-500))] hover:-translate-y-0.5',
	outline:
		'text-brand-700 border border-brand-600/35 bg-white/60 backdrop-blur hover:border-brand-600/60 hover:-translate-y-0.5',
	ghost: 'text-brand-700 hover:bg-brand-600/10',
}

function Inner({ children }: { children: ReactNode }) {
	return (
		<>
			<span
				aria-hidden
				className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.45),transparent)] transition-transform duration-700 group-hover:translate-x-full"
			/>
			<span className="relative z-10 inline-flex items-center gap-2">{children}</span>
		</>
	)
}

export function GradientButton({
	variant = 'solid',
	className,
	children,
	...rest
}: { variant?: Variant; children?: ReactNode } & Omit<HTMLMotionProps<'button'>, 'children'>) {
	return (
		<motion.button whileTap={{ scale: 0.97 }} className={cn(base, variants[variant], className)} {...rest}>
			<Inner>{children}</Inner>
		</motion.button>
	)
}

export function GradientLink({
	variant = 'solid',
	className,
	children,
	...rest
}: { variant?: Variant; children?: ReactNode } & Omit<HTMLMotionProps<'a'>, 'children'>) {
	return (
		<motion.a whileTap={{ scale: 0.97 }} className={cn(base, variants[variant], className)} {...rest}>
			<Inner>{children}</Inner>
		</motion.a>
	)
}
