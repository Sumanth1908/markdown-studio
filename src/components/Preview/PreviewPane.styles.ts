import styled from 'styled-components';

export const PreviewContainer = styled.div`
  height: 100%;
  overflow-y: auto;
  padding: 2rem 2.5rem;
  background: ${({ theme }) => theme.previewBg};
  transition: background 0.2s ease;

  @media print {
    overflow: visible;
    height: auto;
    padding: 0;
    background: white;
  }
`;

export const MarkdownBody = styled.div`
  max-width: 760px;
  margin: 0 auto;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 15px;
  line-height: 1.75;
  color: ${({ theme }) => theme.text};

  /* Headings */
  h1, h2, h3, h4, h5, h6 {
    color: ${({ theme }) => theme.heading};
    font-weight: 600;
    line-height: 1.3;
    margin-top: 1.75rem;
    margin-bottom: 0.75rem;
  }

  h1 {
    font-size: 2rem;
    border-bottom: 2px solid ${({ theme }) => theme.border};
    padding-bottom: 0.4rem;
  }

  h2 {
    font-size: 1.5rem;
    border-bottom: 1px solid ${({ theme }) => theme.border};
    padding-bottom: 0.3rem;
  }

  h3 { font-size: 1.25rem; }
  h4 { font-size: 1.1rem; }
  h5 { font-size: 1rem; }
  h6 { font-size: 0.9rem; color: ${({ theme }) => theme.textMuted}; }

  /* Paragraphs */
  p {
    margin-bottom: 1rem;
  }

  /* Links */
  a {
    color: ${({ theme }) => theme.linkColor};
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: border-color 0.15s;

    &:hover {
      border-bottom-color: ${({ theme }) => theme.linkColor};
    }
  }

  /* Inline code */
  code:not([class]) {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.87em;
    background: ${({ theme }) => theme.codeBackground};
    color: ${({ theme }) => theme.codeText};
    border: 1px solid ${({ theme }) => theme.codeBorder};
    border-radius: 4px;
    padding: 0.15em 0.4em;
  }

  /* Code blocks */
  pre {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.87em;
    background: ${({ theme }) => theme.codeBackground} !important;
    border: 1px solid ${({ theme }) => theme.codeBorder};
    border-radius: 8px;
    padding: 1.25rem;
    overflow-x: auto;
    margin-bottom: 1.25rem;
    line-height: 1.6;

    code {
      background: transparent !important;
      border: none !important;
      padding: 0 !important;
      font-size: inherit;
      color: ${({ theme }) => theme.codeText};
    }
  }

  /* Blockquotes */
  blockquote {
    border-left: 4px solid ${({ theme }) => theme.blockquoteBorder};
    color: ${({ theme }) => theme.blockquoteText};
    padding: 0.5rem 0 0.5rem 1.25rem;
    margin: 1.25rem 0;
    font-style: italic;

    p {
      margin-bottom: 0;
    }
  }

  /* Horizontal rule */
  hr {
    border: none;
    border-top: 1px solid ${({ theme }) => theme.hrColor};
    margin: 2rem 0;
  }

  /* Tables */
  table {
    border-collapse: collapse;
    width: 100%;
    margin-bottom: 1.25rem;
    overflow: hidden;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.tableBorder};
  }

  th, td {
    padding: 0.6rem 1rem;
    border: 1px solid ${({ theme }) => theme.tableBorder};
    text-align: left;
    font-size: 0.93em;
  }

  th {
    background: ${({ theme }) => theme.tableHeaderBg};
    font-weight: 600;
    color: ${({ theme }) => theme.heading};
  }

  tr:nth-child(even) td {
    background: ${({ theme }) => theme.surface}33;
  }

  /* Lists */
  ul, ol {
    padding-left: 1.75rem;
    margin-bottom: 1rem;
  }

  li {
    margin-bottom: 0.3rem;
  }

  li > ul, li > ol {
    margin-top: 0.3rem;
    margin-bottom: 0;
  }

  /* Task lists */
  input[type="checkbox"] {
    margin-right: 0.5rem;
    accent-color: ${({ theme }) => theme.accent};
  }

  /* Images */
  img {
    max-width: 100%;
    border-radius: 8px;
    display: block;
    margin: 1rem 0;
  }

  /* Mermaid */
  .mermaid-container {
    display: flex;
    justify-content: center;
    margin: 1.5rem 0;
    overflow-x: auto;

    svg {
      max-width: 100%;
    }
  }

  /* KaTeX overrides */
  .math-display {
    overflow-x: auto;
    padding: 0.5rem 0;
  }

  /* Footnotes */
  .footnotes {
    margin-top: 2rem;
    padding-top: 1rem;
    border-top: 1px solid ${({ theme }) => theme.border};
    font-size: 0.88em;
    color: ${({ theme }) => theme.textMuted};
  }

  @media print {
    color: #1f2328;
    h1, h2, h3, h4, h5, h6 { color: #1f2328; }
    a { color: #0969da; }
    code, pre { background: #f6f8fa !important; color: #24292f !important; }
  }
`;
