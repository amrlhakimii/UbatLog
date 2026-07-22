import { useEffect, useState } from 'react';
import { ensureSeeded, subscribeToConfigList } from '../lib/configLists';
import type { ConfigListName } from '../types';

export function useConfigList(name: ConfigListName) {
  const [values, setValues] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: () => void = () => {};
    ensureSeeded(name).finally(() => {
      unsubscribe = subscribeToConfigList(name, (next) => {
        setValues(next);
        setLoading(false);
      });
    });
    return () => unsubscribe();
  }, [name]);

  return { values, loading };
}
