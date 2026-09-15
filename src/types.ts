/**
 * ClubSync Core Type Definitions
 * Architecture Design Document & Automation System for School GitHub Campus Management
 */

export type NavigationTab = 
  | 'repositories'
  | 'oversight'
  | 'contributions'
  | 'design-doc'
  | 'diagrams'
  | 'scripts'
  | 'simulator'
  | 'permission-matrix'
  | 'handover'
  | 'proposal'
  | 'it-guide'
  | 'vercel-deploy';

export type UserRole = 'student_member' | 'club_lead' | 'faculty_advisor' | 'it_admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  subteam: string;
  avatarUrl?: string;
}

export interface BranchPermissionRule {
  id: string;
  branchPattern: string; // e.g. 'main', 'dev', 'release/*'
  protectionEnabled: boolean;
  requirePR: boolean;
  requiredReviewers: number;
  enforceLinearHistory: boolean;
  restrictPushRoles: UserRole[];
  allowedPushEmails: string[];
  preventForcePush: boolean;
  preventDeletion: boolean;
  requireSecretScanning: boolean;
  updatedBy: string;
  updatedAt: string;
}

export interface RepositoryItem {
  id: string;
  name: string;
  slug: string;
  subteam: string;
  clubOwnerId: string;
  creator: {
    name: string;
    email: string;
    role: UserRole;
  };
  description: string;
  visibility: 'private' | 'public';
  isPublicRequested: boolean;
  isPublicApproved: boolean;
  advisorApprovedBy?: string;
  masterAccessEnforced: boolean; // Always true for leaders & faculty advisors
  branchRules: BranchPermissionRule[];
  defaultBranch: string;
  starsCount: number;
  forksCount: number;
  openIssuesCount: number;
  openPRsCount: number;
  healthScore: number; // 0 - 100
  createdAt: string;
  updatedAt: string;
  topics: string[];
}

export interface ContributionMetric {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: UserRole;
  avatarUrl: string;
  subteam: string;
  commitsCount: number;
  prsOpened: number;
  prsMerged: number;
  codeReviewsCount: number;
  linesAdded: number;
  linesDeleted: number;
  weeklyActivity: number[]; // 7 days of commits
  lastActive: string;
  topRepo: string;
}

export interface AuditLogEvent {
  id: string;
  timestamp: string;
  action: 'repo_created' | 'branch_protected' | 'master_override' | 'public_requested' | 'public_approved' | 'force_push_blocked' | 'access_revoked';
  performedBy: string;
  performedRole: UserRole;
  repositoryName: string;
  details: string;
  severity: 'info' | 'notice' | 'warning' | 'master_override';
}

export interface VercelDeploymentStatus {
  deploymentId: string;
  state: 'BUILDING' | 'READY' | 'ERROR';
  target: 'staging' | 'production';
  url: string;
  createdAt: string;
  buildTimeMs: number;
  branch: string;
  commitHash: string;
  commitMessage: string;
  environmentVarsVerified: boolean;
  logs: string[];
}

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
  email: string; // e.g. student@pioneercss.org
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
