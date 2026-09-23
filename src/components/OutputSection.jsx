import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import html2pdf from 'html2pdf.js';
import WidgetCard from '../widgets/WidgetCard';
import CopyButton from './CopyButton';
import { exportTravelPlanPdf } from '../utils/exportPdf';

export default function OutputSection({ sections, statuses, errors, onRetry, isGenerating }) {

  const pdfExportRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);

  // Utility to replace LaTeX symbols
  const formatLatexSymbols = (text) => {
    if (!text) return '';
    return text
      .replace(/\$\\rightarrow\$/g, '→')
      .replace(/\$\\leftarrow\$/g, '←')
      .replace(/\$\\leftrightarrow\$/g, '↔')
      .replace(/\$\\Rightarrow\$/g, '⇒')
      .replace(/\\rightarrow/g, '→')
      .replace(/\\leftarrow/g, '←');
  };

  // PDF Export Handler
//   const handleExportPDF = () => {
//     if (!pdfExportRef.current) return;
//     setIsExporting(true);

//     const element = pdfExportRef.current;
//     const opt = {
//       margin: [15, 15, 15, 15],
//       filename: 'Uganda_Travel_Plan.pdf',
//       image: { type: 'jpeg', quality: 0.98 },
//       html2canvas: { scale: 2, useCORS: true, logging: false },
//       jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
//       pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
//     };

//     html2pdf()
//       .set(opt)
//       .from(element)
//       .save()
//       .then(() => setIsExporting(false))
//       .catch((err) => {
//         console.error('PDF Export Error:', err);
//         setIsExporting(false);
//       });
//   };

  // Render individual section card content
  const renderCardContent = (sectionKey) => {
    const content = sections[sectionKey];
    const status = statuses[sectionKey];
    const error = errors?.[sectionKey];

    if (content) {
      return (
        <AutoScrollContainer sectionKey={sectionKey} content={content} status={status}>
          <div className="wg-output-content prose">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {formatLatexSymbols(content)}
            </ReactMarkdown>
          </div>
        </AutoScrollContainer>
      );
    }

    if (status === 'STREAMING') {
      return (
        <div className="wg-loading-box">
          <span className="wg-spinner"></span>
          <span>Generating your content please wait...</span>
        </div>
      );
    }

    if (status === 'ERROR') {
      const isHighDemand = error?.error_type === 'HIGH_DEMAND';
      return (
        <div
          style={{
            padding: '16px',
            borderRadius: '8px',
            border: isHighDemand ? '1px solid #f59e0b' : '1px solid #ef4444',
            backgroundColor: isHighDemand ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            color: isHighDemand ? '#b45309' : '#dc2626',
            margin: '12px 0',
          }}
        >
          <div style={{ fontWeight: '600', marginBottom: '4px' }}>
            {isHighDemand ? '⚡ Service Experiencing High Demand' : '⚠️ Generation Error'}
          </div>
          <div style={{ fontSize: '14px', lineHeight: '1.4' }}>
            {error?.message || 'Failed to generate content for this section.'}
          </div>
          {onRetry && (
            <button
              onClick={onRetry}
              style={{
                marginTop: '12px',
                padding: '6px 14px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: isHighDemand ? '#d97706' : '#dc2626',
                color: '#ffffff',
                fontWeight: '500',
                cursor: 'pointer',
              }}
            >
              Try Again
            </button>
          )}
        </div>
      );
    }

    return (
      <p className="muted">
        Fill in{' '}
        <button
          className="wg-link"
          onClick={() => document.getElementById('travel-interests')?.focus()}
        >
          Your Travel Interests
        </button>{' '}
        to generate content.
      </p>
    );
  };

//   return (
//     <>
//       <div className="wg-item item-full output-large">
//         <WidgetCard title="Personalized Uganda Itinerary">
//           <div className={`wg-scroll ${!sections.personalized_itinerary ? 'empty' : ''}`}>
//             {renderCardContent('personalized_itinerary')}
//           </div>
//         </WidgetCard>
//       </div>

//       <div className="wg-item item-full output-large">
//         <WidgetCard title="Cost Breakdown and Budget Guide">
//           <div className={`wg-scroll ${!sections.cost_breakdown ? 'empty' : ''}`}>
//             {renderCardContent('cost_breakdown')}
//           </div>
//         </WidgetCard>
//       </div>

//       <div className="wg-item item-full output-large">
//         <WidgetCard title="Cultural Guide and Local Tips">
//           <div className={`wg-scroll ${!sections.cultural_guide ? 'empty' : ''}`}>
//             {renderCardContent('cultural_guide')}
//           </div>
//         </WidgetCard>
//       </div>
//     </>
//   );
// }

    const hasAnyContent = Object.values(sections).some((val) => Boolean(val));
    return (
        <>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Global Toolbar for PDF Export */}
            {hasAnyContent && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
                {/* <button
                    onClick={handleExportPDF}
                    disabled={isGenerating || isExporting}
                    style={{
                    padding: '8px 16px',
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: '600',
                    cursor: isGenerating || isExporting ? 'not-allowed' : 'pointer',
                    opacity: isGenerating || isExporting ? 0.6 : 1,
                    }}
                >
                    {isExporting ? 'Generating PDF...' : '📄 Download Full Itinerary PDF'}
                </button> */}
                {/* <button
                    onClick={() => exportTravelPlanPdf(pdfExportRef, setIsExporting)}
                    disabled={isGenerating || isExporting}
                    className="wg-action-btn"
                    >
                    {isExporting ? 'Generating PDF...' : '📄 Download PDF'}
                </button> */}
                </div>
            )}
            {/* Target wrapper for PDF export */}
            <div ref={pdfExportRef} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="wg-item item-full output-large">
                <WidgetCard
                    title="Personalized Uganda Itinerary"
                    actions={<CopyButton textToCopy={sections.personalized_itinerary} />}
                >
                    {renderCardContent('personalized_itinerary')}
                </WidgetCard>
                </div>

                <div className="wg-item item-full output-large">
                <WidgetCard
                    title="Cost Breakdown and Budget Guide"
                    actions={<CopyButton textToCopy={sections.cost_breakdown} />}
                >
                    {renderCardContent('cost_breakdown')}
                </WidgetCard>
                </div>

                <div className="wg-item item-full output-large">
                <WidgetCard
                    title="Cultural Guide and Local Tips"
                    actions={<CopyButton textToCopy={sections.cultural_guide} />}
                >
                    {renderCardContent('cultural_guide')}
                </WidgetCard>
                </div>
            </div>
        </div>
        </>
    );
}

/**
 * Wrapper component that handles smooth auto-scrolling to the bottom
 * of the section container as new content chunks arrive.
 */
function AutoScrollContainer({ children, content, status, sectionKey }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (status === 'STREAMING' && containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [content, status]);

  return (
    <div
      ref={containerRef}
      className={`wg-scroll ${!content ? 'empty' : ''}`}
      style={{ maxHeight: '500px', overflowY: 'auto', paddingRight: '8px' }}
    >
      {children}
    </div>
  );
}