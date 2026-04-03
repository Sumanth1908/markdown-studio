import { useCallback, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

const usePdfExport = () => {
  const contentRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: 'markdown-export',
    pageStyle: `
      @page {
        size: A4;
        margin: 20mm 15mm;
      }

      @media print {
        body {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 12pt;
          line-height: 1.6;
          color: #1f2328 !important;
          background: #ffffff !important;
        }

        pre, code {
          background: #f6f8fa !important;
          color: #24292f !important;
          border: 1px solid #d0d7de !important;
          font-size: 10pt;
        }

        a {
          color: #0969da !important;
        }

        table {
          border-collapse: collapse;
        }

        th, td {
          border: 1px solid #d0d7de !important;
          padding: 6px 12px !important;
        }

        blockquote {
          border-left: 4px solid #d0d7de !important;
          color: #57606a !important;
        }

        h1, h2, h3, h4, h5, h6 {
          color: #1f2328 !important;
          page-break-after: avoid;
        }

        p, blockquote, table, figure {
          page-break-inside: avoid;
        }

        img {
          max-width: 100% !important;
        }
      }
    `,
  });

  return { contentRef, handlePrint };
};

export default usePdfExport;
