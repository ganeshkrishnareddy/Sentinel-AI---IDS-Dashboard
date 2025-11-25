export type Severity = 'Low' | 'Medium' | 'High' | 'Critical';
export type AttackType = 'Benign' | 'DoS' | 'Probe' | 'U2R' | 'R2L' | 'Botnet';

export interface FeatureContribution {
  feature: string;
  value: number; // The actual value of the feature
  contribution: number; // The SHAP value (positive = contributes to attack prediction)
}

export interface Alert {
  id: string;
  timestamp: string; // ISO string
  srcIp: string;
  dstIp: string;
  protocol: 'TCP' | 'UDP' | 'ICMP';
  type: AttackType;
  severity: Severity;
  confidence: number; // 0.0 to 1.0
  features: FeatureContribution[]; // For explainability
  status: 'New' | 'Analyzing' | 'Resolved';
}

export interface TrafficStats {
  totalPackets: number;
  maliciousPackets: number;
  bytesTransferred: number;
  activeThreats: number;
}

export interface TrafficPoint {
  time: string;
  benign: number;
  malicious: number;
}
