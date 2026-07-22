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
      <label htmlFor={id} className="label-eyebrow mb-1 block">
        {label} {required && <span className="text-brand-600">*</span>}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 150)}
        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm transition-colors focus:border-brand-500 focus:bg-white focus:outline-none"
        autoComplete="off"
      />
      {showDropdown && (
        <ul className="absolute z-20 mt-1 w-full max-h-48 overflow-auto rounded-xl border border-black/5 bg-white shadow-lg">
          {filtered.map((s) => (
            <li key={s}>
              <button
                type="button"
                className="w-full cursor-pointer text-left px-3 py-2 hover:bg-brand-50 text-sm transition-colors"
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
