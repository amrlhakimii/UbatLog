import { DEFAULT_FILTERS, type QuickRange, type RecordFilters } from '../lib/filters';

interface FilterBarProps {
  filters: RecordFilters;
  onChange: (filters: RecordFilters) => void;
  manufacturerOptions: string[];
  pharmacyOptions: string[];
  typeOptions: string[];
}

const QUICK_RANGES: { key: QuickRange; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'This Week' },
  { key: 'month', label: 'This Month' },
  { key: 'all', label: 'All Time' },
];

export function FilterBar({
  filters,
  onChange,
  manufacturerOptions,
  pharmacyOptions,
  typeOptions,
}: FilterBarProps) {
  const set = (patch: Partial<RecordFilters>) => onChange({ ...filters, ...patch });

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex flex-wrap items-center gap-2">
        {QUICK_RANGES.map((qr) => (
          <button
            key={qr.key}
            type="button"
            onClick={() => set({ quickRange: qr.key, dateFrom: '', dateTo: '' })}
            className={`rounded-full px-3 py-1.5 text-sm font-medium ${
              filters.quickRange === qr.key && !filters.dateFrom && !filters.dateTo
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {qr.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onChange(DEFAULT_FILTERS)}
          className="ml-auto text-sm font-medium text-purple-600 hover:text-purple-800"
        >
          Clear filters
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">From</label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => set({ dateFrom: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">To</label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => set({ dateTo: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Manufacturer</label>
          <select
            value={filters.manufacturer}
            onChange={(e) => set({ manufacturer: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm"
          >
            <option value="">All</option>
            {manufacturerOptions.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Pharmacy</label>
          <select
            value={filters.pharmacy}
            onChange={(e) => set({ pharmacy: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm"
          >
            <option value="">All</option>
            {pharmacyOptions.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Type</label>
          <select
            value={filters.type}
            onChange={(e) => set({ type: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm"
          >
            <option value="">All</option>
            {typeOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-xs font-medium text-gray-500 mb-1">Search product</label>
        <input
          type="text"
          placeholder="Search by product name..."
          value={filters.productQuery}
          onChange={(e) => set({ productQuery: e.target.value })}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
      </div>
    </div>
  );
}
