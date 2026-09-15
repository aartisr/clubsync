import React, { lazy, Suspense, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigationTab, SchoolConfig, UserRole } from './types';
import { Navbar } from './components/Navbar';
import { ConfigModal } from './components/ConfigModal';
import { AIAssistantDrawer } from './components/AIAssistantDrawer';

// New Feature Views
import { RepositoryManagerView } from './components/RepositoryManagerView';
import { MasterOversightDashboard } from './components/MasterOversightDashboard';
import { ContributionTrackerView } from './components/ContributionTrackerView';
import { VercelStagingDeployView } from './components/VercelStagingDeployView';
import { GitHubOrgModal } from './components/GitHubOrgModal';

const DesignDocView = lazy(() => import('./components/DesignDocView').then(({ DesignDocView }) => ({ default: DesignDocView })));
const DiagramStudioView = lazy(() => import('./components/DiagramStudioView').then(({ DiagramStudioView }) => ({ default: DiagramStudioView })));
const ScriptHubView = lazy(() => import('./components/ScriptHubView').then(({ ScriptHubView }) => ({ default: ScriptHubView })));
const OnboardingSimulator = lazy(() => import('./components/OnboardingSimulator').then(({ OnboardingSimulator }) => ({ default: OnboardingSimulator })));
const PermissionMatrixView = lazy(() => import('./components/PermissionMatrixView').then(({ PermissionMatrixView }) => ({ default: PermissionMatrixView })));
const HandoverWizardView = lazy(() => import('./components/HandoverWizardView').then(({ HandoverWizardView }) => ({ default: HandoverWizardView })));
const ProposalGeneratorView = lazy(() => import('./components/ProposalGeneratorView').then(({ ProposalGeneratorView }) => ({ default: ProposalGeneratorView })));
const ITImplementationView = lazy(() => import('./components/ITImplementationView').then(({ ITImplementationView }) => ({ default: ITImplementationView })));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const WorkspaceLoading = () => (
  <div className="mx-auto flex min-h-56 max-w-7xl items-center px-4 sm:px-6 lg:px-8" role="status" aria-live="polite">
    <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 shadow-sm">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" aria-hidden="true" />
      Loading workspace…
    </div>
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('repositories');
  const [isConfigOpen, setIsConfigOpen] = useState<boolean>(false);
  const [isAIOpen, setIsAIOpen] = useState<boolean>(false);
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState<boolean>(false);

  // User Role Switcher state for demonstration of Master Access vs Member rights
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('student_member');
  const [currentUserName, setCurrentUserName] = useState<string>('Alex Chen');
  const [currentUserEmail, setCurrentUserEmail] = useState<string>('alex.chen@pioneercss.org');

  const [config, setConfig] = useState<SchoolConfig>({
    schoolName: 'Pioneer Charter School of Science II (PCSS II)',
    domain: 'pioneercss.org',
    githubOrg: 'pcss2-robotics',
    adminEmail: 'it@pioneercss.org',
    roboticsLeadEmail: 'robotics.lead@pioneercss.org',
    secondaryClubLeadEmail: 'csclub@pioneercss.org'
  });

  const handleRoleChange = (role: UserRole) => {
    setCurrentUserRole(role);
    if (role === 'student_member') {
      setCurrentUserName('Alex Chen');
      setCurrentUserEmail('alex.chen@pioneercss.org');
    } else if (role === 'club_lead') {
      setCurrentUserName('Priya Sharma');
      setCurrentUserEmail('priya.sharma@pioneercss.org');
    } else if (role === 'faculty_advisor') {
      setCurrentUserName('Dr. Sarah Jenkins');
      setCurrentUserEmail('robotics.advisor@pioneercss.org');
    } else {
      setCurrentUserName('IT SysAdmin');
      setCurrentUserEmail('it.admin@pioneercss.org');
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen overflow-x-hidden bg-slate-100 text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white flex flex-col">
        
        {/* Navigation Header */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          config={config}
          onOpenConfig={() => setIsConfigOpen(true)}
          onOpenAI={() => setIsAIOpen(true)}
          onOpenGitHubModal={() => setIsGitHubModalOpen(true)}
        />

        {/* User Persona & Role Simulator Banner */}
        <div className="bg-slate-800 text-slate-200 border-b border-slate-700 py-2 px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">Current User Persona:</span>
            <span className="font-bold text-white bg-slate-700 px-2 py-0.5 rounded border border-slate-600">
              {currentUserName} ({currentUserEmail})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Switch Role Persona:</span>
            <button
              onClick={() => handleRoleChange('student_member')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                currentUserRole === 'student_member'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              Student Member
            </button>

            <button
              onClick={() => handleRoleChange('club_lead')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                currentUserRole === 'club_lead'
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              Club Lead
            </button>

            <button
              onClick={() => handleRoleChange('faculty_advisor')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                currentUserRole === 'faculty_advisor'
                  ? 'bg-emerald-600 text-white shadow ring-2 ring-emerald-400/40'
                  : 'bg-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              ★ Faculty Advisor (Master Access)
            </button>
          </div>
        </div>

        {/* Main View Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Suspense fallback={<WorkspaceLoading />}>
            {activeTab === 'repositories' && (
              <RepositoryManagerView
                currentUserRole={currentUserRole}
                currentUserName={currentUserName}
                currentUserEmail={currentUserEmail}
                schoolName={config.schoolName}
                githubOrg={config.githubOrg}
              />
            )}

            {activeTab === 'oversight' && (
              <MasterOversightDashboard
                currentUserRole={currentUserRole}
                currentUserName={currentUserName}
                schoolName={config.schoolName}
                githubOrg={config.githubOrg}
              />
            )}

            {activeTab === 'contributions' && (
              <ContributionTrackerView
                schoolName={config.schoolName}
              />
            )}

            {activeTab === 'vercel-deploy' && (
              <VercelStagingDeployView
                schoolName={config.schoolName}
                githubOrg={config.githubOrg}
              />
            )}

            {activeTab === 'design-doc' && (
              <DesignDocView
                config={config}
                onNavigateTab={setActiveTab}
                onOpenAI={() => setIsAIOpen(true)}
              />
            )}

            {activeTab === 'diagrams' && (
              <DiagramStudioView
                config={config}
                onOpenAI={() => setIsAIOpen(true)}
              />
            )}

            {activeTab === 'scripts' && (
              <ScriptHubView
                config={config}
                onOpenAI={() => setIsAIOpen(true)}
              />
            )}

            {activeTab === 'simulator' && (
              <OnboardingSimulator
                config={config}
              />
            )}

            {activeTab === 'permission-matrix' && (
              <PermissionMatrixView
                config={config}
              />
            )}

            {activeTab === 'handover' && (
              <HandoverWizardView
                config={config}
              />
            )}

            {activeTab === 'proposal' && (
              <ProposalGeneratorView
                config={config}
                onOpenAI={() => setIsAIOpen(true)}
              />
            )}
            
            {activeTab === 'it-guide' && (
              <ITImplementationView
                config={config}
              />
            )}
          </Suspense>
        </main>

        {/* Geometric Balance Footer */}
        <footer className="mt-auto bg-white border-t border-slate-200 py-5 text-[10px] font-bold tracking-wide text-slate-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="bg-slate-900 text-white px-2 py-0.5 font-black text-[10px] tracking-tight">
                CLUBSYNC
              </span>
              <span className="hidden sm:inline">Enterprise Team Repository & Master Access System</span>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-4">
              <span className="hidden sm:flex items-center gap-1.5 font-semibold text-slate-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Live GitHub Sync (@{config.githubOrg})
              </span>
              <span className="hidden sm:flex items-center gap-1.5 font-semibold text-slate-700">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                Master Access Enforced
              </span>
              <span className="text-slate-500">
                Version 2.5 | Admin:{' '}
                <a
                  id="admin-profile-link"
                  href="https://ai-aarti.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-800 hover:text-blue-600 font-bold underline underline-offset-2 transition-colors inline-flex items-center gap-0.5"
                >
                  Aarti S Ravikumar
                </a>
              </span>
            </div>
          </div>
        </footer>

        {/* Configuration Modal */}
        <ConfigModal
          isOpen={isConfigOpen}
          onClose={() => setIsConfigOpen(false)}
          config={config}
          onSave={setConfig}
        />

        {/* AI Assistant Drawer */}
        <AIAssistantDrawer
          isOpen={isAIOpen}
          onClose={() => setIsAIOpen(false)}
          config={config}
        />
        {/* GitHub Live Org Modal */}
        <GitHubOrgModal
          isOpen={isGitHubModalOpen}
          onClose={() => setIsGitHubModalOpen(false)}
          currentOrg={config.githubOrg}
          onOrgChange={(newOrg) => setConfig((prev) => ({ ...prev, githubOrg: newOrg }))}
        />
      </div>
    </QueryClientProvider>
  );
}
