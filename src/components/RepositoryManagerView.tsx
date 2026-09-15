import React, { useState } from 'react';
import {
  useRepositories,
  useCreateRepository,
  useUpdateBranchRules,
  useUpdateVisibility,
} from '../hooks/useRepositories';
import { RepositoryItem, BranchPermissionRule, UserRole } from '../types';
import {
  GitBranch,
  Plus,
  Shield,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  RefreshCw,
  Sparkles,
  Users,
  Code2,
  FileCode2,
  Star,
  GitFork,
  ArrowRight,
  ShieldAlert,
  Check,
  Building2,
  ExternalLink,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  currentUserRole: UserRole;
  currentUserName: string;
  currentUserEmail: string;
  schoolName: string;
  githubOrg: string;
}

export const RepositoryManagerView: React.FC<Props> = ({
  currentUserRole,
  currentUserName,
  currentUserEmail,
  schoolName,
  githubOrg,
}) => {
  const { data: repositories, isLoading, isError, refetch, isFetching } = useRepositories();
  const createRepoMutation = useCreateRepository();
  const updateBranchRulesMutation = useUpdateBranchRules();
  const updateVisibilityMutation = useUpdateVisibility();

  // Filters & State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubteam, setSelectedSubteam] = useState<string>('all');
  const [selectedVisibility, setSelectedVisibility] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedRepoForBranch, setSelectedRepoForBranch] = useState<RepositoryItem | null>(null);
  const [selectedRepoForVisibility, setSelectedRepoForVisibility] = useState<RepositoryItem | null>(null);

  // New Repo Form State
  const [newRepoName, setNewRepoName] = useState('');
  const [newRepoSubteam, setNewRepoSubteam] = useState('Robotics Team');
  const [newRepoClubOwnerId, setNewRepoClubOwnerId] = useState('robotics');
  const [newRepoDescription, setNewRepoDescription] = useState('');
  const [newRepoVisibility, setNewRepoVisibility] = useState<'private' | 'public'>('private');
  const [lastCreatedRepo, setLastCreatedRepo] = useState<{
    name: string;
    createdOnRealGitHub: boolean;
    htmlUrl: string;
  } | null>(null);

  // Branch Rule Editor State
  const [editingBranchRules, setEditingBranchRules] = useState<BranchPermissionRule[]>([]);
  const [editingBranchPattern, setEditingBranchPattern] = useState('main');

  const subteamsList = [
    'Robotics Team',
    'Web & Mobile Dev',
    'Cybersecurity Club',
    'Artificial Intelligence Lab',
    'Science Olympiad',
  ];

  const handleOpenBranchEditor = (repo: RepositoryItem) => {
    setSelectedRepoForBranch(repo);
    setEditingBranchRules([...repo.branchRules]);
  };

  const handleSaveBranchRules = () => {
    if (!selectedRepoForBranch) return;
    updateBranchRulesMutation.mutate(
      {
        repositoryId: selectedRepoForBranch.id,
        branchRules: editingBranchRules,
        updatedBy: currentUserName,
        userRole: currentUserRole,
      },
      {
        onSuccess: () => {
          setSelectedRepoForBranch(null);
        },
      }
    );
  };

  const handleToggleBranchRule = (ruleId: string, field: keyof BranchPermissionRule, val: any) => {
    setEditingBranchRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, [field]: val } : r))
    );
  };

  const handleAddBranchPattern = () => {
    if (!editingBranchPattern.trim()) return;
    const newRule: BranchPermissionRule = {
      id: `rule-${Date.now()}`,
      branchPattern: editingBranchPattern.trim(),
      protectionEnabled: true,
      requirePR: true,
      requiredReviewers: 1,
      enforceLinearHistory: true,
      restrictPushRoles: ['student_member', 'club_lead', 'faculty_advisor'],
      allowedPushEmails: [currentUserEmail],
      preventForcePush: true,
      preventDeletion: true,
      requireSecretScanning: true,
      updatedBy: currentUserName,
      updatedAt: new Date().toISOString(),
    };
    setEditingBranchRules((prev) => [...prev, newRule]);
    setEditingBranchPattern('');
  };

  const handleCreateRepo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRepoName.trim()) return;

    createRepoMutation.mutate(
      {
        name: newRepoName.trim(),
        subteam: newRepoSubteam,
        clubOwnerId: newRepoClubOwnerId,
        description: newRepoDescription,
        visibility: newRepoVisibility,
        creatorName: currentUserName,
        creatorEmail: currentUserEmail,
        creatorRole: currentUserRole,
        githubOrg: githubOrg,
      },
      {
        onSuccess: (data) => {
          setIsCreateModalOpen(false);
          setNewRepoName('');
          setNewRepoDescription('');
          if (data?.repository) {
            setLastCreatedRepo({
              name: data.repository.name,
              createdOnRealGitHub: !!data.createdOnRealGitHub,
              htmlUrl: data.htmlUrl || `https://github.com/${data.repository.name}`,
            });
          }
        },
      }
    );
  };

  const handleConfirmVisibilityChange = (repo: RepositoryItem, newVis: 'private' | 'public') => {
    const isAdvisor = currentUserRole === 'faculty_advisor' || currentUserRole === 'it_admin';
    updateVisibilityMutation.mutate(
      {
        repositoryId: repo.id,
        visibility: newVis,
        requestedBy: currentUserName,
        approvedByAdvisor: isAdvisor,
        advisorEmail: isAdvisor ? currentUserEmail : undefined,
      },
      {
        onSuccess: () => {
          setSelectedRepoForVisibility(null);
        },
      }
    );
  };

  // Filtered Repositories
  const filteredRepos = (repositories || []).filter((repo) => {
    const matchesSearch =
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.creator.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubteam = selectedSubteam === 'all' || repo.subteam === selectedSubteam;
    const matchesVis = selectedVisibility === 'all' || repo.visibility === selectedVisibility;
    return matchesSearch && matchesSubteam && matchesVis;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Automated Branch Rules
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Master Oversight Enforced
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Self-Service Team Repositories
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Empower team members at <span className="text-slate-200 font-medium">{schoolName}</span> ({githubOrg}) to create repositories, configure fine-grained branch protections, and publish showcases while preserving master advisor oversight.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 text-sm font-medium transition-all flex items-center gap-2"
              title="Refetch Query Cache"
            >
              <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin text-indigo-400' : ''}`} />
              <span className="hidden sm:inline">Refetch</span>
            </button>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Repository</span>
            </button>
          </div>
        </div>
      </div>

      {/* Repository Creation Success Banner */}
      <AnimatePresence>
        {lastCreatedRepo && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-emerald-950/80 border border-emerald-500/40 rounded-2xl p-4 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30 shrink-0 mt-0.5">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-emerald-200">Repository Provisioned Successfully!</h3>
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-emerald-500/30 text-emerald-300 border border-emerald-500/40">
                    {lastCreatedRepo.createdOnRealGitHub ? 'Live GitHub API' : 'ClubSync Workspace'}
                  </span>
                </div>
                <p className="text-xs text-emerald-300/80 mt-0.5">
                  <strong className="text-white">{lastCreatedRepo.name}</strong> has been added to the workspace with automated branch protection rules enabled.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`git remote add origin ${lastCreatedRepo.htmlUrl}.git`);
                  alert(`Copied git command:\ngit remote add origin ${lastCreatedRepo.htmlUrl}.git`);
                }}
                className="px-3 py-1.5 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/50 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copy Git Remote</span>
              </button>
              <a
                href={lastCreatedRepo.htmlUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
              >
                <span>View Repo</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => setLastCreatedRepo(null)}
                className="p-1.5 text-emerald-400 hover:text-white rounded-lg hover:bg-emerald-900/40"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Query Bar & Filters */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search repos, topics, or author..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Subteam Selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-medium">Team:</span>
            <select
              value={selectedSubteam}
              onChange={(e) => setSelectedSubteam(e.target.value)}
              className="bg-transparent font-medium text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="all">All Subteams</option>
              {subteamsList.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Visibility Selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs">
            <Eye className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-medium">Visibility:</span>
            <select
              value={selectedVisibility}
              onChange={(e) => setSelectedVisibility(e.target.value)}
              className="bg-transparent font-medium text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="all">All Types</option>
              <option value="private">Private Only</option>
              <option value="public">Public Showcase</option>
            </select>
          </div>

          {/* Active Repos Count Badge */}
          <div className="text-xs font-semibold px-3 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-xl">
            {filteredRepos.length} Repositories
          </div>
        </div>
      </div>

      {/* Main Repositories Grid */}
      {isLoading ? (
        <div className="py-20 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
          <p className="text-slate-500 text-sm font-medium">Syncing team repository registry...</p>
        </div>
      ) : isError ? (
        <div className="p-8 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-center space-y-3">
          <ShieldAlert className="w-10 h-10 text-rose-600 mx-auto" />
          <h3 className="font-semibold text-lg">Error Loading Repositories</h3>
          <p className="text-sm text-rose-600">Failed to sync with API endpoints. Check network or server status.</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-rose-600 text-white rounded-xl text-sm font-semibold hover:bg-rose-500"
          >
            Retry Query
          </button>
        </div>
      ) : filteredRepos.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl space-y-4">
          <FileCode2 className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-semibold text-slate-800">No matching repositories found</h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Try adjusting your search query or subteam filter, or create a brand new self-service repository for your project.
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-500"
          >
            Create Repository Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRepos.map((repo) => {
            const hasProtectedMain = repo.branchRules.some(
              (r) => r.branchPattern === 'main' && r.protectionEnabled
            );

            return (
              <motion.div
                key={repo.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
              >
                {/* Top Title & Visibility Row */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs font-medium rounded-md">
                          {repo.subteam}
                        </span>
                        {repo.visibility === 'public' ? (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-md flex items-center gap-1">
                            <Eye className="w-3 h-3 text-emerald-600" /> Public Showcase
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium rounded-md flex items-center gap-1">
                            <Lock className="w-3 h-3 text-slate-500" /> Private Org
                          </span>
                        )}

                        {repo.isPublicRequested && !repo.isPublicApproved && (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-xs font-semibold rounded-md flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-amber-600" /> Pending Advisor Sign-off
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center gap-2">
                        <GitBranch className="w-5 h-5 text-indigo-600 shrink-0" />
                        <span className="truncate">{repo.name}</span>
                      </h3>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-700 rounded-lg flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> {repo.starsCount}
                      </span>
                    </div>
                  </div>

                  <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed">
                    {repo.description}
                  </p>
                </div>

                {/* Author & Master Access Indicator */}
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-[10px]">
                      {repo.creator.name.charAt(0)}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-800">{repo.creator.name}</span>
                      <span className="text-slate-400 ml-1">({repo.creator.role.replace('_', ' ')})</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200/60" title="Faculty Advisors and Club Leads hold Master Override access over all branches and settings.">
                    <Shield className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Master Access</span>
                  </div>
                </div>

                {/* Branch Rules & Health Overview */}
                <div className="space-y-2 pt-1 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Branch Rules:</span>
                    <span className="font-semibold text-slate-700">
                      {repo.branchRules.length} Branch Pattern{repo.branchRules.length !== 1 ? 's' : ''} Configured
                    </span>
                  </div>

                  {/* Protection Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    {hasProtectedMain ? (
                      <span className="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs rounded-lg font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Main Branch Protected
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-amber-50 text-amber-700 border border-amber-200 text-xs rounded-lg font-medium flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Main Unprotected
                      </span>
                    )}

                    <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-lg font-medium">
                      Health: <strong className="text-indigo-600">{repo.healthScore}/100</strong>
                    </span>
                  </div>
                </div>

                {/* Action Buttons Row */}
                <div className="pt-2 flex items-center justify-between gap-3">
                  <button
                    onClick={() => handleOpenBranchEditor(repo)}
                    className="flex-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                  >
                    <Shield className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Manage Branch Rules</span>
                  </button>

                  <button
                    onClick={() => setSelectedRepoForVisibility(repo)}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                    title="Toggle Public / Private Status"
                  >
                    {repo.visibility === 'public' ? (
                      <Eye className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-slate-500" />
                    )}
                    <span>Visibility</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* CREATE REPOSITORY MODAL */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
            >
              <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Plus className="w-5 h-5 text-indigo-400" /> Create Team Repository
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Self-service repository under {githubOrg} organizational structure.
                  </p>
                </div>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateRepo} className="p-6 space-y-4 text-slate-800">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Repository Name *</label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2.5 py-2 rounded-xl border border-slate-200">
                      pcss2-{newRepoClubOwnerId}/
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="e.g. autonomous-chassis"
                      value={newRepoName}
                      onChange={(e) => setNewRepoName(e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Subteam Category *</label>
                    <select
                      value={newRepoSubteam}
                      onChange={(e) => {
                        setNewRepoSubteam(e.target.value);
                        if (e.target.value.includes('Robotics')) setNewRepoClubOwnerId('robotics');
                        else if (e.target.value.includes('Web')) setNewRepoClubOwnerId('cs');
                        else if (e.target.value.includes('Cyber')) setNewRepoClubOwnerId('cybersec');
                        else if (e.target.value.includes('AI')) setNewRepoClubOwnerId('ai');
                        else setNewRepoClubOwnerId('scioly');
                      }}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500/20"
                    >
                      {subteamsList.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Visibility *</label>
                    <select
                      value={newRepoVisibility}
                      onChange={(e) => setNewRepoVisibility(e.target.value as 'private' | 'public')}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500/20"
                    >
                      <option value="private">Private (Team internal)</option>
                      <option value="public">Public Showcase (Requires Advisor Approval)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Describe the goals, tech stack, and members collaborating on this repository..."
                    value={newRepoDescription}
                    onChange={(e) => setNewRepoDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                {/* Information Box */}
                <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-indigo-900 space-y-1">
                  <div className="font-bold flex items-center gap-1 text-indigo-800">
                    <Shield className="w-4 h-4 text-indigo-600" /> Default Master Oversight Policies Applied:
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 text-indigo-700">
                    <li>Faculty Advisors and Club Leads automatically receive Master Access permissions.</li>
                    <li>Main branch protection will automatically require PR approvals.</li>
                    <li>Secret scanning and FERPA policy enforcement enabled by default.</li>
                  </ul>
                </div>

                <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createRepoMutation.isPending}
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold shadow-md flex items-center gap-2"
                  >
                    {createRepoMutation.isPending && <RefreshCw className="w-4 h-4 animate-spin" />}
                    <span>Provision Repository</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* BRANCH PERMISSION EDITOR DRAWER / MODAL */}
      <AnimatePresence>
        {selectedRepoForBranch && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-indigo-400" />
                    <h3 className="text-lg font-bold">Manage Branch Permissions</h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Repository: <span className="text-indigo-300 font-mono">{selectedRepoForBranch.name}</span>
                  </p>
                </div>
                <button
                  onClick={() => setSelectedRepoForBranch(null)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg"
                >
                  ✕
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6 overflow-y-auto flex-1 text-slate-800">
                {/* Master Access Note */}
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
                  <Shield className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-emerald-900">
                    <strong className="font-bold block text-sm text-emerald-800">
                      Master Advisor & Leader Access Active
                    </strong>
                    Faculty advisors and designated club leads retain administrative override access to push, lock, or modify branches regardless of lower-tier rule restrictions.
                  </div>
                </div>

                {/* Add New Branch Rule Pattern */}
                <div className="space-y-2 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <label className="text-xs font-bold text-slate-800 block">Add Branch Protection Rule Pattern</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editingBranchPattern}
                      onChange={(e) => setEditingBranchPattern(e.target.value)}
                      placeholder="e.g. main, dev, release/*, feature/*"
                      className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-indigo-500/20"
                    />
                    <button
                      onClick={handleAddBranchPattern}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" /> Add Pattern
                    </button>
                  </div>
                </div>

                {/* Branch Rules List */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-900">Active Branch Protection Rules ({editingBranchRules.length})</h4>

                  {editingBranchRules.map((rule) => (
                    <div
                      key={rule.id}
                      className="p-5 border border-slate-200 rounded-xl space-y-4 bg-white shadow-sm"
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                          <GitBranch className="w-4 h-4 text-indigo-600" />
                          <span className="font-mono font-bold text-sm text-slate-900">
                            {rule.branchPattern}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={rule.protectionEnabled}
                              onChange={(e) =>
                                handleToggleBranchRule(rule.id, 'protectionEnabled', e.target.checked)
                              }
                              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span>Protection Enabled</span>
                          </label>
                        </div>
                      </div>

                      {/* Rule Options Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <label className="flex items-start gap-2 p-3 bg-slate-50 border border-slate-100 rounded-lg cursor-pointer">
                          <input
                            type="checkbox"
                            checked={rule.requirePR}
                            onChange={(e) => handleToggleBranchRule(rule.id, 'requirePR', e.target.checked)}
                            className="mt-0.5 rounded border-slate-300 text-indigo-600"
                          />
                          <div>
                            <span className="font-bold text-slate-800 block">Require Pull Request</span>
                            <span className="text-slate-500">Pushes directly to this branch are blocked.</span>
                          </div>
                        </label>

                        <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg space-y-1">
                          <label className="font-bold text-slate-800 block">Required Approvals</label>
                          <select
                            value={rule.requiredReviewers}
                            onChange={(e) =>
                              handleToggleBranchRule(rule.id, 'requiredReviewers', parseInt(e.target.value))
                            }
                            className="w-full px-2 py-1 bg-white border border-slate-200 rounded-md font-medium text-slate-800"
                          >
                            <option value={1}>1 Approval Required</option>
                            <option value={2}>2 Approvals Required (Recommended for main)</option>
                            <option value={3}>3 Approvals Required</option>
                          </select>
                        </div>

                        <label className="flex items-start gap-2 p-3 bg-slate-50 border border-slate-100 rounded-lg cursor-pointer">
                          <input
                            type="checkbox"
                            checked={rule.preventForcePush}
                            onChange={(e) =>
                              handleToggleBranchRule(rule.id, 'preventForcePush', e.target.checked)
                            }
                            className="mt-0.5 rounded border-slate-300 text-indigo-600"
                          />
                          <div>
                            <span className="font-bold text-slate-800 block">Block Force Push (`git push -f`)</span>
                            <span className="text-slate-500">Prevents history rewriting on main branches.</span>
                          </div>
                        </label>

                        <label className="flex items-start gap-2 p-3 bg-slate-50 border border-slate-100 rounded-lg cursor-pointer">
                          <input
                            type="checkbox"
                            checked={rule.requireSecretScanning}
                            onChange={(e) =>
                              handleToggleBranchRule(rule.id, 'requireSecretScanning', e.target.checked)
                            }
                            className="mt-0.5 rounded border-slate-300 text-indigo-600"
                          />
                          <div>
                            <span className="font-bold text-slate-800 block">Require Secret & Token Scanning</span>
                            <span className="text-slate-500">Blocks commits containing API keys or tokens.</span>
                          </div>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedRepoForBranch(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveBranchRules}
                  disabled={updateBranchRulesMutation.isPending}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold shadow-md flex items-center gap-2"
                >
                  {updateBranchRulesMutation.isPending && <RefreshCw className="w-4 h-4 animate-spin" />}
                  <span>Save Branch Protections</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* VISIBILITY MODAL */}
      <AnimatePresence>
        {selectedRepoForVisibility && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 text-slate-800"
            >
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <Eye className="w-6 h-6 text-indigo-600" />
                <div>
                  <h3 className="font-bold text-slate-900">Repository Visibility Settings</h3>
                  <p className="text-xs text-slate-500 font-mono">{selectedRepoForVisibility.name}</p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-600">
                <p>
                  Current Status:{' '}
                  <strong className="capitalize font-bold text-slate-800">
                    {selectedRepoForVisibility.visibility}
                  </strong>
                </p>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 space-y-1">
                  <div className="font-bold flex items-center gap-1 text-amber-800">
                    <AlertTriangle className="w-4 h-4 text-amber-600" /> Public Showcase Guidelines:
                  </div>
                  <p>
                    Making a repository Public allows external visitors and recruiters to view the source code. Faculty advisor approval is required for all public student projects to verify FERPA compliance.
                  </p>
                </div>
              </div>

              <div className="pt-3 flex flex-col gap-2">
                {selectedRepoForVisibility.visibility === 'private' ? (
                  <button
                    onClick={() => handleConfirmVisibilityChange(selectedRepoForVisibility, 'public')}
                    disabled={updateVisibilityMutation.isPending}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold shadow-md flex items-center justify-center gap-2"
                  >
                    {updateVisibilityMutation.isPending ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                    <span>
                      {currentUserRole === 'faculty_advisor' || currentUserRole === 'it_admin'
                        ? 'Approve & Make Public Showcase'
                        : 'Request Public Showcase Approval'}
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleConfirmVisibilityChange(selectedRepoForVisibility, 'private')}
                    disabled={updateVisibilityMutation.isPending}
                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-semibold shadow-md flex items-center justify-center gap-2"
                  >
                    {updateVisibilityMutation.isPending ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Lock className="w-4 h-4" />
                    )}
                    <span>Switch Back to Private Org Only</span>
                  </button>
                )}

                <button
                  onClick={() => setSelectedRepoForVisibility(null)}
                  className="w-full py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
