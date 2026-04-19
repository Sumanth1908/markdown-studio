import { useState, useEffect, useRef } from 'react';

/**
 * Returns a human-readable "Saved N ago" label that updates every second
 * whenever `content` changes. Works in tandem with useLocalStorage — the
 * save itself is done externally; this hook only tracks the timestamp.
 */
const useAutoSave = (content: string): string => {
  const [savedAt, setSavedAt] = useState<Date>(new Date());
  const [label, setLabel] = useState<string>('Saved just now');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setSavedAt(new Date());
  }, [content]);

  useEffect(() => {
    const update = () => {
      const diff = Math.round((Date.now() - savedAt.getTime()) / 1000);
      if (diff < 5) {
        setLabel('Saved just now');
      } else if (diff < 60) {
        setLabel(`Saved ${diff}s ago`);
      } else {
        const mins = Math.floor(diff / 60);
        setLabel(`Saved ${mins}m ago`);
      }
    };

    update();
    timerRef.current = setInterval(update, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [savedAt]);

  return label;
};

export default useAutoSave;
