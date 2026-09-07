import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AddEditRecordModal } from '../components/AddEditRecordModal';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { EmptyState } from '../components/EmptyState';
import { ErrorBanner } from '../components/ErrorBanner';
import { Spinner } from '../components/Spinner';
import { SuccessToast } from '../components/SuccessToast';
import { useAuth } from '../hooks/useAuth';
import { useConfigList } from '../hooks/useConfigList';
import { useMedicationRecords } from '../hooks/useMedicationRecords';
import { useSuccessToast } from '../hooks/useSuccessToast';
import { groupByProduct } from '../lib/grouping';
import { formatRM } from '../lib/pricing';
import { createRecord, deleteRecords, renameProduct } from '../lib/records';
import type { ProductGroup } from '../types';

const AVATAR_COLORS = ['#ff4081', '#d6336c', '#a61c49', '#ff8fa6', '#c2185b'];

function avatarColor(seed: string): string {
  const index = seed.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

function formatDate(iso: string): string {
  if (!iso) return 'Unknown';
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
  const [deletingGroup, setDeletingGroup] = useState<ProductGroup | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [editingGroup, setEditingGroup] = useState<ProductGroup | null>(null);
  const [editName, setEditName] = useState('');
  const [renaming, setRenaming] = useState(false);
  const successToast = useSuccessToast();

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

  const allGroups = useMemo(() => groupByProduct(records), [records]);

  const groups = useMemo(() => {
    const sorted = [...allGroups].sort((a, b) => a.displayName.localeCompare(b.displayName));
    if (!search.trim()) return sorted;
    const q = search.trim().toLowerCase();
    return sorted.filter((g) => g.displayName.toLowerCase().includes(q));
  }, [allGroups, search]);

  const monthSpend = useMemo(() => {
    const now = new Date();
    const prefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    return records
      .filter((r) => r.datePurchased.startsWith(prefix))
      .reduce((sum, r) => sum + r.priceBought, 0);
  }, [records]);

  const firstName = user?.displayName?.split(' ')[0] ?? '';

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <p className="label-eyebrow">Klinik Soma · UbatLog</p>
      <h1 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-gray-900">
        Welcome back{firstName ? `, ${firstName}` : ''} 👋
      </h1>

      {!loading && !error && records.length > 0 && (
        <div className="mt-5 grid grid-cols-3 gap-3">
          <Card className="bg-gradient-to-br from-brand-50 to-white p-3.5">
            <p className="label-eyebrow">Products</p>
            <p className="mt-1 font-display text-xl font-extrabold text-gray-900">
              {allGroups.length}
            </p>
          </Card>
          <Card className="bg-gradient-to-br from-brand-50 to-white p-3.5">
            <p className="label-eyebrow">Restocks logged</p>
            <p className="mt-1 font-display text-xl font-extrabold text-gray-900">
              {records.length}
            </p>
          </Card>
          <Card className="bg-gradient-to-br from-brand-50 to-white p-3.5">
            <p className="label-eyebrow">Spent this month</p>
            <p className="mt-1 font-display text-xl font-extrabold text-brand-700">
              {formatRM(monthSpend)}
            </p>
          </Card>
        </div>
      )}

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
          {groups.map((g, index) => {
            const latest = g.records[0];
            const color = avatarColor(g.displayName);
            return (
              <Card
                key={g.key}
                className="group animate-fade-up relative cursor-pointer p-4 text-left opacity-0 transition-all [animation-fill-mode:forwards] hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(0,0,0,0.1)]"
                style={{ animationDelay: `${Math.min(index, 12) * 40}ms` }}
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
                  <div className="min-w-0 flex-1 pr-14">
                    <h3 className="truncate text-base font-semibold text-gray-900">
                      {g.displayName}
                    </h3>
                    <p className="mt-0.5 text-sm text-gray-500">
                      Restock count: {g.records.length}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-gray-400">
                      Last bought {formatDate(latest.datePurchased)} · {latest.manufacturerName}
                    </p>
                  </div>
                </button>
                <div className="absolute right-3 top-3 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditName(g.displayName);
                      setEditingGroup(g);
                    }}
                    aria-label={`Edit ${g.displayName}`}
                    className="flex h-7 w-7 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-brand-50 hover:text-brand-600 active:bg-brand-50 active:text-brand-600"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeletingGroup(g);
                    }}
                    aria-label={`Delete ${g.displayName}`}
                    className="flex h-7 w-7 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 active:bg-red-50 active:text-red-600"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
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
            successToast.show('Purchase saved');
          }}
        />
      )}

      {editingGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm animate-modal-in rounded-3xl border border-black/5 bg-white p-6 shadow-2xl">
            <h3 className="font-display text-lg font-bold text-gray-900">Rename product</h3>
            <p className="mt-2 text-sm text-gray-500">
              Renames this product across all {editingGroup.records.length} purchase record(s).
            </p>
            <div className="mt-4">
              <label className="label-eyebrow mb-1 block">Product name</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                autoFocus
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:border-brand-500 focus:bg-white focus:outline-none transition-colors"
              />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setEditingGroup(null)}>
                Cancel
              </Button>
              <Button
                disabled={!editName.trim() || renaming}
                onClick={async () => {
                  if (!editingGroup || !editName.trim() || renaming) return;
                  setRenaming(true);
                  try {
                    await renameProduct(
                      editingGroup.records.map((r) => r.id),
                      editName.trim(),
                    );
                    successToast.show('Product updated');
                  } finally {
                    setRenaming(false);
                    setEditingGroup(null);
                  }
                }}
              >
                {renaming ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {deletingGroup && (
        <ConfirmDialog
          title={`Delete ${deletingGroup.displayName}?`}
          message={`This will permanently delete all ${deletingGroup.records.length} purchase record(s) for this product. This cannot be undone.`}
          confirmLabel={deleting ? 'Deleting...' : 'Delete'}
          danger
          onCancel={() => setDeletingGroup(null)}
          onConfirm={async () => {
            if (deleting) return;
            setDeleting(true);
            try {
              await deleteRecords(deletingGroup.records.map((r) => r.id));
              successToast.show('Product deleted');
            } finally {
              setDeleting(false);
              setDeletingGroup(null);
            }
          }}
        />
      )}

      {successToast.message && (
        <SuccessToast message={successToast.message} onDone={successToast.clear} />
      )}
    </div>
  );
}
