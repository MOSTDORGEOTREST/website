import { AnimatePresence, motion } from 'motion/react'
import { useUI } from '@/context/UIContext'
import { useScrollLock } from '@/lib/useScrollLock'
import { Close, Download } from '@/components/ui/icons'
import { priceSheetUrl, pricePdf, priceXlsx } from '@/data/price'

export function PriceModal() {
	const { isPriceOpen, closePrice } = useUI()
	useScrollLock(isPriceOpen)

	return (
		<AnimatePresence>
			{isPriceOpen && (
				<motion.div
					className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
				>
					<div className="absolute inset-0 bg-ink/65 backdrop-blur-sm" onClick={closePrice} />

					<motion.div
						className="glass relative z-10 flex h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl"
						initial={{ opacity: 0, scale: 0.96, y: 20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.96, y: 20 }}
						transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
					>
						<div className="flex items-center justify-between gap-3 border-b border-white/40 px-5 py-4">
							<h2 className="font-display text-lg font-bold text-ink">Прайс-лист</h2>
							<div className="flex items-center gap-2">
								<a
									href={priceXlsx}
									target="_blank"
									rel="noopener noreferrer"
									title="Скачать xls"
									className="flex items-center gap-1.5 rounded-full bg-white/60 px-4 py-2 text-sm font-semibold text-brand-700 transition-colors hover:bg-white/90"
								>
									<Download className="size-4" />
									XLS
								</a>
								<a
									href={pricePdf}
									target="_blank"
									rel="noopener noreferrer"
									title="Скачать pdf"
									className="flex items-center gap-1.5 rounded-full bg-white/60 px-4 py-2 text-sm font-semibold text-brand-700 transition-colors hover:bg-white/90"
								>
									<Download className="size-4" />
									PDF
								</a>
								<button
									type="button"
									onClick={closePrice}
									aria-label="Закрыть"
									className="grid size-10 place-items-center rounded-full bg-white/60 text-ink transition-colors hover:bg-white/90"
								>
									<Close className="size-5" />
								</button>
							</div>
						</div>

						<div className="flex-1 overflow-hidden bg-white">
							<iframe
								title="Прайс-лист"
								src={priceSheetUrl}
								className="h-full w-full"
								frameBorder="0"
							/>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}
