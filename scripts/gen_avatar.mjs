import fs from 'fs';

const KEY = process.env.EMERGENT_LLM_KEY || 'sk-emergent-1CaE8A82823E922B0C';
const BASE = process.env.EMERGENT_LLM_BASE_URL || 'https://integrations.emergentagent.com/llm';

const prompt = `A friendly, professional turbaned Sikh software developer character, full body, standing confidently and holding an open glowing laptop in one arm, the other hand raised in a warm, respectful greeting wave with a kind smile. He wears a neat bright saffron-orange turban, a well-groomed dark beard, and a modern smart-casual tech outfit. The background seamlessly blends two worlds: on one side a futuristic high-tech environment with glowing blue circuit lines, holographic UI panels, floating code symbols and neon network nodes; on the other side the warm golden mustard fields and rural skyline of Punjab at sunrise. Vibrant saffron, gold and royal-blue colour palette, modern friendly 3D Pixar-style character illustration, clean, highly detailed, centered character, soft cinematic lighting, no text.`;

async function gen(model, out) {
  const t0 = Date.now();
  try {
    const r = await fetch(`${BASE}/images/generations`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, prompt, n: 1, size: '1024x1024' }),
    });
    const d = await r.json();
    if (d && d.data && d.data[0] && d.data[0].b64_json) {
      fs.writeFileSync(out, Buffer.from(d.data[0].b64_json, 'base64'));
      console.log('OK', model, '->', out, fs.statSync(out).size, 'bytes', ((Date.now() - t0) / 1000) + 's');
    } else {
      console.log('FAIL', model, JSON.stringify(d).slice(0, 300));
    }
  } catch (e) {
    console.log('ERR', model, String(e));
  }
}

const tasks = [
  ['gpt-image-2', '/app/public/avatar_gpt.png'],
  ['gemini/gemini-3-pro-image-preview', '/app/public/avatar_gemini.png'],
];

for (const [m, o] of tasks) {
  await gen(m, o);
}
console.log('ALL DONE');
