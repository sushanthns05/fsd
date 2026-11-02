import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from '../config/environment.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateCertificatePDF = async ({
  certificateId,
  studentName,
  courseTitle,
  instructorName,
  issueDate,
  verificationUrl,
}) => {
  return new Promise((resolve, reject) => {
    const certDir = path.join(__dirname, '../../uploads/certificates');
    if (!fs.existsSync(certDir)) {
      fs.mkdirSync(certDir, { recursive: true });
    }

    const filePath = path.join(certDir, `${certificateId}.pdf`);
    const doc = new PDFDocument({
      layout: 'landscape',
      size: 'A4',
      margin: 40,
    });

    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    // Decorative borders
    doc.rect(20, 20, 802, 555).lineWidth(4).strokeColor('#4338ca').stroke();
    doc.rect(26, 26, 790, 543).lineWidth(1.5).strokeColor('#e0e7ff').stroke();

    // Header
    doc.moveDown(2);
    doc.font('Helvetica-Bold').fontSize(34).fillColor('#1e1b4b').text('EduSphere', { align: 'center' });
    doc.font('Helvetica').fontSize(12).fillColor('#6366f1').text('SMART ONLINE LEARNING PLATFORM', { align: 'center', tracking: 3 });

    doc.moveDown(1.5);
    doc.font('Helvetica-Bold').fontSize(22).fillColor('#0f172a').text('CERTIFICATE OF COMPLETION', { align: 'center' });

    doc.moveDown(0.8);
    doc.font('Helvetica').fontSize(13).fillColor('#64748b').text('This is to proudly certify that', { align: 'center' });

    // Student Name
    doc.moveDown(0.8);
    doc.font('Helvetica-Bold').fontSize(28).fillColor('#4338ca').text(studentName, { align: 'center' });

    // Body
    doc.moveDown(0.8);
    doc.font('Helvetica').fontSize(13).fillColor('#475569').text('has successfully satisfied all curriculum milestones and passed the assessment for', { align: 'center' });

    // Course Title
    doc.moveDown(0.5);
    doc.font('Helvetica-Bold').fontSize(20).fillColor('#1e293b').text(courseTitle, { align: 'center' });

    // Signatures / Details
    doc.moveDown(2);
    const startY = 460;

    // Left: Instructor
    doc.font('Helvetica-Bold').fontSize(12).fillColor('#1e293b').text(instructorName, 80, startY);
    doc.rect(80, startY + 16, 200, 1).fillColor('#cbd5e1').fill();
    doc.font('Helvetica').fontSize(10).fillColor('#64748b').text('Instructor / Course Director', 80, startY + 22);

    // Center: Issue Date
    const formattedDate = new Date(issueDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    doc.font('Helvetica-Bold').fontSize(12).fillColor('#1e293b').text(formattedDate, 350, startY, { align: 'center', width: 140 });
    doc.rect(350, startY + 16, 140, 1).fillColor('#cbd5e1').fill();
    doc.font('Helvetica').fontSize(10).fillColor('#64748b').text('Date of Issuance', 350, startY + 22, { align: 'center', width: 140 });

    // Right: Verification ID
    doc.font('Helvetica-Bold').fontSize(11).fillColor('#1e293b').text(`ID: ${certificateId}`, 540, startY, { align: 'right', width: 220 });
    doc.rect(560, startY + 16, 200, 1).fillColor('#cbd5e1').fill();
    doc.font('Helvetica').fontSize(9).fillColor('#64748b').text(`Verify at: ${verificationUrl}`, 540, startY + 22, { align: 'right', width: 220 });

    doc.end();

    writeStream.on('finish', () => {
      resolve(`/uploads/certificates/${certificateId}.pdf`);
    });

    writeStream.on('error', (err) => {
      reject(err);
    });
  });
};
