import React, { useState, useEffect, useRef } from 'react';
import {
  ToolbarContainer,
  LogoArea,
  LogoIcon,
  LogoText,
  ToolbarSection,
  Divider,
  ToolbarButton,
  ThemeButton,
  ExportBtn,
  StatsArea,
  StatBadge,
  DropdownWrapper,
  DropdownMenu,
  DropdownItem,
  DropdownDivider,
} from './Toolbar.styles';
import { ThemeKey } from '../../hooks/useTheme';

/* ── Icons ───────────────────────────────────────────────────────── */

const IconColumns = () => (
  <svg viewBox="0 0 16 16" fill="currentColor">
    <rect x="0" y="0" width="6" height="16" rx="1" />
    <rect x="9" y="0" width="7" height="16" rx="1" />
  </svg>
);

const IconEdit = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="1" y="1" width="14" height="14" rx="2" />
    <line x1="4" y1="5" x2="12" y2="5" />
    <line x1="4" y1="8" x2="10" y2="8" />
    <line x1="4" y1="11" x2="8" y2="11" />
  </svg>
);

const IconEye = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" />
    <circle cx="8" cy="8" r="2" />
  </svg>
);

const IconPdf = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M9 1H3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V5L9 1z" />
    <polyline points="9,1 9,5 13,5" />
    <line x1="5" y1="9" x2="11" y2="9" />
    <line x1="5" y1="12" x2="9" y2="12" />
  </svg>
);

const IconCopy = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="4" y="4" width="9" height="11" rx="1" />
    <path d="M3 12H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v1" />
  </svg>
);

const IconDownload = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M8 2v8m0 0l-3-3m3 3l3-3" />
    <path d="M2 12v2h12v-2" />
  </svg>
);

const IconNew = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M9 1H3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V5L9 1z" />
    <polyline points="9,1 9,5 13,5" />
    <line x1="8" y1="8" x2="8" y2="12" />
    <line x1="6" y1="10" x2="10" y2="10" />
  </svg>
);

const IconZen = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M1 1h4M1 1v4M15 1h-4M15 1v4M1 15h4M1 15v-4M15 15h-4M15 15v-4" />
  </svg>
);

const IconSync = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M14 2v4h-4" />
    <path d="M2 14v-4h4" />
    <path d="M14 6a6 6 0 0 0-10.3-2.3L2 6" />
    <path d="M2 10a6 6 0 0 0 10.3 2.3L14 10" />
  </svg>
);

const IconChevron = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <polyline points="4,6 8,10 12,6" />
  </svg>
);

/* ── Constants ───────────────────────────────────────────────────── */

const LAYOUT_OPTIONS = [
  { key: 'split', label: 'Split', Icon: IconColumns },
  { key: 'editor', label: 'Editor', Icon: IconEdit },
  { key: 'preview', label: 'Preview', Icon: IconEye },
] as const;

export type LayoutType = (typeof LAYOUT_OPTIONS)[number]['key'];

const THEME_LABELS: Record<string, string> = {
  github: 'GitHub',
  vscode: 'VS Code',
  obsidian: 'Obsidian',
};

/* ── Props ───────────────────────────────────────────────────────── */

interface ToolbarProps {
  activeThemeKey: ThemeKey;
  themeKeys: ThemeKey[];
  onThemeChange: (key: string) => void;
  layout: LayoutType;
  onLayoutChange: (layout: LayoutType) => void;
  onExport: () => void;
  onExportMd: () => void;
  wordCount: number;
  charCount: number;
  readTime: number;
  onCopy: () => void;
  onNew: () => void;
  zenMode: boolean;
  onToggleZen: () => void;
  scrollSync: boolean;
  onToggleScrollSync: () => void;
  savedLabel: string;
}

/* ── Component ───────────────────────────────────────────────────── */

