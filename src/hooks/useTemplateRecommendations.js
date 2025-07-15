
import { useState, useEffect } from 'react';

const businessTypeTemplates = {
  'consulting': [1, 3, 7],
  'design': [2, 4, 8],
  'retail': [5, 6, 9],
  'technology': [1, 2, 7],
  'healthcare': [3, 4, 8],
  'legal': [1, 3, 9],
  'default': [1, 2, 3]
};

export const useTemplateRecommendations = (companyName = '', items = []) => {
  const [recommendedTemplates, setRecommendedTemplates] = useState([]);

  useEffect(() => {
    const analyzeBusinessType = () => {
      const companyLower = companyName.toLowerCase();
      const itemsText = items.map(item => `${item.name} ${item.description}`).join(' ').toLowerCase();
      const allText = `${companyLower} ${itemsText}`;

      let businessType = 'default';

      if (allText.includes('consult') || allText.includes('advisor') || allText.includes('strategy')) {
        businessType = 'consulting';
      } else if (allText.includes('design') || allText.includes('creative') || allText.includes('logo')) {
        businessType = 'design';
      } else if (allText.includes('retail') || allText.includes('store') || allText.includes('shop')) {
        businessType = 'retail';
      } else if (allText.includes('tech') || allText.includes('software') || allText.includes('app')) {
        businessType = 'technology';
      } else if (allText.includes('health') || allText.includes('medical') || allText.includes('clinic')) {
        businessType = 'healthcare';
      } else if (allText.includes('legal') || allText.includes('law') || allText.includes('attorney')) {
        businessType = 'legal';
      }

      setRecommendedTemplates(businessTypeTemplates[businessType]);
    };

    analyzeBusinessType();
  }, [companyName, items]);

  return recommendedTemplates;
};
