import type { MedicationRecord, ProductGroup } from '../types';

export function groupKey(productName: string): string {
  return productName.trim().toLowerCase();
}

export function groupByProduct(records: MedicationRecord[]): ProductGroup[] {
  const groups = new Map<string, MedicationRecord[]>();

  for (const record of records) {
    const key = groupKey(record.productName);
    const existing = groups.get(key);
    if (existing) {
      existing.push(record);
    } else {
      groups.set(key, [record]);
    }
  }

  return Array.from(groups.entries()).map(([key, groupRecords]) => {
    const sorted = [...groupRecords].sort((a, b) => b.createdAt - a.createdAt);
    return {
      key,
      displayName: sorted[0].productName.trim(),
      records: sorted,
    };
  });
}
