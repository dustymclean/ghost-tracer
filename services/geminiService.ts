import { GoogleGenerativeAI } from "@google/generative-ai";
import { OsintReport } from '../types';

const extractAndParseJson = (text: string): any => {
  let clean = text.trim();
  const firstBrace = clean.indexOf('{');
  const lastBrace = clean.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1) {
    clean = clean.substring(firstBrace, lastBrace + 1);
  }
  return JSON.parse(clean);
};

export const generateOsintReport = async (query: string, apiKey: string): Promise<OsintReport> => {
  const genAI = new GoogleGenerativeAI(apiKey);
  
  // Reverting to the elite Flash 2.0 engine with the original system instruction
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
    systemInstruction: "You are GhostTrace, elite OSINT analyst. Return a detailed JSON report. Ensure the JSON includes targetName, entityType, summary, confidenceScore, keyStats, timeline, connections, riskFactors, digitalFootprint, and sources."
  });

  const result = await model.generateContent(`Deep OSINT trace on: "${query}".`);
  const responseText = result.response.text();
  
  return extractAndParseJson(responseText) as OsintReport;
};

export const chatWithOsintContext = async (message: string, report: any, apiKey: string) => {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
  const chat = model.startChat({
    history: [
      { role: "user", parts: [{ text: `CONTEXT: ${JSON.stringify(report)}` }] },
      { role: "model", parts: [{ text: "Intel loaded. Awaiting inquiry." }] }
    ]
  });
  const result = await chat.sendMessage(message);
  return result.response.text();
};
