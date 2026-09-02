/**
 * Graduation Handover Checklist & Steps
 */

import { HandoverStep } from '../types';

export const HANDOVER_STEPS: HandoverStep[] = [
  {
    id: 'step-1',
    category: 'governance',
    title: 'Nominate Successor Lead in Google Workspace',
    description: 'Add the incoming Junior Vice-President or designated Club Captain to the Google Group robotics-leads@school.edu in Google Workspace Admin Console.',
    requiredForGraduation: true,
    automatedCheck: true,
    status: 'completed',
    assignedTo: 'Outgoing President',
    verificationInstructions: 'Verify that incoming lead receives Google Workspace email invite and appears in robotics-leads group.'
  },
  {
    id: 'step-2',
    category: 'google-workspace',
    title: 'Assign Google Workspace API Delegation Rights',
    description: 'Ensure incoming Lead Admin has edit access to Google Apps Script sync project or Google Service Account json credentials.',
    requiredForGraduation: true,
    automatedCheck: true,
    status: 'completed',
    assignedTo: 'Outgoing President',
    verificationInstructions: 'Open Google Apps Script project settings > Sharing > Add incoming lead email with Editor permission.'
  },
  {
    id: 'step-3',
    category: 'github-enterprise',
    title: 'Promote Successor to GitHub Organization Owner',
    description: 'Grant Organization Owner role to incoming lead in GitHub Organization Settings > Members.',
    requiredForGraduation: true,
    automatedCheck: true,
    status: 'in_progress',
    assignedTo: 'Outgoing President',
    verificationInstructions: 'Incoming lead accepts GitHub Org Owner invitation in GitHub web UI.'
  },
  {
    id: 'step-4',
    category: 'keys-secrets',
    title: 'Rotate Webhook Secrets & GitHub Personal Access Tokens',
    description: 'Generate new GitHub Fine-Grained Personal Access Tokens and update Script Properties in Google Apps Script.',
    requiredForGraduation: true,
    automatedCheck: false,
    status: 'pending',
    assignedTo: 'Incoming President',
    verificationInstructions: 'Execute dry-run sync test in Apps Script editor and confirm "200 OK" response code.'
  },
  {
    id: 'step-5',
    category: 'governance',
    title: 'Verify Faculty Advisor Break-Glass Access',
    description: 'Confirm that faculty-advisor@school.edu retains active Organization Owner access and 2FA recovery backup codes.',
    requiredForGraduation: true,
    automatedCheck: true,
    status: 'pending',
    assignedTo: 'Faculty Sponsor',
    verificationInstructions: 'Faculty advisor logs into GitHub and confirms ability to view Organization settings.'
  },
  {
    id: 'step-6',
    category: 'knowledge-transfer',
    title: 'Archive Cad / Code & Conduct Architecture Walkthrough',
    description: 'Ensure all local branches are pushed, documentation readmes updated, and a 1-hour recorded walkthrough session is uploaded to Google Drive.',
    requiredForGraduation: false,
    automatedCheck: false,
    status: 'pending',
    assignedTo: 'Outgoing Officers',
    verificationInstructions: 'Shared Google Drive folder contains recorded walkthrough link and architectural handover document.'
  },
  {
    id: 'step-7',
    category: 'google-workspace',
    title: 'Demote Outgoing Admin to Alumni Group',
    description: 'Move outgoing lead from robotics-leads@school.edu to robotics-alumni@school.edu in Google Workspace.',
    requiredForGraduation: true,
    automatedCheck: true,
    status: 'pending',
    assignedTo: 'Incoming President',
    verificationInstructions: 'Sync script runs automatically and downgrades outgoing lead from GitHub Org Owner to Alumni team member.'
  }
];
