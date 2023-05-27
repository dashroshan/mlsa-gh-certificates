import fs from 'fs/promises';
import axios from 'axios';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export default async function makePDF(name) {
    const pdfData = await fs.readFile('resources/template.pdf');
    const pdfDoc = await PDFDocument.load(pdfData);
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();
    firstPage.drawText(name, {
        x: width * 0.05,
        y: height * 0.56,
        size: 35,
        font: helveticaFont,
        color: rgb(0, 0.47, 0.83),
    });

    var pdfBytes = await pdfDoc.save();
    var pdfBuffer = Buffer.from(pdfBytes.buffer, 'binary');
    return pdfBuffer;
}