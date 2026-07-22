export interface MedicationRecord {
  id: string;
  datePurchased: string; // ISO date, e.g. "2026-07-22"
  manufacturerName: string;
  productName: string;
  pharmacyBoughtFrom: string;
  type: string;
  unit: string;
  quantityPerPackage: number;
  priceBought: number;
  actualSellingPricePerUnit: number;
  createdAt: number;
  updatedAt: number;
}

export type MedicationRecordInput = Omit<
  MedicationRecord,
  'id' | 'createdAt' | 'updatedAt'
>;

export type ConfigListName = 'types' | 'units';

export interface ConfigList {
  values: string[];
}

export interface ProductGroup {
  key: string; // trimmed, lowercased productName
  displayName: string; // most recently used casing
  records: MedicationRecord[];
}
