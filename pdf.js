import fs from 'fs/promises';
import axios from 'axios';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

async function makePDF(id, name) {
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

export default async function getCertificate(stdId) {
    const filesRes = await axios.get('https://api.github.com/repos/roshan1337d/github-practice/git/trees/main?recursive=1');
    const filesRaw = filesRes.data.tree;
    for (const f of filesRaw) {
        const fPath = f.path.toLowerCase();
        const id = (fPath.match(/[b][0-9]{6}/g) || [null])[0];
        if (id === stdId.toLowerCase()) {
            const fRes = await axios.get(f.url);
            const fContent = atob(fRes.data.content).trim();
            return { valid: true, data: await makePDF(id, fContent) };
        }
    }
    return { valid: false, data: null };
}
