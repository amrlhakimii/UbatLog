import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AddEditRecordModal } from '../components/AddEditRecordModal';
import { ErrorBanner } from '../components/ErrorBanner';
import { useConfigList } from '../hooks/useConfigList';
import { useMedicationRecords } from '../hooks/useMedicationRecords';
import { groupByProduct } from '../lib/grouping';
import { createRecord } from '../lib/records';

export function ProductsIndex() {
  const navigate = useNavigate();
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

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Products</h1>
        <button
          type="button"
          onClick={() => setAddingNew(true)}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          + Add Entry
        </button>
      </div>

      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mt-4 w-full max-w-sm rounded-lg border border-gray-300 px-3 py-2 text-sm"
      />

      {error ? (
        <div className="mt-4">
          <ErrorBanner error={error} />
        </div>
      ) : loading ? (
        <div className="py-12 text-center text-gray-400">Loading products...</div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((g) => {
            const latest = g.records[0];
            return (
              <button
                key={g.key}
                type="button"
                onClick={() => navigate(`/products/${encodeURIComponent(g.key)}`)}
                className="rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm hover:border-brand-300 hover:shadow-md"
              >
                <h2 className="text-base font-semibold text-gray-900">{g.displayName}</h2>
                <p className="mt-1 text-sm text-gray-500">
                  {g.records.length} purchase{g.records.length === 1 ? '' : 's'} · last{' '}
                  {latest.datePurchased}
                </p>
                <p className="mt-1 text-xs text-gray-400">{latest.manufacturerName}</p>
              </button>
            );
          })}
          {groups.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-400">
              No products found.
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
