import { OsintReport, EntityType } from '../types';

export const generateOsintReport = async (query: string, apiKey: string): Promise<OsintReport> => {
  if (!apiKey) throw new Error("Credentials Missing: Initialize Node in Settings.");

  const systemPrompt = `You are a forensic investigator. Generate a detailed OSINT report for ${query}.
  Return ONLY a raw JSON object matching this structure:
  {
    "targetName": "${query}",
    "entityType": "Company",
    "summary": "Full summary here",
    "confidenceScore": 85,
    "keyStats": [{"label": "Status", "value": "Active", "trend": "neutral"}],
    "timeline": [{"date": "2024", "event": "Analysis initiated"}],
    "connections": [{"name": "Parent Corp", "roleOrRelation": "Subsidiary", "strength": 8}],
    "riskFactors": ["Data Privacy", "Supply Chain"],
    "digitalFootprint": ["Web Presence", "Social Registry"],
    "sources": ["https://google.com"]
  }`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
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
    const cleanJson = rawText.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanJson) as OsintReport;
  } catch (err: any) {
    throw new Error(`Audit Interrupted: ${err.message}`);
  }
};
