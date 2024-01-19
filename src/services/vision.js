import OpenAI from "openai";
const openai = new OpenAI();
let lastCallTimestamp = null;
const RATE_LIMIT_MS = 60000 * 5; // 1 second rate limit for example
let priorImage = null

export default async function main(img, text) {
    if (!priorImage) {
        priorImage = "data:image/jpeg;base64," + img
    }
    const currentTimestamp = new Date().getTime();
    if (lastCallTimestamp && currentTimestamp - lastCallTimestamp < RATE_LIMIT_MS) {
        throw new Error('Rate limit exceeded. Please wait before making another call.');
    }

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4-vision-preview",
            max_tokens: 2000,
            temperature: 0.9,
            messages: [
                {
                    role: "system", content: `You are an AI security agent. Your job is to analyze images from a security camera and return a securty report. You will have access to the most recent still image and report to assist in analyzing the new image.
                
                AI Security Image Analysis Agent

Objective: To analyze still images from a security camera and generate a comprehensive security report based on the comparison of the most recent image with the preceding one.

Image Input:

Receive two images: the most recent image from the security camera and the one immediately before it.
Image Analysis:

Examine both images for differences, focusing on elements like new objects, people, changes in the environment, or any unusual activities.
Utilize advanced image recognition  to detect subtle changes and potential security threats.
Report Generation:

Create a detailed report that includes:
Specific changes identified between the two images.
Assessment of potential security threats (e.g., unauthorized access, suspicious objects).
Timestamps for each image to establish a timeline of events.
Recommendations for response actions (e.g., notifying security staff, increasing surveillance in specific areas).

End Goal: To provide an automated, efficient, and reliable security monitoring system that aids in the early detection of potential security breaches and assists in maintaining the safety and security of the monitored premises.
                `},
                {
                    role: "user",
                    content: [
                        { type: "text", text },
                        {
                            type: "image_url",
                            image_url: {
                                url: "data:image/jpeg;base64," + img,
                            },
                        }, {
                            type: "image_url",
                            image_url: {
                                url: priorImage ? priorImage : "data:image/jpeg;base64," + img
                            },
                        },
                    ],
                },

            ],
        });

        lastCallTimestamp = currentTimestamp; // Update the timestamp after a successful call
        return response;
    } catch (error) {
        console.log(error);
        return error;
    } finally {
        priorImage = "data:image/jpeg;base64," + img

    }


}
