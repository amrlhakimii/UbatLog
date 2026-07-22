import { useMemo, useState } from 'react';

interface AutocompleteInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
  placeholder?: string;
  required?: boolean;
}

export function AutocompleteInput({
  id,
  label,
  value,
  onChange,
  suggestions,
  placeholder,
  required,
}: AutocompleteInputProps) {
  const [focused, setFocused] = useState(false);

  const filtered = useMemo(() => {
    const query = value.trim().toLowerCase();
    const distinct = Array.from(new Set(suggestions.filter(Boolean)));
    if (!query) return distinct.slice(0, 8);
    return distinct.filter((s) => s.toLowerCase().includes(query)).slice(0, 8);
  }, [value, suggestions]);

  const showDropdown = focused && filtered.length > 0;

  return (
    <div className="relative">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 150)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-base focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
        autoComplete="off"
      />
      {showDropdown && (
        <ul className="absolute z-20 mt-1 w-full max-h-48 overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg">
          {filtered.map((s) => (
            <li key={s}>
              <button
                type="button"
                className="w-full text-left px-3 py-2 hover:bg-brand-50 text-sm"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onChange(s);
                  setFocused(false);
                }}
              >
                {s}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
