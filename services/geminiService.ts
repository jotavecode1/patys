import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateProductDescription = async (name: string, category: string): Promise<string> => {
  if (!apiKey) {
    console.warn("API Key missing for Gemini.");
    return "Descrição não disponível (API Key ausente).";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Escreva uma descrição atraente, curta e vendedora (máximo 25 palavras) em Português do Brasil para um produto de moda.
      Produto: ${name}
      Categoria: ${category}
      Tom de voz: Elegante e moderno.`,
    });

    return response.text?.trim() || "Nova coleção Paty Modas.";
  } catch (error) {
    console.error("Error generating description:", error);
    return "Peça exclusiva da Paty Modas.";
  }
};