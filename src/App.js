import React, { useState, useEffect } from 'react'

import './App.css'
import Navigation from './Components/Navigation/Navigation'
import Context from './context'

function App() {
	const [showPrice, setShowPrice] = useState(false)

	const [showScroll, setShowScroll] = useState(false)

	useEffect(() => {
		document.body.addEventListener('scroll', handleScroll)
		// document
		// 	.querySelectorAll('*')
		// 	.forEach((element) =>
		// 		element.addEventListener('scroll', ({ target }) =>
		// 			console.log(target, target.parent)
		// 		)
		// 	)

		return () => {
			document.body.removeEventListener('scroll', handleScroll)
		}
	}, [])

	function handleScroll() {
		if (document.body.scrollTop > 100) {
			setShowScroll(true)
		} else {
			setShowScroll(false)
		}
	}

	return (
		<div className="main-wrapper">
			<Context.Provider
				value={{
					showPrice,
					setShowPrice,
				}}
			>
				<div className="content-wrapper">
					<Navigation />
					<p className="footer__copy">
						&#169; 2008 - {new Date().getFullYear()} АО "МОСТДОРГЕОТРЕСТ"
					</p>
				</div>
			</Context.Provider>
			<div
				className={showScroll ? 'scrolltop show-scroll' : 'scrolltop'}
				id="scroll-top"
				onClick={() => {
					document.body.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
				}}
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
					<path d="m6.293 13.293 1.414 1.414L12 10.414l4.293 4.293 1.414-1.414L12 7.586z"></path>
				</svg>
			</div>
		</div>
	)
}

export default App
