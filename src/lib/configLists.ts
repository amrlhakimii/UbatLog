import { doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import type { ConfigListName, MedicationRecord } from '../types';

const COLLECTION = 'configLists';

const STARTER_VALUES: Record<ConfigListName, string[]> = {
  types: ['Tablet', 'Capsule', 'Liquid', 'Ointment', 'Syrup', 'Injection'],
  units: ['Bottle', 'Pack', 'Box', 'Strip'],
};

export async function ensureSeeded(name: ConfigListName): Promise<void> {
  const ref = doc(db, COLLECTION, name);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, { values: STARTER_VALUES[name] });
  }
}

export function subscribeToConfigList(
  name: ConfigListName,
  onChange: (values: string[]) => void,
): () => void {
  const ref = doc(db, COLLECTION, name);
  return onSnapshot(ref, (snap) => {
    onChange(snap.exists() ? (snap.data().values ?? []) : []);
  });
}

export async function addConfigValue(name: ConfigListName, value: string, current: string[]): Promise<void> {
  const trimmed = value.trim();
  if (!trimmed || current.includes(trimmed)) return;
  const ref = doc(db, COLLECTION, name);
  await setDoc(ref, { values: [...current, trimmed] });
}

export async function updateConfigValue(
  name: ConfigListName,
  oldValue: string,
  newValue: string,
  current: string[],
): Promise<void> {
  const trimmed = newValue.trim();
  if (!trimmed) return;
  const ref = doc(db, COLLECTION, name);
  await setDoc(ref, { values: current.map((v) => (v === oldValue ? trimmed : v)) });
}

export async function removeConfigValue(
  name: ConfigListName,
  value: string,
  current: string[],
): Promise<void> {
  const ref = doc(db, COLLECTION, name);
  await setDoc(ref, { values: current.filter((v) => v !== value) });
}

export function isValueInUse(
  name: ConfigListName,
  value: string,
  records: MedicationRecord[],
): boolean {
  const field = name === 'types' ? 'type' : 'unit';
  return records.some((r) => r[field] === value);
}
