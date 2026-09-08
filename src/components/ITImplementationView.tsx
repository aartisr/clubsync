import React from 'react';
import { IT_STEPS } from '../data/itGuideData';
import { SchoolConfig } from '../types';
import { 
  ShieldCheck, 
  Clock, 
  User, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  Terminal,
  FileText,
  Lock
} from 'lucide-react';

interface ITImplementationViewProps {
  config: SchoolConfig;
}

export const ITImplementationView: React.FC<ITImplementationViewProps> = ({ config }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Section */}
      <header className="border-b-2 border-slate-900 pb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-emerald-600 text-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest">
            Implementation Blueprint
          </span>
          <span className="text-xs text-slate-400 font-mono font-bold uppercase tracking-tight">
            Institutional Deployment Guide
          </span>
        </div>
        <h1 className="text-3xl font-black tracking-tighter uppercase text-slate-900">
          IT Department Implementation Guide
        </h1>
        <p className="text-slate-600 font-medium text-sm mt-2 max-w-2xl leading-relaxed">
          Definitive, zero-trial-and-error steps to move from legacy manual management to an automated, 
          FERPA-compliant GitHub Education ecosystem for <span className="font-bold text-slate-900">{config.schoolName}</span>.
        </p>
      </header>

      {/* Summary Stat Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 p-4 flex items-center gap-4">
          <div className="bg-blue-50 p-2 text-blue-600">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active Effort</span>
            <span className="block text-sm font-black text-slate-900">~45 Minutes Total</span>
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-4 flex items-center gap-4">
          <div className="bg-emerald-50 p-2 text-emerald-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Compliance</span>
            <span className="block text-sm font-black text-slate-900">100% FERPA Ready</span>
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-4 flex items-center gap-4">
          <div className="bg-slate-50 p-2 text-slate-600">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Identity</span>
            <span className="block text-sm font-black text-slate-900">SAML 2.0 (Google)</span>
          </div>
        </div>
      </div>

      {/* Stepper Content */}
      <div className="space-y-12 relative before:absolute before:left-[19px] before:top-2 before:bottom-0 before:w-0.5 before:bg-slate-200">
        {IT_STEPS.map((step, idx) => (
          <div key={step.id} className="relative pl-12">
            {/* Step Number Circle */}
            <div className="absolute left-0 top-0 w-10 h-10 bg-slate-900 text-white rounded-none border-4 border-slate-100 flex items-center justify-center font-black text-sm z-10">
              {idx + 1}
            </div>

            <div className="bg-white border border-slate-200 p-6 space-y-4 hover:border-blue-300 transition-colors shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block mb-1">
                    {step.phase} • {step.duration}
                  </span>
                  <h3 className="text-lg font-black uppercase tracking-tight text-slate-900">
                    {step.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 border border-slate-200 shrink-0">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Owner: {step.owner}</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                {step.description.replace('@pioneercss.org', `@${config.domain}`).replace('pioneercss.org', config.domain)}
              </p>

              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Required Actions:</span>
                <ul className="grid grid-cols-1 gap-2">
                  {step.actions.map((action, aIdx) => (
                    <li key={aIdx} className="flex items-start gap-3 bg-slate-50 p-3 border border-slate-200 text-xs font-bold text-slate-800">
                      <ChevronRight className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span>{action.replace('pioneercss.org', config.domain)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="text-[11px] font-bold text-emerald-700">
                  <span className="uppercase text-slate-400 mr-2">Outcome:</span>
                  {step.outcome}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Final Summary Card */}
      <div className="bg-slate-900 text-white p-8 border-l-8 border-emerald-500 shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <Terminal className="w-6 h-6 text-emerald-400" />
          <h3 className="text-xl font-black uppercase tracking-tighter">Implementation Complete</h3>
        </div>
        <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
          Once these four phases are executed, the school will have a zero-cost, maintenance-free software governance platform. 
          IT will never have to touch GitHub again—they simply manage Google Groups as they always have.
        </p>
        <div className="flex flex-wrap gap-4 pt-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            Zero Manual Invites
          </div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            Automatic Deprovisioning
          </div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            Institutional Continuity
          </div>
        </div>
      </div>
    </div>
  );
};
