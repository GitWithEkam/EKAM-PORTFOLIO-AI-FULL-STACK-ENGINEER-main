'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Github, Linkedin, Mail, Phone, MapPin, GraduationCap, Briefcase,
  Sparkles, Send, ExternalLink, Palette, Menu, X, ArrowUpRight,
  CheckCircle2, Rocket, Bot, Database, Trophy, Medal, Star, Code2, Crown,
  Award, Layers, BrainCircuit, Wrench, Heart, Download, Users,
} from 'lucide-react';
import { PROFILE, THEMES, SIKH_IMAGE, RESUME_URL } from '@/lib/portfolioData';
import ChatBot from '@/components/ChatBot';
import BotAvatar from '@/components/BotAvatar';

const Scene3D = dynamic(() => import('@/components/Scene3D'), { ssr: false });

const ICONS = { Rocket, Bot, Database, Trophy, Medal, Star, Code2, Crown, Award, Layers, BrainCircuit, Wrench };

const NAV = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Journey' },
  { id: 'projects', label: 'Projects' },
  { id: 'achievements', label: 'Wins' },
  { id: 'stack', label: 'Stack' },
  { id: 'contact', label: 'Contact' },
];

const Reveal = ({ children, delay = 0, y = 28, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-70px' }}
    transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

function TiltCard({ children, className = '', style = {} }) {
  const ref = useRef(null);
  const [tf, setTf] = useState('');
  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTf(`perspective(900px) rotateX(${(-py * 7).toFixed(2)}deg) rotateY(${(px * 7).toFixed(2)}deg) translateY(-6px)`);
  };
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={() => setTf('')} className={className}
      style={{ ...style, transform: tf, transition: 'transform 0.18s ease-out', willChange: 'transform' }}>
      {children}
    </div>
  );
}

function IntroGreeting({ t, onDone }) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center px-6 text-center"
      style={{ background: t.bg }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.7 } }}
    >
      <div className="absolute inset-0" style={{ background: t.bgGradient }} />
      <div className="relative z-10 flex flex-col items-center">
        <motion.div className="relative"
          initial={{ scale: 0.6, opacity: 0, y: 24 }} animate={{ scale: 1, opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: 'easeOut' }}>
          <div className="absolute -inset-6 rounded-full blur-2xl"
            style={{ background: `conic-gradient(from 0deg, ${t.primary}, ${t.secondary}, ${t.accent}, ${t.primary})`, opacity: 0.55 }} />
          <div className="relative flex h-44 w-44 items-center justify-center rounded-full sm:h-52 sm:w-52"
            style={{ background: 'rgba(8,10,18,0.85)', border: `2px solid ${t.primary}`, boxShadow: `0 0 50px rgba(${t.primaryRgb},0.55)` }}>
            <BotAvatar size={170} color={t.primary} speaking />
          </div>
        </motion.div>

        <motion.h1
          className="font-display mt-10 max-w-3xl text-2xl font-bold leading-tight sm:text-4xl"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.6 }}
          style={{ backgroundImage: `linear-gradient(120deg, ${t.primary}, ${t.accent}, ${t.secondary})`, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', color: 'transparent' }}>
          {PROFILE.greeting}
        </motion.h1>

        <motion.p className="mt-4 max-w-xl text-base text-white/75 sm:text-lg"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.95, duration: 0.6 }}>
          Welcome to the portfolio of Ekamnoor Singh—an AI Engineer building intelligent automation systems, AI agents, and software that create real-world impact.
        </motion.p>

        <motion.button onClick={onDone}
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.35 }} whileHover={{ scale: 1.05 }}
          className="mt-10 flex items-center gap-2 rounded-xl px-7 py-3 text-sm font-semibold text-black"
          style={{ background: `linear-gradient(135deg, ${t.primary}, ${t.secondary})`, boxShadow: `0 10px 36px rgba(${t.primaryRgb},0.5)` }}>
          Enter Portfolio <ArrowUpRight className="h-4 w-4" />
        </motion.button>
      </div>
    </motion.div>
  );
}

