import { GoogleGenAI, Type } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export async function askHealthBot(question, base64Image) {
  try {
    const parts = [{ text: question }];
    if (base64Image) {
      const matches = base64Image.match(/^data:([^;]+);base64,(.+)$/);
      if (matches) {
        parts.push({
          inlineData: { mimeType: matches[1], data: matches[2] },
        });
      }
    }
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts },
      config: {
        systemInstruction: `You are abhimanyu HealthBot, a friendly medical assistant. 
        Focus: 1. Prescription Analysis 2. Injury First Aid 3. Traditional Remedies.
        Always advise consulting an Ayushman-verified doctor for serious conditions.`,
      }
    });
    return response.text || "I'm sorry, I couldn't process that.";
  } catch (error) {
    return "The assistant is currently unavailable.";
  }
}

export async function analyzeFoodItem(input) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze this food item/meal: ${input}. Provide macro breakdown, a health score (1-5 stars), specific ingredient warnings (like palm oil or high sodium), and 3 healthier alternatives.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            foodItem: { type: Type.STRING },
            macros: {
              type: Type.OBJECT,
              properties: {
                protein: { type: Type.STRING },
                carbs: { type: Type.STRING },
                fats: { type: Type.STRING },
                fiber: { type: Type.STRING },
              },
              required: ["protein", "carbs", "fats", "fiber"]
            },
            healthScore: { type: Type.INTEGER },
            warnings: { type: Type.ARRAY, items: { type: Type.STRING } },
            alternatives: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["foodItem", "macros", "healthScore", "warnings", "alternatives"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function simulateEmailSending(email, details) {
  try {
    const prompt = `Generate a professional medical appointment confirmation email for ${details.specialistName} on ${details.date} at ${details.time}. Recipient: ${email}. The subject should be "Booking Confirmed - Pulseplus Health". Include a discount code for Ayushman Bharat card holders.`;
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Email confirmation sent successfully.";
  } catch (error) {
    return "Your booking is confirmed. Check your email.";
  }
}

export async function searchHomeRemedy(query) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a traditional home remedy for: ${query}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            benefits: { type: Type.STRING },
            ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
            preparation: { type: Type.STRING },
          },
          required: ["name", "benefits", "ingredients", "preparation"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    return null;
  }
}

export async function generateWellnessPlan(type, preferences) {
  try {
    const prompt = `Create a ${type} plan: ${preferences.join(', ')}.`;
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Unable to generate.";
  } catch (error) {
    return "Error generating plan.";
  }
}

/**
 * Edit images using gemini-2.5-flash-image based on text prompt and source image.
 */
export async function editProductImage(base64Image, prompt) {
  try {
    const matches = base64Image.match(/^data:([^;]+);base64,(.+)$/);
    if (!matches) return null;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: matches[2],
              mimeType: matches[1],
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Edit Product Image Error:", error);
    return null;
  }
}
