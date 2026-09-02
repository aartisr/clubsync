import React, { useState } from 'react';
import { HANDOVER_STEPS } from '../data/handoverData';
import { HandoverStep, SchoolConfig } from '../types';
import { 
  GraduationCap, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ShieldCheck, 
  Printer, 
  FileCheck, 
  Key, 
  Users, 
  UserCheck, 
  ArrowRight,
  Code2
} from 'lucide-react';

interface HandoverWizardViewProps {
  config: SchoolConfig;
}

export const HandoverWizardView: React.FC<HandoverWizardViewProps> = ({ config }) => {
  const [steps, setSteps] = useState<HandoverStep[]>(HANDOVER_STEPS);
  const [incomingLeadName, setIncomingLeadName] = useState<string>('Jordan Lee');
  const [incomingLeadEmail, setIncomingLeadEmail] = useState<string>(`jordan.lee27@${config.domain}`);

  const handleStatusChange = (stepId: string, newStatus: HandoverStep['status']) => {
    setSteps(steps.map(s => s.id === stepId ? { ...s, status: newStatus } : s));
  };

  const completedCount = steps.filter(s => s.status === 'completed' || s.status === 'verified').length;
  const progressPct = Math.round((completedCount / steps.length) * 100);

  const generateAlumniScript = () => {
    return `#!/usr/bin/env bash
# ==============================================================================
# ClubSync - Graduation Alumni Transition & Leadership Handover Script
# Target School Org: ${config.githubOrg}
# Target Domain: ${config.domain}
# ==============================================================================

set -euo pipefail

OUTGOING_ADMIN="${config.roboticsLeadEmail.split('@')[0]}"
INCOMING_ADMIN="${incomingLeadEmail.split('@')[0]}"
ORG="${config.githubOrg}"

echo "🎓 Executing Graduation Leadership Transition..."

# 1. Elevate Incoming Lead in Google Workspace & GitHub
echo "1. Elevating Incoming Lead ($INCOMING_ADMIN) to Org Owner..."
gh api -X PUT "/orgs/$ORG/memberships/$INCOMING_ADMIN" -f role="admin"

# 2. Add Incoming Lead to Robotics Executive Group & Team
echo "2. Adding $INCOMING_ADMIN to robotics-leads team..."
gh api -X PUT "/orgs/$ORG/teams/robotics-leads/memberships/$INCOMING_ADMIN" -f role="maintainer"

# 3. Demote Outgoing Admin to Alumni Status
echo "3. Transitioning Outgoing Admin ($OUTGOING_ADMIN) to Alumni Status..."
gh api -X PUT "/orgs/$ORG/memberships/$OUTGOING_ADMIN" -f role="member"

echo "✅ Leadership Transition Completed Successfully!"
`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Geometric Balance Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-2 border-slate-900 pb-4 mb-2 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-rose-700 text-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest">
              Graduation Protocol
            </span>
            <span className="text-xs text-slate-400 font-mono font-bold">SUCCESSION & CONTINUITY</span>
          </div>
          <h1 className="text-3xl font-black tracking-tighter uppercase text-slate-900">
            Graduation Leadership Handover
          </h1>
          <p className="text-slate-500 font-medium text-xs sm:text-sm mt-1">
            Step-by-step verification and automated scripts to safely transfer GitHub Organization rights before graduation.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-colors shadow-xs"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Export Handover Record</span>
        </button>
      </header>

      {/* Progress Banner */}
      <div className="bg-slate-900 p-6 text-white shadow-sm border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-widest">
              Transition Countdown Progress
            </span>
            <h3 className="text-xl font-black uppercase tracking-tight text-white">
              {progressPct}% Completed ({completedCount}/{steps.length} Steps Verified)
            </h3>
          </div>
          <div className="flex items-center gap-2 bg-slate-950 p-3 border border-slate-800">
            <UserCheck className="w-5 h-5 text-emerald-400" />
            <div className="text-left">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Current Admin</span>
              <span className="text-xs font-mono font-bold text-white">{config.roboticsLeadEmail}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-950 h-3 overflow-hidden p-0.5 border border-slate-700">
          <div 
            className="bg-rose-600 h-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Successor Inputs & Script Generator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Successor Input Form */}
        <div className="lg:col-span-1 bg-white border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-800 border-l-4 border-blue-800 pl-2">
              Nominate Successor Lead
            </h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                Incoming Lead Name
              </label>
              <input
                type="text"
                value={incomingLeadName}
                onChange={(e) => setIncomingLeadName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                Incoming Lead Email (@{config.domain})
              </label>
              <input
                type="email"
                value={incomingLeadEmail}
                onChange={(e) => setIncomingLeadEmail(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white font-mono"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Generated Demotion Script:</span>
            <pre className="bg-slate-950 p-3 text-[10px] font-mono text-emerald-400 overflow-x-auto max-h-48 border border-slate-800">
              <code>{generateAlumniScript()}</code>
            </pre>
          </div>
        </div>

        {/* Step-by-Step Checklist */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-blue-800 border-l-4 border-blue-800 pl-2">
            Handover Tasks & Verification Protocol
          </h3>

          <div className="space-y-3">
            {steps.map(step => (
              <div
                key={step.id}
                className="bg-white border border-slate-200 p-5 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 text-[9px] font-mono uppercase font-bold bg-slate-100 text-slate-700 border border-slate-300">
                        {step.category}
                      </span>
                      {step.requiredForGraduation && (
                        <span className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase bg-rose-100 text-rose-800 border border-rose-300">
                          Mandatory
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-black uppercase tracking-tight text-slate-900 mt-1">
                      {step.title}
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  <select
                    value={step.status}
                    onChange={(e) => handleStatusChange(step.id, e.target.value as any)}
                    className={`px-2.5 py-1 text-xs font-mono font-bold uppercase border focus:outline-none ${
                      step.status === 'completed' || step.status === 'verified' ? 'bg-emerald-100 text-emerald-800 border-emerald-400' :
                      step.status === 'in_progress' ? 'bg-amber-100 text-amber-800 border-amber-400' :
                      'bg-slate-100 text-slate-700 border-slate-300'
                    }`}
                  >
                    <option value="pending">pending</option>
                    <option value="in_progress">in_progress</option>
                    <option value="completed">completed</option>
                    <option value="verified">verified</option>
                  </select>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 text-xs text-slate-700">
                  <span className="font-bold uppercase tracking-wider text-[10px] text-slate-500 block mb-0.5">Verification Method: </span>
                  {step.verificationInstructions}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
