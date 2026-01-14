

import React from "react";
import PropTypes from "prop-types";


const SeoBlock = ({ 
  id, 
  title, 
  h2,
  content, 
  keywords, 
  internalLinks,
  faq,
  category
}) => {

  const paragraphs = content.split('\n\n').filter(p => p.trim());

  return (
    <section 
      className="seo-block" 
      id={id}
      itemScope 
      itemType="https://schema.org/Article"
    >
      {/* Заголовок секции */}
      {h2 && (
        <header className="seo-block__header">
          <h3 className="seo-block__title" itemProp="headline">
            {h2}
          </h3>
        </header>
      )}

      {/* Контент */}
      <div className="seo-block__content" itemProp="articleBody">
        {paragraphs.map((para, index) => (
          <p key={index} className="seo-block__paragraph">
            {para.trim()}
          </p>
        ))}
      </div>

      {/* Внутренние ссылки */}
      {internalLinks && internalLinks.length > 0 && (
        <nav className="seo-block__related" aria-label="Связанные темы">
          <span className="related-label">Смотрите также:</span>
          {internalLinks.map((link, index) => (
            <React.Fragment key={link}>
              {index > 0 && <span className="related-separator"> • </span>}
              <a href={link} className="related-link">
                {link.replace('#', '').replace(/-/g, ' ')}
              </a>
            </React.Fragment>
          ))}
        </nav>
      )}

      {/* Скрытые ключевые слова для SEO */}
      {keywords && keywords.length > 0 && (
        <meta itemProp="keywords" content={keywords.join(", ")} />
      )}

      {/* Категория */}
      {category && (
        <meta itemProp="articleSection" content={category} />
      )}
    </section>
  );
};

SeoBlock.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string,
  h2: PropTypes.string,
  content: PropTypes.string.isRequired,
  keywords: PropTypes.arrayOf(PropTypes.string),
  internalLinks: PropTypes.arrayOf(PropTypes.string),
  faq: PropTypes.shape({
    question: PropTypes.string,
    answer: PropTypes.string
  }),
  category: PropTypes.string
};

export default React.memo(SeoBlock);
