import { Configuration, OpenAIApi } from 'openai';
const config = require('../config');

const configuration = new Configuration({
    apiKey: config.openAiApiKey,
});

const openai = new OpenAIApi(configuration);

module.exports = openai;