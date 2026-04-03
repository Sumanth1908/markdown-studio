import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    name: string;
    isDark: boolean;
    background: string;
    surface: string;
    surfaceHover: string;
    border: string;
    text: string;
    textMuted: string;
    textInverse: string;
    accent: string;
    accentHover: string;
    heading: string;
    codeBackground: string;
    codeBorder: string;
    codeText: string;
    blockquoteBorder: string;
    blockquoteText: string;
    tableHeaderBg: string;
    tableBorder: string;
    linkColor: string;
    hrColor: string;
    tagBg: string;
    tagText: string;
    toolbarBg: string;
    toolbarBorder: string;
    editorBg: string;
    editorBorder: string;
    previewBg: string;
    scrollbarThumb: string;
    scrollbarTrack: string;
    shadow: string;
    selection: string;
    buttonBg: string;
    buttonBorder: string;
    buttonText: string;
    activeButtonBg: string;
    activeButtonText: string;
    badgeBg: string;
    badgeText: string;
  }
}
