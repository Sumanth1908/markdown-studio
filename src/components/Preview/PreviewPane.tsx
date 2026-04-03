import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkBreaks from 'remark-breaks';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'katex/dist/katex.min.css';
import MermaidBlock from './renderers/MermaidBlock';
import { PreviewContainer, MarkdownBody } from './PreviewPane.styles';
import { initMermaid } from '../../utils/mermaidSetup';
import { useTheme, DefaultTheme } from 'styled-components';

const REMARK_PLUGINS = [remarkGfm, remarkMath, remarkBreaks];
const REHYPE_PLUGINS: any[] = [
  rehypeKatex,
  rehypeSlug,
  [rehypeAutolinkHeadings, { behavior: 'wrap' }],
];

interface CodeBlockProps {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ node, inline, className, children, ...props }) => {
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';
  const codeString = String(children).replace(/\n$/, '');

  if (language === 'mermaid') {
    return <MermaidBlock code={codeString} />;
  }

  if (!inline && match) {
    return (
      <SyntaxHighlighter
        style={dracula as any}
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

interface PreviewPaneProps {
  content: string;
  printRef: React.RefObject<HTMLDivElement | null>;
}

const PreviewPane: React.FC<PreviewPaneProps> = ({ content, printRef }) => {
  const theme = useTheme() as DefaultTheme;

  useEffect(() => {
    initMermaid(theme.isDark);
  }, [theme.isDark]);

  const components: any = {
    code: CodeBlock,
  };

  return (
    <PreviewContainer>
      <MarkdownBody ref={printRef}>
        <ReactMarkdown
          remarkPlugins={REMARK_PLUGINS as any}
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
