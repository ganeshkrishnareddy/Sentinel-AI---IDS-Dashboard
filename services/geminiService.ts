import { GoogleGenAI } from "@google/genai";
import { Alert } from '../types';

const apiKey = process.env.API_KEY;

export const getMitigationAdvice = async (alert: Alert): Promise<string> => {
  // Fallback for demo purposes if no key is present
  if (!apiKey) {
    console.warn("No API_KEY found in process.env. Using mock response.");
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`**AI Analysis for ${alert.type} Attack**\n\n` +
          `Detected high confidence (${(alert.confidence * 100).toFixed(1)}%) anomaly from ${alert.srcIp}.\n\n` +
          `**Recommended Mitigation:**\n` +
          `1. **Block Source IP:** Immediately block traffic from ${alert.srcIp} at the firewall level.\n` +
          `2. **Rate Limiting:** Implement rate limiting on port 80/443 to mitigate potential DoS impact.\n` +
          `3. **Packet Inspection:** Review logs for payload signatures matching CVE-2023-XXXX.\n` +
          `4. **Isolate Target:** If severity persists, isolate host ${alert.dstIp} from the main VLAN.`);
      }, 1500);
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `
      You are a Senior Cybersecurity Engineer. Analyze the following Intrusion Detection System (IDS) alert and provide a concise, actionable mitigation plan.
      
      Alert Details:
      - Attack Type: ${alert.type}
      - Severity: ${alert.severity}
      - Source IP: ${alert.srcIp}
      - Target IP: ${alert.dstIp}
      - Protocol: ${alert.protocol}
      - Confidence: ${(alert.confidence * 100).toFixed(1)}%
      
      Top Contributing Features (SHAP values):
      ${alert.features.map(f => `- ${f.feature}: ${f.value} (Impact: ${f.contribution.toFixed(3)})`).join('\n')}
      
      Provide the response in Markdown format. Focus on immediate containment and remediation.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error connecting to AI Security Assistant. Please check API Key configuration.";
  }
};

export interface RealPhishingResult {
  isSafe: boolean;
  score: number;
  threats: string[];
  details: { label: string; value: string; status: 'good' | 'warning' | 'danger' }[];
  summary: string;
}

export const analyzePhishingUrl = async (url: string): Promise<RealPhishingResult | null> => {
  if (!apiKey) return null;

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // Using Google Search to ground the analysis in real-world data
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the reputation of this URL: "${url}". 
      Use Google Search to check for phishing reports, domain age, SSL validity, and brand impersonation reviews. 
      Act like a tool similar to Scamadviser or VirusTotal.
      
      You must format your output EXACTLY as follows (do not use Markdown code blocks, just plain text lines):
      SCORE: [0-100]
      VERDICT: [SAFE or UNSAFE]
      THREATS: [Threat 1|Threat 2|Threat 3] (Use | as separator, if safe write None)
      DETAILS: [Label1: Value1|Label2: Value2|Label3: Value3] (Use | as separator. Include Domain Age, SSL Status, and Hosting Location)
      SUMMARY: [A brief 2 sentence summary of the findings]`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "";
    console.log("Gemini Phishing Analysis:", text);

    // Naive parsing of the structured text response
    const scoreMatch = text.match(/SCORE:\s*(\d+)/i);
    const verdictMatch = text.match(/VERDICT:\s*(.+)/i);
    const threatsMatch = text.match(/THREATS:\s*(.+)/i);
    const detailsMatch = text.match(/DETAILS:\s*(.+)/i);
    const summaryMatch = text.match(/SUMMARY:\s*(.+)/i);

    const score = scoreMatch ? parseInt(scoreMatch[1]) : 50;
    const isSafe = verdictMatch ? verdictMatch[1].trim().toUpperCase().includes('SAFE') && !verdictMatch[1].trim().toUpperCase().includes('UNSAFE') : score > 70;
    
    const threats = threatsMatch && !threatsMatch[1].includes('None') 
      ? threatsMatch[1].split('|').map(t => t.trim()) 
      : [];

    const detailsRaw = detailsMatch ? detailsMatch[1].split('|') : [];
    const details = detailsRaw.map(d => {
      const [label, value] = d.split(':').map(s => s.trim());
      // Simple heuristic for status
      const status = (value?.toLowerCase().includes('valid') || value?.toLowerCase().includes('year') || value?.toLowerCase().includes('safe')) ? 'good' : 'warning';
      return { label: label || 'Info', value: value || 'Unknown', status: status as 'good' | 'warning' | 'danger' };
    });

    return {
      isSafe,
      score,
      threats,
      details,
      summary: summaryMatch ? summaryMatch[1] : "Analysis completed."
    };

  } catch (error) {
    console.error("Gemini Phishing Analysis Error:", error);
    return null;
  }
};
