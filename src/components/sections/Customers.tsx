import { Section, SectionHeading } from '@/components/ui/Section'
import { Marquee } from '@/components/ui/Marquee'
import { customerLogos, type CustomerLogo } from '@/data/customers'

function LogoChip({ logo }: { logo: CustomerLogo }) {
	return (
		<div className="glass flex h-20 w-40 shrink-0 items-center justify-center rounded-2xl px-5 sm:h-24 sm:w-48">
			<img
				src={logo.src}
				alt={logo.alt}
				loading="lazy"
				className="max-h-12 w-auto max-w-full object-contain opacity-70 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0 sm:max-h-14"
			/>
		</div>
	)
}

export function Customers() {
	const half = Math.ceil(customerLogos.length / 2)
	const rowOne = customerLogos.slice(0, half)
	const rowTwo = customerLogos.slice(half)

	return (
		<Section className="relative overflow-hidden py-20 sm:py-28">
			<div className="container-site">
				<SectionHeading
					eyebrow="Нам доверяют"
					title="Наши заказчики"
					subtitle="Проектные институты, изыскательские и строительные компании со всей страны."
					align="center"
					className="mx-auto items-center text-center"
				/>
			</div>

			<div className="mt-12 flex flex-col gap-4 sm:gap-6">
				<Marquee duration={55}>
					{rowOne.map((logo) => (
						<LogoChip key={logo.alt} logo={logo} />
					))}
				</Marquee>
				<Marquee duration={62} reverse>
					{rowTwo.map((logo) => (
						<LogoChip key={logo.alt} logo={logo} />
					))}
				</Marquee>
			</div>
		</Section>
	)
}
