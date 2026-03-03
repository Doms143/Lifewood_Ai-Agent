import React, { useEffect, useRef, useState } from 'react';
import { Bot, Minus, Send } from 'lucide-react';
import { useAuthContext } from '../../context';

const PANEL_WIDTH = 500;
const PANEL_HEIGHT = 650;
const TOGGLE_SIZE = 64;
const EDGE_GAP = 12;
const POSITION_STORAGE_KEY = 'lifewood_floating_ai_position';

const clampToViewport = (x, y, isOpen) => {
  if (typeof window === 'undefined') return { x, y };

  const width = isOpen ? PANEL_WIDTH : TOGGLE_SIZE;
  const height = isOpen ? PANEL_HEIGHT : TOGGLE_SIZE;
  const maxX = Math.max(EDGE_GAP, window.innerWidth - width - EDGE_GAP);
  const maxY = Math.max(EDGE_GAP, window.innerHeight - height - EDGE_GAP);

  return {
    x: Math.min(Math.max(EDGE_GAP, x), maxX),
    y: Math.min(Math.max(EDGE_GAP, y), maxY),
  };
};

const getDefaultPosition = () => {
  if (typeof window === 'undefined') return { x: EDGE_GAP, y: EDGE_GAP };
  return clampToViewport(
    window.innerWidth - PANEL_WIDTH - 24,
    window.innerHeight - PANEL_HEIGHT - 24,
    true
  );
};

const getSavedPosition = () => {
  if (typeof window === 'undefined') return null;

  try {
    const raw = localStorage.getItem(POSITION_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (typeof parsed?.x !== 'number' || typeof parsed?.y !== 'number') return null;
    return parsed;
  } catch (_error) {
    return null;
  }
};

export default function FloatingAIAgent() {
  const { user } = useAuthContext();
  const [isOpen, setIsOpen] = useState(true);
  const [dragTarget, setDragTarget] = useState(null);
  const [openPosition, setOpenPosition] = useState(() => {
    const saved = getSavedPosition();
    if (saved) return clampToViewport(saved.x, saved.y, true);
    return getDefaultPosition();
  });
  const [minimizedPosition, setMinimizedPosition] = useState(() => {
    const saved = getSavedPosition();
    if (saved) return clampToViewport(saved.x, saved.y, false);
    return getDefaultPosition();
  });

  const panelRef = useRef(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const movedWhileDraggingRef = useRef(false);

  const startDrag = (event, target) => {
    if (event.button !== 0) return;

    const panel = panelRef.current;
    if (!panel) return;

    const rect = panel.getBoundingClientRect();
    dragOffsetRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };

    movedWhileDraggingRef.current = false;
    setDragTarget(target);
    event.preventDefault();
  };

  const handlePanelDragStart = (event) => startDrag(event, 'open');
  const handleMinimizedDragStart = (event) => startDrag(event, 'minimized');

  useEffect(() => {
    if (!dragTarget) return undefined;

    const handleMouseMove = (event) => {
      const nextX = event.clientX - dragOffsetRef.current.x;
      const nextY = event.clientY - dragOffsetRef.current.y;
      const isDraggingOpen = dragTarget === 'open';
      const clamped = clampToViewport(nextX, nextY, isDraggingOpen);
      movedWhileDraggingRef.current = true;

      if (isDraggingOpen) {
        setOpenPosition((prev) =>
          prev.x === clamped.x && prev.y === clamped.y ? prev : clamped
        );
      } else {
        setMinimizedPosition((prev) =>
          prev.x === clamped.x && prev.y === clamped.y ? prev : clamped
        );
      }
    };

    const handleMouseUp = () => {
      const wasDraggingMinimized = dragTarget === 'minimized';
      const moved = movedWhileDraggingRef.current;

      setDragTarget(null);

      if (wasDraggingMinimized && !moved) {
        setIsOpen(true);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragTarget]);

  useEffect(() => {
    setOpenPosition((prev) => clampToViewport(prev.x, prev.y, true));
    setMinimizedPosition((prev) => clampToViewport(prev.x, prev.y, false));
  }, [isOpen]);

  useEffect(() => {
    try {
      localStorage.setItem(POSITION_STORAGE_KEY, JSON.stringify(openPosition));
    } catch (_error) {
      // Ignore storage write failures.
    }
  }, [openPosition]);

  useEffect(() => {
    if (user) return;

    const defaults = getDefaultPosition();
    setOpenPosition(defaults);
    setMinimizedPosition(clampToViewport(defaults.x, defaults.y, false));
    setIsOpen(true);

    try {
      localStorage.removeItem(POSITION_STORAGE_KEY);
    } catch (_error) {
      // Ignore storage remove failures.
    }
  }, [user]);

  if (!user) return null;

  if (!isOpen) {
    return (
      <button
        ref={panelRef}
        type="button"
        onMouseDown={handleMinimizedDragStart}
        className="fixed z-[70] w-16 h-16 rounded-full border border-white/30 bg-lifewood-darkSerpent/70 backdrop-blur-xl shadow-2xl text-white flex items-center justify-center hover:bg-lifewood-darkSerpent/80 transition-colors"
        style={{ left: minimizedPosition.x, top: minimizedPosition.y }}
        aria-label="Open Lifewood AI Assistant"
      >
        <Bot className="w-9 h-10 text-lifewood-saffaron" />
      </button>
    );
  }

  return (
    <section
      ref={panelRef}
      className="fixed z-[70] w-[500px] h-[650px] rounded-2xl border border-white/25 bg-lifewood-darkSerpent/60 backdrop-blur-2xl shadow-2xl overflow-hidden"
      style={{ left: openPosition.x, top: openPosition.y }}
      aria-label="Lifewood AI Assistant"
    >
      <header
        className={`px-4 py-3 border-b border-white/20 select-none ${
          dragTarget === 'open' ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        onMouseDown={handlePanelDragStart}
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-white">Lifewood AI Assistant</h3>
            <p className="text-[11px] text-white/70 mt-0.5">
              OCR Task Assistant (Coming Soon)
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setMinimizedPosition(
                clampToViewport(openPosition.x, openPosition.y, false)
              );
              setIsOpen(false);
            }}
            className="w-7 h-7 rounded-md bg-white/10 hover:bg-white/20 text-white/90 flex items-center justify-center transition-colors"
            aria-label="Minimize Lifewood AI Assistant"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="h-[calc(100%-57px)] flex flex-col">
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
    </section>
  );
}
