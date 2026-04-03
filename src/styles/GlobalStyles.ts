import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body, #root {
    height: 100%;
    width: 100%;
    overflow: hidden;
  }

  body {
    font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 15px;
    line-height: 1.6;
    background: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    transition: background 0.2s ease, color 0.2s ease;
  }

  * {
    scrollbar-width: thin;
    scrollbar-color: ${({ theme }) => theme.scrollbarThumb} ${({ theme }) => theme.scrollbarTrack};
  }

  *::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  *::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.scrollbarTrack};
  }

  *::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.scrollbarThumb};
    border-radius: 3px;
  }

  /* KaTeX font */
  .katex { font-size: 1.05em; }
  .katex-display { overflow-x: auto; padding: 0.5rem 0; }

  /* Print styles */
  @media print {
    body {
      background: white !important;
      color: black !important;
      overflow: visible !important;
    }

    #root {
      overflow: visible !important;
      height: auto !important;
    }
  }
`;
