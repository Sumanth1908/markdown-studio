import { useState, useCallback, useRef, useEffect } from 'react';
import { ThemeProvider, DefaultTheme } from 'styled-components';
import { GlobalStyles } from './styles/GlobalStyles';
import { themes } from './themes/index';
import Toolbar, { LayoutType } from './components/Toolbar/Toolbar';
import EditorPane from './components/Editor/EditorPane';
import PreviewPane from './components/Preview/PreviewPane';
import useMarkdown from './hooks/useMarkdown';
import useTheme, { ThemeKey } from './hooks/useTheme';
import useLocalStorage from './hooks/useLocalStorage';
import usePdfExport from './hooks/usePdfExport';
import useScrollSync from './hooks/useScrollSync';
import useAutoSave from './hooks/useAutoSave';
import sampleContent from './assets/sample.md?raw';
import styled from 'styled-components';
import { EditorView } from '@codemirror/view';
import { downloadFile } from './utils/exportHelpers';

/* ── Layout shells ─────────────────────────────────────────────── */

const AppShell = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background: ${({ theme }) => theme.background};

  @media print {
    height: auto;
    overflow: visible;
  }
`;

const WorkspaceArea = styled.main`
  display: flex;
  flex: 1;
  overflow: hidden;
  min-height: 0;

  @media print {
    display: block;
    overflow: visible;
  }
`;

interface PaneWrapperProps {
  $flex: number;
  $hidden: boolean;
  $printHide: boolean;
}

const PaneWrapper = styled.div<PaneWrapperProps>`
  flex: ${({ $flex }) => $flex};
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  transition: flex 0.25s ease;
  display: ${({ $hidden }) => ($hidden ? 'none' : 'flex')};
  flex-direction: column;

  @media print {
    display: ${({ $printHide }) => ($printHide ? 'none' : 'block')};
    flex: unset;
    width: 100%;
  }
`;

/* ── Resizable divider ─────────────────────────────────────────── */

const ResizeDivider = styled.div`
  width: 5px;
  flex-shrink: 0;
  background: ${({ theme }) => theme.border};
  cursor: col-resize;
  transition: background 0.15s ease;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    inset: 0 -4px;
  }

  &:hover,
  &:active {
    background: ${({ theme }) => theme.accent};
  }

  @media print {
    display: none;
  }
`;

/* ── Zen mode overlay ──────────────────────────────────────────── */

const ZenOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 200;
  background: ${({ theme }) => theme.background};
  display: flex;
  flex-direction: column;
  animation: zenIn 0.2s ease;

  @keyframes zenIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
`;

const ZenContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 4rem 2rem;
  display: flex;
  justify-content: center;
`;

const ZenBody = styled.div`
  width: 100%;
  max-width: 720px;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  line-height: 1.8;
  color: ${({ theme }) => theme.text};
`;

const ZenExitHint = styled.div`
  text-align: center;
  padding: 0.5rem;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.textMuted};
  background: ${({ theme }) => theme.surface};
  border-top: 1px solid ${({ theme }) => theme.border};
  flex-shrink: 0;
`;

/* ── Toast ─────────────────────────────────────────────────────── */

const ToastContainer = styled.div`
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  pointer-events: none;

  @media print {
    display: none;
  }
`;

const Toast = styled.div`
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.text};
  border-radius: 8px;
  padding: 0.65rem 1rem;
  font-size: 0.85rem;
  box-shadow: 0 4px 20px ${({ theme }) => theme.shadow};
  animation: slideIn 0.2s ease;

  @keyframes slideIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

/* ── Confirm Dialog ────────────────────────────────────────────── */

const DialogBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  z-index: 500;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DialogBox = styled.div`
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  padding: 1.5rem 2rem;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 16px 40px ${({ theme }) => theme.shadow};

  h3 { font-size: 1rem; margin-bottom: 0.5rem; color: ${({ theme }) => theme.text}; }
  p  { font-size: 0.88rem; color: ${({ theme }) => theme.textMuted}; margin-bottom: 1.25rem; }
`;

const DialogActions = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
`;

const DialogBtn = styled.button<{ $primary?: boolean }>`
  padding: 0.45rem 1rem;
  border-radius: 6px;
  border: 1px solid ${({ theme, $primary }) => ($primary ? theme.accent : theme.buttonBorder)};
  background: ${({ theme, $primary }) => ($primary ? theme.accent : theme.buttonBg)};
  color: ${({ theme, $primary }) => ($primary ? '#fff' : theme.buttonText)};
  font-family: 'Inter', sans-serif;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;

  &:hover { opacity: 0.85; }
