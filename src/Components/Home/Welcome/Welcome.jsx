import React, { useContext } from 'react'

import Context from '../../../context'
import welcome from './imgs/welcome.png'
import hill from './imgs/rock.svg'
import snow from './imgs/snowflake.svg'
import wave from './imgs/wave.svg'
import chem from './imgs/bxs-flask.svg'
import phys from './imgs/scales-2-line.svg'
import mech from './imgs/mech.png'

import './Welcome.css'

export default function Welcome() {
	const { setShowPrice } = useContext(Context)

	function onShowPrice() {
		const body = document.getElementById('body')
		body.classList.add('body-hidden')
		setShowPrice(true)
	}

	return (
		<>
			<div className="home-welcome" id="welcome">
				<div className="welcome__main">
					<div className="welcome__main-title">
						<h1 className="welcome__main-title_main">
							Лидер в лабораторных
							<br />
							испытаниях грунтов
						</h1>
						<h3 className="welcome__main-title_sub">
							В нашей лаборатории для выполнения испытаний грунтов мы используем
							самое передовое оборудование отечественных и зарубежных
							производителей
						</h3>
						<button className="main-title_btn" onClick={onShowPrice}>
							Посмотреть цены
						</button>
					</div>
					<div className="main_title_img">
						<img src={welcome} alt="Welcome" />
					</div>
				</div>
				<div className="welcome__labs">
					<div className="labs_blur"></div>
					<div className="labs-item">
						<img src={phys} alt="" />
						Определение
						<br />
						физических
						<br />
						свойств грунтов
					</div>
					<div className="labs-item">
						<img src={mech} alt="" />
						Определение
						<br />
						механических
						<br />
						свойств грунтов
					</div>
					<div className="labs-item">
						<img src={wave} alt="" />
						Динамическая
						<br />
						лаборатория
					</div>
					<div className="labs-item">
						<img src={snow} alt="" />
						Мерзлотная
						<br />
						лаборатория
					</div>
					<div className="labs-item">
						<img src={hill} alt="" />
						Скальная
						<br />
						лаборатория
					</div>
					<div className="labs-item">
						<img src={chem} alt="" />
						Химическая
						<br />
						лаборатория
					</div>
				</div>
			</div>
		</>
	)
}
