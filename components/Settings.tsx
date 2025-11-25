import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, Bell, Shield, Server, Key, RefreshCw, ToggleLeft, ToggleRight } from 'lucide-react';

const Settings: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState({
    notifications: {
      email: true,
      slack: false,
      adminEmail: 'admin@sentinel.ai',
      slackWebhook: 'https://hooks.slack.com/services/...'
    },
    detection: {
      sensitivity: 'High',
      autoBlock: true,
      confidenceThreshold: 85,
    },
    system: {
      apiKey: '**********************',
      updateFrequency: 5,
      theme: 'Dark'
    }
  });

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Logic to save config would go here
      alert("Configuration saved successfully!");
    }, 1000);
  };

  const Toggle = ({ active, onClick }: { active: boolean; onClick: () => void }) => (
    <button onClick={onClick} className={`transition-colors ${active ? 'text-indigo-500' : 'text-slate-600'}`}>
      {active ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
    </button>
  );

  return (
    <div className="p-8 animate-in fade-in space-y-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center border-b border-slate-800 pb-6">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 text-indigo-400" />
            System Configuration
          </h2>
          <p className="text-slate-400 mt-2">Manage IDS sensitivity, notification channels, and system preferences.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-2 rounded-xl transition-all shadow-lg shadow-indigo-900/30 flex items-center gap-2"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Detection Settings */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <Shield className="w-5 h-5 text-red-400" />
            </div>
            <h3 className="text-lg font-bold text-white">Detection Engine</h3>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Sensitivity Level</label>
              <select 
                value={config.detection.sensitivity}
                onChange={(e) => setConfig({...config, detection: {...config.detection, sensitivity: e.target.value}})}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-indigo-500"
              >
                <option>Low (Fewer False Positives)</option>
                <option>Medium (Balanced)</option>
                <option>High (Maximum Security)</option>
              </select>
            </div>

            <div>
               <div className="flex justify-between items-center mb-2">
                 <label className="text-sm font-medium text-slate-400">Confidence Threshold</label>
                 <span className="text-indigo-400 font-bold">{config.detection.confidenceThreshold}%</span>
               </div>
               <input 
                 type="range" 
                 min="50" 
                 max="99" 
                 value={config.detection.confidenceThreshold}
                 onChange={(e) => setConfig({...config, detection: {...config.detection, confidenceThreshold: parseInt(e.target.value)}})}
                 className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
               />
               <p className="text-xs text-slate-500 mt-1">Alerts below this confidence score will be logged but not notified.</p>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
              <div>
                <span className="block text-sm font-medium text-slate-200">Auto-Block Malicious IPs</span>
                <span className="text-xs text-slate-500">Automatically update firewall rules for Critical threats.</span>
              </div>
              <Toggle 
                active={config.detection.autoBlock} 
                onClick={() => setConfig({...config, detection: {...config.detection, autoBlock: !config.detection.autoBlock}})} 
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Bell className="w-5 h-5 text-yellow-400" />
            </div>
            <h3 className="text-lg font-bold text-white">Notifications</h3>
          </div>
          
          <div className="space-y-6">
             <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-300">Email Alerts</span>
                <Toggle 
                  active={config.notifications.email} 
                  onClick={() => setConfig({...config, notifications: {...config.notifications, email: !config.notifications.email}})} 
                />
             </div>
             {config.notifications.email && (
               <input 
                 type="email" 
                 value={config.notifications.adminEmail}
                 onChange={(e) => setConfig({...config, notifications: {...config.notifications, adminEmail: e.target.value}})}
                 className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-white text-sm focus:outline-none focus:border-indigo-500"
               />
             )}

             <div className="border-t border-slate-700 pt-4">
               <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-300">Slack Integration</span>
                  <Toggle 
                    active={config.notifications.slack} 
                    onClick={() => setConfig({...config, notifications: {...config.notifications, slack: !config.notifications.slack}})} 
                  />
               </div>
               {config.notifications.slack && (
                 <input 
                   type="text" 
                   value={config.notifications.slackWebhook}
                   onChange={(e) => setConfig({...config, notifications: {...config.notifications, slackWebhook: e.target.value}})}
                   className="w-full mt-3 bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-white text-sm focus:outline-none focus:border-indigo-500 font-mono"
                 />
               )}
             </div>
          </div>
        </div>

        {/* API & System */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl md:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Server className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-lg font-bold text-white">API & System</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
               <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
                 <Key className="w-4 h-4" /> Gemini API Key
               </label>
               <input 
                 type="password" 
                 value={config.system.apiKey}
                 disabled
                 className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-slate-500 text-sm focus:outline-none cursor-not-allowed"
               />
               <p className="text-xs text-slate-600 mt-1">Managed via environment variables (secure).</p>
            </div>
            
            <div>
               <label className="block text-sm font-medium text-slate-400 mb-2">Dashboard Refresh Rate</label>
               <div className="flex items-center gap-4">
                 <input 
                   type="range" 
                   min="1" 
                   max="60" 
                   value={config.system.updateFrequency}
                   onChange={(e) => setConfig({...config, system: {...config.system, updateFrequency: parseInt(e.target.value)}})}
                   className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                 />
                 <span className="text-white font-mono">{config.system.updateFrequency}s</span>
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;