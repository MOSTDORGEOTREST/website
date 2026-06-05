import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'

import { Section, SectionHeading } from '@/components/ui/Section'
import { GradientMesh } from '@/components/ui/GradientMesh'
import { Reveal } from '@/components/ui/motion'
import { calculationsDescription, calculationsHeading, calculationsImage } from '@/data/calculations'

export function Calculations() {
	const ref = useRef<HTMLDivElement>(null)
	const reduce = useReducedMotion()
	const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
	const y = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : 60, reduce ? 0 : -60])

	return (
		<Section id="Calculations" className="relative overflow-hidden py-20 sm:py-28">
			<GradientMesh intensity="soft" />
			<div ref={ref} className="container-site relative">
				<div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
					<div className="flex flex-col">
						<SectionHeading eyebrow="Проектирование" title={calculationsHeading} />
						<Reveal delay={0.1}>
							<p className="mt-6 text-base leading-relaxed text-muted sm:text-lg">
								{calculationsDescription}
							</p>
						</Reveal>
					</div>

					<Reveal delay={0.05}>
						<div className="relative">
							<div className="absolute -inset-5 -z-10">
								<div className="absolute right-8 top-4 h-52 w-52 rounded-full bg-teal-400/35 blur-3xl" />
								<div className="absolute bottom-2 left-6 h-48 w-48 rounded-full bg-brand-400/35 blur-3xl" />
							</div>
							<div className="glass overflow-hidden rounded-[2rem] p-3 shadow-glow">
								<motion.img
									src={calculationsImage}
									alt="Геотехнические расчёты"
									style={{ y }}
									loading="lazy"
									className="w-full rounded-[1.4rem] object-cover"
								/>
							</div>
						</div>
					</Reveal>
				</div>
			</div>
		</Section>
	)
}
