// src/shared/hooks/useLockCode.ts
import { useCallback, useEffect, useState } from 'react';
import {
  getLockCode,
  setLockCode,
  resetLockCode,
  isValidLockCode,
} from '@features/auth/config/lockConfig';

export function useLockCode() {
  const [code, setCodeState] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    getLockCode()
      .then((c) => mounted && setCodeState(c))
      .finally(() => mounted && setIsLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const save = useCallback(async (next: string) => {
    setIsSaving(true);
    try {
      await setLockCode(next);
      setCodeState(next.trim());
    } finally {
      setIsSaving(false);
    }
  }, []);

  const reset = useCallback(async () => {
    setIsSaving(true);
    try {
      await resetLockCode();
      const c = await getLockCode();
      setCodeState(c);
    } finally {
      setIsSaving(false);
    }
  }, []);

  return { code, isLoading, isSaving, save, reset, isValid: isValidLockCode };
}