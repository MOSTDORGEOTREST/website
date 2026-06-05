import { useLenis } from 'lenis/react'
import { useEffect } from 'react'

/** Блокирует прокрутку (Lenis + body overflow), пока active=true. */
export function useScrollLock(active: boolean) {
	const lenis = useLenis()
	useEffect(() => {
		if (!active) return
		lenis?.stop()
		const prev = document.body.style.overflow
		document.body.style.overflow = 'hidden'
		return () => {
			lenis?.start()
			document.body.style.overflow = prev
		}
	}, [active, lenis])
}
