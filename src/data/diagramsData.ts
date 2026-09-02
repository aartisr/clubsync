/**
 * Interactive Diagrams Specifications
 * Crisp, High-Contrast Architecture Blueprints Designed for PCSS II & Management Approval
 * Incorporating Architectural Swimlanes, Port Routing, and Executive Governance Briefs
 */

import { DiagramSpec } from '../types';

export const DIAGRAM_SPECS: DiagramSpec[] = [
  {
    id: 'system-architecture',
    title: 'System Architecture & Integration Topology',
    subtitle: 'Google Workspace API Sync Engine & GitHub Enterprise Cloud Integration',
    description: 'High-level architectural topology illustrating how PCSS II Google Workspace Directory connects with the ClubSync Engine to automate GitHub Organization membership, nested team assignments, and SAML SSO enforcement.',
    canvasWidth: 1200,
    canvasHeight: 580,
    zones: [
      {
        id: 'zone-workspace',
        label: 'Zone 1: Identity & Directory Tier',
        badge: 'Google Workspace (@pioneercss.org)',
        x: 40,
        y: 60,
        width: 320,
        height: 480,
        theme: 'blue',
        description: 'Authoritative student directory, Google Groups, and SAML 2.0 Identity Provider managed by PCSS II IT.'
      },
      {
        id: 'zone-sync',
        label: 'Zone 2: Automation & Sync Engine',
        badge: 'ClubSync Middleware (Serverless / Apps Script)',
        x: 420,
        y: 60,
        width: 340,
        height: 480,
        theme: 'purple',
        description: 'Stateless orchestration pipeline translating Google Group membership changes into GitHub REST/GraphQL API commands.'
      },
      {
        id: 'zone-github',
        label: 'Zone 3: Enterprise Code Platform',
        badge: 'GitHub Enterprise Cloud (Campus Grant)',
        x: 820,
        y: 60,
        width: 340,
        height: 480,
        theme: 'emerald',
        description: 'School-owned GitHub Organization hosting partitioned repositories, branch protection rules, and nested teams.'
      }
    ],
    executiveBrief: {
      overview: 'Establishes automated, zero-touch provisioning for PCSS II STEM clubs. When students join or leave club Google Groups, GitHub access is granted or revoked instantaneously without manual IT tickets.',
      managementBenefits: [
        '$0.00 Software Licensing Cost: Backed by GitHub Education Campus Program',
        'Zero IT Helpdesk Overhead: 100% automated via directory push events',
        'FERPA Compliant: No student PII transferred; authentication anchored to @pioneercss.org SSO',
        'Elimination of Orphaned Assets: Graduating seniors automatically lose admin keys'
      ],
      governanceChecks: [
        'Mandatory Google 2-Step Verification (2FA) enforced on all accounts',
        'Least-Privilege RBAC: Default organization base permission set to "No Access"',
        'Faculty Advisor (robotics.advisor@pioneercss.org) retained as permanent Organization Owner'
      ],
      decisionImpact: 'Eliminates security risks of personal student Gmail accounts while providing industry-standard engineering tools for FIRST Robotics & CS competitions.'
    },
    nodes: [
      {
        id: 'google-workspace',
        label: 'Google Workspace IdP',
        type: 'system',
        description: 'School Identity Provider managing user accounts, 2FA, and official club Google Groups.',
        x: 80,
        y: 120,
        width: 240,
        height: 90,
        badge: 'Directory Authority',
        icon: 'ShieldCheck',
        zoneId: 'zone-workspace',
        details: [
          'Admin SDK Directory API v1',
          'Google Groups (@pioneercss.org)',
          'Enforced 2FA & Password Policy',
          'SAML 2.0 / OIDC Identity Provider'
        ],
        executivePoint: 'Single source of truth for all PCSS II student and faculty accounts.'
      },
      {
        id: 'student-user',
        label: 'Student Club Member',
        type: 'user',
        description: 'Active PCSS II student enrolled in Robotics Club, CS Club, or Joint STEM initiatives.',
        x: 80,
        y: 360,
        width: 240,
        height: 90,
        badge: 'Managed Identity',
        icon: 'User',
        zoneId: 'zone-workspace',
        details: [
          'School Email: student@pioneercss.org',
          'Member of robotics-software@pioneercss.org',
          'Member of cross-club-stem@pioneercss.org'
        ],
        executivePoint: 'Students use their existing school login—no new passwords to memorize or lose.'
      },
      {
        id: 'sync-engine',
        label: 'ClubSync Orchestrator',
        type: 'process',
        description: 'Event-driven integration worker running on Google Cloud Functions or Google Apps Script.',
        x: 460,
        y: 180,
        width: 260,
        height: 100,
        badge: 'Automation Middleware',
        icon: 'Cpu',
        zoneId: 'zone-sync',
        details: [
          'Directory Webhook Push Receiver',
          'Hourly Differential Reconciliation Cron',
          'Audit Log Engine (JSON / Cloud Logging)',
          'Rate-limited GitHub REST v3 Dispatcher'
        ],
        executivePoint: 'Zero server maintenance required; runs inside standard Google Cloud free tier.'
      },
      {
        id: 'audit-ledger',
        label: 'Security & Audit Log',
        type: 'security',
        description: 'Immutable record of every permission grant, role change, and membership revocation.',
        x: 460,
        y: 360,
        width: 260,
        height: 85,
        badge: 'Compliance Record',
        icon: 'Lock',
        zoneId: 'zone-sync',
        details: [
          'Timestamped Event Logs',
          'Admin Notification Alerts',
          'FERPA Compliance Verification'
        ],
        executivePoint: 'Provides school administrators with complete auditability for school safety.'
      },
      {
        id: 'github-enterprise',
        label: 'GitHub Education Org',
        type: 'github-team',
        description: 'Institutional GitHub Organization (github.com/pcss2-stem-clubs) with SAML SSO enforced.',
        x: 860,
        y: 120,
        width: 260,
        height: 90,
        badge: 'Target Organization',
        icon: 'Layers',
        zoneId: 'zone-github',
        details: [
          'Base Member Permission: None',
          'Two-Factor Authentication Enforced',
          'SAML Single Sign-On Enforced',
          'Faculty Permanent Ownership'
        ],
        executivePoint: 'Full enterprise capabilities granted 100% free via GitHub Campus Program.'
      },
      {
        id: 'robotics-team',
        label: 'Robotics Club Teams',
        type: 'group',
        description: 'Partitioned sub-teams for Software (ROS 2), Hardware (CAD), and Student Captains.',
        x: 860,
        y: 280,
        width: 260,
        height: 85,
        badge: 'Team Partition',
        icon: 'Bot',
        zoneId: 'zone-github',
        details: [
          'robotics-leads (Maintain/Admin)',
          'robotics-software (Write to firmware)',
          'robotics-hardware (Write to CAD repos)'
        ],
        executivePoint: 'Students only access repositories relevant to their assigned robotics subteam.'
      },
      {
        id: 'cross-club-team',
        label: 'Cross-Club Joint Team',
        type: 'group',
        description: 'Unified team bridging Robotics and Computer Science for joint AI and website projects.',
        x: 860,
        y: 420,
        width: 260,
        height: 85,
        badge: 'Collaborative Joint Team',
        icon: 'Sparkles',
        zoneId: 'zone-github',
        details: [
          'team: cross-club-stem',
          'Joint AI Vision Repositories',
          'Shared Competition Analytics'
        ],
        executivePoint: 'Enables cross-disciplinary teamwork without compromising club-specific secrets.'
      }
    ],
    edges: [
      {
        id: 'e1',
        from: 'student-user',
        to: 'google-workspace',
        label: '1. School SSO Login & Group Membership',
        protocol: 'SAML 2.0 / Google Auth',
        animated: true,
        routing: 'vertical',
        description: 'Student signs in using their @pioneercss.org Google account and is assigned to club Google Groups.'
      },
      {
        id: 'e2',
        from: 'google-workspace',
        to: 'sync-engine',
        label: '2. Directory Push Webhook / Delta API',
        protocol: 'HTTPS / REST Admin SDK',
        animated: true,
        routing: 'horizontal',
        description: 'Google Workspace pushes membership add/remove notifications to ClubSync automation.'
      },
      {
        id: 'e3',
        from: 'sync-engine',
        to: 'audit-ledger',
        label: '3. Write Audit Event',
        protocol: 'Structured JSON',
        routing: 'vertical',
        description: 'Every synchronization action is written to the school compliance audit ledger.'
      },
      {
        id: 'e4',
        from: 'sync-engine',
        to: 'github-enterprise',
        label: '4. Provision Org & Team Access',
        protocol: 'GitHub REST API v3',
        animated: true,
        routing: 'horizontal',
        description: 'Sync engine issues API invitations to the GitHub Organization mapped to school identity.'
      },
      {
        id: 'e5',
        from: 'github-enterprise',
        to: 'robotics-team',
        label: '5a. Assign Robotics Roles',
        protocol: 'Nested Team Mapping',
        routing: 'vertical',
        description: 'Grants Write permissions to robotics firmware and telemetry repositories.'
      },
      {
        id: 'e6',
        from: 'github-enterprise',
        to: 'cross-club-team',
        label: '5b. Assign Cross-Club Roles',
        protocol: 'Shared Team Scope',
        routing: 'vertical',
        description: 'Grants shared Write permissions to cross-club vision and data science repositories.'
      }
    ],
    walkthroughSteps: [
      {
        stepNumber: 1,
        title: 'Authentication at Identity Tier',
        description: 'Student signs into Google Workspace with their official @pioneercss.org email. School IT verifies password and mandatory 2FA.',
        managementRationale: 'Zero credential liability: GitHub never stores student passwords, completely eliminating password theft risks.',
        highlightNodes: ['student-user', 'google-workspace'],
        highlightEdges: ['e1']
      },
      {
        stepNumber: 2,
        title: 'Automated Event Ingestion',
        description: 'When the student is added to robotics-software@pioneercss.org, Google Workspace triggers the ClubSync webhook listener.',
        managementRationale: 'Faculty mentors do not need IT tickets to add members—adding them to a Google Group triggers everything.',
        highlightNodes: ['google-workspace', 'sync-engine'],
        highlightEdges: ['e2']
      },
      {
        stepNumber: 3,
        title: 'Audit Logging & Compliance',
        description: 'ClubSync logs the timestamp, student identifier, and requested team role to an immutable audit record.',
        managementRationale: 'Fulfills school district and FERPA audit requirements with full traceability.',
        highlightNodes: ['sync-engine', 'audit-ledger'],
        highlightEdges: ['e3']
      },
      {
        stepNumber: 4,
        title: 'Target Platform Provisioning',
        description: 'ClubSync issues a secure API request to the PCSS II GitHub Organization, granting access to nested teams and repositories.',
        managementRationale: 'Students receive exact access needed for FIRST Robotics without touching other clubs or administrative controls.',
        highlightNodes: ['sync-engine', 'github-enterprise', 'robotics-team', 'cross-club-team'],
        highlightEdges: ['e4', 'e5', 'e6']
      }
    ]
  },
  {
    id: 'data-flow',
    title: 'Sequential Onboarding Data Flow Pipeline',
    subtitle: 'Step-by-Step Payload Transmission, Translation & State Transformations',
    description: 'Detailed sequence of data payloads, API requests, and state checks during student onboarding and group updates.',
    canvasWidth: 1200,
    canvasHeight: 520,
    zones: [
      {
        id: 'zone-flow-intake',
        label: 'Stage I: Member Intake',
        badge: 'Google Forms / Sheets',
        x: 40,
        y: 80,
        width: 250,
        height: 400,
        theme: 'blue',
        description: 'Student signs up using verified school Google account.'
      },
      {
        id: 'zone-flow-idp',
        label: 'Stage II: Group Assignment',
        badge: 'Google Admin SDK',
        x: 320,
        y: 80,
        width: 250,
        height: 400,
        theme: 'purple',
        description: 'Advisor approves and adds email to club Google Group.'
      },
      {
        id: 'zone-flow-sync',
        label: 'Stage III: Payload Translation',
        badge: 'ClubSync Engine',
        x: 600,
        y: 80,
        width: 260,
        height: 400,
        theme: 'amber',
        description: 'Maps email alias to GitHub Team slug and permission level.'
      },
      {
        id: 'zone-flow-provision',
        label: 'Stage IV & V: GitHub Provision & Log',
        badge: 'GitHub API & Audit',
        x: 890,
        y: 80,
        width: 270,
        height: 400,
        theme: 'emerald',
        description: 'Adds user to team and records verification record.'
      }
    ],
    executiveBrief: {
      overview: 'Illustrates the frictionless onboarding pipeline from the moment a student completes club sign-up to their first code commit on GitHub.',
      managementBenefits: [
        'Turnaround time reduced from 3 business days to under 60 seconds',
        'Zero manual email handling by faculty advisors or IT staff',
        'Guaranteed adherence to least-privilege role assignment matrix'
      ],
      governanceChecks: [
        'Rejects non-@pioneercss.org email addresses automatically',
        'Enforces rate-limiting on API requests to stay within quotas',
        'Sends confirmation welcome email with starter guide and repo links'
      ],
      decisionImpact: 'Maximizes student enthusiasm during competition season by granting instant, error-free onboarding.'
    },
    nodes: [
      {
        id: 'step-form',
        label: '1. Registration Intake',
        type: 'user',
        description: 'Student submits official PCSS II club registration form with school email.',
        x: 65,
        y: 200,
        width: 200,
        height: 100,
        badge: 'Step 1: Input',
        icon: 'User',
        details: [
          'Form: Google Form / Portal',
          'Verified @pioneercss.org login',
          'Club Choice: Robotics / CS',
          'Subteam: Software, CAD, Business'
        ],
        executivePoint: 'Accessible to all students with zero barriers to entry.'
      },
      {
        id: 'step-groups-api',
        label: '2. Google Groups API',
        type: 'system',
        description: 'Google Workspace Directory API inserts student into authorized Google Group.',
        x: 345,
        y: 200,
        width: 200,
        height: 100,
        badge: 'Step 2: Directory Add',
        icon: 'ShieldCheck',
        details: [
          'Target: robotics-software@pioneercss.org',
          'POST /admin/directory/v1/groups',
          'State: Confirmed Active Member'
        ],
        executivePoint: 'Leverages Google Groups already trusted by the school district.'
      },
      {
        id: 'step-sync-process',
        label: '3. Sync Payload Translator',
        type: 'process',
        description: 'Sync middleware converts Google Group alias into appropriate GitHub Team slug.',
        x: 630,
        y: 200,
        width: 200,
        height: 100,
        badge: 'Step 3: Transform',
        icon: 'Cpu',
        details: [
          'Map: robotics-software -> robotics-software',
          'Resolve GitHub Username via SSO',
          'Permission Scope: Write / Main Protected'
        ],
        executivePoint: 'Guarantees strictly controlled role mapping without human error.'
      },
      {
        id: 'step-github-api',
        label: '4. GitHub Teams API',
        type: 'github-team',
        description: 'GitHub REST API securely adds student to the designated team and repository scopes.',
        x: 925,
        y: 140,
        width: 200,
        height: 95,
        badge: 'Step 4: Provision',
        icon: 'Layers',
        details: [
          'PUT /orgs/pcss2/teams/{slug}/memberships',
          'Status: 200 OK Active',
          'Triggers Welcome Notification'
        ],
        executivePoint: 'Provides immediate access to repositories with enforced branch rules.'
      },
      {
        id: 'step-audit-log',
        label: '5. Audit Trail & Confirmation',
        type: 'security',
        description: 'Permanent log entry committed to audit storage and welcome email dispatched.',
        x: 925,
        y: 300,
        width: 200,
        height: 95,
        badge: 'Step 5: Compliance',
        icon: 'Lock',
        details: [
          'Audit Log Entry Appended',
          'FERPA-Compliant Record',
          'Advisor Notification Sent'
        ],
        executivePoint: 'Assures school administration of full oversight and accountability.'
      }
    ],
    edges: [
      {
        id: 'df1',
        from: 'step-form',
        to: 'step-groups-api',
        label: 'Submit Verified Registration',
        protocol: 'HTTPS POST',
        animated: true,
        routing: 'horizontal'
      },
      {
        id: 'df2',
        from: 'step-groups-api',
        to: 'step-sync-process',
        label: 'Directory Change Push Event',
        protocol: 'Webhook / Admin SDK',
        animated: true,
        routing: 'horizontal'
      },
      {
        id: 'df3',
        from: 'step-sync-process',
        to: 'step-github-api',
        label: 'Execute Team Provisioning API',
        protocol: 'GitHub REST API v3',
        animated: true,
        routing: 'horizontal'
      },
      {
        id: 'df4',
        from: 'step-sync-process',
        to: 'step-audit-log',
        label: 'Record Immutable Audit Entry',
        protocol: 'Internal Log Dispatch',
        animated: true,
        routing: 'curved'
      }
    ],
    walkthroughSteps: [
      {
        stepNumber: 1,
        title: 'Student Submits Form',
        description: 'Student signs in with @pioneercss.org and selects their club subteam.',
        managementRationale: 'Ensures only verified PCSS II students can request club membership.',
        highlightNodes: ['step-form'],
        highlightEdges: ['df1']
      },
      {
        stepNumber: 2,
        title: 'Group Assignment in Google Workspace',
        description: 'System adds the student to the club Google Group (e.g. robotics-software@pioneercss.org).',
        managementRationale: 'Maintains administrative control inside Google Workspace.',
        highlightNodes: ['step-groups-api'],
        highlightEdges: ['df2']
      },
      {
        stepNumber: 3,
        title: 'Payload Translation & Mapping',
        description: 'Sync Engine maps the email alias to the GitHub team and prepares the API payload.',
        managementRationale: 'Eliminates mistakes where a student accidentally receives Admin rights.',
        highlightNodes: ['step-sync-process'],
        highlightEdges: ['df3']
      },
      {
        stepNumber: 4,
        title: 'GitHub Access & Compliance Log',
        description: 'GitHub adds the student to the team; confirmation and audit logs are recorded.',
        managementRationale: 'Guarantees complete documentation of every student permission granted.',
        highlightNodes: ['step-github-api', 'step-audit-log'],
        highlightEdges: ['df4']
      }
    ]
  },
  {
    id: 'auth-mapping',
    title: 'Authentication & SAML 2.0 Identity Flow',
    subtitle: 'Google Workspace SAML 2.0 to GitHub Enterprise Single Sign-On Architecture',
    description: 'Cryptographic identity handshake ensuring student credentials remain strictly managed under PCSS II IT domain policy.',
    canvasWidth: 1200,
    canvasHeight: 560,
    zones: [
      {
        id: 'zone-auth-client',
        label: 'Client Tier: Student Browser',
        badge: 'Session Initiator',
        x: 50,
        y: 60,
        width: 320,
        height: 450,
        theme: 'blue',
        description: 'Student laptop or lab workstation attempting access to GitHub Organization.'
      },
      {
        id: 'zone-auth-idp',
        label: 'Identity Provider (IdP) Tier',
        badge: 'Google Workspace SAML',
        x: 420,
        y: 60,
        width: 360,
        height: 450,
        theme: 'purple',
        description: 'Authoritative SAML 2.0 IdP verifying password, 2FA, and signing assertions.'
      },
      {
        id: 'zone-auth-sp',
        label: 'Service Provider (SP) Tier',
        badge: 'GitHub Enterprise SAML SP',
        x: 830,
        y: 60,
        width: 320,
        height: 450,
        theme: 'emerald',
        description: 'Validates cryptographic certificate and issues authenticated session cookie.'
      }
    ],
    executiveBrief: {
      overview: 'Demonstrates how PCSS II retains 100% control of authentication. When a student leaves the school, disabling their Google account immediately revokes all GitHub access.',
      managementBenefits: [
        'Centralized De-provisioning: One switch in Google Admin shuts down all access',
        'Enforced District Security: Complies with school 2FA and password expiration policies',
        'Zero Stored Passwords: GitHub never sees or stores student passwords'
      ],
      governanceChecks: [
        'SAML 2.0 XML Assertions signed with SHA-256 X.509 Certificate',
        'Identity strictly tied to official @pioneercss.org NameID',
        'Session timeouts enforced in accordance with school IT policies'
      ],
      decisionImpact: 'Provides enterprise-grade cybersecurity protection suitable for school board review.'
    },
    nodes: [
      {
        id: 'auth-user',
        label: '1. Student Workstation',
        type: 'user',
        description: 'Student opens github.com/pcss2-stem-clubs and initiates SAML Single Sign-On.',
        x: 90,
        y: 210,
        width: 240,
        height: 100,
        badge: 'Web Browser Client',
        icon: 'User',
        zoneId: 'zone-auth-client',
        details: [
          'Browser Session (Chrome/Firefox)',
          'Requests Protected Org Resource',
          'SP-Initiated SAML Auth Flow'
        ],
        executivePoint: 'Seamless one-click sign-in experience for students.'
      },
      {
        id: 'auth-google-idp',
        label: '2. Google Workspace IdP',
        type: 'system',
        description: 'Google verifies student password and enforces mandatory 2-Step Verification (2FA).',
        x: 480,
        y: 120,
        width: 240,
        height: 100,
        badge: 'Authoritative IdP',
        icon: 'ShieldCheck',
        zoneId: 'zone-auth-idp',
        details: [
          'Enforces School Password Policy',
          'Prompts Google 2FA Prompt / Key',
          'Confirms Active Account Status'
        ],
        executivePoint: 'All login security managed under existing Google Workspace policies.'
      },
      {
        id: 'auth-saml-response',
        label: '3. Signed SAML Assertion',
        type: 'security',
        description: 'Cryptographically signed XML token containing NameID (student@pioneercss.org).',
        x: 480,
        y: 330,
        width: 240,
        height: 100,
        badge: 'X.509 Signed Token',
        icon: 'Lock',
        zoneId: 'zone-auth-idp',
        details: [
          'NameID: student@pioneercss.org',
          'Signed with PCSS II X.509 Cert',
          'Audience: https://github.com/orgs/pcss2'
        ],
        executivePoint: 'Tamper-proof cryptographic token proves student identity.'
      },
      {
        id: 'auth-github-sp',
        label: '4. GitHub Service Provider',
        type: 'github-team',
        description: 'GitHub verifies certificate signature and unlocks organization repositories.',
        x: 870,
        y: 210,
        width: 240,
        height: 100,
        badge: 'SAML Service Provider',
        icon: 'Layers',
        zoneId: 'zone-auth-sp',
        details: [
          'Verifies Public X.509 Cert',
          'Binds Session to School Email',
          'Enforces Team RBAC Scopes'
        ],
        executivePoint: 'Grants access strictly within permissions assigned to student.'
      }
    ],
    edges: [
      {
        id: 'am1',
        from: 'auth-user',
        to: 'auth-google-idp',
        label: '1. Redirect to PCSS II Google SSO',
        protocol: 'SAML AuthnRequest (HTTP 302)',
        animated: true,
        routing: 'curved'
      },
      {
        id: 'am2',
        from: 'auth-google-idp',
        to: 'auth-saml-response',
        label: '2. Authenticate & Sign Assertion',
        protocol: 'SHA-256 Digital Signature',
        animated: true,
        routing: 'vertical'
      },
      {
        id: 'am3',
        from: 'auth-saml-response',
        to: 'auth-github-sp',
        label: '3. POST Signed Assertion to ACS URL',
        protocol: 'SAML 2.0 Assertion (HTTP POST)',
        animated: true,
        routing: 'curved'
      },
      {
        id: 'am4',
        from: 'auth-github-sp',
        to: 'auth-user',
        label: '4. Issue Authenticated Session Token',
        protocol: 'Encrypted Session Cookie',
        animated: true,
        routing: 'horizontal'
      }
    ],
    walkthroughSteps: [
      {
        stepNumber: 1,
        title: 'SAML Redirection',
        description: 'Student navigates to GitHub Organization and is securely redirected to Google Workspace SSO.',
        managementRationale: 'Guarantees students cannot bypass school authentication controls.',
        highlightNodes: ['auth-user', 'auth-google-idp'],
        highlightEdges: ['am1']
      },
      {
        stepNumber: 2,
        title: 'Multi-Factor Authentication & Signing',
        description: 'Google authenticates the student and signs an X.509 cryptographic assertion token.',
        managementRationale: 'Enforces district-wide 2FA rules on all engineering repositories.',
        highlightNodes: ['auth-google-idp', 'auth-saml-response'],
        highlightEdges: ['am2']
      },
      {
        stepNumber: 3,
        title: 'Assertion Verification & Access Grant',
        description: 'GitHub verifies the school certificate signature and establishes an authorized session.',
        managementRationale: 'Grants immediate access without requiring GitHub to store school passwords.',
        highlightNodes: ['auth-saml-response', 'auth-github-sp', 'auth-user'],
        highlightEdges: ['am3', 'am4']
      }
    ]
  },
  {
    id: 'team-hierarchy',
    title: 'Organizational Tree & Permission Hierarchy',
    subtitle: 'School Org -> Club Units -> Subteams -> Repository Partitioning Architecture',
    description: 'Visual map displaying how clubs, teams, and repositories are partitioned to balance independence with cross-club collaboration.',
    canvasWidth: 1200,
    canvasHeight: 560,
    zones: [
      {
        id: 'zone-th-org',
        label: 'Tier 1: Institutional Governance',
        badge: 'PCSS II STEM Organization',
        x: 40,
        y: 40,
        width: 1120,
        height: 100,
        theme: 'slate',
        description: 'Top-level root organization owned by faculty advisor and school IT.'
      },
      {
        id: 'zone-th-clubs',
        label: 'Tier 2: Club Partitions',
        badge: 'Robotics Club vs Computer Science Club',
        x: 40,
        y: 160,
        width: 1120,
        height: 110,
        theme: 'blue',
        description: 'Autonomous club containers preventing cross-club interference.'
      },
      {
        id: 'zone-th-teams',
        label: 'Tier 3: Specialized Subteams',
        badge: 'Role-Based Access Control',
        x: 40,
        y: 290,
        width: 1120,
        height: 110,
        theme: 'purple',
        description: 'Granular teams mapping directly to school Google Groups.'
      },
      {
        id: 'zone-th-repos',
        label: 'Tier 4: Repository Assets',
        badge: 'Protected Repositories',
        x: 40,
        y: 420,
        width: 1120,
        height: 110,
        theme: 'emerald',
        description: 'Partitioned codebases, CAD archives, and joint vision AI models.'
      }
    ],
    executiveBrief: {
      overview: 'Defines the structural boundaries between PCSS II clubs. Robotics and CS clubs operate independently, while having secure shared spaces for collaborative projects.',
      managementBenefits: [
        'Prevents Accidental Deletions: Students in CS cannot touch Robotics competition code',
        'Branch Protection Guaranteed: Nobody can push directly to production without pull request review',
        'Scalable Framework: Easily accommodates future clubs (e.g. Science Olympiad, Math Team)'
      ],
      governanceChecks: [
        'Base organization permission is strictly "None"',
        'Requires 2 approving code reviews before merging into main branches',
        'Secret Scanning & Dependabot automated vulnerability alerts active on all repos'
      ],
      decisionImpact: 'Eliminates friction between student groups while fostering cross-disciplinary teamwork.'
    },
    nodes: [
      {
        id: 'root-org',
        label: 'PCSS II STEM GitHub Org',
        type: 'system',
        description: 'Root organization co-owned by IT Admin and Faculty Advisor (robotics.advisor@pioneercss.org).',
        x: 475,
        y: 55,
        width: 250,
        height: 70,
        badge: 'Root Organization',
        icon: 'Layers',
        details: [
          'Default Base Permission: None',
          'SAML SSO Enforced: @pioneercss.org',
          'Faculty Co-Ownership'
        ],
        executivePoint: 'Permanent institutional control regardless of student graduation.'
      },
      {
        id: 'club-robotics',
        label: 'Robotics Club Partition',
        type: 'group',
        description: 'Autonomous unit for FIRST Robotics Competition & autonomous vehicle engineering.',
        x: 180,
        y: 180,
        width: 250,
        height: 70,
        badge: 'Club Unit: Robotics',
        icon: 'Bot',
        details: [
          'Admin: robotics-leads',
          'Subteams: Software, Hardware, CAD',
          'Isolated competition code'
        ],
        executivePoint: 'Keeps competition-critical code private to robotics members.'
      },
      {
        id: 'club-cs',
        label: 'Computer Science Club',
        type: 'group',
        description: 'Autonomous unit for web development, algorithm contests, and hackathons.',
        x: 770,
        y: 180,
        width: 250,
        height: 70,
        badge: 'Club Unit: CS',
        icon: 'Cpu',
        details: [
          'Admin: cs-leads',
          'Subteams: Developers, Web Team',
          'Open-source web assets'
        ],
        executivePoint: 'Encourages software development without risk to robotics firmware.'
      },
      {
        id: 'team-robotics-sw',
        label: 'robotics-software',
        type: 'github-team',
        description: 'Robotics software engineers writing ROS 2 firmware and autonomous paths.',
        x: 80,
        y: 310,
        width: 220,
        height: 70,
        badge: 'Robotics Subteam',
        icon: 'ShieldCheck',
        details: [
          'Write access to robot-os',
          'Read access to CAD designs'
        ],
        executivePoint: 'Targeted permissions strictly aligned to engineering roles.'
      },
      {
        id: 'team-cross-joint',
        label: 'cross-club-stem',
        type: 'github-team',
        description: 'Joint Robotics + CS team collaborating on Computer Vision & AI models.',
        x: 490,
        y: 310,
        width: 220,
        height: 70,
        badge: 'Joint Shared Team',
        icon: 'Sparkles',
        details: [
          'Members from both clubs',
          'Write access to joint AI repos'
        ],
        executivePoint: 'Breaks down club silos for collaborative innovation.'
      },
      {
        id: 'team-cs-devs',
        label: 'cs-developers',
        type: 'github-team',
        description: 'CS Club software developers building web applications and contest solutions.',
        x: 900,
        y: 310,
        width: 220,
        height: 70,
        badge: 'CS Subteam',
        icon: 'Layers',
        details: [
          'Write access to CS repos',
          'Read access to shared templates'
        ],
        executivePoint: 'Safe sandbox for student software projects.'
      },
      {
        id: 'repo-internal-robotics',
        label: 'robotics-control-os',
        type: 'repo',
        description: 'Private FIRST Robotics competition firmware and motor control systems.',
        x: 80,
        y: 440,
        width: 220,
        height: 70,
        badge: 'Private Repo',
        icon: 'Lock',
        details: [
          'Protected main branch',
          'Mandatory pull requests'
        ],
        executivePoint: 'Protected intellectual property for school robotics team.'
      },
      {
        id: 'repo-cross-ai',
        label: 'vision-ai-shared',
        type: 'repo',
        description: 'Co-developed Computer Vision, OpenCV, and AprilTag detection library.',
        x: 490,
        y: 440,
        width: 220,
        height: 70,
        badge: 'Shared Joint Repo',
        icon: 'Bot',
        details: [
          'Co-owned by Robotics & CS',
          'Dual lead PR sign-offs'
        ],
        executivePoint: 'Shared AI assets utilized across multiple school competitions.'
      },
      {
        id: 'repo-shared-template',
        label: 'school-club-template',
        type: 'repo',
        description: 'Standardized website template available to all PCSS II student clubs.',
        x: 900,
        y: 440,
        width: 220,
        height: 70,
        badge: 'Template Repo',
        icon: 'Layers',
        details: [
          'Read/Fork by all students',
          'Maintained by CS Web Team'
        ],
        executivePoint: 'Reusable digital assets benefiting the entire school community.'
      }
    ],
    edges: [
      { id: 'th1', from: 'root-org', to: 'club-robotics', label: 'Club Partition', routing: 'vertical' },
      { id: 'th2', from: 'root-org', to: 'club-cs', label: 'Club Partition', routing: 'vertical' },
      { id: 'th3', from: 'club-robotics', to: 'team-robotics-sw', label: 'Subteam', routing: 'vertical' },
      { id: 'th4', from: 'club-robotics', to: 'team-cross-joint', label: 'Joint Delegate', routing: 'vertical' },
      { id: 'th5', from: 'club-cs', to: 'team-cross-joint', label: 'Joint Delegate', routing: 'vertical' },
      { id: 'th6', from: 'club-cs', to: 'team-cs-devs', label: 'Subteam', routing: 'vertical' },
      { id: 'th7', from: 'team-robotics-sw', to: 'repo-internal-robotics', label: 'Write Access', routing: 'vertical' },
      { id: 'th8', from: 'team-cross-joint', to: 'repo-cross-ai', label: 'Write Access', routing: 'vertical' },
      { id: 'th9', from: 'team-cs-devs', to: 'repo-shared-template', label: 'Write Access', routing: 'vertical' }
    ],
    walkthroughSteps: [
      {
        stepNumber: 1,
        title: 'Institutional Root Organization',
        description: 'The root organization is anchored to school administration, establishing institutional continuity.',
        managementRationale: 'Guarantees the school always owns the intellectual property and accounts.',
        highlightNodes: ['root-org', 'club-robotics', 'club-cs'],
        highlightEdges: ['th1', 'th2']
      },
      {
        stepNumber: 2,
        title: 'Specialized Role-Based Access',
        description: 'Teams are granted access strictly to repositories they need for their competition tasks.',
        managementRationale: 'Least-privilege security prevents accidental damage or unauthorized modifications.',
        highlightNodes: ['team-robotics-sw', 'team-cs-devs', 'repo-internal-robotics'],
        highlightEdges: ['th3', 'th6', 'th7', 'th9']
      },
      {
        stepNumber: 3,
        title: 'Inter-Club Collaboration Channel',
        description: 'Robotics and CS collaborate safely in the joint vision AI repository without exposing other assets.',
        managementRationale: 'Facilitates high-caliber STEM collaboration while maintaining security boundaries.',
        highlightNodes: ['team-cross-joint', 'repo-cross-ai'],
        highlightEdges: ['th4', 'th5', 'th8']
      }
    ]
  },
  {
    id: 'handover-lifecycle',
    title: 'Graduation & Leadership Handover Lifecycle',
    subtitle: '60-Day Sequential Protocol for Seamless Administrative Transfer',
    description: 'Chronological transition framework ensuring student leadership transfers smoothly to junior officers upon senior graduation.',
    canvasWidth: 1200,
    canvasHeight: 520,
    zones: [
      {
        id: 'zone-ho-1',
        label: 'Phase 1: April (T-60 Days)',
        badge: 'Initiation & Nomination',
        x: 40,
        y: 80,
        width: 260,
        height: 380,
        theme: 'blue',
        description: 'Senior Admin triggers transition countdown and nominates Junior Successor.'
      },
      {
        id: 'zone-ho-2',
        label: 'Phase 2: May (T-30 Days)',
        badge: 'Shadowing & Co-Admin',
        x: 320,
        y: 80,
        width: 260,
        height: 380,
        theme: 'purple',
        description: 'Junior Lead promoted to robotics-leads and shadowed on administrative operations.'
      },
      {
        id: 'zone-ho-3',
        label: 'Phase 3: June (T-7 Days)',
        badge: 'Key & Secret Rotation',
        x: 600,
        y: 80,
        width: 260,
        height: 380,
        theme: 'amber',
        description: 'Automated 1-click rotation of API credentials, tokens, and webhook secrets.'
      },
      {
        id: 'zone-ho-4',
        label: 'Phase 4: July (Graduation)',
        badge: 'Alumni Archive & Sign-Off',
        x: 880,
        y: 80,
        width: 280,
        height: 380,
        theme: 'emerald',
        description: 'Senior Lead transferred to Alumni status; Faculty Advisor verifies clean handover.'
      }
    ],
    executiveBrief: {
      overview: 'Completely eliminates the "lost password" problem when senior club captains graduate from PCSS II. A structured 4-phase timeline guarantees zero disruption to next year\'s teams.',
      managementBenefits: [
        'No Orphaned Projects: Next year\'s students inherit full documentation and working repositories',
        'No Secret Lingering: Graduated seniors cannot retain private API keys or admin rights',
        'Faculty Advisor Sign-Off: Teacher mentor validates each phase before execution'
      ],
      governanceChecks: [
        'Junior lead must complete 30-day dual-admin training before senior rights are revoked',
        'All API tokens and service account keys rotated via one-click CLI script',
        'Graduated seniors converted to read-only Alumni status to inspect past competition work'
      ],
      decisionImpact: 'Protects years of robotics codebase investments from being lost upon graduation.'
    },
    nodes: [
      {
        id: 'ho-init',
        label: '1. Handover Countdown',
        type: 'process',
        description: 'Senior Lead initiates 60-day graduation checklist and nominates Junior Captain.',
        x: 65,
        y: 200,
        width: 210,
        height: 100,
        badge: 'Phase 1: April',
        icon: 'User',
        details: [
          'Trigger: T-60 Days to Graduation',
          'Nominate Junior Vice-President',
          'Faculty Advisor Notified'
        ],
        executivePoint: 'Early warning protocol ensures successors are identified well in advance.'
      },
      {
        id: 'ho-promote',
        label: '2. Dual-Admin Shadowing',
        type: 'user',
        description: 'Junior Lead added to robotics-leads@pioneercss.org with co-ownership rights.',
        x: 345,
        y: 200,
        width: 210,
        height: 100,
        badge: 'Phase 2: May',
        icon: 'ShieldCheck',
        details: [
          'Added to robotics-leads group',
          'GitHub Team Maintainer assigned',
          '30-Day Shadowing Period'
        ],
        executivePoint: 'Hands-on mentorship guarantees junior leads understand system administration.'
      },
      {
        id: 'ho-keys',
        label: '3. Secret & Key Rotation',
        type: 'security',
        description: 'Automated script rotates Google Workspace API keys, webhook secrets, and deploy tokens.',
        x: 625,
        y: 200,
        width: 210,
        height: 100,
        badge: 'Phase 3: June',
        icon: 'Lock',
        details: [
          'Rotate Google Service Key',
          'Regenerate GitHub Webhook Secret',
          'Audit Active SSH & GPG Keys'
        ],
        executivePoint: 'Guarantees that old tokens on student personal laptops become invalid.'
      },
      {
        id: 'ho-alumni',
        label: '4. Senior to Alumni Archive',
        type: 'process',
        description: 'Senior moved to robotics-alumni@pioneercss.org with Read-Only repository access.',
        x: 915,
        y: 200,
        width: 210,
        height: 100,
        badge: 'Phase 4: July',
        icon: 'Layers',
        details: [
          'Admin privileges revoked',
          'Converted to Alumni Read-Only',
          'Advisor signs off completion'
        ],
        executivePoint: 'Preserves alumni pride while strictly revoking administrative privileges.'
      }
    ],
    edges: [
      {
        id: 'he1',
        from: 'ho-init',
        to: 'ho-promote',
        label: 'Nominate Successor (T-60d)',
        protocol: 'Workspace API',
        animated: true,
        routing: 'horizontal'
      },
      {
        id: 'he2',
        from: 'ho-promote',
        to: 'ho-keys',
        label: 'Complete 30d Co-Admin (T-7d)',
        protocol: 'Mentorship Audit',
        animated: true,
        routing: 'horizontal'
      },
      {
        id: 'he3',
        from: 'ho-keys',
        to: 'ho-alumni',
        label: 'Rotate Keys & Archive (T-0d)',
        protocol: 'Handover CLI Script',
        animated: true,
        routing: 'horizontal'
      }
    ],
    walkthroughSteps: [
      {
        stepNumber: 1,
        title: 'Nomination & Countdown',
        description: 'Senior Captain initiates transition 60 days before graduation and selects incoming lead.',
        managementRationale: 'Prevents rushed, last-minute credential transfers.',
        highlightNodes: ['ho-init'],
        highlightEdges: ['he1']
      },
      {
        stepNumber: 2,
        title: '30-Day Co-Admin Shadowing',
        description: 'Junior lead operates alongside senior captain with full supervisory oversight.',
        managementRationale: 'Ensures institutional knowledge is transferred thoroughly.',
        highlightNodes: ['ho-promote'],
        highlightEdges: ['he2']
      },
      {
        stepNumber: 3,
        title: 'Credential Rotation & Alumni Archive',
        description: 'Secrets are automatically rotated and senior privileges archived to read-only.',
        managementRationale: 'Full security hygiene executed without manual guesswork.',
        highlightNodes: ['ho-keys', 'ho-alumni'],
        highlightEdges: ['he3']
      }
    ]
  }
];
