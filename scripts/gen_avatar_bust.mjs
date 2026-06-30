import fs from 'fs';

const KEY = process.env.EMERGENT_LLM_KEY || 'sk-emergent-1CaE8A82823E922B0C';
const BASE = process.env.EMERGENT_LLM_BASE_URL || 'https://integrations.emergentagent.com/llm';

const prompt = `Head-and-shoulders portrait avatar of a friendly, professional turbaned developer character, centered, facing forward with a warm confident smile, looking directly at the viewer. He wears a neat bright saffron-orange turban, a well-groomed dark beard, and a modern smart-casual tech outfit (blazer over a tee). Clean, simple dark navy-blue studio background with a subtle soft glow of blue and orange tech bokeh, no busy details. Modern friendly 3D Pixar-style character illustration, highly detailed clean face, soft cinematic studio lighting, symmetrical, perfect for a circular profile avatar, no text, no laptop, no hands.`;

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
      console.log('FAIL', model, JSON.stringify(d).slice(0, 400));
    }
  } catch (e) {
    console.log('ERR', model, String(e));
  }
}

await gen('gemini/gemini-3-pro-image-preview', '/app/public/avatar_bust_gemini.png');
await gen('gpt-image-2', '/app/public/avatar_bust_gpt.png');
console.log('ALL DONE');
