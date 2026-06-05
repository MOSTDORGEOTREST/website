import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'

import welcomeImg from '@/assets/welcome/welcome.png'
import { GradientButton, GradientLink } from '@/components/ui/GradientButton'
import { GradientMesh, GridOverlay } from '@/components/ui/GradientMesh'
import { Counter } from '@/components/ui/Counter'
import { Eyebrow } from '@/components/ui/Section'
import { Stagger, StaggerItem } from '@/components/ui/motion'
import { ArrowRight, ArrowUpRight, Live } from '@/components/ui/icons'
import { useUI } from '@/context/UIContext'
import { useAnchorScroll } from '@/lib/useAnchorScroll'
import { heroSubtitle, heroTitleLines, labCategories } from '@/data/welcome'

const stats = [
	{ value: 2008, label: 'Год основания', grouping: false },
	{ value: 6, label: 'Направлений лаборатории' },
	{ value: 36, label: 'Заказчиков по всей стране' },
]

export function Hero() {
	const { openPrice } = useUI()
	const scrollToAnchor = useAnchorScroll()
	const reduce = useReducedMotion()
	const ref = useRef<HTMLDivElement>(null)
	const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
	const imgY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 110])
	const glow = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -70])

	return (
		<section id="welcome" ref={ref} className="relative overflow-hidden pb-16 pt-28 sm:pb-24 sm:pt-32 lg:pt-40">
			<GradientMesh />
			<GridOverlay />

			<div className="container-site relative">
				<div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
					{/* Левая колонка */}
					<div className="flex flex-col items-start gap-7">
						<motion.div
							initial={reduce ? false : { opacity: 0, y: 20 }}
							animate={reduce ? undefined : { opacity: 1, y: 0 }}
							transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
						>
							<Eyebrow>Геотехническая лаборатория · с 2008 года</Eyebrow>
						</motion.div>

						<h1 className="text-[2.6rem] font-bold leading-[1.02] tracking-tight sm:text-6xl lg:text-[4.1rem]">
							<motion.span
								className="block"
								initial={reduce ? false : { opacity: 0, y: 24 }}
								animate={reduce ? undefined : { opacity: 1, y: 0 }}
								transition={{ duration: 0.7, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
							>
								{heroTitleLines[0]}
							</motion.span>
							<motion.span
								className="gradient-text block"
								initial={reduce ? false : { opacity: 0, y: 24 }}
								animate={reduce ? undefined : { opacity: 1, y: 0 }}
								transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
							>
								{heroTitleLines[1]}
							</motion.span>
						</h1>

						<motion.p
							className="max-w-xl text-base leading-relaxed text-muted sm:text-lg"
							initial={reduce ? false : { opacity: 0, y: 20 }}
							animate={reduce ? undefined : { opacity: 1, y: 0 }}
							transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
						>
							{heroSubtitle}
						</motion.p>

						<motion.div
							className="flex flex-wrap items-center gap-3"
							initial={reduce ? false : { opacity: 0, y: 20 }}
							animate={reduce ? undefined : { opacity: 1, y: 0 }}
							transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
						>
							<GradientButton onClick={openPrice}>
								Посмотреть цены
								<ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
							</GradientButton>
							<GradientLink href="#about" variant="outline" onClick={(e) => scrollToAnchor(e, '#about')}>
								О лаборатории
							</GradientLink>
						</motion.div>

						{/* Статистика */}
						<motion.dl
							className="mt-2 grid w-full max-w-lg grid-cols-3 gap-4 border-t border-line/70 pt-7"
							initial={reduce ? false : { opacity: 0, y: 20 }}
							animate={reduce ? undefined : { opacity: 1, y: 0 }}
							transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
						>
							{stats.map((s) => (
								<div key={s.label} className="flex flex-col gap-1">
									<dt className="order-2 text-xs leading-snug text-muted sm:text-sm">{s.label}</dt>
									<dd className="order-1 font-display text-3xl font-bold text-brand-700 sm:text-4xl">
										<Counter to={s.value} grouping={s.grouping ?? true} />
										{s.label.includes('Заказчиков') ? '+' : ''}
									</dd>
								</div>
							))}
						</motion.dl>
					</div>

					{/* Правая колонка — изображение */}
					<motion.div
						className="relative"
						initial={reduce ? false : { opacity: 0, scale: 0.94 }}
						animate={reduce ? undefined : { opacity: 1, scale: 1 }}
						transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
					>
						<motion.div style={{ y: glow }} className="absolute -inset-6 -z-10">
							<div className="absolute right-6 top-6 h-64 w-64 rounded-full bg-teal-400/40 blur-3xl" />
							<div className="absolute bottom-0 left-4 h-56 w-56 rounded-full bg-brand-400/40 blur-3xl" />
						</motion.div>

						<div className="glass relative overflow-hidden rounded-[2rem] p-3 shadow-glow">
							<motion.img
								src={welcomeImg}
								alt="Геотехническая лаборатория МОСТДОРГЕОТРЕСТ"
								style={{ y: imgY }}
								className="h-full w-full rounded-[1.4rem] object-cover"
								loading="eager"
							/>
							<div className="pointer-events-none absolute inset-3 rounded-[1.4rem] ring-1 ring-inset ring-white/40" />
						</div>

						<motion.div
							className="glass absolute -bottom-5 -left-3 flex items-center gap-2 rounded-2xl px-4 py-2.5 sm:-left-6"
							initial={reduce ? false : { opacity: 0, y: 16 }}
							animate={reduce ? undefined : { opacity: 1, y: 0 }}
							transition={{ duration: 0.7, delay: 0.7 }}
						>
							<span className="grid size-9 place-items-center rounded-full bg-brand-600/12 text-brand-700">
								<Live className="size-5" />
							</span>
							<span className="text-sm font-semibold leading-tight text-ink">
								Прямые трансляции
								<span className="block text-xs font-normal text-muted">из лаборатории 24/7</span>
							</span>
						</motion.div>
					</motion.div>
				</div>

				{/* Направления лаборатории */}
				<Stagger className="mt-16 grid grid-cols-2 gap-3 sm:mt-20 sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
					{labCategories.map((cat) => (
						<StaggerItem key={cat.label}>
							<div className="glass group flex h-full flex-col items-start gap-3 rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_-24px_rgba(13,148,136,0.55)]">
								<span className="grid size-11 place-items-center rounded-xl bg-gradient-to-br from-brand-500/15 to-teal-500/15">
									<img src={cat.icon} alt="" className="size-6 object-contain" />
								</span>
								<span className="text-sm font-medium leading-snug text-ink">{cat.label}</span>
							</div>
						</StaggerItem>
					))}
				</Stagger>
			</div>

			{/* Индикатор скролла */}
			<a
				href="#objects"
				onClick={(e) => scrollToAnchor(e, '#objects')}
				className="group mx-auto mt-14 hidden w-fit items-center gap-2 text-sm text-muted transition-colors hover:text-brand-700 sm:flex"
			>
				Объекты, где мы работали
				<ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
			</a>
		</section>
	)
}
