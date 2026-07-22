import { Card } from './Card';
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

const selectClass =
  'w-full rounded-xl border border-gray-200 bg-gray-50 px-2 py-1.5 text-sm transition-colors focus:border-brand-500 focus:bg-white focus:outline-none';

export function FilterBar({
  filters,
  onChange,
  manufacturerOptions,
  pharmacyOptions,
  typeOptions,
}: FilterBarProps) {
  const set = (patch: Partial<RecordFilters>) => onChange({ ...filters, ...patch });

  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-center gap-2">
        {QUICK_RANGES.map((qr) => {
          const active = filters.quickRange === qr.key && !filters.dateFrom && !filters.dateTo;
          return (
            <button
              key={qr.key}
              type="button"
              onClick={() => set({ quickRange: qr.key, dateFrom: '', dateTo: '' })}
              className={`cursor-pointer rounded-full px-3 py-1.5 text-sm font-medium transition-all ${
                active
                  ? 'bg-gradient-to-r from-brand-500 to-brand-700 text-white shadow-[0_4px_14px_rgba(255,64,129,0.3)]'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {qr.label}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => onChange(DEFAULT_FILTERS)}
          className="ml-auto cursor-pointer text-sm font-medium text-brand-600 hover:text-brand-800"
        >
          Clear filters
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <label className="label-eyebrow mb-1 block">From</label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => set({ dateFrom: e.target.value })}
            className={selectClass}
          />
        </div>
        <div>
          <label className="label-eyebrow mb-1 block">To</label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => set({ dateTo: e.target.value })}
            className={selectClass}
          />
        </div>
        <div>
          <label className="label-eyebrow mb-1 block">Manufacturer</label>
          <select
            value={filters.manufacturer}
            onChange={(e) => set({ manufacturer: e.target.value })}
            className={selectClass}
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
          <label className="label-eyebrow mb-1 block">Pharmacy</label>
          <select
            value={filters.pharmacy}
            onChange={(e) => set({ pharmacy: e.target.value })}
            className={selectClass}
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
          <label className="label-eyebrow mb-1 block">Type</label>
          <select
            value={filters.type}
            onChange={(e) => set({ type: e.target.value })}
            className={selectClass}
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
        <label className="label-eyebrow mb-1 block">Search product</label>
        <input
          type="text"
          placeholder="Search by product name..."
          value={filters.productQuery}
          onChange={(e) => set({ productQuery: e.target.value })}
          className={selectClass}
        />
      </div>
    </Card>
  );
}
