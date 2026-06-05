import { GradientLink } from '@/components/ui/GradientButton'
import { GradientMesh } from '@/components/ui/GradientMesh'
import { ArrowRight } from '@/components/ui/icons'

export function NotFound() {
	return (
		<section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden px-4 py-32">
			<GradientMesh />
			<div className="container-site relative flex flex-col items-center gap-6 text-center">
				<span className="gradient-text font-display text-7xl font-bold sm:text-9xl">404</span>
				<h1 className="text-2xl font-semibold text-ink sm:text-3xl">Страница не найдена</h1>
				<p className="max-w-md text-muted">
					Возможно, страница была перемещена или удалена. Вернитесь на главную.
				</p>
				<GradientLink href="/">
					На главную
					<ArrowRight className="size-5" />
				</GradientLink>
			</div>
		</section>
	)
}
