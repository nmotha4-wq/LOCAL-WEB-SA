// @vitest-environment jsdom
import { describe, it, expect, beforeAll } from 'vitest';

// blog-data.js is a plain browser script that attaches its API to `window`.
// Under jsdom, `window` is the global, so importing it for its side effects
// populates window.LWSA_* without any refactor.
beforeAll(async () => {
  await import('../blog-data.js');
});

describe('LWSA_makeCover', () => {
  it('is deterministic — the same seed yields byte-identical SVG', () => {
    const a = window.LWSA_makeCover('crust-and-crumb');
    const b = window.LWSA_makeCover('crust-and-crumb');
    expect(a).toBe(b);
  });

  it('produces different output for different seeds', () => {
    const a = window.LWSA_makeCover('alpha');
    const b = window.LWSA_makeCover('beta');
    expect(a).not.toBe(b);
  });

  it('returns a well-formed SVG element string', () => {
    const svg = window.LWSA_makeCover('hello');
    expect(svg.trimStart()).toMatch(/^<svg /);
    expect(svg).toContain('</svg>');
    expect(svg).toContain('<rect');
  });

  it('honors custom width/height in the viewBox', () => {
    const svg = window.LWSA_makeCover('dims', { w: 800, h: 400 });
    expect(svg).toContain('viewBox="0 0 800 400"');
  });

  it('handles an empty/missing seed without throwing', () => {
    expect(() => window.LWSA_makeCover()).not.toThrow();
    expect(() => window.LWSA_makeCover('')).not.toThrow();
  });

  it('tiles stripes without overflowing the canvas width', () => {
    const w = 1600;
    const svg = window.LWSA_makeCover('overflow-check', { w, h: 900 });
    const widths = [...svg.matchAll(/<rect x="(\d+)" y="0" width="(\d+)"/g)];
    // The striped band must fully cover [0, w] and never exceed it.
    for (const m of widths) {
      const x = Number(m[1]);
      const ww = Number(m[2]);
      expect(x + ww).toBeLessThanOrEqual(w);
    }
    const last = widths.at(-1);
    expect(Number(last[1]) + Number(last[2])).toBe(w);
  });
});

describe('LWSA_POSTS', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(window.LWSA_POSTS)).toBe(true);
    expect(window.LWSA_POSTS.length).toBeGreaterThan(0);
  });

  it('every post has the required fields', () => {
    for (const post of window.LWSA_POSTS) {
      for (const field of ['slug', 'title', 'date', 'readMin', 'tag', 'excerpt', 'body']) {
        expect(post, `post "${post.slug}" missing ${field}`).toHaveProperty(field);
      }
      expect(typeof post.readMin).toBe('number');
    }
  });

  it('has unique slugs', () => {
    const slugs = window.LWSA_POSTS.map(p => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe('LWSA_findPost', () => {
  it('finds an existing post by slug', () => {
    const known = window.LWSA_POSTS[0].slug;
    expect(window.LWSA_findPost(known)).toBe(window.LWSA_POSTS[0]);
  });

  it('returns undefined for an unknown slug', () => {
    expect(window.LWSA_findPost('does-not-exist')).toBeUndefined();
  });
});

describe('LWSA_shareLinks', () => {
  const post = { slug: 'the-trust-gap', title: 'The trust & "gap"' };

  it('builds a URL pointing at blog-post.html with the encoded slug', () => {
    const links = window.LWSA_shareLinks(post);
    expect(links.url).toContain('blog-post.html?slug=the-trust-gap');
  });

  it('URL-encodes the title and special characters across channels', () => {
    const links = window.LWSA_shareLinks(post);
    const encodedTitle = encodeURIComponent(post.title);
    expect(links.whatsapp).toContain(encodedTitle);
    expect(links.twitter).toContain(encodedTitle);
    expect(links.email).toContain(encodedTitle);
    // No raw quotes/spaces should leak into the share URLs.
    expect(links.whatsapp).not.toMatch(/[ "]/);
  });

  it('returns a link for every supported channel', () => {
    const links = window.LWSA_shareLinks(post);
    for (const channel of ['url', 'whatsapp', 'twitter', 'facebook', 'linkedin', 'email']) {
      expect(links, `missing ${channel}`).toHaveProperty(channel);
    }
    expect(links.whatsapp).toContain('wa.me');
    expect(links.facebook).toContain('facebook.com');
    expect(links.linkedin).toContain('linkedin.com');
  });
});
