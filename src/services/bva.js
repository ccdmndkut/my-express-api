import axios from "axios";
import * as cheerio from 'cheerio';
const BASE_URL = 'http://search.uscourts.cavc.gov';
const SEARCH_URL = `${BASE_URL}/search/`;

var options = {
    method: 'POST',
    url: 'http://search.uscourts.cavc.gov/search/',
    headers: {
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'max-age=0',
        Connection: 'keep-alive',
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: '_bl_uid=9qltOqvwxp4fX40Fpu2pebUn0zI2; ISYSSESSION=^{EFF58FEE-E529-4198-B18F-A46F41D49542^}; IW_SELIDX=PanelDecisions^|SingleJudgeDecisions',
        'If-Modified-Since': 'Sun, 14 Jan 2024 04:49:50 GMT',
        Origin: BASE_URL,
        Referer: `${BASE_URL}/isysadvsearch.html`,
        'Upgrade-Insecure-Requests': '1',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    },
    data: {
        IW_BATCHSIZE: '20',
        IW_SORT: '',
        IW_FIELD_ADVANCE_PHRASE: '',
        IW_FIELD_ADVANCE_OR: '',
        IW_FIELD_ADVANCE_AND: '',
        IW_FIELD_ADVANCE_NOT: '',
        IW_FILTER_FNAME_LIKE: '',
        IW_FILTER_DATE_AFTER: '-m48',
        IW_SEARCH_SCOPE: '',
        IW_DATABASE: ['PanelDecisions']
    }
};

async function pdfLinks(q) {
    options.data.IW_FIELD_ADVANCE_AND = q;
    try {
        const { data } = await axios.request(options);
        const $ = cheerio.load(data);
        const pdfLinkElements = $('a[href$=".pdf"]').toArray();

        return pdfLinkElements.map(el => 'http://search.uscourts.cavc.gov' + el.attribs.href);
    } catch (error) {
        console.error(error);
    }
}

// Call fetchData and handle the promise


export default pdfLinks;