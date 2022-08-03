import React from 'react'
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css' // requires a loader

import Aeroport_Sheremetyevo from './imgs/Аэропорт_Шереметьево.jpg'
import Biznes_tsentr_Skolkovo from './imgs/Бизнес_центр_Сколково.jpg'
import Big_Ice_Palace_Big_Sochi from './imgs/Большой_ледовый_дворец_Большой_г._Сочи.jpg'
import Bolshoy_Moskvoretskiy_most_Moskva from './imgs/Большой_Москворецкий_мост_г._Москва.jpg'
import Dom_pravitelstva_Rossiyskoy_Federatsii from './imgs/Дом_правительства_Российской_Федерации.jpg'
import Zhivopisnyy_most from './imgs/Живописный_мост.jpg'
import Krymskiy_most from './imgs/Крымский_мост.jpg'
import Most_cherez_Kamu from './imgs/Мост_через_Каму_Татарстан.jpg'
import luga from './imgs/Усть-луга.jpg'

import Aeroport_Sheremetyevo_mob from './imgs/Аэропорт_Шереметьево_моб.jpg'
import Biznes_tsentr_Skolkovo_mob from './imgs/Бизнес_центр_Сколково_моб.jpg'
import Big_Ice_Palace_Big_Sochi_mob from './imgs/Большой_ледовый_дворец_Большой_г._Сочи_моб.jpg'
import Bolshoy_Moskvoretskiy_most_Moskva_mob from './imgs/Большой_Москворецкий_мост_г._Москва_моб.jpg'
import Dom_pravitelstva_Rossiyskoy_Federatsii_mob from './imgs/Дом_правительства_Российской_Федерации_моб.jpg'
import Zhivopisnyy_most_mob from './imgs/Живописный_мост_моб.jpg'
import Krymskiy_most_mob from './imgs/Крымский_мост_моб.jpg'

import './Objects.css'

import useWindowDimensions from './windowResizeHook.jsx'

export default function Objects() {
	const { width } = useWindowDimensions()

	return (
		<>
			<div className="home-objects">
				{width > 768 ? (
					<Carousel
						className="carousel"
						showStatus={false}
						showThumbs={false}
						showArrows={true}
						infiniteLoop={true}
						autoPlay={false}
						swipeable={false}
						stopOnHover={true}
						transitionTime={1000}
						dynamicHeight={false}
					>
						<div className="object" style={{ backgroundImage: `url(${luga})` }}>
							<div className="legend">
								Порт в Усть-Луге{' '}
								<div className="legend-copy">Фото: www.gazprom.ru</div>
							</div>
						</div>
						<div
							className="object"
							style={{ backgroundImage: `url(${Aeroport_Sheremetyevo})` }}
						>
							<div className="legend">
								Аэропорт Шереметьево <div className="legend-copy"></div>
							</div>
						</div>
						<div
							className="object"
							style={{
								backgroundImage: `url(${Bolshoy_Moskvoretskiy_most_Moskva})`,
							}}
						>
							<div className="legend">
								Большой Москворецкий мост{' '}
								<div className="legend-copy">Фото: www.msmap.ru</div>
							</div>
						</div>
						<div
							className="object"
							style={{ backgroundImage: `url(${Biznes_tsentr_Skolkovo})` }}
						>
							<div className="legend">
								Бизнес-центр Сколково{' '}
								<div className="legend-copy">
									Фото: Школа управления «Сколково»
								</div>
							</div>
						</div>
						<div
							className="object"
							style={{ backgroundImage: `url(${Krymskiy_most})` }}
						>
							<div className="legend">
								Крымский мост <div className="legend-copy"></div>
							</div>
						</div>
						<div
							className="object"
							style={{
								backgroundImage: `url(${Dom_pravitelstva_Rossiyskoy_Federatsii})`,
							}}
						>
							<div className="legend">
								Дом правительства Российской Федерации{' '}
								<div className="legend-copy">
									Фото: Риа Новости | Екатерина Чеснокова
								</div>
							</div>
						</div>
						<div
							className="object"
							style={{ backgroundImage: `url(${Zhivopisnyy_most})` }}
						>
							<div className="legend">
								Живописный мост{' '}
								<div className="legend-copy">Фото: М. Денисова. Mos.ru</div>
							</div>
						</div>
						<div
							className="object"
							style={{ backgroundImage: `url(${Big_Ice_Palace_Big_Sochi})` }}
						>
							<div className="legend">
								Большой ледовый дворец <div className="legend-copy"></div>
							</div>
						</div>
						<div
							className="object"
							style={{ backgroundImage: `url(${Most_cherez_Kamu})` }}
						>
							<div className="legend">
								Мост через Каму <div className="legend-copy"></div>
							</div>
						</div>
					</Carousel>
				) : (
					<Carousel
						className="carousel"
						showStatus={false}
						showThumbs={false}
						showArrows={true}
						infiniteLoop={true}
						autoPlay={false}
						swipeable={true}
						stopOnHover={true}
						transitionTime={1000}
						dynamicHeight={false}
					>
						<div className="object" style={{ backgroundImage: `url(${luga})` }}>
							<div className="legend">
								Порт в Усть-Луге{' '}
								<div className="legend-copy">Фото: www.gazprom.ru</div>
							</div>
						</div>
						<div
							className="object"
							style={{ backgroundImage: `url(${Aeroport_Sheremetyevo_mob})` }}
						>
							<div className="legend">
								Аэропорт Шереметьево <div className="legend-copy"></div>
							</div>
						</div>
						<div
							className="object"
							style={{
								backgroundImage: `url(${Bolshoy_Moskvoretskiy_most_Moskva_mob})`,
							}}
						>
							<div className="legend">
								Большой Москворецкий мост{' '}
								<div className="legend-copy">Фото: www.msmap.ru</div>
							</div>
						</div>
						<div
							className="object"
							style={{ backgroundImage: `url(${Biznes_tsentr_Skolkovo_mob})` }}
						>
							<div className="legend-copy">
								Фото: Школа управления «Сколково»
							</div>
						</div>
						<div
							className="object"
							style={{ backgroundImage: `url(${Krymskiy_most_mob})` }}
						>
							<div className="legend">
								Крымский мост <div className="legend-copy"></div>
							</div>
						</div>
						<div
							className="object"
							style={{
								backgroundImage: `url(${Dom_pravitelstva_Rossiyskoy_Federatsii_mob})`,
							}}
						>
							<div className="legend">
								Дом правительства Российской Федерации
								<div className="legend-copy">
									Фото: Риа Новости | Екатерина Чеснокова
								</div>
							</div>
						</div>
						<div
							className="object"
							style={{ backgroundImage: `url(${Zhivopisnyy_most_mob})` }}
						>
							<div className="legend">
								Живописный мост{' '}
								<div className="legend-copy">Фото: М. Денисова. Mos.ru</div>
							</div>
						</div>
						<div
							className="object"
							style={{
								backgroundImage: `url(${Big_Ice_Palace_Big_Sochi_mob})`,
							}}
						>
							<div className="legend">
								Большой ледовый дворец <div className="legend-copy"></div>
							</div>
						</div>
						<div
							className="object"
							style={{ backgroundImage: `url(${Most_cherez_Kamu})` }}
						>
							<div className="legend">
								Мост через Каму <div className="legend-copy"></div>
							</div>
						</div>
					</Carousel>
				)}
			</div>
		</>
	)
}
