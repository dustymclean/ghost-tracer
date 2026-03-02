import { OsintReport, EntityType } from '../types';

export const generateOsintReport = async (query: string, apiKey: string): Promise<OsintReport> => {
  if (!apiKey) throw new Error("Node Offline: Credentials required to initialize audit.");

  // The System Prompt is now explicitly mapped to your OsintReport interface
  const systemPrompt = `You are a forensic investigator. 
  Generate a detailed OSINT report for ${query}. 
  You MUST return ONLY a raw JSON object. Do not include markdown formatting.
  
  REQUIRED SCHEMA:
  {
    "targetName": "${query}",
    "entityType": "Company", 
    "summary": "Forensic analysis of digital footprint.",
    "confidenceScore": 85,
    "keyStats": [{"label": "Status", "value": "Active", "trend": "neutral"}],
    "timeline": [{"date": "2024", "event": "Audit logged"}],
    "connections": [{"name": "Associated Entity", "roleOrRelation": "Network Node", "strength": 5}],
    "riskFactors": ["Data Privacy Risk"],
    "digitalFootprint": ["Public Domain Registry"],
    "sources": ["https://google.com"]
  }

  Note: entityType must be "Individual", "Company", or "Unknown".`;

  try {
    // Switching to the most resilient production endpoint for Gemini 1.5 Flash
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: systemPrompt }] }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Uplink Failure");
    }

    const result = await response.json();
    const rawText = result.candidates[0].content.parts[0].text;
    
    // Rigorous cleaning of the AI response to ensure valid JSON parsing
    const cleanJson = rawText.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleanJson);

    // Map the string to the EntityType enum to satisfy TypeScript
    if (parsed.entityType === 'Company') parsed.entityType = EntityType.COMPANY;
    else if (parsed.entityType === 'Individual') parsed.entityType = EntityType.INDIVIDUAL;
    else parsed.entityType = EntityType.UNKNOWN;

    return parsed as OsintReport;
  } catch (err: any) {
    console.error("Critical Node Crash:", err);
    throw new Error(`Audit Interrupted: ${err.message}`);
  }
};
