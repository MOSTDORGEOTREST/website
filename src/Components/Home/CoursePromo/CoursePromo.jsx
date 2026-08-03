import React, { useEffect, useRef, useState } from 'react'

import aiLab from './assets/course-ai-lab.jpg'
import aiWorkstation from './assets/course-ai-workstation.jpg'
import aiField from './assets/course-ai-field.jpg'

import CourseIcon from './CourseIcon'
import './CoursePromo.css'

const programItems = [
	'подготовка и анализ геотехнических данных;',
	'прогнозирование числовых характеристик;',
	'классификация грунтов и результатов испытаний;',
	'выявление аномалий и нетипичных наблюдений;',
	'оценка качества и интерпретация моделей;',
	'деревья решений и ансамблевые методы;',
	'основы нейронных сетей;',
	'реальные кейсы применения ИИ в АО «МОСТДОРГЕОТРЕСТ».',
]

const programIcons = [
	'data',
	'forecast',
	'classification',
	'anomaly',
	'quality',
	'trees',
	'neural',
	'cases',
]

const teachers = [
	{
		name: 'Озмидов Олег Ростиславович',
		details: [
			'кандидат геолого-минералогических наук',
			'доктор физико-математических наук ВМАК',
			'научный руководитель и президент лаборатории АО МОСТДОРГЕОТРЕСТ',
		],
	},
	{
		name: 'Тишин Никита Романович',
		details: [
			'руководитель R&D департамента лаборатории АО МОСТДОРГЕОТРЕСТ',
			'научный сотрудник лаборатории Киберфизических систем МГТУ им. Н.Э. Баумана',
		],
	},
	{
		name: 'Мартынюк Полина Антоновна',
		details: [
			'старший инженер-программист R&D департамента лаборатории АО МОСТДОРГЕОТРЕСТ',
			'старший преподаватель ИИ дисциплин МГТУ им. Н.Э. Баумана',
		],
	},
	{
		name: 'Селиванов Иван Алексеевич',
		details: [
			'кандидат физико-математических наук,',
			'старший инженер-программист R&D департамента лаборатории АО МОСТДОРГЕОТРЕСТ',
		],
	},
]

function CourseHero({ onDetails, detailsButtonRef, titleId }) {
	return (
		<div className="course-promo__hero">
			<img className="course-promo__hero-image" src={aiField} alt="" />
			<div className="course-promo__container course-promo__hero-grid">
				<div className="course-promo__hero-copy">
					<p className="course-promo__eyebrow">
						Курс повышения квалификации от АО «МОСТДОРГЕОТРЕСТ»
					</p>
					<h1 id={titleId}>
						Введение в <span>искусственный интеллект</span> в геотехнике
					</h1>
					<div className="course-promo__hero-contact">
						<p>
							Для записи на курсы напишите нам на почту:{' '}
							<a href="mailto:support@mdgt.ru">support@mdgt.ru</a>
						</p>
						<p>
							Узнать{' '}
							<button type="button" onClick={onDetails} ref={detailsButtonRef}>
								подробности
							</button>
						</p>
					</div>
				</div>

				<div className="course-promo__hero-facts">
					<div className="course-promo__fact">
						<span className="course-promo__icon"><CourseIcon name="clock" /></span>
						<p>Продолжительность: 36 академических часов.</p>
					</div>
					<div className="course-promo__fact">
						<span className="course-promo__icon"><CourseIcon name="online" /></span>
						<p>Формат: онлайн-занятия – лекции, практика и разбор кейсов.</p>
					</div>
					<div className="course-promo__fact">
						<span className="course-promo__icon"><CourseIcon name="calendar" /></span>
						<p>Дата начала: 05.10.2026</p>
					</div>
					<div className="course-promo__fact">
						<span className="course-promo__icon"><CourseIcon name="price" /></span>
						<p>Стоимость обучения: 50 000</p>
					</div>
					<div className="course-promo__fact">
						<span className="course-promo__icon"><CourseIcon name="certificate" /></span>
						<p>Удостоверение о повышении квалификации государственного образца</p>
					</div>
				</div>
			</div>
		</div>
	)
}

