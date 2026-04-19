import React, { useCallback, useEffect, useRef } from 'react';
import CodeMirror, { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { EditorView, keymap } from '@codemirror/view';
import { search } from '@codemirror/search';
import { defaultKeymap, historyKeymap } from '@codemirror/commands';
import { useTheme, DefaultTheme } from 'styled-components';
import { EditorWrapper, EditorHeader, EditorDot, CodeMirrorWrapper } from './EditorPane.styles';
import FormattingBar from '../Toolbar/FormattingBar';

const useEditorTheme = (theme: DefaultTheme) => {
  return EditorView.theme({
    '&': {
      backgroundColor: 'transparent',
      color: theme.text,
      flex: 1,
      height: '100%',
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      fontSize: '14px',
      lineHeight: '1.65',
    },
    '&.cm-focused': {
      outline: 'none',
    },
    '.cm-scroller': {
      flex: 1,
      overflow: 'auto',
      height: '100%',
      fontFamily: 'inherit',
    },
    '.cm-content': {
      padding: '1.25rem 1.5rem',
    },
    '.cm-gutters': {
      backgroundColor: theme.surface,
      borderRight: `1px solid ${theme.border}`,
      color: theme.textMuted,
    },
    '.cm-activeLineGutter': {
      backgroundColor: theme.surfaceHover,
    },
    '.cm-activeLine': {
      backgroundColor: theme.selection,
    },
    '.cm-selectionBackground': {
      backgroundColor: 'rgba(9, 105, 218, 0.2)',
    },
    '&.cm-focused .cm-selectionBackground': {
      backgroundColor: 'rgba(9, 105, 218, 0.26)',
    },
    '.cm-cursor': {
      borderLeftColor: '#0969da',
    },
    /* Search panel */
    '.cm-panels': {
      background: theme.surface,
      borderTop: `1px solid ${theme.border}`,
    },
    '.cm-panel input': {
      background: theme.background,
      color: theme.text,
      border: `1px solid ${theme.border}`,
      borderRadius: '4px',
      padding: '2px 6px',
      fontFamily: 'inherit',
    },
    '.cm-panel button': {
      background: theme.buttonBg,
      color: theme.buttonText,
      border: `1px solid ${theme.buttonBorder}`,
      borderRadius: '4px',
      cursor: 'pointer',
    },
  });
};

interface EditorPaneProps {
  value: string;
  onChange: (value: string) => void;
  onEditorViewReady?: (view: EditorView) => void;
  onEditorScrollerReady?: (scroller: Element) => void;
  onScroll?: () => void;
}

const EditorPane: React.FC<EditorPaneProps> = ({
  value,
  onChange,
  onEditorViewReady,
  onEditorScrollerReady,
  onScroll,
}) => {
  const theme = useTheme() as DefaultTheme;
  const editorTheme = useEditorTheme(theme);
  const cmRef = useRef<ReactCodeMirrorRef>(null);

  /* Expose the EditorView to parent once mounted */
  useEffect(() => {
    const view = cmRef.current?.view;
    if (!view) return;

    onEditorViewReady?.(view);

    /* Expose the .cm-scroller element for scroll sync */
    const scroller = view.scrollDOM;
    if (scroller) {
      onEditorScrollerReady?.(scroller);
      if (onScroll) scroller.addEventListener('scroll', onScroll, { passive: true });
    }

    return () => {
      if (scroller && onScroll) scroller.removeEventListener('scroll', onScroll);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cmRef.current?.view]);

  /* Image paste handler — converts clipboard images to Base64 data URLs */
  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLDivElement>) => {
      const view = cmRef.current?.view;
      if (!view) return;

      const items = Array.from(e.clipboardData.items);
      const imageItem = items.find((item) => item.type.startsWith('image/'));
      if (!imageItem) return;

      e.preventDefault();
      const file = imageItem.getAsFile();
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        const { state, dispatch } = view;
        const { from, to } = state.selection.main;
        const filename = file.name.replace(/\s+/g, '_') || 'pasted_image';
        dispatch(
          state.update({
            changes: { from, to, insert: `![${filename}](${dataUrl})` },
          })
        );
      };
      reader.readAsDataURL(file);
    },
    []
  );

  const extensions = [
    markdown({
      base: markdownLanguage as any,
      codeLanguages: languages,
    }),
    EditorView.lineWrapping,
    search({ top: false }),
    keymap.of([...defaultKeymap, ...historyKeymap]),
  ];

  const currentView = cmRef.current?.view ?? null;

  return (
    <EditorWrapper>
      <EditorHeader>
        <EditorDot color="#ff5f57" />
        <EditorDot color="#febc2e" />
        <EditorDot color="#28c840" />
        &nbsp;editor.md
      </EditorHeader>

      <FormattingBar editorView={currentView} />

      <CodeMirrorWrapper onPaste={handlePaste}>
        <CodeMirror
          ref={cmRef}
          value={value}
          height="100%"
          theme={editorTheme}
          extensions={extensions}
          onChange={onChange}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLine: true,
            highlightActiveLineGutter: true,
            foldGutter: true,
            dropCursor: false,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: false,
            rectangularSelection: false,
            crosshairCursor: false,
            highlightSelectionMatches: true,
            indentOnInput: true,
            searchKeymap: true,
          }}
        />
      </CodeMirrorWrapper>
    </EditorWrapper>
  );
};

export default EditorPane;
