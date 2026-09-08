import React, { lazy, Suspense, useState } from 'react';
import { NavigationTab, SchoolConfig } from './types';
import { Navbar } from './components/Navbar';
import { ConfigModal } from './components/ConfigModal';
import { AIAssistantDrawer } from './components/AIAssistantDrawer';

const DesignDocView = lazy(() => import('./components/DesignDocView').then(({ DesignDocView }) => ({ default: DesignDocView })));
const DiagramStudioView = lazy(() => import('./components/DiagramStudioView').then(({ DiagramStudioView }) => ({ default: DiagramStudioView })));
const ScriptHubView = lazy(() => import('./components/ScriptHubView').then(({ ScriptHubView }) => ({ default: ScriptHubView })));
const OnboardingSimulator = lazy(() => import('./components/OnboardingSimulator').then(({ OnboardingSimulator }) => ({ default: OnboardingSimulator })));
const PermissionMatrixView = lazy(() => import('./components/PermissionMatrixView').then(({ PermissionMatrixView }) => ({ default: PermissionMatrixView })));
const HandoverWizardView = lazy(() => import('./components/HandoverWizardView').then(({ HandoverWizardView }) => ({ default: HandoverWizardView })));
const ProposalGeneratorView = lazy(() => import('./components/ProposalGeneratorView').then(({ ProposalGeneratorView }) => ({ default: ProposalGeneratorView })));
const ITImplementationView = lazy(() => import('./components/ITImplementationView').then(({ ITImplementationView }) => ({ default: ITImplementationView })));

const WorkspaceLoading = () => (
  <div className="mx-auto flex min-h-56 max-w-7xl items-center px-4 sm:px-6 lg:px-8" role="status" aria-live="polite">
    <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 shadow-sm">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" aria-hidden="true" />
      Loading workspace…
    </div>
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('design-doc');
  const [isConfigOpen, setIsConfigOpen] = useState<boolean>(false);
  const [isAIOpen, setIsAIOpen] = useState<boolean>(false);

  const [config, setConfig] = useState<SchoolConfig>({
    schoolName: 'PCSS II',
    domain: 'pioneercss.org',
    githubOrg: 'pcss2-robotics',
    adminEmail: 'it@pioneercss.org',
    roboticsLeadEmail: 'robotics@pioneercss.org',
    secondaryClubLeadEmail: 'csclub@pioneercss.org'
  });

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-100 text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white flex flex-col">
      
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        config={config}
        onOpenConfig={() => setIsConfigOpen(true)}
        onOpenAI={() => setIsAIOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 pb-8 sm:pb-12">
        <Suspense fallback={<WorkspaceLoading />}>
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
            <span className="hidden sm:inline">Governance workspace</span>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-4">
            <span className="hidden sm:flex items-center gap-1.5 font-semibold text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              SSO Connected (@{config.domain})
            </span>
            <span className="hidden sm:flex items-center gap-1.5 font-semibold text-slate-700">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              Backup Enabled ({config.githubOrg})
            </span>
            <span className="text-slate-500">
              Version 2.4 | Admin:{' '}
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
    </div>
  );
}
