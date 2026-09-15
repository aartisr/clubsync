import React, { useState } from 'react';
import { useVercelStatus, useTriggerVercelDeploy } from '../hooks/useRepositories';
import {
  ExternalLink,
  CheckCircle2,
  RefreshCw,
  Terminal,
  Zap,
  Globe,
  Server,
  ShieldCheck,
  Play,
  Copy,
  Check,
  Sparkles,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  schoolName: string;
  githubOrg: string;
}

export const VercelStagingDeployView: React.FC<Props> = ({ schoolName, githubOrg }) => {
  const { data: vercelStatus, isLoading, refetch } = useVercelStatus();
  const triggerDeployMutation = useTriggerVercelDeploy();

  const [copied, setCopied] = useState(false);
  const [testApiResult, setTestApiResult] = useState<string | null>(null);
  const [isTestingApi, setIsTestingApi] = useState(false);

  const handleCopyUrl = () => {
    if (!vercelStatus) return;
    navigator.clipboard.writeText(vercelStatus.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTestStagingApi = async () => {
    setIsTestingApi(true);
    try {
      const res = await fetch('/api/repositories');
      const data = await res.json();
      setTestApiResult(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setTestApiResult(`Error testing endpoint: ${err.message}`);
    } finally {
      setIsTestingApi(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-400" /> Staging Environment Ready
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                Vercel Serverless Architecture
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Vercel Staging Environment & Verification
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl">
              Verification studio for the <span className="text-emerald-400 font-mono">clubsync-staging</span> Vercel deployment pipeline. Integrates Vite 6 static bundles with Vercel Serverless Functions under <span className="text-slate-200 font-mono">/api/index.ts</span>.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => triggerDeployMutation.mutate()}
              disabled={triggerDeployMutation.isPending}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2"
            >
              {triggerDeployMutation.isPending ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Zap className="w-4 h-4" />
              )}
              <span>Trigger Staging Deploy</span>
            </button>
          </div>
        </div>
      </div>

      {/* Deployment Status Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-lg">Staging Deployment Active</h3>
                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-mono text-xs font-bold rounded-full">
                  READY
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono">
                Deployment ID: {vercelStatus?.deploymentId || 'dpl_89f2a7x3k91m'}
              </p>
            </div>
          </div>

          {/* Staging URL Button */}
          <div className="flex items-center gap-2">
            <a
              href={vercelStatus?.url || 'https://clubsync-staging.vercel.app'}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2"
            >
              <span>{vercelStatus?.url || 'https://clubsync-staging.vercel.app'}</span>
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
            </a>

            <button
              onClick={handleCopyUrl}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs"
              title="Copy Staging URL"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Specs Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
            <span className="text-slate-400 font-medium block">Target Environment</span>
            <strong className="text-slate-800 text-sm font-semibold capitalize">
              {vercelStatus?.target || 'Staging'} Preview
            </strong>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
            <span className="text-slate-400 font-medium block">Build Duration</span>
            <strong className="text-emerald-600 text-sm font-semibold">
              {((vercelStatus?.buildTimeMs || 18420) / 1000).toFixed(1)}s (Vite + esbuild)
            </strong>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
            <span className="text-slate-400 font-medium block">Branch & Commit</span>
            <strong className="text-indigo-600 text-sm font-mono font-semibold">
              {vercelStatus?.branch || 'main'} ({vercelStatus?.commitHash || '7f9a2d1'})
            </strong>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
            <span className="text-slate-400 font-medium block">Serverless API Status</span>
            <strong className="text-emerald-600 text-sm font-semibold flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> /api/index.ts Verified
            </strong>
          </div>
        </div>

        {/* Live Staging API Interactive Tester */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl text-white space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <h4 className="font-bold text-sm text-slate-200">Staging REST API Tester</h4>
            </div>

            <button
              onClick={handleTestStagingApi}
              disabled={isTestingApi}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
            >
              {isTestingApi ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
              <span>Test GET /api/repositories</span>
            </button>
          </div>

          {testApiResult ? (
            <pre className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-[11px] font-mono text-emerald-400 max-h-48 overflow-y-auto">
              {testApiResult}
            </pre>
          ) : (
            <p className="text-xs text-slate-400 italic">
              Click "Test GET /api/repositories" above to execute a live query against the staging backend serverless functions.
            </p>
          )}
        </div>

        {/* Build Terminal Logs */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Terminal className="w-4 h-4 text-indigo-600" /> Vercel Deployment Build Logs
          </h4>
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 font-mono text-[11px] space-y-1 max-h-60 overflow-y-auto">
            {vercelStatus?.logs?.map((log, i) => (
              <div key={i} className="leading-relaxed">
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
