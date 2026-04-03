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
} from './Toolbar.styles.js';

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



const LAYOUT_OPTIONS = [
  { key: 'split', label: 'Split', Icon: IconColumns },
  { key: 'editor', label: 'Editor', Icon: IconEdit },
  { key: 'preview', label: 'Preview', Icon: IconEye },
];

const Toolbar = ({
  activeThemeKey,
  onThemeChange,
  layout,
  onLayoutChange,
  onExport,
  wordCount,
  readTime,
  onCopy,
}) => {
  return (
    <ToolbarContainer>
      {/* Logo */}
      <LogoArea>
        <LogoIcon>📝</LogoIcon>
        <LogoText>Markdown Studio</LogoText>
      </LogoArea>

      {/* Center Controls */}
      <ToolbarSection>


        {/* Layout toggle */}
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
      </ToolbarSection>

      {/* Right Actions */}
      <ToolbarSection>
        <StatsArea>
          <StatBadge>{wordCount} words</StatBadge>
          <StatBadge>~{readTime} min read</StatBadge>
        </StatsArea>

        <Divider />

        <ToolbarButton id="copy-markdown" onClick={onCopy} title="Copy raw markdown">
          <IconCopy />
          Copy
        </ToolbarButton>

        <ExportBtn id="export-pdf" onClick={onExport} title="Export as PDF">
          <IconPdf />
          Export PDF
        </ExportBtn>
      </ToolbarSection>
    </ToolbarContainer>
  );
};

export default Toolbar;
