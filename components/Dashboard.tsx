import React from 'react';
import { TrafficStats, TrafficPoint, Alert } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { AlertCircle, CheckCircle, Shield, Activity, TrendingUp } from 'lucide-react';

interface DashboardProps {
  stats: TrafficStats;
  trafficData: TrafficPoint[];
  recentAlerts: Alert[];
  onViewAlert: (id: string) => void;
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ElementType; color: string; trend?: string }> = ({ title, value, icon: Icon, color, trend }) => (
  <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 p-6 rounded-2xl shadow-xl">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${color} bg-opacity-20`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
      {trend && <span className="text-xs font-mono text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">{trend}</span>}
    </div>
    <p className="text-slate-400 text-sm font-medium">{title}</p>
    <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ stats, trafficData, recentAlerts, onViewAlert }) => {
  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white">Security Overview</h2>
          <p className="text-slate-400 mt-1">Real-time network monitoring and threat detection</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-medium text-emerald-500">System Operational</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Active Threats" 
          value={stats.activeThreats} 
          icon={AlertCircle} 
          color="bg-red-500" 
          trend="+2 since 1h"
        />
        <StatCard 
          title="Safe Traffic (req/s)" 
          value={trafficData[trafficData.length - 1]?.benign || 0} 
          icon={CheckCircle} 
          color="bg-emerald-500" 
        />
        <StatCard 
          title="Total Packets Scanned" 
          value={stats.totalPackets.toLocaleString()} 
          icon={Shield} 
          color="bg-blue-500" 
        />
        <StatCard 
          title="Network Load" 
          value={`${(stats.bytesTransferred / 1024).toFixed(1)} GB`} 
          icon={Activity} 
          color="bg-purple-500" 
          trend="Stable"
        />
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Live Traffic Chart */}
        <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-400" />
              Live Network Traffic
            </h3>
            <span className="text-xs text-slate-500 font-mono">Last 60 seconds</span>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData}>
                <defs>
                  <linearGradient id="colorBenign" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorMalicious" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickMargin={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="benign" stackId="1" stroke="#10b981" fill="url(#colorBenign)" strokeWidth={2} name="Benign Traffic" />
                <Area type="monotone" dataKey="malicious" stackId="2" stroke="#ef4444" fill="url(#colorMalicious)" strokeWidth={2} name="Malicious Packets" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Alerts Feed */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl flex flex-col">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            Recent Alerts
          </h3>
          <div className="flex-1 overflow-y-auto space-y-3 max-h-[300px] pr-2 custom-scrollbar">
            {recentAlerts.length === 0 ? (
              <div className="text-center text-slate-500 py-8">No recent alerts</div>
            ) : (
              recentAlerts.map(alert => (
                <div 
                  key={alert.id} 
                  onClick={() => onViewAlert(alert.id)}
                  className="p-3 bg-slate-900/50 rounded-lg border border-slate-700/50 hover:border-indigo-500/50 cursor-pointer transition-all group"
                >
                  <div className="flex justify-between items-start">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                      alert.severity === 'Critical' ? 'bg-red-500/20 text-red-400' :
                      alert.severity === 'High' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {alert.type}
                    </span>
                    <span className="text-[10px] text-slate-500">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="mt-2 flex justify-between items-end">
                    <div className="text-xs text-slate-400">
                      <p>Src: <span className="text-slate-300 font-mono">{alert.srcIp}</span></p>
                      <p>Dst: <span className="text-slate-300 font-mono">{alert.dstIp}</span></p>
                    </div>
                    <TrendingUp className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 transition-colors" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
