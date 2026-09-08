
export interface ITStep {
  id: string;
  phase: string;
  title: string;
  duration: string;
  description: string;
  actions: string[];
  owner: string;
  outcome: string;
}

export const IT_STEPS: ITStep[] = [
  {
    id: 'phase-1',
    phase: 'Phase 1',
    title: 'Institutional Approval & GitHub Campus Upgrade',
    duration: '5 Mins Apply | 1-5 Days Approval',
    description: 'GitHub Education provides GitHub Enterprise Cloud for free to schools. This is required for SAML SSO (logging in with @pioneercss.org).',
    actions: [
      'Navigate to education.github.com/institutions',
      'Select "GitHub Campus Program"',
      'Provide school ID/Employment letter and domain (pioneercss.org)'
    ],
    owner: 'IT Director / Faculty Sponsor',
    outcome: 'Institutional Enterprise Account spawned with free Organization capability.'
  },
  {
    id: 'phase-2',
    phase: 'Phase 2',
    title: 'Identity Integration (Google Workspace SAML SSO)',
    duration: '15 Minutes | No Code',
    description: 'Bind GitHub to Google Workspace so students login with school credentials without new passwords.',
    actions: [
      'In Google Admin Console: Apps > Web and mobile apps > Add App > Search for "GitHub" (SAML)',
      'Map ACS URL & Entity ID from GitHub Org Settings > Authentication Security',
      'Map "Primary Email" to NameID in Google Attribute Mapping',
      'Upload Google SSO Certificate to GitHub'
    ],
    owner: 'IT Director',
    outcome: 'One-click login enabled for all students via @pioneercss.org.'
  },
  {
    id: 'phase-3',
    phase: 'Phase 3',
    title: 'Directory Automation (The ClubSync Engine)',
    duration: '20 Minutes | Automated Sync',
    description: 'Automate the manual work. Adding a student to a Google Group automatically invites them to GitHub.',
    actions: [
      'Create Google Groups (e.g., robotics-leads@pioneercss.org)',
      'Deploy ClubSync Apps Script from the Script Hub',
      'Configure GitHub Org Name & PAT (Personal Access Token)',
      'Set a Time-driven trigger (every 15 mins) in Apps Script'
    ],
    owner: 'IT Director / Student Lead',
    outcome: 'Zero-touch provisioning. IT manages groups; GitHub stays in sync.'
  },
  {
    id: 'phase-4',
    phase: 'Phase 4',
    title: 'Security & FERPA Guardrails',
    duration: '10 Minutes | One-Time Policy',
    description: 'Enforce safety standards so code remains institutional property and secrets are never leaked.',
    actions: [
      'Organization Settings > Repository Rulesets > "Protect Main Branch"',
      'Enable Secret Scanning & Push Protection',
      'Set Base Organization Permissions to "No Access" (Least Privilege)'
    ],
    owner: 'IT Director',
    outcome: 'Automated push-blocking of passwords and restricted member access.'
  }
];
