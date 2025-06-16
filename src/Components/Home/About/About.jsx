import React from 'react'

import './About.css'

import Customers from '../Customers/Customers'

// ИКОНКИ
import arrowDown from './arrow-down.svg'
import pdf from './pdf.svg'
import globe from './bx-street-view.svg'
import back_3d from './3d_back.png'

// ДОКИ АО
import AO_doc_1 from './AO_docs/Мосстройсертификация до 09.01.2026 г.pdf'
import AO_doc_2 from './AO_docs/Росаккредитация-от-23.04.2020-г.pdf'
import AO_doc_3 from './AO_docs/РОСС RU.0001.21АГ09 от 05.05.2025.pdf'
import AO_doc_4 from './AO_docs/Сертификат ИСО СМК - до 24.09.2026.pdf'
import AO_doc_5 from './AO_docs/СРО - Выписка из Реестра членов от 04.05.2025.pdf'

// ДОКИ ООО
import OOO_doc_1 from './OOO_docs/Аккредитация-Промышленная-безопасность-до-03.09.2026-г.pdf'
import OOO_doc_2 from './OOO_docs/Аккредитация - Мосстройсертификация - до 05.06.2026 г.pdf'
import OOO_doc_3 from './OOO_docs/Сертификат ИСО - СМК до 21.06.2026.pdf'
import OOO_doc_4 from './OOO_docs/СРО - Выписка из Реестра членов от 04.05.2025 г.pdf'

// Положение
import mosgosexpert from './mosgosexpert.pdf'

// ИЗОБРАЖЕНИЯ ПРИБОРОВ
import fridge from './devices/Fridge.png'
import odometr from './devices/Odometr.png'
import resonant from './devices/Resonant.png'
import shear_rock from './devices/Shear_rock.png'
import stamp from './devices/Stamp.png'
import trixal from './devices/Trixal.png'
import wille from './devices/Wille.png'
import wille_rock from './devices/Wille_rock.png'

// ОБРАЗЦЫ ПРОТОКОЛОВ
import p1 from './Tests_docs/Компрессионное-сжатие-oбразец.pdf'
import p3 from './Tests_docs/Одноплоскостной-срез-oбразец.pdf'
import p4 from './Tests_docs/Трёхосное-сжатие-вибро-oбразец.pdf'
import p5 from './Tests_docs/Трехосное-сжатие-с-разгрузкой-oбразец.pdf'
import p6 from './Tests_docs/Трёхосное-сжатие-F-C-E-oбразец.pdf'
import p7 from './Tests_docs/Сейсморазжижжение-oбразец.pdf'
import p8 from './Tests_docs/Первичная-и-вторичная-консолидация-oбразец.pdf'
import p10 from './Tests_docs/Plaxis-OCR-oбразец-1.pdf'
import p11 from './Tests_docs/Plaxis-Ohde-oбразец.pdf'
import p12 from './Tests_docs/Plaxis-Дилатансия-срез-oбразец.pdf'
import p13 from './Tests_docs/Коэффициент-бокового-давления-oбразец.pdf'
import p14 from './Tests_docs/Plaxis-Разгрузка-oбразец.pdf'
import p15 from './Tests_docs/Резонансная-колонка-образец.pdf'

