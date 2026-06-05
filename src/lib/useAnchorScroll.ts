import { useLenis } from 'lenis/react'
import { useCallback, type MouseEvent } from 'react'

/**
 * Возвращает обработчик клика для якорных ссылок (#id) с плавным скроллом
 * через Lenis (с фолбэком на нативный scrollIntoView).
 */
export function useAnchorScroll() {
	const lenis = useLenis()

	return useCallback(
		(e: MouseEvent<HTMLElement>, href: string) => {
			if (!href.startsWith('#')) return
			const el = document.querySelector(href)
			if (!el) return
			e.preventDefault()
			if (lenis) {
				lenis.scrollTo(el as HTMLElement, { offset: -80 })
			} else {
				;(el as HTMLElement).scrollIntoView({ behavior: 'smooth' })
			}
		},
		[lenis]
	)
}
