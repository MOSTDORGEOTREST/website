import React from 'react'

import './Calculations.css'

import welcome from './расчёты.png'

export default function Calculations() {
	return (
		<>
			<div className="home-calculations" id="Calculations">
				<div className="home-blur"></div>
				<div className="calculations__content">
					<div className="calculations__main">
						<div className="calculations__main-title">
							<h1 className="calculations__main-title_main">Рассчеты</h1>
							<h3 className="calculations__main-title_sub">
								В нашей лаборатории проводятся геотехнические расчёты грунтовых
								сооружений, таких как насыпи и откосы, с использованием ПК
								Plaxis, а также аналитическими методами.
							</h3>
							<button className="main-title_btn" onClick={() => {}}>
								Посмотреть цены
							</button>
						</div>
						<div className="main_title_img">
							<img src={welcome} alt="Calculations" />
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
