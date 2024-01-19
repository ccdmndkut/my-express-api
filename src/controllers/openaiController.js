import openaiService from '../services/openaiService.js';

let base = async (req, res, next) => {
    try {
        req.body.prompt = req.body.prompt || ''
        const { prompt } = req.body
        res.send(await openaiService(prompt));
    } catch (error) {
        next(error);
    }
};

export default base;