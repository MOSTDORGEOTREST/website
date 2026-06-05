import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useLenis } from 'lenis/react'
import { ArrowUp } from '@/components/ui/icons'

export function ScrollToTop() {
	const [show, setShow] = useState(false)
	const lenis = useLenis(({ scroll }) => setShow(scroll > 400))

	return (
		<AnimatePresence>
			{show && (
				<motion.button
					type="button"
					aria-label="Наверх"
					onClick={() => lenis?.scrollTo(0, { duration: 1.2 })}
					initial={{ opacity: 0, scale: 0.6, y: 10 }}
					animate={{ opacity: 1, scale: 1, y: 0 }}
					exit={{ opacity: 0, scale: 0.6, y: 10 }}
					whileHover={{ y: -3 }}
					className="fixed bottom-6 right-6 z-40 grid size-12 place-items-center rounded-full bg-[linear-gradient(135deg,var(--color-brand-600),var(--color-teal-500))] text-white shadow-[0_16px_40px_-14px_rgba(13,148,136,0.8)]"
				>
					<ArrowUp className="size-5" />
				</motion.button>
			)}
		</AnimatePresence>
	)
}
