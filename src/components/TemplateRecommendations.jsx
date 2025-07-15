
import React from 'react';
import { Star, Sparkles } from 'lucide-react';

const TemplateRecommendations = ({ recommendedTemplates, templates, onTemplateClick }) => {
  if (recommendedTemplates.length === 0) return null;

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-4 w-4 text-purple-600" />
        <span className="text-sm font-medium text-purple-800 dark:text-purple-200">
          Recommended for You
        </span>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {recommendedTemplates.map((templateIndex) => {
          const template = templates[templateIndex - 1];
          if (!template) return null;
          
          return (
            <div
              key={templateIndex}
              className="flex-shrink-0 template-card bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 backdrop-blur-sm p-3 rounded-xl cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300 border-2 border-purple-200/50 dark:border-purple-600/30 relative"
              onClick={() => onTemplateClick(templateIndex)}
            >
              <Star className="absolute top-2 right-2 h-3 w-3 text-purple-500 fill-current" />
              <img
                src={`/assets/template${templateIndex}-preview.png`}
                alt={template.name}
                className="w-16 h-20 object-cover rounded-lg mb-2"
              />
              <p className="text-xs font-medium text-center text-purple-900 dark:text-purple-100">
                {template.name}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TemplateRecommendations;
