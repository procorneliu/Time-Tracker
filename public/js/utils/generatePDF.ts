import PDFDocument from 'pdfkit';
import blobStream from 'blob-stream';

const generatePDF = (data: string, toLink: HTMLLinkElement) => {
  const doc = new PDFDocument();
  const stream = doc.pipe(blobStream());

  doc.fontSize(15).text(`Total hours: ${data}`, 100, 100);
  doc.save();
  doc.end();

  stream.on('finish', () => {
    toLink.href = stream.toBlobURL('application/pdf');
  });
};

export default generatePDF;
