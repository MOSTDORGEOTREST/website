import React, { useContext } from 'react'

import './Home.css'
import Context from '../../context'

import Welcome from './Welcome/Welcome'
import Objects from './Objects/Objects'
import Courses from './Courses/Courses'
import Contacts from './Contacts/Contacts'
import Price from '../Price/Price'
import Customers from './Customers/Customers'

export default function Home() {
	const { showPrice } = useContext(Context)

	return (
		<>
			<div className="home-container">
				<Welcome />
				{showPrice ? <Price /> : null}

				<Objects />

				<Customers/>

				<Courses />
				<Contacts />
			</div>
		</>
	)
}
