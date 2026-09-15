import React, { useState } from 'react';
import { useRepositories, useAuditLogs, useMasterOverride } from '../hooks/useRepositories';
import { UserRole, RepositoryItem } from '../types';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Search,
  Filter,
  FileText,
  UserCheck,
  Award,
  Sliders,
  History,
  Building2,
  Sparkles,
} from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  currentUserRole: UserRole;
  currentUserName: string;
  schoolName: string;
  githubOrg: string;
}

export const MasterOversightDashboard: React.FC<Props> = ({
  currentUserRole,
  currentUserName,
  schoolName,
  githubOrg,
}) => {
  const { data: repositories, isLoading: isReposLoading, refetch: refetchRepos } = useRepositories();
  const { data: auditLogs, isLoading: isLogsLoading, refetch: refetchLogs } = useAuditLogs();
  const masterOverrideMutation = useMasterOverride();

  const [selectedRepoId, setSelectedRepoId] = useState<string>('');
  const [overrideAction, setOverrideAction] = useState<'lock_all_branches' | 'approve_public_showcase' | 'revoke_public_access'>('lock_all_branches');
  const [overrideReason, setOverrideReason] = useState<string>('');
  const [auditFilter, setAuditFilter] = useState<string>('all');

  const handleExecuteMasterOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRepoId) return;

    masterOverrideMutation.mutate(
      {
        repositoryId: selectedRepoId,
        actionType: overrideAction,
        performedBy: currentUserName,
        reason: overrideReason || 'Master Oversight Administrative Action',
      },
      {
        onSuccess: () => {
          setSelectedRepoId('');
          setOverrideReason('');
        },
      }
    );
  };

  const filteredLogs = (auditLogs || []).filter((log) => {
    if (auditFilter === 'all') return true;
    return log.severity === auditFilter;
  });

  const pendingPublicRepos = (repositories || []).filter(
    (r) => r.isPublicRequested && !r.isPublicApproved
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Master Access Active
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                {schoolName} ({githubOrg})
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Faculty Advisor & Leadership Master Oversight
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl">
              Centralized administrative panel granting Faculty Advisors and Lead Officers master oversight, emergency branch lockdown capabilities, public showcase compliance vetting, and real-time security audit feeds.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                refetchRepos();
                refetchLogs();
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-semibold border border-slate-700 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4 text-emerald-400" />
              <span>Sync Audit Stream</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Total Repositories</span>
            <Building2 className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{repositories?.length || 0}</p>
          <p className="text-xs text-slate-500">Across 5 active STEM subteams</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Pending Public Requests</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-amber-600">{pendingPublicRepos.length}</p>
          <p className="text-xs text-slate-500">Requires FERPA advisor sign-off</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Branch Protection Rate</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-600">96.4%</p>
          <p className="text-xs text-slate-500">Protected main branches</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Master Overrides Issued</span>
            <Lock className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-purple-600">
            {auditLogs?.filter((l) => l.severity === 'master_override').length || 0}
          </p>
          <p className="text-xs text-slate-500">Faculty administrative actions</p>
        </div>
      </div>

      {/* Main Grid: Pending Approvals & Master Action Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pending Public Approvals Box (8 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-lg">Public Showcase Vetting Queue</h3>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200/60 rounded-xl">
              {pendingPublicRepos.length} Pending
            </span>
          </div>

          {pendingPublicRepos.length === 0 ? (
            <div className="py-8 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">All public showcase requests cleared!</p>
              <p className="text-xs text-slate-400">No student repositories currently waiting for advisor review.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingPublicRepos.map((repo) => (
                <div
                  key={repo.id}
                  className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-indigo-600">{repo.name}</span>
                      <span className="text-[10px] px-2 py-0.5 bg-slate-200 text-slate-700 font-semibold rounded">
                        {repo.subteam}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-1">{repo.description}</p>
                    <p className="text-[11px] text-slate-400">
                      Author: <strong className="text-slate-700">{repo.creator.name}</strong> ({repo.creator.email})
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() =>
                        masterOverrideMutation.mutate({
                          repositoryId: repo.id,
                          actionType: 'approve_public_showcase',
                          performedBy: currentUserName,
                          reason: 'Approved via Faculty Advisor Oversight Review',
                        })
                      }
                      disabled={masterOverrideMutation.isPending}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-sm flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approve Public
                    </button>

                    <button
                      onClick={() =>
                        masterOverrideMutation.mutate({
                          repositoryId: repo.id,
                          actionType: 'revoke_public_access',
                          performedBy: currentUserName,
                          reason: 'Revoked to Private by Advisor',
                        })
                      }
                      disabled={masterOverrideMutation.isPending}
                      className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold"
                    >
                      Keep Private
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Master Override Control Box (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Sliders className="w-5 h-5 text-purple-600" />
            <h3 className="font-bold text-slate-900 text-lg">Execute Master Override</h3>
          </div>

          <form onSubmit={handleExecuteMasterOverride} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Select Target Repository *</label>
              <select
                value={selectedRepoId}
                onChange={(e) => setSelectedRepoId(e.target.value)}
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium text-slate-800 focus:ring-2 focus:ring-purple-500/20"
              >
                <option value="">-- Choose Repository --</option>
                {repositories?.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.subteam})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Override Action Type *</label>
              <select
                value={overrideAction}
                onChange={(e) => setOverrideAction(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium text-slate-800 focus:ring-2 focus:ring-purple-500/20"
              >
                <option value="lock_all_branches">🔒 Emergency Lockdown: Lock All Branches to Advisor Only</option>
                <option value="approve_public_showcase">👁️ Approve Public Showcase Status</option>
                <option value="revoke_public_access">🙈 Revoke Public Status (Force Private Org)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Administrative Justification / Reason</label>
              <textarea
                rows={2}
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                placeholder="e.g. Competition code freeze, FERPA compliance review, graduation handover lock..."
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            <button
              type="submit"
              disabled={!selectedRepoId || masterOverrideMutation.isPending}
              className="w-full py-2.5 bg-purple-700 hover:bg-purple-600 disabled:opacity-50 text-white font-semibold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              {masterOverrideMutation.isPending ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <ShieldAlert className="w-4 h-4" />
              )}
              <span>Invoke Master Override Action</span>
            </button>
          </form>
        </div>
      </div>

      {/* Audit Log Stream Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-lg">Organization Security Audit Stream</h3>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Filter Severity:</span>
            <select
              value={auditFilter}
              onChange={(e) => setAuditFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
            >
              <option value="all">All Events</option>
              <option value="info">Info</option>
              <option value="notice">Notice</option>
              <option value="warning">Warning</option>
              <option value="master_override">Master Overrides</option>
            </select>
          </div>
        </div>

        {/* Audit Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Repository</th>
                <th className="py-2.5 px-3">Performed By</th>
                <th className="py-2.5 px-3">Details</th>
                <th className="py-2.5 px-3 text-right">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-mono text-slate-400 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-800 capitalize whitespace-nowrap">
                    {log.action.replace('_', ' ')}
                  </td>
                  <td className="py-3 px-3 font-mono text-indigo-600 font-medium whitespace-nowrap">
                    {log.repositoryName}
                  </td>
                  <td className="py-3 px-3 text-slate-700 whitespace-nowrap">
                    <strong className="font-semibold">{log.performedBy}</strong> ({log.performedRole.replace('_', ' ')})
                  </td>
                  <td className="py-3 px-3 text-slate-600 max-w-md truncate">{log.details}</td>
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    {log.severity === 'master_override' ? (
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-800 font-bold rounded-md">
                        Master Override
                      </span>
                    ) : log.severity === 'warning' ? (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold rounded-md">
                        Warning
                      </span>
                    ) : log.severity === 'notice' ? (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-semibold rounded-md">
                        Notice
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 font-medium rounded-md">
                        Info
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