function CourseDetails({ detailsRef }) {
	return (
		<>
			<div className="course-promo__section" ref={detailsRef}>
				<div className="course-promo__container course-promo__intro-grid">
					<article className="course-promo__copy-card">
						<p>
							Искусственный интеллект уже помогает обрабатывать результаты
							лабораторных испытаний, находить аномалии в показаниях приборов,
							прогнозировать характеристики грунтов и ускорять инженерные расчёты.
						</p>
						<p>
							На курсе вы познакомитесь с основами искусственного интеллекта и
							машинного обучения, научитесь подготавливать геотехнические данные,
							строить и оценивать модели регрессии, классификации и кластеризации, а
							также разберётесь в принципах работы деревьев решений, ансамблевых
							методов и нейронных сетей.
						</p>
						<p>
							Особое внимание уделяется практике: слушатели будут работать с
							лабораторными и инженерными данными, выполнять задания в готовых
							программных блокнотах и разбирать реальные кейсы внедрения
							искусственного интеллекта в компании.
						</p>
					</article>
					<figure className="course-promo__visual-card">
						<img src={aiWorkstation} alt="" loading="lazy" />
					</figure>
				</div>
			</div>

			<div className="course-promo__section course-promo__section--alt">
				<div className="course-promo__container">
					<h2>В программе курса</h2>
					<div className="course-promo__program-grid">
						{programItems.map((item, index) => (
							<article className="course-promo__program-card" key={item}>
								<span className="course-promo__icon course-promo__program-icon">
									<CourseIcon name={programIcons[index]} />
								</span>
								<p>{item}</p>
							</article>
						))}
					</div>
				</div>
			</div>

			<div className="course-promo__section">
				<div className="course-promo__container course-promo__practice-grid">
					<figure className="course-promo__practice-image">
						<img src={aiLab} alt="" loading="lazy" />
					</figure>
					<div className="course-promo__practice-copy">
						<article className="course-promo__practice-card">
							<span className="course-promo__icon"><CourseIcon name="code" /></span>
							<p>
								Углублённые навыки программирования не требуются: практические задания
								выполняются с использованием подготовленного кода и пошаговых
								инструкций.
							</p>
						</article>
						<article className="course-promo__practice-card course-promo__practice-card--dark">
							<span className="course-promo__icon"><CourseIcon name="certificate" /></span>
							<p>
								По завершении обучения слушатели получают удостоверение о повышении
								квалификации государственного образца.
							</p>
						</article>
					</div>
				</div>
			</div>

			<div className="course-promo__section course-promo__section--alt">
				<div className="course-promo__container">
					<h2>Преподаватели курса - ведущие сотрудники лаборатории:</h2>
					<div className="course-promo__teacher-grid">
						{teachers.map((teacher) => (
							<article className="course-promo__teacher-card" key={teacher.name}>
								<div>
									<h3>{teacher.name}</h3>
									{teacher.details.map((detail) => (
										<p key={detail}>{detail}</p>
									))}
								</div>
							</article>
						))}
					</div>
				</div>
			</div>

			<div className="course-promo__cta">
				<div className="course-promo__container course-promo__cta-grid">
					<h2>
						Для записи на курсы напишите нам на почту:{' '}
						<a href="mailto:support@mdgt.ru">support@mdgt.ru</a>
						<span className="course-promo__cta-note">
							Просьба указать в письме уровень владения ПК
						</span>
					</h2>
					<div className="course-promo__cta-panel">
						<div className="course-promo__cta-row">
							<span className="course-promo__icon"><CourseIcon name="calendar" /></span>
							<p>Дата начала: 05.10.2026</p>
						</div>
						<div className="course-promo__cta-row">
							<span className="course-promo__icon"><CourseIcon name="clock" /></span>
							<p>Продолжительность: 36 академических часов.</p>
						</div>
						<div className="course-promo__cta-row">
							<span className="course-promo__icon"><CourseIcon name="price" /></span>
							<p>Стоимость обучения: 50 000</p>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default function CoursePromo() {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const detailsButtonRef = useRef(null)
	const closeButtonRef = useRef(null)
	const modalDetailsRef = useRef(null)

	useEffect(() => {
		if (!isModalOpen) return undefined

		const previousOverflow = document.body.style.overflow
		document.body.style.overflow = 'hidden'
		closeButtonRef.current?.focus()

		function handleKeyDown(event) {
			if (event.key === 'Escape') {
				setIsModalOpen(false)
				detailsButtonRef.current?.focus()
			}
		}

		window.addEventListener('keydown', handleKeyDown)

		return () => {
			document.body.style.overflow = previousOverflow
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [isModalOpen])

	function closeModal() {
		setIsModalOpen(false)
		detailsButtonRef.current?.focus()
	}

	return (
		<>
			<section className="course-promo" id="ai-course">
				<CourseHero
					onDetails={() => setIsModalOpen(true)}
					detailsButtonRef={detailsButtonRef}
				/>
			</section>

			{isModalOpen ? (
				<div className="course-promo__modal" onMouseDown={closeModal}>
					<div
						className="course-promo__modal-dialog"
						role="dialog"
						aria-modal="true"
						aria-labelledby="ai-course-modal-title"
						onMouseDown={(event) => event.stopPropagation()}
					>
						<button
							className="course-promo__modal-close"
							type="button"
							aria-label="Закрыть"
							onClick={closeModal}
							ref={closeButtonRef}
						>
							×
						</button>
						<section className="course-promo course-promo--modal">
							<CourseHero
								titleId="ai-course-modal-title"
								onDetails={() => modalDetailsRef.current?.scrollIntoView({ behavior: 'smooth' })}
							/>
							<CourseDetails detailsRef={modalDetailsRef} />
						</section>
					</div>
				</div>
			) : null}
		</>
	)
}