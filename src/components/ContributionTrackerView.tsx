import React, { useState } from 'react';
import { useContributions, useRepositories } from '../hooks/useRepositories';
import {
  TrendingUp,
  GitCommit,
  GitPullRequest,
  Code,
  Users,
  Award,
  Calendar,
  Zap,
  CheckCircle2,
  Filter,
  RefreshCw,
  Search,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  schoolName: string;
}

export const ContributionTrackerView: React.FC<Props> = ({ schoolName }) => {
  const { data: contributions, isLoading: isContribLoading, refetch } = useContributions();
  const { data: repositories } = useRepositories();

  const [selectedSubteam, setSelectedSubteam] = useState<string>('all');
  const [searchMember, setSearchMember] = useState<string>('');

  const subteamsList = [
    'Robotics Team',
    'Web & Mobile Dev',
    'Cybersecurity Club',
    'Artificial Intelligence Lab',
    'STEM Faculty Advisory Board',
  ];

  const filteredMembers = (contributions || []).filter((member) => {
    const matchesSearch =
      member.userName.toLowerCase().includes(searchMember.toLowerCase()) ||
      member.userEmail.toLowerCase().includes(searchMember.toLowerCase()) ||
      member.topRepo.toLowerCase().includes(searchMember.toLowerCase());
    const matchesSubteam = selectedSubteam === 'all' || member.subteam === selectedSubteam;
    return matchesSearch && matchesSubteam;
  });

  const totalCommits = (contributions || []).reduce((acc, c) => acc + c.commitsCount, 0);
  const totalPRsMerged = (contributions || []).reduce((acc, c) => acc + c.prsMerged, 0);
  const totalReviews = (contributions || []).reduce((acc, c) => acc + c.codeReviewsCount, 0);
  const totalLines = (contributions || []).reduce((acc, c) => acc + c.linesAdded, 0);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute left-1/2 -top-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-blue-400" /> Real-Time Analytics
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                {schoolName}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Team Contribution & Velocity Dashboard
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Track commit frequency, pull request throughput, code review activity, and individual contribution heatmaps across all self-service student repositories.
            </p>
          </div>

          <button
            onClick={() => refetch()}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-semibold border border-slate-700 transition-all flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4 text-blue-400" />
            <span>Sync Metrics</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Total Team Commits</span>
            <GitCommit className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{totalCommits}</p>
          <p className="text-xs text-emerald-600 font-medium">↑ +18% past 30 days</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Pull Requests Merged</span>
            <GitPullRequest className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-600">{totalPRsMerged}</p>
          <p className="text-xs text-slate-500">98% merge success rate</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Peer Code Reviews</span>
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-blue-600">{totalReviews}</p>
          <p className="text-xs text-slate-500">Avg 1.8 reviews per PR</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Total Lines Added</span>
            <Code className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-purple-600">{totalLines.toLocaleString()}</p>
          <p className="text-xs text-slate-500">Clean modular codebase</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchMember}
            onChange={(e) => setSearchMember(e.target.value)}
            placeholder="Search member name or repo..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-500 font-medium">Filter Subteam:</span>
          <select
            value={selectedSubteam}
            onChange={(e) => setSelectedSubteam(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
          >
            <option value="all">All Subteams</option>
            {subteamsList.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Contributor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredMembers.map((member, idx) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all space-y-4"
          >
            {/* Header / Avatar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={member.avatarUrl}
                  alt={member.userName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-indigo-100"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-base">{member.userName}</h3>
                    {idx === 0 && (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-md flex items-center gap-1">
                        <Award className="w-3 h-3 text-amber-600" /> Top Contributor
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">{member.subteam}</p>
                </div>
              </div>

              <span className="text-xs font-mono font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg">
                {member.userRole.replace('_', ' ')}
              </span>
            </div>

            {/* Metrics Breakdown Bar */}
            <div className="grid grid-cols-4 gap-2 text-center p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Commits</span>
                <strong className="text-indigo-600 text-sm font-bold">{member.commitsCount}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">PRs Merged</span>
                <strong className="text-emerald-600 text-sm font-bold">{member.prsMerged}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Code Reviews</span>
                <strong className="text-blue-600 text-sm font-bold">{member.codeReviewsCount}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">LOC Added</span>
                <strong className="text-purple-600 text-sm font-bold">+{member.linesAdded}</strong>
              </div>
            </div>

            {/* Weekly Activity Heatmap Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>7-Day Commit Rhythm</span>
                <span className="font-mono text-[10px] text-slate-400">
                  Last active: {new Date(member.lastActive).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {member.weeklyActivity.map((count, dayIdx) => {
                  const intensity =
                    count === 0
                      ? 'bg-slate-100 border-slate-200'
                      : count < 10
                      ? 'bg-emerald-200 border-emerald-300'
                      : count < 25
                      ? 'bg-emerald-400 border-emerald-500'
                      : 'bg-emerald-600 border-emerald-700 text-white';

                  return (
                    <div
                      key={dayIdx}
                      className={`flex-1 h-8 rounded-lg border ${intensity} flex items-center justify-center text-[10px] font-bold transition-all`}
                      title={`Day ${dayIdx + 1}: ${count} commits`}
                    >
                      {count > 0 ? count : ''}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top Project Badge */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Primary Project:</span>
              <span className="font-mono font-bold text-indigo-600 truncate max-w-[220px]">
                {member.topRepo}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
