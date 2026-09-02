import React, { useState } from 'react';
import { PROPOSAL_SECTIONS } from '../data/proposalData';
import { SchoolConfig } from '../types';
import { 
  FileText, 
  Printer, 
  ShieldCheck, 
  CheckCircle2, 
  Building, 
  DollarSign, 
  Sparkles,
  Bot,
  Mail,
  Copy,
  Check,
  HelpCircle,
  Clock,
  GraduationCap,
  Users,
  ChevronRight
} from 'lucide-react';

interface ProposalGeneratorViewProps {
  config: SchoolConfig;
  onOpenAI: () => void;
}

export const ProposalGeneratorView: React.FC<ProposalGeneratorViewProps> = ({ config, onOpenAI }) => {
  const [proposalTitle, setProposalTitle] = useState<string>(
    `Proposal for Centralized GitHub Education Infrastructure for ${config.schoolName} STEM Clubs`
  );
  const [targetAudience, setTargetAudience] = useState<'all' | 'it' | 'leadership' | 'sponsor'>('all');
  const [copiedSheet, setCopiedSheet] = useState<boolean>(false);

  const requestedGoogleGroups = [
    { name: `${config.schoolName} Robotics Members`, email: `robotics@${config.domain}`, team: 'robotics-members', purpose: 'Full club roster, read & pull repository access' },
    { name: `${config.schoolName} Robotics Captains`, email: `robotics-leads@${config.domain}`, team: 'robotics-leads', purpose: 'Student captains, repository admin rights' },
    { name: `${config.schoolName} Robotics Software`, email: `robotics-software@${config.domain}`, team: 'robotics-software', purpose: 'ROS 2 & vision autonomous developers' },
    { name: `${config.schoolName} Robotics Hardware`, email: `robotics-hardware@${config.domain}`, team: 'robotics-hardware', purpose: 'Onshape CAD & mechanical build developers' },
    { name: `${config.schoolName} Computer Science Club`, email: `csclub@${config.domain}`, team: 'cs-developers', purpose: 'CS Club software developers' },
    { name: `${config.schoolName} Cross-Club STEM AI`, email: `cross-club-stem@${config.domain}`, team: 'cross-club-ai', purpose: 'Joint Robotics + CS shared AI repositories' },
    { name: `${config.schoolName} Robotics Faculty Advisor`, email: `robotics.advisor@${config.domain}`, team: 'faculty-sponsors', purpose: 'Permanent institutional organization co-owner' },
    { name: `${config.schoolName} IT Department Admin`, email: `it@${config.domain}`, team: 'school-it-admins', purpose: 'School root administrator & SAML owner' }
  ];

  const handleCopyActionSheet = () => {
    const text = `=== ${config.schoolName} IT SETUP REQUEST: GITHUB EDUCATION & GOOGLE GROUPS ===\n` +
      `Target Domain: @${config.domain}\n` +
      `Total Cost to School: $0.00 (GitHub Campus Program Grant)\n` +
      `Estimated IT Setup Time: ~15 minutes\n\n` +
      `REQUESTED GOOGLE GROUPS TO CREATE UNDER @${config.domain}:\n` +
      requestedGoogleGroups.map(g => `• ${g.email} (${g.name}) -> Syncs to GitHub team: ${g.team}`).join('\n') +
      `\n\nNEXT STEP FOR IT:\n` +
      `1. Create above Google Groups in Google Workspace Admin Console.\n` +
      `2. Enable GitHub SAML 2.0 application in Apps > SAML Apps.\n` +
      `3. Assign faculty advisor (${config.schoolName} STEM lead) as GitHub Organization Co-Owner.`;

    navigator.clipboard.writeText(text);
    setCopiedSheet(true);
    setTimeout(() => setCopiedSheet(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Geometric Balance Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-2 border-slate-900 pb-4 mb-2 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-blue-600 text-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest">
              Executive Briefing Tool
            </span>
            <span className="text-xs text-slate-500 font-mono font-bold uppercase">
              {config.schoolName} • @{config.domain}
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tighter uppercase text-slate-900">
            IT & Faculty Approval Proposal
          </h1>
          <p className="text-slate-600 font-medium text-xs sm:text-sm mt-1">
            Formal briefing document ready to submit to {config.schoolName} leadership, faculty advisors, and IT directors.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 border border-blue-400 transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </header>

      {/* Stakeholder Perspective Filter (Zero Cognitive Overload) */}
      <div className="bg-white border-2 border-slate-900 p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-700" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
            Tailor Document Focus For:
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-1">
          <button
            onClick={() => setTargetAudience('all')}
            className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider transition-colors ${
              targetAudience === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Complete Proposal
          </button>
          <button
            onClick={() => setTargetAudience('it')}
            className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider transition-colors ${
              targetAudience === 'it'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            IT Director Focus
          </button>
          <button
            onClick={() => setTargetAudience('leadership')}
            className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider transition-colors ${
              targetAudience === 'leadership'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Executive Director / Dean Focus
          </button>
          <button
            onClick={() => setTargetAudience('sponsor')}
            className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider transition-colors ${
              targetAudience === 'sponsor'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Faculty Advisor Focus
          </button>
        </div>
      </div>

      {/* Printable Proposal Document Card */}
      <div className="bg-white p-8 sm:p-12 border-2 border-slate-900 shadow-sm space-y-8 print:shadow-none print:border-none">
        
        {/* Document Letterhead */}
        <div className="flex items-start justify-between pb-6 border-b-2 border-slate-900">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Building className="w-6 h-6 text-blue-800" />
              <span className="text-lg font-black uppercase tracking-widest text-slate-900">
                {config.schoolName}
              </span>
            </div>
            <span className="text-xs text-slate-600 font-mono font-bold uppercase block">
              Official STEM Infrastructure Proposal • Target Domain: @{config.domain}
            </span>
          </div>

          <div className="text-right space-y-0.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900 block">Date: Academic Year 2026–2027</span>
            <span className="text-[11px] text-slate-500 uppercase block font-medium">Prepared By: Robotics & STEM Club Leadership</span>
          </div>
        </div>

        {/* Editable Title */}
        <div>
          <input
            type="text"
            value={proposalTitle}
            onChange={(e) => setProposalTitle(e.target.value)}
            className="w-full text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-900 bg-transparent border-b-2 border-transparent hover:border-slate-300 focus:outline-none focus:border-blue-600 transition-colors"
          />
        </div>

        {/* High Impact Executive Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3 bg-emerald-50 border border-emerald-300 text-slate-900">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block font-mono">Cost to School</span>
            <span className="text-lg font-black text-emerald-950 block">$0.00 / 100% Free</span>
            <span className="text-[10px] text-slate-600 block mt-0.5">GitHub Campus Grant</span>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-300 text-slate-900">
            <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block font-mono">IT Setup Time</span>
            <span className="text-lg font-black text-blue-950 block">~15 Minutes</span>
            <span className="text-[10px] text-slate-600 block mt-0.5">Zero ongoing maintenance</span>
          </div>

          <div className="p-3 bg-purple-50 border border-purple-300 text-slate-900">
            <span className="text-[10px] font-bold text-purple-800 uppercase tracking-wider block font-mono">FERPA Privacy</span>
            <span className="text-lg font-black text-purple-950 block">100% Enforced</span>
            <span className="text-[10px] text-slate-600 block mt-0.5">Zero student PII stored</span>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-300 text-slate-900">
            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block font-mono">Graduation</span>
            <span className="text-lg font-black text-amber-950 block">Safe Succession</span>
            <span className="text-[10px] text-slate-600 block mt-0.5">Code remains with school</span>
          </div>
        </div>

        {/* Zero Cognitive Overload: Plain-English Executive Q&A */}
        <div className="p-5 bg-slate-50 border-2 border-slate-900 space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5 pb-2 border-b border-slate-300">
            <HelpCircle className="w-4 h-4 text-blue-700" />
            Executive Quick Answers (Zero Cognitive Overload for School Leadership)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <strong className="text-slate-900 font-bold block">1. Will this take time away from IT staff?</strong>
              <p className="text-slate-600 leading-relaxed">
                <strong>No.</strong> Setup takes under 15 minutes to link the Google SAML app. After that, automated synchronization scripts add and remove students automatically when they join Google Groups.
              </p>
            </div>

            <div className="space-y-1">
              <strong className="text-slate-900 font-bold block">2. Is student privacy fully protected?</strong>
              <p className="text-slate-600 leading-relaxed">
                <strong>Yes.</strong> Full FERPA compliance. Only code and technical assets are stored in GitHub. Students authenticate with their official @{config.domain} email—no passwords are exchanged or stored.
              </p>
            </div>

            <div className="space-y-1">
              <strong className="text-slate-900 font-bold block">3. What happens when senior team leads graduate?</strong>
              <p className="text-slate-600 leading-relaxed">
                <strong>Institutional continuity.</strong> The faculty advisor is permanent co-owner. Graduating seniors promote junior leads through a guided checklist, preventing orphaned repositories.
              </p>
            </div>

            <div className="space-y-1">
              <strong className="text-slate-900 font-bold block">4. How does this benefit PCSS II students?</strong>
              <p className="text-slate-600 leading-relaxed">
                <strong>Career & College Readiness.</strong> Students build verified software and robotics portfolios using the same tools used at MIT, Google, and FIRST Robotics competitions.
              </p>
            </div>
          </div>
        </div>

        {/* Proposal Sections */}
        <div className="space-y-8">
          {PROPOSAL_SECTIONS.map((sec, idx) => (
            <div key={sec.id} className="space-y-3">
              <h3 className="text-sm font-black uppercase tracking-tight text-slate-900 pb-2 border-b-2 border-slate-900 flex items-center gap-2">
                <span className="bg-blue-600 text-white px-1.5 py-0.5 text-[10px] font-mono font-bold">0{idx + 1}</span>
                <span>{sec.title}</span>
              </h3>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {sec.content.replace('@school.edu', `@${config.domain}`)}
              </p>

              <div className="space-y-2 pt-1">
                {sec.keyBenefits.map((benefit, bIdx) => (
                  <div key={bIdx} className="flex items-start gap-2.5 text-xs text-slate-700 bg-slate-50 p-2.5 border border-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{benefit.replace('@school.edu', `@${config.domain}`)}</span>
                  </div>
                ))}
              </div>

              {sec.complianceNotes && (
                <div className="p-3 bg-slate-100 border border-slate-300 text-xs font-mono text-slate-700">
                  🔒 {sec.complianceNotes}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Appendix: Requested @pioneercss.org Google Groups for IT Department */}
        <div className="p-6 bg-slate-50 border-2 border-slate-900 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b-2 border-slate-900 gap-2">
            <div>
              <h3 className="text-sm font-black uppercase tracking-tight text-slate-900 flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-700" />
                Appendix: Requested Google Groups & Aliases for {config.schoolName} IT
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                To activate automated sync, IT simply needs to create the following groups under <strong>@{config.domain}</strong>:
              </p>
            </div>
            <button
              onClick={handleCopyActionSheet}
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 transition-colors shadow-xs shrink-0"
            >
              {copiedSheet ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-mono">Copied Action Sheet!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy IT Action Sheet</span>
                </>
              )}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white font-mono uppercase text-[10px]">
                  <th className="p-2 border border-slate-800">Google Group Email</th>
                  <th className="p-2 border border-slate-800">Group Display Name</th>
                  <th className="p-2 border border-slate-800">GitHub Team</th>
                  <th className="p-2 border border-slate-800">Target Purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {requestedGoogleGroups.map((g, idx) => (
                  <tr key={idx} className="hover:bg-white transition-colors">
                    <td className="p-2 font-mono font-bold text-blue-800 border border-slate-200">
                      {g.email}
                    </td>
                    <td className="p-2 font-semibold text-slate-800 border border-slate-200">
                      {g.name}
                    </td>
                    <td className="p-2 font-mono text-slate-600 border border-slate-200">
                      {g.team}
                    </td>
                    <td className="p-2 text-slate-600 border border-slate-200">
                      {g.purpose}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Official 4-Way Sign-off Section */}
        <div className="pt-8 border-t-2 border-slate-900">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-6">
            Institutional Endorsements & Sign-off
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-4">
              <div className="border-b-2 border-slate-900 h-10" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900 block">Robotics Faculty Advisor</span>
                <span className="text-[10px] text-slate-500 uppercase font-mono">Signature & Date</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border-b-2 border-slate-900 h-10" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900 block">IT Department Director</span>
                <span className="text-[10px] text-slate-500 uppercase font-mono">Signature & Date</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border-b-2 border-slate-900 h-10" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900 block">Executive Director / Dean</span>
                <span className="text-[10px] text-slate-500 uppercase font-mono">Signature & Date</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border-b-2 border-slate-900 h-10" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900 block">Robotics Student Captain</span>
                <span className="text-[10px] text-slate-500 uppercase font-mono">Signature & Date</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
