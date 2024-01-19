import bva from '../services/bva.js';
import pdftxt from '../services/pdftxt.js';

let base = async (req, res, next) => {
    try {
        req.body.prompt = req.body.prompt || 'ptsd'
        const { prompt } = req.body
        const links = await bva(prompt)
        const data = await pdftxt(links);
        res.json(data);
    } catch (error) {
        next(error);
    }
};

export default base;