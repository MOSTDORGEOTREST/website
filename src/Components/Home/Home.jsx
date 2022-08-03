import React, { useContext } from 'react'

import './Home.css'
import Context from '../../context'

import Welcome from './Welcome/Welcome'
import Objects from './Objects/Objects'
// import LabsVideo from './LabsVideo/LabsVideo'
import Courses from './Courses/Courses'
import Contacts from './Contacts/Contacts'
import Price from '../Price/Price'
import About from './About/About'



export default function Home() {
	const { showPrice } = useContext(Context)

	return (
		<>
			<div className="home-container">
				<Welcome />
				{showPrice ? <Price /> : null}

				<Objects />

				<About />
				<Courses />
				<Contacts />
			</div>
		</>
	)
}
