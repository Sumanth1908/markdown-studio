import styled from 'styled-components';

export const EditorWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.editorBg};
  border-right: 1px solid ${({ theme }) => theme.editorBorder};
  transition: background 0.2s ease;
  overflow: hidden;
`;

export const EditorHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${({ theme }) => theme.surface};
  border-bottom: 1px solid ${({ theme }) => theme.border};
  font-size: 0.78rem;
  color: ${({ theme }) => theme.textMuted};
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  flex-shrink: 0;
`;

export const EditorDot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ color }) => color};
  display: inline-block;
`;

export const CodeMirrorWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;

  /* Target the exact div rendered by react-codemirror */
  & > div {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;
  }
`;
