import React, { useRef, useState } from 'react'

import './Courses.css'

import close from '../../Navigation/close-fill.svg'
import pdf from '../About/pdf.svg'
import programma from './programma.pdf'

export default function Courses() {
	const [showForm, setShowForm] = useState(false)

	const plaxisShowingGif = useRef(false)
	const midasShowingGif = useRef(false)

	function useInputValue(defaultValue = '') {
		const [value, setValue] = useState(defaultValue)

		return {
			bind: {
				value,
				onChange: (event) => {
					setValue(event.target.value)
					handleChange(event)
				},
			},
			clear: () => setValue(''),
			value: () => value,
		}
	}

	function useCheckValue(defaultValue = false) {
		const [value, setValue] = useState(defaultValue)

		return {
			bind: {
				value,
				onChange: (event) => {
					setValue(!value)
					if (!value) {
						event.target.parentNode.classList.add('not-empty')
					} else {
						event.target.parentNode.classList.remove('not-empty')
					}
				},
			},
			clear: (id) => {
				document.getElementById(id).classList.remove('not-empty')
				setValue(false)
			},
			value: () => value,
		}
	}

	const midas = useCheckValue()
	const plaxis = useCheckValue()

	const user = useInputValue('')
	const mail = useInputValue('')
	const organization = useInputValue('')
	const post = useInputValue('')
	const phone = useInputValue('')

	function inputFocus(event) {
		event.currentTarget.parentNode.classList.add(
			'couses-form__text-input--focused'
		)
	}

	function inputBlur(event) {
		event.currentTarget.parentNode.classList.remove(
			'couses-form__text-input--focused'
		)
	}

	function handleChange(event) {
		if (event.target.value) {
			event.target.parentNode.classList.add('not-empty')
		} else {
			event.target.parentNode.classList.remove('not-empty')
		}
	}

	function verifyName(name) {
		if (name.length === 0) {
			return 'Обязательное поле'
		}
		if (name.length < 3) {
			return 'Имя не короче 3 символов'
		}
		var regex = /[0-9!@#$%^&*?"')(+=._-]/

		if (regex.test(name)) {
			return 'Имя содержит некорретные символы'
		}
		return 'ok'
	}

	function verifyMail(mail) {
		if (mail.length === 0) {
			return 'Обязательное поле'
		}
		console.log(mail)
		if (!mail.includes('@') || !mail.includes('.')) {
			return 'Почта некорректного формата'
		}
		return 'ok'
	}

	function verifyPhone(phone) {
		phone = phone.replaceAll(' ', '').replaceAll('(', '').replaceAll(')', '')
		if (
			(phone.startsWith('+') && phone.length !== 12) ||
			(phone.startsWith('8') && phone.length !== 11) ||
			(!phone.startsWith('+') && !phone.startsWith('8') && phone.length !== 10)
		) {
			return 'Укажите в формате +71234567890'
		}
		return 'ok'
	}

	function onSubmit(event) {
		event.preventDefault()
		console.log(event)

		if (verifyName(user.value()) !== 'ok') {
			document.getElementById('name').parentNode.classList.add('error')
			document.getElementById('name').parentNode.childNodes[2].innerHTML =
				verifyName(user.value())
		} else {
			document.getElementById('name').parentNode.classList.remove('error')
		}

		if (verifyMail(mail.value()) !== 'ok') {
			document.getElementById('mail').parentNode.classList.add('error')
			document.getElementById('mail').parentNode.childNodes[2].innerHTML =
				verifyMail(mail.value())
		} else {
			document.getElementById('mail').parentNode.classList.remove('error')
		}
		if (verifyPhone(phone.value()) !== 'ok') {
			document.getElementById('phone').parentNode.classList.add('error')
			document.getElementById('phone').parentNode.childNodes[2].innerHTML =
				verifyPhone(phone.value())
		} else {
			document.getElementById('phone').parentNode.classList.remove('error')
		}
	}

	function onCloseForm() {
		const body = document.getElementById('body')
		body.classList.remove('body-hidden')
		setShowForm(false)
	}

	function wrapperClick(event) {
		if (event.target === event.currentTarget) {
			onCloseForm()
		}
	}

	return (
		<>
			<div className="home-courses" id="courses">
				<div className="home-blur"></div>
				<div className="courses-content">
					<h1>Курсы повышения квалификации</h1>
					<div className="courses__wrapper">
						<div className="courses__info">
							<p>
								Геотехническая лаборатория АО "МОСТДОРГЕОТРЕСТ" регулярно
								проводит курсы повышения квалификации по лабораторным испытаниям
								грунтов для целей численного моделирования Plaxis, Midas.
							</p>
							<div className="courses-block">
								<div className="courses-block__info">
									<h3>Курсы Midas</h3>
									<p>
										Для подачи заявки и оформления договора на курсы Midas
										связываться с руководителем технического отдела ООО "МИДАС":
										<br />
										Давыдов Кирилл Игоревич
										<br />
										<div className="courses-block__contacts">
											<a
												className="courses__info_mail"
												href="tel:+79168126353"
												target="_blank"
												rel="noreferrer"
											>
												тел:&nbsp; +7(916)&nbsp;812&nbsp;63&nbsp;53
											</a>{' '}
											<a
												className="courses__info_mail"
												href="mailto:rusupport@midasit.com"
												target="_blank"
												rel="noreferrer"
											>
												mail:&nbsp;rusupport@midasit.com
											</a>
										</div>
									</p>
								</div>
								<div className="courses-block__gif">
									<img
										src="/common_imgs/Midas_1.png"
										alt="Midas"
										title="Midas"
										onMouseEnter={(event) => {
											const midasEvent = event
											if (!midasShowingGif.current) {
												midasShowingGif.current = true
												midasEvent.target.src = '/common_imgs/Midas.gif'
												setTimeout(() => {
													midasEvent.target.src = '/common_imgs/Midas_1.png'
													midasShowingGif.current = false
												}, 5000)
											}
										}}
									/>
								</div>
							</div>
							<div className="courses-block">
								<div className="courses-block__info">
									<h3>Курсы Plaxis</h3>
									<p>
										Для подачи заявки и оформления договора на курсы Plaxis
										связываться по mail:&nbsp;
										<a
											className="courses__info_mail"
											href="mailto:education@mdgt.ru"
											target="_blank"
											rel="noreferrer"
										>
											education@mdgt.ru
										</a>
									</p>
									<div className="show-form--block">
										В настоящий момент до конца 2022 запись на курсы не
										производится. Для предварительной записи воспользуйтесь
										формой ниже. Мы уведомим Вас о планируемых датах проведения
										занятий.
									</div>

									<div className="courses-info__wrapper">
										<a
											href={programma}
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
													<h3 className="docs__card-title_main">
														Программа курса
													</h3>
													<div className="docs__card-title_sub">
														повышения квалификации Plaxis
													</div>
												</div>
											</div>
										</a>
										<div className="courses-info__price">
											<h3>Стоимость курса</h3>
											<div>35&nbsp;000&nbsp;&#8381;</div>
										</div>
									</div>

									<button
										className="main-title_btn courses-btn"
										onClick={() => {
											const body = document.getElementById('body')
											body.classList.add('body-hidden')
											setShowForm(true)
										}}
									>
										Записаться
									</button>
								</div>
								<div className="courses-block__gif">
									<img
										src="/common_imgs/Plaxis_1.png"
										alt="Plaxis"
										title="Plaxis"
										onMouseEnter={(event) => {
											const plaxisEvent = event
											if (!plaxisShowingGif.current) {
												plaxisShowingGif.current = true
												plaxisEvent.target.src = '/common_imgs/Plaxis.gif'
												setTimeout(() => {
													plaxisEvent.target.src = '/common_imgs/Plaxis_1.png'
													plaxisShowingGif.current = false
												}, 5000)
											}
										}}
									/>
								</div>
							</div>
						</div>
						{showForm ? (
							<div className="courses-card__wrapper" onClick={wrapperClick}>
								<div className="courses-card">
									<form
										className="courses-form"
										action="#"
										method="post"
										onSubmit={onSubmit}
									>
										<h3>Запись на курсы</h3>
										<a
											href="https://docs.google.com/forms/d/e/1FAIpQLSeh8HLdngqhccnyZtA1LxVuZb1ZFtAyxIkrsLZOfp_I6LU4Cw/viewform?usp=sf_link"
											target="_blank"
											rel="noreferrer"
											className="courses-form__google-link"
										>
											Google форма
										</a>

										<div
											className={
												user.value().length > 0
													? 'couses-form__text-input not-empty'
													: 'couses-form__text-input'
											}
										>
											<input
												className="text-input__input"
												type="text"
												name="student_name"
												id="name"
												autoComplete="on"
												onFocus={inputFocus}
												onBlur={inputBlur}
												{...user.bind}
											/>
											<div className="text-input__label-notch">
												<div className="text-input__label-notch-outline--leading"></div>
												<div className="text-input__label-notch-outline--label">
													<label htmlFor="name">ФИО</label>
												</div>
												<div
													className="text-input__label-notch-outline--trailing"
													onClick={(event) => {
														event.preventDefault()
														document.getElementById('name').focus()
													}}
												></div>
											</div>
											<div className="course-type__error"></div>
										</div>

										<div
											className={
												mail.value().length > 0
													? 'couses-form__text-input not-empty'
													: 'couses-form__text-input'
											}
										>
											<input
												className="text-input__input"
												type="email"
												name="student_mail"
												id="mail"
												autoComplete="on"
												onFocus={inputFocus}
												onBlur={inputBlur}
												{...mail.bind}
											/>
											<div className="text-input__label-notch">
												<div className="text-input__label-notch-outline--leading"></div>
												<div className="text-input__label-notch-outline--label">
													<label htmlFor="mail">Почта</label>
												</div>
												<div
													className="text-input__label-notch-outline--trailing"
													onClick={(event) => {
														event.preventDefault()
														document.getElementById('mail').focus()
													}}
												></div>
											</div>
											<div className="course-type__error"></div>
										</div>

										<div
											className={
												phone.value().length > 0
													? 'couses-form__text-input not-empty'
													: 'couses-form__text-input'
											}
										>
											<input
												className="text-input__input"
												type="tel"
												name="student_phone"
												id="phone"
												onFocus={inputFocus}
												onBlur={inputBlur}
												autoComplete="on"
												{...phone.bind}
												value={phone.bind.value}
												onChange={(event) => {
													event.target.value = event.target.value
														.replaceAll(' ', '')
														.replaceAll('(', '')
														.replaceAll(')', '')
													phone.bind.onChange(event)
												}}
												placeholder="+7"
											/>
											<div className="text-input__label-notch">
												<div className="text-input__label-notch-outline--leading"></div>
												<div className="text-input__label-notch-outline--label">
													<label htmlFor="phone">Телефон</label>
												</div>
												<div
													className="text-input__label-notch-outline--trailing"
													onClick={(event) => {
														event.preventDefault()
														document.getElementById('phone').focus()
													}}
												></div>
											</div>
											<div className="course-type__error"></div>
										</div>

										<div
											className={
												organization.value().length > 0
													? 'couses-form__text-input not-empty'
													: 'couses-form__text-input'
											}
										>
											<input
												className="text-input__input"
												type="text"
												name="student_organization"
												id="organization"
												autoComplete="on"
												onFocus={inputFocus}
												onBlur={inputBlur}
												{...organization.bind}
											/>
											<div className="text-input__label-notch">
												<div className="text-input__label-notch-outline--leading"></div>
												<div className="text-input__label-notch-outline--label">
													<label htmlFor="organization">Организация</label>
												</div>
												<div
													className="text-input__label-notch-outline--trailing"
													onClick={(event) => {
														event.preventDefault()
														document.getElementById('organization').focus()
													}}
												></div>
											</div>
											<div className="course-type__error"></div>
										</div>

										<div
											className={
												post.value().length > 0
													? 'couses-form__text-input not-empty'
													: 'couses-form__text-input'
											}
										>
											<input
												className="text-input__input"
												type="text"
												name="student_post"
												id="post"
												autoComplete="on"
												onFocus={inputFocus}
												onBlur={inputBlur}
												{...post.bind}
											/>
											<div className="text-input__label-notch">
												<div className="text-input__label-notch-outline--leading"></div>
												<div className="text-input__label-notch-outline--label">
													<label htmlFor="post">Должность</label>
												</div>
												<div
													className="text-input__label-notch-outline--trailing"
													onClick={(event) => {
														event.preventDefault()
														document.getElementById('post').focus()
													}}
												></div>
											</div>
											<div className="course-type__error"></div>
										</div>

										<div>Уровень владения Plaxis</div>
										<div className="course-type">
											<div
												className={
													midas.value()
														? 'course-type__btn not-empty'
														: 'course-type__btn'
												}
												id="midas"
											>
												<input
													type="checkbox"
													name="midas"
													className="course-type__btn_input"
													id="midas-input"
													value={midas.bind.value}
													checked={midas.bind.value}
													onChange={(event) => {
														plaxis.clear('plaxis')
														midas.bind.onChange(event)
													}}
													onFocus={(event) => {
														event.currentTarget.parentNode.classList.add(
															'selected'
														)
													}}
													onBlur={(event) => {
														event.currentTarget.parentNode.classList.remove(
															'selected'
														)
													}}
												></input>
												<label
													htmlFor="midas-input"
													className="course-type__btn_label"
												>
													Начальный
												</label>
											</div>

											<div
												className={
													plaxis.value()
														? 'course-type__btn not-empty'
														: 'course-type__btn'
												}
												id="plaxis"
											>
												<input
													type="checkbox"
													name="plaxis"
													id="plaxis-input"
													className="course-type__btn_input"
													checked={plaxis.bind.value}
													value={plaxis.bind.value}
													onChange={(event) => {
														midas.clear('midas')
														plaxis.bind.onChange(event)
													}}
													onFocus={(event) => {
														event.currentTarget.parentNode.classList.add(
															'selected'
														)
													}}
													onBlur={(event) => {
														event.currentTarget.parentNode.classList.remove(
															'selected'
														)
													}}
												></input>
												<label
													htmlFor="plaxis-input"
													className="course-type__btn_label"
												>
													Уверенный
												</label>
											</div>
										</div>

										<button
											className="main-title_btn course-form__submit-btn "
											type="submit"
											disabled={!(midas.value() || plaxis.value())}
										>
											Отправить
										</button>

										<div className="courses-form--sub">
											Нажимая на кнопку «Отправить», вы даете согласие на
											обработку персональных данных и соглашаетесь с{' '}
											<a href="#">политикой конфиденциальности.</a>
										</div>
									</form>
									<div className="courses__close" onClick={onCloseForm}>
										<img src={close} alt="close" />
									</div>
								</div>
							</div>
						) : null}
					</div>
				</div>
			</div>
		</>
	)
}
