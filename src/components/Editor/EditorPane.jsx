import CodeMirror from '@uiw/react-codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView } from '@codemirror/view';
import { useTheme } from 'styled-components';
import { EditorWrapper, EditorHeader, EditorDot, CodeMirrorWrapper } from './EditorPane.styles.js';

const useEditorTheme = (theme) => {
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
  });
};

const EditorPane = ({ value, onChange }) => {
  const theme = useTheme();
  const editorTheme = useEditorTheme(theme);

  const extensions = [
    markdown({
      base: markdownLanguage,
      codeLanguages: languages,
    }),
    EditorView.lineWrapping,
  ];

  return (
    <EditorWrapper>
      <EditorHeader>
        <EditorDot color="#ff5f57" />
        <EditorDot color="#febc2e" />
        <EditorDot color="#28c840" />
        &nbsp;editor.md
      </EditorHeader>
      <CodeMirrorWrapper>
        <CodeMirror
          value={value}
          height="100%"
          theme={editorTheme}
          extensions={extensions}
          onChange={onChange}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLine: true,
            highlightActiveLineGutter: true,
            foldGutter: false,
            dropCursor: false,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: false,
            rectangularSelection: false,
            crosshairCursor: false,
            highlightSelectionMatches: true,
            indentOnInput: true,
          }}
        />
      </CodeMirrorWrapper>
    </EditorWrapper>
  );
};

export default EditorPane;
