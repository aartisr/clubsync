# ClubSync: GitHub Education Multi-Club Governance Portal

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/react-19.0.1-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/typescript-5.8.2-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/tailwind%20css-v4.1.14-38bdf8.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**ClubSync** is an institutional governance portal and architectural blueprint designed for schools, high school robotics & computer science clubs, and educational institutions (specifically demonstrated for **Pioneer Charter School of Science II — PCSS II**).

It bridges **Google Workspace Directory Services** (`@pioneercss.org`) with **GitHub Enterprise Cloud / GitHub Campus Program**, establishing automated, zero-touch member provisioning, least-privilege role-based access control (RBAC), FERPA compliance, and a 60-day leadership graduation handover protocol.

---

## Table of Contents

- [Key Features](#key-features)
- [Architecture & Tech Stack](#architecture--tech-stack)
- [Prerequisites](#prerequisites)
- [Step-by-Step Installation & Quickstart](#step-by-step-installation--quickstart)
- [Environment Variables Configuration](#environment-variables-configuration)
- [Available Scripts](#available-scripts)
- [Application Modules Overview](#application-modules-overview)
- [Repository Structure](#repository-structure)
- [School & Club Customization](#school--club-customization)
- [Security & FERPA Compliance](#security--ferpa-compliance)
- [License](#license)

---

## Key Features

- **Interactive Architecture Studio**: High-contrast, non-overlapping vector blueprints featuring architectural swimlanes, perimeter-anchored ports, cubic Bezier curve routing, boardroom presentation slides, and an end-to-end protocol sequence table.
- **Formal Technical Design Document (RFC)**: Comprehensive institutional proposal covering Problem Statements, Proposed Topology, Least-Privilege RBAC Matrix, Threat Models, and Rollout Strategy.
- **Interactive Role-Based Access Control (RBAC) Matrix**: Granular permission maps for Student Members, Subteam Leads, Faculty Advisors, and IT Admins with real-time role filtering and search.
- **Onboarding & Offboarding Simulator**: Live simulation sandbox testing state transformations, Google Group webhook triggers, rate limiting, and audit logging.
- **Production Automation Script Hub**: Copy-paste ready, parameterized scripts for Google Apps Script sync engines, GitHub Actions CI/CD workflows, and Python CLI audit tools, plus an AI Script Tailorer.
- **60-Day Leadership Handover Wizard**: A structured 4-phase transition timeline (April to July) ensuring graduating senior officers cleanly transfer credentials, rotate secrets, and transition to read-only alumni status.
- **Executive Board Proposal Generator**: Customizable, board-ready 1-page executive summary with dynamic cost projections ($0.00 via GitHub Education), risk mitigation, and instant print/PDF export.
- **Embedded AI Architecture Assistant**: Powered by Google Gemini (`@google/genai`), offering real-time architectural guidance and customized script adjustments.

---

## Architecture & Tech Stack

- **Client Framework**: [React 19](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 6](https://vite.dev/) with `@vitejs/plugin-react` and `@tailwindcss/vite`
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (modern high-contrast, accessible design)
- **Icons & Animation**: [Lucide React](https://lucide.dev/) and [Motion](https://motion.dev/)
- **Server Runtime**: [Node.js](https://nodejs.org/) + [Express 4](https://expressjs.com/) with native TypeScript execution via `tsx`
- **Backend Bundler**: [esbuild](https://esbuild.github.io/) for standalone production CommonJS packaging (`dist/server.cjs`)
- **AI Intelligence**: [Google Gen AI SDK](https://www.npmjs.com/package/@google/genai) (`gemini-2.5-flash`)

---

## Prerequisites

Before running ClubSync locally or deploying it, ensure you have:

- **Node.js**: Version `18.x`, `20.x`, or `22.x` installed ([Download Node.js](https://nodejs.org/))
- **Package Manager**: `npm` (v9+ recommended, bundled with Node.js) or `yarn` / `pnpm`
- **Git**: Installed and configured on your workstation
- *(Optional)* **Google Gemini API Key**: For utilizing the AI Assistant and AI Script Tailorer. Obtain a free key from [Google AI Studio](https://aistudio.google.com/).

---

## Step-by-Step Installation & Quickstart

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd clubsync
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example environment configuration:

```bash
cp .env.example .env
```

Open `.env` in your preferred editor and set your values:

```env
# Google Gemini API key (optional for core features, required for AI assistant)
GEMINI_API_KEY="your_gemini_api_key_here"

# Application URL (defaults to http://localhost:3000)
APP_URL="http://localhost:3000"
```

> **Note**: If `GEMINI_API_KEY` is omitted, all core features (diagrams, simulators, scripts, proposal generator, design docs) will continue to work normally. Only the AI Assistant drawer and AI script tailoring will prompt for a key.

### 4. Run the Development Server

```bash
npm run dev
```

Once started, open your web browser and navigate to:
```
http://localhost:3000
```

The Express server handles API routes under `/api/*` and uses Vite middleware to serve the React client application with instant live reloading.

---

## Available Scripts

In the project root, you can run:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Boots the full-stack app in development mode on port `3000` using `tsx`. |
| `npm run build` | Compiles the client with Vite into `dist/` and bundles `server.ts` into `dist/server.cjs` via esbuild. |
| `npm run start` | Launches the production-compiled server (`node dist/server.cjs`). |
| `npm run lint` | Runs TypeScript static type checking without emitting files (`tsc --noEmit`). |
| `npm run preview` | Previews the Vite production build locally. |
| `npm run clean` | Removes `dist/` and build artifacts. |

---

## Production Build & Deployment

### Option A: 1-Click / Zero-Config Deploy to Vercel (Recommended)

ClubSync is fully optimized and pre-configured for **Vercel** with zero manual configuration needed:

- **Frontend**: Vite 6 builds static production bundles into `dist/` and handles SPA routing via `vercel.json`.
- **API Backend**: The AI assistant and customization endpoints (`/api/ai/chat`, `/api/ai/customize-script`, `/api/health`) are deployed as Vercel Serverless Functions via `/api/index.ts`.

#### Steps to Deploy on Vercel:

1. **Import Project to Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new).
   - Select the repository you want to deploy.
2. **Framework & Settings**:
   - Vercel automatically detects the Vite framework and reads the included `vercel.json`.
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. **Environment Variables**:
   - Under **Environment Variables**, add:
     - `GEMINI_API_KEY`: *(Your Google Gemini API Key from Google AI Studio)*
4. **Deploy**:
   - Click **Deploy**. Vercel will build the frontend and provision the serverless API routes in ~30 seconds.

---

### Option B: Standalone Node.js deployment

To run ClubSync as a standalone container or on any standard Node.js server:

```bash
# 1. Build client assets and server bundle
npm run build:standalone

# 2. Start the standalone production server
npm run start
```

The server binds to `0.0.0.0:3000`, suitable for a standard Node.js host.

---

## Application Modules Overview

```
├── Visual Architecture Studio
│   ├── System Architecture & Integration Topology (Google Workspace -> Sync -> GitHub Org)
│   ├── Sequential Onboarding Data Flow Pipeline
│   ├── SAML 2.0 Identity Handshake & Cryptographic Assertion Flow
│   ├── Organizational Tree & Repository Permission Partitioning
│   └── 60-Day Leadership Graduation Handover Lifecycle
│
├── Technical Design Document
│   └── 9-Section Institutional RFC ready for School Board & IT Director review
│
├── Permission & RBAC Matrix
│   └── Interactive table filtering repository rights across student & faculty roles
│
├── Real-Time Onboarding Simulator
│   └── Interactive sandbox simulating student intake, Google Group mapping, and GitHub provisioning
│
├── Automation Script Hub
│   ├── Google Apps Script Webhook Listener
│   ├── GitHub Actions Differential Sync Workflow
│   └── Python CLI Audit & Key Rotation Utility
│
├── Leadership Handover Wizard
│   └── 4-Stage transition checklist with progress tracking and advisor sign-off
│
└── Board Proposal Generator
    └── Executive summary with 1-click browser printing / PDF generation
```

---

## Repository Structure

```
clubsync/
├── .env.example              # Template for required environment variables
├── .gitignore                # Ignored directories and sensitive files
├── index.html                # HTML entry point with metadata tags
├── metadata.json             # Application metadata and capabilities
├── package.json              # Project dependencies and script declarations
├── server.ts                 # Express API server & Vite middleware integration
├── tsconfig.json             # TypeScript compiler configuration
├── vite.config.ts            # Vite bundler & Tailwind configuration
├── src/
│   ├── App.tsx               # Primary application container & tab router
│   ├── main.tsx              # React DOM bootstrap entry point
│   ├── index.css             # Tailwind CSS entry (@import "tailwindcss";)
│   ├── types.ts              # Global TypeScript interfaces & data contracts
│   ├── components/
│   │   ├── Navbar.tsx                # Header navigation, school badge & config trigger
│   │   ├── DiagramStudioView.tsx     # Vector diagram canvas, presentation slides & table
│   │   ├── DesignDocView.tsx         # Comprehensive RFC design document reader
│   │   ├── PermissionMatrixView.tsx  # Interactive RBAC access table
│   │   ├── OnboardingSimulator.tsx   # Live intake and API provisioning simulator
│   │   ├── ScriptHubView.tsx         # Production code templates & AI tailorer
│   │   ├── HandoverWizardView.tsx    # 60-Day leadership handover tracker
│   │   ├── ProposalGeneratorView.tsx # Board-ready proposal with print styling
│   │   ├── ConfigModal.tsx           # School parameters & organization modal
│   │   └── AIAssistantDrawer.tsx     # Slide-over Gemini AI IT architect assistant
│   └── data/
│       ├── diagramsData.ts           # Architectural blueprint geometries & steps
│       ├── designDocData.ts          # RFC design document chapters
│       ├── permissionMatrixData.ts   # RBAC permission specifications
│       ├── automationScriptsData.ts  # Production scripts (Apps Script, Actions, Python)
│       ├── handoverData.ts           # 4-stage graduation transition tasks
│       └── proposalData.ts           # Executive briefing points & financial cost analysis
```

---

## School & Club Customization

ClubSync is pre-configured with default values for **Pioneer Charter School of Science II (PCSS II)**, but can be customized for any school or multi-club organization:

1. Click **"Configure School"** in the top navigation bar.
2. Update:
   - **School Name**: (e.g., *Pioneer Charter School of Science II*)
   - **Domain**: (e.g., *pioneercss.org*)
   - **GitHub Org**: (e.g., *pcss2-stem-clubs*)
   - **Faculty Advisor Email**: (e.g., *robotics.advisor@pioneercss.org*)
   - **Student Lead Email**: (e.g., *robotics.lead@pioneercss.org*)
3. All views, diagrams, code scripts, and executive proposals will immediately update to reflect your custom school parameters.

---

## Security & FERPA Compliance

ClubSync is architected to satisfy school district IT security and **Family Educational Rights and Privacy Act (FERPA)** regulations:

1. **Zero Password Storage**: GitHub never sees or stores student school passwords; all authentication is strictly delegated via **SAML 2.0 Single Sign-On** to Google Workspace.
2. **Mandatory 2FA**: Google 2-Step Verification is enforced at the school domain level before access is granted to repositories.
3. **Least-Privilege RBAC**: Default base permission in the GitHub Organization is set to **"No Access"**; members only receive scoped write permissions to their designated subteam repositories.
4. **Alumni Deprovisioning**: When a student graduates or leaves the school, disabling their Google account in Google Admin instantly revokes all GitHub access.

---

## Contributing

Contributions, feedback, and suggestions are welcome! Please feel free to open an issue or submit a pull request:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/NewFeature`)
3. Commit your changes (`git commit -m "Add NewFeature"`)
4. Push to the branch (`git push origin feature/NewFeature`)
5. Open a Pull Request

---

## License

This project is licensed under the ***MIT License*** — see the [LICENSE](LICENSE) file for details.
