import React from 'react';
import { User, Mail, Phone, Linkedin, Github, Globe, Award, BookOpen, Code, Terminal, Trophy, MapPin } from 'lucide-react';
import { AUTHOR_NAME, AUTHOR_EMAIL, AUTHOR_CONTACT, AUTHOR_LINKEDIN, AUTHOR_GITHUB, AUTHOR_PORTFOLIO } from '../constants';

const Developer: React.FC = () => {
  return (
    <div className="p-8 animate-in fade-in space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900/50 to-slate-900 border border-indigo-500/30 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        
        <div className="w-32 h-32 bg-slate-950 rounded-full flex items-center justify-center border-4 border-indigo-500/30 shadow-lg shrink-0">
          <User className="w-16 h-16 text-indigo-400" />
        </div>
        
        <div className="text-center md:text-left flex-1 relative z-10">
          <h1 className="text-4xl font-bold text-white mb-2">{AUTHOR_NAME}</h1>
          <p className="text-indigo-300 text-lg font-medium mb-4">Cybersecurity Engineer & Full-Stack Developer</p>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-3 text-sm text-slate-300">
             <a href={`mailto:${AUTHOR_EMAIL}`} className="flex items-center gap-2 hover:text-white transition-colors bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700 hover:border-indigo-500">
                <Mail className="w-4 h-4" /> {AUTHOR_EMAIL}
             </a>
             <a href={`tel:${AUTHOR_CONTACT}`} className="flex items-center gap-2 hover:text-white transition-colors bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700 hover:border-indigo-500">
                <Phone className="w-4 h-4" /> {AUTHOR_CONTACT}
             </a>
             <a href={`https://${AUTHOR_LINKEDIN}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white transition-colors bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700 hover:border-indigo-500">
                <Linkedin className="w-4 h-4" /> LinkedIn
             </a>
             <a href={`https://${AUTHOR_GITHUB}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white transition-colors bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700 hover:border-indigo-500">
                <Github className="w-4 h-4" /> GitHub
             </a>
             <a href={`https://${AUTHOR_PORTFOLIO}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white transition-colors bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700 hover:border-indigo-500">
                <Globe className="w-4 h-4" /> Portfolio
             </a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Skills & Info */}
        <div className="space-y-8">
           {/* Summary */}
           <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                 <Terminal className="w-5 h-5 text-emerald-400" /> Professional Summary
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed text-justify">
                Motivated and detail-oriented Computer Science undergraduate specializing in backend systems and cybersecurity. Seeking an opportunity to contribute secure, scalable, and efficient backend solutions through hands-on skills in Python, REST APIs, and cloud operations.
              </p>
           </div>

           {/* Skills */}
           <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                 <Code className="w-5 h-5 text-blue-400" /> Technical Skills
              </h3>
              
              <div className="space-y-5">
                <div>
                  <h4 className="text-xs uppercase font-bold text-slate-500 mb-2">Languages</h4>
                  <div className="flex flex-wrap gap-2">
                    {['C', 'C++', 'Python', 'JavaScript', 'Java', 'HTML', 'CSS'].map(s => (
                      <span key={s} className="px-2.5 py-1 bg-slate-900 rounded-md text-xs font-medium text-slate-300 border border-slate-700/50">{s}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs uppercase font-bold text-slate-500 mb-2">Frameworks & Backend</h4>
                  <div className="flex flex-wrap gap-2">
                    {['React.js', 'Node.js', 'Express', 'Flask'].map(s => (
                      <span key={s} className="px-2.5 py-1 bg-slate-900 rounded-md text-xs font-medium text-slate-300 border border-slate-700/50">{s}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs uppercase font-bold text-slate-500 mb-2">Security Tools & Cloud</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Nmap', 'Wireshark', 'Burp Suite', 'Linux (Kali/Ubuntu)', 'AWS', 'Docker'].map(s => (
                      <span key={s} className="px-2.5 py-1 bg-slate-900 rounded-md text-xs font-medium text-slate-300 border border-slate-700/50">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
           </div>
        </div>

        {/* Right Column: Experience & Education */}
        <div className="lg:col-span-2 space-y-8">
           
           {/* Certifications & Achievements */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
                 <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-400" /> Certifications
                 </h3>
                 <ul className="space-y-4">
                   <li className="flex gap-3">
                     <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></div>
                     <div>
                       <p className="text-sm font-semibold text-slate-200">CompTIA Cybersecurity Professional</p>
                       <p className="text-xs text-slate-500 mt-0.5">Network+, Security+, PenTest+, CySA+ (Aug 2025)</p>
                     </div>
                   </li>
                   <li className="flex gap-3">
                     <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></div>
                     <div>
                       <p className="text-sm font-semibold text-slate-200">Digital Forensic Investigator</p>
                       <p className="text-xs text-slate-500 mt-0.5">QuickHeal Certified (Jan 2025)</p>
                     </div>
                   </li>
                 </ul>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
                 <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-orange-400" /> Achievements
                 </h3>
                 <ul className="space-y-4">
                   <li className="flex gap-3">
                     <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></div>
                     <div>
                       <p className="text-sm font-semibold text-slate-200">Reliance Foundation Scholarship</p>
                       <p className="text-xs text-slate-500 mt-0.5">Awarded ₹2,00,000 for academic excellence (Jan 2023)</p>
                     </div>
                   </li>
                   <li className="flex gap-3">
                     <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></div>
                     <div>
                       <p className="text-sm font-semibold text-slate-200">Red Hat Internship</p>
                       <p className="text-xs text-slate-500 mt-0.5">Optimized Linux server performance & security (Jul 2024)</p>
                     </div>
                   </li>
                 </ul>
              </div>
           </div>

           {/* Education */}
           <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                 <BookOpen className="w-5 h-5 text-purple-400" /> Education History
              </h3>
              
              <div className="relative border-l border-slate-700 ml-3 space-y-8 pl-8 pb-2">
                
                {/* LPU */}
                <div className="relative group">
                   <div className="absolute -left-[41px] top-1 w-6 h-6 bg-slate-900 border-2 border-indigo-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                     <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                   </div>
                   <div className="flex justify-between items-start flex-wrap gap-2">
                     <div>
                       <h4 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">Lovely Professional University</h4>
                       <p className="text-indigo-300 text-sm font-medium">B.Tech in Computer Science and Engineering</p>
                     </div>
                     <span className="px-2 py-1 bg-slate-900 rounded text-xs text-slate-400 font-mono border border-slate-700">Aug 2022 - Present</span>
                   </div>
                   <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Jalandhar, Punjab</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-medium">CGPA: 7.35 (till 6th Sem)</span>
                   </div>
                </div>

                {/* Narayana Junior College */}
                <div className="relative group">
                   <div className="absolute -left-[41px] top-1 w-6 h-6 bg-slate-900 border-2 border-slate-600 rounded-full group-hover:border-slate-400 transition-colors"></div>
                   <div className="flex justify-between items-start flex-wrap gap-2">
                     <div>
                       <h4 className="text-lg font-bold text-slate-300 group-hover:text-white transition-colors">Narayana Junior College</h4>
                       <p className="text-slate-500 text-sm">Intermediate (12th with Science)</p>
                     </div>
                     <span className="px-2 py-1 bg-slate-900 rounded text-xs text-slate-500 font-mono border border-slate-700">2020 - 2022</span>
                   </div>
                   <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Tirupati, Andhra Pradesh</span>
                      <span>•</span>
                      <span className="text-slate-400">Percentage: 79.4%</span>
                   </div>
                </div>

                {/* Narayana School */}
                <div className="relative group">
                   <div className="absolute -left-[41px] top-1 w-6 h-6 bg-slate-900 border-2 border-slate-600 rounded-full group-hover:border-slate-400 transition-colors"></div>
                   <div className="flex justify-between items-start flex-wrap gap-2">
                     <div>
                       <h4 className="text-lg font-bold text-slate-300 group-hover:text-white transition-colors">Narayana E.M High School</h4>
                       <p className="text-slate-500 text-sm">High School (10th with Science)</p>
                     </div>
                     <span className="px-2 py-1 bg-slate-900 rounded text-xs text-slate-500 font-mono border border-slate-700">2019 - 2020</span>
                   </div>
                   <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Tirupati, Andhra Pradesh</span>
                      <span>•</span>
                      <span className="text-slate-400">Percentage: 98%</span>
                   </div>
                </div>

              </div>
           </div>

        </div>
      </div>
    </div>
  );
};

export default Developer;