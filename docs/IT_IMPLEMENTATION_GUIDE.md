# IT Implementation Guide: PCSS II ClubSync

This document provides definitive, zero-trial-and-error implementation steps for the School IT Department to establish a centralized, automated GitHub Education ecosystem.

## Overview
- **Active Effort:** ~45 Minutes Total
- **Compliance:** 100% FERPA Ready
- **Identity System:** SAML 2.0 via Google Workspace
- **Cost:** $0.00 (GitHub Campus Program)

---

## Phase 1: Institutional Approval & GitHub Campus Upgrade
**Time:** 5 Mins Apply | 1-5 Days Approval
**Objective:** Upgrade to GitHub Enterprise for free to unlock SAML SSO.

1.  **Apply:** Navigate to [education.github.com/institutions](https://education.github.com/institutions).
2.  **Selection:** Choose "GitHub Campus Program".
3.  **Documentation:** Provide a school-issued ID/employment letter and the official domain (`pioneercss.org`).

**Outcome:** Institutional Enterprise Account with the ability to create free Organizations.

---

## Phase 2: Identity Integration (Google Workspace SAML SSO)
**Time:** 15 Minutes | No Code Required
**Objective:** Bind GitHub to Google Workspace credentials.

1.  **Google Admin Console:** Go to `Apps > Web and mobile apps > Add App > Search for "GitHub" (SAML)`.
2.  **Mapping:** Copy the ACS URL & Entity ID from GitHub Org Settings into Google Admin.
3.  **Attributes:** Map "Primary Email" to `NameID` in Google Attribute Mapping.
4.  **Finalize:** Upload the Google SSO Certificate to GitHub and enable "Require SAML SSO".

**Outcome:** One-click login enabled for all students via `@pioneercss.org`.

---

## Phase 3: Directory Automation (The ClubSync Engine)
**Time:** 20 Minutes | Automated Sync
**Objective:** Automate onboarding and offboarding.

1.  **Groups:** Create standard Google Groups (e.g., `robotics-leads@pioneercss.org`).
2.  **Apps Script:** Deploy the ClubSync script from the Script Hub to [script.google.com](https://script.google.com).
3.  **Auth:** Configure the GitHub Org Name and a Personal Access Token (PAT).
4.  **Trigger:** Set a time-driven trigger to run every 15 minutes.

**Outcome:** Zero-touch provisioning. IT manages groups; GitHub stays in sync.

---

## Phase 4: Security & FERPA Guardrails
**Time:** 10 Minutes | One-Time Policy
**Objective:** Secure institutional property and data.

1.  **Branch Rules:** Set up Repository Rulesets to "Protect Main Branch" (require PRs).
2.  **Scanning:** Enable "Secret Scanning" and "Push Protection" in Organization Settings.
3.  **Least Privilege:** Set Base Organization Permissions to "No Access".

**Outcome:** Automated push-blocking of passwords and restricted member access.

---

## Success Criteria
IT will never have to touch GitHub again after this setup. All access is controlled strictly via Google Workspace groups that IT already manages.
