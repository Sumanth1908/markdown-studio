import { useState, useCallback } from 'react';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from './styles/GlobalStyles.js';
import { themes } from './themes/index.js';
import Toolbar from './components/Toolbar/Toolbar.jsx';
import EditorPane from './components/Editor/EditorPane.jsx';
import PreviewPane from './components/Preview/PreviewPane.jsx';
import useMarkdown from './hooks/useMarkdown.js';
import useTheme from './hooks/useTheme.js';
import useLocalStorage from './hooks/useLocalStorage.js';
import usePdfExport from './hooks/usePdfExport.js';
import sampleContent from './assets/sample.md?raw';
import styled from 'styled-components';

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

const PaneWrapper = styled.div`
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

const Footer = styled.footer`
  padding: 0.5rem 1.5rem;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.textMuted};
  background: ${({ theme }) => theme.surface};
  border-top: 1px solid ${({ theme }) => theme.border};
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media print {
    display: none;
  }
`;

const App = () => {
  const { activeThemeKey, activeTheme, setTheme } = useTheme('github');
  const [storedContent, setStoredContent] = useLocalStorage('markdown-studio-content', sampleContent);
  const { raw, setRaw, debounced, wordCount, readTime } = useMarkdown(storedContent);
  const [layout, setLayout] = useState('split');
  const [toasts, setToasts] = useState([]);
  const { contentRef, handlePrint } = usePdfExport();

  const showToast = useCallback((message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2500);
  }, []);

  const handleChange = useCallback(
    (value) => {
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

  const showEditor = layout === 'split' || layout === 'editor';
  const showPreview = layout === 'split' || layout === 'preview';

  return (
    <ThemeProvider theme={activeTheme}>
      <GlobalStyles />
      <AppShell>
        <Toolbar
          activeThemeKey={activeThemeKey}
          onThemeChange={setTheme}
          layout={layout}
          onLayoutChange={setLayout}
          onExport={handleExport}
          wordCount={wordCount}
          readTime={readTime}
          onCopy={handleCopy}
        />

        <WorkspaceArea>
          <PaneWrapper
            $flex={layout === 'split' ? 1 : showEditor ? 1 : 0}
            $hidden={!showEditor}
            $printHide={true}
          >
            <EditorPane value={raw} onChange={handleChange} />
          </PaneWrapper>

          <PaneWrapper
            $flex={layout === 'split' ? 1 : showPreview ? 1 : 0}
            $hidden={!showPreview}
            $printHide={false}
          >
            <PreviewPane content={debounced} printRef={contentRef} />
          </PaneWrapper>
        </WorkspaceArea>

        <ToastContainer>
          {toasts.map(({ id, message }) => (
            <Toast key={id}>{message}</Toast>
          ))}
        </ToastContainer>

        <Footer>
          <span>Markdown Studio &copy; {new Date().getFullYear()}</span>
          <span>Made with ❤️ using React & Vite</span>
        </Footer>
      </AppShell>
    </ThemeProvider>
  );
};

export default App;
