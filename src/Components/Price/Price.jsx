import React, { useContext } from 'react'

import './Price.css'
import Context from '../../context'
import close from '../Navigation/close-fill.svg'
import download from './download.svg'

import pdf from './ПРАЙС-ЛИСТ от 01.01.2025.pdf'
import xlsx from './ПРАЙС-ЛИСТ от 01.01.2025.xlsx'

export default function Price() {
	const { setShowPrice } = useContext(Context)

	function onClosePrice() {
		const body = document.getElementById('body')
		body.classList.remove('body-hidden')
		setShowPrice(false)
	}

	function wrapperClick(event) {
		// console.log(event.target, event.currentTarget)
		if (event.target === event.currentTarget) {
			onClosePrice()
		}
	}

	return (
		<>
			<div className="prices__wrapper" onClick={wrapperClick}>
				<div className="prices">
					<div className="prices__buttons">
						<a
							href={xlsx}
							target="_blank"
							rel="noopener noreferrer"
							title="Скачать xls"
							className="prices__downl"
						>
							<img src={download} alt="download" />
							<p>XLS</p>
						</a>
						<a
							href={pdf}
							target="_blank"
							rel="noopener noreferrer"
							title="Скачать pdf"
							className="prices__downl"
						>
							<img src={download} alt="download" />
							PDF
						</a>
						<div className="prices__close" onClick={onClosePrice}>
							<img src={close} alt="close" />
						</div>
					</div>
					<iframe
						width="912px"
						height="13900px"
						frameBorder="0"
						title="table"
						src="https://docs.google.com/spreadsheets/d/e/2PACX-1vQQGvME2qSevqiO8nSyZ3cXwa28LLQQyA63Vw7E2ysySDexk92TqvvRtv8Ej0fjBw/pubhtml?gid=164149930&amp;single=true&amp;widget=true&amp;headers=false"
					></iframe>
					{/* <iframe
						width="912"
						height="13900"
						frameBorder="0"
						scrolling="no"
						src="https://onedrive.live.com/embed?resid=F8FDB7ADA61C95BE%2149818&amp;authkey=%21AFTlMM83_Zrl-As&amp;em=2&amp;wdAllowInteractivity=False&amp;Item='%D0%9B%D0%B8%D1%81%D1%821'!A1%3AG336&amp;wdDownloadButton=True&amp;wdInConfigurator=True&amp;wdInConfigurator=True&amp;edesNext=false&amp;ejss=false"
					></iframe> */}
				</div>
			</div>
		</>
	)
}
