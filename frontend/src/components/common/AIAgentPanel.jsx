import React, { useState } from 'react';
import { Bot, ChevronLeft, ChevronRight, Send } from 'lucide-react';
import { useAuthContext } from '../../context';

export default function AIAgentPanel() {
  const { user } = useAuthContext();
  const [isOpen, setIsOpen] = useState(true);

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

      <div className="h-full border-l border-white/25 bg-lifewood-darkSerpent/55 backdrop-blur-2xl shadow-2xl">
        <div className="h-full flex flex-col">
          <div className="px-5 pt-6 pb-4 border-b border-white/20">
            <div className="flex items-center gap-2 text-white">
              <Bot className="w-5 h-5 text-lifewood-saffaron" />
              <h2 className="text-base font-bold">Lifewood AI Assistant</h2>
            </div>
            <p className="mt-1 text-xs text-white/75">OCR Task Assistant (Coming Soon)</p>
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            <div className="h-full min-h-[220px] rounded-xl border border-dashed border-white/25 bg-white/5 flex items-center justify-center text-center px-4">
              <p className="text-sm text-white/75">
                Chat interface placeholder.
                <br />
                AI conversation tools will be available soon.
              </p>
            </div>
          </div>

          <div className="p-4 border-t border-white/20">
            <div className="flex items-center gap-2">
              <input
                type="text"
                disabled
                placeholder="Type your message..."
                className="w-full h-10 px-3 rounded-lg border border-white/25 bg-white/10 text-sm text-white/70 placeholder-white/50 cursor-not-allowed focus:outline-none"
              />
              <button
                type="button"
                disabled
                className="h-10 w-10 rounded-lg bg-lifewood-saffaron/40 text-white/80 cursor-not-allowed flex items-center justify-center"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
