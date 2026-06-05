import { animate, useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

/** Анимированный счётчик: считает 0 → to при попадании во вьюпорт. */
export function Counter({
	to,
	duration = 1.8,
	prefix = '',
	suffix = '',
	grouping = true,
	className,
}: {
	to: number
	duration?: number
	prefix?: string
	suffix?: string
	grouping?: boolean
	className?: string
}) {
	const ref = useRef<HTMLSpanElement>(null)
	const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
	const reduce = useReducedMotion()
	const [val, setVal] = useState(0)

	useEffect(() => {
		if (!inView) return
		if (reduce) {
			setVal(to)
			return
		}
		const controls = animate(0, to, {
			duration,
			ease: [0.22, 1, 0.36, 1],
			onUpdate: (v) => setVal(v),
		})
		return () => controls.stop()
	}, [inView, to, duration, reduce])

	return (
		<span ref={ref} className={className}>
			{prefix}
			{grouping ? Math.round(val).toLocaleString('ru-RU') : String(Math.round(val))}
			{suffix}
		</span>
	)
}
