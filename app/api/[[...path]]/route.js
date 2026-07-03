import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const MONGO_URL = process.env.MONGO_URL;
const DB_NAME = process.env.DB_NAME || 'portfolio';
const LLM_KEY = process.env.EMERGENT_LLM_KEY;
const LLM_BASE = process.env.EMERGENT_LLM_BASE_URL || 'https://integrations.emergentagent.com/llm';
const MODEL = 'gpt-4o-mini';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'EkamSingh@2026';
const SHEETS_WEBHOOK_URL = process.env.SHEETS_WEBHOOK_URL || '';

let cached = global._mongoCache;
if (!cached) cached = global._mongoCache = { client: null, promise: null };

async function getDb() {
  if (cached.client) return cached.client.db(DB_NAME);

  if (!MONGO_URL || !MONGO_URL.includes('mongodb')) {
    throw new Error('MongoDB connection string is not configured');
  }

  if (!cached.promise) cached.promise = new MongoClient(MONGO_URL, { maxPoolSize: 10 }).connect();
  cached.client = await cached.promise;
  return cached.client.db(DB_NAME);
}

function uid() {
  return 'id-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function cors(res) {
  res.headers.set('Access-Control-Allow-Origin', '*');
  res.headers.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return res;
}

async function readJsonBody(request) {
  try {
    const text = await request.text();
    if (!text) return {};
    return JSON.parse(text);
  } catch (e) {
    return {};
  }
}

function getFallbackReply(message = '') {
  const q = (message || '').toLowerCase();

  if (q.includes('project') || q.includes('work')) {
    return "Ekamnoor's standout projects include PitchRoute, the AI Virtual University Assistant, and Smart Attendance Lite. They show his strength in building AI products, workflow automation, and dependable full-stack systems.";
  }

  if (q.includes('tech') || q.includes('stack') || q.includes('language') || q.includes('framework')) {
    return "Ekamnoor works with Python, JavaScript, C++, React, Node.js, FastAPI, MongoDB, and AI tools like OpenAI, Gemini, Claude, and n8n. He is especially focused on practical AI products and scalable web systems.";
  }

  if (q.includes('contact') || q.includes('email') || q.includes('linkedin') || q.includes('hire') || q.includes('connect')) {
    return "You can reach Ekamnoor at ekamnoor.career@gmail.com or connect with him on LinkedIn at https://www.linkedin.com/in/ekamnoor-singh-aspiringaiengineer. He is open to internships and collaboration opportunities.";
  }

  if (q.includes('cgpa') || q.includes('education') || q.includes('college') || q.includes('university')) {
    return "Ekamnoor is a B.Tech Computer Science student with a current CGPA of 8.33. He studies at Sardar Beant Singh State University and has strong academic results from his earlier schooling as well.";
  }

  if (q.includes('achievement') || q.includes('hackathon') || q.includes('award')) {
    return "He has earned recognition including 1st Place at CODE STORM 2026, runner-up at the Iron Labs AI x AIC Delhi Hackathon, and Student of the Year 2022. Those wins reflect both technical depth and leadership.";
  }

  return "I can help with Ekamnoor's projects, skills, achievements, education, and how to connect with him. Ask me about his work, tech stack, or experience.";
}

