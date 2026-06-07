/* ========== LOCAL WEB SA — Shared App ========== */
(function(){

  // ============ NAV / MOBILE MENU ============
  const nav = document.getElementById('nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    // active link
    const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    document.querySelectorAll('#nav .nav-links a, .mobihle-menu a').forEach(a => {
      const href = (a.getAttribute('href')||'').toLowerCase();
      if (href === path || (path === '' && href === 'index.html')) a.classList.add('active');
    });
  }
  const menuBtn = document.getElementById('menuBtn');
  const menuClose = document.getElementById('menuClose');
  const mm = document.getElementById('mobileMenu');
  if (menuBtn && mm) {
    const openMenu = () => {
      mm.classList.add('open');
      document.body.classList.add('nav-open');
      menuBtn.setAttribute('aria-expanded', 'true');
    };
    const closeMenu = () => {
      mm.classList.remove('open');
      document.body.classList.remove('nav-open');
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
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.fade-in').forEach(el => io.observe(el))

  // ============ FAQ ============
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const open = item.classList.toggle('open');
      btn.setAttribute('aria-expanded', open);
    });
  });

  // ============ 3D ORBITAL FIELD ============
  // Every blue hero/section gets a <canvas class="orbit-canvas">.
  // We mount one Three.js scene per canvas.
  const canvases = document.querySelectorAll('.orbit-canvas');
  if (canvases.length && window.THREE) {
    canvases.forEach(mountOrbit);
  }

  function mountOrbit(canvas){
    const parent = canvas.parentElement;
    const w = () => parent.clientWidth;
    const h = () => parent.clientHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, w()/h(), 0.1, 100);
    camera.position.set(0, 0, 18);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    renderer.setSize(w(), h(), false);

    // ---- Orbital rings ----
    const ringGroup = new THREE.Group();
    scene.add(ringGroup);

    const ringColors = [0xffffff, 0xB8E5FF, 0x00E5FF, 0xffffff, 0xB8E5FF, 0x00E5FF];
    const ringConfigs = [
      { rx: 7.5, ry: 7.5, tilt: [0, 0, 0],     opacity: 0.35 },
      { rx: 7.0, ry: 4.2, tilt: [0.6, 0, 0],   opacity: 0.5  },
      { rx: 6.8, ry: 4.4, tilt: [0, 0.7, 0.3], opacity: 0.45 },
      { rx: 6.5, ry: 4.5, tilt: [-0.5, 0.5, 0.4], opacity: 0.5 },
      { rx: 4.8, ry: 4.8, tilt: [0.4, 0.4, 0.2], opacity: 0.25 },
      { rx: 5.5, ry: 3.4, tilt: [-0.3, -0.4, 0.6], opacity: 0.45 },
    ];

    const rings = [];
    const dots = [];
    ringConfigs.forEach((cfg, i) => {
      // Make the ring as a TorusGeometry — thin tube
      const geo = new THREE.TorusGeometry(1, 0.008, 8, 128);
      // scale on x/y to get ellipse
      const mat = new THREE.MeshBasicMaterial({
        color: ringColors[i % ringColors.length],
        transparent: true,
        opacity: cfg.opacity,
      });
      const m = new THREE.Mesh(geo, mat);
      m.scale.set(cfg.rx, cfg.ry, 1);
      m.rotation.set(cfg.tilt[0], cfg.tilt[1], cfg.tilt[2]);
      m.userData.baseTilt = cfg.tilt.slice();
      m.userData.spinSpeed = 0.05 + Math.random()*0.1;
      ringGroup.add(m);
      rings.push(m);

      // Add 3-5 dots traveling on this ring
      const nDots = 3 + Math.floor(Math.random()*3);
      for (let d = 0; d < nDots; d++){
        const dotMat = new THREE.MeshBasicMaterial({
          color: Math.random() < 0.4 ? 0x00E5FF : 0xffffff,
          transparent: true, opacity: 0.95,
        });
        const dotGeo = new THREE.SphereGeometry(0.07 + Math.random()*0.06, 8, 8);
        const dot = new THREE.Mesh(dotGeo, dotMat);
        dot.userData = {
          ringIdx: i,
          phase: Math.random() * Math.PI * 2,
          speed: 0.18 + Math.random()*0.35,
          rx: cfg.rx, ry: cfg.ry,
        };
        ringGroup.add(dot);
        dots.push(dot);
      }
    });

    // ---- Background scattered stars ----
    const starGeo = new THREE.BufferGeometry();
    const starCount = 120;
    const positions = new Float32Array(starCount * 3);
    for (let i=0;i<starCount;i++){
      positions[i*3]   = (Math.random()-0.5) * 36;
      positions[i*3+1] = (Math.random()-0.5) * 24;
      positions[i*3+2] = (Math.random()-0.5) * 14 - 4;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xffffff, size: 0.05, transparent: true, opacity: 0.7, sizeAttenuation: true
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // A few bigger glowing cyan dots
    const accentCount = 6;
    for (let i=0;i<accentCount;i++){
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(0.16, 12, 12),
        new THREE.MeshBasicMaterial({ color: 0x00E5FF, transparent: true, opacity: 0.85 })
      );
      m.position.set(
        (Math.random()-0.5) * 30,
        (Math.random()-0.5) * 18,
        (Math.random()-0.5) * 8 - 2
      );
      m.userData = { phase: Math.random()*Math.PI*2, basey: m.position.y };
      scene.add(m);
      m.userData.accent = true;
      dots.push(m);
    }

    // ---- Mouse parallax ----
    let mx = 0, my = 0;
    const onMove = (e) => {
      const r = parent.getBoundingClientRect();
      mx = ((e.clientX - r.left) / r.width  - 0.5) * 2;
      my = ((e.clientY - r.top)  / r.height - 0.5) * 2;
    };
    parent.addEventListener('mousemove', onMove);
    parent.addEventListener('touchmove', (e) => {
      const t = e.touches[0]; if (!t) return;
      onMove({ clientX: t.clientX, clientY: t.clientY });
    }, { passive: true });

    function onResize(){
      camera.aspect = w()/h();
      camera.updateProjectionMatrix();
      renderer.setSize(w(), h(), false);
    }
    window.addEventListener('resize', onResize);

    let running = true;
    // Pause when offscreen
    const vio = new IntersectionObserver((entries) => {
      entries.forEach(e => running = e.isIntersecting);
    }, { threshold: 0.05 });
    vio.observe(canvas);

    function tick(t){
      if (!running){ requestAnimationFrame(tick); return; }

      // Rotate the whole orbital group gently
      ringGroup.rotation.y = t*0.00012;
      ringGroup.rotation.x = Math.sin(t*0.0001) * 0.1;

      // Spin individual rings on Z
      rings.forEach((r, i) => {
        r.rotation.z = (r.userData.baseTilt[2] || 0) + t * 0.00012 * (i % 2 === 0 ? 1 : -1);
      });

      // Animate dots traveling around their parent ring
      dots.forEach(d => {
        if (d.userData.accent){
          d.position.y = d.userData.basey + Math.sin(t*0.0008 + d.userData.phase) * 0.5;
          const s = 0.85 + Math.sin(t*0.002 + d.userData.phase) * 0.15;
          d.material.opacity = s;
          return;
        }
        const ring = rings[d.userData.ringIdx];
        const angle = d.userData.phase + (t * 0.0006) * d.userData.speed;
        // Position in ring's local space:
        const lx = Math.cos(angle) * d.userData.rx;
        const ly = Math.sin(angle) * d.userData.ry;
        const local = new THREE.Vector3(lx, ly, 0);
        // Apply ring's rotation/transformation
        local.applyEuler(ring.rotation);
        d.position.copy(local);
      });

      // Camera parallax
      camera.position.x += (mx*1.2 - camera.position.x) * 0.04;
      camera.position.y += (-my*0.8 - camera.position.y) * 0.04;
      camera.lookAt(0,0,0);

      // Slight star drift
      stars.rotation.y = t*0.00003;

      renderer.render(scene, camera);
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // ============ PRICING (only present on pricing page) ============
  const pricingGrid = document.getElementById('pricingGrid');
  const careToggle = document.getElementById('careToggle');
  const hostingCard = document.getElementById('hostingCard');
  const sumList = document.getElementById('summaryList');
  const sumTotals = document.getElementById('summaryTotals');

  if (pricingGrid){
    const packages = [
      { id:'basic', name:'Basic Website', price:799, desc:'Perfect for getting online fast with a clean, professional look.', features:['1-page long-scroll site','Custom domain + SSL','WhatsApp CTA button','Google Business sync','Mobile-first design','7-day delivery'] },
      { id:'professional', name:'Professional 5-Page', price:1299, desc:'Ideal for established businesses wanting a full online presence.', popular:true, features:['Up to 5 pages','Contact + enquiry form','SEO basics + sitemap','Per-page meta tags','Photo gallery','Free first revision','7-day delivery'] },
      { id:'booking', name:'Booking System', price:1499, desc:'Take online bookings 24/7 and automate your appointment schedule.', features:['Everything in Professional','Online booking calendar','Email + WhatsApp notifications','Service & staff management','Customer reminders','Two revision rounds','10–14 day delivery'] }
    ];
    const monthly = { hosting:{ name:'Website Hosting', price:149 }, care:{ name:'Care & Maintenance', price:299 } };

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
            <span class="price">R${p.price.toLocaleString('en-ZA')}<small>once-off</small></span>
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
      const pkg = packages.find(p=>p.id===selectedPkg);
      const recurring = careOn ? monthly.care : monthly.hosting;
      const onceOff = pkg.price;
      const monthlyAmt = recurring.price;
      const firstMonth = onceOff + monthlyAmt;
      const year1 = onceOff + monthlyAmt * 12;
      sumList.innerHTML = `
        <div class="summary-row"><span class="lbl"><b>${pkg.name}</b><small>Once-off build</small></span><span class="val">R${onceOff.toLocaleString('en-ZA')}</span></div>
        <div class="summary-row"><span class="lbl"><b>${recurring.name}</b><small>Monthly recurring</small></span><span class="val">R${monthlyAmt.toLocaleString('en-ZA')}<small style="color:var(--text-grey);font-weight:600">/mo</small></span></div>
      `;
      sumTotals.innerHTML = `
        <div class="row"><span>Once-off build</span><span class="v">R${onceOff.toLocaleString('en-ZA')}</span></div>
        <div class="row"><span>Monthly recurring</span><span class="v">R${monthlyAmt.toLocaleString('en-ZA')}<small>/mo</small></span></div>
        <div class="row"><span>Website + 1st month</span><span class="v">R${firstMonth.toLocaleString('en-ZA')}</span></div>
        <div class="row year1"><span>Year 1 total</span><span class="v">R${year1.toLocaleString('en-ZA')}</span></div>
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

  // ============ CHAT WIDGET ============
  (function(){
    const widget = document.getElementById('chatWidget');
    const toggle = document.getElementById('chatToggle');
    const windowEl = document.getElementById('chatWindow');
    const minimize = document.getElementById('chatMinimize');
    const messages = document.getElementById('chatMessages');
    const input = document.getElementById('chatInput');
    const form = document.getElementById('chatForm');
    const typing = document.getElementById('chatTyping');
    const suggestions = document.getElementById('chatSuggestions');
    const suggestionsToggle = document.getElementById('chatSuggestionsToggle');
    const badge = document.getElementById('chatBadge');

    if (!widget || !toggle || !windowEl) return;

    // Worker endpoint - replace with your deployed worker URL
    const WORKER_URL = 'https://localwebsa-chat-worker.nmotha4.workers.dev';

    // Session management
    let sessionId = localStorage.getItem('lws_chat_session') || crypto.randomUUID();
    localStorage.setItem('lws_chat_session', sessionId);
    let history = JSON.parse(localStorage.getItem('lws_chat_history') || '[]');
    let isOpen = false;
    let suggestionsCollapsed = true;  // Start collapsed to save space

    // Quick suggestion chips
    const suggestionChips = [
      'How much for a 5-page site?',
      'What\'s included in hosting?',
      'How long to build?',
      'Do you do e-commerce?',
      'WhatsApp me the details',
    ];

    function saveHistory() {
      localStorage.setItem('lws_chat_history', JSON.stringify(history.slice(-20)));
    }

    function renderSuggestions() {
      suggestions.innerHTML = suggestionChips.map(text => `
        <button type="button" class="suggestion-chip" data-text="${text.replace(/"/g, "&quot;")}">${text}</button>
      `).join("");
      // Apply collapsed state
      suggestions.style.display = suggestionsCollapsed ? "none" : "flex";
      if (suggestionsToggle) {
        suggestionsToggle.setAttribute("aria-expanded", !suggestionsCollapsed);
        suggestionsToggle.querySelector(".chevron").style.transform = suggestionsCollapsed ? "rotate(-90deg)" : "rotate(0deg)";
      }
    }

    function addMessage(role, content, isTyping = false) {
      const div = document.createElement('div');
      div.className = `chat-message ${role}${isTyping ? ' typing' : ''}`;
      div.innerHTML = `
        ${role === 'assistant' ? '<div class="msg-avatar" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M20 21c0-3.5-2.5-6.5-6-6.5S8 17.5 8 21"/></svg></div>' : ''}
        <div class="msg-bubble">${content}</div>
        ${role === 'user' ? '<div class="msg-avatar" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg></div>' : ''}
      `;
      messages.appendChild(div);
      messages.scrollTop = messages.scrollHeight;
      return div;
    }

    function showTyping(show) {
      typing.style.display = show ? 'flex' : 'none';
      typing.setAttribute('aria-hidden', !show);
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

    async function handleSend(text) {
      if (!text.trim()) return;
      const userMsg = text.trim();
      input.value = '';
      addMessage('user', userMsg);
      history.push({ role: 'user', content: userMsg });
      saveHistory();

      showTyping(true);
      const reply = await sendToWorker(userMsg);
      showTyping(false);

      const botMsg = addMessage('assistant', reply);
      history.push({ role: 'assistant', content: reply });
      saveHistory();
    }

    // Initialize: load history or show welcome
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

    // Toggle chat
    toggle.addEventListener('click', () => {
      isOpen = !isOpen;
      widget.dataset.state = isOpen ? 'open' : 'closed';
      windowEl.setAttribute('aria-hidden', !isOpen);
      toggle.setAttribute('aria-expanded', isOpen);
      badge.style.display = 'none';
      if (isOpen) input.focus();
    });

    minimize.addEventListener('click', () => {
      isOpen = false;
      widget.dataset.state = 'closed';
      windowEl.setAttribute('aria-hidden', true);
      toggle.setAttribute('aria-expanded', false);
    });

    // Toggle suggestions
    if (suggestionsToggle) {
      suggestionsToggle.addEventListener("click", () => {
        suggestionsCollapsed = !suggestionsCollapsed;
        renderSuggestions();
      });
    }

    // Form submit
    form.addEventListener('submit', e => {
      e.preventDefault();
      handleSend(input.value);
    });

    // Suggestion chips
    suggestions.addEventListener('click', e => {
      const chip = e.target.closest('.suggestion-chip');
      if (chip) handleSend(chip.dataset.text);
    });

    // Show badge after 10s if never opened
    if (!localStorage.getItem('lws_chat_opened')) {
      setTimeout(() => {
        if (!isOpen) badge.style.display = 'flex';
      }, 10000);
    }

    // Mark as opened when first used
    widget.addEventListener('click', () => {
      localStorage.setItem('lws_chat_opened', 'true');
    }, { once: true });
  })();

  // ============ CONTACT FORM ============
  const cf = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  if (cf){
    cf.addEventListener('submit', async e => {
      e.preventDefault();
      const btn = cf.querySelector('button[type=submit]');
      const originalText = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;
      if (formStatus) { formStatus.style.display = 'none'; formStatus.className = ''; }
      
      try {
        const formData = new FormData(cf);
        const response = await fetch(cf.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });
        
        if (response.ok) {
          btn.textContent = 'Sent — we\'ll WhatsApp you back ✓';
          btn.style.background = '#10b981';
          if (formStatus) { formStatus.textContent = 'Thanks! We\'ll reply on WhatsApp within 2 hours.'; formStatus.style.display = 'block'; formStatus.style.color = '#10b981'; }
          cf.reset();
        } else {
          throw new Error('Form submission failed');
        }
      } catch (err) {
        btn.textContent = 'Something went wrong — try again';
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

})();
