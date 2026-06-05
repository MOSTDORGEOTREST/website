import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'

import { Section, SectionHeading } from '@/components/ui/Section'
import { cn } from '@/lib/cn'
import { ArrowRight } from '@/components/ui/icons'
import { projects } from '@/data/projects'

export function Projects() {
	const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center' }, [
		Autoplay({ delay: 4200, stopOnInteraction: false, stopOnMouseEnter: true }),
	])
	const [selected, setSelected] = useState(0)

	const onSelect = useCallback(() => {
		if (emblaApi) setSelected(emblaApi.selectedScrollSnap())
	}, [emblaApi])

	useEffect(() => {
		if (!emblaApi) return
		onSelect()
		emblaApi.on('select', onSelect)
		emblaApi.on('reInit', onSelect)
	}, [emblaApi, onSelect])

	return (
		<Section id="objects" className="overflow-hidden py-20 sm:py-28">
			<div className="container-site">
				<div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
					<SectionHeading
						eyebrow="Наши объекты"
						title={<>Где работала наша лаборатория</>}
						subtitle="Объекты федерального значения — мосты, аэропорты, энергетика и инфраструктура."
						className="max-w-2xl"
					/>
					<div className="hidden gap-2 sm:flex">
						<CarouselButton direction="prev" onClick={() => emblaApi?.scrollPrev()} />
						<CarouselButton direction="next" onClick={() => emblaApi?.scrollNext()} />
					</div>
				</div>
			</div>

			<div className="mt-12 px-[max(1.1rem,calc((100vw-90rem)/2+1.1rem))]">
				<div className="overflow-hidden" ref={emblaRef}>
					<div className="flex touch-pan-y gap-4 sm:gap-6">
						{projects.map((project, i) => (
							<article
								key={project.title}
								className="relative min-w-0 flex-[0_0_88%] overflow-hidden rounded-[1.75rem] sm:flex-[0_0_70%] lg:flex-[0_0_58%]"
							>
								<div className="group relative aspect-[16/10] w-full overflow-hidden rounded-[1.75rem]">
									<picture>
										<source media="(max-width: 640px)" srcSet={project.srcMobile} />
										<img
											src={project.src}
											alt={project.title}
											loading="lazy"
											className={cn(
												'h-full w-full object-cover transition-transform duration-[1.2s] ease-out',
												i === selected ? 'scale-105' : 'scale-100',
												'group-hover:scale-110'
											)}
										/>
									</picture>
									<div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
									<div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-5 sm:p-7">
										<h3 className="text-xl font-semibold text-white drop-shadow sm:text-2xl">{project.title}</h3>
										{project.credit && (
											<span className="text-xs text-white/70 sm:text-sm">{project.credit}</span>
										)}
									</div>
								</div>
							</article>
						))}
					</div>
				</div>
			</div>

			{/* Точки */}
			<div className="container-site mt-8 flex items-center justify-center gap-2">
				{projects.map((p, i) => (
					<button
						key={p.title}
						aria-label={`Перейти к объекту: ${p.title}`}
						onClick={() => emblaApi?.scrollTo(i)}
						className={cn(
							'h-2 rounded-full transition-all duration-300',
							i === selected ? 'w-7 bg-gradient-to-r from-brand-500 to-teal-500' : 'w-2 bg-brand-700/20 hover:bg-brand-700/40'
						)}
					/>
				))}
			</div>
		</Section>
	)
}

function CarouselButton({ direction, onClick }: { direction: 'prev' | 'next'; onClick: () => void }) {
	return (
		<button
			type="button"
			onClick={onClick}
			aria-label={direction === 'prev' ? 'Предыдущий' : 'Следующий'}
			className="glass grid size-12 place-items-center rounded-full text-brand-700 transition-all duration-300 hover:-translate-y-0.5 hover:text-brand-800"
		>
			<ArrowRight className={cn('size-5', direction === 'prev' && 'rotate-180')} />
		</button>
	)
}
