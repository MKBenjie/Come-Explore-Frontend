import html2pdf from 'html2pdf.js';

export const exportTravelPlanPdf = async (elementRef, setIsExporting) => {
  if (!elementRef || !elementRef.current) return;
  
  if (setIsExporting) setIsExporting(true);
  const element = elementRef.current;

  // Add a class to remove scrollbars and force full height during print capture
  element.classList.add('pdf-export-mode');

  const opt = {
    margin: [12, 12, 12, 12],
    filename: 'Uganda_Travel_Plan.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, logging: false },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
  };

  try {
    await html2pdf().set(opt).from(element).save();
  } catch (err) {
    console.error('PDF Export Error:', err);
  } finally {
    element.classList.remove('pdf-export-mode');
    if (setIsExporting) setIsExporting(false);
  }
};