// @vitest-environment jsdom
import { describe, it, expect, beforeAll } from 'vitest';

// app.js is a browser IIFE. Importing it under jsdom runs the IIFE (all DOM
// wiring is guarded by element/feature checks, so an empty document is safe)
// and exposes the pure helpers on window.LWSA_APP.
let API;
beforeAll(async () => {
  await import('../app.js');
  API = window.LWSA_APP;
});

describe('esc', () => {
  it('escapes HTML-significant characters', () => {
    expect(API.esc('<script>alert(1)</script>')).toBe('&lt;script&gt;alert(1)&lt;/script&gt;');
  });

  it('escapes ampersands first so entities are not double-broken', () => {
    expect(API.esc('a & b < c')).toBe('a &amp; b &lt; c');
  });

  it('coerces non-string input', () => {
    expect(API.esc(42)).toBe('42');
    expect(API.esc(null)).toBe('null');
  });
});

describe('formatZAR', () => {
  it('formats whole rand without a separator under 1000', () => {
    expect(API.formatZAR(799)).toBe('R799');
  });

  it('groups thousands (separator char is locale-dependent)', () => {
    const out = API.formatZAR(1299);
    expect(out.startsWith('R')).toBe(true);
    expect(out.replace(/\D/g, '')).toBe('1299');
  });

  it('formats year-1-sized totals', () => {
    expect(API.formatZAR(3087).replace(/\D/g, '')).toBe('3087');
  });
});

describe('normalizeNavPath', () => {
  it('defaults the site root to index.html', () => {
    expect(API.normalizeNavPath('/')).toBe('index.html');
    expect(API.normalizeNavPath('')).toBe('index.html');
  });

  it('extracts the filename from a full path and lowercases it', () => {
    expect(API.normalizeNavPath('/some/dir/Pricing.html')).toBe('pricing.html');
  });

  it('maps blog post pages onto the Blog tab', () => {
    expect(API.normalizeNavPath('/blog-post.html')).toBe('blog.html');
  });

  it('passes through ordinary pages', () => {
    expect(API.normalizeNavPath('/contact.html')).toBe('contact.html');
  });
});

describe('computePricing', () => {
  it('computes hosting totals for the Basic package (care off)', () => {
    const r = API.computePricing('basic', false);
    expect(r.onceOff).toBe(799);
    expect(r.monthlyAmt).toBe(149);          // hosting
    expect(r.firstMonth).toBe(799 + 149);
    expect(r.year1).toBe(799 + 149 * 12);
    expect(r.recurring.name).toBe('Website Hosting');
  });

  it('swaps the recurring line to Care & Maintenance when care is on', () => {
    const r = API.computePricing('professional', true);
    expect(r.onceOff).toBe(1299);
    expect(r.monthlyAmt).toBe(299);          // care
    expect(r.firstMonth).toBe(1299 + 299);
    expect(r.year1).toBe(1299 + 299 * 12);
    expect(r.recurring.name).toBe('Care & Maintenance');
  });

  it('computes totals for the Booking package', () => {
    const r = API.computePricing('booking', false);
    expect(r.onceOff).toBe(1499);
    expect(r.year1).toBe(1499 + 149 * 12);
  });

  it('returns null for an unknown package id', () => {
    expect(API.computePricing('enterprise', false)).toBeNull();
  });
});
