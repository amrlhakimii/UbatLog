import { useState } from 'react';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { ErrorBanner } from '../components/ErrorBanner';
import { useConfigList } from '../hooks/useConfigList';
import { useMedicationRecords } from '../hooks/useMedicationRecords';
import {
  addConfigValue,
  isValueInUse,
  removeConfigValue,
  updateConfigValue,
} from '../lib/configLists';
import type { ConfigListName } from '../types';

function ConfigListEditor({ name, title }: { name: ConfigListName; title: string }) {
  const { values, loading, error } = useConfigList(name);
  const { records } = useMedicationRecords();
  const [newValue, setNewValue] = useState('');
  const [editing, setEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const inUseCount = (value: string) =>
    records.filter((r) => (name === 'types' ? r.type === value : r.unit === value)).length;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <h2 className="text-base font-semibold text-gray-900">{title}</h2>

      {error ? (
        <div className="mt-4">
          <ErrorBanner error={error} />
        </div>
      ) : loading ? (
        <div className="mt-4 text-sm text-gray-400">Loading...</div>
      ) : (
        <ul className="mt-4 divide-y divide-gray-100">
          {values.map((v) => (
            <li key={v} className="flex items-center justify-between py-2">
              {editing === v ? (
                <input
                  autoFocus
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={async (e) => {
                    if (e.key === 'Enter' && editValue.trim()) {
                      await updateConfigValue(name, v, editValue, values);
                      setEditing(null);
                    }
                    if (e.key === 'Escape') setEditing(null);
                  }}
                  className="mr-2 flex-1 rounded-lg border border-gray-300 px-2 py-1 text-sm"
                />
              ) : (
                <span className="text-sm text-gray-800">{v}</span>
              )}
              <div className="flex gap-3">
                {editing === v ? (
                  <button
                    type="button"
                    className="text-sm font-medium text-brand-600 hover:text-brand-800"
                    onClick={async () => {
                      if (editValue.trim()) await updateConfigValue(name, v, editValue, values);
                      setEditing(null);
                    }}
                  >
                    Save
                  </button>
                ) : (
                  <button
                    type="button"
                    className="text-sm font-medium text-gray-500 hover:text-gray-800"
                    onClick={() => {
                      setEditing(v);
                      setEditValue(v);
                    }}
                  >
                    Rename
                  </button>
                )}
                <button
                  type="button"
                  className="text-sm font-medium text-red-500 hover:text-red-700"
                  onClick={() => setConfirmDelete(v)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
          {values.length === 0 && (
            <li className="py-2 text-sm text-gray-400">No values yet.</li>
          )}
        </ul>
      )}

      <div className="mt-4 flex gap-2">
        <input
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          placeholder={`Add new ${title.toLowerCase().slice(0, -1)}...`}
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
          onKeyDown={async (e) => {
            if (e.key === 'Enter' && newValue.trim()) {
              await addConfigValue(name, newValue, values);
              setNewValue('');
            }
          }}
        />
        <button
          type="button"
          onClick={async () => {
            if (newValue.trim()) {
              await addConfigValue(name, newValue, values);
              setNewValue('');
            }
          }}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          Add
        </button>
      </div>

      {confirmDelete && (
        <ConfirmDialog
          title={`Delete "${confirmDelete}"?`}
          message={
            isValueInUse(name, confirmDelete, records)
              ? `${inUseCount(confirmDelete)} existing record(s) use this value. They'll keep showing it, but it won't be selectable for new entries.`
              : 'This value is not used by any existing records.'
          }
          confirmLabel="Delete"
          danger
          onCancel={() => setConfirmDelete(null)}
          onConfirm={async () => {
            await removeConfigValue(name, confirmDelete, values);
            setConfirmDelete(null);
          }}
        />
      )}
    </div>
  );
}

export function Settings() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-xl font-bold text-gray-900">Settings</h1>
      <p className="mt-1 text-sm text-gray-500">
        Manage the Type and Unit options available when adding a purchase.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <ConfigListEditor name="types" title="Types" />
        <ConfigListEditor name="units" title="Units" />
      </div>
    </div>
  );
}
