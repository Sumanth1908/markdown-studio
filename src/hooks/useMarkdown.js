import { useState, useEffect } from 'react';

const DEBOUNCE_MS = 250;

const useMarkdown = (initialValue) => {
  const [raw, setRaw] = useState(initialValue);
  const [debounced, setDebounced] = useState(initialValue);

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
