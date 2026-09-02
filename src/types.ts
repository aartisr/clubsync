/**
 * ClubSync Core Type Definitions
 * Architecture Design Document & Automation System for School GitHub Campus Management
 */

export type NavigationTab = 
  | 'design-doc'
  | 'diagrams'
  | 'scripts'
  | 'simulator'
  | 'permission-matrix'
  | 'handover'
  | 'proposal';

export type PermissionLevel = 'admin' | 'maintain' | 'write' | 'triage' | 'read' | 'none';

export interface ClubInfo {
  id: string;
  name: string;
  code: string;
  color: string;
  iconName: string;
  description: string;
  leadRole: string;
  googleGroupEmail: string;
  teams: ClubTeam[];
}

export interface ClubTeam {
  id: string;
  name: string;
  googleGroup: string;
  githubTeamSlug: string;
  description: string;
  defaultPermission: PermissionLevel;
  isCrossClub?: boolean;
}

export interface RepositorySpec {
  id: string;
  name: string;
  clubOwnerId: string; // 'robotics', 'cs', 'cross-club', etc.
  type: 'internal' | 'cross-club-public' | 'cross-club-private' | 'shared-assets' | 'archived';
  description: string;
  isTemplate?: boolean;
  visibility: 'private' | 'internal' | 'public';
  teamPermissions: Record<string, PermissionLevel>; // teamSlug -> PermissionLevel
  branchProtection: {
    requirePR: boolean;
    requiredApprovals: number;
    dismissStaleApprovals: boolean;
    requireCodeOwners: boolean;
    requireStatusChecks: boolean;
  };
}

export interface DiagramZone {
  id: string;
  label: string;
  badge?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  theme: 'blue' | 'purple' | 'emerald' | 'amber' | 'slate';
  description?: string;
}

export interface DiagramNode {
  id: string;
  label: string;
  type: 'system' | 'user' | 'group' | 'github-team' | 'repo' | 'process' | 'security';
  description: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  icon?: string;
  badge?: string;
  details?: string[];
  zoneId?: string;
  executivePoint?: string;
}

export interface DiagramEdge {
  id: string;
  from: string;
  to: string;
  label: string;
  protocol?: string;
  animated?: boolean;
  description?: string;
  routing?: 'horizontal' | 'vertical' | 'curved' | 'return';
  labelOffset?: { x?: number; y?: number };
}

export interface DiagramSpec {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon?: string;
  canvasWidth?: number;
  canvasHeight?: number;
  zones?: DiagramZone[];
  executiveBrief?: {
    overview: string;
    managementBenefits: string[];
    governanceChecks: string[];
    decisionImpact: string;
  };
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  walkthroughSteps: {
    stepNumber: number;
    title: string;
    description: string;
    managementRationale?: string;
    highlightNodes: string[];
    highlightEdges: string[];
  }[];
}

export interface AutomationScript {
  id: string;
  title: string;
  category: 'google-apps-script' | 'nodejs-server' | 'github-actions' | 'cli-script' | 'sso-saml';
  fileExtension: string;
  language: string;
  description: string;
  useCase: string;
  prerequisites: string[];
  codeTemplate: string; // Dynamic script with variables like {{SCHOOL_DOMAIN}}, {{GITHUB_ORG}}, etc.
  parameters: ScriptParameter[];
}

export interface ScriptParameter {
  key: string;
  label: string;
  defaultValue: string;
  placeholder: string;
  description: string;
}

export interface SimulationUser {
  id: string;
  name: string;
  email: string; // e.g. student@school.edu
  primaryClub: string;
  secondaryClubs: string[];
  selectedGroups: string[];
  status: 'idle' | 'groups_assigned' | 'webhook_dispatched' | 'github_invited' | 'teams_joined' | 'completed' | 'error';
  auditLogs: { timestamp: string; step: string; status: 'info' | 'success' | 'warning' | 'error'; message: string }[];
}

export interface HandoverStep {
  id: string;
  category: 'governance' | 'google-workspace' | 'github-enterprise' | 'keys-secrets' | 'knowledge-transfer';
  title: string;
  description: string;
  requiredForGraduation: boolean;
  automatedCheck?: boolean;
  status: 'pending' | 'in_progress' | 'completed' | 'verified';
  assignedTo: string;
  verificationInstructions: string;
}

export interface ProposalSection {
  id: string;
  title: string;
  content: string;
  keyBenefits: string[];
  complianceNotes?: string;
}

export interface SchoolConfig {
  schoolName: string;
  domain: string;
  githubOrg: string;
  adminEmail: string;
  roboticsLeadEmail: string;
  secondaryClubLeadEmail: string;
}

export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
