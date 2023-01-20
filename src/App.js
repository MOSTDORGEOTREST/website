import React, { useState, useEffect } from 'react'

import './App.css'
// import Navigation from './Components/Navigation/Navigation'
import Context from './context'
import FloatCall from './Components/FloatCall/FloatCall'
import Cookies from './Components/Cookies/Cookies'

import truc from './truc.gif'

const Navigation = React.lazy(() =>
	import('./Components/Navigation/Navigation')
)

const FloatVideo = React.lazy(() =>
	import('./Components/FloatVideo/FloatVideo')
)

function App() {
	const [showPrice, setShowPrice] = useState(false)

	const [showScroll, setShowScroll] = useState(false)

	const [showCookie, setShowCookie] = useState(true)

	useEffect(() => {
		window.addEventListener('scroll', handleScroll)

		if (!getCookie()) {
			setShowCookie(true)
		} else {
			setShowCookie(false)
		}
		// document
		// 	.querySelectorAll('*')
		// 	.forEach((element) =>
		// 		element.addEventListener('scroll', ({ target }) =>
		// 			console.log(target, target.parent)
		// 		)
		// 	)

		return () => {
			window.removeEventListener('scroll', handleScroll)
		}
	}, [])

	function handleScroll() {
		if (this.scrollY > 100) {
			setShowScroll(true)
		} else {
			setShowScroll(false)
		}
	}

	function getCookie() {
		var nameEQ = 'allowCookies='
		var ca = document.cookie.split(';')
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i]
			while (c.charAt(0) === ' ') c = c.substring(1, c.length)
			if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
		}
		return null
	}

	return (
		<div className="main-wrapper">
			<React.Suspense
				fallback={
					<div className="loader-wrapper">
						<div className="loading-gif">
							<img src={truc} alt="Loading..."></img>
						</div>
						<div className="loading-sub">Загружаем...</div>
						<div className="loading-licence">Animated Icon: lordicon.com</div>
					</div>
				}
			>
				<Context.Provider
					value={{
						showPrice,
						setShowPrice,
						showCookie,
						setShowCookie,
					}}
				>
					<div className="content-wrapper">
						<Navigation />
						<p className="footer__copy">
							&#169; {new Date().getFullYear()} АО «МОСТДОРГЕОТРЕСТ»{' '}
							<a href="#">Политика конфиденциальности</a>
						</p>
						{showCookie ? <Cookies /> : null}

						{/* <FloatVideo /> */}
					</div>
				</Context.Provider>

				<div
					className={showScroll ? 'scrolltop show-scroll' : 'scrolltop'}
					id="scroll-top"
					onClick={() => {
						window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
					}}
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
						<path d="m6.293 13.293 1.414 1.414L12 10.414l4.293 4.293 1.414-1.414L12 7.586z"></path>
					</svg>
				</div>

				<FloatCall />
			</React.Suspense>
		</div>
	)
}

export default App
