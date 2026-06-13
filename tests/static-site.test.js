// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath as toPath } from 'node:url';
import { JSDOM } from 'jsdom';

const ROOT = resolve(dirname(toPath(import.meta.url)), '..');

const rootHtml = readdirSync(ROOT).filter(f => f.endsWith('.html'));
const templateHtml = readdirSync(resolve(ROOT, 'templates'))
  .filter(f => f.endsWith('.html'))
  .map(f => `templates/${f}`);
const allHtml = [...rootHtml, ...templateHtml];

const docFor = relPath => new JSDOM(readFileSync(resolve(ROOT, relPath), 'utf8')).window.document;

const isExternalOrSpecial = href =>
  /^(https?:|mailto:|tel:|#|data:|javascript:)/i.test(href) || href.trim() === '';

describe('site sanity', () => {
  it('finds the expected pages', () => {
    expect(rootHtml).toContain('index.html');
    expect(templateHtml.length).toBeGreaterThan(0);
  });
});

describe('internal link integrity', () => {
  for (const page of allHtml) {
    it(`${page} — every internal link resolves to a real file`, () => {
      const doc = docFor(page);
      const baseDir = dirname(resolve(ROOT, page));
      const broken = [];
      for (const a of doc.querySelectorAll('a[href]')) {
        const href = a.getAttribute('href');
        if (isExternalOrSpecial(href)) continue;
        const target = href.split('#')[0].split('?')[0];
        if (!target) continue; // pure fragment/query on the same page
        if (!existsSync(resolve(baseDir, target))) broken.push(href);
      }
      expect(broken, `broken links in ${page}: ${broken.join(', ')}`).toEqual([]);
    });
  }
});

describe('document head essentials (root pages)', () => {
  for (const page of rootHtml) {
    it(`${page} — has lang, charset, viewport, title and description`, () => {
      const doc = docFor(page);
      expect(doc.documentElement.getAttribute('lang'), 'html lang').toBeTruthy();
      expect(doc.querySelector('meta[charset]'), 'charset meta').not.toBeNull();
      expect(doc.querySelector('meta[name="viewport"]'), 'viewport meta').not.toBeNull();
      expect(doc.querySelector('title')?.textContent?.trim(), 'title text').toBeTruthy();
      expect(
        doc.querySelector('meta[name="description"]')?.getAttribute('content')?.trim(),
        'meta description',
      ).toBeTruthy();
    });
  }
});

describe('accessibility basics', () => {
  it('every <img> across the site has an alt attribute', () => {
    const offenders = [];
    for (const page of allHtml) {
      for (const img of docFor(page).querySelectorAll('img')) {
        if (img.getAttribute('alt') === null) offenders.push(`${page}: ${img.outerHTML.slice(0, 60)}`);
      }
    }
    expect(offenders).toEqual([]);
  });

  it('icon-only links and buttons have an accessible name', () => {
    const offenders = [];
    for (const page of allHtml) {
      for (const el of docFor(page).querySelectorAll('a, button')) {
        const name =
          el.textContent.trim() ||
          el.getAttribute('aria-label') ||
          el.getAttribute('title') ||
          el.querySelector('img[alt]')?.getAttribute('alt');
        if (!name) offenders.push(`${page}: <${el.tagName.toLowerCase()}>`);
      }
    }
    expect(offenders, offenders.join('\n')).toEqual([]);
  });
});

describe('PWA manifest', () => {
  const manifest = JSON.parse(readFileSync(resolve(ROOT, 'manifest.webmanifest'), 'utf8'));

  it('is valid JSON with the required fields', () => {
    expect(manifest.name).toBeTruthy();
    expect(manifest.start_url).toBeTruthy();
    expect(Array.isArray(manifest.icons)).toBe(true);
    expect(manifest.icons.length).toBeGreaterThan(0);
  });

  it('references icon files that exist on disk', () => {
    for (const icon of manifest.icons) {
      expect(existsSync(resolve(ROOT, icon.src)), `missing icon ${icon.src}`).toBe(true);
    }
  });
});

describe('robots.txt and sitemap.xml', () => {
  it('robots.txt points at the sitemap', () => {
    const robots = readFileSync(resolve(ROOT, 'robots.txt'), 'utf8');
    expect(robots).toMatch(/Sitemap:\s*https?:\/\/\S+sitemap\.xml/i);
  });

  it('sitemap.xml is well-formed and lists absolute https URLs', () => {
    const xml = readFileSync(resolve(ROOT, 'sitemap.xml'), 'utf8');
    const doc = new JSDOM(xml, { contentType: 'application/xml' }).window.document;
    expect(doc.querySelector('parsererror')).toBeNull();
    const locs = [...doc.querySelectorAll('loc')].map(l => l.textContent);
    expect(locs.length).toBeGreaterThan(0);
    for (const loc of locs) expect(loc).toMatch(/^https:\/\//);
  });
});
