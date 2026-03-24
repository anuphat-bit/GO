
import { GoogleGenAI } from "@google/genai";

export const geminiService = {
  analyzeProductSustainability: async (description: string, imageUrl?: string) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    let contents: any;
    if (imageUrl) {
      const base64Data = imageUrl.split(',')[1];
      contents = {
        parts: [
          { text: `Analyze if this office material or stationary is environmentally friendly based on its image and description: "${description}". Provide a brief justification in simple Thai.` },
          { inlineData: { mimeType: 'image/jpeg', data: base64Data } }
        ]
      };
    } else {
      contents = `Analyze if this office material or stationary is environmentally friendly based on its description: "${description}". Provide a brief justification in simple Thai.`;
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: contents,
      });
      return response.text;
    } catch (error) {
      console.error('Gemini error:', error);
      return 'Could not analyze sustainability at this time.';
    }
  }
};
