import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AddEditRecordModal } from '../components/AddEditRecordModal';
import { ErrorBanner } from '../components/ErrorBanner';
import { QuickPriceCalculator } from '../components/QuickPriceCalculator';
import { RecordsTable } from '../components/RecordsTable';
import { UndoToast } from '../components/UndoToast';
import { useConfigList } from '../hooks/useConfigList';
import { useDeleteWithUndo } from '../hooks/useDeleteWithUndo';
import { useMedicationRecords } from '../hooks/useMedicationRecords';
import { groupKey } from '../lib/grouping';
import { createRecord, updateRecord } from '../lib/records';
import type { MedicationRecord } from '../types';

export function ProductPage() {
  const { slug = '' } = useParams();
  const { records, loading, error } = useMedicationRecords();
  const { values: typeOptions } = useConfigList('types');
  const { values: unitOptions } = useConfigList('units');
  const [modalRecord, setModalRecord] = useState<MedicationRecord | 'new' | null>(null);
  const { pendingDeleteId, pendingLabel, requestDelete, undo, expire } = useDeleteWithUndo();

  const decodedSlug = decodeURIComponent(slug);

  const productRecords = useMemo(
    () =>
      records
        .filter((r) => groupKey(r.productName) === decodedSlug)
        .filter((r) => r.id !== pendingDeleteId)
        .sort((a, b) => b.createdAt - a.createdAt),
    [records, decodedSlug, pendingDeleteId],
  );

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

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-6">
        <Link to="/" className="text-sm text-brand-600 hover:underline">
          &larr; Back to Products
        </Link>
        <div className="mt-6">
          <ErrorBanner error={error} />
        </div>
      </div>
    );
  }

  if (!loading && productRecords.length === 0 && !modalRecord) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-6">
        <Link to="/" className="text-sm text-brand-600 hover:underline">
          &larr; Back to Products
        </Link>
        <div className="mt-6 text-center text-gray-400">Product not found.</div>
      </div>
    );
  }

  const latest = productRecords[0];
  const displayName = latest?.productName ?? decodedSlug;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <Link to="/" className="text-sm text-brand-600 hover:underline">
        &larr; Back to Products
      </Link>

      <div className="mt-2 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">{displayName}</h1>
        <button
          type="button"
          onClick={() => setModalRecord('new')}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          + Add Purchase
        </button>
      </div>

      {latest && (
        <div className="mt-6">
          <QuickPriceCalculator
            key={latest.id}
            initialPriceBought={latest.priceBought}
            initialQuantityPerPackage={latest.quantityPerPackage}
          />
        </div>
      )}

      <div className="mt-6">
        <h2 className="mb-2 text-sm font-semibold text-gray-600">Purchase history</h2>
        {loading ? (
          <div className="py-12 text-center text-gray-400">Loading...</div>
        ) : (
          <RecordsTable records={productRecords} onRowClick={setModalRecord} />
        )}
      </div>

      {modalRecord && (
        <AddEditRecordModal
          mode={modalRecord === 'new' ? 'add' : 'edit'}
          initial={
            modalRecord === 'new'
              ? { productName: displayName, manufacturerName: latest?.manufacturerName ?? '' }
              : modalRecord
          }
          manufacturerSuggestions={manufacturerOptions}
          pharmacySuggestions={pharmacyOptions}
          productSuggestions={productOptions}
          typeOptions={typeOptions}
          unitOptions={unitOptions}
          onClose={() => setModalRecord(null)}
          onSave={async (input) => {
            if (modalRecord === 'new') {
              await createRecord(input);
            } else {
              await updateRecord(modalRecord.id, input);
            }
          }}
          onDelete={modalRecord !== 'new' ? () => requestDelete(modalRecord) : undefined}
        />
      )}

      {pendingDeleteId && (
        <UndoToast message={`Deleted ${pendingLabel}`} onUndo={undo} onExpire={expire} />
      )}
    </div>
  );
}
