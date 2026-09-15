import React, { useState } from 'react';
import { useSyncGitHubOrg } from '../hooks/useRepositories';
import {
  Github,
  CheckCircle2,
  RefreshCw,
  Search,
  Key,
  Globe,
  Users,
  GitBranch,
  ShieldCheck,
  X,
  AlertCircle,
  ExternalLink,
  Sparkles,
  Zap,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentOrg: string;
  onOrgChange: (newOrg: string) => void;
}

export const GitHubOrgModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentOrg,
  onOrgChange,
}) => {
  const [orgInput, setOrgInput] = useState(currentOrg);
  const [githubToken, setGithubToken] = useState('');
  const [testResult, setTestResult] = useState<any | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const syncMutation = useSyncGitHubOrg();

  if (!isOpen) return null;

  const cleanSlug = (input: string) => {
    if (!input) return '';
    let cleaned = input.trim();
    cleaned = cleaned.replace(/^https?:\/\//i, '');
    cleaned = cleaned.replace(/^github\.com\//i, '');
    cleaned = cleaned.replace(/^(orgs|users)\//i, '');
    return cleaned.split('/')[0].split('?')[0].trim();
  };

  const handleTestConnection = async () => {
    const orgSlug = cleanSlug(orgInput);
    if (!orgSlug) return;
    setIsTesting(true);
    setErrorMsg(null);
    setTestResult(null);

    try {
      const headers: Record<string, string> = {};
      if (githubToken) headers['x-github-token'] = githubToken;

      const res = await fetch(`/api/github/org/${encodeURIComponent(orgSlug)}`, { headers });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to connect to GitHub Organization');
      }

      setTestResult(data.org);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error connecting to GitHub');
    } finally {
      setIsTesting(false);
    }
  };

  const handleSyncOrg = () => {
    const orgSlug = cleanSlug(orgInput);
    if (!orgSlug) return;

    syncMutation.mutate(
      { orgName: orgSlug, token: githubToken || undefined },
      {
        onSuccess: (data) => {
          onOrgChange(orgSlug);
          onClose();
        },
        onError: (err: any) => {
          setErrorMsg(err.message || 'Sync failed');
        },
      }
    );
  };

  const popularOrgs = ['pcss2-robotics-demo', 'vercel', 'facebook', 'google', 'tailwindlabs', 'aartisr'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-slate-800 rounded-xl text-white border border-slate-700">
              <Github className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Live GitHub Organization Integration</h3>
              <p className="text-xs text-slate-400">Fetch real repositories, members, and teams from GitHub API</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[80vh] text-xs">
          {/* Quick Presets */}
          <div className="space-y-2">
            <label className="font-bold text-slate-700 block">Popular Open-Source Organizations</label>
            <div className="flex flex-wrap gap-1.5">
              {popularOrgs.map((org) => (
                <button
                  key={org}
                  onClick={() => {
                    setOrgInput(org);
                    setTestResult(null);
                    setErrorMsg(null);
                  }}
                  className={`px-2.5 py-1 rounded-lg font-mono text-xs font-semibold transition-all border ${
                    orgInput.toLowerCase() === org.toLowerCase()
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  @{org}
                </button>
              ))}
            </div>
          </div>

          {/* Org Name Input */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">GitHub Organization or Username *</label>
            <div className="relative">
              <Github className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={orgInput}
                onChange={(e) => setOrgInput(e.target.value)}
                placeholder="e.g. vercel, facebook, pcss2-robotics"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Enter any valid public GitHub Organization or User handle to fetch live data.
            </p>
          </div>

          {/* Personal Access Token (Optional) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700 block">GitHub Personal Access Token (Optional)</label>
              <span className="text-[10px] font-semibold text-slate-400">Increases Rate Limits & Access</span>
            </div>
            <div className="relative">
              <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                value={githubToken}
                onChange={(e) => setGithubToken(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Test Result Box */}
          {testResult && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={testResult.avatar_url}
                    alt={testResult.login}
                    className="w-8 h-8 rounded-full border border-emerald-300"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{testResult.name || testResult.login}</h4>
                    <p className="text-[11px] text-emerald-800 font-mono">@{testResult.login}</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-emerald-200 text-emerald-900 font-bold rounded text-[10px]">
                  CONNECTED
                </span>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2">{testResult.bio || testResult.description || 'Public GitHub Organization'}</p>

              <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[11px] font-semibold border-t border-emerald-200/60">
                <div>
                  <span className="text-slate-400 block text-[10px]">Public Repos</span>
                  <strong className="text-slate-900">{testResult.public_repos || 0}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Followers/Members</span>
                  <strong className="text-slate-900">{testResult.followers || testResult.collaborators || 0}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Location</span>
                  <strong className="text-slate-900">{testResult.location || 'Global'}</strong>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-end gap-3">
          <button
            onClick={handleTestConnection}
            disabled={isTesting || !orgInput}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-semibold transition-colors flex items-center gap-1.5 text-xs"
          >
            {isTesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5 text-slate-600" />}
            <span>Verify Org</span>
          </button>

          <button
            onClick={handleSyncOrg}
            disabled={syncMutation.isPending || !orgInput}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold rounded-xl transition-all shadow-md flex items-center gap-1.5 text-xs"
          >
            {syncMutation.isPending ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Zap className="w-3.5 h-3.5 text-blue-200" />
            )}
            <span>Sync Live GitHub Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
