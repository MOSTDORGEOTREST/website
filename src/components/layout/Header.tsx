import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useLenis } from 'lenis/react'

import logo from '@/assets/brand/mdgt.png'
import { cn } from '@/lib/cn'
import { useAnchorScroll } from '@/lib/useAnchorScroll'
import { useScrollLock } from '@/lib/useScrollLock'
import { useUI } from '@/context/UIContext'
import { GradientButton } from '@/components/ui/GradientButton'
import { ArrowRight, Close, Menu, Phone } from '@/components/ui/icons'
import { brandTitle, navLinks, phones } from '@/data/nav'

export function Header() {
	const [open, setOpen] = useState(false)
	const [scrolled, setScrolled] = useState(false)
	const { openPrice } = useUI()
	const scrollToAnchor = useAnchorScroll()

	useLenis(({ scroll }) => setScrolled(scroll > 24))
	useScrollLock(open)

	const handleNav = (e: React.MouseEvent<HTMLElement>, href: string) => {
		scrollToAnchor(e, href)
		setOpen(false)
	}

	return (
		<header className="fixed inset-x-0 top-0 z-50">
			<div
				className={cn(
					'transition-all duration-300',
					scrolled ? 'border-b border-white/40 bg-white/65 backdrop-blur-xl shadow-[0_8px_30px_-18px_rgba(8,60,35,0.4)]' : 'bg-transparent'
				)}
			>
				<div className="container-site flex h-[4.5rem] items-center justify-between gap-4">
					{/* Бренд */}
					<a
						href="#welcome"
						onClick={(e) => handleNav(e, '#welcome')}
						className="flex items-center gap-3"
					>
						<img src={logo} alt="МОСТДОРГЕОТРЕСТ" className="size-10 shrink-0 sm:size-11" />
						<span className="hidden flex-col leading-tight sm:flex">
							<span className="text-[0.72rem] font-semibold tracking-wide text-muted">{brandTitle.line1}</span>
							<span className="font-display text-sm font-bold text-ink">{brandTitle.line2}</span>
						</span>
					</a>

					{/* Навигация (desktop) */}
					<nav className="hidden items-center gap-1 lg:flex">
						{navLinks.map((link) => (
							<a
								key={link.href}
								href={link.href}
								onClick={(e) => handleNav(e, link.href)}
								className="group relative rounded-full px-4 py-2 text-sm font-medium text-ink/80 transition-colors hover:text-brand-700"
							>
								{link.label}
								<span className="absolute inset-x-4 bottom-1 h-0.5 origin-left scale-x-0 rounded-full bg-gradient-to-r from-brand-500 to-teal-500 transition-transform duration-300 group-hover:scale-x-100" />
							</a>
						))}
					</nav>

					{/* Действия (desktop) */}
					<div className="hidden items-center gap-3 lg:flex">
						<a
							href={phones[0].href}
							className="flex items-center gap-2 text-sm font-semibold text-ink transition-colors hover:text-brand-700"
						>
							<Phone className="size-4 text-brand-600" />
							{phones[0].display}
						</a>
						<GradientButton onClick={openPrice} className="px-5 py-2.5 text-sm">
							Цены
							<ArrowRight className="size-4" />
						</GradientButton>
					</div>

					{/* Бургер (mobile) */}
					<button
						type="button"
						aria-label="Меню"
						onClick={() => setOpen(true)}
						className="glass grid size-11 place-items-center rounded-full text-ink lg:hidden"
					>
						<Menu className="size-5" />
					</button>
				</div>
			</div>

			{/* Мобильное меню */}
			<AnimatePresence>
				{open && (
					<>
						<motion.div
							className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm lg:hidden"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={() => setOpen(false)}
						/>
						<motion.div
							className="glass fixed inset-y-0 right-0 z-50 flex w-[82%] max-w-sm flex-col gap-6 p-7 lg:hidden"
							initial={{ x: '100%' }}
							animate={{ x: 0 }}
							exit={{ x: '100%' }}
							transition={{ type: 'tween', duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
						>
							<div className="flex items-center justify-between">
								<span className="font-display text-base font-bold text-ink">{brandTitle.line2}</span>
								<button
									type="button"
									aria-label="Закрыть меню"
									onClick={() => setOpen(false)}
									className="grid size-10 place-items-center rounded-full bg-white/60 text-ink"
								>
									<Close className="size-5" />
								</button>
							</div>

							<nav className="flex flex-col gap-1">
								{navLinks.map((link) => (
									<a
										key={link.href}
										href={link.href}
										onClick={(e) => handleNav(e, link.href)}
										className="rounded-xl px-4 py-3 text-lg font-medium text-ink transition-colors hover:bg-white/60 hover:text-brand-700"
									>
										{link.label}
									</a>
								))}
							</nav>

							<div className="mt-auto flex flex-col gap-3 border-t border-line/70 pt-5">
								{phones.map((p) => (
									<a key={p.href} href={p.href} className="flex items-center gap-2 font-semibold text-ink">
										<Phone className="size-4 text-brand-600" />
										{p.display}
									</a>
								))}
								<GradientButton
									onClick={() => {
										setOpen(false)
										openPrice()
									}}
									className="mt-2 w-full"
								>
									Посмотреть цены
								</GradientButton>
							</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</header>
	)
}
