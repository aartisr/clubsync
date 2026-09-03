import React from 'react';
import { SchoolConfig } from '../types';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Layers, 
  GraduationCap, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Lock,
  Building
} from 'lucide-react';

interface ExecutiveProblemMatrixProps {
  config: SchoolConfig;
}

export const ExecutiveProblemMatrix: React.FC<ExecutiveProblemMatrixProps> = ({ config }) => {
  const problems = [
    {
      id: 'sprawl',
      title: 'Personal Account Sprawl',
      tag: 'Identity & Access Risk',
      severity: 'HIGH RISK',
      severityColor: 'bg-rose-100 text-rose-800 border-rose-300',
      icon: <ShieldAlert className="w-5 h-5 text-rose-600" />,
      theProblem: `Students currently register for GitHub using unmonitored personal Gmail, Yahoo, or Outlook accounts.`,
      theImpact: `When students leave or transfer, the school has zero legal or technical way to recover access. Repositories and competition software are locked away on personal credentials.`,
      theSolution: `100% SAML Single Sign-On anchored strictly to official @${config.domain} school Google Workspace accounts. Immediate auto-deprovisioning when accounts close.`
    },
    {
      id: 'overprivileged',
      title: 'Over-Privileged Access & Lack of RBAC',
      tag: 'Governance Risk',
      severity: 'HIGH RISK',
      severityColor: 'bg-amber-100 text-amber-800 border-amber-300',
      icon: <Lock className="w-5 h-5 text-amber-600" />,
      theProblem: `Club sponsors grant blanket "Admin" or "Owner" access to students simply because manually configuring granular team roles is complex.`,
      theImpact: `A single accidental click can delete four years of robot firmware, expose private competition strategies, or disable organization security controls.`,
      theSolution: `Strict 5-tier Role-Based Access Control (RBAC). Only faculty advisors hold permanent Co-Owner rights; students receive scoped 'Write' or 'Read' access via synchronized Google Groups.`
    },
    {
      id: 'silos',
      title: 'Club Silos vs. Cross-Club Collaboration',
      tag: 'Innovation Barrier',
      severity: 'MODERATE RISK',
      severityColor: 'bg-blue-100 text-blue-800 border-blue-300',
      icon: <Layers className="w-5 h-5 text-blue-600" />,
      theProblem: `Robotics, Computer Science, and Engineering clubs work in total isolation with zero shared infrastructure.`,
      theImpact: `Students re-invent the wheel every year, writing duplicate computer vision and UI code. Clubs cannot share libraries without dangerously giving away admin keys.`,
      theSolution: `4-Tier Repository Partitioning: Club Internal, Cross-Club Shared Hubs, Shared Assets, and Public Showcases. Enables co-development without security leaks.`
    },
    {
      id: 'abandonment',
      title: 'Graduation Abandonment & Lost Continuity',
      tag: 'Succession Crisis',
      severity: 'CRITICAL RISK',
      severityColor: 'bg-rose-100 text-rose-800 border-rose-300',
      icon: <GraduationCap className="w-5 h-5 text-rose-600" />,
      theProblem: `Senior club captains graduate every June, taking institutional knowledge, private passwords, and code on their personal laptops.`,
      theImpact: `Incoming freshmen and junior leads start from scratch in September. Crucial documentation, robot calibration configs, and grant proposals disappear forever.`,
      theSolution: `Structured 60-Day Handover Protocol with automated elevation scripts, alumni transition workflows, and permanent institutional faculty co-ownership.`
    }
  ];

  return (
    <div className="my-6 bg-slate-50 border-2 border-slate-900 p-5 sm:p-6 space-y-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b-2 border-slate-900 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <h3 className="text-base sm:text-lg font-black uppercase tracking-tight text-slate-900">
              Executive Problem & Risk Matrix for {config.schoolName}
            </h3>
          </div>
          <p className="text-xs text-slate-600 font-medium mt-0.5">
            Addressing the four primary infrastructure vulnerabilities facing PCSS II student clubs today.
          </p>
        </div>
        <span className="text-[10px] font-mono font-bold bg-slate-900 text-white px-2.5 py-1 uppercase tracking-wider shrink-0">
          Management Risk Assessment
        </span>
      </div>

      {/* 4 Issue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {problems.map((item) => (
          <div key={item.id} className="bg-white border-2 border-slate-200 p-4 space-y-3 hover:border-slate-400 transition-colors">
            
            <div className="flex items-start justify-between gap-2 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-slate-100 border border-slate-200">
                  {item.icon}
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">
                    {item.tag}
                  </span>
                  <h4 className="text-xs sm:text-sm font-black uppercase text-slate-900 tracking-tight">
                    {item.title}
                  </h4>
                </div>
              </div>
              <span className={`px-2 py-0.5 text-[10px] font-mono font-bold border uppercase shrink-0 ${item.severityColor}`}>
                {item.severity}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block font-mono">
                  The Vulnerability:
                </span>
                <p className="text-slate-700 leading-snug">
                  {item.theProblem}
                </p>
              </div>

              <div className="space-y-0.5 bg-rose-50/60 p-2 border border-rose-200 text-rose-950">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block font-mono">
                  Consequence to {config.schoolName}:
                </span>
                <p className="text-[11px] leading-snug">
                  {item.theImpact}
                </p>
              </div>

              <div className="space-y-0.5 bg-emerald-50/70 p-2 border border-emerald-300 text-emerald-950">
                <div className="flex items-center gap-1.5 text-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-[10px] font-bold uppercase tracking-wider font-mono">
                    ClubSync Solution:
                  </span>
                </div>
                <p className="text-[11px] leading-snug font-medium">
                  {item.theSolution}
                </p>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};
