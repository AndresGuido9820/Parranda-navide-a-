import React from 'react';

interface FilterTagsProps {
  selectedFilters: string[];
  onFilterChange: (filter: string) => void;
}

const filters = [
  { key: 'familia', label: 'familia' },
  { key: 'ninios', label: 'niños' },
  { key: 'adultos', label: 'adultos' },
  { key: 'sin-materiales', label: 'sin materiales' },
  { key: 'menos-15min', label: '≤ 15 min' },
];

export const FilterTags: React.FC<FilterTagsProps> = ({
  selectedFilters,
  onFilterChange,
}) => {
  return (
    <div className="flex flex-wrap gap-3">
      {filters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => onFilterChange(filter.key)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedFilters.includes(filter.key)
              ? 'bg-primary text-white'
              : 'bg-white/10 text-white/60 hover:bg-white/20'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};
