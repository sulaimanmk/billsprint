
import { useState, useEffect } from 'react';

// Mock AI-powered item suggestions based on user input patterns
const commonItems = {
  'consulting': [
    { name: 'Strategy Consulting', description: 'Business strategy consultation', amount: 150 },
    { name: 'Technical Consulting', description: 'Technical advisory services', amount: 120 },
    { name: 'Project Management', description: 'Project management services', amount: 100 }
  ],
  'design': [
    { name: 'Logo Design', description: 'Custom logo design', amount: 300 },
    { name: 'Website Design', description: 'Website design and development', amount: 1200 },
    { name: 'Brand Identity', description: 'Complete brand identity package', amount: 800 }
  ],
  'development': [
    { name: 'Frontend Development', description: 'React/Vue frontend development', amount: 80 },
    { name: 'Backend Development', description: 'API and database development', amount: 90 },
    { name: 'Mobile App Development', description: 'iOS/Android app development', amount: 100 }
  ],
  'marketing': [
    { name: 'Social Media Management', description: 'Monthly social media management', amount: 500 },
    { name: 'SEO Optimization', description: 'Search engine optimization', amount: 400 },
    { name: 'Content Creation', description: 'Blog posts and content writing', amount: 50 }
  ],
  'default': [
    { name: 'Product A', description: 'Standard product offering', amount: 25 },
    { name: 'Service B', description: 'Professional service', amount: 75 },
    { name: 'Consultation', description: 'One-hour consultation', amount: 100 }
  ]
};

export const useItemSuggestions = (companyName = '', existingItems = []) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateSuggestions = async (query) => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const queryLower = query.toLowerCase();
    let categoryItems = commonItems.default;
    
    // Simple AI-like categorization
    if (queryLower.includes('consult') || queryLower.includes('advisor')) {
      categoryItems = commonItems.consulting;
    } else if (queryLower.includes('design') || queryLower.includes('creative')) {
      categoryItems = commonItems.design;
    } else if (queryLower.includes('develop') || queryLower.includes('code') || queryLower.includes('software')) {
      categoryItems = commonItems.development;
    } else if (queryLower.includes('market') || queryLower.includes('social') || queryLower.includes('seo')) {
      categoryItems = commonItems.marketing;
    }
    
    // Filter out items that already exist
    const existingNames = existingItems.map(item => item.name.toLowerCase());
    const filteredSuggestions = categoryItems.filter(
      item => !existingNames.includes(item.name.toLowerCase())
    );
    
    setSuggestions(filteredSuggestions.slice(0, 3));
    setIsLoading(false);
  };

  return { suggestions, isLoading, generateSuggestions };
};
