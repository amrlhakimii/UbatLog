import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import type { MedicationRecord, MedicationRecordInput } from '../types';

const COLLECTION = 'medicationRecords';

export function subscribeToRecords(
  onChange: (records: MedicationRecord[]) => void,
  onError: (error: Error) => void,
): () => void {
  const ref = collection(db, COLLECTION);
  return onSnapshot(
    ref,
    (snapshot) => {
      const records = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          datePurchased: data.datePurchased ?? '',
          manufacturerName: data.manufacturerName ?? '',
          productName: data.productName ?? '',
          pharmacyBoughtFrom: data.pharmacyBoughtFrom ?? '',
          type: data.type ?? '',
          unit: data.unit ?? '',
          quantityPerPackage: data.quantityPerPackage ?? 0,
          priceBought: data.priceBought ?? 0,
          actualSellingPricePerUnit: data.actualSellingPricePerUnit ?? 0,
          createdAt: data.createdAt?.toMillis?.() ?? 0,
          updatedAt: data.updatedAt?.toMillis?.() ?? 0,
        } satisfies MedicationRecord;
      });
      onChange(records);
    },
    onError,
  );
}

export async function createRecord(input: MedicationRecordInput): Promise<void> {
  const ref = collection(db, COLLECTION);
  await addDoc(ref, {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateRecord(
  id: string,
  input: MedicationRecordInput,
): Promise<void> {
  const ref = doc(db, COLLECTION, id);
  await updateDoc(ref, {
    ...input,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteRecord(id: string): Promise<void> {
  const ref = doc(db, COLLECTION, id);
  await deleteDoc(ref);
}

export async function deleteRecords(ids: string[]): Promise<void> {
  const batch = writeBatch(db);
  for (const id of ids) {
    batch.delete(doc(db, COLLECTION, id));
  }
  await batch.commit();
}

export async function renameProduct(ids: string[], newName: string): Promise<void> {
  const batch = writeBatch(db);
  for (const id of ids) {
    batch.update(doc(db, COLLECTION, id), { productName: newName, updatedAt: serverTimestamp() });
  }
  await batch.commit();
}
