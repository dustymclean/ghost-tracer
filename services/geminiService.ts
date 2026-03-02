import { OsintReport } from '../types';

export const generateOsintReport = async (query: string, apiKey: string): Promise<OsintReport> => {
  if (!apiKey) throw new Error("Credentials Missing: Initialize Node in Settings.");

  // This is the prompt structure that previously achieved 100% Symmetery
  const systemPrompt = `You are a forensic investigator. 
  Generate a detailed OSINT controversy report for ${query}. 
  You MUST return ONLY a raw JSON object. Do not include any text before or after the JSON.
  Match this structure exactly:
  {
    "companyName": "${query}",
    "entityType": "Corporation",
    "riskScore": 75,
    "summary": "Brief analysis of corporate footprint.",
    "controversies": [
      {
        "title": "Data Breach / Labor Issue / Environmental Impact",
        "severity": "High",
        "year": "2024",
        "description": "Specific details of the event."
      }
    ]
  }`;

  try {
    // Restoring to the specific endpoint that was previously operational
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: systemPrompt }] }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Uplink Failed");
    }

    const result = await response.json();
    const rawText = result.candidates[0].content.parts[0].text;
    
    // Rigorous cleaning to prevent parsing crashes
    const cleanJson = rawText.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanJson) as OsintReport;
  } catch (err: any) {
    console.error("Node Retrieval Error:", err);
    throw new Error(`Audit Interrupted: ${err.message}`);
  }
};
