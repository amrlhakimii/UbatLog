import { useState } from 'react';

export function useSuccessToast() {
  const [message, setMessage] = useState<string | null>(null);

  return {
    message,
    show: (msg: string) => setMessage(msg),
    clear: () => setMessage(null),
  };
}
