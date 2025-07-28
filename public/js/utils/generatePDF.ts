import PDFDocument from 'pdfkit';
import blobStream from 'blob-stream';

const downloadLink = document.getElementById('downloadLink') as HTMLLinkElement;

const generatePDF = (data: string) => {
  const doc = new PDFDocument();
  const stream = doc.pipe(blobStream());

  doc.fontSize(15).text(`Total hours: ${data}`, 100, 100);
  doc.save();
  doc.end();

  stream.on('finish', () => {
    downloadLink.href = stream.toBlobURL('application/pdf');
  });
};

export default generatePDF;