function SectionTitle({ kicker, title, t }) {
  return (
    <div className="mb-12 text-center">
      <Reveal>
        <span className="inline-block rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em]"
          style={{ color: t.primary, background: `rgba(${t.primaryRgb},0.12)`, border: `1px solid rgba(${t.primaryRgb},0.3)` }}>
          {kicker}
        </span>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="font-display mt-4 text-4xl font-bold text-white sm:text-5xl">{title}</h2>
      </Reveal>
      <Reveal delay={0.1}>
        <div className="mx-auto mt-5 h-1 w-24 rounded-full" style={{ background: `linear-gradient(90deg, ${t.primary}, ${t.secondary})` }} />
      </Reveal>
    </div>
  );
}

export default function App() {
  const [themeIndex, setThemeIndex] = useState(0);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [roleIndex, setRoleIndex] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [visitors, setVisitors] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [formState, setFormState] = useState('idle');
  const [phoneReq, setPhoneReq] = useState({ open: false, email: '', state: 'idle' });

  const t = THEMES[themeIndex];

  useEffect(() => {
    try {
      const saved = localStorage.getItem('portfolio_theme');
      if (saved) {
        const idx = THEMES.findIndex((x) => x.id === saved);
        if (idx >= 0) setThemeIndex(idx);
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem('intro_seen') === '1'; } catch (e) {}
    if (seen) { setShowIntro(false); return; }
    const tmo = setTimeout(() => {
      setShowIntro(false);
      try { sessionStorage.setItem('intro_seen', '1'); } catch (e) {}
    }, 5200);
    return () => clearTimeout(tmo);
  }, []);

  useEffect(() => {
    let counted = false;
    try { counted = sessionStorage.getItem('visit_counted') === '1'; } catch (e) {}
    fetch('/api/visit', { method: counted ? 'GET' : 'POST' })
      .then((r) => r.json())
      .then((d) => {
        if (typeof d.count === 'number') setVisitors(d.count);
        if (!counted) { try { sessionStorage.setItem('visit_counted', '1'); } catch (e) {} }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const id = setInterval(() => setRoleIndex((r) => (r + 1) % PROFILE.roles.length), 2600);
    return () => clearInterval(id);
  }, []);

  const dismissIntro = () => {
    setShowIntro(false);
    try { sessionStorage.setItem('intro_seen', '1'); } catch (e) {}
  };

  const pickTheme = (i) => {
    setThemeIndex(i);
    setPaletteOpen(false);
    try { localStorage.setItem('portfolio_theme', THEMES[i].id); } catch (e) {}
  };

  const scrollTo = (id) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const submitContact = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setFormState('sending');
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (res.ok) {
        setFormState('sent');
        setForm({ name: '', email: '', message: '' });
        setTimeout(() => setFormState('idle'), 4000);
      } else setFormState('error');
    } catch (err) { setFormState('error'); }
  };

  const submitPhoneReq = async (e) => {
    e.preventDefault();
    if (!phoneReq.email) return;
    setPhoneReq((p) => ({ ...p, state: 'sending' }));
    try {
      const res = await fetch('/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'phone_request', email: phoneReq.email }) });
      setPhoneReq((p) => ({ ...p, state: res.ok ? 'sent' : 'error' }));
    } catch (err) { setPhoneReq((p) => ({ ...p, state: 'error' })); }
  };

  const wrapperStyle = useMemo(() => ({
    '--p': t.primary, '--pr': t.primaryRgb, '--s': t.secondary, '--sr': t.secondaryRgb, '--a': t.accent, '--ar': t.accentRgb,
  }), [t]);

  return (
    <main className="relative min-h-screen overflow-x-hidden font-body text-white" style={wrapperStyle}>
      <AnimatePresence>{showIntro && <IntroGreeting t={t} onDone={dismissIntro} />}</AnimatePresence>

      <div className="fixed inset-0 z-0 transition-all duration-700" style={{ background: t.bgGradient }} />
      <div className="fixed inset-0 z-0 pointer-events-none"><Scene3D theme={t} /></div>
      <div className="pointer-events-none fixed inset-0 z-0" style={{ background: 'radial-gradient(120% 120% at 50% 0%, transparent 55%, rgba(0,0,0,0.55) 100%)' }} />

      {/* NAV */}
      <nav className="fixed inset-x-0 top-0 z-50">
        <div className="mx-auto mt-3 flex max-w-6xl items-center justify-between rounded-2xl px-4 py-3 sm:mt-4 sm:px-6"
          style={{ background: 'rgba(10,12,20,0.55)', backdropFilter: 'blur(14px)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <button onClick={() => scrollTo('home')} className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl text-lg font-bold text-black"
              style={{ background: `linear-gradient(135deg, ${t.primary}, ${t.secondary})` }}>ਏ</span>
            <span className="font-display text-base font-bold tracking-tight">Ekamnoor<span style={{ color: t.primary }}>.dev</span></span>
          </button>
          <div className="hidden items-center gap-1 md:flex">
            {NAV.map((n) => (
              <button key={n.id} onClick={() => scrollTo(n.id)} className="rounded-lg px-3 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-white">{n.label}</button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <a href={RESUME_URL} target="_blank" rel="noreferrer"
              className="hidden items-center gap-1.5 rounded-xl border px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-white/5 lg:flex"
              style={{ borderColor: `rgba(${t.primaryRgb},0.4)` }}>
              <Download className="h-4 w-4" /> Resume
            </a>
            <button onClick={() => scrollTo('contact')}
              className="hidden rounded-xl px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90 sm:block"
              style={{ background: `linear-gradient(135deg, ${t.primary}, ${t.secondary})` }}>Hire Me</button>
            <button onClick={() => setMenuOpen((m) => !m)} className="rounded-lg p-2 text-white/80 md:hidden" aria-label="Menu">
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="mx-auto mt-2 max-w-6xl overflow-hidden rounded-2xl px-2 py-2 md:hidden"
              style={{ background: 'rgba(10,12,20,0.92)', backdropFilter: 'blur(14px)', border: '1px solid rgba(255,255,255,0.08)' }}>
              {NAV.map((n) => (
                <button key={n.id} onClick={() => scrollTo(n.id)} className="block w-full rounded-lg px-4 py-3 text-left text-sm text-white/80 hover:bg-white/5">{n.label}</button>
              ))}
              <a href={RESUME_URL} target="_blank" rel="noreferrer" className="block w-full rounded-lg px-4 py-3 text-left text-sm font-semibold" style={{ color: t.primary }}>Download Resume</a>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* HERO */}
      <section id="home" className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center gap-10 px-5 pt-28 pb-16 md:flex-row md:gap-12 md:pt-24">
        <motion.div className="flex-1 text-center md:text-left" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium"
            style={{ background: `rgba(${t.primaryRgb},0.12)`, border: `1px solid rgba(${t.primaryRgb},0.3)`, color: t.accent }}>
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full" style={{ background: t.primary, opacity: 0.7 }} />
              <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: t.primary }} />
            </span>
            {PROFILE.greeting}
          </div>
          <h1 className="font-display mt-5 text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Hi, I'm <br className="hidden sm:block" />
            <span style={{ backgroundImage: `linear-gradient(120deg, ${t.primary}, ${t.accent}, ${t.secondary})`, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', color: 'transparent' }}>{PROFILE.name}</span>
          </h1>
          <div className="mt-4 flex h-9 items-center justify-center gap-2 text-xl font-semibold text-white/90 md:justify-start sm:text-2xl">
            <span className="font-mono text-lg" style={{ color: t.primary }}>&#9656;</span>
            <span className="relative inline-block" style={{ minWidth: 220 }}>
              <AnimatePresence mode="wait">
                <motion.span key={roleIndex} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.4 }} className="inline-block font-bold" style={{ color: t.primary }}>{PROFILE.roles[roleIndex]}</motion.span>
              </AnimatePresence>
            </span>
          </div>
          <p className="mx-auto mt-6 max-w-xl text-balance text-base leading-relaxed text-white/70 md:mx-0 sm:text-lg">{PROFILE.tagline}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 md:justify-start">
            <button onClick={() => scrollTo('projects')} className="group flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-black transition hover:opacity-90"
              style={{ background: `linear-gradient(135deg, ${t.primary}, ${t.secondary})`, boxShadow: `0 10px 36px rgba(${t.primaryRgb},0.4)` }}>
              View Projects <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
            <a href={RESUME_URL} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-xl border px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
              style={{ borderColor: `rgba(${t.primaryRgb},0.4)` }}><Download className="h-4 w-4" /> Resume</a>
            <button onClick={() => scrollTo('contact')} className="flex items-center gap-2 rounded-xl border px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
              style={{ borderColor: 'rgba(255,255,255,0.15)' }}>Let's Talk <Send className="h-4 w-4" /></button>
          </div>
          <div className="mt-8 flex items-center justify-center gap-3 md:justify-start">
            {[{ href: PROFILE.contact.github, icon: Github }, { href: PROFILE.contact.linkedin, icon: Linkedin }, { href: `mailto:${PROFILE.contact.email}`, icon: Mail }].map((s, i) => (
              <a key={i} href={s.href} target="_blank" rel="noreferrer" className="flex h-11 w-11 items-center justify-center rounded-xl border text-white/80 transition hover:scale-110 hover:text-white"
                style={{ borderColor: 'rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.03)' }}><s.icon className="h-5 w-5" /></a>
            ))}
            <span className="ml-1 flex items-center gap-2 text-xs text-white/55">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-400" />
              </span>
              {PROFILE.available}
            </span>
          </div>
        </motion.div>

        <motion.div className="relative flex-shrink-0" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.15 }}>
          <div className="absolute -inset-6 rounded-[2.5rem] opacity-60 blur-2xl animate-float" style={{ background: `conic-gradient(from 90deg, ${t.primary}, ${t.secondary}, ${t.accent}, ${t.primary})` }} />
          <div className="relative h-[300px] w-[300px] overflow-hidden rounded-[2.2rem] sm:h-[360px] sm:w-[360px]"
            style={{ border: `2px solid rgba(${t.primaryRgb},0.5)`, boxShadow: `0 20px 70px rgba(${t.primaryRgb},0.35)`, background: 'linear-gradient(160deg, rgba(255,255,255,0.06), rgba(0,0,0,0.2))' }}>
            <img
              src={SIKH_IMAGE}
              alt="Ekamnoor Singh"
              decoding="async"
              loading="eager"
              className="h-full w-full object-cover object-top"
              style={{ backgroundColor: '#0F172A', WebkitBackfaceVisibility: 'hidden', backfaceVisibility: 'hidden' }}
            />
          </div>
          <motion.div className="absolute -left-4 top-10 flex items-center gap-1.5 rounded-2xl px-3 py-2 text-xs font-semibold"
            style={{ background: 'rgba(10,12,20,0.8)', border: `1px solid rgba(${t.primaryRgb},0.4)`, backdropFilter: 'blur(8px)' }}
            animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }}>
            <MapPin className="h-3.5 w-3.5" style={{ color: t.primary }} /> Rooted in Punjab
          </motion.div>
          <motion.div className="absolute -right-3 bottom-12 rounded-2xl px-3 py-2 text-xs font-semibold"
            style={{ background: 'rgba(10,12,20,0.8)', border: `1px solid rgba(${t.secondaryRgb},0.4)`, backdropFilter: 'blur(8px)' }}
            animate={{ y: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity }}>🏆 2x Hackathon Winner</motion.div>
          <motion.div className="absolute -bottom-4 left-1/2 -translate-x-1/2 rounded-2xl px-3 py-2 text-xs font-semibold"
            style={{ background: 'rgba(10,12,20,0.85)', border: `1px solid rgba(${t.primaryRgb},0.35)`, backdropFilter: 'blur(8px)' }}
            animate={{ y: [0, -8, 0] }} transition={{ duration: 4.5, repeat: Infinity }}>
            <span style={{ color: t.primary }}>{'<'}</span> Full Stack AI <span style={{ color: t.primary }}>{'/>'}</span>
          </motion.div>
        </motion.div>
      </section>

      {/* STATS */}
      <section className="relative z-10 mx-auto max-w-6xl px-5">
        <div className="grid grid-cols-2 gap-3 rounded-2xl p-4 sm:grid-cols-4 sm:gap-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          {PROFILE.stats.map((s, i) => (
            <Reveal key={i} delay={i * 0.08} className="text-center">
              <div className="font-display text-3xl font-bold sm:text-4xl" style={{ color: t.primary }}>{s.value}</div>
              <div className="mt-1 text-xs text-white/60 sm:text-sm">{s.label}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="relative z-10 mx-auto max-w-6xl px-5 py-24">
        <SectionTitle kicker="Get to know me" title="About Me" t={t} />
        <div className="grid items-center gap-10 md:grid-cols-5">
          <Reveal className="md:col-span-3">
            <div className="rounded-3xl p-7 glass">
              <p className="text-lg leading-relaxed text-white/80">{PROFILE.summary}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {PROFILE.languages.map((l) => (
                  <span key={l.name} className="rounded-full px-3 py-1.5 text-sm" style={{ background: `rgba(${t.primaryRgb},0.1)`, border: `1px solid rgba(${t.primaryRgb},0.25)`, color: t.accent }}>
                    {l.name} · <span className="text-white/60">{l.level}</span>
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="md:col-span-2">
            <div className="space-y-3">
              {[{ icon: MapPin, label: 'Based in', value: PROFILE.location }, { icon: GraduationCap, label: 'Studying', value: 'B.Tech CSE · CGPA 8.33' }, { icon: Heart, label: 'Powered by', value: 'Seva & Chardi Kala' }].map((row, i) => (
                <div key={i} className="flex items-center gap-4 rounded-2xl p-4 glass">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: `rgba(${t.primaryRgb},0.14)`, color: t.primary }}><row.icon className="h-5 w-5" /></div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-white/50">{row.label}</div>
                    <div className="font-semibold text-white">{row.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* JOURNEY */}
      <section id="experience" className="relative z-10 mx-auto max-w-6xl px-5 py-24">
        <SectionTitle kicker="Experience & Education" title="My Journey" t={t} />
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="mb-5 flex items-center gap-2 font-display text-xl font-bold text-white"><Briefcase className="h-5 w-5" style={{ color: t.primary }} /> Experience</h3>
            <div className="space-y-5">
              {PROFILE.experience.map((e, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="relative rounded-2xl p-6 glass">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="font-semibold text-white">{e.role}</h4>
                      <span className="rounded-full px-2.5 py-1 text-xs" style={{ background: `rgba(${t.primaryRgb},0.12)`, color: t.accent }}>{e.period}</span>
                    </div>
                    <div className="mt-1 text-sm" style={{ color: t.primary }}>{e.org} · <span className="text-white/55">{e.place}</span></div>
                    <ul className="mt-3 space-y-2">
                      {e.points.map((p, j) => (
                        <li key={j} className="flex gap-2 text-sm text-white/70"><span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: t.primary }} />{p}</li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-5 flex items-center gap-2 font-display text-xl font-bold text-white"><GraduationCap className="h-5 w-5" style={{ color: t.primary }} /> Education</h3>
            <div className="space-y-5">
              {PROFILE.education.map((e, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="rounded-2xl p-6 glass">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="font-semibold text-white">{e.degree}</h4>
                      <span className="rounded-full px-2.5 py-1 text-xs" style={{ background: `rgba(${t.secondaryRgb},0.14)`, color: t.accent }}>{e.period}</span>
                    </div>
                    <div className="mt-1 text-sm" style={{ color: t.primary }}>{e.org}</div>
                    <p className="mt-2 text-sm text-white/65">{e.detail}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="relative z-10 mx-auto max-w-6xl px-5 py-24">
        <SectionTitle kicker="What I've built" title="Featured Projects" t={t} />
        <div className="grid gap-6 md:grid-cols-3">
          {PROFILE.projects.map((p, i) => {
            const Icon = ICONS[p.icon] || Rocket;
            return (
              <Reveal key={i} delay={i * 0.1}>
                <TiltCard className="group relative flex h-full flex-col overflow-hidden rounded-3xl p-6 glass">
                  <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-20 blur-2xl transition group-hover:opacity-40" style={{ background: t.primary }} />
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: `linear-gradient(135deg, rgba(${t.primaryRgb},0.25), rgba(${t.secondaryRgb},0.15))`, color: t.primary }}><Icon className="h-6 w-6" /></div>
                  <h3 className="font-display mt-4 text-xl font-bold text-white">{p.title}</h3>
                  <div className="text-sm font-medium" style={{ color: t.primary }}>{p.subtitle}</div>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-white/70">{p.description}</p>
                  <div className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold" style={{ background: `rgba(${t.primaryRgb},0.12)`, color: t.accent }}><Sparkles className="h-3.5 w-3.5" /> {p.metric}</div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {p.tags.map((tag) => (<span key={tag} className="rounded-md px-2 py-1 text-xs text-white/70" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>{tag}</span>))}
                  </div>
                  <div className="mt-5 flex gap-2">
                    {p.demo && (
                      <a href={p.demo} target="_blank" rel="noreferrer" className="flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-black transition hover:opacity-90" style={{ background: `linear-gradient(135deg, ${t.primary}, ${t.secondary})` }}><ExternalLink className="h-3.5 w-3.5" /> Live Demo</a>
                    )}
                    <a href={p.github} target="_blank" rel="noreferrer" className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/5" style={{ borderColor: `rgba(${t.primaryRgb},0.4)` }}><Github className="h-3.5 w-3.5" /> Code</a>
                  </div>
                </TiltCard>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ACHIEVEMENTS */}
      <section id="achievements" className="relative z-10 mx-auto max-w-6xl px-5 py-24">
        <SectionTitle kicker="Milestones & Honors" title="Achievements" t={t} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PROFILE.achievements.map((a, i) => {
            const Icon = ICONS[a.icon] || Trophy;
            return (
              <Reveal key={i} delay={i * 0.07}>
                <div className="flex items-start gap-4 rounded-2xl p-5 glass transition hover:bg-white/[0.07]">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl" style={{ background: `rgba(${t.primaryRgb},0.14)`, color: t.primary, boxShadow: `0 0 22px rgba(${t.primaryRgb},0.25)` }}><Icon className="h-6 w-6" /></div>
                  <div>
                    <div className="font-semibold leading-snug text-white">{a.title}</div>
                    <div className="mt-1 text-sm text-white/55">{a.org}</div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
        <h3 className="mb-6 mt-14 text-center font-display text-2xl font-bold text-white">Volunteer Experience & Leadership</h3>
        <div className="mt-2 grid gap-5 md:grid-cols-2">
          {PROFILE.leadership.map((l, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="rounded-2xl p-6 glass">
                <div className="flex items-center justify-between"><h4 className="font-semibold text-white">{l.title}</h4><span className="text-xs text-white/50">{l.period}</span></div>
                <div className="text-sm" style={{ color: t.primary }}>{l.org}</div>
                <p className="mt-2 text-sm text-white/65">{l.detail}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* TECH STACK */}
      <section id="stack" className="relative z-10 mx-auto max-w-6xl px-5 py-24">
        <SectionTitle kicker="My toolkit" title="Tech Stack" t={t} />
        <div className="grid gap-6 sm:grid-cols-2">
          {PROFILE.techStack.map((cat, i) => {
            const Icon = ICONS[cat.icon] || Code2;
            return (
              <Reveal key={i} delay={i * 0.08}>
                <div className="rounded-3xl p-6 glass">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `rgba(${t.primaryRgb},0.14)`, color: t.primary }}><Icon className="h-5 w-5" /></div>
                    <h3 className="font-display text-lg font-bold text-white">{cat.group}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {cat.items.map((item) => (<span key={item} className="rounded-lg px-3 py-1.5 text-sm text-white/80 transition hover:scale-105" style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid rgba(${t.primaryRgb},0.2)` }}>{item}</span>))}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="relative z-10 mx-auto max-w-6xl px-5 py-24">
        <SectionTitle kicker="Let's build together" title="Get In Touch" t={t} />
        <div className="grid gap-8 md:grid-cols-2">
          <Reveal>
            <div className="rounded-3xl p-7 glass">
              <h3 className="font-display text-2xl font-bold text-white">Looking for an intern who ships? 🚀</h3>
              <p className="mt-3 text-white/70">I'm actively seeking Software / AI Engineering internships. Whether it's a project, an opportunity, or just to say <span style={{ color: t.primary }}>Sat Sri Akal</span> — my inbox is always open.</p>
              <div className="mt-6 space-y-3">
                {[{ icon: Mail, label: PROFILE.contact.email, href: `mailto:${PROFILE.contact.email}` }, { icon: Linkedin, label: 'linkedin.com/in/ekamnoor-singh', href: PROFILE.contact.linkedin }, { icon: Github, label: 'github.com/GitWithEkam', href: PROFILE.contact.github }].map((c, i) => (
                  <a key={i} href={c.href} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-xl p-3 text-sm transition hover:bg-white/5" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: `rgba(${t.primaryRgb},0.14)`, color: t.primary }}><c.icon className="h-4 w-4" /></span>
                    <span className="text-white/80">{c.label}</span>
                    <ExternalLink className="ml-auto h-4 w-4 text-white/30" />
                  </a>
                ))}
              </div>
              {/* Phone request (privacy) */}
              <div className="mt-4 rounded-xl p-3" style={{ border: `1px dashed rgba(${t.primaryRgb},0.35)` }}>
                {phoneReq.state === 'sent' ? (
                  <div className="flex items-center gap-2 text-sm" style={{ color: t.primary }}><CheckCircle2 className="h-4 w-4" /> Shukrana! Ekamnoor will personally reach out to you 🙏</div>
                ) : !phoneReq.open ? (
                  <button onClick={() => setPhoneReq((p) => ({ ...p, open: true }))} className="flex w-full items-center gap-3 text-left text-sm text-white/80">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: `rgba(${t.primaryRgb},0.14)`, color: t.primary }}><Phone className="h-4 w-4" /></span>
                    <span>Request phone number <span className="block text-xs text-white/45">Leave your email — he'll share it personally</span></span>
                  </button>
                ) : (
                  <form onSubmit={submitPhoneReq} className="flex flex-col gap-2 sm:flex-row">
                    <input type="email" required value={phoneReq.email} onChange={(e) => setPhoneReq((p) => ({ ...p, email: e.target.value }))} placeholder="Your email"
                      className="flex-1 rounded-lg bg-white/5 px-3 py-2 text-sm text-white placeholder-white/40 outline-none" style={{ border: '1px solid rgba(255,255,255,0.1)' }} />
                    <button type="submit" disabled={phoneReq.state === 'sending'} className="rounded-lg px-4 py-2 text-sm font-semibold text-black disabled:opacity-60" style={{ background: `linear-gradient(135deg, ${t.primary}, ${t.secondary})` }}>
                      {phoneReq.state === 'sending' ? '...' : 'Request'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <form onSubmit={submitContact} className="rounded-3xl p-7 glass">
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm text-white/70">Your Name</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full rounded-xl bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none focus:ring-2" style={{ border: '1px solid rgba(255,255,255,0.1)', '--tw-ring-color': t.primary }} placeholder="Harpreet Kaur" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm text-white/70">Email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="w-full rounded-xl bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none focus:ring-2" style={{ border: '1px solid rgba(255,255,255,0.1)', '--tw-ring-color': t.primary }} placeholder="you@company.com" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm text-white/70">Message</label>
                  <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required rows={4} className="w-full resize-none rounded-xl bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none focus:ring-2" style={{ border: '1px solid rgba(255,255,255,0.1)', '--tw-ring-color': t.primary }} placeholder="Let's talk about an opportunity..." />
                </div>
                <button type="submit" disabled={formState === 'sending'} className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-semibold text-black transition hover:opacity-90 disabled:opacity-60" style={{ background: `linear-gradient(135deg, ${t.primary}, ${t.secondary})` }}>
                  {formState === 'sending' ? 'Sending...' : formState === 'sent' ? (<><CheckCircle2 className="h-4 w-4" /> Sent! Shukrana 🙏</>) : (<>Send Message <Send className="h-4 w-4" /></>)}
                </button>
                {formState === 'error' && <p className="text-center text-sm text-red-400">Something went wrong. Please email me directly.</p>}
              </div>
            </form>
          </Reveal>
        </div>
      </section>

      {/* CONNECT / LEAD CTA */}
      <section id="connect" className="relative z-10 mx-auto max-w-6xl px-5 pb-12">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl p-8 text-center glass sm:p-12">
            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full opacity-20 blur-3xl" style={{ background: t.primary }} />
            <div className="absolute -left-24 -bottom-24 h-64 w-64 rounded-full opacity-20 blur-3xl" style={{ background: t.secondary }} />
            <div className="relative">
              <div className="mb-3 text-3xl">🙏</div>
              <h3 className="font-display text-3xl font-bold sm:text-4xl" style={{ backgroundImage: `linear-gradient(120deg, ${t.primary}, ${t.accent}, ${t.secondary})`, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', color: 'transparent' }}>Sat Sri Akal! Let's Connect</h3>
              <p className="mx-auto mt-4 max-w-2xl text-white/75">Thank you for taking the time to explore my world. If my work resonated with you, I'd be truly honoured to connect, learn from you, and grow together. Your guidance, feedback and opportunities are always welcome — let's stay in touch.</p>
              <a href={PROFILE.contact.linkedin} target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 rounded-xl px-7 py-3.5 font-semibold text-black transition hover:opacity-90" style={{ background: `linear-gradient(135deg, ${t.primary}, ${t.secondary})`, boxShadow: `0 10px 36px rgba(${t.primaryRgb},0.45)` }}>
                <Linkedin className="h-5 w-5" /> Connect with me on LinkedIn
              </a>
              <p className="mt-4 text-xs text-white/45">Chardi Kala — always in high spirits. Code, create, repeat.</p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t px-5 py-10 text-center" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="mx-auto max-w-6xl">
          <div className="flex justify-center">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl text-xl font-bold text-black" style={{ background: `linear-gradient(135deg, ${t.primary}, ${t.secondary})` }}>ਏ</span>
          </div>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm" style={{ background: `rgba(${t.primaryRgb},0.1)`, border: `1px solid rgba(${t.primaryRgb},0.25)` }}>
            <Users className="h-4 w-4" style={{ color: t.primary }} />
            <span className="text-white/75">{visitors !== null ? visitors.toLocaleString() : '—'} visitors and counting</span>
          </div>
          <p className="mt-4 text-sm text-white/60">Designed & built with <Heart className="inline h-3.5 w-3.5" style={{ color: t.primary }} /> in Punjab by {PROFILE.name}</p>
          <p className="mt-1 text-xs text-white/40">Crafted with code & Chardi Kala · © {new Date().getFullYear()}</p>
        </div>
      </footer>

      {/* THEME SWITCHER */}
      <div className="fixed bottom-5 left-5 z-[60]">
        <AnimatePresence>
          {paletteOpen && (
            <motion.div initial={{ opacity: 0, y: 12, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.9 }} className="mb-3 w-56 rounded-2xl p-3 glass">
              <div className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-white/60">Color Theme</div>
              {THEMES.map((th, i) => (
                <button key={th.id} onClick={() => pickTheme(i)} className="flex w-full items-center gap-3 rounded-xl px-2.5 py-2 transition hover:bg-white/5" style={themeIndex === i ? { background: `rgba(${th.primaryRgb},0.12)` } : {}}>
                  <span className="flex gap-1">
                    <span className="h-4 w-4 rounded-full" style={{ background: th.primary }} />
                    <span className="h-4 w-4 rounded-full" style={{ background: th.secondary }} />
                    <span className="h-4 w-4 rounded-full" style={{ background: th.accent }} />
                  </span>
                  <span className="text-sm text-white/85">{th.name}</span>
                  {themeIndex === i && <CheckCircle2 className="ml-auto h-4 w-4" style={{ color: th.primary }} />}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button onClick={() => setPaletteOpen((o) => !o)} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }} className="flex h-14 w-14 items-center justify-center rounded-full text-white shadow-2xl" style={{ background: `linear-gradient(135deg, ${t.primary}, ${t.secondary})`, boxShadow: `0 10px 36px rgba(${t.primaryRgb},0.5)` }} aria-label="Change theme">
          <Palette className="h-6 w-6" />
        </motion.button>
      </div>

      <ChatBot theme={t} />
    </main>
  );
}
