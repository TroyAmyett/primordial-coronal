import { NextResponse } from 'next/server';
import { generatePrompt, GenerateImageParams } from '@/lib/prompt';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { usage, dimension, subject, additionalDetails } = body;

        if (!usage || !dimension || !subject) {
            return NextResponse.json(
                { error: 'Missing required fields: usage, dimension, subject' },
                { status: 400 }
            );
        }

        const params: GenerateImageParams = {
            usage,
            dimension,
            subject,
            additionalDetails,
        };

        const prompt = generatePrompt(params);

        // TODO: Integrate with actual Image Generation API (OpenAI DALL-E, Stability AI, etc.)
        // For now, we return the generated prompt and a placeholder image.

        // Simulating API latency
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock response
        const mockImageUrl = `https://placehold.co/600x400/0a192f/64ffda?text=${encodeURIComponent(usage + ' - ' + subject)}`;

        // SAVE FOR FUTURE REFERENCE: Log the prompt to a history file
        const logEntry = `
## ${new Date().toISOString()} - ${usage}
**Subject:** ${subject}
**Dimensions:** ${dimension}
**Prompt:**
\`\`\`
${prompt}
\`\`\`
---
`;

        try {
            const historyPath = path.join(process.cwd(), 'generated_history.md');
            fs.appendFileSync(historyPath, logEntry);
        } catch (logError) {
            console.error('Failed to save history:', logError);
        }

        return NextResponse.json({
            success: true,
            prompt: prompt,
            imageUrl: mockImageUrl,
            note: "Image generation is mocked. Configure 'src/app/api/generate/route.ts' with a real provider."
        });

    } catch (error) {
        console.error('Error generating image:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
