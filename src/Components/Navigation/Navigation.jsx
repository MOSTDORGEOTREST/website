import React, { useState, useContext } from 'react'
import { Routes, Route, NavLink } from 'react-router-dom'
import { HashLink } from 'react-router-hash-link'

import logo from './mdgt.png'
import menu from './bx-menu.svg'
import close from './close-fill.svg'

import './Navigation.css'

import Context from '../../context'

import Home from '../Home/Home'
// import NotFound from '../NotFound/NotFound'

export default function Navigation() {
	const [toggleNav, setToggleNav] = useState(false)
	const { setShowPrice } = useContext(Context)

	function openNav() {
		const body = document.getElementById('body')
		body.classList.add('body-hidden')
		setToggleNav(true)
	}

	function closeNav() {
		const body = document.getElementById('body')
		body.classList.remove('body-hidden')
		setToggleNav(false)
	}

	function onPriceClick(event) {
		event.preventDefault()
		if (toggleNav) {
			closeNav()
		}
		const body = document.getElementById('body')
		body.classList.add('body-hidden')
		setShowPrice(true)
	}

	function wrapperClick(event) {
		// console.log(event.target, event.currentTarget)
		if (event.target === event.currentTarget) {
			closeNav()
		}
	}

	return (
		<>
			<header className="navbar-mdgt">
				<nav className="container-fluid-mdgt container-mdgt">
					<div className="navbar-upper">
						<NavLink to="/" className="navbar-brand">
							<img className="navbar-brand__icon" src={logo} alt="logo" />
						</NavLink>
						<div className="navbar-upper__title">
							ГЕОТЕХНИЧЕСКАЯ ЛАБОРАТОРИЯ
							<br />
							МОСТДОРГЕОТРЕСТ
						</div>
						<a
							href="tel:+74956566910"
							target="_blank"
							rel="noreferrer"
							className="nabar__phone"
						>
							<div className="nabar__phone-number">+7 495 656 69 10</div>
							<div className="nabar__phone-number">+7 495 656 65 80</div>
							<div className="nabar__phone-number">+7 495 656 68 59</div>
							<div className="nabar__phone-sub">Позвонить нам</div>
						</a>
					</div>

					<div
						className={
							toggleNav
								? 'navbar-collapse-wrapper navbar-collapse-wrapper-show'
								: 'navbar-collapse-wrapper'
						}
						id="navbar-collapse-wrapper"
						onClick={wrapperClick}
					>
						<div
							className={
								toggleNav
									? 'navbar-collapse navbar-collapse-show'
									: 'navbar-collapse'
							}
							id="navbar-collapse"
						>
							<ul className="navbar-nav">
								<li className="nav-item">
									<NavLink className="nav-link" to="/" onClick={closeNav}>
										Главная
									</NavLink>
								</li>
								<li className="nav-item">
									<HashLink
										smooth
										to="/#about"
										className="nav-link"
										onClick={closeNav}
									>
										О лаборатории
									</HashLink>
								</li>
								<li className="nav-item">
									<HashLink
										smooth
										to="/#tests"
										className="nav-link"
										onClick={closeNav}
									>
										Испытания грунтов
									</HashLink>
								</li>
								<li className="nav-item">
									<HashLink className="nav-link" smooth to="/#Calculations">
										Расчеты
									</HashLink>
								</li>
								{/* <li className="nav-item">
									<a
										className="nav-link"
										href="https://stabilometr.ru/"
										target="_blank"
										rel="noopener noreferrer"
									>
										Производство оборудования
									</a>
								</li> */}
								{/* <li className="nav-item">
									<HashLink smooth to="/#papers" className="nav-link">
										Статьи
									</HashLink>
								</li> */}
								{/* <li className="nav-item">
									<HashLink
										smooth
										to="/#courses"
										className="nav-link"
										onClick={closeNav}
									>
										Курсы
									</HashLink>
								</li> */}
								<li className="nav-item">
									<HashLink
										smooth
										to="/#contacts"
										className="nav-link"
										onClick={closeNav}
									>
										Контакты
									</HashLink>
								</li>
							</ul>

							<div className="nav__close" id="nav-close" onClick={closeNav}>
								<img src={close} alt="close" />
							</div>
						</div>
					</div>

					<div className="nav__toggle" id="nav-toggle" onClick={openNav}>
						<img src={menu} alt="Menu" />
					</div>
				</nav>
				<div className="shadow"></div>
			</header>

			<Routes>
				<Route path="/" element={<Home />} />
				{/* 404 Page */}
				{/* <Route path="*" element={<NotFound />} /> */}
			</Routes>
		</>
	)
}
