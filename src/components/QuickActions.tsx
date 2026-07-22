import { Calculator, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AddEditRecordModal } from './AddEditRecordModal';
import { SuccessToast } from './SuccessToast';
import { useConfigList } from '../hooks/useConfigList';
import { useMedicationRecords } from '../hooks/useMedicationRecords';
import { useSuccessToast } from '../hooks/useSuccessToast';
import { createRecord } from '../lib/records';

export function QuickActions() {
  const navigate = useNavigate();
  const { records } = useMedicationRecords();
  const { values: typeOptions } = useConfigList('types');
  const { values: unitOptions } = useConfigList('units');
  const [adding, setAdding] = useState(false);
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

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        <button
          type="button"
          onClick={() => navigate('/calculator')}
          title="Quick Price Calculator"
          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-black/5 bg-white/90 text-brand-600 shadow-[0_4px_20px_rgba(0,0,0,0.12)] backdrop-blur-sm transition-transform hover:-translate-y-0.5"
        >
          <Calculator size={18} />
        </button>
        <button
          type="button"
          onClick={() => setAdding(true)}
          title="Add Entry"
          className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-gradient-to-r from-brand-500 to-brand-700 text-white shadow-[0_8px_24px_rgba(255,64,129,0.45)] transition-transform hover:scale-105 active:scale-95"
        >
          <Plus size={24} />
        </button>
      </div>

      {adding && (
        <AddEditRecordModal
          mode="add"
          manufacturerSuggestions={manufacturerOptions}
          pharmacySuggestions={pharmacyOptions}
          productSuggestions={productOptions}
          typeOptions={typeOptions}
          unitOptions={unitOptions}
          onClose={() => setAdding(false)}
          onSave={async (input) => {
            await createRecord(input);
            successToast.show('Purchase saved');
          }}
        />
      )}

      {successToast.message && (
        <SuccessToast message={successToast.message} onDone={successToast.clear} />
      )}
    </>
  );
}
