// ============================================
// SEO.jsx - ВЕРСИЯ С ПОЛНЫМ ТЕКСТОМ
// Оптимизирована для рендеринга большого объема текста
// ============================================

import React, { useEffect } from "react";
import { fullTextParagraphs, pageMeta, companyInfo } from "./seoContent";
import "./seo.css";

export default function SEO() {
  // Управление Meta-тегами (Native JS)
  useEffect(() => {
    const meta = pageMeta.home;
    document.title = meta.title;

    const updateMeta = (name, content) => {
      let element = document.querySelector(`meta[name="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('name', name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    updateMeta('description', meta.description);
    updateMeta('keywords', meta.keywords);

    // Schema.org
    const scriptId = 'seo-structured-data';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      script.text = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": companyInfo.name,
        "url": companyInfo.website,
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": companyInfo.phone,
          "contactType": "customer service"
        }
      });
      document.head.appendChild(script);
    }
  }, []);

  return (
    <article className="home-seo">
       {/* Скрытый H1 для SEO структуры */}
       <h1 style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
         {pageMeta.home.title}
       </h1>

       {/* Рендеринг полного текста */}
       <div className="seo-text-content">
         {fullTextParagraphs.map((text, index) => (
           <p key={index} className="seo-paragraph">
             {text}
           </p>
         ))}
       </div>
    </article>
  );
}
