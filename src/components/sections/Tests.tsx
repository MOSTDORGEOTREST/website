import { Section, SectionHeading } from '@/components/ui/Section'
import { Disclosure } from '@/components/ui/Disclosure'
import { Reveal } from '@/components/ui/motion'
import { FileText, ArrowUpRight } from '@/components/ui/icons'
import { testProtocols, testsCard, testsHeading, testsParagraphs } from '@/data/tests'

export function Tests() {
	return (
		<Section id="tests" className="relative py-20 sm:py-28">
			<div className="container-site">
				<SectionHeading eyebrow="Услуги" title={testsHeading} className="max-w-2xl" />

				<div className="mt-10 grid gap-x-10 gap-y-5 sm:grid-cols-2">
					{testsParagraphs.map((p, i) => (
						<Reveal key={i} delay={i * 0.04}>
							<p className="text-base leading-relaxed text-muted sm:text-[1.05rem]">{p}</p>
						</Reveal>
					))}
				</div>

				<div className="mt-12">
					<Disclosure title={testsCard.title} subtitle={testsCard.subtitle} defaultOpen>
						<ul className="grid gap-2.5 sm:grid-cols-2">
							{testProtocols.map((proto) => (
								<li key={proto.label}>
									<a
										href={proto.href}
										target="_blank"
										rel="noopener noreferrer"
										className="group flex h-full items-center gap-3 rounded-2xl bg-white/50 px-4 py-3 transition-colors hover:bg-white/80"
									>
										<span className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand-600/10 text-brand-700">
											<FileText className="size-5" />
										</span>
										<span className="text-sm leading-snug text-ink">{proto.label}</span>
										<ArrowUpRight className="ml-auto size-4 shrink-0 text-muted transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-700" />
									</a>
								</li>
							))}
						</ul>
					</Disclosure>
				</div>
			</div>
		</Section>
	)
}
