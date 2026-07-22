import { useState } from 'react';
import { deleteRecord } from '../lib/records';
import type { MedicationRecord } from '../types';

export function useDeleteWithUndo() {
  const [pending, setPending] = useState<MedicationRecord | null>(null);

  return {
    pendingDeleteId: pending?.id ?? null,
    pendingLabel: pending?.productName ?? '',
    requestDelete: (record: MedicationRecord) => setPending(record),
    undo: () => setPending(null),
    expire: () => {
      if (pending) void deleteRecord(pending.id);
      setPending(null);
    },
  };
}
