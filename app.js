import express from 'express';
import openaiRoutes from './src/routes/openaiRoutes.js';
import axios from 'axios';
import puppeteer from 'puppeteer';
import v from './src/services/vision.js';
import * as fs from 'fs';

const app = express();

async function main(imgBase64, text) {
    try {
        const response = await v(imgBase64, text)
        console.log(response.choices[0]);
        return response.choices[0].message.content;
    } catch (error) {
        console.log(error);
        return error;


    }
}


app.use(express.json());

app.use('/openai', openaiRoutes);




app.use('/', async (req, res) => {
    console.log('request received')
    try {
        let imgUrl = "http://192.168.1.12:81/image/index?q=100&s=100"
        let response = await axios.get(imgUrl, { responseType: 'arraybuffer' });
        let imgBase64 = Buffer.from(response.data, 'binary').toString('base64');
        let aiResponse = await main(imgBase64, "Generate a detailed description of everything shown in provided surveillance camera snapshot? Include a security assessment.");
        let card = `<div class="container">
    <div>
        <div class="content">
            <p>${aiResponse}</p>
        </div>
        <img src="${"data:image/jpeg;base64," + imgBase64}" alt="Image">
    </div>
</div>
<style>
img {
    max-width: 90%;
}
</style>
`
        card = card.replace('```html', '');
        card = card.replace('```', '');
        //generate and save pdf of card html
        res.send(card);
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        await page.setContent(card);
        await page.emulateMediaType('screen');
        await page.pdf({ path: './pdfs/' + new Date().getTime() + 'card.pdf', format: 'A4' });
        browser.close().then(() => {
            let pdfFiles = fs.readdirSync('./pdfs');

        }
        )

        // combine all pdfs in folder

    } catch (error) {
        console.log(error);
        res.send(error);
    }


}
)
app.listen(3000, (req) => {
    console.log('Server is running on port 3000');
});
export default app;