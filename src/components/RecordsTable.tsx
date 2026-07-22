import { useState } from 'react';
import { costPerUnit, formatRM, recommendedPricePerUnit } from '../lib/pricing';
import type { MedicationRecord } from '../types';

interface Column {
  key: string;
  label: string;
  sortable: boolean;
  render: (r: MedicationRecord) => string;
  sortValue?: (r: MedicationRecord) => string | number;
}

const COLUMNS: Column[] = [
  {
    key: 'datePurchased',
    label: 'Date',
    sortable: true,
    render: (r) => r.datePurchased,
    sortValue: (r) => r.datePurchased,
  },
  { key: 'manufacturerName', label: 'Manufacturer', sortable: true, render: (r) => r.manufacturerName },
  { key: 'pharmacyBoughtFrom', label: 'Pharmacy', sortable: true, render: (r) => r.pharmacyBoughtFrom },
  { key: 'productName', label: 'Product', sortable: true, render: (r) => r.productName },
  { key: 'type', label: 'Type', sortable: true, render: (r) => r.type },
  { key: 'unit', label: 'Unit', sortable: true, render: (r) => r.unit },
  {
    key: 'priceBought',
    label: 'Price Bought',
    sortable: true,
    render: (r) => formatRM(r.priceBought),
    sortValue: (r) => r.priceBought,
  },
  {
    key: 'costPerUnit',
    label: 'Cost/Unit',
    sortable: false,
    render: (r) => formatRM(costPerUnit(r.priceBought, r.quantityPerPackage)),
  },
  {
    key: 'recommendedPrice',
    label: 'Recommended Price/Unit',
    sortable: false,
    render: (r) => formatRM(recommendedPricePerUnit(costPerUnit(r.priceBought, r.quantityPerPackage))),
  },
  {
    key: 'actualSellingPricePerUnit',
    label: 'Actual Selling Price/Unit',
    sortable: true,
    render: (r) => formatRM(r.actualSellingPricePerUnit),
    sortValue: (r) => r.actualSellingPricePerUnit,
  },
];

const DEFAULT_VISIBLE = new Set(COLUMNS.map((c) => c.key));

interface RecordsTableProps {
  records: MedicationRecord[];
  onRowClick: (record: MedicationRecord) => void;
}

export function RecordsTable({ records, onRowClick }: RecordsTableProps) {
  const [visible, setVisible] = useState(DEFAULT_VISIBLE);
  const [sortKey, setSortKey] = useState('datePurchased');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [showColumnPicker, setShowColumnPicker] = useState(false);

  const toggleColumn = (key: string) => {
    setVisible((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleSort = (col: Column) => {
    if (!col.sortable) return;
    if (sortKey === col.key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(col.key);
      setSortDir('asc');
    }
  };

  const sortColumn = COLUMNS.find((c) => c.key === sortKey);
  const sorted = [...records].sort((a, b) => {
    if (!sortColumn?.sortValue) return 0;
    const av = sortColumn.sortValue(a);
    const bv = sortColumn.sortValue(b);
    const cmp = av < bv ? -1 : av > bv ? 1 : 0;
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const columns = COLUMNS.filter((c) => visible.has(c.key));

  return (
    <div>
      <div className="mb-2 flex justify-end">
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowColumnPicker((s) => !s)}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
          >
            Columns
          </button>
          {showColumnPicker && (
            <div className="absolute right-0 z-10 mt-1 w-56 rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
              {COLUMNS.map((c) => (
                <label key={c.key} className="flex items-center gap-2 py-1 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={visible.has(c.key)}
                    onChange={() => toggleColumn(c.key)}
                  />
                  {c.label}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col)}
                  className={`px-4 py-2 text-left font-medium text-gray-600 ${
                    col.sortable ? 'cursor-pointer select-none hover:text-gray-900' : ''
                  }`}
                >
                  {col.label}
                  {sortKey === col.key && (sortDir === 'asc' ? ' ▲' : ' ▼')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {sorted.map((r) => (
              <tr
                key={r.id}
                onClick={() => onRowClick(r)}
                className="cursor-pointer hover:bg-purple-50"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-2 text-gray-800">
                    {col.render(r)}
                  </td>
                ))}
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-400">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
