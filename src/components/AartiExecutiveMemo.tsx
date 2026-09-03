import React, { useState } from 'react';
import { SchoolConfig } from '../types';
import { 
  Heart, 
  ShieldCheck, 
  GraduationCap, 
  Clock, 
  DollarSign, 
  Copy, 
  Check, 
  Printer, 
  Building, 
  Users, 
  Sparkles,
  Quote
} from 'lucide-react';

interface AartiExecutiveMemoProps {
  config: SchoolConfig;
}

export const AartiExecutiveMemo: React.FC<AartiExecutiveMemoProps> = ({ config }) => {
  const [copied, setCopied] = useState<boolean>(false);

  const memoText = `MEMORANDUM TO THE PCSS II BOARD OF TRUSTEES & LEADERSHIP
FROM: Aarti S. Ravikumar, 9th Grade Student, Pioneer Charter School of Science II (PCSS II)
SUBJECT: Institutional Adoption of ClubSync: A Zero-Cost Governance Blueprint for Student Clubs
FINANCIAL IMPACT: $0.00 (100% Grant-Funded via GitHub Education)
PRIVACY: 100% FERPA-Compliant

A REFLECTION FROM A FRESHMAN:
"When I walked through the doors of PCSS II as a freshman this autumn, the very first thing that struck me wasn't just how challenging the classes were—it was how generous the upperclassmen and teachers were with their time. In the robotics workshop and computer science club after school, I watched seniors stay until the late-bus bells rang, patiently leaning over desks to teach freshmen how to calibrate a motor or debug a simple loop.

Our school has given us an extraordinary gift: an environment where curiosity is taken seriously and where students look out for one another.

But as a ninth grader quietly observing how our clubs operate day-to-day, I noticed something that worried me. I watched our devoted faculty advisors spend their scarce evening hours manually typing student emails into permission spreadsheets instead of mentoring us. I watched brilliant graduating seniors feel a knot in their stomach in May, wondering how to hand over four years of robot code stored on a personal laptop without everything breaking when they leave for college. And I saw quiet, eager freshmen sit on the sidelines for weeks, simply waiting for someone to grant them access to the code.

I didn’t build ClubSync to make a name for myself or put something on a resume. I built it because I care deeply about this school community, and because true leadership isn’t about being in the spotlight—it’s about quietly sweeping the floor, building the sturdy shelves, and removing the invisible obstacles so the people around you can do their finest work.

ClubSync is my humble offering to Pioneer: a reliable, zero-cost bridge that protects our school’s security, respects our teachers' time, and ensures that the doors of opportunity stay wide open for the seventh, eighth, and ninth graders who will walk into these halls long after my class has graduated."

— Aarti S. Ravikumar, Class of 2030, Pioneer Charter School of Science II`;

  const handleCopy = () => {
    navigator.clipboard.writeText(memoText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border-2 border-slate-900 shadow-sm p-6 sm:p-8 space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b-2 border-slate-900 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-rose-100 text-rose-900 border border-rose-300 text-[10px] font-black uppercase tracking-wider">
              Student Leadership Address
            </span>
            <span className="text-xs text-slate-500 font-mono font-bold">
              PCSS II FRESHMAN PERSPECTIVE
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-900">
            A Letter from Aarti S. Ravikumar to School Leadership
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Personal reflection presented to the PCSS II Administration, Board of Trustees, and STEM Faculty Advisors.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Memo Copied!' : 'Copy Letter'}</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Memo</span>
          </button>
        </div>
      </div>

      {/* Official Memorandum Meta Grid */}
      <div className="bg-slate-50 p-4 border border-slate-300 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-mono">From</span>
          <span className="font-black text-slate-900 block">Aarti S. Ravikumar</span>
          <span className="text-[11px] text-slate-600">9th Grade Student, PCSS II</span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-mono">To</span>
          <span className="font-black text-slate-900 block">Board of Trustees & Leadership</span>
          <span className="text-[11px] text-slate-600">Pioneer Charter School of Science II</span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-mono">Fiscal Impact</span>
          <span className="font-black text-emerald-700 block">$0.00 / 100% Free Forever</span>
          <span className="text-[11px] text-slate-600">GitHub Education Grant</span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-mono">Student Privacy</span>
          <span className="font-black text-purple-800 block">100% FERPA Compliant</span>
          <span className="text-[11px] text-slate-600">Zero PII or Passwords Stored</span>
        </div>
      </div>

      {/* Aarti's Personal Letter with High-Contrast Typography */}
      <div className="relative pl-6 sm:pl-8 border-l-4 border-blue-700 space-y-4 text-slate-800 text-xs sm:text-sm leading-relaxed">
        <Quote className="absolute -left-3 -top-2 w-6 h-6 text-blue-700 bg-white p-0.5" />
        
        <p className="font-bold text-slate-900 text-sm sm:text-base">
          To our School Leaders, Teachers, and Mentors:
        </p>

        <p>
          When I walked through the doors of <strong>Pioneer Charter School of Science II</strong> as a freshman this autumn, the very first thing that struck me wasn’t just how challenging the classes were—it was how generous the upperclassmen and teachers were with their time. In the robotics workshop and computer science club after school, I watched seniors stay until the late-bus bells rang, patiently leaning over desks to teach freshmen how to calibrate a motor or debug a simple loop.
        </p>

        <p>
          Our school has given us an extraordinary gift: an environment where curiosity is taken seriously and where students look out for one another.
        </p>

        <p>
          But as a ninth grader quietly observing how our clubs operate day-to-day, I noticed something that worried me. I watched our devoted faculty advisors spend their scarce evening hours manually typing student emails into permission spreadsheets instead of mentoring us. I watched brilliant graduating seniors feel a knot in their stomach in May, wondering how to hand over four years of robot code stored on a personal laptop without everything breaking when they leave for college. And I saw quiet, eager freshmen sit on the sidelines for weeks, simply waiting for someone to grant them access to the code.
        </p>

        <div className="p-4 bg-blue-50/70 border border-blue-200 text-blue-950 font-medium my-4 space-y-2">
          <p className="italic">
            "I didn’t build ClubSync to make a name for myself or put something on a resume. I built it because I care deeply about this school community, and because true leadership isn’t about being in the spotlight—it’s about quietly sweeping the floor, building the sturdy shelves, and removing the invisible obstacles so the people around you can do their finest work."
          </p>
        </div>

        <p>
          ClubSync is my humble offering to Pioneer: a reliable, zero-cost bridge that protects our school’s security, respects our teachers' time, and ensures that the doors of opportunity stay wide open for the seventh, eighth, and ninth graders who will walk into these halls long after my class has graduated.
        </p>

        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <div>
            <strong className="block text-slate-900 font-black">Aarti S. Ravikumar</strong>
            <span className="text-xs text-slate-500 font-mono">Class of 2030 • Pioneer Charter School of Science II</span>
          </div>
          <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-[11px] font-mono border border-slate-300">
            Freshman Servant-Leader
          </span>
        </div>
      </div>

      {/* The 4 Servant-Leader Commitments for Management */}
      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-blue-700" />
          The Four Pillar Commitments to Pioneer Charter School of Science II
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-800">
              <DollarSign className="w-4 h-4" />
              <strong className="text-xs font-bold uppercase tracking-wide">1. Total Financial Stewardship ($0.00)</strong>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              We leverage 100% grant funding through GitHub Campus Education. Not one single dollar of school or club budget is spent, preserving precious funding for robot motors, tools, and competition travel.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center gap-2 text-blue-800">
              <ShieldCheck className="w-4 h-4" />
              <strong className="text-xs font-bold uppercase tracking-wide">2. Honesty in Privacy & Security (FERPA)</strong>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Students sign in strictly using their trusted @{config.domain} account. No student passwords ever leave the school perimeter, ensuring our district adheres to the strictest state and federal privacy mandates.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center gap-2 text-purple-800">
              <Clock className="w-4 h-4" />
              <strong className="text-xs font-bold uppercase tracking-wide">3. Honoring Our Teachers' Time (~15 Min IT)</strong>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              One-time automated synchronization links to Google Groups. Our faculty advisors spend zero late nights typing student rosters and can focus 100% of their energy on student mentorship.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-800">
              <GraduationCap className="w-4 h-4" />
              <strong className="text-xs font-bold uppercase tracking-wide">4. Preserving Tradition & Continuity</strong>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              A smooth 60-day turnover protocol ensures that when senior captains graduate, all code, CAD models, and website assets remain securely with the school, empowering younger students to build on past triumphs.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
