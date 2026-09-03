import React, { useState } from 'react';
import { DEFAULT_CLUBS, DEFAULT_REPOSITORIES } from '../data/permissionMatrixData';
import { PermissionLevel, RepositorySpec, SchoolConfig } from '../types';
import { 
  ShieldCheck, 
  Plus, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle,
  Lock,
  Layers,
  RotateCcw,
  Info
} from 'lucide-react';

interface PermissionMatrixViewProps {
  config: SchoolConfig;
}

export const PermissionMatrixView: React.FC<PermissionMatrixViewProps> = ({ config }) => {
  const [repositories, setRepositories] = useState<RepositorySpec[]>(DEFAULT_REPOSITORIES);
  const [newRepoName, setNewRepoName] = useState<string>('');
  const [newRepoType, setNewRepoType] = useState<RepositorySpec['type']>('internal');

  // All GitHub Teams across all clubs
  const allTeams = DEFAULT_CLUBS.flatMap(c => c.teams.map(t => ({
    ...t,
    clubName: c.name,
    clubColor: c.color
  })));

  const handlePermissionChange = (repoId: string, teamSlug: string, level: PermissionLevel) => {
    setRepositories(repositories.map(r => {
      if (r.id === repoId) {
        return {
          ...r,
          teamPermissions: {
            ...r.teamPermissions,
            [teamSlug]: level
          }
        };
      }
      return r;
    }));
  };

  const handleAddRepository = () => {
    if (!newRepoName.trim()) return;
    const cleanName = newRepoName.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const newRepo: RepositorySpec = {
      id: cleanName,
      name: cleanName,
      clubOwnerId: 'robotics',
      type: newRepoType,
      description: `Custom ${config.schoolName} repository`,
      visibility: newRepoType === 'cross-club-public' ? 'public' : 'private',
      teamPermissions: {
        'robotics-leads': 'admin',
        'robotics-software': 'write'
      },
      branchProtection: {
        requirePR: true,
        requiredApprovals: 1,
        dismissStaleApprovals: true,
        requireCodeOwners: true,
        requireStatusChecks: true
      }
    };
    setRepositories([...repositories, newRepo]);
    setNewRepoName('');
  };

  const handleDeleteRepository = (id: string) => {
    setRepositories(repositories.filter(r => r.id !== id));
  };

  const handleResetToPCSS = () => {
    setRepositories(DEFAULT_REPOSITORIES);
  };

  const getBadgeStyle = (level?: PermissionLevel) => {
    switch (level) {
      case 'admin': return 'bg-rose-100 text-rose-800 border-rose-400 font-bold';
      case 'maintain': return 'bg-amber-100 text-amber-800 border-amber-400 font-bold';
      case 'write': return 'bg-emerald-100 text-emerald-800 border-emerald-400 font-bold';
      case 'triage': return 'bg-blue-100 text-blue-800 border-blue-400 font-bold';
      case 'read': return 'bg-slate-100 text-slate-800 border-slate-400 font-bold';
      default: return 'bg-slate-50 text-slate-400 border-slate-200';
    }
  };

  // Calculate Security Risk Score based on Admin permissions density
  const totalAdminCount = repositories.reduce((acc, repo) => {
    return acc + Object.values(repo.teamPermissions).filter(p => p === 'admin').length;
  }, 0);

  const securityScore = Math.max(70, 100 - (totalAdminCount * 2));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Geometric Balance Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-2 border-slate-900 pb-4 mb-2 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-blue-600 text-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest">
              Access Governance
            </span>
            <span className="text-xs text-slate-500 font-mono font-bold uppercase">
              {config.schoolName} • @{config.domain}
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tighter uppercase text-slate-900">
            Granular Permission Matrix
          </h1>
          <p className="text-slate-600 font-medium text-xs sm:text-sm mt-1">
            Interactive partition grid enforcing least-privilege security between {config.schoolName} Robotics, CS, and Cross-Club repositories.
          </p>
        </div>

        {/* Security Score Badge & Reset */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleResetToPCSS}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors shadow-xs"
            title="Reset matrix to standard PCSS II defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset PCSS II Defaults</span>
          </button>

          <div className="flex items-center gap-3 bg-white p-3 border-2 border-slate-900 shadow-xs">
            <div className="p-2 bg-emerald-100 text-emerald-800 border border-emerald-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Audit Score:</span>
                <span className="text-xs font-black text-emerald-700 font-mono">{securityScore}/100</span>
              </div>
              <p className="text-[10px] text-slate-500 font-mono">
                {totalAdminCount} Admins across {repositories.length} repos
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Zero Cognitive Overload: Permission Levels Explainer Legend */}
      <div className="bg-white border-2 border-slate-900 p-4 shadow-xs space-y-2">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5 font-mono">
          <Info className="w-3.5 h-3.5 text-blue-700" />
          Zero Cognitive Overload: What do each of these permissions mean?
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
          <div className="p-2 bg-slate-50 border border-slate-300">
            <span className="font-mono font-bold text-slate-700 text-[11px] block">READ</span>
            <p className="text-[11px] text-slate-600 mt-0.5">Can clone and inspect code. Cannot change or commit code.</p>
          </div>
          <div className="p-2 bg-blue-50 border border-blue-300">
            <span className="font-mono font-bold text-blue-800 text-[11px] block">TRIAGE</span>
            <p className="text-[11px] text-slate-600 mt-0.5">Can manage bug reports, assign milestones, and review PRs.</p>
          </div>
          <div className="p-2 bg-emerald-50 border border-emerald-300">
            <span className="font-mono font-bold text-emerald-800 text-[11px] block">WRITE</span>
            <p className="text-[11px] text-slate-600 mt-0.5">Can push commits to feature branches and create Pull Requests.</p>
          </div>
          <div className="p-2 bg-amber-50 border border-amber-300">
            <span className="font-mono font-bold text-amber-800 text-[11px] block">MAINTAIN</span>
            <p className="text-[11px] text-slate-600 mt-0.5">Can merge PRs into main branch and edit project settings.</p>
          </div>
          <div className="p-2 bg-rose-50 border border-rose-300">
            <span className="font-mono font-bold text-rose-800 text-[11px] block">ADMIN</span>
            <p className="text-[11px] text-slate-600 mt-0.5">Can delete repo, invite external teams, and override branch locks.</p>
          </div>
        </div>
      </div>

      {/* Add Repository Quick Bar */}
      <div className="bg-white p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <input
          type="text"
          value={newRepoName}
          onChange={(e) => setNewRepoName(e.target.value)}
          placeholder="New repository name (e.g. robotics-autonomous-ai)..."
          className="flex-1 px-3.5 py-2 text-xs border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white font-mono"
        />
        <select
          value={newRepoType}
          onChange={(e) => setNewRepoType(e.target.value as any)}
          className="px-3 py-2 text-xs border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white font-bold uppercase tracking-wider"
        >
          <option value="internal">Club Internal (Private)</option>
          <option value="cross-club-private">Cross-Club Private</option>
          <option value="cross-club-public">Cross-Club Public Showcase</option>
          <option value="shared-assets">Shared Asset Template</option>
        </select>
        <button
          onClick={handleAddRepository}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 border border-blue-400 shadow-xs transition-colors whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Add Repository</span>
        </button>
      </div>

      {/* Permission Grid Matrix Table */}
      <div className="bg-white border border-slate-300 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white border-b-2 border-slate-900">
                <th className="p-3 text-[11px] font-bold uppercase tracking-wider min-w-[220px]">
                  Repository Partition
                </th>
                <th className="p-3 text-[11px] font-bold uppercase tracking-wider min-w-[120px]">
                  Type & Visibility
                </th>
                {allTeams.map(team => (
                  <th key={team.id} className="p-3 text-[10px] font-bold uppercase tracking-wider text-center min-w-[130px] border-l border-slate-800">
                    <div className="line-clamp-1">{team.name}</div>
                    <span className="text-[9px] font-mono text-slate-400 block font-normal">{team.clubName}</span>
                  </th>
                ))}
                <th className="p-3 text-center min-w-[60px] text-[11px] font-bold uppercase tracking-wider border-l border-slate-800">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {repositories.map(repo => (
                <tr key={repo.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3">
                    <div className="font-mono font-bold text-slate-900">{repo.name}</div>
                    <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{repo.description}</p>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider border font-bold ${
                      repo.visibility === 'public' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                      repo.type === 'cross-club-private' ? 'bg-purple-100 text-purple-800 border-purple-300' :
                      'bg-slate-100 text-slate-800 border-slate-300'
                    }`}>
                      {repo.visibility} • {repo.type}
                    </span>
                  </td>
                  {allTeams.map(team => {
                    const currentPerm = repo.teamPermissions[team.githubTeamSlug] || 'none';
                    return (
                      <td key={team.id} className="p-2 text-center border-l border-slate-200">
                        <select
                          value={currentPerm}
                          onChange={(e) => handlePermissionChange(repo.id, team.githubTeamSlug, e.target.value as PermissionLevel)}
                          className={`w-full px-1.5 py-1 text-[11px] font-mono uppercase font-bold border focus:outline-none focus:border-blue-600 ${getBadgeStyle(currentPerm)}`}
                        >
                          <option value="none">none</option>
                          <option value="read">read</option>
                          <option value="triage">triage</option>
                          <option value="write">write</option>
                          <option value="maintain">maintain</option>
                          <option value="admin">admin</option>
                        </select>
                      </td>
                    );
                  })}
                  <td className="p-3 text-center border-l border-slate-200">
                    <button
                      onClick={() => handleDeleteRepository(repo.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete Repository"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Plain-English Permission Guide for Leadership & Faculty Advisors */}
      <div className="bg-white border-2 border-slate-900 p-6 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b-2 border-slate-900 gap-2">
          <div>
            <h3 className="text-sm font-black uppercase tracking-tight text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-700" />
              Executive Permission Hierarchy: What Each Level Means for {config.schoolName}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Zero confusion guide for school principals, board members, and faculty sponsors.
            </p>
          </div>
          <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 border border-slate-300 uppercase">
            FERPA Principle of Least Privilege
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-rose-50 border border-rose-200 space-y-1">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 bg-rose-200 text-rose-900 font-mono font-bold text-[10px] uppercase">
                admin
              </span>
              <span className="text-[10px] font-bold text-rose-700 uppercase">Faculty Sponsor & Captain Only</span>
            </div>
            <p className="text-rose-950 text-[11px] leading-snug pt-1">
              Can alter repository privacy, configure branch protections, and adjust settings. Strictly limited to prevent accidental deletion or security changes.
            </p>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 space-y-1">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 bg-amber-200 text-amber-900 font-mono font-bold text-[10px] uppercase">
                maintain
              </span>
              <span className="text-[10px] font-bold text-amber-700 uppercase">Senior Leads</span>
            </div>
            <p className="text-amber-950 text-[11px] leading-snug pt-1">
              Can manage code reviews, merge approved pull requests, and configure continuous integration. Cannot delete repositories or invite outside collaborators.
            </p>
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200 space-y-1">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 bg-emerald-200 text-emerald-900 font-mono font-bold text-[10px] uppercase">
                write
              </span>
              <span className="text-[10px] font-bold text-emerald-700 uppercase">Active Club Members</span>
            </div>
            <p className="text-emerald-950 text-[11px] leading-snug pt-1">
              Can push code to feature branches, open pull requests, and collaborate daily on robot motors, vision models, or club websites.
            </p>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 space-y-1">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 bg-blue-200 text-blue-900 font-mono font-bold text-[10px] uppercase">
                triage
              </span>
              <span className="text-[10px] font-bold text-blue-700 uppercase">Junior Members & Trainees</span>
            </div>
            <p className="text-blue-950 text-[11px] leading-snug pt-1">
              Can review issues, label bug reports, and organize project milestones without any capability to modify live code directly.
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 bg-slate-200 text-slate-800 font-mono font-bold text-[10px] uppercase">
                read
              </span>
              <span className="text-[10px] font-bold text-slate-600 uppercase">General Roster</span>
            </div>
            <p className="text-slate-700 text-[11px] leading-snug pt-1">
              Can view code, clone repositories to school Chromebooks, and learn without any write permissions. Ideal for freshmen onboarding.
            </p>
          </div>

          <div className="p-3 bg-slate-100 border border-slate-300 space-y-1">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 bg-slate-300 text-slate-700 font-mono font-bold text-[10px] uppercase">
                none
              </span>
              <span className="text-[10px] font-bold text-slate-500 uppercase">Partition Isolation</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-snug pt-1">
              Zero visibility or access. Complete boundary isolation between independent clubs (e.g. CS Club cannot access private Robotics competition code).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
