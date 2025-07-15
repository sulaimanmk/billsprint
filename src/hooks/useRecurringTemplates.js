
import { useState, useEffect } from 'react';

export const useRecurringTemplates = () => {
  const [savedTemplates, setSavedTemplates] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('recurringTemplates');
    if (saved) {
      setSavedTemplates(JSON.parse(saved));
    }
  }, []);

  const saveTemplate = (templateData, name) => {
    const newTemplate = {
      id: Date.now(),
      name,
      data: templateData,
      createdAt: new Date().toISOString(),
      usageCount: 0
    };

    const updatedTemplates = [...savedTemplates, newTemplate];
    setSavedTemplates(updatedTemplates);
    localStorage.setItem('recurringTemplates', JSON.stringify(updatedTemplates));
  };

  const loadTemplate = (templateId) => {
    const template = savedTemplates.find(t => t.id === templateId);
    if (template) {
      // Increment usage count
      const updatedTemplates = savedTemplates.map(t => 
        t.id === templateId ? { ...t, usageCount: t.usageCount + 1 } : t
      );
      setSavedTemplates(updatedTemplates);
      localStorage.setItem('recurringTemplates', JSON.stringify(updatedTemplates));
      return template.data;
    }
    return null;
  };

  const deleteTemplate = (templateId) => {
    const updatedTemplates = savedTemplates.filter(t => t.id !== templateId);
    setSavedTemplates(updatedTemplates);
    localStorage.setItem('recurringTemplates', JSON.stringify(updatedTemplates));
  };

  return {
    savedTemplates,
    saveTemplate,
    loadTemplate,
    deleteTemplate
  };
};
