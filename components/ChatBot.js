'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Sparkles } from 'lucide-react';
import { PROFILE } from '@/lib/portfolioData';
import BotAvatar from '@/components/BotAvatar';

const QUICK = [
  'What are his top projects?',
  'Tell me about his hackathon wins',
  'What is his tech stack?',
  'How can I connect with him?',
];

function TypingDots({ color }) {
  return (
    <div className="flex items-center gap-1 px-1 py-1">
      {[0, 1, 2].map((i) => (
        <span key={i} className="dot-blink h-2 w-2 rounded-full" style={{ background: color, animationDelay: `${i * 0.18}s` }} />
      ))}
    </div>
  );
}

export default function ChatBot({ theme }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `${PROFILE.greeting} \ud83d\udc4b I'm Singh AI \u2014 ${PROFILE.firstName}'s personal assistant. Ask me anything about his projects, skills, achievements or how to connect with him!`,
    },
  ]);
  const scrollRef = useRef(null);

  useEffect(() => {
    let sid = '';
    try { sid = localStorage.getItem('singh_ai_session') || ''; } catch (e) {}
    if (!sid) {
      sid = 'sess-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
      try { localStorage.setItem('singh_ai_session', sid); } catch (e) {}
    }
    setSessionId(sid);
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading, open]);

  const send = async (text) => {
    const msg = (text !== undefined ? text : input).trim();
    if (!msg || loading) return;
    setMessages((m) => [...m, { role: 'user', content: msg }]);
    setInput('');
    setLoading(true);
    setSpeaking(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, message: msg }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: 'assistant', content: data.reply || 'Sorry, I could not respond just now. Please try again.' }]);
    } catch (e) {
      setMessages((m) => [...m, { role: 'assistant', content: 'I had trouble connecting. Please try again in a moment. \ud83d\ude4f' }]);
    }
    setLoading(false);
    setTimeout(() => setSpeaking(false), 2600);
  };

  const primary = (theme && theme.primary) || '#FF9A1F';
  const primaryRgb = (theme && theme.primaryRgb) || '255,154,31';
  const secondary = (theme && theme.secondary) || '#3B82F6';
  const accent = (theme && theme.accent) || '#FFD24A';
  const botSpeaking = loading || speaking;

  return (
    <>
      {/* Launcher */}
      <motion.button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-[60] flex h-16 w-16 items-center justify-center overflow-hidden rounded-full shadow-2xl"
        style={{ background: '#0c0f1a', border: `2px solid ${primary}`, boxShadow: `0 10px 40px rgba(${primaryRgb},0.55)` }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        aria-label="Open chat assistant"
      >
        <span className="absolute inset-0 rounded-full" style={{ animation: 'pulse-ring 2.2s ease-out infinite' }} />
        {open ? (
          <X className="h-7 w-7 text-white" />
        ) : (
          <BotAvatar size={60} color={primary} />
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className="glass fixed bottom-24 right-5 z-[60] flex h-[560px] max-h-[78vh] w-[92vw] max-w-[400px] flex-col overflow-hidden rounded-3xl"
            style={{ border: `1px solid rgba(${primaryRgb},0.35)` }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 p-4"
              style={{ background: `linear-gradient(135deg, rgba(${primaryRgb},0.22), rgba(${primaryRgb},0.04))`, borderBottom: `1px solid rgba(${primaryRgb},0.25)` }}>
              <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full" style={{ background: '#0c0f1a', border: `1px solid rgba(${primaryRgb},0.5)` }}>
                <BotAvatar size={48} color={primary} speaking={botSpeaking} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 font-display text-sm font-bold text-white">
                  Singh AI <Sparkles className="h-3.5 w-3.5" style={{ color: primary }} />
                </div>
                <div className="truncate text-xs text-white/60">{PROFILE.firstName}'s Assistant · online</div>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {m.role === 'assistant' && (
                    <BotAvatar size={32} color={primary} className="mr-2 mt-0.5" />
                  )}
                  <div
                    className="max-w-[78%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed"
                    style={m.role === 'user'
                      ? { background: `linear-gradient(135deg, ${primary}, ${secondary})`, color: '#fff', borderBottomRightRadius: 4 }
                      : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.92)', border: '1px solid rgba(255,255,255,0.08)', borderBottomLeftRadius: 4 }}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <BotAvatar size={32} color={primary} speaking className="mr-2" />
                  <div className="rounded-2xl bg-white/[0.06] px-2 py-2" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                    <TypingDots color={primary} />
                  </div>
                </div>
              )}
            </div>

            {messages.length <= 1 && (
              <div className="flex flex-wrap gap-2 px-4 pb-2">
                {QUICK.map((q) => (
                  <button key={q} onClick={() => send(q)}
                    className="rounded-full px-3 py-1.5 text-xs text-white/80 transition hover:text-white"
                    style={{ background: `rgba(${primaryRgb},0.12)`, border: `1px solid rgba(${primaryRgb},0.3)` }}>
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="flex items-center gap-2 p-3" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder="Ask about Ekamnoor..."
                className="flex-1 rounded-full bg-white/[0.06] px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none"
                style={{ border: '1px solid rgba(255,255,255,0.1)' }}
              />
              <button onClick={() => send()} disabled={loading}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white disabled:opacity-50"
                style={{ background: `linear-gradient(135deg, ${primary}, ${secondary})` }} aria-label="Send">
                <Send className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
