import React from 'react';
import { EditorView } from '@codemirror/view';
import { FormattingBarContainer, FmtButton, FmtDivider } from './FormattingBar.styles';

interface FormattingBarProps {
  editorView: EditorView | null;
}

/* ── Helpers ─────────────────────────────────────────────────────── */

/**
 * Wraps selected text with a prefix and suffix.
 * If no selection exists, inserts placeholder text wrapped.
 */
const wrapSelection = (view: EditorView, prefix: string, suffix: string, placeholder: string) => {
  const { state, dispatch } = view;
  const { from, to } = state.selection.main;
  const selected = state.sliceDoc(from, to);
  const text = selected.length > 0 ? selected : placeholder;
  dispatch(
    state.update({
      changes: { from, to, insert: `${prefix}${text}${suffix}` },
      selection: { anchor: from + prefix.length, head: from + prefix.length + text.length },
    })
  );
  view.focus();
};

/**
 * Prepends a prefix to every selected line. Toggles if already present.
 */
const prependLines = (view: EditorView, prefix: string) => {
  const { state, dispatch } = view;
  const { from, to } = state.selection.main;
  const startLine = state.doc.lineAt(from);
  const endLine = state.doc.lineAt(to);

  const changes = [];
  for (let ln = startLine.number; ln <= endLine.number; ln++) {
    const line = state.doc.line(ln);
    if (line.text.startsWith(prefix)) {
      changes.push({ from: line.from, to: line.from + prefix.length, insert: '' });
    } else {
      changes.push({ from: line.from, insert: prefix });
    }
  }

  dispatch(state.update({ changes }));
  view.focus();
};

/** Inserts a snippet at the cursor / replaces selection. */
const insertSnippet = (view: EditorView, snippet: string) => {
  const { state, dispatch } = view;
  const { from, to } = state.selection.main;
  dispatch(state.update({ changes: { from, to, insert: snippet } }));
  view.focus();
};

/* ── Icons ───────────────────────────────────────────────────────── */

const IconLink = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M7 9a3 3 0 0 0 4.5.5l2-2a3 3 0 0 0-4.24-4.24l-1.5 1.5" />
    <path d="M9 7a3 3 0 0 0-4.5-.5l-2 2a3 3 0 0 0 4.24 4.24l1.5-1.5" />
  </svg>
);

const IconImage = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="1" y="2" width="14" height="12" rx="2" />
    <circle cx="5.5" cy="6.5" r="1.5" />
    <path d="M1 11l4-4 3 3 2-2 5 5" />
  </svg>
);

const IconTable = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="1" y="1" width="14" height="14" rx="1" />
    <line x1="1" y1="5" x2="15" y2="5" />
    <line x1="6" y1="1" x2="6" y2="15" />
    <line x1="11" y1="1" x2="11" y2="15" />
  </svg>
);

const IconHr = () => (
  <svg viewBox="0 0 16 16" fill="currentColor">
    <rect x="0" y="7" width="16" height="2" rx="1" />
  </svg>
);

const IconTask = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="1" y="1" width="8" height="8" rx="1.5" />
    <path d="M3 5l2 2 3-3" />
    <line x1="11" y1="5" x2="15" y2="5" />
    <line x1="11" y1="9" x2="15" y2="9" />
    <line x1="3" y1="13" x2="15" y2="13" />
  </svg>
);

const TABLE_SNIPPET = `
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Cell     | Cell     | Cell     |
| Cell     | Cell     | Cell     |
`;

/* ── Component ───────────────────────────────────────────────────── */

const FormattingBar: React.FC<FormattingBarProps> = ({ editorView }) => {
  const run = (fn: (view: EditorView) => void) => {
    if (editorView) fn(editorView);
  };

  return (
    <FormattingBarContainer>
      {/* Text formatting */}
      <FmtButton id="fmt-bold" title="Bold (⌘B)" onClick={() => run((v) => wrapSelection(v, '**', '**', 'bold text'))}>
        <b>B</b>
      </FmtButton>
      <FmtButton id="fmt-italic" title="Italic (⌘I)" onClick={() => run((v) => wrapSelection(v, '*', '*', 'italic text'))}>
        <i>I</i>
      </FmtButton>
      <FmtButton id="fmt-strike" title="Strikethrough" onClick={() => run((v) => wrapSelection(v, '~~', '~~', 'strikethrough'))}>
        <s>S</s>
      </FmtButton>
      <FmtButton id="fmt-code" title="Inline code (⌘E)" onClick={() => run((v) => wrapSelection(v, '`', '`', 'code'))}>
        {'</>'}
      </FmtButton>

      <FmtDivider />

      {/* Headings */}
      <FmtButton id="fmt-h1" title="Heading 1" onClick={() => run((v) => prependLines(v, '# '))}>H1</FmtButton>
      <FmtButton id="fmt-h2" title="Heading 2" onClick={() => run((v) => prependLines(v, '## '))}>H2</FmtButton>
      <FmtButton id="fmt-h3" title="Heading 3" onClick={() => run((v) => prependLines(v, '### '))}>H3</FmtButton>

      <FmtDivider />

      {/* Block elements */}
      <FmtButton id="fmt-blockquote" title="Blockquote" onClick={() => run((v) => prependLines(v, '> '))}>
        "
      </FmtButton>
      <FmtButton id="fmt-ul" title="Unordered list" onClick={() => run((v) => prependLines(v, '- '))}>
        •─
      </FmtButton>
      <FmtButton id="fmt-ol" title="Ordered list" onClick={() => run((v) => prependLines(v, '1. '))}>
        1.
      </FmtButton>
      <FmtButton id="fmt-task" title="Task list item" onClick={() => run((v) => prependLines(v, '- [ ] '))}>
        <IconTask />
      </FmtButton>

      <FmtDivider />

      {/* Inserts */}
      <FmtButton
        id="fmt-link"
        title="Insert link (⌘K)"
        onClick={() => run((v) => wrapSelection(v, '[', '](url)', 'link text'))}
      >
        <IconLink />
      </FmtButton>
      <FmtButton
        id="fmt-image"
        title="Insert image"
        onClick={() => run((v) => insertSnippet(v, '![alt text](image-url)'))}
      >
        <IconImage />
      </FmtButton>
      <FmtButton
        id="fmt-table"
        title="Insert table"
        onClick={() => run((v) => insertSnippet(v, TABLE_SNIPPET))}
      >
        <IconTable />
      </FmtButton>
      <FmtButton
        id="fmt-hr"
        title="Horizontal rule"
        onClick={() => run((v) => insertSnippet(v, '\n---\n'))}
      >
        <IconHr />
      </FmtButton>
    </FormattingBarContainer>
  );
};

export default FormattingBar;
