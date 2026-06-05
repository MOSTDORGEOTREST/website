import { Hero } from '@/components/sections/Hero'
import { Projects } from '@/components/sections/Projects'
import { LiveLabs } from '@/components/sections/LiveLabs'
import { About } from '@/components/sections/About'
import { Equipment } from '@/components/sections/Equipment'
import { Tests } from '@/components/sections/Tests'
import { Customers } from '@/components/sections/Customers'
import { Calculations } from '@/components/sections/Calculations'
import { Seo } from '@/components/sections/Seo'
import { Contacts } from '@/components/sections/Contacts'

export function Home() {
	return (
		<>
			<Hero />
			<Projects />
			<LiveLabs />
			<About />
			<Equipment />
			<Tests />
			<Customers />
			<Calculations />
			<Seo />
			<Contacts />
		</>
	)
}
