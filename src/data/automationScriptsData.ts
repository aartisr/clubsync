/**
 * Production-Grade Automation Scripts and Code Templates
 * Executable Google Apps Script, Node.js, GitHub Actions, and CLI Scripts
 */

import { AutomationScript } from '../types';

export const AUTOMATION_SCRIPTS: AutomationScript[] = [
  {
    id: 'google-apps-script',
    title: 'Google Apps Script Directory Sync Engine (Code.gs)',
    category: 'google-apps-script',
    fileExtension: 'gs',
    language: 'javascript',
    description: 'Standalone Google Apps Script deployed directly in Google Workspace Admin Console. Periodically checks Google Groups and updates GitHub Teams via GitHub REST API.',
    useCase: 'Zero-infrastructure sync engine hosted directly on Google Apps Script (free, zero server maintenance required).',
    prerequisites: [
      'Enable "AdminDirectory" Advanced Service in Google Apps Script editor',
      'Create a GitHub Personal Access Token (Fine-grained or Classic with admin:org scope)',
      'Store GITHUB_TOKEN and GITHUB_ORG in Apps Script Script Properties'
    ],
    parameters: [
      { key: 'SCHOOL_DOMAIN', label: 'School Domain', defaultValue: 'school.edu', placeholder: 'e.g., myschool.edu', description: 'Primary Google Workspace domain name.' },
      { key: 'GITHUB_ORG', label: 'GitHub Organization Name', defaultValue: 'school-robotics-org', placeholder: 'e.g., hyperion-robotics', description: 'Target GitHub Organization name.' },
      { key: 'ADMIN_EMAIL', label: 'Club Admin Email', defaultValue: 'robotics-lead@school.edu', placeholder: 'admin@school.edu', description: 'Primary administrator email for alerts.' }
    ],
    codeTemplate: `/**
 * ClubSync - Google Workspace Group to GitHub Team Sync
 * Target School Domain: {{SCHOOL_DOMAIN}}
 * Target GitHub Org: {{GITHUB_ORG}}
 */

// Configuration Constants stored in Script Properties
function getScriptConfig() {
  const props = PropertiesService.getScriptProperties();
  return {
    githubToken: props.getProperty('GITHUB_TOKEN') || 'YOUR_GITHUB_PAT_TOKEN',
    githubOrg: '{{GITHUB_ORG}}',
    schoolDomain: '{{SCHOOL_DOMAIN}}',
    adminEmail: '{{ADMIN_EMAIL}}'
  };
}

/**
 * Mapping table: Google Workspace Group Email -> GitHub Team Slug
 */
const GROUP_TO_TEAM_MAPPING = {
  'robotics-leads@{{SCHOOL_DOMAIN}}': 'robotics-leads',
  'robotics-software@{{SCHOOL_DOMAIN}}': 'robotics-software',
  'robotics-hardware@{{SCHOOL_DOMAIN}}': 'robotics-hardware',
  'cs-developers@{{SCHOOL_DOMAIN}}': 'cs-developers',
  'cross-club-robotics-cs@{{SCHOOL_DOMAIN}}': 'cross-club-robotics-cs'
};

/**
 * Main Sync Function - Set on a 15-minute Time-Driven Trigger
 */
function syncGoogleGroupsToGitHubTeams() {
  const config = getScriptConfig();
  console.log('=== Starting ClubSync Directory Sync for ' + config.githubOrg + ' ===');
  
  for (const [groupEmail, teamSlug] of Object.entries(GROUP_TO_TEAM_MAPPING)) {
    try {
      console.log('Processing Group: ' + groupEmail + ' -> Team: ' + teamSlug);
      
      // 1. Fetch member emails from Google Workspace Admin Directory API
      const groupMembers = getGoogleGroupMemberEmails(groupEmail);
      console.log('Found ' + groupMembers.length + ' members in Google Group: ' + groupEmail);
      
      // 2. Sync each member to corresponding GitHub Team
      for (const email of groupMembers) {
        syncUserToGitHubTeam(config, email, teamSlug);
      }
    } catch (err) {
      console.error('Error syncing group ' + groupEmail + ': ' + err.message);
      sendAdminAlert(config.adminEmail, 'Sync Failure: ' + groupEmail, err.message);
    }
  }
  
  console.log('=== Directory Sync Completed Successfully ===');
}

/**
 * Helper: Fetch members from Google Group using AdminDirectory API
 */
function getGoogleGroupMemberEmails(groupEmail) {
  const memberEmails = [];
  let pageToken;
  
  do {
    const response = AdminDirectory.Members.list(groupEmail, {
      maxResults: 200,
      pageToken: pageToken
    });
    
    if (response.members) {
      response.members.forEach(m => {
        if (m.type === 'USER' && m.status === 'ACTIVE') {
          memberEmails.push(m.email.toLowerCase());
        }
      });
    }
    pageToken = response.nextPageToken;
  } while (pageToken);
  
  return memberEmails;
}

/**
 * Helper: Resolve GitHub handle from school email and add to GitHub Team
 */
function syncUserToGitHubTeam(config, email, teamSlug) {
  // Extract handle before @ if handle mapping not provided
  const handleGuess = email.split('@')[0].replace(/[^a-zA-Z0-9-]/g, '');
  
  const url = 'https://api.github.com/orgs/' + config.githubOrg + '/teams/' + teamSlug + '/memberships/' + handleGuess;
  
  const options = {
    method: 'put',
    headers: {
      'Authorization': 'token ' + config.githubToken,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'ClubSync-GoogleAppsScript'
    },
    payload: JSON.stringify({ role: teamSlug.includes('leads') ? 'maintainer' : 'member' }),
    contentType: 'application/json',
    muteHttpExceptions: true
  };
  
  const response = UrlFetchApp.fetch(url, options);
  const responseCode = response.getResponseCode();
  
  if (responseCode === 200 || responseCode === 201) {
    console.log('SUCCESS: Synchronized ' + email + ' (' + handleGuess + ') to Team ' + teamSlug);
  } else {
    console.warn('NOTICE (' + responseCode + ') for ' + email + ': ' + response.getContentText());
  }
}

/**
 * Send Email Alert on Sync Exception
 */
function sendAdminAlert(adminEmail, subject, body) {
  MailApp.sendEmail({
    to: adminEmail,
    subject: '[ClubSync Alert] ' + subject,
    htmlBody: '<h3>ClubSync Automated Directory Alert</h3><p>' + body + '</p>'
  });
}
`
  },
  {
    id: 'nodejs-server',
    title: 'Node.js Express Directory Sync Webhook Server',
    category: 'nodejs-server',
    fileExtension: 'ts',
    language: 'typescript',
    description: 'Server-side Node.js TypeScript webhook server that listens for Google Admin SDK Directory API push notifications for instant, real-time member onboarding.',
    useCase: 'Real-time corporate/university enterprise sync with sub-second event dispatch.',
    prerequisites: [
      'Node.js 20+ runtime',
      'Google Service Account with Domain-Wide Delegation (Admin Directory Scopes)',
      'GitHub Organization Admin Access Token'
    ],
    parameters: [
      { key: 'SCHOOL_DOMAIN', label: 'School Domain', defaultValue: 'school.edu', placeholder: 'school.edu', description: 'School domain' },
      { key: 'GITHUB_ORG', label: 'GitHub Org', defaultValue: 'school-robotics-org', placeholder: 'school-robotics-org', description: 'Target GitHub Organization' }
    ],
    codeTemplate: `import express from 'express';
import { google } from 'googleapis';
import { Octokit } from '@octokit/rest';

const app = express();
app.use(express.json());

const GITHUB_ORG = process.env.GITHUB_ORG || '{{GITHUB_ORG}}';
const SCHOOL_DOMAIN = process.env.SCHOOL_DOMAIN || '{{SCHOOL_DOMAIN}}';

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

/**
 * Google Admin Directory API Service Initialization with Service Account
 */
const auth = new google.auth.GoogleAuth({
  keyFile: './google-service-account.json',
  scopes: [
    'https://www.googleapis.com/auth/admin.directory.group.readonly',
    'https://www.googleapis.com/auth/admin.directory.user.readonly'
  ],
  clientOptions: { subject: 'admin@' + SCHOOL_DOMAIN }
});

const adminDirectory = google.admin({ version: 'directory_v1', auth });

/**
 * Webhook Route: Google Workspace Directory Push Notification
 */
app.post('/api/workspace/webhook', async (req, res) => {
  const resourceState = req.headers['x-goog-resource-state'];
  console.log(\`Received Google Directory Event: \${resourceState}\`);

  if (resourceState === 'sync') {
    return res.status(200).send('Webhook subscription verified');
  }

  try {
    // Process Google Group changes
    await syncAllClubTeams();
    res.status(200).json({ status: 'success', syncedAt: new Date().toISOString() });
  } catch (err: any) {
    console.error('Webhook sync failed:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * Sync Google Workspace Groups to GitHub Teams
 */
async function syncAllClubTeams() {
  const teamMappings = [
    { group: \`robotics-software@\${SCHOOL_DOMAIN}\`, team: 'robotics-software' },
    { group: \`robotics-leads@\${SCHOOL_DOMAIN}\`, team: 'robotics-leads' },
    { group: \`cross-club-robotics-cs@\${SCHOOL_DOMAIN}\`, team: 'cross-club-robotics-cs' }
  ];

  for (const mapping of teamMappings) {
    console.log(\`Syncing \${mapping.group} -> \${mapping.team}\`);
    
    // 1. Get Group Members from Google Directory
    const membersRes = await adminDirectory.members.list({ groupKey: mapping.group });
    const members = membersRes.data.members || [];

    for (const member of members) {
      if (!member.email) continue;
      const username = member.email.split('@')[0].replace(/[^a-zA-Z0-9-]/g, '');

      // 2. Add or Invite to GitHub Team via Octokit
      await octokit.rest.teams.addOrUpdateMembershipForUserInOrg({
        org: GITHUB_ORG,
        team_slug: mapping.team,
        username: username,
        role: mapping.team.includes('leads') ? 'maintainer' : 'member'
      });
      
      console.log(\`Added \${username} (\${member.email}) to GitHub Team: \${mapping.team}\`);
    }
  }
}

app.listen(3000, () => console.log('ClubSync Webhook Server listening on port 3000'));
`
  },
  {
    id: 'github-actions',
    title: 'GitHub Action: Automated Repository Provisioner & Email Validator',
    category: 'github-actions',
    fileExtension: 'yml',
    language: 'yaml',
    description: 'GitHub Actions workflow triggered on repository creation or push. Automatically enforces branch protection, verifies committer emails match @school.edu, and attaches Codeowners.',
    useCase: 'Enforce school compliance and branch protection rules automatically across all new club repositories.',
    prerequisites: [
      'Add workflow to template repositories under .github/workflows/policy.yml',
      'Set PAT token in secrets: ORG_ADMIN_TOKEN'
    ],
    parameters: [
      { key: 'SCHOOL_DOMAIN', label: 'School Domain', defaultValue: 'school.edu', placeholder: 'school.edu', description: 'Required email domain.' }
    ],
    codeTemplate: `name: ClubSync Compliance & Branch Security Policy

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  verify-school-email:
    name: Verify School Email Identity (@{{SCHOOL_DOMAIN}})
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Validate Committer Email Domain
        run: |
          COMMITTER_EMAIL=$(git log -1 --pretty=format:'%ae')
          echo "Committer Email: $COMMITTER_EMAIL"
          
          if [[ "$COMMITTER_EMAIL" != *"@{{SCHOOL_DOMAIN}}" ]]; then
            echo "ERROR: Commits must be authored using your official school email (@{{SCHOOL_DOMAIN}})."
            echo "Please configure git: git config user.email 'yourname@{{SCHOOL_DOMAIN}}'"
            exit 1
          fi
          echo "SUCCESS: School email domain verified."

  enforce-codeowners:
    name: Codeowners & Security Scan
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Ensure CODEOWNERS File Exists
        run: |
          if [ ! -f CODEOWNERS ] && [ ! -f .github/CODEOWNERS ]; then
            echo "WARNING: No CODEOWNERS file found! Creating default CODEOWNERS..."
            mkdir -p .github
            echo "* @school-robotics-org/robotics-leads" > .github/CODEOWNERS
          fi

      - name: Run Secret Protection Scan
        uses: trufflesecurity/trufflehog-main-action@main
        with:
          path: ./
          base: \${{ github.event.repository.default_branch }}
`
  },
  {
    id: 'cli-script',
    title: 'GitHub CLI Shell Bootstrapper (setup-school-org.sh)',
    category: 'cli-script',
    fileExtension: 'sh',
    language: 'bash',
    description: 'One-click shell script using GitHub CLI (`gh`) to provision the entire club hierarchy, teams, base settings, and cross-club repositories in minutes.',
    useCase: 'Initial setup or rapid organization bootstrapping for new school clubs.',
    prerequisites: ['Install GitHub CLI (`gh`)', 'Run `gh auth login` with Organization Admin account'],
    parameters: [
      { key: 'GITHUB_ORG', label: 'GitHub Org', defaultValue: 'school-robotics-org', placeholder: 'school-robotics-org', description: 'Target Organization' }
    ],
    codeTemplate: `#!/usr/bin/env bash
# ==============================================================================
# ClubSync - GitHub Education Organization Initializer
# Target Org: {{GITHUB_ORG}}
# ==============================================================================

set -euo pipefail

ORG="{{GITHUB_ORG}}"

echo "🚀 Starting ClubSync Organization Setup for $ORG..."

# 1. Create Core Club Teams
echo "📁 Creating Robotics Club Teams..."
gh api -X POST "/orgs/$ORG/teams" -f name="robotics-leads" -f description="Robotics Executive Leads" -f privacy="closed"
gh api -X POST "/orgs/$ORG/teams" -f name="robotics-software" -f description="Robotics Software Engineers" -f privacy="closed"
gh api -X POST "/orgs/$ORG/teams" -f name="robotics-hardware" -f description="Robotics Hardware Engineers" -f privacy="closed"

echo "📁 Creating Computer Science Club Teams..."
gh api -X POST "/orgs/$ORG/teams" -f name="cs-leads" -f description="CS Club Leads" -f privacy="closed"
gh api -X POST "/orgs/$ORG/teams" -f name="cs-developers" -f description="CS Club Developers" -f privacy="closed"

echo "📁 Creating Cross-Club Joint Collaboration Teams..."
gh api -X POST "/orgs/$ORG/teams" -f name="cross-club-robotics-cs" -f description="Joint Robotics & CS AI Team" -f privacy="closed"

# 2. Provision Core Repositories
echo "📦 Creating Club Internal Repositories..."
gh repo create "$ORG/robotics-control-os" --private --description "Robotics Core Firmware OS" || true
gh repo create "$ORG/robotics-chassis-cad" --private --description "Robotics CAD & Hardware Schematics" || true

echo "📦 Creating Cross-Club Joint Repositories..."
gh repo create "$ORG/vision-ai-shared" --private --description "Co-developed Vision AI system for Robotics & CS" || true

echo "📦 Creating Shared Asset Templates..."
gh repo create "$ORG/club-website-template" --internal --template --description "Generic React + Tailwind Website Template for School Clubs" || true

# 3. Assign Permissions to Teams
echo "🔐 Mapping Permissions..."
# Robotics Software Team -> Write on Control OS
gh api -X PUT "/orgs/$ORG/teams/robotics-software/repos/$ORG/robotics-control-os" -f permission="push"

# Cross-Club Team -> Write on Vision AI Shared
gh api -X PUT "/orgs/$ORG/teams/cross-club-robotics-cs/repos/$ORG/vision-ai-shared" -f permission="push"

# CS Developers -> Write on Website Template
gh api -X PUT "/orgs/$ORG/teams/cs-developers/repos/$ORG/club-website-template" -f permission="push"

echo "✅ ClubSync Organization Setup Complete!"
`
  },
  {
    id: 'sso-saml',
    title: 'Google Workspace SAML 2.0 Configuration Template (sso-config.json)',
    category: 'sso-saml',
    fileExtension: 'json',
    language: 'json',
    description: 'Exact SSO metadata mapping values required in Google Workspace Admin Console under Apps > SAML Apps for GitHub Enterprise Cloud.',
    useCase: 'Guide school IT administrators through configuring Google Workspace as the Single Sign-On IdP.',
    prerequisites: ['Google Workspace Admin privilege', 'GitHub Enterprise / Campus Admin privilege'],
    parameters: [
      { key: 'SCHOOL_DOMAIN', label: 'School Domain', defaultValue: 'school.edu', placeholder: 'school.edu', description: 'School domain' },
      { key: 'GITHUB_ORG', label: 'GitHub Org', defaultValue: 'school-robotics-org', placeholder: 'school-robotics-org', description: 'Target GitHub Org' }
    ],
    codeTemplate: `{
  "saml_configuration": {
    "identity_provider": "Google Workspace Admin Console",
    "application_name": "GitHub Enterprise - {{SCHOOL_DOMAIN}} Clubs",
    "sp_entity_id": "https://github.com/orgs/{{GITHUB_ORG}}",
    "acs_url": "https://github.com/orgs/{{GITHUB_ORG}}/saml/consume",
    "name_id_format": "EMAIL",
    "name_id_attribute": "Basic Information > Primary Email",
    "attribute_mappings": {
      "User.Email": "Basic Information > Primary Email",
      "User.FirstName": "Basic Information > First Name",
      "User.LastName": "Basic Information > Last Name"
    },
    "security_policies": {
      "enforce_2fa": true,
      "allowed_email_domains": ["{{SCHOOL_DOMAIN}}"],
      "session_duration_hours": 24
    }
  }
}`
  }
];
