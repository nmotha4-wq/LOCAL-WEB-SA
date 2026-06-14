/* ========== LOCAL WEB SA — Shared App ========== */
(function(){

  // ============ PURE HELPERS (also exposed on window.LWSA_APP for tests) ============

  // Escape user/assistant text before injecting — prevents HTML injection.
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // Format a number as a South African Rand string, e.g. 1299 -> "R1 299".
  const formatZAR = n => 'R' + Number(n).toLocaleString('en-ZA');

  // Resolve which nav filename should be highlighted for a given pathname.
  // Blog post pages highlight the Blog tab.
  function normalizeNavPath(pathname) {
    let path = ((pathname || '').split('/').pop() || 'index.html').toLowerCase();
    if (path === 'blog-post.html') path = 'blog.html';
    return path;
  }

  // ---- Pricing data + math (rendering lives in the pricing-page block below) ----
  const PRICING_PACKAGES = [
    { id:'basic', name:'Basic Website', price:799, desc:'Perfect for getting online fast with a clean, professional look.', features:['1-page long-scroll site','Custom domain + SSL','WhatsApp CTA button','Google Business sync','Mobile-first design','7-day delivery'] },
    { id:'professional', name:'Professional 5-Page', price:1299, desc:'Ideal for established businesses wanting a full online presence.', popular:true, features:['Up to 5 pages','Contact + enquiry form','SEO basics + sitemap','Per-page meta tags','Photo gallery','Free first revision','7-day delivery'] },
    { id:'booking', name:'Booking System', price:1499, desc:'Take online bookings 24/7 and automate your appointment schedule.', features:['Everything in Professional','Online booking calendar','Email + WhatsApp notifications','Service & staff management','Customer reminders','Two revision rounds','10–14 day delivery'] }
  ];
  const PRICING_MONTHLY = { hosting:{ name:'Website Hosting', price:149 }, care:{ name:'Care & Maintenance', price:299 } };

  // Given a package id and the care toggle, compute the once-off, recurring,
  // first-month and year-1 totals. Returns null for an unknown package id.
  function computePricing(selectedPkgId, careOn) {
    const pkg = PRICING_PACKAGES.find(p => p.id === selectedPkgId);
    if (!pkg) return null;
    const recurring = careOn ? PRICING_MONTHLY.care : PRICING_MONTHLY.hosting;
    const onceOff = pkg.price;
    const monthlyAmt = recurring.price;
    return {
      pkg, recurring, onceOff, monthlyAmt,
      firstMonth: onceOff + monthlyAmt,
      year1: onceOff + monthlyAmt * 12,
    };
  }

  // ============ NAV / MOBILE MENU ============
  const nav = document.getElementById('nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    // active link (blog posts highlight the Blog tab)
    const path = normalizeNavPath(location.pathname);
    document.querySelectorAll('#nav .nav-links a, .mobile-menu a').forEach(a => {
      const href = (a.getAttribute('href')||'').toLowerCase();
      if (href === path || (path === '' && href === 'index.html')) a.classList.add('active');
    });
  }
  const menuBtn = document.getElementById('menuBtn');
  const menuClose = document.getElementById('menuClose');
  const mm = document.getElementById('mobileMenu');
  if (menuBtn && mm) {
    // body.nav-open uses position:fixed (iOS scroll lock), which scrolls the
    // page to the top — save and restore the scroll offset around it.
    let scrollLockY = 0;
    const openMenu = () => {
      scrollLockY = window.scrollY;
      mm.classList.add('open');
      document.body.classList.add('nav-open');
      document.body.style.top = -scrollLockY + 'px';
      menuBtn.setAttribute('aria-expanded', 'true');
    };
    const closeMenu = () => {
      mm.classList.remove('open');
      document.body.classList.remove('nav-open');
      document.body.style.top = '';
      window.scrollTo({ top: scrollLockY, left: 0, behavior: 'instant' });
      menuBtn.setAttribute('aria-expanded', 'false');
    };
    menuBtn.addEventListener('click', openMenu);
    menuClose && menuClose.addEventListener('click', closeMenu);
    mm.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
    // Close on backdrop click
    mm.addEventListener('click', (e) => {
      if (e.target === mm) closeMenu();
    });
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mm.classList.contains('open')) closeMenu();
    });
  }

  // ============ FADE IN ============
  if (typeof IntersectionObserver !== 'undefined') {
    // Cascade reveal: grouped items (feature grid, plans, cards) settle in
    // sequence rather than popping at once. Each element is pre-stamped with
    // its index among same-parent .fade-in siblings (capped so long lists
    // don't drag), and we offset the .in class by that index on reveal. The
    // delay lives in JS, not CSS, so it never bleeds into hover/active states.
    const reduceMotion = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const delay = reduceMotion ? 0 : (Number(el.dataset.ri) || 0) * 70;
        setTimeout(() => el.classList.add('in'), delay);
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    const groupIndex = new Map();
    document.querySelectorAll('.fade-in').forEach(el => {
      const parent = el.parentElement;
      const i = groupIndex.get(parent) || 0;
      el.dataset.ri = Math.min(i, 6);
      groupIndex.set(parent, i + 1);
      io.observe(el);
    });
  }

  // ============ FAQ ============
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const open = item.classList.toggle('open');
      btn.setAttribute('aria-expanded', open);
    });
  });

  // ============ PRICING (only present on pricing page) ============
  const pricingGrid = document.getElementById('pricingGrid');
  const careToggle = document.getElementById('careToggle');
  const hostingCard = document.getElementById('hostingCard');
  const sumList = document.getElementById('summaryList');
  const sumTotals = document.getElementById('summaryTotals');

  if (pricingGrid){
    const packages = PRICING_PACKAGES;

    let selectedPkg = 'professional';
    let careOn = false;
    let openPkg = null;

    function renderPricing(){
      pricingGrid.innerHTML = packages.map(p => `
        <article class="pricing-card${selectedPkg===p.id?' selected':''}${openPkg===p.id?' open':''}" data-pkg="${p.id}" tabindex="0" role="button" aria-pressed="${selectedPkg===p.id}">
          ${p.popular?'<span class="popular">Most Popular</span>':''}
          <div class="top">
            <span class="radio" aria-hidden="true"></span>
            <span class="name">${p.name}</span>
            <span class="price">${formatZAR(p.price)}<small>once-off</small></span>
          </div>
          <p class="desc">${p.desc}</p>
          <button class="expand" data-expand="${p.id}" aria-expanded="${openPkg===p.id}">
            <span>What's included</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div class="includes"><ul>${p.features.map(f=>`<li>${f}</li>`).join('')}</ul></div>
        </article>
      `).join('');
    }
    function renderSummary(){
      if (!sumList || !sumTotals) return;
      const { pkg, recurring, onceOff, monthlyAmt, firstMonth, year1 } = computePricing(selectedPkg, careOn);
      sumList.innerHTML = `
        <div class="summary-row"><span class="lbl"><b>${pkg.name}</b><small>Once-off build</small></span><span class="val">${formatZAR(onceOff)}</span></div>
        <div class="summary-row"><span class="lbl"><b>${recurring.name}</b><small>Monthly recurring</small></span><span class="val">${formatZAR(monthlyAmt)}<small style="color:var(--text-grey);font-weight:600">/mo</small></span></div>
      `;
      sumTotals.innerHTML = `
        <div class="row"><span>Once-off build</span><span class="v">${formatZAR(onceOff)}</span></div>
        <div class="row"><span>Monthly recurring</span><span class="v">${formatZAR(monthlyAmt)}<small>/mo</small></span></div>
        <div class="row"><span>Website + 1st month</span><span class="v">${formatZAR(firstMonth)}</span></div>
        <div class="row year1"><span>Year 1 total</span><span class="v">${formatZAR(year1)}</span></div>
      `;
    }

    renderPricing(); renderSummary();
    pricingGrid.addEventListener('click', e => {
      const exp = e.target.closest('[data-expand]');
      if (exp){
        e.stopPropagation();
        openPkg = (openPkg === exp.dataset.expand) ? null : exp.dataset.expand;
        renderPricing(); renderSummary();
        return;
      }
      const card = e.target.closest('[data-pkg]');
      if (card){ selectedPkg = card.dataset.pkg; renderPricing(); renderSummary(); }
    });
    pricingGrid.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' '){
        const card = e.target.closest('[data-pkg]');
        if (card){ e.preventDefault(); selectedPkg = card.dataset.pkg; renderPricing(); renderSummary(); }
      }
    });
    if (careToggle){
      careToggle.addEventListener('click', () => {
        careOn = !careOn;
        careToggle.classList.toggle('on', careOn);
        careToggle.setAttribute('aria-checked', careOn);
        if (hostingCard) hostingCard.style.opacity = careOn ? '0.5' : '1';
        renderSummary();
      });
    }
  }

  // ============ DEDICATED CHAT PAGE (chat.html) ============
  (function(){
    const messages = document.getElementById('chatMessages');
    const input = document.getElementById('chatInput');
    const form = document.getElementById('chatForm');
    const typing = document.getElementById('chatTyping');
    const suggestions = document.getElementById('chatSuggestions');
    const suggestToggle = document.getElementById('chatSuggestToggle');

    // Only runs on the dedicated chat page
    if (!messages || !form || !input) return;

    function setSuggestions(open) {
      if (!suggestions) return;
      suggestions.hidden = !open;
      if (suggestToggle) suggestToggle.setAttribute('aria-expanded', String(open));
    }

    const WORKER_URL = 'https://localwebsa-chat-worker.nmotha4.workers.dev';

    let sessionId = localStorage.getItem('lws_chat_session') ||
      (crypto.randomUUID ? crypto.randomUUID() : 'lws-' + Date.now() + '-' + Math.random().toString(16).slice(2));
    localStorage.setItem('lws_chat_session', sessionId);
    let history = [];
    try { history = JSON.parse(localStorage.getItem('lws_chat_history') || '[]'); } catch (e) { history = []; }

    const suggestionChips = [
      'How much for a 5-page site?',
      'What\'s included in hosting?',
      'How long to build?',
      'Do you do e-commerce?',
      'WhatsApp me the details',
    ];

    function saveHistory() {
      try { localStorage.setItem('lws_chat_history', JSON.stringify(history.slice(-20))); } catch (e) {}
    }

    function renderSuggestions() {
      if (!suggestions) return;
      suggestions.innerHTML = suggestionChips.map(text =>
        `<button type="button" class="suggestion-chip" data-text="${esc(text).replace(/"/g, '&quot;')}">${esc(text)}</button>`
      ).join('');
    }

    const AVATAR_BOT = '<div class="msg-avatar" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M20 21c0-3.5-2.5-6.5-6-6.5S8 17.5 8 21"/></svg></div>';
    const AVATAR_USER = '<div class="msg-avatar" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg></div>';

    function addMessage(role, content) {
      const div = document.createElement('div');
      div.className = `chat-message ${role}`;
      div.innerHTML =
        (role === 'assistant' ? AVATAR_BOT : '') +
        `<div class="msg-bubble">${esc(content)}</div>` +
        (role === 'user' ? AVATAR_USER : '');
      messages.appendChild(div);
      messages.scrollTop = messages.scrollHeight;
      return div;
    }

    function showTyping(show) {
      if (!typing) return;
      typing.style.display = show ? 'flex' : 'none';
      typing.setAttribute('aria-hidden', String(!show));
      if (show) messages.scrollTop = messages.scrollHeight;
    }

    async function sendToWorker(message) {
      try {
        const response = await fetch(WORKER_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message, history, sessionId }),
        });
        const data = await response.json();
        if (data.sessionId) sessionId = data.sessionId;
        return data.reply || 'Shot! Something went wrong. Try WhatsApp: +27 75 054 1175';
      } catch (err) {
        console.error('Chat error:', err);
        return 'Eish, can\'t reach the server. WhatsApp Desmond directly: +27 75 054 1175 📱';
      }
    }

    let sending = false;
    async function handleSend(text) {
      if (sending || !text.trim()) return;
      sending = true;
      const userMsg = text.trim();
      input.value = '';
      addMessage('user', userMsg);
      history.push({ role: 'user', content: userMsg });
      saveHistory();

      showTyping(true);
      const reply = await sendToWorker(userMsg);
      showTyping(false);

      addMessage('assistant', reply);
      history.push({ role: 'assistant', content: reply });
      saveHistory();
      sending = false;
      input.focus();
    }

    // Collapse the quick-questions after one is used, to free reading space
    function handleSendAndCollapse(text) {
      setSuggestions(false);
      handleSend(text);
    }

    // Welcome message or replay saved history
    if (history.length === 0) {
      const welcome = `Howzit! I'm Michael, your Local Web SA assistant 🇿🇦

I can help with:
• Pricing & packages (from R799)
• What's included in each plan
• Hosting & maintenance details
• Booking a consultation
• Or just WhatsApp Desmond: +27 75 054 1175

What are you looking for?`;
      addMessage('assistant', welcome);
      history.push({ role: 'assistant', content: welcome });
      saveHistory();
    } else {
      history.forEach(m => addMessage(m.role, m.content));
    }

    renderSuggestions();
    setSuggestions(false); // collapsed by default — conversation stays readable

    if (suggestToggle) {
      suggestToggle.addEventListener('click', () => {
        setSuggestions(suggestions.hidden); // open if currently hidden
      });
    }

    form.addEventListener('submit', e => { e.preventDefault(); handleSend(input.value); });
    if (suggestions) {
      suggestions.addEventListener('click', e => {
        const chip = e.target.closest('.suggestion-chip');
        if (chip) handleSendAndCollapse(chip.dataset.text);
      });
    }
    input.focus();
  })();

  // ============ CONTACT FORM ============
  const cf = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  if (cf){
    // Prefill from the template-gallery CTA (contact.html?package=...&style=...)
    const qp = new URLSearchParams(location.search);
    const pkgLabels = {
      basic: 'Basic Website (R799)',
      starter: 'Professional 5-Page (R1,299)',
      premium: 'Booking System (R1,499)'
    };
    const pkgSel = document.getElementById('cf-pkg');
    const wantedPkg = pkgLabels[(qp.get('package') || '').toLowerCase()];
    if (pkgSel && wantedPkg) {
      [...pkgSel.options].forEach(o => { o.selected = (o.textContent === wantedPkg); });
    }
    const styleParam = qp.get('style');
    const msgField = document.getElementById('cf-msg');
    if (styleParam && msgField && !msgField.value) {
      msgField.value = 'I like the "' + styleParam + '" demo template.\n';
    }

    // The form endpoint is unconfigured until the Formspree ID is set —
    // fall back to sending the brief over WhatsApp so no lead is lost.
    const endpointConfigured = cf.action.indexOf('YOUR_FORM_ID') === -1;
    const briefToWhatsApp = () => {
      const fd = new FormData(cf);
      const lines = [
        'New website brief from localwebsa.org:',
        'Name: ' + (fd.get('name') || '-'),
        'WhatsApp: ' + (fd.get('whatsapp') || '-'),
        'Business: ' + (fd.get('business') || '-'),
        'Package: ' + (fd.get('package') || '-'),
        'About: ' + (fd.get('message') || '-')
      ];
      window.open('https://wa.me/27750541175?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');
    };

    cf.addEventListener('submit', async e => {
      e.preventDefault();
      const btn = cf.querySelector('button[type=submit]');
      const originalText = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;
      if (formStatus) { formStatus.style.display = 'none'; formStatus.className = ''; }

      try {
        let ok;
        if (endpointConfigured) {
          const formData = new FormData(cf);
          const response = await fetch(cf.action, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
          });
          ok = response.ok;
        } else {
          briefToWhatsApp();
          ok = true;
        }

        if (ok) {
          btn.textContent = 'Sent. We\'ll WhatsApp you back ✓';
          btn.style.background = '#10b981';
          if (formStatus) {
            formStatus.textContent = endpointConfigured
              ? 'Thanks! We\'ll reply on WhatsApp within 2 hours.'
              : 'Your brief is ready in WhatsApp — just hit send. We reply within 2 hours.';
            formStatus.style.display = 'block'; formStatus.style.color = '#10b981';
          }
          cf.reset();
        } else {
          throw new Error('Form submission failed');
        }
      } catch (err) {
        btn.textContent = 'Something went wrong, try again';
        btn.style.background = '#ef4444';
        if (formStatus) { formStatus.textContent = 'Could not send. Please WhatsApp us directly at +27 75 054 1175'; formStatus.style.display = 'block'; formStatus.style.color = '#ef4444'; }
      }
      
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
      }, 5000);
    });
  }

  // Expose the pure helpers for unit testing without affecting browser usage.
  if (typeof window !== 'undefined') {
    window.LWSA_APP = { esc, formatZAR, normalizeNavPath, computePricing, PRICING_PACKAGES, PRICING_MONTHLY };
  }

})();
