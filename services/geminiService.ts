import { GoogleGenAI } from "@google/genai";
import { AppData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const askSmartPiggy = async (
  question: string,
  data: AppData
): Promise<string> => {
  const walletSummary = data.wallets
    .map((w) => `${w.name}: £${w.balance.toFixed(2)} (${w.percentage}%)`)
    .join(", ");

  const recentTransactions = data.transactions
    .slice(0, 5)
    .map(
      (t) =>
        `${t.date.split("T")[0]}: ${t.type} £${t.amount.toFixed(2)} - ${
          t.description
        }`
    )
    .join("\n");

  const prompt = `
    You are "Smart Piggy", a friendly, funny, and encouraging financial advisor for a child (aged 8-12).
    
    Current Financial State:
    ${walletSummary}

    Recent Transactions:
    ${recentTransactions}

    User Question: "${question}"

    Answer constraints:
    1. Keep it short (under 100 words).
    2. Use simple English and emojis.
    3. Be encouraging about saving.
    4. If they ask about buying something, check if they have enough in their 'Spending' wallet.
    5. Use British Pounds (£).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text || "Oink! I couldn't understand that. Try again?";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Oink! My brain is fuzzy. Please check your internet connection.";
  }
};