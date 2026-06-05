import {
	motion,
	useReducedMotion,
	type HTMLMotionProps,
	type Variants,
} from 'motion/react'
import type { ReactNode } from 'react'

export const EASE = [0.22, 1, 0.36, 1] as const

interface RevealProps {
	children: ReactNode
	className?: string
	delay?: number
	y?: number
	once?: boolean
}

/** Появление блока при попадании во вьюпорт (fade + rise). */
export function Reveal({ children, className, delay = 0, y = 28, once = true }: RevealProps) {
	const reduce = useReducedMotion()
	return (
		<motion.div
			className={className}
			initial={reduce ? false : { opacity: 0, y }}
			whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
			viewport={{ once, margin: '0px 0px -12% 0px' }}
			transition={{ duration: 0.7, delay, ease: EASE }}
		>
			{children}
		</motion.div>
	)
}

export const staggerContainer: Variants = {
	hidden: {},
	show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
}

export const staggerItem: Variants = {
	hidden: { opacity: 0, y: 24 },
	show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
}

/** Контейнер для каскадного появления дочерних <StaggerItem>. */
export function Stagger({ children, ...rest }: HTMLMotionProps<'div'>) {
	const reduce = useReducedMotion()
	return (
		<motion.div
			variants={staggerContainer}
			initial={reduce ? false : 'hidden'}
			whileInView={reduce ? undefined : 'show'}
			viewport={{ once: true, margin: '0px 0px -10% 0px' }}
			{...rest}
		>
			{children}
		</motion.div>
	)
}

export function StaggerItem({ children, ...rest }: HTMLMotionProps<'div'>) {
	const reduce = useReducedMotion()
	return (
		<motion.div variants={reduce ? undefined : staggerItem} {...rest}>
			{children}
		</motion.div>
	)
}
