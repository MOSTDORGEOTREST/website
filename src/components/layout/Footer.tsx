import logo from '@/assets/brand/mdgt.png'
import { useAnchorScroll } from '@/lib/useAnchorScroll'
import { brandTitle, navLinks } from '@/data/nav'
import { address, contactEmails, contactPhones } from '@/data/contacts'
import { politicaHref, politicaLabel, soglasieHref, soglasieLabel } from '@/data/legal'

export function Footer() {
	const year = new Date().getFullYear()
	const scrollToAnchor = useAnchorScroll()

	return (
		<footer className="relative mt-10 overflow-hidden bg-ink text-white/75">
			<div className="pointer-events-none absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-brand-500/20 blur-[120px]" />
			<div className="pointer-events-none absolute -bottom-24 right-1/4 h-72 w-72 rounded-full bg-teal-500/20 blur-[120px]" />

			<div className="container-site relative py-16">
				<div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
					{/* Бренд */}
					<div className="flex flex-col gap-4 lg:col-span-1">
						<div className="flex items-center gap-3">
							<img src={logo} alt="МОСТДОРГЕОТРЕСТ" className="size-11" />
							<span className="flex flex-col leading-tight">
								<span className="text-[0.7rem] font-medium tracking-wide text-white/55">{brandTitle.line1}</span>
								<span className="font-display text-base font-bold text-white">{brandTitle.line2}</span>
							</span>
						</div>
						<p className="text-sm leading-relaxed text-white/55">
							Лидер в лабораторных испытаниях грунтов с 2008 года.
						</p>
					</div>

					{/* Навигация */}
					<nav className="flex flex-col gap-3">
						<h3 className="font-display text-sm font-semibold uppercase tracking-wider text-white/45">Разделы</h3>
						{navLinks.map((link) => (
							<a
								key={link.href}
								href={link.href}
								onClick={(e) => scrollToAnchor(e, link.href)}
								className="w-fit text-sm text-white/75 transition-colors hover:text-brand-300"
							>
								{link.label}
							</a>
						))}
					</nav>

					{/* Контакты */}
					<div className="flex flex-col gap-3">
						<h3 className="font-display text-sm font-semibold uppercase tracking-wider text-white/45">Контакты</h3>
						{contactPhones.map((p) => (
							<a key={p.href} href={p.href} className="w-fit text-sm text-white/75 transition-colors hover:text-brand-300">
								{p.display}
							</a>
						))}
						{contactEmails.map((e) => (
							<a key={e.href} href={e.href} className="w-fit text-sm text-white/75 transition-colors hover:text-brand-300">
								{e.display}
							</a>
						))}
					</div>

					{/* Адрес */}
					<div className="flex flex-col gap-3">
						<h3 className="font-display text-sm font-semibold uppercase tracking-wider text-white/45">Адрес</h3>
						<p className="text-sm leading-relaxed text-white/75">{address}</p>
					</div>
				</div>

				<div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-white/55 lg:flex-row lg:items-center lg:justify-between">
					<p>{`© ${year} Акционерное общество "МОСТДОРГЕОТРЕСТ"`}</p>
					<div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
						<a href={politicaHref} className="transition-colors hover:text-brand-300">
							{politicaLabel}
						</a>
						<a href={soglasieHref} className="transition-colors hover:text-brand-300">
							{soglasieLabel}
						</a>
					</div>
				</div>
			</div>
		</footer>
	)
}
