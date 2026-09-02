import React, { useState } from 'react';
import { SchoolConfig } from '../types';
import { Settings, X, Check, Sparkles, HelpCircle, Mail, Building, Users } from 'lucide-react';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SchoolConfig;
  onSave: (newConfig: SchoolConfig) => void;
}

export const ConfigModal: React.FC<ConfigModalProps> = ({ isOpen, onClose, config, onSave }) => {
  const [form, setForm] = useState<SchoolConfig>(config);
  const [activeSuggestionField, setActiveSuggestionField] = useState<'admin' | 'robotics' | 'secondary'>('admin');
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  React.useEffect(() => {
    setForm(config);
  }, [config]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  const applyPcssPreset = () => {
    setForm({
      schoolName: 'PCSS II',
      domain: 'pioneercss.org',
      githubOrg: 'pcss2-robotics',
      adminEmail: 'it@pioneercss.org',
      roboticsLeadEmail: 'robotics@pioneercss.org',
      secondaryClubLeadEmail: 'csclub@pioneercss.org'
    });
    setCopiedNotification('Applied PCSS II Recommended Configuration!');
    setTimeout(() => setCopiedNotification(null), 2500);
  };

  const selectEmailOption = (email: string, targetField: 'admin' | 'robotics' | 'secondary') => {
    if (targetField === 'admin') {
      setForm(prev => ({ ...prev, adminEmail: email }));
    } else if (targetField === 'robotics') {
      setForm(prev => ({ ...prev, roboticsLeadEmail: email }));
    } else {
      setForm(prev => ({ ...prev, secondaryClubLeadEmail: email }));
    }
    setCopiedNotification(`Selected ${email}`);
    setTimeout(() => setCopiedNotification(null), 2000);
  };

  const itEmailOptions = [
    { email: 'it@pioneercss.org', label: 'IT Department (Recommended)', desc: 'General IT queue' },
    { email: 'it-support@pioneercss.org', label: 'IT Helpdesk', desc: 'Direct tech ticket pool' },
    { email: 'admin@pioneercss.org', label: 'School Admin', desc: 'School administration office' },
    { email: 'techcoordinator@pioneercss.org', label: 'Tech Coordinator', desc: 'Individual IT staff role' }
  ];

  const roboticsEmailOptions = [
    { email: 'robotics@pioneercss.org', label: 'Robotics Club (Recommended)', desc: 'Primary Google Group alias' },
    { email: 'robotics-lead@pioneercss.org', label: 'Student Team Captain', desc: 'Lead student admin' },
    { email: 'robotics.advisor@pioneercss.org', label: 'Faculty Advisor', desc: 'Teacher / permanent co-owner' },
    { email: 'frc.team@pioneercss.org', label: 'FRC Robotics Team', desc: 'Competition division' }
  ];

  const secondaryClubEmailOptions = [
    { email: 'csclub@pioneercss.org', label: 'Computer Science Club', desc: 'CS Club leads & programmers' },
    { email: 'stem@pioneercss.org', label: 'STEM Alliance', desc: 'Inter-disciplinary STEM students' },
    { email: 'coding@pioneercss.org', label: 'Coding Club', desc: 'Web & app development teams' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
      <div className="w-full max-w-2xl bg-white p-6 shadow-2xl border-2 border-slate-900 space-y-4 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-slate-900">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-800 border border-blue-300">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">School & Identity Settings</h3>
                <span className="bg-blue-600 text-white px-2 py-0.2 text-[9px] font-mono font-bold uppercase">
                  @{form.domain}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Configure target school parameters and recommended email conventions</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1-Click PCSS II Preset Bar */}
        <div className="p-3 bg-blue-50 border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-700 shrink-0" />
            <div>
              <span className="text-xs font-bold text-blue-900 block uppercase tracking-wider">
                PCSS II Standard Configuration Preset
              </span>
              <span className="text-[11px] text-blue-700">
                Instantly applies Pioneer Charter School of Science II settings & @pioneercss.org defaults.
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={applyPcssPreset}
            className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-blue-700 text-white hover:bg-blue-800 border border-blue-900 transition-colors shrink-0 shadow-xs"
          >
            Apply PCSS II Preset
          </button>
        </div>

        {copiedNotification && (
          <div className="p-2 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-mono font-bold text-center flex items-center justify-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>{copiedNotification}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Core Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                School Name
              </label>
              <input
                type="text"
                value={form.schoolName}
                onChange={(e) => setForm({ ...form, schoolName: e.target.value })}
                placeholder="PCSS II"
                className="w-full px-3 py-1.5 text-xs border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                School Domain (@)
              </label>
              <input
                type="text"
                value={form.domain}
                onChange={(e) => setForm({ ...form, domain: e.target.value })}
                placeholder="pioneercss.org"
                className="w-full px-3 py-1.5 text-xs border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white font-mono font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                GitHub Org Slug
              </label>
              <input
                type="text"
                value={form.githubOrg}
                onChange={(e) => setForm({ ...form, githubOrg: e.target.value })}
                placeholder="pcss2-robotics"
                className="w-full px-3 py-1.5 text-xs border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white font-mono"
                required
              />
            </div>
          </div>

          {/* Email Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                  Primary IT Admin Email
                </label>
                <button
                  type="button"
                  onClick={() => setActiveSuggestionField('admin')}
                  className="text-[10px] font-bold text-blue-700 hover:underline uppercase"
                >
                  View Options
                </button>
              </div>
              <input
                type="email"
                value={form.adminEmail}
                onChange={(e) => setForm({ ...form, adminEmail: e.target.value })}
                placeholder="it@pioneercss.org"
                className="w-full px-3 py-1.5 text-xs border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white font-mono"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                  Robotics Lead Email
                </label>
                <button
                  type="button"
                  onClick={() => setActiveSuggestionField('robotics')}
                  className="text-[10px] font-bold text-blue-700 hover:underline uppercase"
                >
                  View Options
                </button>
              </div>
              <input
                type="email"
                value={form.roboticsLeadEmail}
                onChange={(e) => setForm({ ...form, roboticsLeadEmail: e.target.value })}
                placeholder="robotics@pioneercss.org"
                className="w-full px-3 py-1.5 text-xs border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white font-mono"
                required
              />
            </div>
          </div>

          {/* Suggested Email Options Explorer for pioneercss.org */}
          <div className="p-4 bg-slate-50 border border-slate-300 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-700" />
                <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Recommended @{form.domain} Email Options
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setActiveSuggestionField('admin')}
                  className={`px-2 py-0.5 text-[10px] font-bold uppercase transition-colors ${
                    activeSuggestionField === 'admin'
                      ? 'bg-blue-700 text-white'
                      : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  IT Admin
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSuggestionField('robotics')}
                  className={`px-2 py-0.5 text-[10px] font-bold uppercase transition-colors ${
                    activeSuggestionField === 'robotics'
                      ? 'bg-blue-700 text-white'
                      : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  Robotics
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSuggestionField('secondary')}
                  className={`px-2 py-0.5 text-[10px] font-bold uppercase transition-colors ${
                    activeSuggestionField === 'secondary'
                      ? 'bg-blue-700 text-white'
                      : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  CS / STEM
                </button>
              </div>
            </div>

            <p className="text-[11px] text-slate-600 leading-normal">
              Click any option below to auto-populate the corresponding field for <strong>{form.schoolName}</strong>:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(activeSuggestionField === 'admin' ? itEmailOptions : 
                activeSuggestionField === 'robotics' ? roboticsEmailOptions : secondaryClubEmailOptions
              ).map((opt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => selectEmailOption(opt.email, activeSuggestionField)}
                  className="text-left p-2.5 bg-white border border-slate-300 hover:border-blue-600 hover:bg-blue-50/50 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-blue-800 group-hover:text-blue-900">
                      {opt.email}
                    </span>
                    <span className="text-[9px] bg-slate-100 text-slate-600 px-1 py-0.2 font-mono font-bold uppercase border border-slate-200">
                      Click to use
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-800 block mt-0.5">{opt.label}</span>
                  <span className="text-[10px] text-slate-500 block">{opt.desc}</span>
                </button>
              ))}
            </div>

            {/* Plain English Student Format Note */}
            <div className="pt-2 border-t border-slate-200 flex items-start gap-2 text-[11px] text-slate-600">
              <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span>
                <strong>Student Account Convention:</strong> PCSS II students will authenticate using their standard school format (e.g. <code>first.last@{form.domain}</code> or <code>gradyear.flast@{form.domain}</code>). Zero individual password creation needed.
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t-2 border-slate-900">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 border border-blue-400 shadow-xs transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
