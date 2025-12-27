import { GoogleGenerativeAI } from "@google/generative-ai";
import { Recipe, SensorType, FilmSimulation, GrainEffect, ColorChromeEffect, WhiteBalanceType, DynamicRange } from "../types";

const recipeSchema = {
  type: "object",
  properties: {
    name: { type: "string", description: "A creative name for the film recipe" },
    description: { type: "string", description: "A short description of the visual style" },
    simulation: { type: "string", enum: Object.values(FilmSimulation) },
    grain: { type: "string", enum: Object.values(GrainEffect) },
    colorChromeEffect: { type: "string", enum: Object.values(ColorChromeEffect) },
    colorChromeFXBlue: { type: "string", enum: Object.values(ColorChromeEffect) },
    whiteBalance: { type: "string", enum: Object.values(WhiteBalanceType) },
    kelvin: { type: "integer", description: "Kelvin temperature if WB is Kelvin, otherwise null", nullable: true },
    wbShiftR: { type: "integer", description: "Red shift -9 to 9" },
    wbShiftB: { type: "integer", description: "Blue shift -9 to 9" },
    dynamicRange: { type: "string", enum: Object.values(DynamicRange) },
    highlight: { type: "integer", description: "Highlight tone -2 to +4" },
    shadow: { type: "integer", description: "Shadow tone -2 to +4" },
    color: { type: "integer", description: "Color saturation -4 to +4" },
    sharpness: { type: "integer", description: "Sharpness -4 to +4" },
    noiseReduction: { type: "integer", description: "High ISO NR -4 to +4" },
    clarity: { type: "integer", description: "Clarity -5 to +5" },
    tags: { type: "array", items: { type: "string" }, description: "3-4 descriptive tags" },
  },
  required: ["name", "simulation", "dynamicRange", "highlight", "shadow", "color", "whiteBalance", "wbShiftR", "wbShiftB"],
};

export const generateRecipeFromPrompt = async (prompt: string, sensor: SensorType): Promise<Partial<Recipe> | null> => {
  try {
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: recipeSchema,
      },
    });

    const systemInstruction = `
      You are an expert Fujifilm photographer and colorist. 
      Create a recipe for ${sensor} sensor based on: ${prompt}.
      Approximate classic film stocks if mentioned.
    `;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      systemInstruction: systemInstruction,
    });

    const response = await result.response;
    const text = response.text();
    if (text) {
      const data = JSON.parse(text);
      return {
        ...data,
        id: `gen-${Date.now()}`,
        author: 'AI Assistant',
        sensor: sensor,
        isFavorite: false,
      };
    }
    return null;
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};