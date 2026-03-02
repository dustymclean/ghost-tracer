import { OsintReport, EntityType } from '../types';

export const generateOsintReport = async (query: string, apiKey: string): Promise<OsintReport> => {
  if (!apiKey) throw new Error("Node Offline: OpenRouter API Key Required.");

  const systemPrompt = `You are GhostTrace, elite OSINT analyst. 
  Generate a detailed JSON intelligence report for: "${query}". 
  Return ONLY raw JSON matching this schema exactly:
  {
    "targetName": "${query}",
    "entityType": "Company",
    "summary": "Forensic analysis summary...",
    "confidenceScore": 95,
    "keyStats": [{"label": "Status", "value": "Active", "trend": "neutral"}],
    "timeline": [{"date": "2024", "event": "Audit initiated"}],
    "connections": [{"name": "Associated Entity", "roleOrRelation": "Node", "strength": 5}],
    "riskFactors": ["Trace detected"],
    "digitalFootprint": ["Digital Archive"],
    "sources": ["https://google.com"]
  }
  Note: entityType must be "Individual", "Company", or "Unknown".`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "https://dustymclean.github.io/ghost-tracer/",
        "X-Title": "Ghost Tracer OSINT",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "anthropic/claude-3.5-sonnet",
        "messages": [
          {"role": "system", "content": systemPrompt},
          {"role": "user", "content": `Execute deep trace on ${query}`}
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "OpenRouter Uplink Failed");
    }

    const data = await response.json();
    const rawText = data.choices[0].message.content;
    const cleanJson = rawText.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleanJson);

    if (parsed.entityType === 'Company') parsed.entityType = EntityType.COMPANY;
    else if (parsed.entityType === 'Individual') parsed.entityType = EntityType.INDIVIDUAL;
    else parsed.entityType = EntityType.UNKNOWN;

    return parsed as OsintReport;
  } catch (err: any) {
    throw new Error(`Audit Interrupted: ${err.message}`);
  }
};
