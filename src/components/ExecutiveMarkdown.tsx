import React from 'react';
import Markdown from 'react-markdown';
import { Check, Copy, AlertTriangle, ShieldCheck, ChevronRight } from 'lucide-react';

interface ExecutiveMarkdownProps {
  content: string;
  className?: string;
  theme?: 'light' | 'dark';
}

export const ExecutiveMarkdown: React.FC<ExecutiveMarkdownProps> = ({ 
  content, 
  className = '', 
  theme = 'light' 
}) => {
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  const handleCopy = (codeText: string, id: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const isDark = theme === 'dark';

  return (
    <div className={`executive-markdown leading-relaxed ${isDark ? 'text-slate-200' : 'text-slate-800'} ${className}`}>
      <Markdown
        components={{
          h1: ({ children }) => (
            <h1 className={`text-2xl sm:text-3xl font-black tracking-tight uppercase mt-6 mb-4 pb-2 border-b-2 ${
              isDark ? 'border-slate-800 text-white' : 'border-slate-900 text-slate-900'
            }`}>
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className={`text-xl sm:text-2xl font-black tracking-tight uppercase mt-6 mb-3 pb-1.5 border-b ${
              isDark ? 'border-slate-800 text-slate-100' : 'border-slate-300 text-slate-900'
            }`}>
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <div className="mt-6 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-4 bg-blue-600 rounded-xs"></span>
                <h3 className={`text-base sm:text-lg font-bold tracking-tight uppercase ${
                  isDark ? 'text-blue-300' : 'text-slate-900'
                }`}>
                  {children}
                </h3>
              </div>
            </div>
          ),
          h4: ({ children }) => (
            <h4 className={`text-xs sm:text-sm font-bold uppercase tracking-wider mt-4 mb-2 ${
              isDark ? 'text-blue-400' : 'text-blue-800'
            }`}>
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className={`my-2.5 text-xs sm:text-sm leading-relaxed ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className={`font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className={`italic ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
              {children}
            </em>
          ),
          ul: ({ children }) => (
            <ul className="my-3 space-y-2 pl-0 list-none">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="my-3 space-y-2 pl-0 list-none counter-reset">
              {children}
            </ol>
          ),
          li: ({ children, node }) => {
            // Render list items with clean executive visual markers
            return (
              <li className={`flex items-start gap-2.5 text-xs sm:text-sm p-2.5 rounded-xs border transition-colors ${
                isDark 
                  ? 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-900' 
                  : 'bg-slate-50/80 border-slate-200 text-slate-800 hover:bg-blue-50/40 hover:border-blue-200'
              }`}>
                <span className="shrink-0 mt-1 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-blue-100" />
                <div className="flex-1 leading-relaxed">
                  {children}
                </div>
              </li>
            );
          },
          code: ({ className, children, ...props }) => {
            const isInline = !className && typeof children === 'string' && !children.includes('\n');
            const codeString = String(children).replace(/\n$/, '');
            const codeId = React.useId();

            if (isInline) {
              return (
                <code 
                  className={`px-1.5 py-0.5 rounded text-[11px] font-mono border ${
                    isDark 
                      ? 'bg-slate-800 text-blue-300 border-slate-700' 
                      : 'bg-slate-100 text-blue-900 border-slate-300 font-semibold'
                  }`}
                  {...props}
                >
                  {children}
                </code>
              );
            }

            return (
              <div className="my-4 rounded-xs overflow-hidden border border-slate-800 bg-slate-950 text-slate-100 shadow-md">
                <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  <span>Architecture Specification</span>
                  <button
                    onClick={() => handleCopy(codeString, codeId)}
                    className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                  >
                    {copiedCode === codeId ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 overflow-x-auto text-xs font-mono leading-relaxed text-slate-200">
                  <code>{children}</code>
                </pre>
              </div>
            );
          },
          blockquote: ({ children }) => (
            <div className={`my-4 p-4 border-l-4 rounded-r-xs ${
              isDark 
                ? 'bg-blue-950/30 border-blue-500 text-blue-200' 
                : 'bg-blue-50 border-blue-600 text-blue-950'
            }`}>
              <div className="text-xs sm:text-sm italic font-medium leading-relaxed">
                {children}
              </div>
            </div>
          ),
          table: ({ children }) => (
            <div className="my-4 overflow-x-auto border border-slate-300 shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-slate-900 text-white font-mono uppercase text-[10px]">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="p-2.5 border border-slate-800 font-bold tracking-wider">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="p-2.5 border border-slate-200">
              {children}
            </td>
          ),
          hr: () => (
            <hr className={`my-6 border-t-2 ${isDark ? 'border-slate-800' : 'border-slate-200'}`} />
          )
        }}
      >
        {content}
      </Markdown>
    </div>
  );
};
