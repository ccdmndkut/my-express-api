import axios from 'axios';
import fs from 'fs';
import pdf from 'pdf-extraction';

async function downloadPDF(pdfURL) {
    const response = await axios({
        url: pdfURL,
        method: 'GET',
        responseType: 'stream'
    });
    return response.data;
}

async function extractTextFromPDF(pdfStream) {
    return new Promise((resolve, reject) => {
        let dataBuffer = [];
        pdfStream.on('data', (chunk) => {
            dataBuffer.push(chunk);
        });
        pdfStream.on('end', () => {
            pdf(Buffer.concat(dataBuffer)).then(function (data) {
                resolve(data.text);
            }).catch(function (error) {
                reject(`Error extracting PDF text: ${error.message}`);
            });
        });
        pdfStream.on('error', reject);
    });
}

async function pdftxt(pdfURL) {
    try {
        const pdfStream = await downloadPDF(pdfURL);
        const text = await extractTextFromPDF(pdfStream);
        return text;
    } catch (error) {
        return `Error processing PDF: ${error.message}`;
    }
}

async function processPDFLinks(pdfLinks) {
    const results = [];
    try {
        for (const element of pdfLinks) {
            try {
                let pdfText = await pdftxt(element);
                pdfText = pdfText.replace(/(\r\n|\n|\r)/gm, ""); // Remove line breaks
                results.push({ link: element, text: pdfText });
            } catch (error) {
                console.error(`Error processing PDF link ${element}:`, error);
                results.push({ link: element, error: error.message });
            }
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        return { error: error.message };
    }

    return results;
}

export default processPDFLinks;