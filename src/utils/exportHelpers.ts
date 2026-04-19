/**
 * Triggers a browser download of the given text content.
 */
export const downloadFile = (filename: string, content: string, mimeType: string): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Wraps preview HTML into a standalone, fully-styled HTML document.
 */
export const buildStandaloneHtml = (bodyHtml: string, title: string): string => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 15px;
      line-height: 1.75;
      color: #1f2328;
      background: #ffffff;
      padding: 2rem;
    }
    .markdown-body { max-width: 760px; margin: 0 auto; }
    h1, h2, h3, h4, h5, h6 { color: #1f2328; font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.6rem; }
    h1 { font-size: 2rem; border-bottom: 2px solid #d0d7de; padding-bottom: 0.4rem; }
    h2 { font-size: 1.5rem; border-bottom: 1px solid #d0d7de; padding-bottom: 0.3rem; }
    p { margin-bottom: 1rem; }
    a { color: #0969da; }
    code { font-family: 'JetBrains Mono', monospace; font-size: 0.87em; background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 4px; padding: 0.15em 0.4em; }
    pre { background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 8px; padding: 1.25rem; overflow-x: auto; margin-bottom: 1.25rem; }
    pre code { background: transparent; border: none; padding: 0; }
    blockquote { border-left: 4px solid #d0d7de; color: #57606a; padding: 0.5rem 0 0.5rem 1.25rem; margin: 1.25rem 0; font-style: italic; }
    table { border-collapse: collapse; width: 100%; margin-bottom: 1.25rem; }
    th, td { padding: 0.6rem 1rem; border: 1px solid #d0d7de; text-align: left; }
    th { background: #f6f8fa; font-weight: 600; }
    ul, ol { padding-left: 1.75rem; margin-bottom: 1rem; }
    hr { border: none; border-top: 1px solid #d0d7de; margin: 2rem 0; }
    img { max-width: 100%; border-radius: 8px; }
  </style>
</head>
<body>
  <div class="markdown-body">
    ${bodyHtml}
  </div>
</body>
</html>`;
