
import { GoogleGenAI, Chat } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

let chat: Chat | null = null;

const getChatInstance = () => {
    if(!chat) {
        chat = ai.chats.create({
            model: 'gemini-2.5-flash',
        });
    }
    return chat;
}

export const streamChatResponse = async (
    message: string,
    documentContext: string,
    onChunk: (chunk: string) => void
) => {
    try {
        const chatInstance = getChatInstance();
        const fullPrompt = `Based on the document titled "${documentContext}", please answer the following question: ${message}`;
        
        const result = await chatInstance.sendMessageStream({ message: fullPrompt });

        for await (const chunk of result) {
            onChunk(chunk.text);
        }
    } catch (error) {
        console.error("Error streaming chat response:", error);
        onChunk("Sorry, I encountered an error. Please try again.");
    }
};


export const generateImage = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: '1:1',
            },
        });
        
        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        } else {
            throw new Error("No image was generated.");
        }
    } catch (error) {
        console.error("Error generating image:", error);
        throw new Error("Failed to generate image. Please check the prompt and try again.");
    }
};
