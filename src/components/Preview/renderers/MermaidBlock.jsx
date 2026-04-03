import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { renderMermaid } from '../../../utils/mermaidSetup.js';

const MermaidWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 1.5rem 0;
  overflow-x: auto;

  svg {
    max-width: 100%;
  }
`;

const ErrorBox = styled.pre`
  color: #e53e3e;
  background: #fff5f5;
  border: 1px solid #fed7d7;
  border-radius: 6px;
  padding: 0.75rem 1rem;
  font-size: 0.85em;
`;

let mermaidCounter = 0;

const MermaidBlock = ({ code }) => {
  const [svg, setSvg] = useState('');
  const [error, setError] = useState('');
  const idRef = useRef(`mermaid-${++mermaidCounter}`);

  useEffect(() => {
    let cancelled = false;

    renderMermaid(code, idRef.current)
      .then((svg) => {
        if (!cancelled) {
          setSvg(svg);
          setError('');
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });

    return () => { cancelled = true; };
  }, [code]);

  if (error) return <ErrorBox>Mermaid Error: {error}</ErrorBox>;
  if (!svg) return null;

  return (
    <MermaidWrapper
      className="mermaid-container"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

export default MermaidBlock;
