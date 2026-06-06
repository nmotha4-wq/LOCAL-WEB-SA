/**
 * Local Web SA — Chat Agent Worker
 * Deploy to Cloudflare Workers (free tier: 100k requests/day)
 * 
 * This worker handles chat messages and responds as "Michael" —
 * the friendly, knowledgeable Local Web SA assistant.
 */

export default {
  async fetch(request, env, ctx) {
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    try {
      const { message, history = [], sessionId } = await request.json();

      if (!message || typeof message !== 'string') {
        return new Response(JSON.stringify({ error: 'Message required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Build system prompt for Michael
      const systemPrompt = `You are Michael, the friendly AI assistant for Local Web SA — a Pretoria-based web agency building affordable, modern websites for South African small businesses.

BUSINESS CONTEXT:
- Company: Local Web SA (Pty) Ltd, Reg 2026/186580/07
- Location: Pretoria, Gauteng, South Africa
- Founder: Desmond Motha
- Email: info@localwebsa.org
- WhatsApp: +27 75 054 1175
- Website: https://localwebsa.org

PRICING (once-off build + monthly hosting):
- Basic (1–3 pages): R799 + R149/mo hosting
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
- Use SA slang naturally (lekker, sharp, howzit, boet, etc.) but don't overdo it
- Practical, cost-sensitive advice for SMEs
- Confident but not pushy
- Short, punchy responses — prefer bullets over walls of text
- Always steer toward WhatsApp for detailed conversations
- Never make up prices or features not listed above

GUARDRAILS:
- If asked about pricing not listed → "Those are our current packages. For custom work, WhatsApp Desmond at +27 75 054 1175"
- If asked about tech stack → "We build clean, fast sites — HTML, CSS, vanilla JS. No bloated frameworks. Your code stays yours."
- If asked about SEO → "Every site gets proper meta tags, schema markup, sitemap, and Google Search Console setup."
- If asked about payments → "50% deposit to start, 50% on launch. PayFast or EFT."
- If asked about refunds → "We iterate until you're happy before launch. No refunds after site goes live."
- If conversation gets complex → "Best to WhatsApp Desmond directly — voice notes work great: +27 75 054 1175"

RESPONSE STYLE:
- 1-3 short paragraphs max
- Use bullets for lists
- End with a clear next step (WhatsApp, visit pricing page, etc.)
- Friendly emoji occasionally (🇿🇦, ✨, 📱, 💡)`;

      // Build messages for the LLM
      const messages = [
        { role: 'system', content: systemPrompt },
        ...history.slice(-6).map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: message },
      ];

      // Call Cloudflare Workers AI (Llama 3.1 8B - free tier)
      const aiResponse = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
        messages,
        max_tokens: 400,
        temperature: 0.7,
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
        reply: "Eish, something went wrong on my side. WhatsApp Desmond directly — he'll sort you out: +27 75 054 1175 📱",
        error: err.message 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  },
};