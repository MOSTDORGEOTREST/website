import { Route, Routes } from 'react-router-dom'
import { ReactLenis } from 'lenis/react'
import { useReducedMotion } from 'motion/react'

import { UIProvider } from '@/context/UIContext'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ScrollToTop } from '@/components/layout/ScrollToTop'
import { FloatCall } from '@/components/layout/FloatCall'
import { CookieBanner } from '@/components/layout/CookieBanner'
import { PriceModal } from '@/components/Price/PriceModal'
import { Home } from '@/components/Home'
import { NotFound } from '@/components/NotFound/NotFound'

export default function App() {
	const reduce = useReducedMotion()

	return (
		<ReactLenis
			root
			options={{ lerp: reduce ? 1 : 0.1, smoothWheel: !reduce, wheelMultiplier: 1 }}
		>
			<UIProvider>
				<Header />
				<main>
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="*" element={<NotFound />} />
					</Routes>
				</main>
				<Footer />
				<ScrollToTop />
				<FloatCall />
				<CookieBanner />
				<PriceModal />
			</UIProvider>
		</ReactLenis>
	)
}
