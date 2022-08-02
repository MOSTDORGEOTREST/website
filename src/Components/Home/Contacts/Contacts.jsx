import React from 'react'

import './Contacts.css'

export default function Contacts() {
	return (
		<>
			<div className="home-contacts" id="contacts">
				<div className="contacts-info">
					<h1 className="contacts-info__title">
						Геотехническая
						<br />
						лаборатория
						<br />
						МОСТДОРГЕОТРЕСТ
					</h1>
					<div className="contacts-info__contact">
						<div className="info__contact-item">+7(495) 656 69 10</div>
						<div className="info__contact-item">+7(495) 656 65 80</div>
						<div className="info__contact-item">+7(495) 656 68 59</div>
					</div>
					<div className="contacts-info__adress">
						г. Москва, ул. Искры 31 к.1, этаж 4
					</div>
				</div>
				<iframe
					src="https://yandex.ru/map-widget/v1/?um=constructor%3A8a9ef30b7197a522ba6235e49aa3b48a1c86805ebd68c61252139b70d8452d3b&amp;source=constructor"
					width="100%"
					height="609"
					frameBorder="0"
					title="map"
				></iframe>
			</div>
		</>
	)
}
