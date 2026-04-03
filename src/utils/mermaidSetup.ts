import mermaid from 'mermaid';

let initialized = false;

export const initMermaid = (isDark: boolean) => {
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

export const renderMermaid = async (code: string, id: string): Promise<string> => {
  try {
    const { svg } = await mermaid.render(id, code);
    return svg;
  } catch (err: any) {
    console.error('Mermaid render error:', err);
    throw err;
  }
};
