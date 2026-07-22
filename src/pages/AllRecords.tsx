import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { AddEditRecordModal } from '../components/AddEditRecordModal';
import { Button } from '../components/Button';
import { ErrorBanner } from '../components/ErrorBanner';
import { FilterBar } from '../components/FilterBar';
import { RecordsTable } from '../components/RecordsTable';
import { Spinner } from '../components/Spinner';
import { SuccessToast } from '../components/SuccessToast';
import { UndoToast } from '../components/UndoToast';
import { useConfigList } from '../hooks/useConfigList';
import { useDeleteWithUndo } from '../hooks/useDeleteWithUndo';
import { useMedicationRecords } from '../hooks/useMedicationRecords';
import { useSuccessToast } from '../hooks/useSuccessToast';
import { applyFilters, DEFAULT_FILTERS, type RecordFilters } from '../lib/filters';
import { createRecord, updateRecord } from '../lib/records';
import type { MedicationRecord } from '../types';

export function AllRecords() {
  const { records, loading, error } = useMedicationRecords();
  const { values: typeOptions } = useConfigList('types');
  const { values: unitOptions } = useConfigList('units');
  const [filters, setFilters] = useState<RecordFilters>(DEFAULT_FILTERS);
  const [modalRecord, setModalRecord] = useState<MedicationRecord | 'new' | null>(null);
  const { pendingDeleteId, pendingLabel, requestDelete, undo, expire } = useDeleteWithUndo();
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

  const visibleRecords = useMemo(
    () => applyFilters(records, filters).filter((r) => r.id !== pendingDeleteId),
    [records, filters, pendingDeleteId],
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl font-extrabold tracking-tight text-gray-900">
          All Records
        </h1>
        <Button icon={<Plus size={16} />} onClick={() => setModalRecord('new')}>
          Add Entry
        </Button>
      </div>

      <div className="mt-4">
        <FilterBar
          filters={filters}
          onChange={setFilters}
          manufacturerOptions={manufacturerOptions}
          pharmacyOptions={pharmacyOptions}
          typeOptions={typeOptions}
        />
      </div>

      <div className="mt-4">
        {error ? (
          <ErrorBanner error={error} />
        ) : loading ? (
          <Spinner label="Loading records..." />
        ) : (
          <RecordsTable records={visibleRecords} onRowClick={setModalRecord} />
        )}
      </div>

      {modalRecord && (
        <AddEditRecordModal
          mode={modalRecord === 'new' ? 'add' : 'edit'}
          initial={modalRecord === 'new' ? undefined : modalRecord}
          manufacturerSuggestions={manufacturerOptions}
          pharmacySuggestions={pharmacyOptions}
          productSuggestions={productOptions}
          typeOptions={typeOptions}
          unitOptions={unitOptions}
          onClose={() => setModalRecord(null)}
          onSave={async (input) => {
            if (modalRecord === 'new') {
              await createRecord(input);
              successToast.show('Purchase saved');
            } else {
              await updateRecord(modalRecord.id, input);
              successToast.show('Purchase updated');
            }
          }}
          onDelete={
            modalRecord !== 'new' ? () => requestDelete(modalRecord) : undefined
          }
        />
      )}

      {pendingDeleteId && (
        <UndoToast
          message={`Deleted ${pendingLabel}`}
          onUndo={undo}
          onExpire={expire}
        />
      )}

      {successToast.message && (
        <SuccessToast message={successToast.message} onDone={successToast.clear} />
      )}
    </div>
  );
}
