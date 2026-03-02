import { OsintReport } from '../types';

export const generateOsintReport = async (query: string, apiKey: string): Promise<OsintReport> => {
  if (!apiKey) throw new Error("Node Offline: No valid API Key detected.");

  const systemPrompt = `You are a forensic investigator. Generate a detailed OSINT controversy report for ${query}. 
  Return ONLY a raw JSON object. Do not use markdown formatting.
  Structure:
  {
    "companyName": "${query}",
    "entityType": "Corporation",
    "riskScore": 0,
    "summary": "Summary text",
    "controversies": [{"title": "Exposed", "severity": "High", "year": "2024", "description": "Details"}]
  }`;

  // The 'gemini-1.5-flash-latest' alias is the most stable path for cross-environment deployments
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: systemPrompt }] }]
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || "Uplink to Intelligence Node Failed.");
  }

  const result = await response.json();
  const text = result.candidates[0].content.parts[0].text;
  
  // Clean potential AI chatter to ensure valid JSON
  const cleanJson = text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleanJson) as OsintReport;
};
