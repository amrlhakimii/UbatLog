import type { MedicationRecord } from '../types';

export type QuickRange = 'today' | 'week' | 'month' | 'all';

export interface RecordFilters {
  quickRange: QuickRange;
  dateFrom: string; // ISO date, '' = unset, overrides quickRange when set
  dateTo: string;
  manufacturer: string;
  pharmacy: string;
  productQuery: string;
  type: string;
}

export const DEFAULT_FILTERS: RecordFilters = {
  quickRange: 'all',
  dateFrom: '',
  dateTo: '',
  manufacturer: '',
  pharmacy: '',
  productQuery: '',
  type: '',
};

function quickRangeToDates(range: QuickRange): { from: string | null; to: string | null } {
  const now = new Date();
  const todayISO = now.toISOString().slice(0, 10);

  if (range === 'today') {
    return { from: todayISO, to: todayISO };
  }
  if (range === 'week') {
    const start = new Date(now);
    start.setDate(start.getDate() - 7);
    return { from: start.toISOString().slice(0, 10), to: todayISO };
  }
  if (range === 'month') {
    const start = new Date(now);
    start.setMonth(start.getMonth() - 1);
    return { from: start.toISOString().slice(0, 10), to: todayISO };
  }
  return { from: null, to: null };
}

export function applyFilters(
  records: MedicationRecord[],
  filters: RecordFilters,
): MedicationRecord[] {
  const useCustomRange = filters.dateFrom !== '' || filters.dateTo !== '';
  const { from: quickFrom, to: quickTo } = quickRangeToDates(filters.quickRange);
  const from = useCustomRange ? filters.dateFrom || null : quickFrom;
  const to = useCustomRange ? filters.dateTo || null : quickTo;

  return records.filter((r) => {
    if (from && r.datePurchased < from) return false;
    if (to && r.datePurchased > to) return false;
    if (filters.manufacturer && r.manufacturerName !== filters.manufacturer) return false;
    if (filters.pharmacy && r.pharmacyBoughtFrom !== filters.pharmacy) return false;
    if (filters.type && r.type !== filters.type) return false;
    if (
      filters.productQuery &&
      !r.productName.toLowerCase().includes(filters.productQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });
}