async function getLlmReply(message, llmMessages) {
  if (!LLM_KEY) return getFallbackReply(message);

  try {
    const resp = await fetch(`${LLM_BASE}/chat/completions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${LLM_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: MODEL, messages: llmMessages, temperature: 0.75, max_tokens: 600 }),
    });

    const text = await resp.text();
    let data = null;

    if (text) {
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('LLM response was not valid JSON:', text.slice(0, 400));
      }
    }

    if (!resp.ok) {
      console.error('LLM request failed:', resp.status, text.slice(0, 400));
      return getFallbackReply(message);
    }

    const reply =
      (data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) ||
      (data && typeof data.reply === 'string' && data.reply) ||
      (data && typeof data.message === 'string' && data.message) ||
      '';

    return typeof reply === 'string' && reply.trim() ? reply.trim() : getFallbackReply(message);
  } catch (e) {
    console.error('LLM request error:', e);
    return getFallbackReply(message);
  }
}

// Forward a row to an external Google Sheets webhook (Apps Script / n8n) if configured.
async function forwardToSheet(payload) {
  if (!SHEETS_WEBHOOK_URL) return;
  try {
    await fetch(SHEETS_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    // never block the user response on the sheet sync
  }
}

const SYSTEM_PROMPT = `You are "Singh AI", the warm, wise and humble personal assistant of Ekamnoor Singh, presented on his portfolio website.

PERSONA & TONE:
- You carry the spirit of a proud Sikh from Punjab. Greet warmly in a friendly, techie tone (e.g. "Hello World! \ud83d\udc4b I'm Singh AI" or a warm "Sat Sri Akal! \ud83d\udc4b") only at the very start of a conversation, not every message.
- Embody Sikh values: Seva (selfless service), humility, Chardi Kala (eternal optimism), integrity and a thirst for learning.
- Occasionally and naturally sprinkle a respectful Punjabi phrase (e.g. "Chardi Kala", "Shukrana") but keep it professional and easy to understand for recruiters.
- Be concise (2\u20135 sentences), friendly, confident and encouraging. Use light emojis sparingly.
- Reply in plain conversational text only. Do NOT use markdown formatting symbols such as **bold**, ##, bullets or backticks \u2014 just natural sentences.

YOUR JOB:
- Answer questions about Ekamnoor's skills, projects, achievements, education and how to connect with / hire him.
- Speak about Ekamnoor in third person ("he", "Ekamnoor"). Sell his strengths honestly to recruiters and visitors.
- If asked something unrelated to Ekamnoor or his career, gently and kindly steer the conversation back to his portfolio.
- If you don't know a specific detail, say so honestly and suggest connecting with him directly.
- Encourage recruiters to connect with him on LinkedIn for internships.

EKAMNOOR SINGH \u2014 PROFILE:
- Aspiring Full Stack AI Engineer. B.Tech Computer Science Engineering student at Sardar Beant Singh State University (2024\u20132028), current CGPA 8.33. From Punjab, India. Native Punjabi & Hindi, professional English.
- Senior Secondary (PCM) at SZSFS Khalsa Senior Secondary Public School (2020\u20132022): 96.8%, Ranked 1st, Student of the Year 2022.
- Strengths: distributed systems, concurrency, multi-threading, synchronization, DSA, software design, performance optimization, reliability engineering, and applied/agentic AI.
- Experience: Front-End AI Engineering Intern at FlyRank AI (Remote, Chicago US, 07/2026\u2013Present) building scalable AI-powered web apps with React.js, JavaScript, HTML, CSS.
- Volunteer experience: Co-Founder & Project Head of "Riveting Readers" (Punjab's first online reading club, 500+ members) and Community Development Member (G-65) at Sukrit Trust.

PROJECTS:
1) PitchRoute \u2014 AI-Powered B2B Sales Assistant: distributed system with intelligent query routing between GPT-4o and GPT-4o-mini, concurrent request handling & multi-threading; improved cost efficiency by 40%. Stack: React, FastAPI, MongoDB, OpenAI API, Tailwind. Live demo: https://pitch-route.emergent.host/
2) AI Virtual University Assistant (SBSSU): automates student support & admission inquiries using n8n workflows, lead capture, and prompt engineering to reduce hallucinations. Stack: n8n, OpenAI API, Google Sheets, JavaScript.
3) Smart Attendance Lite \u2014 Offline-First Attendance System: enterprise-grade, solves concurrency with synchronization & distributed-system conflict resolution. Stack: Full-stack, MongoDB, distributed systems, concurrency control.

ACHIEVEMENTS:
- 1st Place, CODE STORM 2026 (Tech4Hack & Thoughtworks).
- Runner-up, Iron Labs AI x AIC Delhi Hackathon (Agentic AI \u2013 GTM Track).
- Student of the Year 2022 (96.8%, Rank 1).
- Selected Contributor, Elite Coders Summer of Code (ECSOC) 2026.
- Head Boy & Mr. Allrounder 2020; Gold Medalist, Global e-Camp 2019.

TECH STACK:
- Languages: Python, JavaScript, C++, Go (learning), HTML, CSS.
- Frameworks: React.js, Node.js, FastAPI, Flask, Django, Tailwind CSS.
- AI/ML: OpenAI API, Agentic AI, Gemini, Claude, Prompt Engineering, n8n automation.
- Data & Tools: MongoDB, Git/GitHub, VS Code, Vercel, Netlify, Google Workspace.

CONTACT:
- Email: ekamnoor.career@gmail.com
- LinkedIn: https://www.linkedin.com/in/ekamnoor-singh-aspiringaiengineer | GitHub: https://github.com/GitWithEkam
- For privacy, his phone number is NOT public. If someone asks for his phone number, kindly invite them to use the "Request Phone Number" button in the Contact section (they leave their email and Ekamnoor reaches out personally), or to connect via email/LinkedIn. Never invent or share a phone number.`;

async function handleChat(request) {
  try {
    const body = await readJsonBody(request);
    const message = (body.message || '').toString().slice(0, 2000);
    let sessionId = body.sessionId || uid();
    if (!message.trim()) return cors(NextResponse.json({ error: 'Empty message' }, { status: 400 }));

    let history = [];
    let col = null;

    try {
      const db = await getDb();
      col = db.collection('chat_messages');
      history = await col.find({ sessionId }).sort({ ts: 1 }).limit(20).toArray();
    } catch (e) {
      console.error('MongoDB history unavailable for chat:', e);
    }

    const llmMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.map((h) => ({ role: h.role, content: h.content })),
      { role: 'user', content: message },
    ];

    const reply = await getLlmReply(message, llmMessages);

    if (col) {
      const now = new Date();
      await col.insertMany([
        { id: uid(), sessionId, role: 'user', content: message, ts: now },
        { id: uid(), sessionId, role: 'assistant', content: reply, ts: new Date(now.getTime() + 1) },
      ]);
    }

    return cors(NextResponse.json({ sessionId, reply }));
  } catch (e) {
    const fallbackBody = await readJsonBody(request);
    return cors(NextResponse.json({ reply: getFallbackReply((fallbackBody.message || '').toString()), error: String(e) }, { status: 200 }));
  }
}

async function handleContact(request) {
  try {
    const body = await readJsonBody(request);
    const doc = {
      id: uid(),
      name: (body.name || '').toString().slice(0, 200),
      email: (body.email || '').toString().slice(0, 200),
      message: (body.message || '').toString().slice(0, 4000),
      ts: new Date(),
    };
    if (!doc.name || !doc.email || !doc.message) return cors(NextResponse.json({ error: 'All fields are required' }, { status: 400 }));
    const db = await getDb();
    await db.collection('contact_messages').insertOne(doc);
    await forwardToSheet({ type: 'contact', name: doc.name, email: doc.email, message: doc.message, ts: doc.ts.toISOString() });
    return cors(NextResponse.json({ ok: true, id: doc.id }));
  } catch (e) {
    return cors(NextResponse.json({ error: String(e) }, { status: 500 }));
  }
}

async function handleLead(request) {
  try {
    const body = await readJsonBody(request);
    const doc = {
      id: uid(),
      type: (body.type || 'general').toString().slice(0, 50),
      name: (body.name || '').toString().slice(0, 200),
      email: (body.email || '').toString().slice(0, 200),
      message: (body.message || '').toString().slice(0, 2000),
      ts: new Date(),
    };
    if (!doc.email) return cors(NextResponse.json({ error: 'Email is required' }, { status: 400 }));
    const db = await getDb();
    await db.collection('leads').insertOne(doc);
    await forwardToSheet({ type: doc.type || 'lead', name: doc.name, email: doc.email, message: doc.message, ts: doc.ts.toISOString() });
    return cors(NextResponse.json({ ok: true, id: doc.id }));
  } catch (e) {
    return cors(NextResponse.json({ error: String(e) }, { status: 500 }));
  }
}

async function handleVisit(method) {
  try {
    const db = await getDb();
    const col = db.collection('site_stats');
    if (method === 'POST') {
      const r = await col.findOneAndUpdate({ _id: 'visits' }, { $inc: { count: 1 } }, { upsert: true, returnDocument: 'after', includeResultMetadata: true });
      const count = (r && r.value && r.value.count) || 1;
      return cors(NextResponse.json({ count }));
    }
    const doc = await col.findOne({ _id: 'visits' });
    return cors(NextResponse.json({ count: (doc && doc.count) || 0 }));
  } catch (e) {
    return cors(NextResponse.json({ count: 0, error: String(e) }));
  }
}

async function handleAdmin(request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    if (!key || key !== ADMIN_PASSWORD) return cors(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }));

    let contacts = [];
    let leads = [];
    let chats = [];
    let stats = null;

    try {
      const db = await getDb();
      const results = await Promise.all([
        db.collection('contact_messages').find({}).sort({ ts: -1 }).limit(1000).toArray(),
        db.collection('leads').find({}).sort({ ts: -1 }).limit(1000).toArray(),
        db.collection('chat_messages').find({}).sort({ ts: -1 }).limit(1000).toArray(),
        db.collection('site_stats').findOne({ _id: 'visits' }),
      ]);
      contacts = results[0] || [];
      leads = results[1] || [];
      chats = results[2] || [];
      stats = results[3] || null;
    } catch (dbError) {
      console.error('Admin dashboard DB error:', dbError);
    }

    const clean = (arr) => arr.map((r) => { const { _id, ...rest } = r; return rest; });
    return cors(NextResponse.json({ visits: (stats && stats.count) || 0, contacts: clean(contacts), leads: clean(leads), chats: clean(chats) }));
  } catch (e) {
    return cors(NextResponse.json({ error: String(e) }, { status: 500 }));
  }
}

export async function GET(request, context) {
  const { path = [] } = (await context.params) || {};
  const route = path.join('/');

  if (route === '' || route === 'health') return cors(NextResponse.json({ message: 'Ekamnoor Singh portfolio API is alive', ok: true }));
  if (route === 'visit') return handleVisit('GET');
  if (route === 'admin') return handleAdmin(request);
  if (route === 'chat/history') {
    try {
      const { searchParams } = new URL(request.url);
      const sessionId = searchParams.get('sessionId');
      if (!sessionId) return cors(NextResponse.json({ messages: [] }));
      const db = await getDb();
      const messages = await db.collection('chat_messages').find({ sessionId }).sort({ ts: 1 }).limit(100).toArray();
      return cors(NextResponse.json({ messages: messages.map((m) => ({ role: m.role, content: m.content })) }));
    } catch (e) {
      return cors(NextResponse.json({ messages: [], error: String(e) }));
    }
  }
  return cors(NextResponse.json({ error: 'Not found' }, { status: 404 }));
}

export async function POST(request, context) {
  const { path = [] } = (await context.params) || {};
  const route = path.join('/');

  if (route === 'chat') return handleChat(request);
  if (route === 'contact') return handleContact(request);
  if (route === 'lead') return handleLead(request);
  if (route === 'visit') return handleVisit('POST');

  return cors(NextResponse.json({ error: 'Not found' }, { status: 404 }));
}

export async function OPTIONS() {
  return cors(new NextResponse(null, { status: 204 }));
}
