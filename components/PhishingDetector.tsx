import React, { useState } from 'react';
import { Search, Globe, ShieldAlert, CheckCircle, AlertTriangle, Loader2, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { checkPhishingUrl, PhishingResult } from '../services/mockDataService';
import { analyzePhishingUrl } from '../services/geminiService';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

const PhishingDetector: React.FC = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PhishingResult | null>(null);
  const [source, setSource] = useState<'AI Real-time' | 'Simulation'>('Simulation');

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    setLoading(true);
    setResult(null);
    try {
      // Try Real AI first
      const realAnalysis = await analyzePhishingUrl(url);
      
      if (realAnalysis) {
        setSource('AI Real-time');
        setResult({
          url,
          isSafe: realAnalysis.isSafe,
          score: realAnalysis.score,
          threats: realAnalysis.threats,
          details: realAnalysis.details
        });
      } else {
        // Fallback to Mock
        setSource('Simulation');
        const data = await checkPhishingUrl(url);
        setResult(data);
      }
    } catch (err) {
      console.error(err);
      // Fallback to Mock on error
      setSource('Simulation');
      const data = await checkPhishingUrl(url);
      setResult(data);
    } finally {
      setLoading(false);
    }
  };

  const scoreData = result ? [
    { name: 'Safety Score', value: result.score },
    { name: 'Risk', value: 100 - result.score }
  ] : [];

  return (
    <div className="p-8 animate-in fade-in space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
          <Globe className="w-8 h-8 text-indigo-400" />
          Phishing URL Detector
        </h2>
        <p className="text-slate-400 mt-2">Analyze suspicious URLs using Generative AI and Google Search Grounding (Scamadviser-style analysis).</p>
      </div>

      {/* Search Input */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-xl">
        <form onSubmit={handleScan} className="flex gap-4">
          <div className="flex-1 relative">
            <LinkIcon className="absolute left-4 top-4 w-5 h-5 text-slate-500" />
            <input 
              type="url" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL to scan (e.g., http://suspicious-login.com)..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 rounded-xl transition-all shadow-lg shadow-indigo-900/30 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            Scan URL
          </button>
        </form>
      </div>

      {/* Results Section */}
      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-4 duration-500">
          
          {/* Main Status Card */}
          <div className={`lg:col-span-2 border rounded-2xl p-8 relative overflow-hidden flex flex-col justify-between ${
            result.isSafe ? 'bg-emerald-950/30 border-emerald-500/30' : 'bg-red-950/30 border-red-500/30'
          }`}>
            <div className="absolute top-4 right-4 text-[10px] font-mono text-slate-500 bg-slate-900/50 px-2 py-1 rounded border border-slate-800">
              SOURCE: {source.toUpperCase()}
            </div>

            <div className="relative z-10">
               <div className="flex items-center gap-3 mb-4">
                  {result.isSafe ? (
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-emerald-400" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                      <ShieldAlert className="w-6 h-6 text-red-400" />
                    </div>
                  )}
                  <div>
                    <h3 className={`text-2xl font-bold ${result.isSafe ? 'text-emerald-400' : 'text-red-400'}`}>
                      {result.isSafe ? 'Safe URL Detected' : 'Phishing Threat Detected'}
                    </h3>
                    <p className="text-slate-400 text-sm font-mono break-all">{result.url}</p>
                  </div>
               </div>
               
               {(!result.isSafe || result.threats.length > 0) && (
                 <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
                   <h4 className="text-red-400 font-semibold mb-2 flex items-center gap-2">
                     <AlertTriangle className="w-4 h-4" /> Threat Indicators
                   </h4>
                   <ul className="list-disc list-inside text-slate-300 space-y-1 text-sm">
                     {result.threats.map((threat, idx) => (
                       <li key={idx}>{threat}</li>
                     ))}
                   </ul>
                 </div>
               )}

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.details.map((detail, idx) => (
                    <div key={idx} className="bg-slate-900/60 p-4 rounded-lg border border-slate-700/50">
                      <p className="text-xs text-slate-500 uppercase font-semibold">{detail.label}</p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-slate-200 font-medium text-sm">{detail.value}</span>
                        <div className={`w-2 h-2 rounded-full ${
                          detail.status === 'good' ? 'bg-emerald-500' : 
                          detail.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                        }`} />
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          {/* Score Card */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center relative">
            <h3 className="text-lg font-bold text-white mb-4">Trust Score</h3>
            <div className="w-full h-[200px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={scoreData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                  >
                    <Cell fill={result.isSafe ? '#10b981' : '#ef4444'} />
                    <Cell fill="#1e293b" />
                  </Pie>
                  <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className={`text-3xl font-bold ${result.isSafe ? 'text-emerald-400' : 'text-red-400'}`}>
                  {result.score}/100
                </span>
                <span className="text-xs text-slate-500 uppercase">Trust Score</span>
              </div>
            </div>
            
            <a 
              href={result.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`mt-6 flex items-center gap-2 text-sm ${result.isSafe ? 'text-indigo-400 hover:text-indigo-300' : 'text-red-400 hover:text-red-300'} transition-colors`}
              onClick={(e) => !result.isSafe && !window.confirm("This link is marked as unsafe. Are you sure you want to proceed?") && e.preventDefault()}
            >
              Visit Site <ExternalLink className="w-4 h-4" />
            </a>
          </div>

        </div>
      )}
    </div>
  );
};

export default PhishingDetector;
