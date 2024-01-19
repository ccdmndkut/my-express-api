import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: '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'
});

export default async (prompt) => {
    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4-1106-preview',
            messages: [{
                role: 'system',
                content: 'You are a VA law expert that specializing in writing VA related journal articles.'
            }, { role: 'user', content: prompt }],
            temperature: 0.8,
            // response_format: { "type": "json_object" }
        });
        return completion.choices[0].message.content;
    } catch (error) {
        return error;
    }

};