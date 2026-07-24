import { GoogleGenerativeAI } from "@google/generative-ai";

export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
export const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });

function checkApiKey() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("AI service unavailable. Please configure GEMINI_API_KEY.");
  }
}

/**
 * Predicts cluster formation probability and optimization metrics.
 * Note: Should only be used to EXPLAIN algorithmically generated clusters.
 */
export async function predictClusterViability(location: any, category: string, date: string): Promise<any> {
  checkApiKey();
  const prompt = `
    You are an AI logistics engine for Myntra BharatOS.
    Analyze the spatial clustering viability for orders.
    Input parameters:
    - Location: ${JSON.stringify(location)}
    - Category: ${category}
    - Date: ${date}
    
    Respond STRICTLY in JSON format with exactly the following structure (no markdown blocks, no extra text):
    {
      "probabilityPercent": number (0-100),
      "estimatedTimeMinutes": number,
      "expectedMembersCount": number,
      "sustainabilityOffsetKgCO2": number
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(jsonStr);
  } catch (error: any) {
    throw new Error(error.message || "Failed to generate AI cluster prediction.");
  }
}

/**
 * Uses Gemini strictly to EXPLAIN the numerically calculated demand forecast.
 */
export async function explainDemandForecast(forecastData: any[]): Promise<string> {
  checkApiKey();
  const prompt = `
    You are an AI demand forecasting analyst for Myntra sellers.
    Analyze the following numerically computed demand forecasts (already calculated by our Exponential Moving Average algorithm).
    Data: ${JSON.stringify(forecastData).substring(0, 1000)}
    
    Write a brief, professional summary explaining the forecast trends to the seller. 
    IMPORTANT FORMATTING RULES:
    1. You MUST format your ENTIRE response as semantic HTML (using <p>, <h3>, <ul>, <li>, <strong>, and <hr>).
    2. Do NOT use any Markdown (no **, no ##).
    3. Do NOT wrap your response in \`\`\`html code blocks. Just return the raw HTML string directly.
    4. Keep it concise and actionable.
  `;

  try {
    const result = await model.generateContent(prompt);
    console.log(result);
    return result.response.text();
  } catch (error: any) {
    throw new Error(error.message || "Failed to generate AI demand forecast explanation.");
  }
}

/**
 * Uses Gemini strictly to EXPLAIN generated recommendations.
 */
export async function explainCopilotRecommendations(systemState: any, calculatedRecommendations: any[]): Promise<string> {
  checkApiKey();
  const prompt = `
    You are an AI operations copilot for Myntra BharatOS.
    Analyze this current system telemetry snapshot and the algorithmically computed recommendations:
    System State: ${JSON.stringify(systemState)}
    Computed Recommendations: ${JSON.stringify(calculatedRecommendations)}
    
    Write a clear natural language explanation of WHY these recommendations were made based on the system state.
  `;

  try {
    const result = await model.generateContent(prompt);
    console.log(result)
    return result.response.text();
  } catch (error: any) {
    throw new Error(error.message || "Failed to generate AI copilot explanation.");
  }
}
