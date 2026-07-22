import { useEffect, useState } from 'react';
import { ensureSeeded, subscribeToConfigList } from '../lib/configLists';
import type { ConfigListName } from '../types';

export function useConfigList(name: ConfigListName) {
  const [values, setValues] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let unsubscribe: () => void = () => {};
    ensureSeeded(name)
      .catch(() => {
        // Subscription error handler below surfaces the same failure.
      })
      .finally(() => {
        unsubscribe = subscribeToConfigList(
          name,
          (next) => {
            setValues(next);
            setLoading(false);
          },
          (err) => {
            setError(err);
            setLoading(false);
          },
        );
      });
    return () => unsubscribe();
  }, [name]);

  return { values, loading, error };
}
