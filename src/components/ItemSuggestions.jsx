
import React from 'react';
import { Lightbulb, Plus, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";

const ItemSuggestions = ({ suggestions, isLoading, onAddSuggestion }) => {
  if (isLoading) {
    return (
      <div className="mb-4 p-4 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg border border-blue-200/50 dark:border-blue-700/50">
        <div className="flex items-center gap-2 mb-2">
          <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
          <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
            Generating smart suggestions...
          </span>
        </div>
      </div>
    );
  }

  if (suggestions.length === 0) return null;

  return (
    <div className="mb-4 p-4 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg border border-blue-200/50 dark:border-blue-700/50">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="h-4 w-4 text-blue-600" />
        <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
          Smart Suggestions
        </span>
      </div>
      <div className="space-y-2">
        {suggestions.map((suggestion, index) => (
          <div key={index} className="flex items-center justify-between p-2 bg-white/50 dark:bg-gray-800/50 rounded border">
            <div className="flex-1">
              <div className="font-medium text-sm">{suggestion.name}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">{suggestion.description}</div>
              <div className="text-xs text-green-600 dark:text-green-400">${suggestion.amount}</div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onAddSuggestion(suggestion)}
              className="ml-2"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemSuggestions;
