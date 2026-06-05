import { AnimatePresence, motion } from 'motion/react'
import { useState, type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { ChevronDown } from './icons'

interface DisclosureProps {
	title: ReactNode
	subtitle?: ReactNode
	defaultOpen?: boolean
	children: ReactNode
	className?: string
}

/** Аккордеон из матового стекла с плавным раскрытием (height auto). */
export function Disclosure({ title, subtitle, defaultOpen = false, children, className }: DisclosureProps) {
	const [open, setOpen] = useState(defaultOpen)

	return (
		<div className={cn('glass overflow-hidden rounded-3xl', className)}>
			<button
				type="button"
				onClick={() => setOpen((o) => !o)}
				aria-expanded={open}
				className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-white/40 sm:px-8 sm:py-6"
			>
				<span className="flex flex-col gap-1">
					<span className="text-lg font-semibold text-ink sm:text-xl">{title}</span>
					{subtitle && <span className="text-sm text-muted">{subtitle}</span>}
				</span>
				<span
					className={cn(
						'grid size-10 shrink-0 place-items-center rounded-full bg-brand-600/10 text-brand-700 transition-transform duration-300',
						open && 'rotate-180'
					)}
				>
					<ChevronDown className="size-5" />
				</span>
			</button>
			<AnimatePresence initial={false}>
				{open && (
					<motion.div
						key="content"
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: 'auto', opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
						className="overflow-hidden"
					>
						<div className="px-4 pb-5 sm:px-6 sm:pb-6">{children}</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}
