/**
 * Detailed Architecture Design Document Data
 * Comprehensive architectural guide for school clubs GitHub Campus organization
 */

export interface DesignDocSection {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  icon: string;
  summary: string;
  contentMarkdown: string;
  keyTakeaways: string[];
  diagramRef?: string;
  scriptsRef?: string[];
}

export const DESIGN_DOC_SECTIONS: DesignDocSection[] = [
  {
    id: 'executive-summary',
    number: '1.0',
    title: 'Executive Summary & Core Strategy',
    subtitle: 'Unified GitHub Campus Governance with School-Owned Google Workspace Accounts',
    icon: 'ShieldCheck',
    summary: 'A scalable blueprint for unifying high school and university student clubs under a centralized, school-owned GitHub Education Organization managed via Google Workspace API automation.',
    keyTakeaways: [
      '100% School Account Ownership: All GitHub accounts, teams, and repositories are anchored to school-issued @pioneercss.org Google Workspace identities.',
      'Automated Lifecycle Management: Zero-manual-overhead student onboarding and offboarding powered by Google Admin Directory API sync.',
      'Cross-Club Collaboration: Multi-club partitioning allows Robotics, CS, Autonomous Vehicle, and Design teams to co-develop without security spillover.',
      'Smooth Handover Protocol: Turnkey leadership transition framework ensures project continuity when student admins graduate.'
    ],
    diagramRef: 'system-architecture',
    contentMarkdown: `
### 1.1 Context & Problem Statement
Student clubs—especially specialized engineering and technical teams like **Robotics**, **Computer Science**, and **Autonomous Vehicles**—frequently suffer from fragile infrastructure management. Key issues include:
* **Personal Account Sprawl:** Students create personal GitHub accounts, leading to lost ownership when members graduate or leave.
* **Over-privileged Access:** Admins grant broad "Admin" or "Owner" permissions because setting up granular teams manually is tedious.
* **Club Silos vs. Cross-Club Collaboration:** Clubs struggle to share common software components (e.g., Computer Vision algorithms, CAD libraries, Web UI components) without giving away administrative rights to club-internal code.
* **Graduation Abandonment:** When student founders graduate, repositories become orphaned, API keys expire, and institutional memory is permanently lost.

### 1.2 Proposed Architecture Overview
This design document establishes **ClubSync**, a production-ready organizational architecture leveraging **GitHub Education / GitHub Enterprise Cloud** paired with **Google Workspace API Automation**.

#### Key Architectural Pillars:
1. **Single Sign-On (SAML 2.0 / OIDC):** Enforces authentication exclusively through school Google Workspace accounts (\`@pioneercss.org\`).
2. **Directory-Driven Group Sync:** Google Workspace Groups (\`robotics-leads@pioneercss.org\`, \`robotics-software@pioneercss.org\`, \`cross-club-robotics-cs@pioneercss.org\`) automatically mirror to GitHub Teams via background API sync scripts.
3. **Partitioned Repositories with Cross-Club Shared Hubs:** Repositories are strictly categorized into *Club Internal*, *Cross-Club Public*, *Cross-Club Private*, and *Shared Asset Libraries*.
4. **Graduation Handover System:** Built-in transition protocol with break-glass admin accounts, ownership verification checklists, and automated access transfer scripts.
`
  },
  {
    id: 'github-org-structure',
    number: '2.0',
    title: 'GitHub Organization & Partitioning Architecture',
    subtitle: 'Structuring Teams, Repositories, and Cross-Club Synergy',
    icon: 'Layers',
    summary: 'Hierarchical partitioning strategy designed to maintain operational isolation for club secrets while encouraging open cross-club software reuse.',
    keyTakeaways: [
      'Top-Level Organization: Single root GitHub Organization for all school clubs (or a dedicated Club Alliance org).',
      'Nested GitHub Teams: Mirrors Google Workspace organizational units and club committees.',
      'Four-Tier Repository Partitioning: Internal, Cross-Club Public, Cross-Club Private, and Shared Asset Templates.',
      'Zero Direct Member Assignments: All repository permissions are granted strictly via GitHub Teams.'
    ],
    diagramRef: 'team-hierarchy',
    contentMarkdown: `
### 2.1 Organization Partitioning Model
To allow the **Robotics Club** to operate independently while collaborating with the Computer Science, Autonomous Racing, and Design clubs, the GitHub Organization is structured hierarchically.

\`\`\`
School GitHub Education Organization (@pcss2-robotics)
├── 🏢 Robotics Club
│   ├── 👥 Team: robotics-leads (Admin on robotics repos)
│   ├── 👥 Team: robotics-software (Write on software repos, Read on hardware CAD)
│   ├── 👥 Team: robotics-hardware (Write on CAD/hardware repos)
│   └── 👥 Team: robotics-business (Write on outreach & website repos)
├── 🏢 Computer Science Club
│   ├── 👥 Team: cs-leads
│   └── 👥 Team: cs-developers
├── 🔀 Cross-Club Innovation Hub
│   ├── 👥 Team: cross-club-robotics-cs (Shared Team: Robotics + CS members)
│   └── 👥 Team: cross-club-all-members (Read access to shared utilities)
└── 📦 Repository Partitioning
    ├── [Internal] robotics-control-os (Private to Robotics)
    ├── [Internal] robotics-chassis-cad (Private to Robotics)
    ├── [Cross-Club Private] vision-ai-shared (Robotics + CS co-developed)
    ├── [Shared Asset] club-website-template (Generic template for all school clubs)
    └── [Public] school-robotics-open-source (Public showcase for competition)
\`\`\`

### 2.2 Repository Partitioning Matrix
Repositories must adhere to strict naming conventions and privacy visibility tiers:

| Partition Type | Visibility | Access Rules | Example Repositories |
| :--- | :--- | :--- | :--- |
| **Club Internal** | Private | Only accessible by assigned Club Teams (e.g., Robotics Software team). | \`robotics-drive-firmware\`, \`robotics-cad-2026\` |
| **Cross-Club Private** | Private / Internal | Accessible by specific cross-club teams via joint Google Groups. | \`joint-vision-ai-system\`, \`autonomous-kart-telemetry\` |
| **Shared Assets / Templates** | Internal (Org-wide) | Read-only for all school club members; template repository enabled. | \`school-club-website-template\`, \`python-ros2-boilerplate\` |
| **Public Showcase** | Public | World-readable; maintained by Club Leads with strict Branch Protection. | \`first-robotics-2026-public\`, \`school-club-portal\` |

### 2.3 Rule: No Direct User Permissions
**CRITICAL RULE:** Individual GitHub user accounts are **NEVER** added directly to repositories or granted standalone permissions. All rights are granted exclusively through **GitHub Teams**, which in turn are populated dynamically by **Google Workspace Groups**.
`
  },
  {
    id: 'workspace-sso-auth',
    number: '3.0',
    title: 'Google Workspace Identity & SSO Mapping',
    subtitle: 'Enforcing School Account Ownership and SAML 2.0 / OIDC Authentication',
    icon: 'Key',
    summary: 'Binding GitHub member identities directly to institutional Google Workspace accounts to guarantee school ownership and immediate access revocation upon student withdrawal or graduation.',
    keyTakeaways: [
      'SAML 2.0 / OIDC Single Sign-On: Google Workspace serves as the central Identity Provider (IdP).',
      'NameID Mapping: Google primary email (student@pioneercss.org) mapped as GitHub SAML NameID.',
      'Enforced 2FA/MFA: Google Workspace 2-Factor Authentication policies automatically apply to GitHub logins.',
      'Instant Deprovisioning: Suspending or deleting a Google account instantly revokes access across GitHub.'
    ],
    diagramRef: 'auth-mapping',
    scriptsRef: ['sso-saml'],
    contentMarkdown: `
### 3.1 Single Sign-On (SAML 2.0) Architecture
By configuring **Google Workspace as the SAML 2.0 Identity Provider (IdP)** for GitHub Enterprise Cloud / GitHub Campus, student members must authenticate with their official school Google credentials before accessing club repositories.

#### SAML Token Data Exchange
\`\`\`
[ Student Browser ] ───(1) Accesses GitHub Org───> [ GitHub Enterprise ]
       │                                                      │
       │<──(2) Redirects to Google SSO (SAML Request)─────────│
       ▼
[ Google Workspace IdP ]
       │  * Authenticates user against school directory
       │  * Enforces Google 2FA / Security policies
       │
       └──(3) SAML Response (Signed Assertion)───────────────> [ GitHub Enterprise ]
             - NameID: student.name@pioneercss.org
             - Email: student.name@pioneercss.org
             - Display Name: Student Name
             - SSO Session Established
\`\`\`

### 3.2 School Account Ownership Enforcement
1. **GitHub Education Campus Requirement:** All members must verify their school email address (\`@pioneercss.org\`).
2. **Restrict Non-School Emails:** The organization setting *"Restrict email domain notifications"* is restricted strictly to \`pioneercss.org\`.
3. **SCIM / Automated Provisioning:** Google Workspace Directory API sync automatically provisions and deprovisions member access based on organizational unit (OU) status.
`
  },
  {
    id: 'automated-onboarding',
    number: '4.0',
    title: 'Automated Onboarding & Google Workspace API Sync',
    subtitle: 'Directory-Driven Automated Team Provisioning & Lifecycle Sync',
    icon: 'Cpu',
    summary: 'Detailed specification of the Google Workspace Directory API & Google Groups automated sync engine that handles member onboarding, team joining, and automated GitHub invitations.',
    keyTakeaways: [
      'Zero-Touch Onboarding: Adding a student to a Google Group immediately triggers GitHub org & team invitations.',
      'Google Apps Script or Node.js Sync Engine: Runs every 15 minutes or via Admin SDK Webhook triggers.',
      'Automatic Role Assignment: Group naming conventions (e.g., club-robotics-software) determine GitHub team memberships.',
      'Audit Trail: Complete JSON event logs stored in Google Drive / Firestore for compliance.'
    ],
    diagramRef: 'data-flow',
    scriptsRef: ['google-apps-script', 'nodejs-server'],
    contentMarkdown: `
### 4.1 Automated Onboarding Workflow
When a new student joins the **Robotics Club** (or multiple clubs like Robotics + CS):

1. **Club Registration:** Student fills out the official school club Google Form or is added to the Google Workspace Group (\`robotics-members@pioneercss.org\` & \`robotics-software@pioneercss.org\`) by the Robotics Club Admin.
2. **Directory Event Trigger:** Google Admin SDK Admin Directory API emits an Event / Google Apps Script trigger executes on time-driven interval.
3. **Sync Engine Execution:**
   * Reads current members of Google Group \`robotics-software@pioneercss.org\`.
   * Checks corresponding GitHub Team \`robotics-software\`.
   * If member's GitHub handle / email is missing, calls GitHub REST API: \`PUT /orgs/{org}/teams/{team_slug}/memberships/{username}\`.
   * Dispatches email notification with onboarding guide and repository links.
4. **Cross-Club Join:** If student joins CS Club as well, adding them to \`cs-developers@pioneercss.org\` automatically grants access to CS repositories without changing their Robotics permissions.

### 4.2 Group Naming Convention Standard
To ensure seamless mapping between Google Workspace and GitHub Teams, the system enforces a strict email prefix convention:

\`\`\`
Format: [club-code]-[team-name]@pioneercss.org

Examples:
- robotics-leads@pioneercss.org         ──> GitHub Team: robotics-leads
- robotics-software@pioneercss.org      ──> GitHub Team: robotics-software
- robotics-hardware@pioneercss.org      ──> GitHub Team: robotics-hardware
- cs-leads@pioneercss.org              ──> GitHub Team: cs-leads
- cs-developers@pioneercss.org         ──> GitHub Team: cs-developers
- cross-club-robotics-cs@pioneercss.org ──> GitHub Team: cross-club-robotics-cs
\`\`\`
`
  },
  {
    id: 'granular-permissions',
    number: '5.0',
    title: 'Granular Permissions & Role Security Matrix',
    subtitle: 'Least Privilege Principle and Custom Repository Access Tiers',
    icon: 'Lock',
    summary: 'Comprehensive permission design preventing unauthorized code deletion, secret leaks, or accidental repository setting changes while keeping students empowered to push code.',
    keyTakeaways: [
      'Least Privilege Default: Base Organization Permission set to "No Access" or "Read".',
      'Five Access Levels: Admin, Maintain, Write, Triage, Read.',
      'Branch Protection Rules: Enforced PR reviews, status checks, and required Codeowners.',
      'Secret Scanning & Dependabot: Auto-enabled across all repositories.'
    ],
    diagramRef: 'permission-matrix',
    contentMarkdown: `
### 5.1 Base Organization Settings
To protect repository integrity:
* **Base Permission:** Set to **No Access** (members only see repositories assigned to their teams).
* **Repository Creation:** Restricted to Club Admins / Leads (prevents cluttered, unmonitored repos).
* **Forking Allowed:** Internal forking enabled to facilitate experiment branches without polluting core main branches.

### 5.2 Permission Hierarchy & Responsibilities

| Role / Team | GitHub Permission | Key Capabilities | Safeguards |
| :--- | :--- | :--- | :--- |
| **Club Admins / Officers** | \`Admin\` | Manage repo settings, webhooks, protection rules, team assignments. | Must use 2FA; action logged in audit trail. |
| **Sub-team Leads** | \`Maintain\` | Manage PR merges, issue triage, milestone releases, code reviews. | Cannot delete repositories or change ownership. |
| **General Team Members** | \`Write\` | Push branches, open PRs, create issues, run CI/CD actions. | Cannot push directly to \`main\` or \`release\` branches. |
| **Cross-Club Members** | \`Write\` / \`Read\` | Co-develop shared cross-club repositories. | Limited strictly to shared repositories. |
| **General School Students** | \`Read\` / \`Triage\` | View shared templates, clone open-source repos, report bugs. | Read-only access to code. |

### 5.3 Enforced Branch Protection Rules (\`main\` & \`release\`)
Every repository created in the organization automatically inherits mandatory branch protection rules via GitHub Organization Rule Patterns:
* **Require Pull Request Reviews:** Minimum 1 approval from a designated \`CODEOWNER\`.
* **Dismiss Stale Approvals:** New commits invalidate previous PR approvals.
* **Require Status Checks:** Continuous Integration (CI) build and linting must pass before merging.
* **Restrict Direct Pushes:** Direct commits to \`main\` are blocked for all members (including admins).
`
  },
  {
    id: 'graduation-handover',
    number: '6.0',
    title: 'Graduation & Leadership Transition Protocol',
    subtitle: 'Ensuring Long-Term Continuity and Secure Administrative Rights Transfer',
    icon: 'GraduationCap',
    summary: 'A step-by-step handover procedure, break-glass admin architecture, and automated audit tools ensuring seamless administrative succession when senior student leaders graduate.',
    keyTakeaways: [
      'Multi-Admin Redundancy: Minimum of 2 active student admins + 1 faculty advisor account.',
      'Faculty / School Break-Glass Account: Permanent IT-managed Google account (e.g., robotics.advisor@pioneercss.org) holding Organization Owner rights.',
      'Graduation Succession Countdown: 60-day structured handover wizard starting in spring semester.',
      'Automated Key Rotation & Audit: One-click rotation of API tokens, SSH keys, and webhook secrets.'
    ],
    diagramRef: 'handover-lifecycle',
    scriptsRef: ['cli-script'],
    contentMarkdown: `
### 6.1 Break-Glass & Multi-Admin Architecture
To ensure the Robotics Club (and any other club) never loses administrative control when student leaders graduate:

1. **Faculty Advisor / School IT Co-Owner:**
   * A permanent school account (\`robotics.advisor@pioneercss.org\` or \`it@pioneercss.org\`) is assigned **Organization Owner** status.
   * This account is managed by the school's IT department or faculty sponsor and acts as the ultimate authority in break-glass scenarios.
2. **Student Admin Pair Model:**
   * At any time, there must be at least **two** active student admins (typically the Senior President and Junior Vice-President).
   * Having a Junior co-admin guarantees continuity across academic years.

### 6.2 Step-by-Step Leadership Transition Timeline

\`\`\`
[ April 1st: Handover Initiation ]
  └── Senior Admin initiates "Handover Wizard" in ClubSync Portal.
  └── Nominates Junior Vice-President to incoming Lead Admin role.

[ April 15th: Permissions Escalation ]
  └── Incoming Lead added to 'robotics-leads@pioneercss.org' Google Group.
  └── Google Workspace sync elevates incoming Lead to GitHub Team 'robotics-leads'.
  └── Senior Admin guides Junior Lead through repo settings, API credentials, and webhooks.

[ May 15th: Key Rotation & Access Audit ]
  └── All webhook secrets, CI/CD tokens, and deployment keys rotated.
  └── Inactive graduated members flagged for transition to 'robotics-alumni@pioneercss.org'.

[ Graduation Day: Final Transfer ]
  └── Senior Admin's Google Group membership moved to Alumni status.
  └── Senior Admin's GitHub Org Owner rights demoted to Read/Alumni; Junior Lead becomes Primary Admin.
  └── Faculty Advisor verifies successful transfer.
\`\`\`
`
  },
  {
    id: 'security-compliance',
    number: '7.0',
    title: 'Security, Compliance & FERPA Safeguards',
    subtitle: 'Protecting Student Data, Code Integrity, and School Credentials',
    icon: 'Lock',
    summary: 'Security standards and regulatory compliance safeguards ensuring data privacy, secret leak prevention, and alignment with educational privacy standards.',
    keyTakeaways: [
      'FERPA & Privacy Compliance: No personal identifiable information (PII) like student IDs or phone numbers stored in code.',
      'Secret Scanning & Push Protection: Automatic block on accidental commit of Google API keys, tokens, or credentials.',
      'Dependabot Security Updates: Automated vulnerability detection for software dependencies.',
      'Complete Audit Logging: GitHub Enterprise & Google Workspace Admin audit logs retained for institutional records.'
    ],
    diagramRef: 'system-architecture',
    contentMarkdown: `
### 7.1 Security Policy & Automated Protection
School club repositories frequently contain sensitive artifacts (e.g., Google Workspace API secrets, database connection strings, competition access tokens). The architecture enforces defense-in-depth:

* **Push Protection:** Commits containing detected API keys, private keys, or credentials are rejected at push time.
* **Secret Scanning Alerts:** Security alerts immediately notify Club Admins and School IT if a secret is committed.
* **CodeQL Automated Analysis:** Static analysis runs on every Pull Request to detect security vulnerabilities in robotics and web code.
* **Dependabot Security Patches:** Automatic PRs generated when npm, Python, or C++ dependencies contain known security flaws.

### 7.2 FERPA & Educational Data Guidelines
1. **No Student PII in Repositories:** Code, issues, and commit messages must strictly use school email aliases and avoid disclosing grades, addresses, or private student records.
2. **School Owned Cloud Resources:** All cloud assets, Google Drive files, and GitHub repositories remain the sole intellectual property of the educational institution.
`
  }
];