export default function About() {
	function showList(event) {
		const accordionContent = event.currentTarget.parentNode.childNodes[1]

		if (event.currentTarget.parentNode.classList.contains('show')) {
			accordionContent.style.height = 0 + 'px'
			event.currentTarget.parentNode.classList.remove('show')
		} else {
			accordionContent.style.height = accordionContent.scrollHeight + 'px'
			event.currentTarget.parentNode.classList.add('show')
		}
	}

	return (
		<>
			<div className="home-about" id="about">
				{/* <div className="home-blur"></div> */}
				<div className="about-content">
					<h1>О лаборатории</h1>
					<div className="about__wrapper">
						<div className="about__info">
							<p>
								Геотехническая лаборатория АО «МОСТДОРГЕОТРЕСТ» была создана в
								2008 году и за время своего существования вышла на одно из
								ведущих мест среди организаций, занимающихся лабораторным
								анализом грунтов и грунтовых вод.
							</p>
							<p>
								Наша геотехническая лаборатория предлагает
								высококвалифицированные услуги по определению
								физико-механических свойств грунтов, анализу химического состава
								грунтов и грунтовых вод, определению их свойств в целях
								классификации согласно международным стандартам ASTM и
								отечественным ГОСТам.
							</p>
							<p>
								Геотехническая лаборатория оснащена высокоточным аналитическим
								оборудованием отечественного и зарубежного производства, в том
								числе pH-метры, системы капиллярного электрофореза, установки
								трехосного сжатия, вибростабилометры и др.
							</p>
							<p>
								Геотехническая лаборатория АО «МОСТДОРГЕОТРЕСТ» аккредитована в
								Системе аккредитации испытательных лабораторий (центров)
								согласно ГОСТ ISO/IEC 17025-2019. Используемая в работе система
								менеджмента качества обеспечивает контроль за проведением
								анализа на каждой стадии, что гарантирует высокую точность
								измерений.
							</p>
							<p>
								Услуги, которые предоставляет геологическая лаборатория,
								включают в себя инженерно-геологические, геотехнические
								лабораторные исследования. Благодаря совершенному техническому
								оснащению, высочайшему уровню ответственности, квалификации и
								опыту специалистов лаборатория способна проводить исследования
								любой сложности.
							</p>
						</div>
						<a
							className="main-title_btn main-title_btn_link-icon about-3d-btn"
							target="_blank"
							href="3d/output-3/index.html"
						>
							<img src={back_3d} alt="" className="about-3d-btn__image" />
							<div className="about-3d-btn__content">
								<img src={globe} alt="globe"></img>
								<div>3D-тур по лаборатории</div>
							</div>
						</a>
						<div className="about-docs">
							<div className="about-docs__card-wrapper">
								<div className="about-docs__card" onClick={showList}>
									<div className="docs__card-title">
										<h3 className="docs__card-title_main">
											Разрешительные документы
										</h3>
										<div className="docs__card-title_sub">
											Акционерное общество МОСТДОРГЕОТРЕСТ
										</div>
									</div>
									<div className="docs__card-btn">
										<img src={arrowDown} alt="expand" />
									</div>
								</div>
								<div className="docs__card-list">
									<a
										href={AO_doc_2}
										target="_blank"
										rel="noopener noreferrer"
										className="docs__card-list-item"
									>
										<div>
											<img src={pdf} alt="pdf"></img>
										</div>
										<p>Аттестат аккредитации ФСА Росаккредитация</p>
									</a>
									<a
										href={AO_doc_3}
										target="_blank"
										rel="noopener noreferrer"
										className="docs__card-list-item"
									>
										<img src={pdf} alt="pdf"></img>
										<p>Выписка из реестра ФСА Росаккредитация</p>
									</a>
									<a
										href={AO_doc_1}
										target="_blank"
										rel="noopener noreferrer"
										className="docs__card-list-item"
									>
										<img src={pdf} alt="pdf"></img>
										<p>Аттестат аккредитации АО “МОССТРОЙСЕРТИФИКАЦИЯ”</p>
									</a>
									<a
										href={AO_doc_5}
										target="_blank"
										rel="noopener noreferrer"
										className="docs__card-list-item"
									>
										<img src={pdf} alt="pdf"></img>
										<p>Выписка из Реестра членов СРО</p>
									</a>
									<a
										href={AO_doc_4}
										target="_blank"
										rel="noopener noreferrer"
										className="docs__card-list-item"
									>
										<img src={pdf} alt="pdf"></img>
										<p>
											Евро-Регистр Сертификат Соответствия ГОСТ Р ИСО 9001-2015
										</p>
									</a>
								</div>
							</div>
							<div className="about-docs__card-wrapper">
								<div className="about-docs__card" onClick={showList}>
									<div className="docs__card-title">
										<h3 className="docs__card-title_main">
											Разрешительные документы
										</h3>
										<div className="docs__card-title_sub">
											Стуктурное подразделение ООО МОСТДОРГЕОТРЕСТ
										</div>
									</div>
									<div className="docs__card-btn">
										<img src={arrowDown} alt="expand" />
									</div>
								</div>
								<div className="docs__card-list">
									<a
										href={OOO_doc_4}
										target="_blank"
										rel="noopener noreferrer"
										className="docs__card-list-item"
									>
										<img src={pdf} alt="pdf"></img>
										<p>Выписка из Реестра членов СРО</p>
									</a>
									<a
										href={OOO_doc_1}
										target="_blank"
										rel="noopener noreferrer"
										className="docs__card-list-item"
									>
										<img src={pdf} alt="pdf"></img>
										<p>
											Аттестат аккредитации АО “НТЦ “Промышленная безопасность”
										</p>
									</a>
									<a
										href={OOO_doc_2}
										target="_blank"
										rel="noopener noreferrer"
										className="docs__card-list-item"
									>
										<img src={pdf} alt="pdf"></img>
										<p>Аттестат аккредитации АО “МОССТРОЙСЕРТИФИКАЦИЯ”</p>
									</a>
									<a
										href={OOO_doc_3}
										target="_blank"
										rel="noopener noreferrer"
										className="docs__card-list-item"
									>
										<img src={pdf} alt="pdf"></img>
										<p>
											Евро-Регистр Сертификат Соответствия ГОСТ Р ИСО 9001-2015
										</p>
									</a>
								</div>
							</div>
							<a
								href={mosgosexpert}
								target="_blank"
								rel="noopener noreferrer"
								className="about-docs__card-wrapper about-docs__card-wrapper_left"
								title="Скачать pdf"
							>
								<div className="about-docs__card">
									<div className="about-docs__card-title-img">
										<img src={pdf} alt="pdf" />
									</div>
									<div className="docs__card-title">
										<h3 className="docs__card-title_main">Положение</h3>
										<div className="docs__card-title_sub">
											об Экспертном Совете Московской государственной экспертизы
										</div>
									</div>
								</div>
							</a>
						</div>
						<div className="about-props">
							<div className="about-props__block">
								<img
									className="about-props__block-img"
									src={wille}
									alt="Wille"
								/>
								<div className="about-props__block-description">
									<h4>Определение динамических характеристик грунтов</h4>
									<p>
										Лаборатория оснащена приборами для определения динамических
										характеристик: динамический стабилометр Wille Geotechnik и
										резонансная колонка НПП Геотек. Данное оборудование
										позволяет получать входные параметры для моделей HSS,
										коэффициенты демпфирования и т.д.
									</p>
								</div>
								<img
									className="about-props__block-img"
									src={resonant}
									alt="Resonant"
								/>
							</div>

							<div className="about-props__block">
								<img
									className="about-props__block-img"
									src={shear_rock}
									alt="Shear_rock"
								/>
								<div className="about-props__block-description">
									<h4>Определение характеристик скальных грунтов</h4>
									<p>
										Для испытаний скальных грунтов лаборатория имеет прибор
										трехосного сжатия Wille Geotechnik, срезовой прибор НПП
										Геотек, несколько прессов ПСН – 0.16.10 и др.
									</p>
								</div>
								<img
									className="about-props__block-img"
									src={wille_rock}
									alt="Wille_rock"
								/>
							</div>

							<div className="about-props__block">
								<img
									className="about-props__block-img"
									src={stamp}
									alt="Stamp"
								/>
								<div className="about-props__block-description">
									<h4>Определение характеристик мерзлых грунтов</h4>
									<p>
										В нашем расположении 3 большие морозильные камеры с большим
										диапазоном отрицательных рабочих температур. Камеры имеют
										калибровку «Ростест». Одна камера для хранения и распиловки
										кернов, две другие для проведения испытаний. Данное
										оборудование помогает получить все необходимые ГОСТом
										12248-2010 характеристики мерзлых грунтов.
									</p>
								</div>
								<img
									className="about-props__block-img"
									src={fridge}
									alt="Fridge"
								/>
							</div>

							<div className="about-props__block">
								<img
									className="about-props__block-img"
									src={trixal}
									alt="Trixal"
								/>
								<div className="about-props__block-description">
									<h4>Определение механических характеристик грунтов</h4>
									<p>
										Обеспечение входными параметрами модели HS, SS, SSC, MC.
									</p>
								</div>
								<img
									className="about-props__block-img"
									src={odometr}
									alt="Odometr"
								/>
							</div>
						</div>
						<div className="about-tests" id="tests">
							<h1>Испытания грунтов</h1>
							<div className="about-tests-info">
								<p>
									Геотехническая лаборатория предоставляет своим клиентам полный
									спектр лабораторных исследований грунтов в
									инженерно-геологических изысканиях. Мы располагаем полным
									штатом самого современного оборудования, который непрерывно
									обновляется и дополняется за счёт новейших исследовательских
									приборов.
								</p>
								<p>
									У нас вы можете заказать испытания грунтов различного типа. В
									нашей исследовательской лаборатории мы с высокой точностью
									определяем плотность, влажность, просадочность грунтов,
									проводим гранулометрический анализ различными методами.
								</p>
								<p>
									Мы можем провести подробное изучение химических характеристик
									грунтов: исследование коррозийной активности грунтов и
									грунтовых вод по отношению к бетону, стали и другим
									материалам, приготовление и анализ водной вытяжки из грунта,
									определение гипса в почве. Коррозионная активность грунтов и
									грунтовых вод – один из важнейших параметров на этапе принятия
									проектного решения перед началом строительства.
								</p>
								<p>
									Также мы исследуем свойства грунтов в условиях механических
									воздействий. Вы можете внести заказ на исследование
									вибропрочности грунтов, определение параметров
									сейсморазжижения грунтов и другие виды работ, в том числе и
									повышенной сложности.
								</p>
								<p>
									Лаборатория проводит динамические испытания грунтов на
									виброползучесть, что является одной из наиболее сложных задач
									при грунтовых исследованиях. Для проведения испытаний такого
									рода мы используем высокоточные приборы, в том числе и один из
									наиболее совершенных современных вибростабилометров. Кроме
									того, в сферу нашей компетенции входят исследования на
									разжижаемость грунтов при сейсмических и иных динамических
									воздействиях.
								</p>
							</div>
							<div className="about-tests-docs">
								<div className="about-docs__card-wrapper about-docs__card-wrapper_full-w">
									<div className="about-docs__card" onClick={showList}>
										<div className="docs__card-title">
											<h3 className="docs__card-title_main">
												Образцы протоколов
											</h3>
											<div className="docs__card-title_sub">
												выдаваемых лабораторией АО «МОСТДОРГЕОТРЕСТ»
											</div>
										</div>
										<div className="docs__card-btn">
											<img src={arrowDown} alt="expand" />
										</div>
									</div>
									<div className="docs__card-list">
										<a
											href={p1}
											target="_blank"
											rel="noopener noreferrer"
											className="docs__card-list-item"
										>
											<div>
												<img src={pdf} alt="pdf"></img>
											</div>
											<p>Испытания грунта методом компрессионного сжатия</p>
										</a>
										<a
											href={p3}
											target="_blank"
											rel="noopener noreferrer"
											className="docs__card-list-item"
										>
											<div>
												<img src={pdf} alt="pdf"></img>
											</div>
											<p>Испытания грунта методом одноплоскостного среза</p>
										</a>
										<a
											href={p4}
											target="_blank"
											rel="noopener noreferrer"
											className="docs__card-list-item"
										>
											<div>
												<img src={pdf} alt="pdf"></img>
											</div>
											<p>
												Испытания грунта методом трёхосного сжатия
												вибро(kd(вибро))
											</p>
										</a>
										<a
											href={p5}
											target="_blank"
											rel="noopener noreferrer"
											className="docs__card-list-item"
										>
											<div>
												<img src={pdf} alt="pdf"></img>
											</div>
											<p>
												Испытания грунта методом трёхосного сжатия с разгрузкой
											</p>
										</a>
										<a
											href={p6}
											target="_blank"
											rel="noopener noreferrer"
											className="docs__card-list-item"
										>
											<div>
												<img src={pdf} alt="pdf"></img>
											</div>
											<p>
												Испытания грунта методом трёхосного сжатия(F, C и Е)
											</p>
										</a>
										<a
											href={p7}
											target="_blank"
											rel="noopener noreferrer"
											className="docs__card-list-item"
										>
											<div>
												<img src={pdf} alt="pdf"></img>
											</div>
											<p>
												Испытания грунта трехосным методом (сейсморазжижение)
											</p>
										</a>
										<a
											href={p8}
											target="_blank"
											rel="noopener noreferrer"
											className="docs__card-list-item"
										>
											<div>
												<img src={pdf} alt="pdf"></img>
											</div>
											<p>Первичная и вторичная консолидация</p>
										</a>
										<a
											href={p10}
											target="_blank"
											rel="noopener noreferrer"
											className="docs__card-list-item"
										>
											<div>
												<img src={pdf} alt="pdf"></img>
											</div>
											<p>Plaxis-OCR</p>
										</a>
										<a
											href={p11}
											target="_blank"
											rel="noopener noreferrer"
											className="docs__card-list-item"
										>
											<div>
												<img src={pdf} alt="pdf"></img>
											</div>
											<p>Plaxis-Ohde</p>
										</a>
										<a
											href={p12}
											target="_blank"
											rel="noopener noreferrer"
											className="docs__card-list-item"
										>
											<div>
												<img src={pdf} alt="pdf"></img>
											</div>
											<p>Plaxis-Дилатансия срез</p>
										</a>
										<a
											href={p13}
											target="_blank"
											rel="noopener noreferrer"
											className="docs__card-list-item"
										>
											<div>
												<img src={pdf} alt="pdf"></img>
											</div>
											<p>Коэффициент бокового давления</p>
										</a>
										<a
											href={p14}
											target="_blank"
											rel="noopener noreferrer"
											className="docs__card-list-item"
										>
											<div>
												<img src={pdf} alt="pdf"></img>
											</div>
											<p>Plaxis-Разгрузка</p>
										</a>
										<a
											href={p15}
											target="_blank"
											rel="noopener noreferrer"
											className="docs__card-list-item"
										>
											<div>
												<img src={pdf} alt="pdf"></img>
											</div>
											<p>Испытания грунта в резонансной колонке</p>
										</a>
									</div>
								</div>
							</div>
						</div>
					</div>
					<h2 className="customers__heading">Наши заказчики</h2>
				</div>
			</div>
			<Customers />
		</>
	)
}
