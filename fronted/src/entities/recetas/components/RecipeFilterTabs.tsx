import React from 'react';

interface RecipeFilterTabsProps {
  activeTab: 'mis-recetas' | 'comunidad';
  onTabChange: (tab: 'mis-recetas' | 'comunidad') => void;
}

export const RecipeFilterTabs: React.FC<RecipeFilterTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="flex items-center gap-0">
      <button
        onClick={() => onTabChange('mis-recetas')}
        className={`px-4 py-1 text-sm font-semibold rounded-l-lg transition-all ${
          activeTab === 'mis-recetas'
            ? 'bg-red-600 text-white'
            : 'bg-transparent text-gray-300 hover:text-white'
        }`}
      >
        Mis recetas
      </button>
      <button
        onClick={() => onTabChange('comunidad')}
        className={`px-4 py-1 text-sm font-semibold rounded-r-lg transition-all ${
          activeTab === 'comunidad'
            ? 'bg-red-600 text-white'
            : 'bg-transparent text-gray-300 hover:text-white'
        }`}
      >
        Comunidad
      </button>
    </div>
  );
};
