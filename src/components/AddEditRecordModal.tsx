import { useMemo, useState } from 'react';
import { AutocompleteInput } from './AutocompleteInput';
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
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 px-4 py-8">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>

        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of purchase <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={datePurchased}
              onChange={(e) => setDatePurchased(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type <span className="text-red-500">*</span>
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
              >
                <option value="">Select...</option>
                {typeOptions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unit <span className="text-red-500">*</span>
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
              >
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity per package <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={quantityPerPackage}
              onChange={(e) => setQuantityPerPackage(e.target.value)}
              placeholder="e.g. 28"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price bought (whole pack, RM) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={priceBought}
                onChange={(e) => setPriceBought(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Actual selling price / unit (RM) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={actualSellingPricePerUnit}
                onChange={(e) => setActualSellingPricePerUnit(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
              />
            </div>
          </div>

          {pricingValid && (
            <div className="grid grid-cols-2 gap-4 rounded-lg bg-purple-50 p-4">
              <div>
                <div className="text-xs text-gray-500">Cost per unit</div>
                <div className="text-base font-semibold text-gray-900">{formatRM(cost)}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Recommended price / unit</div>
                <div className="text-base font-semibold text-purple-700">
                  {formatRM(recommended)}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          {mode === 'edit' && onDelete ? (
            <button
              type="button"
              onClick={() => setConfirmingDelete(true)}
              className="text-sm font-medium text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          ) : (
            <span />
          )}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!isValid || saving}
              className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
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
