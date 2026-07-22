import { X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { AutocompleteInput } from './AutocompleteInput';
import { Button } from './Button';
import { ConfirmDialog } from './ConfirmDialog';
import { costPerUnit, formatRM, recommendedPricePerUnit } from '../lib/pricing';
import type { MedicationRecordInput } from '../types';

interface AddEditRecordModalProps {
  mode: 'add' | 'edit';
  initial?: Partial<MedicationRecordInput>;
  manufacturerSuggestions: string[];
  pharmacySuggestions: string[];
  productSuggestions: string[];
  typeOptions: string[];
  unitOptions: string[];
  onClose: () => void;
  onSave: (input: MedicationRecordInput) => Promise<void>;
  onDelete?: () => void;
}

const inputClass =
  'w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:border-brand-500 focus:bg-white focus:outline-none transition-colors';
const labelClass = 'label-eyebrow mb-1 block';

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function AddEditRecordModal({
  mode,
  initial,
  manufacturerSuggestions,
  pharmacySuggestions,
  productSuggestions,
  typeOptions,
  unitOptions,
  onClose,
  onSave,
  onDelete,
}: AddEditRecordModalProps) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [datePurchased, setDatePurchased] = useState(initial?.datePurchased ?? todayISO());
  const [manufacturerName, setManufacturerName] = useState(initial?.manufacturerName ?? '');
  const [pharmacyBoughtFrom, setPharmacyBoughtFrom] = useState(initial?.pharmacyBoughtFrom ?? '');
  const [productName, setProductName] = useState(initial?.productName ?? '');
  const [type, setType] = useState(initial?.type ?? '');
  const [unit, setUnit] = useState(initial?.unit ?? '');
  const [quantityPerPackage, setQuantityPerPackage] = useState(
    initial?.quantityPerPackage?.toString() ?? '',
  );
  const [priceBought, setPriceBought] = useState(initial?.priceBought?.toString() ?? '');
  const [actualSellingPricePerUnit, setActualSellingPricePerUnit] = useState(
    initial?.actualSellingPricePerUnit?.toString() ?? '',
  );
  const [saving, setSaving] = useState(false);

  const qty = parseFloat(quantityPerPackage);
  const price = parseFloat(priceBought);
  const actualPrice = parseFloat(actualSellingPricePerUnit);

  const pricingValid = qty > 0 && price >= 0;
  const cost = pricingValid ? costPerUnit(price, qty) : 0;
  const recommended = pricingValid ? recommendedPricePerUnit(cost) : 0;

  const isValid =
    datePurchased.trim() !== '' &&
    manufacturerName.trim() !== '' &&
    pharmacyBoughtFrom.trim() !== '' &&
    productName.trim() !== '' &&
    type.trim() !== '' &&
    unit.trim() !== '' &&
    qty > 0 &&
    price >= 0 &&
    actualPrice >= 0;

  const handleSave = async () => {
    if (!isValid || saving) return;
    setSaving(true);
    try {
      await onSave({
        datePurchased,
        manufacturerName: manufacturerName.trim(),
        pharmacyBoughtFrom: pharmacyBoughtFrom.trim(),
        productName: productName.trim(),
        type,
        unit,
        quantityPerPackage: qty,
        priceBought: price,
        actualSellingPricePerUnit: actualPrice,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const title = useMemo(() => (mode === 'add' ? 'Add Purchase' : 'Edit Purchase'), [mode]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 px-4 py-8 backdrop-blur-sm">
      <div className="w-full max-w-lg animate-modal-in rounded-3xl border border-black/5 bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-gray-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <label className={labelClass}>
              Date of purchase <span className="text-brand-600">*</span>
            </label>
            <input
              type="date"
              value={datePurchased}
              onChange={(e) => setDatePurchased(e.target.value)}
              className={inputClass}
            />
          </div>

          <AutocompleteInput
            id="manufacturerName"
            label="Manufacturer name"
            value={manufacturerName}
            onChange={setManufacturerName}
            suggestions={manufacturerSuggestions}
            required
          />

          <AutocompleteInput
            id="pharmacyBoughtFrom"
            label="Pharmacy bought from"
            value={pharmacyBoughtFrom}
            onChange={setPharmacyBoughtFrom}
            suggestions={pharmacySuggestions}
            required
          />

          <AutocompleteInput
            id="productName"
            label="Product name (generic, e.g. Cetirizine)"
            value={productName}
            onChange={setProductName}
            suggestions={productSuggestions}
            placeholder="Generic name — used to group purchase history"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>
                Type <span className="text-brand-600">*</span>
              </label>
              <select value={type} onChange={(e) => setType(e.target.value)} className={inputClass}>
                <option value="">Select...</option>
                {typeOptions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>
                Unit <span className="text-brand-600">*</span>
              </label>
              <select value={unit} onChange={(e) => setUnit(e.target.value)} className={inputClass}>
                <option value="">Select...</option>
                {unitOptions.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>
              Quantity per package <span className="text-brand-600">*</span>
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={quantityPerPackage}
              onChange={(e) => setQuantityPerPackage(e.target.value)}
              placeholder="e.g. 28"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>
                Price bought (whole pack, RM) <span className="text-brand-600">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={priceBought}
                onChange={(e) => setPriceBought(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>
                Actual selling price / unit (RM) <span className="text-brand-600">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={actualSellingPricePerUnit}
                onChange={(e) => setActualSellingPricePerUnit(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {pricingValid && (
            <div className="grid grid-cols-2 gap-4 rounded-2xl bg-gradient-to-br from-brand-50 to-white p-4">
              <div>
                <div className="label-eyebrow">Cost per unit</div>
                <div className="mt-1 text-base font-bold text-gray-900">{formatRM(cost)}</div>
              </div>
              <div>
                <div className="label-eyebrow">Recommended price / unit</div>
                <div className="mt-1 text-base font-bold text-brand-700">{formatRM(recommended)}</div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          {mode === 'edit' && onDelete ? (
            <Button variant="ghost" size="sm" onClick={() => setConfirmingDelete(true)} className="text-red-600 hover:bg-red-50 hover:text-red-700">
              Delete
            </Button>
          ) : (
            <span />
          )}
          <div className="flex gap-3">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!isValid || saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </div>

      {confirmingDelete && onDelete && (
        <ConfirmDialog
          title="Delete this purchase record?"
          message="You'll have a few seconds to undo this after confirming."
          confirmLabel="Delete"
          danger
          onCancel={() => setConfirmingDelete(false)}
          onConfirm={() => {
            setConfirmingDelete(false);
            onDelete();
            onClose();
          }}
        />
      )}
    </div>
  );
}
