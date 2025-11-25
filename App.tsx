import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ThreatAnalysis from './components/ThreatAnalysis';
import Login from './components/Login';
import Settings from './components/Settings';
import PhishingDetector from './components/PhishingDetector';
import { Alert, TrafficStats, TrafficPoint } from './types';
import { generateMockAlert, generateTrafficPoint } from './services/mockDataService';
import { INITIAL_STATS } from './constants';
import { List, Search, Filter } from 'lucide-react';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  
  // Data State
  const [stats, setStats] = useState<TrafficStats>(INITIAL_STATS);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [trafficData, setTrafficData] = useState<TrafficPoint[]>([]);
  
  // Refs for intervals to clear them cleanly
  const trafficInterval = useRef<NodeJS.Timeout | null>(null);

  // Simulation Logic
  useEffect(() => {
    // Initial Traffic Data
    const initialTraffic = Array.from({ length: 20 }, () => generateTrafficPoint(10));
    setTrafficData(initialTraffic);

    // Only start simulation if logged in
    if (!isLoggedIn) return;

    trafficInterval.current = setInterval(() => {
      setTrafficData(prev => {
        const lastMalicious = prev[prev.length - 1]?.malicious || 10;
        const newPoint = generateTrafficPoint(lastMalicious);
        const newData = [...prev.slice(1), newPoint];
        return newData;
      });

      // Stats Update
      setStats(prev => ({
        ...prev,
        totalPackets: prev.totalPackets + Math.floor(Math.random() * 50),
        bytesTransferred: prev.bytesTransferred + (Math.random() * 0.5),
      }));

      // Random Alert Generation
      const newAlert = generateMockAlert();
      if (newAlert) {
        setAlerts(prev => [newAlert, ...prev].slice(0, 50)); // Keep last 50
        setStats(prev => ({
           ...prev,
           maliciousPackets: prev.maliciousPackets + 1,
           activeThreats: prev.activeThreats + 1
        }));
      }

    }, 2000); // Update every 2 seconds

    return () => {
      if (trafficInterval.current) clearInterval(trafficInterval.current);
    };
  }, [isLoggedIn]);

  const handleViewAlert = (id: string) => {
    const alert = alerts.find(a => a.id === id);
    if (alert) {
      setSelectedAlert(alert);
      setActiveTab('analysis');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveTab('dashboard');
    setAlerts([]); // Optional: clear session data
  };

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard stats={stats} trafficData={trafficData} recentAlerts={alerts.slice(0, 6)} onViewAlert={handleViewAlert} />;
      case 'analysis':
        return <ThreatAnalysis alert={selectedAlert} onBack={() => setActiveTab('dashboard')} />;
      case 'phishing':
        return <PhishingDetector />;
      case 'settings':
        return <Settings />;
      case 'alerts':
        return (
          <div className="p-8 animate-in fade-in">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Alert Logs</h2>
                <div className="flex gap-2">
                   <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                      <input className="bg-slate-800 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500" placeholder="Search IP or Type..." />
                   </div>
                   <button className="p-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-400 hover:text-white">
                      <Filter className="w-5 h-5" />
                   </button>
                </div>
             </div>
             <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
               <table className="w-full text-left border-collapse">
                 <thead className="bg-slate-900/50 text-slate-400 text-xs uppercase font-semibold">
                   <tr>
                     <th className="p-4">Timestamp</th>
                     <th className="p-4">Type</th>
                     <th className="p-4">Source IP</th>
                     <th className="p-4">Target IP</th>
                     <th className="p-4">Confidence</th>
                     <th className="p-4">Severity</th>
                     <th className="p-4">Action</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-700 text-sm text-slate-300">
                   {alerts.map(alert => (
                     <tr key={alert.id} className="hover:bg-slate-700/30 transition-colors">
                       <td className="p-4 font-mono text-xs">{new Date(alert.timestamp).toLocaleTimeString()}</td>
                       <td className="p-4">{alert.type}</td>
                       <td className="p-4 font-mono text-slate-400">{alert.srcIp}</td>
                       <td className="p-4 font-mono text-slate-400">{alert.dstIp}</td>
                       <td className="p-4">
                          <div className="flex items-center gap-2">
                             <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500" style={{ width: `${alert.confidence * 100}%` }}></div>
                             </div>
                             <span className="text-xs">{(alert.confidence * 100).toFixed(0)}%</span>
                          </div>
                       </td>
                       <td className="p-4">
                         <span className={`px-2 py-1 rounded text-xs font-bold ${
                            alert.severity === 'Critical' ? 'bg-red-500/20 text-red-400' :
                            alert.severity === 'High' ? 'bg-orange-500/20 text-orange-400' :
                            'bg-yellow-500/20 text-yellow-400'
                         }`}>
                           {alert.severity}
                         </span>
                       </td>
                       <td className="p-4">
                         <button onClick={() => handleViewAlert(alert.id)} className="text-indigo-400 hover:text-indigo-300 hover:underline">Analyze</button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
               {alerts.length === 0 && <div className="p-8 text-center text-slate-500">No logs generated yet. Waiting for traffic...</div>}
             </div>
          </div>
        );
      default:
        return <div className="p-8 text-slate-500">Module under development.</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      <main className="ml-64 flex-1 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950/0 to-slate-950/0 pointer-events-none"></div>
        {renderContent()}
      </main>
    </div>
  );
};

export default App;