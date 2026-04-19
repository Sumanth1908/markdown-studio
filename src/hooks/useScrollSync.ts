import { useRef, useCallback } from 'react';

/**
 * Synchronises scroll position between the CodeMirror editor scroller
 * and the preview pane. Each side drives the other when the user scrolls it,
 * with a guard flag to prevent infinite feedback loops.
 */
const useScrollSync = (enabled: boolean) => {
  const editorScrollerRef = useRef<Element | null>(null);
  const previewScrollerRef = useRef<HTMLDivElement | null>(null);
  const isSyncing = useRef(false);

  const setEditorScroller = useCallback((el: Element | null) => {
    editorScrollerRef.current = el;
  }, []);

  const onEditorScroll = useCallback(() => {
    if (!enabled || isSyncing.current || !editorScrollerRef.current || !previewScrollerRef.current) return;
    const src = editorScrollerRef.current;
    const dst = previewScrollerRef.current;
    const ratio = src.scrollTop / (src.scrollHeight - src.clientHeight || 1);
    isSyncing.current = true;
    dst.scrollTop = ratio * (dst.scrollHeight - dst.clientHeight);
    requestAnimationFrame(() => { isSyncing.current = false; });
  }, [enabled]);

  const onPreviewScroll = useCallback(() => {
    if (!enabled || isSyncing.current || !editorScrollerRef.current || !previewScrollerRef.current) return;
    const src = previewScrollerRef.current;
    const dst = editorScrollerRef.current;
    const ratio = src.scrollTop / (src.scrollHeight - src.clientHeight || 1);
    isSyncing.current = true;
    dst.scrollTop = ratio * (dst.scrollHeight - dst.clientHeight);
    requestAnimationFrame(() => { isSyncing.current = false; });
  }, [enabled]);

  return { setEditorScroller, previewScrollerRef, onEditorScroll, onPreviewScroll };
};

export default useScrollSync;
