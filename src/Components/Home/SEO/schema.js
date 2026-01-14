export const generateOrganizationSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Мостдоргеотрест",
    "alternateName": "Геотехническая лаборатория Мостдоргеотрест",
    "url": "https://mostdorgeotrest.ru",
    "logo": "https://mostdorgeotrest.ru/logo.png",
    "description": "Аккредитованная геотехническая лаборатория. Исследования грунтов, мерзлотные испытания, компрессионные испытания, определение разжижаемости и просадочности грунтов.",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "RU",
      "addressLocality": "Москва",
      "addressRegion": "Московская область"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+7-XXX-XXX-XX-XX",
      "contactType": "customer service",
      "availableLanguage": ["Russian"],
      "areaServed": "RU"
    },
    "sameAs": [
      "https://vk.com/mostdorgeotrest",
      "https://t.me/mostdorgeotrest"
    ],
    "founder": {
      "@type": "Organization",
      "name": "Мостдоргеотрест"
    }
  };
};

export const generateWebPageSchema = (meta) => {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": meta.title,
    "description": meta.description,
    "url": meta.canonicalUrl,
    "inLanguage": "ru-RU",
    "isPartOf": {
      "@type": "WebSite",
      "name": "Мостдоргеотрест",
      "url": "https://mostdorgeotrest.ru"
    },
    "about": {
      "@type": "Service",
      "serviceType": "Геотехнические исследования",
      "provider": {
        "@type": "Organization",
        "name": "Мостдоргеотрест"
      }
    },
    "breadcrumb": {
      "@type": "BreadcrumbList"
    }
  };
};


export const generateBreadcrumbSchema = (breadcrumbs) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url
    }))
  };
};


export const generateFAQSchema = (faqItems) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems
  };
};


export const generateArticleSchema = (section) => {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": section.h2 || section.title,
    "description": section.content.substring(0, 200),
    "keywords": section.keywords ? section.keywords.join(", ") : "",
    "articleSection": section.category,
    "author": {
      "@type": "Organization",
      "name": "Мостдоргеотрест"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Мостдоргеотрест",
      "logo": {
        "@type": "ImageObject",
        "url": "https://mostdorgeotrest.ru/logo.png"
      }
    },
    "datePublished": "2026-01-01",
    "dateModified": new Date().toISOString().split('T')[0],
    "inLanguage": "ru-RU"
  };
};


export const generateServiceSchema = (service) => {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": service.name,
    "description": service.description,
    "provider": {
      "@type": "Organization",
      "name": "Мостдоргеотрест"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Россия"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Геотехнические услуги",
      "itemListElement": service.items || []
    }
  };
};
