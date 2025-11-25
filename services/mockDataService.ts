import { Alert, AttackType, Severity, FeatureContribution, TrafficPoint } from '../types';
import { IDS_FEATURES } from '../constants';

const randomIp = () => `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;

const generateId = () => Math.random().toString(36).substr(2, 9);

const determineSeverity = (type: AttackType): Severity => {
  switch (type) {
    case 'DoS': return 'High';
    case 'Probe': return 'Medium';
    case 'U2R': return 'Critical';
    case 'R2L': return 'High';
    case 'Botnet': return 'Critical';
    default: return 'Low';
  }
};

const generateShapValues = (type: AttackType): FeatureContribution[] => {
  // Simulate SHAP values based on attack type logic (simplified)
  return IDS_FEATURES.slice(0, 6).map(feature => {
    let contribution = Math.random() * 0.5 - 0.1; // Baseline noise
    let value = Math.floor(Math.random() * 1000);

    if (type === 'DoS' && (feature === 'src_bytes' || feature === 'count')) {
      contribution += 0.8; // High contribution for DoS
      value += 5000;
    } else if (type === 'Probe' && (feature === 'dst_host_count')) {
      contribution += 0.6;
    }

    return {
      feature,
      value,
      contribution
    };
  }).sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));
};

export const generateMockAlert = (): Alert | null => {
  // 30% chance to generate an alert
  if (Math.random() > 0.3) return null;

  const types: AttackType[] = ['DoS', 'Probe', 'U2R', 'R2L', 'Botnet'];
  const type = types[Math.floor(Math.random() * types.length)];
  const severity = determineSeverity(type);

  return {
    id: generateId(),
    timestamp: new Date().toISOString(),
    srcIp: randomIp(),
    dstIp: '192.168.1.105', // Internal server
    protocol: Math.random() > 0.5 ? 'TCP' : 'UDP',
    type,
    severity,
    confidence: 0.85 + (Math.random() * 0.14),
    status: 'New',
    features: generateShapValues(type)
  };
};

export const generateTrafficPoint = (prevMalicious: number): TrafficPoint => {
  const time = new Date().toLocaleTimeString('en-US', { hour12: false });
  const baseTraffic = 500 + Math.random() * 200;
  
  // Malicious traffic spikes randomly
  let malicious = prevMalicious * 0.9; // Decay
  if (Math.random() > 0.8) malicious += Math.random() * 300; // Spike
  if (malicious < 10) malicious = 10;

  return {
    time,
    benign: Math.floor(baseTraffic),
    malicious: Math.floor(malicious)
  };
};

export interface PhishingResult {
  url: string;
  isSafe: boolean;
  score: number; // 0-100, where 100 is very safe
  threats: string[];
  details: { label: string; value: string; status: 'good' | 'warning' | 'danger' }[];
}

export const checkPhishingUrl = (url: string): Promise<PhishingResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const lowerUrl = url.toLowerCase();
      // Simple heuristic for demo purposes
      const isSuspicious = 
        lowerUrl.includes('update') || 
        lowerUrl.includes('login') || 
        lowerUrl.includes('secure') || 
        lowerUrl.includes('account') ||
        lowerUrl.includes('bit.ly') ||
        lowerUrl.includes('ngrok');

      const isSafe = !isSuspicious;
      const score = isSafe ? 85 + Math.floor(Math.random() * 15) : Math.floor(Math.random() * 40);
      
      const threats = [];
      if (!isSafe) {
        threats.push('Suspicious URL structure detected');
        threats.push('Domain reputation is low');
        if (Math.random() > 0.5) threats.push('Potential homograph attack');
      }

      const details = [
        { label: 'SSL Certificate', value: isSafe ? 'Valid (DigiCert Inc)' : 'Invalid / Self-Signed', status: isSafe ? 'good' : 'danger' },
        { label: 'Domain Age', value: isSafe ? '5 Years, 2 Months' : '2 Days', status: isSafe ? 'good' : 'warning' },
        { label: 'Redirects', value: isSafe ? '0' : '3 detected', status: isSafe ? 'good' : 'warning' },
        { label: 'IP Reputation', value: isSafe ? 'Clean' : 'Blacklisted', status: isSafe ? 'good' : 'danger' },
      ] as const;

      resolve({
        url,
        isSafe,
        score,
        threats,
        details: details as any
      });
    }, 2000);
  });
};