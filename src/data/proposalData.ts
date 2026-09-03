/**
 * School Management & IT Proposal Template Data
 */

import { ProposalSection } from '../types';

export const PROPOSAL_SECTIONS: ProposalSection[] = [
  {
    id: 'prop-exec',
    title: 'Executive Summary for School Leadership',
    content: `Proposal to modernize and secure student club technology infrastructure by establishing a centralized **GitHub Education / GitHub Campus Organization** integrated with the school's **Google Workspace for Education** domain.`,
    keyBenefits: [
      'Zero Direct Financial Cost: Leveraging the free GitHub Campus / GitHub Education program.',
      '100% Identity Security: All student accounts authenticated via school Google SAML 2.0 Single Sign-On.',
      'Zero Administrative IT Overhead: Automated Google Apps Script sync handles onboarding and offboarding.',
      'Institutional Property Ownership: All repositories, software, CAD models, and website code remain owned by the school.'
    ]
  },
  {
    id: 'prop-security',
    title: 'Security, Privacy & FERPA Compliance',
    content: `The proposed system guarantees that student data privacy and educational records remain fully protected in compliance with FERPA and institutional security standards.`,
    keyBenefits: [
      'No Storage of Private Student Data: Repositories contain only code and technical assets.',
      'Enforced School Domain Access (@pioneercss.org): External personal accounts cannot access private repositories.',
      'Automated Secret & Credential Scanning: Blocks accidental pushes of sensitive passwords or keys.',
      'Instant Access Revocation: Suspending a student Google account immediately blocks all GitHub access.'
    ],
    complianceNotes: 'Complies with FERPA student privacy regulations and ISO 27001 data security controls.'
  },
  {
    id: 'prop-interclub',
    title: 'Cross-Club Synergy & STEM Collaboration',
    content: `Establishes a unified platform enabling Robotics, Computer Science, Autonomous Racing, and Design clubs to collaborate on shared projects while maintaining code partition boundaries.`,
    keyBenefits: [
      'Shared Component Libraries: Reusable Computer Vision, AI, and Web UI components across clubs.',
      'Student Portfolio & Career Readiness: Provides students with industry-standard Git experience for college & STEM careers.',
      'Clear Leadership Succession: Eliminates lost passwords and stranded repositories when students graduate.'
    ]
  },
  {
    id: 'prop-reqs',
    title: 'Requested IT Approvals & Next Steps',
    content: `To implement ClubSync, the club requests the following standard configuration actions from the IT Department:`,
    keyBenefits: [
      'Google Workspace SAML App Enablement: Allow Google Workspace to act as SAML IdP for GitHub.',
      'Google Group Provisioning: Create standard club email aliases (e.g., robotics-leads@pioneercss.org).',
      'Faculty Sponsor Designation: Assign robotics.advisor@pioneercss.org as permanent Organization Co-Owner.'
    ]
  }
];
