

import React, { useState } from "react";
import PropTypes from "prop-types";


const TableOfContents = ({ sections }) => {
  const [isOpen, setIsOpen] = useState(true);

  // Группируем по категориям
  const groupedSections = sections.reduce((acc, section) => {
    const category = section.category || 'Другое';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(section);
    return acc;
  }, {});

  return (
    <nav className="table-of-contents" aria-label="Оглавление">
      <button 
        className="toc-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="toc-icon">{isOpen ? '▼' : '▶'}</span>
        Оглавление
      </button>

      {isOpen && (
        <div className="toc-content">
          {Object.entries(groupedSections).map(([category, items]) => (
            <div key={category} className="toc-category">
              <h3 className="toc-category-title">{category}</h3>
              <ol className="toc-list">
                {items.map((section) => (
                  <li key={section.id} className="toc-item">
                    <a 
                      href={`#${section.id}`} 
                      className="toc-link"
                      title={section.title}
                    >
                      {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      )}
    </nav>
  );
};

TableOfContents.propTypes = {
  sections: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    category: PropTypes.string
  })).isRequired
};

export default TableOfContents;
