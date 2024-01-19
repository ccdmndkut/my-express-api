import bvaLinks from './bva.js';
import pdftxt from './pdftxt.js';
import ai from './aiJson.js';

async function analyzeCases(q) {
    try {
        const links = await bvaLinks(q);
        const data = await pdftxt(links);
        return data;
        // let aiRes = await ai(`Analyze the following VA appeal decisions. Take a deep breath and extract key insights from each case to generate a detailed and in-depth 5000+ word journal article on ${q}. The article should not be on the individual cases but rather ${q}, using the insights gained from analyzing the decisions. Return a comprehensive article on ${q}. Cases: ${JSON.stringify(data[0])}`)
        /*   data.forEach(async ({ text }) => {
              await ai(text);
          }); */
    } catch (error) {
        console.error(error);
    }
}
export default analyzeCases;