import React from 'react'
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css' // requires a loader
import AVTODOPROYEKT from './img/АВТОДОПРОЕКТ.png'
import Analytical_Center from './img/АналитическийЦентрМГУ.png'
import GeoInzhStroy from './img/ГеоИнжСтрой.png'
import GeoSpetsIzyskaniya from './img/ГеоСпецИзыскания.png'
import InzhGeo from './img/ИнжГео.png'
import LENMORNIIPROYEKT from './img/ЛЕНМОРНИИПРОЕКТ.png'
import MAGE from './img/МАГЭ.png'
import Metrogiprotrans from './img/Метрогипртранс.png'
import NOEKS from './img/НОЭКС.jpg'
import NPC_Osnova from './img/НПЦ_Основа.png'
import PETRAKOMPLEKT from './img/ПЕТРАКОМПЛЕКТ.png'
import Mosgeoproyekt from './img/Мосгеопроект.png'
import RusskayaBurovayaKompaniya from './img/РусскаяБуроваяКомпания.png'
import SpetsProyektPut from './img/СпецПроектПуть.png'
import ENERGOTRANSPROYEKT from './img/ЭНЕРГОТРАНСПРОЕКТ.png'
import NPTSIZ from './img/НПЦИЗ.png'
import ROSZHELDORPROYEKT from './img/РОСЖЕЛДОРПРОЕКТ.svg'
import GEOPROYEKTIZYSKANIYA from './img/ГЕОПРОЕКТИЗЫСКАНИЯ.png'
import ktbzhb from './img/ктб-жб.png'
import Geogradstroy from './img/Геоградстрой.png'
import Delta40 from './img/Дельта40.png'
import ZHELDORPROYEKT from './img/ЖЕЛДОРПРОЕКТ.svg'
import Inzhgeokom from './img/Инжгеоком.png'
import MosEnergoProyet from './img/МосЭнергоПроет.png'
import Nizhegordaproyekt from './img/Нижегордапроект.png'
import NITS from './img/ниц.png'
import PermaprostInzhiniring from './img/Пермапрост-Инжиниринг.png'
import Proinzhgrupp from './img/Проинжгрупп.png'
import SakhalinTISIZ from './img/Сахалин_ТИСИЗ.png'
import SoyuzGeoStroyServis from './img/СоюзГеоСтройСервис.png'
import TikhookeanskayaInzhKompaniya from './img/Тихоокеанская-инж.компания.png'
import EUSP from './img/ЭУСП.png'
import MoskovskayaKollegiyaAdvokatov from './img/МосковскаяКоллегияАдвокатов.png'
import TSGI from './img/ЦГИ.gif'
import GIPROSTROYMOST from './img/ГИПРОСТРОЙМОСТ.png'
import mosgiptotrans from './img/mosgiptotrans.jpg'
import Stroyizyskaniya from './img/Стройизыскания.png'
import rosatom_gspi from './img/rosatom_gspi.png'
import Rosgeologiya from './img/Росгеология.png'
import SPB_NII_ENERGOIZYSKANIYA from './img/СПБ_НИИ_ЭНЕРГОИЗЫСКАНИЯ.jpeg'



