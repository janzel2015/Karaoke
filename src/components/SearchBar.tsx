// KAPTEN KARAOKE - Search Bar Component
import { Search, X } from 'lucide-react';
import { useState, useCallback, useEffect } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search songs, artists...',
  autoFocus = false,
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleClear = useCallback(() => {
    onChange('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [onChange]);

  return (
    <div
      className={`
        relative flex items-center
        transition-all duration-200
        ${isFocused ? 'scale-[1.02]' : ''}
      `}
    >
      <Search
        className={`
          absolute left-4 w-5 h-5 transition-colors
          ${isFocused ? 'text-white' : 'text-gray-400'}
        `}
      />
      
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="search-input w-full"
      />
      
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-4 p-1 rounded-full bg-gray-600 hover:bg-gray-500 transition-colors"
        >
          <X className="w-3 h-3 text-white" />
        </button>
      )}
    </div>
  );
}

import { useRef } from 'react';

// Search filters
interface SearchFiltersProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

const filters = [
  { id: 'all', label: 'All' },
  { id: 'songs', label: 'Songs' },
  { id: 'artists', label: 'Artists' },
  { id: 'albums', label: 'Albums' },
  { id: 'karaoke', label: 'Karaoke' },
];

export function SearchFilters({ selectedFilter, onFilterChange }: SearchFiltersProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={`
            px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
            transition-all duration-200
            ${selectedFilter === filter.id
              ? 'bg-white text-black'
              : 'bg-white/10 text-white hover:bg-white/20'
            }
          `}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
