import React, { useState } from 'react';

interface TagInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
  label?: string;
  hint?: string;
}

export const TagInput: React.FC<TagInputProps> = ({
  tags,
  onTagsChange,
  placeholder = "Escribe y presiona Enter",
  label,
  hint,
}) => {
  const [inputValue, setInputValue] = useState('');

  const addTag = (value: string) => {
    const cleanValue = value.trim().replace(/\s+/g, ' ').toLowerCase();
    if (cleanValue && !tags.includes(cleanValue)) {
      onTagsChange([...tags, cleanValue]);
    }
    setInputValue('');
  };

  const removeTag = (index: number) => {
    onTagsChange(tags.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(inputValue);
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-xs text-[#b9acac] font-medium">{label}</label>
      )}
      
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full bg-[#0f0b0b] text-[#f0f0f0] border border-white/8 rounded-xl px-3 py-3 focus:border-[#f7a940]/55 focus:ring-3 focus:ring-[#f7a940]/12 outline-none transition-all"
      />

      {hint && (
        <p className="text-xs text-[#b9acac]">{hint}</p>
      )}

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-2 px-2 py-1 bg-[#2a1c1c] border border-white/8 rounded-full text-[#e7dcdc] text-xs"
            >
              {tag}
              <button
                onClick={() => removeTag(index)}
                className="text-[#d8bcbc] hover:text-white transition-colors"
                aria-label="Quitar"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
