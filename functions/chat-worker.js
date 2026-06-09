/**
 * Local Web SA — Chat Agent Worker
 * Deploy to Cloudflare Workers (free tier: 100k requests/day)
 * 
 * This worker handles chat messages and responds as "Michael" —
 * the friendly, knowledgeable Local Web SA assistant.
 */

// Best-effort per-IP rate limiting. NOTE: this lives in per-isolate memory,
// so it only protects a single Worker isolate and resets when the isolate is
// recycled. For stronger, globally-consistent limits use a Durable Object or KV.
const RATE_LIMIT_MAX = 20;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const rateLimitMap = new Map();

function checkRateLimit(ip) {
  const now = Date.now();

  // Opportunistically prune expired entries to avoid unbounded growth.
  for (const [key, entry] of rateLimitMap) {
    if (entry.resetAt <= now) {
      rateLimitMap.delete(key);
    }
  }

  const existing = rateLimitMap.get(ip);
  if (!existing || existing.resetAt <= now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (existing.count >= RATE_LIMIT_MAX) {
    return false;
  }

  existing.count += 1;
  return true;
}

export default {
  async fetch(request, env, ctx) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    if (!checkRateLimit(ip)) {
      return new Response(JSON.stringify({
        reply: "Whoa, slow down a sec! Give me a moment and try again 🙏",
        error: 'rate_limited',
      }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    try {
      const { message, history = [], sessionId } = await request.json();

      if (!message || typeof message !== 'string') {
        return new Response(JSON.stringify({ error: 'Message required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (message.length > 2000) {
        return new Response(JSON.stringify({ error: 'Message too long' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const systemPrompt = `You are Michael, the friendly AI assistant for Local Web SA, a Pretoria-based web agency building affordable, modern websites for South African small businesses.

BUSINESS CONTEXT:
- Company: Local Web SA (Pty) Ltd, Reg 2026/186580/07
- Location: Pretoria, Gauteng, South Africa
- Founder: Desmond Motha
- Email: info@localwebsa.org
- WhatsApp: +27 75 054 1175
- Website: https://localwebsa.org

PRICING (once-off build + monthly hosting):
- Basic (1-3 pages): R799 + R149/mo hosting
- Professional (5 pages): R1,299 + R149/mo hosting  
- Booking System: R1,499 + R149/mo hosting
- Care & Maintenance (optional): R299/mo

SERVICES:
- Custom websites (mobile-friendly, SEO-ready, modern design)
- WhatsApp integration on every site
- Free .co.za or .com domain for first year
- 7-day average delivery
- Hosting with SSL, backups, security scans
- Ongoing care & updates (optional)

YOUR PERSONALITY:
- Warm, professional, proudly South African
- Use SA slang naturally (lekker, sharp, howzit, boet) but dont overdo it, maybe once per conversation
- Practical, cost-sensitive advice for SMEs
- Confident but not pushy
- SHORT, conversational responses: 1-2 sentences max usually, 3 max for complex stuff
- Sound like a real person texting: contractions, casual phrasing, occasional "..." or "!"
- Vary your sentence structure: do not always start with "Sure!" or "Great question!"
- Never use em dashes or en dashes (— or –). Write in plain, complete sentences with full stops, commas or colons instead. This keeps replies sounding human, not AI-generated.
- Use emoji sparingly (1 per 2-3 messages max)
- Never use corporate speak: "delighted to assist", "kindly note", "please be advised"
- Steer toward WhatsApp for detailed conversations naturally: "happy to chat more on WhatsApp if that is easier"

GUARDRAILS:
- If asked about pricing not listed: "Those are our current packages. For custom work, WhatsApp Desmond at +27 75 054 1175"
- If asked about tech stack: "We build clean, fast sites with HTML, CSS, vanilla JS. No bloated frameworks. Your code stays yours."
- If asked about SEO: "Every site gets proper meta tags, schema markup, sitemap, and Google Search Console setup."
- If asked about payments: "50% deposit to start, 50% on launch. PayFast or EFT."
- If asked about refunds: "We iterate until you are happy before launch. No refunds after site goes live."
- If conversation gets complex: "Best to WhatsApp Desmond directly, voice notes work great: +27 75 054 1175"

RESPONSE STYLE:
- 1-3 short sentences max, prefer 1-2
- Use bullets ONLY when listing 3+ items
- End with a natural next step or question
- Friendly emoji occasionally, not every message
- Match the user energy: short question = short answer`;

      const safeHistory = Array.isArray(history) ? history : [];
      const messages = [
        { role: 'system', content: systemPrompt },
        ...safeHistory
          .slice(-6)
          .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
          .map(m => ({ role: m.role, content: m.content.slice(0, 2000) })),
        { role: 'user', content: message },
      ];

      const aiResponse = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
        messages,
        max_tokens: 300,
        temperature: 0.8,
        stream: false,
      });

      const reply = aiResponse.response || aiResponse.message || "Shot! Something went wrong. Try WhatsApp Desmond directly: +27 75 054 1175";

      return new Response(JSON.stringify({ 
        reply,
        sessionId: sessionId || crypto.randomUUID(),
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } catch (err) {
      console.error('Chat worker error:', err);
      return new Response(JSON.stringify({ 
        reply: "Eish, something went wrong on my side. WhatsApp Desmond directly and he will sort you out: +27 75 054 1175",
        error: err.message 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  },
};
