import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
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
          datePurchased: data.datePurchased,
          manufacturerName: data.manufacturerName,
          productName: data.productName,
          pharmacyBoughtFrom: data.pharmacyBoughtFrom,
          type: data.type,
          unit: data.unit,
          quantityPerPackage: data.quantityPerPackage,
          priceBought: data.priceBought,
          actualSellingPricePerUnit: data.actualSellingPricePerUnit,
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
