import OpenAI from 'openai';

const openai = new OpenAI();

export default async (prompt) => {
    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4-1106-preview',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.8,
        });
        return completion.choices[0]
    } catch (error) {
        return error;
    }

};