import { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkBreaks from 'remark-breaks';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { github } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import 'katex/dist/katex.min.css';
import MermaidBlock from './renderers/MermaidBlock.jsx';
import { PreviewContainer, MarkdownBody } from './PreviewPane.styles.js';
import { initMermaid } from '../../utils/mermaidSetup.js';
import { useTheme } from 'styled-components';

const REMARK_PLUGINS = [remarkGfm, remarkMath, remarkBreaks];
const REHYPE_PLUGINS = [
  rehypeKatex,
  rehypeSlug,
  [rehypeAutolinkHeadings, { behavior: 'wrap' }],
];

const CodeBlock = ({ node, inline, className, children, ...props }) => {
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';
  const codeString = String(children).replace(/\n$/, '');

  if (language === 'mermaid') {
    return <MermaidBlock code={codeString} />;
  }

  if (!inline && match) {
    return (
      <SyntaxHighlighter
        style={github}
        language={language}
        PreTag="div"
        {...props}
      >
        {codeString}
      </SyntaxHighlighter>
    );
  }

  return (
    <code className={className} {...props}>
      {children}
    </code>
  );
};

const PreviewPane = ({ content, printRef }) => {
  const theme = useTheme();

  useEffect(() => {
    initMermaid(theme.isDark);
  }, [theme.isDark]);

  const components = {
    code: CodeBlock,
  };

  return (
    <PreviewContainer>
      <MarkdownBody ref={printRef}>
        <ReactMarkdown
          remarkPlugins={REMARK_PLUGINS}
          rehypePlugins={REHYPE_PLUGINS}
          components={components}
        >
          {content}
        </ReactMarkdown>
      </MarkdownBody>
    </PreviewContainer>
  );
};

export default PreviewPane;
