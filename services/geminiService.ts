import { OsintReport, EntityType } from '../types';

export const generateOsintReport = async (query: string, apiKey: string): Promise<OsintReport> => {
  if (!apiKey) throw new Error("Credentials Missing: Initialize Node in Settings.");

  const systemPrompt = `You are a forensic investigator. Generate a detailed OSINT report for ${query}.
  You MUST return ONLY a raw JSON object matching this structure exactly:
  {
    "targetName": "${query}",
    "entityType": "Company",
    "summary": "Full forensic summary here",
    "confidenceScore": 85,
    "keyStats": [{"label": "Status", "value": "Active", "trend": "neutral"}],
    "timeline": [{"date": "2024", "event": "Audit initiated"}],
    "connections": [{"name": "Parent Corp", "roleOrRelation": "Subsidiary", "strength": 8}],
    "riskFactors": ["Data Privacy", "Supply Chain Risk"],
    "digitalFootprint": ["Web Presence", "Registry Entry"],
    "sources": ["https://google.com"]
  }
  Rules: entityType must be "Company", "Individual", or "Unknown". confidenceScore is 0-100.`;

  try {
    const response = await fetch(\`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=\${apiKey}\`, {
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
    const cleanJson = rawText.replace(/\`\`\`json|\`\`\`/g, "").trim();
    const parsed = JSON.parse(cleanJson);

    // Map string to Enum for UI stability
    if (parsed.entityType === 'Company') parsed.entityType = EntityType.COMPANY;
    else if (parsed.entityType === 'Individual') parsed.entityType = EntityType.INDIVIDUAL;
    else parsed.entityType = EntityType.UNKNOWN;

    return parsed as OsintReport;
  } catch (err: any) {
    throw new Error(\`Audit Interrupted: \${err.message}\`);
  }
};
