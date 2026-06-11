/* ========== Shared chrome (nav + footer) ========== */
(function(){
  const navHTML = `
  <header class="nav" id="nav">
    <a href="index.html" class="brand" aria-label="Local Web SA">
      <span class="brand-mark" aria-hidden="true"></span>
      <img class="brand-wordmark" src="assets/logo-wordmark.png" alt="Local Web SA" width="847" height="135" />
    </a>
    <nav class="nav-links" aria-label="Main">
      <a href="index.html">Home</a>
      <a href="about.html">About Us</a>
      <a href="our-work.html">Our Work</a>
      <a href="benefits.html">Benefits</a>
      <a href="pricing.html">Pricing</a>
      <a href="blog.html">Blog</a>
      <a href="faq.html">FAQ</a>
      <a href="contact.html">Contact</a>
      <a href="chat.html">Chat</a>
    </nav>
    <a href="contact.html" class="btn btn-white sm nav-cta">Get a Quote</a>
    <button class="menu-btn" id="menuBtn" aria-label="Open menu" aria-expanded="false" aria-controls="mobileMenu">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
    </button>
  </header>
  <nav class="mobile-menu" id="mobileMenu" aria-label="Mobile menu">
    <div class="mm-top">
      <a href="index.html" class="mm-brand" aria-label="Local Web SA"><img src="assets/logo-wordmark.png" alt="Local Web SA" width="847" height="135" /></a>
      <button class="menu-btn close" id="menuClose" aria-label="Close menu">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div class="mm-links">
      <a href="index.html">Home</a>
      <a href="about.html">About Us</a>
      <a href="our-work.html">Our Work</a>
      <a href="benefits.html">Benefits</a>
      <a href="pricing.html">Pricing</a>
      <a href="blog.html">Blog</a>
      <a href="faq.html">FAQ</a>
      <a href="contact.html">Contact</a>
    </div>
    <div class="mm-actions">
      <a href="chat.html" class="mm-chat">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        Chat with Michael
      </a>
      <a href="contact.html" class="btn btn-white mm-cta">Get a Quote</a>
    </div>
  </nav>`;

  const footerHTML = `
  <footer>
    <video id="footerVideoDesktop" class="footer-art footer-art-video footer-art-video--desktop" muted loop playsinline preload="none" poster="assets/footer/footer-desktop-poster.jpg" data-src="assets/footer/footer-desktop.mp4" aria-hidden="true" disablepictureinpicture disableremoteplayback></video>
    <video id="footerVideoMobile" class="footer-art footer-art-video footer-art-video--mobile" muted loop playsinline preload="none" poster="assets/footer/footer-mobile-poster.jpg" data-src="assets/footer/footer-mobile.mp4" aria-hidden="true" disablepictureinpicture disableremoteplayback></video>
    <div class="footer-art-scrim" aria-hidden="true"></div>

    <div class="wrap">
            <div class="foot-statement">
        <a href="index.html" class="brand foot-brandmark" aria-label="Local Web SA">
          <span class="brand-mark" aria-hidden="true"></span>
          <img class="brand-wordmark" src="assets/logo-wordmark.png" alt="Local Web SA" width="847" height="135" />
        </a>
        <h2 class="foot-line">Where ideas <span class="cyan">go online.</span></h2>
        <p class="foot-tagline">Affordable, modern websites for South African small businesses. Built in Pretoria, shipped in days.</p>
        <a href="contact.html" class="btn btn-white sm foot-cta">
          Start your website
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </a>
      </div>

      <div class="foot-meta">
        <nav class="foot-nav" aria-label="Footer">
          <a href="index.html">Home</a>
          <a href="about.html">About Us</a>
          <a href="our-work.html">Our Work</a>
          <a href="benefits.html">Benefits</a>
          <a href="pricing.html">Pricing</a>
          <a href="blog.html">Blog</a>
          <a href="faq.html">FAQ</a>
          <a href="contact.html">Contact</a>
          <a href="chat.html">Chat</a>
        </nav>
        <div class="foot-contact">
          <a href="mailto:info@localwebsa.org">info@localwebsa.org</a>
          <a href="tel:+27750541175">+27 75 054 1175</a>
          <span>Pretoria, Gauteng</span>
        </div>
        <div class="socials" aria-label="Social links">
          <a href="https://wa.me/27750541175" class="social wa" aria-label="WhatsApp">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.3-.5-2.5-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.7.1-.1.3-.4.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.2-.7-1.7-1-2.3-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.2 3.4 5.3 4.7.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.4zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.1-1.3c1.4.8 3.1 1.3 4.9 1.3 5.5 0 10-4.5 10-10S17.5 2 12 2z"/></svg>
          </a>
          <a href="https://www.instagram.com/localweb.sa?igsh=MXZidm9tOWl2a3JpNA==" class="social ig" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.4a4 4 0 1 1-7.9 1.2A4 4 0 0 1 16 11.4z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></a>
          <a href="https://www.linkedin.com/in/localweb-sa-3ba4813b6?utm_source=share_via&utm_content=profile&utm_medium=member_ios" class="social li" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 2h-17A1.5 1.5 0 0 0 2 3.5v17A1.5 1.5 0 0 0 3.5 22h17a1.5 1.5 0 0 0 1.5-1.5v-17A1.5 1.5 0 0 0 20.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 1 1 8.3 6.5a1.78 1.78 0 0 1-1.8 1.75zM19 19h-3v-4.7c0-1.4-.5-2.3-1.7-2.3a1.84 1.84 0 0 0-1.7 1.2 2 2 0 0 0-.1.8V19h-3v-9h3v1.3a3 3 0 0 1 2.7-1.5c2 0 3.5 1.3 3.5 4z"/></svg></a>
          <a href="https://www.facebook.com/share/14fu2AQFAMM/?mibextid=wwXIfr" class="social fb" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
          <a href="https://www.tiktok.com/@localwebsa?_r=1&_t=ZS-96yymTaaX4O" class="social tt" aria-label="TikTok"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.6 7.2a5.5 5.5 0 0 1-3.2-1V15a5 5 0 1 1-5-5h.5v3a2 2 0 1 0 1.5 2V3h3a3 3 0 0 0 3 3z"/></svg></a>
        </div>
      </div>

      
<div class="foot-bottom">
        <div>© 2026 Local Web SA (Pty) Ltd · All rights reserved.</div>
        <div class="legal-row">
          <a href="privacy.html">Privacy</a>
          <a href="terms.html">Terms</a>
        </div>
        <div>Reg 2026/186580/07 · Pretoria, Gauteng</div>
      </div>
    </div>
  </footer>

  <!-- ============ CHAT LAUNCHER (opens dedicated chat page) ============ -->
  <a class="chat-fab" href="chat.html" aria-label="Chat with Michael, our assistant">
    <svg class="chat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
  </a>
  `;
  // inject
  const navMount = document.getElementById('navMount');
  if (navMount) navMount.outerHTML = navHTML;
  const footMount = document.getElementById('footMount');
  if (footMount) footMount.outerHTML = footerHTML;

  // Run a callback once the page is fully loaded and the browser is idle, so
  // heavy work (video downloads) never competes with the initial page load.
  function whenIdle(fn) {
    const run = function () {
      (window.requestIdleCallback || function (cb) { return setTimeout(cb, 1); })(fn, { timeout: 3000 });
    };
    if (document.readyState === 'complete') run();
    else window.addEventListener('load', run, { once: true });
  }

  /* ===== Ambient hero/footer video: "the paused video IS the waiting still".
     - Each clip shows a poster that is its OWN first frame, so the still is
       visible instantly with zero mismatch, and the clip itself is downloaded
       only once the page is idle (preload="none") — so videos never slow the
       initial page load.
     - Loads ONLY the clip matching the viewport (desktop landscape vs mobile
       portrait).
     - First movement (scroll/touch/wheel/mouse/key/tap) starts it looping.
       A real user gesture also unlocks playback on iOS Low Power Mode; no
       play button or controls are ever shown.
     Shared by the home hero and the site-wide footer so behaviour is identical. */
  function initAmbientVideo(desktop, mobile) {
    if (!desktop && !mobile) return;
    const mq = window.matchMedia('(max-width:768px)');
    let started = false;
    const current = () => (mq.matches ? mobile : desktop);
    function ensureSrc(v) {
      if (v && !v.getAttribute('src') && v.dataset.src) {
        v.setAttribute('src', v.dataset.src);
        v.load();
      }
    }
    function play(v) {
      if (!v) return;
      v.muted = true;          // property, not just attribute — some browsers require it
      v.defaultMuted = true;
      const p = v.play();
      if (p && typeof p.then === 'function') {
        p.catch(function () {
          // play() fired before the clip was ready: retry once it has data
          // so it never gets stuck paused on the first frame.
          const retry = function () { const r = v.play(); if (r && r.catch) r.catch(function () {}); };
          v.addEventListener('canplay', retry, { once: true });
          v.addEventListener('loadeddata', retry, { once: true });
        });
      }
    }
    // Paint the paused first frame. Must wait for HAVE_CURRENT_DATA — seeking
    // before the first frame is buffered can leave iOS stuck mid-seek (frozen).
    function primeFrame(v) {
      if (!v) return;
      const nudge = function () { try { if (v.paused && !v.currentTime) v.currentTime = 0.001; } catch (e) {} };
      if (v.readyState >= 2) nudge();
      else v.addEventListener('loadeddata', nudge, { once: true });
    }

    // Poster already shows the still; quietly download + prime the matching
    // clip once the page is idle so it's ready to play on the first movement.
    whenIdle(function () { ensureSrc(current()); primeFrame(current()); });

    function start() {
      if (started) return;
      started = true;
      const active = current();
      const other = mq.matches ? desktop : mobile;
      if (other) other.pause();
      ensureSrc(active);
      play(active);
    }
    ['scroll', 'wheel', 'touchstart', 'touchmove', 'pointerdown', 'mousemove', 'keydown', 'click'].forEach(function (evt) {
      window.addEventListener(evt, start, { passive: true, once: true });
    });
    (mq.addEventListener ? mq.addEventListener.bind(mq, 'change') : mq.addListener.bind(mq))(function () {
      const active = current();
      const other = mq.matches ? desktop : mobile;
      if (other) other.pause();
      ensureSrc(active);
      if (started) play(active);
      else primeFrame(active);
    });
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden && started) play(current());
    });
  }

  initAmbientVideo(document.getElementById('footerVideoDesktop'), document.getElementById('footerVideoMobile'));
  initAmbientVideo(document.getElementById('heroVideoDesktop'), document.getElementById('heroVideoMobile'));
})();
