import {
	createContext,
	useCallback,
	useContext,
	useState,
	type ReactNode,
} from 'react'

function getCookie(name: string): string | null {
	const nameEQ = name + '='
	const ca = document.cookie.split(';')
	for (let c of ca) {
		c = c.trim()
		if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length)
	}
	return null
}

interface UIContextValue {
	isPriceOpen: boolean
	openPrice: () => void
	closePrice: () => void
	isCookieVisible: boolean
	acceptCookies: () => void
}

const UIContext = createContext<UIContextValue | null>(null)

export function useUI(): UIContextValue {
	const ctx = useContext(UIContext)
	if (!ctx) throw new Error('useUI must be used within <UIProvider>')
	return ctx
}

export function UIProvider({ children }: { children: ReactNode }) {
	const [isPriceOpen, setPriceOpen] = useState(false)
	const [isCookieVisible, setCookieVisible] = useState(
		() => !getCookie('allowCookies')
	)

	const openPrice = useCallback(() => setPriceOpen(true), [])
	const closePrice = useCallback(() => setPriceOpen(false), [])

	const acceptCookies = useCallback(() => {
		const date = new Date()
		date.setTime(date.getTime() + 7 * 24 * 60 * 60 * 1000)
		document.cookie =
			'allowCookies=1; expires=' + date.toUTCString() + '; path=/'
		setCookieVisible(false)
	}, [])

	return (
		<UIContext.Provider
			value={{ isPriceOpen, openPrice, closePrice, isCookieVisible, acceptCookies }}
		>
			{children}
		</UIContext.Provider>
	)
}
