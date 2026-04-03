import mermaid from 'mermaid';

let initialized = false;

export const initMermaid = (isDark) => {
  if (initialized) {
    mermaid.initialize({
      theme: isDark ? 'dark' : 'default',
    });
    return;
  }

  mermaid.initialize({
    startOnLoad: false,
    theme: isDark ? 'dark' : 'default',
    securityLevel: 'loose',
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: 14,
  });

  initialized = true;
};

export const renderMermaid = async (code, id) => {
  try {
    const { svg } = await mermaid.render(id, code);
    return svg;
  } catch (err) {
    console.error('Mermaid render error:', err);
    throw err;
  }
};
