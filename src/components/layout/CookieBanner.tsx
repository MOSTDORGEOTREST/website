import { AnimatePresence, motion } from 'motion/react'
import { useUI } from '@/context/UIContext'
import { politicaHref, soglasieHref } from '@/data/legal'

export function CookieBanner() {
	const { isCookieVisible, acceptCookies } = useUI()

	return (
		<AnimatePresence>
			{isCookieVisible && (
				<motion.div
					initial={{ opacity: 0, y: 24 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: 24 }}
					transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
					className="fixed inset-x-3 bottom-3 z-40 mx-auto max-w-3xl sm:inset-x-4 sm:bottom-4"
				>
					<div className="glass flex flex-col gap-4 rounded-2xl p-5 sm:flex-row sm:items-center sm:gap-5">
						<p className="text-sm leading-relaxed text-ink/80">
							Мы используем Cookies в том числе с использованием сервиса веб-аналитики "Яндекс.Метрика".
							Продолжая использовать наш сайт, вы даете{' '}
							<a href={soglasieHref} className="font-medium text-brand-700 underline-offset-2 hover:underline">
								согласие
							</a>{' '}
							на обработку данных Cookies в том числе с использованием сервиса веб-аналитики "Яндекс.Метрика" в
							соответствии с{' '}
							<a href={politicaHref} className="font-medium text-brand-700 underline-offset-2 hover:underline">
								Политикой
							</a>
							.
						</p>
						<button
							type="button"
							onClick={acceptCookies}
							className="shrink-0 rounded-full bg-[linear-gradient(100deg,var(--color-brand-600),var(--color-teal-500))] px-7 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
						>
							Принять
						</button>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}
