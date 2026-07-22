import { ArrowLeft, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AddEditRecordModal } from '../components/AddEditRecordModal';
import { Button } from '../components/Button';
import { ErrorBanner } from '../components/ErrorBanner';
import { QuickPriceCalculator } from '../components/QuickPriceCalculator';
import { RecordsTable } from '../components/RecordsTable';
import { Spinner } from '../components/Spinner';
import { UndoToast } from '../components/UndoToast';
import { useConfigList } from '../hooks/useConfigList';
import { useDeleteWithUndo } from '../hooks/useDeleteWithUndo';
import { useMedicationRecords } from '../hooks/useMedicationRecords';
import { groupKey } from '../lib/grouping';
import { createRecord, updateRecord } from '../lib/records';
import type { MedicationRecord } from '../types';

function BackLink() {
  return (
    <Link
      to="/"
      className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-800"
    >
      <ArrowLeft size={14} />
      Back to Products
    </Link>
  );
}

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
        <BackLink />
        <div className="mt-6">
          <ErrorBanner error={error} />
        </div>
      </div>
    );
  }

  if (!loading && productRecords.length === 0 && !modalRecord) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-6">
        <BackLink />
        <div className="mt-6 text-center text-gray-400">Product not found.</div>
      </div>
    );
  }

  const latest = productRecords[0];
  const displayName = latest?.productName ?? decodedSlug;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <BackLink />

      <div className="mt-2 flex items-center justify-between">
        <h1 className="font-display text-xl font-extrabold tracking-tight text-gray-900">
          {displayName}
        </h1>
        <Button icon={<Plus size={16} />} onClick={() => setModalRecord('new')}>
          Add Purchase
        </Button>
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
        <h2 className="label-eyebrow mb-2">Purchase history</h2>
        {loading ? (
          <Spinner />
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
