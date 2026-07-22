import { Plus, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AddEditRecordModal } from '../components/AddEditRecordModal';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { ErrorBanner } from '../components/ErrorBanner';
import { Spinner } from '../components/Spinner';
import { useAuth } from '../hooks/useAuth';
import { useConfigList } from '../hooks/useConfigList';
import { useMedicationRecords } from '../hooks/useMedicationRecords';
import { groupByProduct } from '../lib/grouping';
import { createRecord } from '../lib/records';

const AVATAR_COLORS = ['#ff4081', '#d6336c', '#a61c49', '#ff8fa6', '#c2185b'];

function avatarColor(seed: string): string {
  const index = seed.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function ProductsIndex() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { records, loading, error } = useMedicationRecords();
  const { values: typeOptions } = useConfigList('types');
  const { values: unitOptions } = useConfigList('units');
  const [search, setSearch] = useState('');
  const [addingNew, setAddingNew] = useState(false);

  const manufacturerOptions = useMemo(
    () => Array.from(new Set(records.map((r) => r.manufacturerName))).sort(),
    [records],
  );
  const pharmacyOptions = useMemo(
    () => Array.from(new Set(records.map((r) => r.pharmacyBoughtFrom))).sort(),
    [records],
  );
  const productOptions = useMemo(
    () => Array.from(new Set(records.map((r) => r.productName))).sort(),
    [records],
  );

  const groups = useMemo(() => {
    const all = groupByProduct(records).sort((a, b) => a.displayName.localeCompare(b.displayName));
    if (!search.trim()) return all;
    const q = search.trim().toLowerCase();
    return all.filter((g) => g.displayName.toLowerCase().includes(q));
  }, [records, search]);

  const firstName = user?.displayName?.split(' ')[0] ?? '';

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <p className="label-eyebrow">Klinik Soma · UbatLog</p>
      <h1 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-gray-900">
        Welcome back{firstName ? `, ${firstName}` : ''} 👋
      </h1>

      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-500">Products</h2>
        <Button icon={<Plus size={16} />} onClick={() => setAddingNew(true)}>
          Add Entry
        </Button>
      </div>

      <div className="relative mt-4 max-w-sm">
        <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm transition-colors focus:border-brand-500 focus:bg-white focus:outline-none"
        />
      </div>

      {error ? (
        <div className="mt-4">
          <ErrorBanner error={error} />
        </div>
      ) : loading ? (
        <Spinner label="Loading products..." />
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((g) => {
            const latest = g.records[0];
            const color = avatarColor(g.displayName);
            return (
              <Card
                key={g.key}
                className="animate-fade-up cursor-pointer p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(0,0,0,0.1)]"
              >
                <button
                  type="button"
                  onClick={() => navigate(`/products/${encodeURIComponent(g.key)}`)}
                  className="flex w-full cursor-pointer items-start gap-3 text-left"
                >
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}
                  >
                    {g.displayName.charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-semibold text-gray-900">
                      {g.displayName}
                    </h3>
                    <p className="mt-0.5 text-sm text-gray-500">
                      {g.records.length} purchase{g.records.length === 1 ? '' : 's'}
                    </p>
                    <p className="mt-0.5 whitespace-nowrap text-xs text-gray-400">
                      Last bought {formatDate(latest.datePurchased)} · {latest.manufacturerName}
                    </p>
                  </div>
                </button>
              </Card>
            );
          })}
          {groups.length === 0 && (
            <div className="col-span-full">
              <EmptyState emoji="📋" message="No products yet — add your first purchase to get started." />
            </div>
          )}
        </div>
      )}

      {addingNew && (
        <AddEditRecordModal
          mode="add"
          manufacturerSuggestions={manufacturerOptions}
          pharmacySuggestions={pharmacyOptions}
          productSuggestions={productOptions}
          typeOptions={typeOptions}
          unitOptions={unitOptions}
          onClose={() => setAddingNew(false)}
          onSave={async (input) => {
            await createRecord(input);
          }}
        />
      )}
    </div>
  );
}
