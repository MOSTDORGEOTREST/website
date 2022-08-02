import React, { useState } from 'react'

import './Courses.css'

export default function Courses() {
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
							<p>
								Для подачи заявки и оформления договора на курсы Midas
								связываться с руководителем технического отдела ООО "МИДАС":
								<br />
								Давыдов Кирилл Игоревич
								<br /> тел:&nbsp;
								<a
									className="courses__info_mail"
									href="tel:+79168126353"
									target="_blank"
									rel="noreferrer"
								>
									+7(916)&nbsp;812&nbsp;63&nbsp;53
								</a>
								&nbsp;e-mail:&nbsp;
								<a
									className="courses__info_mail"
									href="mailto:rusupport@midasit.com"
									target="_blank"
									rel="noreferrer"
								>
									rusupport@midasit.com
								</a>
							</p>
							<p>
								Для подачи заявки и оформления договора на курсы Plaxis
								связываться по e-mail:&nbsp;
								<a
									className="courses__info_mail"
									href="mailto:education@mdgt.ru"
									target="_blank"
									rel="noreferrer"
								>
									education@mdgt.ru
								</a>
							</p>
							<p>Или воспользуйтесь формой записи ниже.</p>
						</div>
						<div className="courses-card">
							<form
								className="courses-form"
								action="#"
								method="post"
								onSubmit={onSubmit}
							>
								<h3>Запись на курсы</h3>
								<div className="course-type">
									<div className="course-type__btn" id="midas">
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
										></input>
										<label
											htmlFor="midas-input"
											className="course-type__btn_label"
										>
											Midas
										</label>
									</div>

									<div className="course-type__btn" id="plaxis">
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
										></input>
										<label
											htmlFor="plaxis-input"
											className="course-type__btn_label"
										>
											Plaxis
										</label>
									</div>
								</div>

								<div className="couses-form__text-input">
									<input
										className="text-input__input"
										type="text"
										name="student_name"
										id="name"
										onFocus={inputFocus}
										onBlur={inputBlur}
										{...user.bind}
									/>
									<div className="text-input__label-notch">
										<div className="text-input__label-notch-outline--leading"></div>
										<div className="text-input__label-notch-outline--label">
											<label htmlFor="name">ФИО</label>
										</div>
										<div className="text-input__label-notch-outline--trailing"></div>
									</div>
									<div className="course-type__error"></div>
								</div>

								<div className="couses-form__text-input">
									<input
										className="text-input__input"
										type="text"
										name="student_mail"
										id="mail"
										onFocus={inputFocus}
										onBlur={inputBlur}
										{...mail.bind}
									/>
									<div className="text-input__label-notch">
										<div className="text-input__label-notch-outline--leading"></div>
										<div className="text-input__label-notch-outline--label">
											<label htmlFor="mail">Почта</label>
										</div>
										<div className="text-input__label-notch-outline--trailing"></div>
									</div>
									<div className="course-type__error"></div>
								</div>

								<div className="couses-form__text-input">
									<input
										className="text-input__input"
										type="text"
										name="student_phone"
										id="phone"
										onFocus={inputFocus}
										onBlur={inputBlur}
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
										<div className="text-input__label-notch-outline--trailing"></div>
									</div>
									<div className="course-type__error"></div>
								</div>

								<div className="couses-form__text-input">
									<input
										className="text-input__input"
										type="text"
										name="student_organization"
										id="organization"
										onFocus={inputFocus}
										onBlur={inputBlur}
										{...organization.bind}
									/>
									<div className="text-input__label-notch">
										<div className="text-input__label-notch-outline--leading"></div>
										<div className="text-input__label-notch-outline--label">
											<label htmlFor="organization">Организация</label>
										</div>
										<div className="text-input__label-notch-outline--trailing"></div>
									</div>
									<div className="course-type__error"></div>
								</div>

								<button
									className="main-title_btn course-form__submit-btn "
									type="submit"
									disabled={!(midas.value() || plaxis.value())}
								>
									Отправить
								</button>

								<div className="courses-form--sub">
									Нажимая на кнопку «Отправить«, вы даете согласие на обработку
									персональных данных и соглашаетесь с{' '}
									<a href="/">политикой конфиденциальности.</a>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
