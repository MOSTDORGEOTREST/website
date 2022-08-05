import React from 'react'

import './FloatCall.css'

import phone from './bx-phone.svg'

export default function FloatCall() {
	return (
		<>
			<a
				href="tel:+74956566910"
				target="_blank"
				rel="noreferrer"
				className="float-call"
				title="Позвонить нам"
			>
				<img src={phone} alt="call" />
			</a>
		</>
	)
}
