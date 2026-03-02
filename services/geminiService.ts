import { GoogleGenerativeAI } from "@google/generative-ai";
import { OsintReport, EntityType } from '../types';

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
  
  // TARGETING THE STABLE 2.5 FLASH NODE
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: "You are GhostTrace, elite OSINT analyst. Return a detailed JSON report. Ensure the JSON includes targetName, entityType, summary, confidenceScore, keyStats, timeline, connections, riskFactors, digitalFootprint, and sources. Rules: entityType must be 'Company', 'Individual', or 'Unknown'. confidenceScore is 0-100."
  });

  try {
    const result = await model.generateContent(`Deep OSINT trace on: "${query}".`);
    const responseText = result.response.text();
    const parsed = extractAndParseJson(responseText);

    // Schema Enforcement for UI Stability
    if (parsed.entityType === 'Company') parsed.entityType = EntityType.COMPANY;
    else if (parsed.entityType === 'Individual') parsed.entityType = EntityType.INDIVIDUAL;
    else parsed.entityType = EntityType.UNKNOWN;

    return parsed as OsintReport;
  } catch (err: any) {
    if (err.message?.includes('429')) {
      throw new Error("Node Throttled: API Quota exceeded. Check billing status in AI Studio.");
    }
    throw new Error(`Audit Interrupted: ${err.message}`);
  }
};

export const chatWithOsintContext = async (message: string, report: any, apiKey: string) => {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const chat = model.startChat({
    history: [
      { role: "user", parts: [{ text: `CONTEXT: ${JSON.stringify(report)}` }] },
      { role: "model", parts: [{ text: "Intel loaded. Awaiting inquiry." }] }
    ]
  });
  const result = await chat.sendMessage(message);
  return result.response.text();
};
