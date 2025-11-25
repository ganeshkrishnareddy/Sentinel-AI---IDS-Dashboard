import React from 'react';
import { ShieldAlert, LayoutDashboard, List, Settings, Activity, User, Github, Linkedin, Globe, LogOut } from 'lucide-react';
import { AUTHOR_NAME, AUTHOR_GITHUB, AUTHOR_LINKEDIN } from '../constants';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'alerts', label: 'Alerts Logs', icon: List },
    { id: 'analysis', label: 'Threat Analysis', icon: Activity },
    { id: 'phishing', label: 'Phishing Detector', icon: Globe },
    { id: 'settings', label: 'System Config', icon: Settings },
  ];

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen fixed left-0 top-0 z-50">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <ShieldAlert className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold text-lg text-slate-100 tracking-tight">Sentinel AI</h1>
          <p className="text-xs text-indigo-400 font-mono">IDS v2.0.1 ACTIVE</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              activeTab === item.id
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-slate-800">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-slate-400 hover:bg-red-950/30 hover:text-red-400 transition-colors mb-4"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Sign Out</span>
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
            <User className="w-5 h-5 text-slate-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-200">System Admin</p>
            <p className="text-xs text-emerald-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Online
            </p>
          </div>
        </div>
        
        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
           <p className="text-[10px] uppercase text-slate-500 font-bold mb-2">Project Author</p>
           <p className="text-xs text-indigo-300 font-semibold mb-1">{AUTHOR_NAME}</p>
           <div className="flex gap-2 mt-2">
              <a href={`https://${AUTHOR_GITHUB}`} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors">
                <Github size={14} />
              </a>
              <a href={`https://${AUTHOR_LINKEDIN}`} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors">
                <Linkedin size={14} />
              </a>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;