`;

/* ── Status bar (footer) ───────────────────────────────────────── */

const StatusBar = styled.footer`
  padding: 0.35rem 1.5rem;
  font-size: 0.73rem;
  color: ${({ theme }) => theme.textMuted};
  background: ${({ theme }) => theme.surface};
  border-top: 1px solid ${({ theme }) => theme.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;

  @media print {
    display: none;
  }
`;

/* ── Types ─────────────────────────────────────────────────────── */

interface ToastMessage {
  id: number;
  message: string;
}

/* ── App ───────────────────────────────────────────────────────── */

const App: React.FC = () => {
  const { activeThemeKey, activeTheme, setTheme, themeKeys } = useTheme('github');
  const [storedContent, setStoredContent] = useLocalStorage('markdown-studio-content', sampleContent);
  const { raw, setRaw, debounced, wordCount, charCount, readTime } = useMarkdown(storedContent);
  const [layout, setLayout] = useState<LayoutType>('split');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [zenMode, setZenMode] = useState(false);
  const [scrollSync, setScrollSync] = useState(true);
  const [confirmClear, setConfirmClear] = useState(false);
  const [editorView, setEditorView] = useState<EditorView | null>(null);

  /* Cursor position state (line:col) from CodeMirror */
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });

  const { contentRef, handlePrint } = usePdfExport();
  const { setEditorScroller, previewScrollerRef, onEditorScroll, onPreviewScroll } = useScrollSync(scrollSync);

  const savedLabel = useAutoSave(raw);

  /* Pane resize */
  const [splitRatio, setSplitRatio] = useState(50); // percent for editor pane
  const isDragging = useRef(false);
  const workspaceRef = useRef<HTMLElement>(null);

  /* ── Helpers ─────────────────────────────────────────────────── */

  const showToast = useCallback((message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2500);
  }, []);

  const handleChange = useCallback(
    (value: string) => {
      setRaw(value);
      setStoredContent(value);
    },
    [setRaw, setStoredContent]
  );

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(raw).then(() => {
      showToast('✅ Markdown copied to clipboard');
    });
  }, [raw, showToast]);

  const handleExport = useCallback(() => {
    showToast('🖨️ Opening print dialog…');
    handlePrint();
  }, [handlePrint, showToast]);

  const handleExportMd = useCallback(() => {
    downloadFile('document.md', raw, 'text/markdown');
    showToast('⬇️ Markdown file downloaded');
  }, [raw, showToast]);


  const handleNew = useCallback(() => {
    setConfirmClear(true);
  }, []);

  const confirmNew = useCallback(() => {
    handleChange('');
    setConfirmClear(false);
    showToast('📄 New document created');
  }, [handleChange, showToast]);

  /* ── Keyboard shortcuts ─────────────────────────────────────── */

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;

      // ⌘/Ctrl + 1/2/3 — layout switch
      if (mod && e.key === '1') { e.preventDefault(); setLayout('split'); }
      if (mod && e.key === '2') { e.preventDefault(); setLayout('editor'); }
      if (mod && e.key === '3') { e.preventDefault(); setLayout('preview'); }

      // ⌘/Ctrl + Shift + C — copy markdown
      if (mod && e.shiftKey && e.key.toLowerCase() === 'c') { e.preventDefault(); handleCopy(); }

      // ⌘/Ctrl + Shift + E — export PDF
      if (mod && e.shiftKey && e.key.toLowerCase() === 'e') { e.preventDefault(); handleExport(); }

      // Esc — exit zen mode
      if (e.key === 'Escape' && zenMode) setZenMode(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleCopy, handleExport, zenMode]);

  /* Track cursor position via DOM events on the CodeMirror scroller */
  useEffect(() => {
    if (!editorView) return;
    const scroller = editorView.scrollDOM;
    const updateCursor = () => {
      const pos = editorView.state.selection.main.head;
      const line = editorView.state.doc.lineAt(pos);
      setCursorPos({ line: line.number, col: pos - line.from + 1 });
    };
    scroller.addEventListener('click', updateCursor);
    scroller.addEventListener('keyup', updateCursor);
    return () => {
      scroller.removeEventListener('click', updateCursor);
      scroller.removeEventListener('keyup', updateCursor);
    };
  }, [editorView]);

  /* ── Resizable panes ─────────────────────────────────────────── */

  const handleDividerMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;

    const onMove = (ev: MouseEvent) => {
      if (!isDragging.current || !workspaceRef.current) return;
      const rect = workspaceRef.current.getBoundingClientRect();
      const ratio = ((ev.clientX - rect.left) / rect.width) * 100;
      setSplitRatio(Math.max(20, Math.min(80, ratio)));
    };
    const onUp = () => {
      isDragging.current = false;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, []);

  const showEditor = layout === 'split' || layout === 'editor';
  const showPreview = layout === 'split' || layout === 'preview';
  const isSplit = layout === 'split';

  /* ── Render ──────────────────────────────────────────────────── */

  return (
    <ThemeProvider theme={activeTheme as DefaultTheme}>
      <GlobalStyles />
      <AppShell>
        <Toolbar
          activeThemeKey={activeThemeKey}
          themeKeys={themeKeys}
          onThemeChange={setTheme}
          layout={layout}
          onLayoutChange={setLayout}
          onExport={handleExport}
          onExportMd={handleExportMd}
          wordCount={wordCount}
          charCount={charCount}
          readTime={readTime}
          onCopy={handleCopy}
          onNew={handleNew}
          zenMode={zenMode}
          onToggleZen={() => setZenMode((z) => !z)}
          scrollSync={scrollSync}
          onToggleScrollSync={() => setScrollSync((s) => !s)}
          savedLabel={savedLabel}
        />

        <WorkspaceArea ref={workspaceRef as any}>
          <PaneWrapper
            $flex={isSplit ? splitRatio : showEditor ? 1 : 0}
            $hidden={!showEditor}
            $printHide={true}
            style={isSplit ? { flex: `0 0 ${splitRatio}%` } : undefined}
          >
            <EditorPane
              value={raw}
              onChange={handleChange}
              onEditorViewReady={setEditorView}
              onEditorScrollerReady={setEditorScroller}
              onScroll={onEditorScroll}
            />
          </PaneWrapper>

          {isSplit && (
            <ResizeDivider onMouseDown={handleDividerMouseDown} title="Drag to resize panes" />
          )}

          <PaneWrapper
            $flex={isSplit ? (100 - splitRatio) : showPreview ? 1 : 0}
            $hidden={!showPreview}
            $printHide={false}
            style={isSplit ? { flex: `0 0 calc(${100 - splitRatio}% - 5px)` } : undefined}
          >
            <PreviewPane
              content={debounced}
              printRef={contentRef}
              scrollRef={previewScrollerRef}
              onScroll={onPreviewScroll}
            />
          </PaneWrapper>
        </WorkspaceArea>

        <StatusBar>
          <span>Ln {cursorPos.line}, Col {cursorPos.col}</span>
          <span>MarkDown Studio &copy; {new Date().getFullYear()} &mdash; Made with ❤️ using React &amp; Vite</span>
        </StatusBar>

        {/* Zen mode */}
        {zenMode && (
          <ZenOverlay>
            <ZenContent>
              <ZenBody>
                <EditorPane
                  value={raw}
                  onChange={handleChange}
                  onEditorViewReady={setEditorView}
                />
              </ZenBody>
            </ZenContent>
            <ZenExitHint>Press <kbd>Esc</kbd> or click Zen again to exit focus mode</ZenExitHint>
          </ZenOverlay>
        )}

        {/* Toast notifications */}
        <ToastContainer>
          {toasts.map(({ id, message }) => (
            <Toast key={id}>{message}</Toast>
          ))}
        </ToastContainer>

        {/* New document confirmation */}
        {confirmClear && (
          <DialogBackdrop onClick={() => setConfirmClear(false)}>
            <DialogBox onClick={(e) => e.stopPropagation()}>
              <h3>Start a new document?</h3>
              <p>This will clear everything in the editor. Your current content cannot be recovered.</p>
              <DialogActions>
                <DialogBtn onClick={() => setConfirmClear(false)}>Cancel</DialogBtn>
                <DialogBtn $primary onClick={confirmNew}>Clear & Start New</DialogBtn>
              </DialogActions>
            </DialogBox>
          </DialogBackdrop>
        )}
      </AppShell>
    </ThemeProvider>
  );
};

export default App;
