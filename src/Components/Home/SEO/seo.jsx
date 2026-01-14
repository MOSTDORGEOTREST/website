

import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import SeoBlock from "./SeoBlock";
import TableOfContents from "./TableOfContents";
import { 
  seoSections, 
  seoMeta, 
  faqSchema,
  breadcrumbs,
  categories,
  primaryKeywords 
} from "./seoContent";
import { 
  generateOrganizationSchema, 
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateWebPageSchema 
} from "./schema";
import "./seo.css";

/**
 * SEO-оптимизированный компонент для страницы геотехнической лаборатории
 * @param {string} page - Ключ страницы для выбора meta-данных (home, services, frozen_soils)
 * @param {boolean} showTOC - Показывать ли оглавление (по умолчанию true)
 * @returns {JSX.Element}
 */
export default function SEO({ page = "home", showTOC = true }) {
  const meta = seoMeta[page] || seoMeta.home;

  // Фильтруем секции (убираем скрытые с keywords)
  const visibleSections = seoSections.filter(section => section.showTitle !== false);

  // Добавляем событие для аналитики
  useEffect(() => {
    // Google Analytics / Яндекс.Метрика события
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: meta.title,
        page_location: meta.canonicalUrl
      });
    }
  }, [meta]);

  return (
    <>
      {/* ============================================ */}
      {/* META-ТЕГИ И СТРУКТУРИРОВАННЫЕ ДАННЫЕ */}
      {/* ============================================ */}
      <Helmet>
        {/* Основные meta-теги */}
        <html lang="ru" />
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta name="keywords" content={meta.keywords} />

        {/* Canonical URL */}
        <link rel="canonical" href={meta.canonicalUrl} />

        {/* Open Graph для соцсетей */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={meta.canonicalUrl} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:locale" content="ru_RU" />
        <meta property="og:site_name" content="Мостдоргеотрест" />
        {/* Добавьте og:image когда будет логотип */}

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />

        {/* Дополнительные meta-теги */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        <meta name="geo.region" content="RU-MOW" />
        <meta name="geo.placename" content="Москва" />

        {/* Schema.org разметка - Organization */}
        <script type="application/ld+json">
          {JSON.stringify(generateOrganizationSchema())}
        </script>

        {/* Schema.org разметка - WebPage */}
        <script type="application/ld+json">
          {JSON.stringify(generateWebPageSchema(meta))}
        </script>

        {/* Schema.org разметка - Breadcrumbs */}
        <script type="application/ld+json">
          {JSON.stringify(generateBreadcrumbSchema(breadcrumbs))}
        </script>

        {/* Schema.org разметка - FAQ */}
        <script type="application/ld+json">
          {JSON.stringify(generateFAQSchema(faqSchema))}
        </script>
      </Helmet>

      {/* ============================================ */}
      {/* ОСНОВНОЙ КОНТЕНТ */}
      {/* ============================================ */}
      <article 
        className="seo-page" 
        itemScope 
        itemType="https://schema.org/WebPage"
      >
        {/* Хлебные крошки */}
        <nav className="breadcrumbs" aria-label="Навигация">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span className="breadcrumb-separator"> → </span>}
              <a 
                href={crumb.url} 
                className="breadcrumb-link"
                itemProp="url"
              >
                <span itemProp="name">{crumb.name}</span>
              </a>
            </React.Fragment>
          ))}
        </nav>

        {/* Заголовок H1 */}
        <header className="seo-header">
          <h1 className="seo-h1" itemProp="headline">
            {meta.h1}
          </h1>

          {/* Краткое описание */}
          <p className="seo-lead" itemProp="description">
            {meta.description}
          </p>
        </header>

        {/* Скрытые ключевые слова для индексации */}
        <div className="seo-keywords" aria-hidden="true">
          <meta itemProp="keywords" content={primaryKeywords.join(", ")} />
        </div>

        {/* Навигация по категориям */}
        <nav className="category-nav" aria-label="Категории услуг">
          <h2 className="category-nav__title">Разделы</h2>
          <ul className="category-list">
            {categories.map(cat => (
              <li key={cat.id} className="category-item">
                <a href={`#category-${cat.id}`} className="category-link">
                  {cat.name}
                </a>
                <span className="category-count">
                  ({cat.sections.length})
                </span>
              </li>
            ))}
          </ul>
        </nav>

        {/* Оглавление (Table of Contents) */}
        {showTOC && <TableOfContents sections={visibleSections} />}

        {/* ============================================ */}
        {/* КОНТЕНТНЫЕ БЛОКИ ПО КАТЕГОРИЯМ */}
        {/* ============================================ */}
        {categories.map(category => (
          <section 
            key={category.id}
            id={`category-${category.id}`}
            className="category-section"
          >
            <div className="category-header">
              <h2 className="category-title">{category.name}</h2>
              <p className="category-description">{category.description}</p>
            </div>

            {/* Рендер блоков текущей категории */}
            <div className="seo-blocks">
              {category.sections.map((section) => (
                <SeoBlock 
                  key={section.id}
                  {...section}
                />
              ))}
            </div>
          </section>
        ))}

        {/* ============================================ */}
        {/* ПРИЗЫВ К ДЕЙСТВИЮ (CTA) */}
        {/* ============================================ */}
        <aside className="cta-section" aria-label="Контакты">
          <div className="cta-content">
            <h2 className="cta-title">Закажите исследование грунтов</h2>
            <p className="cta-text">
              Аккредитованная лаборатория с современным оборудованием. 
              Быстрые сроки. Точные результаты.
            </p>
            <div className="cta-buttons">
              <a href="/contacts" className="btn btn-primary">
                Связаться с нами
              </a>
              <a href="/services" className="btn btn-secondary">
                Все услуги
              </a>
            </div>
          </div>
        </aside>

        {/* ============================================ */}
        {/* FAQ СЕКЦИЯ (если есть вопросы) */}
        {/* ============================================ */}
        {faqSchema.length > 0 && (
          <section 
            className="faq-section"
            itemScope 
            itemType="https://schema.org/FAQPage"
          >
            <h2 className="faq-title">Часто задаваемые вопросы</h2>
            <dl className="faq-list">
              {faqSchema.map((item, index) => (
                <div 
                  key={index}
                  className="faq-item"
                  itemScope
                  itemProp="mainEntity"
                  itemType="https://schema.org/Question"
                >
                  <dt className="faq-question" itemProp="name">
                    {item.name}
                  </dt>
                  <dd 
                    className="faq-answer"
                    itemScope
                    itemProp="acceptedAnswer"
                    itemType="https://schema.org/Answer"
                  >
                    <span itemProp="text">{item.acceptedAnswer.text}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {/* Footer с дополнительными ссылками */}
        <footer className="seo-footer">
          <p className="footer-text">
            © 2026 Мостдоргеотрест. Все права защищены.
          </p>
          <nav className="footer-nav">
            <a href="/privacy" className="footer-link">Политика конфиденциальности</a>
            <a href="/terms" className="footer-link">Условия использования</a>
            <a href="/sitemap.xml" className="footer-link">Карта сайта</a>
          </nav>
        </footer>
      </article>
    </>
  );
}
