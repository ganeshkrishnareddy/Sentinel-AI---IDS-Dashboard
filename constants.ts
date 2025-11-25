import { TrafficStats } from './types';

export const AUTHOR_NAME = "P Ganesh Krishna Reddy";
export const AUTHOR_CONTACT = "+91-8374622779";
export const AUTHOR_EMAIL = "pganeshkrishnareddy@gmail.com";
export const AUTHOR_LINKEDIN = "linkedin.com/in/pganeshkrishnareddy";
export const AUTHOR_GITHUB = "github.com/ganeshkrishnareddy";
export const AUTHOR_PORTFOLIO = "pganeshkrishnareddy.netlify.app";

export const INITIAL_STATS: TrafficStats = {
  totalPackets: 12450,
  maliciousPackets: 142,
  bytesTransferred: 450210, // in MB
  activeThreats: 3,
};

// Features used for SHAP visualization simulation
export const IDS_FEATURES = [
  'duration',
  'src_bytes',
  'dst_bytes',
  'wrong_fragment',
  'urgent',
  'hot',
  'num_failed_logins',
  'num_compromised',
  'su_attempted',
  'num_root',
  'num_file_creations',
];