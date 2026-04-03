import styled, { css } from 'styled-components';

export const ToolbarContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0 1rem;
  height: 52px;
  background: ${({ theme }) => theme.toolbarBg};
  border-bottom: 1px solid ${({ theme }) => theme.toolbarBorder};
  flex-shrink: 0;
  z-index: 10;
  transition: background 0.2s ease;

  @media print {
    display: none;
  }
`;

export const LogoArea = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-shrink: 0;
`;

export const LogoIcon = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: linear-gradient(135deg, ${({ theme }) => theme.accent}, ${({ theme }) => theme.accentHover});
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  box-shadow: 0 2px 8px ${({ theme }) => theme.shadow};
`;

export const LogoText = styled.span`
  font-weight: 700;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.text};
  letter-spacing: -0.02em;
`;

export const ToolbarSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
`;

export const Divider = styled.div`
  width: 1px;
  height: 20px;
  background: ${({ theme }) => theme.border};
  margin: 0 0.25rem;
`;

const buttonBase = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  padding: 0.35rem 0.7rem;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.buttonBorder};
  background: ${({ theme }) => theme.buttonBg};
  color: ${({ theme }) => theme.buttonText};
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;

  &:hover {
    background: ${({ theme }) => theme.surfaceHover};
    border-color: ${({ theme }) => theme.accent};
    color: ${({ theme }) => theme.accent};
  }

  svg {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
  }
`;

export const ToolbarButton = styled.button<{ $active?: boolean }>`
  ${buttonBase}

  ${({ $active, theme }) =>
    $active &&
    css`
      background: ${theme.activeButtonBg};
      border-color: ${theme.activeButtonBg};
      color: ${theme.activeButtonText};

      &:hover {
        background: ${theme.activeButtonBg};
        color: ${theme.activeButtonText};
        opacity: 0.9;
      }
    `}
`;

export const ThemeButton = styled.button<{ $active?: boolean }>`
  ${buttonBase}
  padding: 0.3rem 0.65rem;
  border-radius: 6px;

  ${({ $active, theme }) =>
    $active &&
    css`
      background: ${theme.activeButtonBg};
      border-color: ${theme.activeButtonBg};
      color: ${theme.activeButtonText};
      font-weight: 600;

      &:hover {
        background: ${theme.activeButtonBg};
        color: ${theme.activeButtonText};
        opacity: 0.9;
      }
    `}
`;

export const ExportBtn = styled.button`
  ${buttonBase}
  padding: 0.35rem 0.85rem;
  background: ${({ theme }) => theme.accent};
  border-color: ${({ theme }) => theme.accent};
  color: #ffffff;
  font-weight: 600;

  &:hover {
    opacity: 0.88;
    background: ${({ theme }) => theme.accent};
    color: #ffffff;
    border-color: ${({ theme }) => theme.accent};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const StatsArea = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.textMuted};

  @media (max-width: 768px) {
    display: none;
  }
`;

export const StatBadge = styled.span`
  background: ${({ theme }) => theme.badgeBg};
  color: ${({ theme }) => theme.badgeText};
  border-radius: 4px;
  padding: 0.15rem 0.45rem;
  font-weight: 500;
`;
