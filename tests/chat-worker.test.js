// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import worker, { checkRateLimit } from '../functions/chat-worker.js';

const RATE_LIMIT_MAX = 20;
const WINDOW_MS = 60 * 1000;

// Each test uses a unique IP so the module-level rateLimitMap (shared state)
// doesn't leak between cases.
let ipCounter = 0;
const uniqueIp = () => `10.0.0.${ipCounter++}`;

function makeRequest(body, { method = 'POST', ip = uniqueIp() } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (ip) headers['CF-Connecting-IP'] = ip;
  return new Request('https://worker.example/chat', {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

function makeEnv(aiResult = { response: 'Howzit! 🇿🇦' }) {
  return { AI: { run: vi.fn().mockResolvedValue(aiResult) } };
}

describe('checkRateLimit', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(0);
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('allows the first request from an IP', () => {
    expect(checkRateLimit(uniqueIp())).toBe(true);
  });

  it(`allows exactly ${RATE_LIMIT_MAX} requests then blocks the next`, () => {
    const ip = uniqueIp();
    for (let i = 0; i < RATE_LIMIT_MAX; i++) {
      expect(checkRateLimit(ip)).toBe(true);
    }
    expect(checkRateLimit(ip)).toBe(false);
    expect(checkRateLimit(ip)).toBe(false);
  });

  it('resets the allowance after the window elapses', () => {
    const ip = uniqueIp();
    for (let i = 0; i < RATE_LIMIT_MAX; i++) checkRateLimit(ip);
    expect(checkRateLimit(ip)).toBe(false);

    // Advance past the window — the stale entry should be pruned/reset.
    vi.setSystemTime(WINDOW_MS + 1);
    expect(checkRateLimit(ip)).toBe(true);
  });

  it('tracks IPs independently', () => {
    const a = uniqueIp();
    const b = uniqueIp();
    for (let i = 0; i < RATE_LIMIT_MAX; i++) checkRateLimit(a);
    expect(checkRateLimit(a)).toBe(false);
    // b is untouched and should still be allowed.
    expect(checkRateLimit(b)).toBe(true);
  });
});

describe('worker.fetch — method handling', () => {
  it('answers CORS preflight (OPTIONS) with the allow headers', async () => {
    const res = await worker.fetch(makeRequest(undefined, { method: 'OPTIONS' }), makeEnv());
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
    expect(res.headers.get('Access-Control-Allow-Methods')).toContain('POST');
  });

  it('rejects non-POST methods with 405', async () => {
    const res = await worker.fetch(makeRequest(undefined, { method: 'GET' }), makeEnv());
    expect(res.status).toBe(405);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
  });
});

describe('worker.fetch — validation', () => {
  it('returns 400 when message is missing', async () => {
    const res = await worker.fetch(makeRequest({ history: [] }), makeEnv());
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Message required');
  });

  it('returns 400 when message is not a string', async () => {
    const res = await worker.fetch(makeRequest({ message: 42 }), makeEnv());
    expect(res.status).toBe(400);
  });

  it('returns 400 when message exceeds 2000 chars', async () => {
    const res = await worker.fetch(makeRequest({ message: 'x'.repeat(2001) }), makeEnv());
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Message too long');
  });

  it('returns 429 once the IP is rate-limited', async () => {
    const env = makeEnv();
    const ip = uniqueIp();
    for (let i = 0; i < RATE_LIMIT_MAX; i++) {
      await worker.fetch(makeRequest({ message: 'hi' }, { ip }), env);
    }
    const res = await worker.fetch(makeRequest({ message: 'hi' }, { ip }), env);
    expect(res.status).toBe(429);
    const body = await res.json();
    expect(body.error).toBe('rate_limited');
  });
});

describe('worker.fetch — happy path & AI integration', () => {
  it('returns the AI reply and assembles the prompt correctly', async () => {
    const env = makeEnv({ response: 'Lekker, here you go!' });
    const res = await worker.fetch(makeRequest({ message: 'How much?' }), env);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.reply).toBe('Lekker, here you go!');
    expect(typeof body.sessionId).toBe('string');

    const callArg = env.AI.run.mock.calls[0][1];
    expect(callArg.messages[0].role).toBe('system');
    expect(callArg.messages.at(-1)).toEqual({ role: 'user', content: 'How much?' });
  });

  it('falls back to the shared "unknown" bucket when CF-Connecting-IP is absent', async () => {
    const env = makeEnv();
    const res = await worker.fetch(makeRequest({ message: 'hi' }, { ip: null }), env);
    expect(res.status).toBe(200);
  });

  it('echoes the provided sessionId', async () => {
    const env = makeEnv();
    const res = await worker.fetch(makeRequest({ message: 'hi', sessionId: 'sess-123' }), env);
    const body = await res.json();
    expect(body.sessionId).toBe('sess-123');
  });

  it('sanitizes history: takes the last 6 raw entries, THEN filters and truncates', async () => {
    const env = makeEnv();
    // NOTE: the worker does .slice(-6) BEFORE .filter(), so invalid entries
    // among the last 6 are dropped and reduce the surviving count below 6.
    const history = [
      { role: 'user', content: 'm1' },                       // outside the last 6
      { role: 'assistant', content: 'm2' },                  // outside the last 6
      { role: 'system', content: 'injected system prompt' }, // outside the last 6
      { role: 'user', content: 12345 },                      // outside the last 6
      null,                                                  // in last 6 -> dropped (falsy)
      { role: 'user', content: 'm3' },
      { role: 'assistant', content: 'm4' },
      { role: 'user', content: 'm5' },
      { role: 'assistant', content: 'm6' },
      { role: 'user', content: 'x'.repeat(5000) },           // truncated to 2000
    ];
    await worker.fetch(makeRequest({ message: 'now', history }), env);

    const sent = env.AI.run.mock.calls[0][1].messages;
    const historyMsgs = sent.slice(1, -1); // drop system prompt + final user message

    // No injected system-role messages can ever reach the model.
    expect(historyMsgs.some(m => m.role === 'system')).toBe(false);
    // Last 6 raw entries = [null, m3, m4, m5, m6, long]; the null is filtered out.
    expect(historyMsgs.map(m => m.content)).toEqual(['m3', 'm4', 'm5', 'm6', 'x'.repeat(2000)]);
    // Long content is clamped to 2000 chars.
    expect(historyMsgs.at(-1).content.length).toBe(2000);
  });

  it('tolerates non-array history without throwing', async () => {
    const env = makeEnv();
    const res = await worker.fetch(makeRequest({ message: 'hi', history: 'not-an-array' }), env);
    expect(res.status).toBe(200);
  });

  it('falls back to a default reply when the AI returns no text', async () => {
    const env = makeEnv({});
    const res = await worker.fetch(makeRequest({ message: 'hi' }), env);
    const body = await res.json();
    expect(body.reply).toMatch(/WhatsApp/i);
  });

  it('returns 500 with a friendly reply when the AI call throws', async () => {
    const env = { AI: { run: vi.fn().mockRejectedValue(new Error('AI down')) } };
    const res = await worker.fetch(makeRequest({ message: 'hi' }), env);
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.reply).toMatch(/WhatsApp/i);
    expect(body.error).toBe('AI down');
  });

  it('returns 500 on malformed JSON body', async () => {
    const req = new Request('https://worker.example/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'CF-Connecting-IP': uniqueIp() },
      body: '{ not json',
    });
    const res = await worker.fetch(req, makeEnv());
    expect(res.status).toBe(500);
  });
});