const Toolbar: React.FC<ToolbarProps> = ({
  activeThemeKey,
  themeKeys,
  onThemeChange,
  layout,
  onLayoutChange,
  onExport,
  onExportMd,
  wordCount,
  charCount,
  readTime,
  onCopy,
  onNew,
  zenMode,
  onToggleZen,
  scrollSync,
  onToggleScrollSync,
  savedLabel,
}) => {
  const [exportOpen, setExportOpen] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setExportOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <ToolbarContainer>
      {/* ── Left: Logo ──────────────────────── */}
      <LogoArea>
        <LogoIcon>📝</LogoIcon>
        <LogoText>MarkDown Studio</LogoText>
      </LogoArea>

      {/* ── Centre: Layout + Theme + Scroll sync ── */}
      <ToolbarSection>
        {LAYOUT_OPTIONS.map(({ key, label, Icon }) => (
          <ToolbarButton
            key={key}
            id={`layout-${key}`}
            $active={layout === key}
            onClick={() => onLayoutChange(key)}
            title={`${label} view`}
          >
            <Icon />
            {label}
          </ToolbarButton>
        ))}

        <Divider />

        {themeKeys.map((key) => (
          <ThemeButton
            key={key}
            id={`theme-${key}`}
            $active={activeThemeKey === key}
            onClick={() => onThemeChange(key)}
            title={`Switch to ${THEME_LABELS[key] ?? key} theme`}
          >
            {THEME_LABELS[key] ?? key}
          </ThemeButton>
        ))}

        <Divider />

        <ToolbarButton
          id="toggle-scroll-sync"
          $active={scrollSync}
          onClick={onToggleScrollSync}
          title={scrollSync ? 'Disable scroll sync' : 'Enable scroll sync'}
        >
          <IconSync />
          Sync
        </ToolbarButton>

        <ToolbarButton
          id="toggle-zen"
          $active={zenMode}
          onClick={onToggleZen}
          title={zenMode ? 'Exit Zen mode (Esc)' : 'Enter Zen mode'}
        >
          <IconZen />
          Zen
        </ToolbarButton>
      </ToolbarSection>

      {/* ── Right: Stats + Actions ──────────── */}
      <ToolbarSection>
        <StatsArea>
          <StatBadge title="Word count">{wordCount.toLocaleString()} words</StatBadge>
          <StatBadge title="Character count">{charCount.toLocaleString()} chars</StatBadge>
          <StatBadge title="Estimated reading time">~{readTime} min read</StatBadge>
          <StatBadge title="Auto-save status" style={{ opacity: 0.75 }}>{savedLabel}</StatBadge>
        </StatsArea>

        <Divider />

        <ToolbarButton id="new-document" onClick={onNew} title="New document (clears editor)">
          <IconNew />
          New
        </ToolbarButton>

        <ToolbarButton id="copy-markdown" onClick={onCopy} title="Copy raw markdown (⌘⇧C)">
          <IconCopy />
          Copy
        </ToolbarButton>

        {/* Export dropdown */}
        <DropdownWrapper ref={exportRef}>
          <ExportBtn
            id="export-menu"
            onClick={() => setExportOpen((o) => !o)}
            title="Export options"
          >
            <IconPdf />
            Export
            <IconChevron />
          </ExportBtn>

          <DropdownMenu $open={exportOpen} role="menu" aria-label="Export options">
            <DropdownItem
              id="export-pdf"
              role="menuitem"
              onClick={() => { setExportOpen(false); onExport(); }}
            >
              <IconPdf />
              Export as PDF
            </DropdownItem>
            <DropdownDivider />
            <DropdownItem
              id="export-md"
              role="menuitem"
              onClick={() => { setExportOpen(false); onExportMd(); }}
            >
              <IconDownload />
              Download .md file
            </DropdownItem>
          </DropdownMenu>
        </DropdownWrapper>
      </ToolbarSection>
    </ToolbarContainer>
  );
};

export default Toolbar;
