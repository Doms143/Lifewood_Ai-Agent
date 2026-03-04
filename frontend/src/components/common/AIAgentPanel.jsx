import React, { useState } from 'react';
import {
  Bot,
  ChevronLeft,
  ChevronRight,
  Send,
  Sparkles,
  Activity,
  Wand2,
  MessageSquare,
} from 'lucide-react';
import { useAuthContext } from '../../context';

export default function AIAgentPanel() {
  const { user } = useAuthContext();
  const [isOpen, setIsOpen] = useState(true);

  const sampleMessages = [
    { id: 1, sender: 'assistant', text: 'Hi! I can help summarize OCR results and surface key fields like totals and dates.' },
    { id: 2, sender: 'assistant', text: 'Try uploading a receipt, then ask me: "What is the total and vendor?"' },
    { id: 3, sender: 'assistant', text: 'Coming soon: auto-categorization, anomaly detection, and expense validation.' },
  ];

  if (!user) return null;

  return (
    <aside
      aria-label="Lifewood AI Assistant Panel"
      className={`fixed top-0 right-0 h-screen w-[320px] z-[60] transition-transform duration-300 ease-out ${
        isOpen ? 'translate-x-0' : 'translate-x-[272px]'
      }`}
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 h-12 w-10 rounded-l-xl border border-r-0 border-white/25 bg-lifewood-darkSerpent/65 text-white/90 backdrop-blur-xl hover:bg-lifewood-darkSerpent/80 transition-colors"
        aria-label={isOpen ? 'Collapse AI assistant panel' : 'Expand AI assistant panel'}
      >
        {isOpen ? (
          <ChevronRight className="w-4 h-4 mx-auto" />
        ) : (
          <ChevronLeft className="w-4 h-4 mx-auto" />
        )}
      </button>

      <div className="h-full border-l border-white/20 bg-lifewood-darkSerpent bg-[radial-gradient(circle_at_30%_20%,rgba(255,179,71,0.10),transparent_38%),radial-gradient(circle_at_80%_0%,rgba(3,78,52,0.20),transparent_42%)] backdrop-blur-2xl shadow-2xl">
        <div className="h-full flex flex-col">
          <div className="px-5 pt-6 pb-4 border-b border-white/15">
            <div className="flex items-center justify-between gap-3 text-white">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shadow-sm">
                  <Bot className="w-5 h-5 text-lifewood-saffaron" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-base font-extrabold leading-tight truncate">Lifewood AI Assistant</h2>
                  <p className="text-[11px] text-white/70 truncate">OCR Task Assistant</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold text-lifewood-darkSerpent bg-lifewood-saffaron/90 shadow-md">
                <Activity className="w-3 h-3" />
                Coming Soon
              </span>
            </div>
            <p className="mt-2 text-[12px] text-white/70 leading-relaxed">
              Preview the conversation space. Chat, quick prompts, and OCR-aware helpers will appear here once enabled.
            </p>
          </div>

          <div className="flex-1 px-4 pb-4 pt-3 overflow-y-auto space-y-3">
            <div className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-sm shadow-[0_8px_30px_rgba(0,0,0,0.18)] p-3">
              <div className="flex items-center gap-2 text-white/80 mb-2">
                <Sparkles className="w-4 h-4 text-lifewood-saffaron" />
                <span className="text-xs font-semibold uppercase tracking-wide">Preview</span>
              </div>

              <div className="space-y-3">
                {sampleMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'assistant' ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[90%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-lg border ${
                        msg.sender === 'assistant'
                          ? 'bg-white/10 text-white border-white/10'
                          : 'bg-lifewood-saffaron text-lifewood-darkSerpent border-lifewood-saffaron/70'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/12 bg-white/[0.04] p-3">
              <div className="flex items-center gap-2 text-white/80 mb-2">
                <MessageSquare className="w-4 h-4 text-lifewood-saffaron" />
                <span className="text-xs font-semibold uppercase tracking-wide">Quick prompts</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {["Summarize OCR results", "Find total + vendor", "List dates & amounts", "Flag anomalies"]
                  .map((label) => (
                    <button
                      key={label}
                      type="button"
                      disabled
                      className="px-3 py-2 rounded-xl text-xs font-semibold text-white/80 bg-white/8 border border-white/15 hover:border-white/30 hover:text-white transition-all cursor-not-allowed"
                    >
                      {label}
                    </button>
                  ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/12 bg-gradient-to-r from-lifewood-saffaron/18 via-white/6 to-lifewood-castletonGreen/12 p-3 flex items-center gap-3 text-white/85 shadow-inner">
              <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center">
                <Wand2 className="w-5 h-5 text-lifewood-saffaron" />
              </div>
              <div className="text-sm leading-relaxed">
                Soon you’ll see OCR-aware responses, inline source highlights, and quick export actions.
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-white/15 bg-white/[0.03]">
            <div className="flex items-center gap-2">
              <input
                type="text"
                disabled
                placeholder="Type your message..."
                className="w-full h-11 px-3.5 rounded-xl border border-white/20 bg-white/10 text-sm text-white/75 placeholder-white/50 cursor-not-allowed focus:outline-none"
              />
              <button
                type="button"
                disabled
                className="h-11 w-11 rounded-xl bg-lifewood-saffaron/80 text-lifewood-darkSerpent font-bold cursor-not-allowed flex items-center justify-center shadow-lg"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="mt-2 text-[11px] text-white/55">
              Chat actions are disabled in preview mode.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
