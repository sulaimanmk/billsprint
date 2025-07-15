
import React, { useState } from 'react';
import { Save, Clock, Trash2, Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const RecurringTemplates = ({ 
  savedTemplates, 
  onSaveTemplate, 
  onLoadTemplate, 
  onDeleteTemplate,
  currentFormData 
}) => {
  const [isReduced, setIsReduced] = useState(true);
  const [templateName, setTemplateName] = useState('');
  const [showSaveForm, setShowSaveForm] = useState(false);

  const handleSaveTemplate = () => {
    if (templateName.trim()) {
      onSaveTemplate(currentFormData, templateName.trim());
      setTemplateName('');
      setShowSaveForm(false);
    }
  };

  return (
    <div className="mb-6 p-4 bg-green-50/50 dark:bg-green-900/20 rounded-lg border border-green-200/50 dark:border-green-700/50">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-green-600" />
          <span className="text-sm font-medium text-green-800 dark:text-green-200">
            Recurring Templates
          </span>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setIsReduced(!isReduced)}
        >
          {isReduced ? 'Expand' : 'Collapse'}
        </Button>
      </div>

      {!isReduced && (
        <>
          {showSaveForm ? (
            <div className="mb-4 p-3 bg-white/50 dark:bg-gray-800/50 rounded border">
              <div className="flex gap-2">
                <Input
                  placeholder="Template name..."
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  className="flex-1"
                />
                <Button size="sm" onClick={handleSaveTemplate}>
                  Save
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setShowSaveForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowSaveForm(true)}
              className="mb-4"
            >
              <Save className="h-3 w-3 mr-1" />
              Save Current as Template
            </Button>
          )}

          {savedTemplates.length > 0 ? (
            <div className="space-y-2">
              {savedTemplates.map((template) => (
                <div key={template.id} className="flex items-center justify-between p-2 bg-white/50 dark:bg-gray-800/50 rounded border">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{template.name}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Used {template.usageCount} times • {new Date(template.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onLoadTemplate(template.id)}
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDeleteTemplate(template.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              No saved templates yet. Save your current invoice as a template for quick reuse.
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default RecurringTemplates;
