import { useState, useEffect } from 'react';

const DEBOUNCE_MS = 250;

interface UseMarkdownReturn {
  raw: string;
  setRaw: (value: string) => void;
  debounced: string;
  wordCount: number;
  charCount: number;
  readTime: number;
}

const useMarkdown = (initialValue: string): UseMarkdownReturn => {
  const [raw, setRaw] = useState<string>(initialValue);
  const [debounced, setDebounced] = useState<string>(initialValue);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(raw);
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [raw]);

  const wordCount = raw.trim() === '' ? 0 : raw.trim().split(/\s+/).length;
  const charCount = raw.length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return {
    raw,
    setRaw,
    debounced,
    wordCount,
    charCount,
    readTime,
  };
};

export default useMarkdown;
