import { Section, SectionHeading } from '@/components/ui/Section'
import { Reveal } from '@/components/ui/motion'
import { cn } from '@/lib/cn'
import { equipmentBlocks } from '@/data/about'

export function Equipment() {
	return (
		<Section className="relative py-20 sm:py-28">
			<div className="container-site">
				<SectionHeading
					eyebrow="Оборудование"
					title="Передовые приборы для любых задач"
					subtitle="Высокоточное аналитическое оборудование отечественного и зарубежного производства для всех видов испытаний."
					align="center"
					className="mx-auto items-center text-center"
				/>

				<div className="mt-14 flex flex-col gap-6 sm:gap-8">
					{equipmentBlocks.map((block, i) => {
						const reversed = i % 2 === 1
						return (
							<Reveal key={block.title} delay={0.03}>
								<article className="glass grid items-center gap-6 overflow-hidden rounded-[1.75rem] p-5 sm:gap-8 sm:p-7 lg:grid-cols-2">
									{/* Изображения приборов */}
									<div className={cn('grid grid-cols-2 gap-3 sm:gap-4', reversed && 'lg:order-2')}>
										{block.images.map((src, idx) => (
											<div
												key={idx}
												className="group relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-brand-500/10 to-teal-500/10 p-3"
											>
												<img
													src={src}
													alt={block.title}
													loading="lazy"
													className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
												/>
											</div>
										))}
									</div>

									{/* Текст */}
									<div className={cn('flex flex-col gap-4', reversed && 'lg:order-1')}>
										<span className="font-display text-sm font-bold text-brand-600/70">
											0{i + 1}
										</span>
										<h3 className="text-2xl font-semibold text-ink sm:text-[1.7rem]">{block.title}</h3>
										<p className="text-base leading-relaxed text-muted">{block.text}</p>
									</div>
								</article>
							</Reveal>
						)
					})}
				</div>
			</div>
		</Section>
	)
}
