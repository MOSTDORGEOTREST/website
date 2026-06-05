import seoText from '../../data/seo-content.txt?raw'

/**
 * SEO-блок: присутствует в DOM (для поисковых систем), но визуально скрыт —
 * как в исходной версии сайта. Текст не изменён.
 */
export function Seo() {
	return (
		<div className="seo-block" aria-hidden>
			{seoText}
		</div>
	)
}
