import React, { useContext } from 'react'

import './Cookies.css'

import Context from '../../context'

export default function Cookies() {
	const { setShowCookie } = useContext(Context)

	function acceptCookies() {
		var expires = ''
		var date = new Date()
		date.setTime(date.getTime() + 7 * 24 * 60 * 60 * 1000)
		expires = '; expires=' + date.toUTCString()
		document.cookie = 'allowCookies=' + ('1' || '') + expires + '; path=/'
		setShowCookie(false)
	}

	function eraseCookie() {
		document.cookie =
			'allowCookies=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
		setShowCookie(false)
	}

	return (
		<>
			<div className="cookies__box">
				<div className="cookies__info">
					<div>Для работы сайта мы используем файлы cookie.</div>
				</div>
				<div className="cookies__accept-btns">
					{/* <button
						type="button"
						title="Закрыть окно"
						className="cookies__accept-btn"
						onClick={eraseCookie}
					>
						Закрыть
					</button> */}
					<button
						type="button"
						title="Принять cookie"
						className="cookies__accept-btn"
						onClick={acceptCookies}
					>
						Принять
					</button>
				</div>
			</div>
		</>
	)
}
