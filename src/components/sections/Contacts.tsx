import { Section } from '@/components/ui/Section'
import { GlassCard } from '@/components/ui/GlassCard'
import { Reveal } from '@/components/ui/motion'
import { Eyebrow } from '@/components/ui/Section'
import { Clock, Mail, MapPin, Phone } from '@/components/ui/icons'
import {
	address,
	contactEmails,
	contactPhones,
	contactTitleLines,
	inn,
	mapSrc,
	ogrn,
	workingHours,
} from '@/data/contacts'

export function Contacts() {
	return (
		<Section id="contacts" className="relative py-20 sm:py-28">
			<div className="container-site">
				<div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-8">
					{/* Контактная карточка */}
					<Reveal>
						<GlassCard className="flex h-full flex-col gap-7 p-7 sm:p-9">
							<Eyebrow>Контакты</Eyebrow>
							<h2 className="font-display text-3xl font-bold leading-tight text-ink sm:text-4xl">
								{contactTitleLines.map((line) => (
									<span key={line} className="block">
										{line}
									</span>
								))}
							</h2>

							<div className="flex flex-col gap-5">
								<div className="flex items-start gap-3">
									<span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-xl bg-brand-600/10 text-brand-700">
										<Phone className="size-5" />
									</span>
									<div className="flex flex-col">
										{contactPhones.map((p) => (
											<a
												key={p.href}
												href={p.href}
												className="text-lg font-semibold text-ink transition-colors hover:text-brand-700"
											>
												{p.display}
											</a>
										))}
									</div>
								</div>

								<div className="flex items-start gap-3">
									<span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-xl bg-brand-600/10 text-brand-700">
										<Mail className="size-5" />
									</span>
									<div className="flex flex-col">
										{contactEmails.map((e) => (
											<a
												key={e.href}
												href={e.href}
												className="text-base font-medium text-ink transition-colors hover:text-brand-700"
											>
												{e.display}
											</a>
										))}
									</div>
								</div>

								<div className="flex items-start gap-3">
									<span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-xl bg-brand-600/10 text-brand-700">
										<Clock className="size-5" />
									</span>
									<p className="text-base text-ink">{workingHours}</p>
								</div>

								<div className="flex items-start gap-3">
									<span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-xl bg-brand-600/10 text-brand-700">
										<MapPin className="size-5" />
									</span>
									<div className="flex flex-col gap-1 text-base text-ink">
										<span>{address}</span>
										<span className="text-sm text-muted">{inn}</span>
										<span className="text-sm text-muted">{ogrn}</span>
									</div>
								</div>
							</div>
						</GlassCard>
					</Reveal>

					{/* Карта 2GIS */}
					<Reveal delay={0.1}>
						<div className="glass h-full overflow-hidden rounded-3xl p-2.5">
							<iframe
								title="Карта проезда — МОСТДОРГЕОТРЕСТ"
								src={mapSrc}
								className="h-[420px] w-full rounded-2xl sm:h-[520px] lg:h-full lg:min-h-[560px]"
								loading="lazy"
								sandbox="allow-modals allow-forms allow-scripts allow-same-origin allow-popups allow-top-navigation-by-user-activation"
							/>
						</div>
					</Reveal>
				</div>
			</div>
		</Section>
	)
}
