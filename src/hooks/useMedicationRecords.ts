import { useEffect, useState } from 'react';
import { subscribeToRecords } from '../lib/records';
import type { MedicationRecord } from '../types';

export function useMedicationRecords() {
  const [records, setRecords] = useState<MedicationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToRecords((next) => {
      setRecords(next);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { records, loading };
}