import './Customers.css'
export default function Customers() {
	return (
		<>
			<div className="customers-objects">
				<h1>Наши заказчики</h1>
				<Carousel
					className="customers-carousel"
					showStatus={false}
					showThumbs={false}
					showArrows={true}
					infiniteLoop={true}
					autoPlay={true}
					swipeable={true}
					stopOnHover={true}
					transitionTime={1000}
					dynamicHeight={false}
				>
					<div className="customers-object">
						<div className="table">
							<div className="cart">
								<div
									className="customer"
									style={{ backgroundImage: `url(${AVTODOPROYEKT})` }}
								></div>
							</div>
							<div className="cart">
								<div
									className="customer"
									style={{ backgroundImage: `url(${Analytical_Center})` }}
								></div>
							</div>
							<div className="cart">
								<div
									className="customer"
									style={{ backgroundImage: `url(${GeoInzhStroy})` }}
								></div>
							</div>
							<div className="cart">
								<div
									className="customer"
									style={{ backgroundImage: `url(${GeoSpetsIzyskaniya})` }}
								></div>
							</div>
							<div className="cart">
								<div
									className="customer"
									style={{ backgroundImage: `url(${InzhGeo})` }}
								></div>
							</div>
							<div className="cart">
								<div
									className="customer"
									style={{ backgroundImage: `url(${LENMORNIIPROYEKT})` }}
								></div>
							</div>
							<div className="cart">
								<div
									className="customer"
									style={{ backgroundImage: `url(${MAGE})` }}
								></div>
							</div>
							<div className="cart">
								<div
									className="customer"
									style={{ backgroundImage: `url(${PETRAKOMPLEKT})` }}
								></div>
							</div>
							<div className="cart">
								<div
									className="customer"
									style={{ backgroundImage: `url(${Metrogiprotrans})` }}
								></div>
							</div>
							<div className="cart">
									<div
										className="customer"
										style={{ backgroundImage: `url(${NPC_Osnova})` }}
									></div>
								</div>								
						</div>
					</div>
					<div className="customers-object">
						<div className="table">							
								<div className="cart">
									<div
										className="customer"
										style={{ backgroundImage: `url(${Mosgeoproyekt})` }}
									></div>
								</div>													
								<div className="cart">
									<div
										className="customer"
										style={{ backgroundImage: `url(${RusskayaBurovayaKompaniya})` }}
									></div>
								</div>
								<div className="cart">
									<div
										className="customer"
										style={{ backgroundImage: `url(${NOEKS})` }}
									></div>
								</div>
								<div className="cart">
									<div
										className="customer"
										style={{ backgroundImage: `url(${SpetsProyektPut})` }}
									></div>
								</div>
								<div className="cart">
									<div
										className="customer"
										style={{ backgroundImage: `url(${ENERGOTRANSPROYEKT})` }}
									></div>
								</div>
								<div className="cart">
									<div
										className="customer"
										style={{ backgroundImage: `url(${NPTSIZ})` }}
									></div>
								</div>
								<div className="cart">
									<div
										className="customer"
										style={{ backgroundImage: `url(${ROSZHELDORPROYEKT})` }}
									></div>
								</div>
								<div className="cart">
									<div
										className="customer"
										style={{ backgroundImage: `url(${GIPROSTROYMOST})` }}
									></div>
								</div>
								<div className="cart">
									<div
										className="customer"
										style={{ backgroundImage: `url(${rosatom_gspi})` }}
									></div>
								</div>
								<div className="cart">
									<div
										className="customer"
										style={{ backgroundImage: `url(${Stroyizyskaniya})` }}
									></div>
								</div>
								<div className="cart">
									<div
										className="customer"
										style={{ backgroundImage: `url(${Delta40})` }}
									></div>
								</div>
								<div className="cart">
									<div
										className="customer"
										style={{ backgroundImage: `url(${ZHELDORPROYEKT})` }}
									></div>
								</div>
						</div>
					</div>
					<div className="customers-object">
						<div className="table">							
								<div className="cart">
									<div
										className="customer"
										style={{ backgroundImage: `url(${Inzhgeokom})` }}
									></div>
								</div>													
								<div className="cart">
									<div
										className="customer"
										style={{ backgroundImage: `url(${MosEnergoProyet})` }}
									></div>
								</div>
								<div className="cart">
									<div
										className="customer"
										style={{ backgroundImage: `url(${Nizhegordaproyekt})` }}
									></div>
								</div>
								<div className="cart">
									<div
										className="customer"
										style={{ backgroundImage: `url(${NITS})` }}
									></div>
								</div>
								<div className="cart">
									<div
										className="customer"
										style={{ backgroundImage: `url(${PermaprostInzhiniring})` }}
									></div>
								</div>
								<div className="cart">
									<div
										className="customer"
										style={{ backgroundImage: `url(${Proinzhgrupp})` }}
									></div>
								</div>
								<div className="cart">
									<div
										className="customer"
										style={{ backgroundImage: `url(${SakhalinTISIZ})` }}
									></div>
								</div>
								<div className="cart">
									<div
										className="customer"
										style={{ backgroundImage: `url(${SoyuzGeoStroyServis})` }}
									></div>
								</div>
								<div className="cart">
									<div
										className="customer"
										style={{ backgroundImage: `url(${TikhookeanskayaInzhKompaniya})` }}
									></div>
								</div>
								<div className="cart">
									<div
										className="customer"
										style={{ backgroundImage: `url(${EUSP})` }}
									></div>
								</div>
								<div className="cart">
									<div
										className="customer"
										style={{ backgroundImage: `url(${MoskovskayaKollegiyaAdvokatov})` }}
									></div>
								</div>
								<div className="cart">
									<div
										className="customer"
										style={{ backgroundImage: `url(${TSGI})` }}
									></div>
								</div>
						</div>
					</div>									
				</Carousel>
			</div>
		</>
	)
}
