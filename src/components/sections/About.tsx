import { Section, SectionHeading } from '@/components/ui/Section'
import { GlassCard } from '@/components/ui/GlassCard'
import { GradientLink } from '@/components/ui/GradientButton'
import { Disclosure } from '@/components/ui/Disclosure'
import { Counter } from '@/components/ui/Counter'
import { Reveal } from '@/components/ui/motion'
import { ArrowUpRight, FileText, Globe } from '@/components/ui/icons'
import {
	aboutHeading,
	aboutParagraphs,
	documentCards,
	expertCouncil,
	tour3dHref,
	tour3dLabel,
} from '@/data/about'

const facts = [
	{ value: '2008', label: 'Год основания', counter: 2008 },
	{ value: 'ГОСТ ISO/IEC 17025-2019', label: 'Аккредитация' },
	{ value: 'ASTM и ГОСТ', label: 'Стандарты испытаний' },
]

export function About() {
	return (
		<Section id="about" className="relative py-20 sm:py-28">
			<div className="container-site">
				<SectionHeading eyebrow="О компании" title={aboutHeading} className="max-w-2xl" />

				<div className="mt-12 grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-12">
					{/* Текст */}
					<div className="flex flex-col gap-5">
						{aboutParagraphs.map((p, i) => (
							<Reveal key={i} delay={i * 0.04}>
								<p className="text-base leading-relaxed text-muted sm:text-[1.05rem]">{p}</p>
							</Reveal>
						))}
					</div>

					{/* Карточка фактов + 3D-тур */}
					<div className="lg:sticky lg:top-28 lg:self-start">
						<GlassCard className="p-7 sm:p-8">
							<h3 className="text-lg font-semibold text-ink">Коротко о главном</h3>
							<dl className="mt-6 flex flex-col gap-6">
								{facts.map((f) => (
									<div key={f.label} className="flex flex-col gap-1 border-l-2 border-brand-500/40 pl-4">
										<dt className="text-xs uppercase tracking-wider text-muted">{f.label}</dt>
										<dd className="font-display text-xl font-bold text-brand-700">
											{f.counter ? <Counter to={f.counter} grouping={false} /> : f.value}
										</dd>
									</div>
								))}
							</dl>
							<GradientLink
								href={tour3dHref}
								target="_blank"
								rel="noopener noreferrer"
								className="mt-8 w-full"
							>
								<Globe className="size-5" />
								{tour3dLabel}
								<ArrowUpRight className="size-4" />
							</GradientLink>
						</GlassCard>
					</div>
				</div>

				{/* Разрешительные документы */}
				<div className="mt-14">
					<Reveal>
						<h3 className="mb-6 text-xl font-semibold text-ink sm:text-2xl">Разрешительные документы</h3>
					</Reveal>
					<div className="grid gap-5 lg:grid-cols-2">
						{documentCards.map((card, i) => (
							<Disclosure
								key={card.subtitle}
								title={card.title}
								subtitle={card.subtitle}
								defaultOpen={i === 0}
							>
								<ul className="flex flex-col gap-2">
									{card.items.map((item) => (
										<li key={item.label}>
											<a
												href={item.href}
												target="_blank"
												rel="noopener noreferrer"
												className="group flex items-center gap-3 rounded-2xl bg-white/50 px-4 py-3 transition-colors hover:bg-white/80"
											>
												<span className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand-600/10 text-brand-700">
													<FileText className="size-5" />
												</span>
												<span className="text-sm leading-snug text-ink">{item.label}</span>
												<ArrowUpRight className="ml-auto size-4 shrink-0 text-muted transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-700" />
											</a>
										</li>
									))}
								</ul>
							</Disclosure>
						))}
					</div>

					<Reveal className="mt-5">
						<a
							href={expertCouncil.href}
							target="_blank"
							rel="noopener noreferrer"
							className="glass group flex items-center gap-4 rounded-3xl px-6 py-5 transition-all duration-300 hover:-translate-y-0.5"
						>
							<span className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand-600/10 text-brand-700">
								<FileText className="size-6" />
							</span>
							<span className="flex flex-col">
								<span className="text-lg font-semibold text-ink">{expertCouncil.title}</span>
								<span className="text-sm text-muted">{expertCouncil.subtitle}</span>
							</span>
							<ArrowUpRight className="ml-auto size-5 shrink-0 text-muted transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-700" />
						</a>
					</Reveal>
				</div>
			</div>
		</Section>
	)
}
