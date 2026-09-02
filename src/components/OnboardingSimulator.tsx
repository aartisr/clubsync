import React, { useState } from 'react';
import { SchoolConfig, SimulationUser } from '../types';
import { DEFAULT_CLUBS } from '../data/permissionMatrixData';
import { 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  UserPlus, 
  Mail, 
  Users, 
  ShieldCheck, 
  ArrowRight,
  Terminal
} from 'lucide-react';

interface OnboardingSimulatorProps {
  config: SchoolConfig;
}

export const OnboardingSimulator: React.FC<OnboardingSimulatorProps> = ({ config }) => {
  const [studentName, setStudentName] = useState<string>('Alex Chen');
  const [studentEmail, setStudentEmail] = useState<string>(`alex.chen26@${config.domain}`);
  const [primaryClubId, setPrimaryClubId] = useState<string>('robotics');
  const [selectedGroups, setSelectedGroups] = useState<string[]>([
    `robotics-software@${config.domain}`,
    `cross-club-robotics-cs@${config.domain}`
  ]);

  const [simUser, setSimUser] = useState<SimulationUser | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const primaryClub = DEFAULT_CLUBS.find(c => c.id === primaryClubId) || DEFAULT_CLUBS[0];

  const handleGroupToggle = (groupEmail: string) => {
    if (selectedGroups.includes(groupEmail)) {
      setSelectedGroups(selectedGroups.filter(g => g !== groupEmail));
    } else {
      setSelectedGroups([...selectedGroups, groupEmail]);
    }
  };

  const runSimulation = () => {
    setIsSimulating(true);

    const initialUser: SimulationUser = {
      id: `sim-${Date.now()}`,
      name: studentName,
      email: studentEmail,
      primaryClub: primaryClub.name,
      secondaryClubs: selectedGroups.map(g => g.split('@')[0]),
      selectedGroups: [...selectedGroups],
      status: 'idle',
      auditLogs: []
    };

    setSimUser(initialUser);

    // Step 1: Assign Google Workspace Groups
    setTimeout(() => {
      setSimUser(prev => prev ? {
        ...prev,
        status: 'groups_assigned',
        auditLogs: [
          ...prev.auditLogs,
          { timestamp: new Date().toLocaleTimeString(), step: 'Google Groups API', status: 'success', message: `Added ${studentEmail} to ${selectedGroups.length} Google Groups.` }
        ]
      } : null);
    }, 1000);

    // Step 2: Webhook Event Dispatched
    setTimeout(() => {
      setSimUser(prev => prev ? {
        ...prev,
        status: 'webhook_dispatched',
        auditLogs: [
          ...prev.auditLogs,
          { timestamp: new Date().toLocaleTimeString(), step: 'Directory Webhook', status: 'info', message: `Google Admin SDK emitted USER_GROUP_ADD event to ClubSync Engine.` }
        ]
      } : null);
    }, 2200);

    // Step 3: GitHub Org & Team Invitation
    setTimeout(() => {
      setSimUser(prev => prev ? {
        ...prev,
        status: 'github_invited',
        auditLogs: [
          ...prev.auditLogs,
          { timestamp: new Date().toLocaleTimeString(), step: 'GitHub Teams API', status: 'success', message: `Invited ${studentEmail.split('@')[0]} to GitHub Teams: ${selectedGroups.map(g => g.split('@')[0]).join(', ')}.` }
        ]
      } : null);
    }, 3500);

    // Step 4: Completed
    setTimeout(() => {
      setSimUser(prev => prev ? {
        ...prev,
        status: 'completed',
        auditLogs: [
          ...prev.auditLogs,
          { timestamp: new Date().toLocaleTimeString(), step: 'Completion & Email', status: 'success', message: `Welcome email dispatched. Access granted to repositories.` }
        ]
      } : null);
      setIsSimulating(false);
    }, 4500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Geometric Balance Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-2 border-slate-900 pb-4 mb-2 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-blue-600 text-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest">
              Simulation Sandbox
            </span>
            <span className="text-xs text-slate-400 font-mono font-bold">DIRECTORY SYNC & PROVISIONING</span>
          </div>
          <h1 className="text-3xl font-black tracking-tighter uppercase text-slate-900">
            Student Onboarding Simulator
          </h1>
          <p className="text-slate-500 font-medium text-xs sm:text-sm mt-1">
            Simulate a student joining Google Workspace Groups and inspect automated GitHub Organization provisioning.
          </p>
        </div>

        <button
          onClick={runSimulation}
          disabled={isSimulating}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 border border-blue-400 transition-colors shadow-xs"
        >
          <Play className="w-3.5 h-3.5" />
          <span>{isSimulating ? 'Simulating Workflow...' : 'Run Simulation'}</span>
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Registration Form Controls */}
        <div className="lg:col-span-1 bg-white border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-800 border-l-4 border-blue-800 pl-2">
              Student Registration Input
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                Student Full Name
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                School Google Email (@{config.domain})
              </label>
              <input
                type="email"
                value={studentEmail}
                onChange={(e) => setStudentEmail(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                Primary Club
              </label>
              <select
                value={primaryClubId}
                onChange={(e) => setPrimaryClubId(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              >
                {DEFAULT_CLUBS.map(club => (
                  <option key={club.id} value={club.id}>{club.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-200">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                Google Workspace Groups to Assign:
              </label>
              <div className="space-y-2">
                {primaryClub.teams.map(team => (
                  <label key={team.id} className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 p-2 border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedGroups.includes(team.googleGroup)}
                      onChange={() => handleGroupToggle(team.googleGroup)}
                      className="border-slate-300 text-blue-600 focus:ring-0"
                    />
                    <span className="font-mono text-[11px] font-bold">{team.googleGroup}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Live Simulation Output & Audit Logs */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Status Tracker */}
          <div className="bg-slate-900 text-white p-6 border border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 border-l-4 border-blue-500 pl-2">
                  Execution State Machine
                </h3>
              </div>
              <span className={`text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 font-bold ${
                simUser?.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                isSimulating ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}>
                {simUser?.status || 'Idle / Ready'}
              </span>
            </div>

            {/* Step Indicators */}
            <div className="grid grid-cols-4 gap-2 py-2">
              {[
                { label: 'Google Groups', key: 'groups_assigned' },
                { label: 'Directory Webhook', key: 'webhook_dispatched' },
                { label: 'GitHub Invites', key: 'github_invited' },
                { label: 'Sync Complete', key: 'completed' }
              ].map((step, idx) => {
                const isPassed = simUser && (
                  simUser.status === 'completed' ||
                  (step.key === 'groups_assigned' && ['groups_assigned', 'webhook_dispatched', 'github_invited'].includes(simUser.status)) ||
                  (step.key === 'webhook_dispatched' && ['webhook_dispatched', 'github_invited'].includes(simUser.status)) ||
                  (step.key === 'github_invited' && ['github_invited'].includes(simUser.status))
                );

                return (
                  <div key={idx} className={`p-2.5 border text-center transition-all ${
                    isPassed
                      ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 text-slate-500'
                  }`}>
                    <span className="text-[9px] font-mono font-bold block mb-1">STEP {idx + 1}</span>
                    <span className="text-xs font-bold uppercase tracking-wide block">{step.label}</span>
                  </div>
                );
              })}
            </div>

            {/* Audit Trail Log Stream */}
            <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Live Audit Log Stream:</span>
              <div className="bg-slate-950 p-4 border border-slate-800 font-mono text-xs space-y-2 max-h-48 overflow-y-auto">
                {simUser?.auditLogs.length ? (
                  simUser.auditLogs.map((log, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-slate-500 text-[10px]">{log.timestamp}</span>
                      <span className="text-blue-400 font-bold">[{log.step}]</span>
                      <span className="text-slate-200">{log.message}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-slate-500 text-center py-4 font-mono text-xs">
                    Ready. Click "Run Simulation" above to execute test onboarding pipeline.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
