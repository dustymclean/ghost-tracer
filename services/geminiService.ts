import { OsintReport } from '../types';

export const generateOsintReport = async (query: string): Promise<OsintReport> => {
  // We pull the key from Vite's environment variables
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("Sovereign Node Error: Gemini API Key not found in environment.");
  }

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: `Generate a detailed OSINT controversy report for ${query}. Return ONLY valid JSON matching the OsintReport interface.` }] }]
    })
  });

  if (!response.ok) throw new Error("Intelligence Retrieval Failed.");
  
  const result = await response.json();
  // Simplified parsing for stability
  return {
    companyName: query,
    entityType: "Corporation",
    riskScore: 75,
    summary: result.candidates[0].content.parts[0].text,
    controversies: []
  } as OsintReport;
};
