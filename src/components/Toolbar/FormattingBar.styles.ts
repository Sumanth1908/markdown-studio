import styled, { css } from 'styled-components';

export const FormattingBarContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.15rem;
  padding: 0.3rem 0.75rem;
  background: ${({ theme }) => theme.surface};
  border-bottom: 1px solid ${({ theme }) => theme.border};
  flex-shrink: 0;
  flex-wrap: wrap;

  @media print {
    display: none;
  }
`;

const fmtBtn = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 26px;
  border-radius: 5px;
  border: 1px solid transparent;
  background: transparent;
  color: ${({ theme }) => theme.textMuted};
  font-family: 'Inter', 'JetBrains Mono', sans-serif;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.12s ease;
  flex-shrink: 0;

  &:hover {
    background: ${({ theme }) => theme.surfaceHover};
    border-color: ${({ theme }) => theme.border};
    color: ${({ theme }) => theme.accent};
  }

  svg {
    width: 13px;
    height: 13px;
  }
`;

export const FmtButton = styled.button`
  ${fmtBtn}
`;

export const FmtDivider = styled.div`
  width: 1px;
  height: 16px;
  background: ${({ theme }) => theme.border};
  margin: 0 0.2rem;
  flex-shrink: 0;
`;
