import React, { useState, useEffect } from 'react';
import { Alert } from '../types';
import { getMitigationAdvice } from '../services/geminiService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { BrainCircuit, ShieldCheck, AlertTriangle, ArrowLeft, Terminal, Send, Loader2, ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';

interface ThreatAnalysisProps {
  alert: Alert | null;
  onBack: () => void;
}

const ThreatAnalysis: React.FC<ThreatAnalysisProps> = ({ alert, onBack }) => {
  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [loadingAi, setLoadingAi] = useState(false);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    if (alert) {
      setLoadingAi(true);
      setFeedback(null);
      getMitigationAdvice(alert).then(advice => {
        setAiAnalysis(advice);
        setLoadingAi(false);
      });
    }
  }, [alert]);

  if (!alert) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-500">
        <BrainCircuit className="w-16 h-16 mb-4 opacity-20" />
        <p>Select an alert from the Dashboard or Alerts logs to analyze.</p>
      </div>
    );
  }

  return (
    <div className="p-8 animate-in slide-in-from-right-10 duration-300">
      <button 
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Alert Details & SHAP */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Header Card */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-xl relative overflow-hidden">
            <div className={`absolute top-0 right-0 p-4 opacity-10 ${
              alert.severity === 'Critical' ? 'text-red-500' : 'text-orange-500'
            }`}>
              <AlertTriangle className="w-48 h-48" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-2">
                <span className={`px-3 py-1 rounded-full text-sm font-bold border ${
                   alert.severity === 'Critical' ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-orange-500/20 border-orange-500 text-orange-400'
                }`}>
                  {alert.severity} Severity
                </span>
                <span className="text-slate-400 text-sm font-mono">{alert.id}</span>
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">{alert.type} Detected</h1>
              <p className="text-slate-400 flex items-center gap-4 text-sm">
                <span>Timestamp: {new Date(alert.timestamp).toLocaleString()}</span>
                <span>•</span>
                <span>Protocol: {alert.protocol}</span>
              </p>

              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                  <p className="text-xs text-slate-500 uppercase font-semibold">Source</p>
                  <p className="text-lg text-red-400 font-mono">{alert.srcIp}</p>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                  <p className="text-xs text-slate-500 uppercase font-semibold">Destination</p>
                  <p className="text-lg text-emerald-400 font-mono">{alert.dstIp}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Explainability (SHAP) Chart */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
             <div className="mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <BrainCircuit className="w-6 h-6 text-indigo-400" />
                  Model Explainability (SHAP)
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  Why did the AI flag this? Feature contribution analysis.
                </p>
             </div>
             <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={alert.features} layout="vertical" margin={{ left: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={true} vertical={false} />
                    <XAxis type="number" stroke="#64748b" />
                    <YAxis dataKey="feature" type="category" stroke="#94a3b8" width={100} tick={{fontSize: 12}} />
                    <Tooltip 
                      cursor={{fill: '#1e293b'}}
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
                      formatter={(value: number) => [value.toFixed(4), "Impact Score"]}
                    />
                    <Bar dataKey="contribution" radius={[0, 4, 4, 0]}>
                      {alert.features.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.contribution > 0 ? '#ef4444' : '#10b981'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
             </div>
             <div className="mt-4 flex items-center gap-4 text-xs text-slate-400 justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
                  <span>Increases Risk Score</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-sm"></div>
                  <span>Decreases Risk Score</span>
                </div>
             </div>
          </div>
        </div>

        {/* Right Column: AI Assistant */}
        <div className="lg:col-span-1">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-xl flex flex-col h-full max-h-[800px]">
            <div className="p-6 border-b border-slate-700 bg-gradient-to-r from-indigo-900/20 to-slate-900/20 rounded-t-2xl">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-400" />
                Security Assistant
              </h3>
              <p className="text-xs text-slate-400">Powered by Google Gemini</p>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar font-mono text-sm leading-relaxed">
              {loadingAi ? (
                <div className="flex flex-col items-center justify-center h-48 gap-3">
                  <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                  <p className="text-indigo-300">Analyzing threat vector...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="prose prose-invert prose-sm max-w-none">
                    {/* Rendering simple markdown-like text */}
                    {aiAnalysis.split('\n').map((line, i) => (
                      <p key={i} className={line.startsWith('**') ? 'font-bold text-indigo-300 mt-4 mb-2' : 'text-slate-300 mb-1'}>
                        {line.replace(/\*\*/g, '')}
                      </p>
                    ))}
                  </div>
                  
                  {/* Feedback Mechanism */}
                  <div className="pt-6 mt-6 border-t border-slate-700/50">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-slate-500 font-medium flex items-center gap-2">
                        <MessageSquare className="w-3 h-3" /> Rate this advice
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setFeedback('up')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all border ${
                          feedback === 'up' 
                            ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' 
                            : 'bg-slate-700/30 border-slate-700 text-slate-400 hover:bg-emerald-500/10 hover:text-emerald-300 hover:border-emerald-500/30'
                        }`}
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span className="text-xs">Helpful</span>
                      </button>
                      <button 
                        onClick={() => setFeedback('down')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all border ${
                          feedback === 'down' 
                            ? 'bg-red-500/20 border-red-500/50 text-red-400' 
                            : 'bg-slate-700/30 border-slate-700 text-slate-400 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/30'
                        }`}
                      >
                        <ThumbsDown className="w-4 h-4" />
                        <span className="text-xs">Not Helpful</span>
                      </button>
                    </div>
                    {feedback && (
                      <div className="mt-3 text-center animate-in fade-in slide-in-from-top-1">
                        <p className="text-[10px] text-indigo-400 bg-indigo-500/10 py-1 rounded">
                          Feedback recorded. Used for model fine-tuning.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-700 bg-slate-900/50 rounded-b-2xl">
               <div className="flex gap-2">
                 <div className="flex-1 bg-slate-950 border border-slate-700 rounded-lg flex items-center px-3">
                   <Terminal className="w-4 h-4 text-slate-500 mr-2" />
                   <input 
                    type="text" 
                    placeholder="Ask Gemini about mitigation..." 
                    className="bg-transparent border-none focus:ring-0 text-sm text-white w-full py-2 placeholder-slate-600"
                    disabled={loadingAi}
                   />
                 </div>
                 <button className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-lg transition-colors">
                   <Send className="w-4 h-4" />
                 </button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreatAnalysis;
