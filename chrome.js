/* ========== Shared chrome (nav + footer) ========== */
(function(){
  const navHTML = `
  <header class="nav" id="nav">
    <a href="index.html" class="brand" aria-label="Local Web SA">
      <span class="brand-mark" aria-hidden="true"></span>
      <span class="brand-text"><b>LOCAL WEB</b><span>SA</span></span>
    </a>
    <nav class="nav-links" aria-label="Main">
      <a href="index.html">Home</a>
      <a href="about.html">About Us</a>
      <a href="our-work.html">Our Work</a>
      <a href="benefits.html">Benefits</a>
      <a href="pricing.html">Pricing Calculator</a>
      <a href="blog.html">Blog</a>
      <a href="faq.html">FAQ</a>
      <a href="contact.html">Contact</a>
    </nav>
    <a href="contact.html" class="btn btn-white sm nav-cta">Get a Quote</a>
    <button class="menu-btn" id="menuBtn" aria-label="Open menu">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
    </button>
  </header>
  <nav class="mobile-menu" id="mobileMenu" aria-label="Mobile menu">
    <button class="menu-btn close" id="menuClose" aria-label="Close menu">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
    <a href="index.html">Home</a>
    <a href="about.html">About Us</a>
    <a href="our-work.html">Our Work</a>
    <a href="benefits.html">Benefits</a>
    <a href="pricing.html">Pricing</a>
    <a href="blog.html">Blog</a>
    <a href="faq.html">FAQ</a>
    <a href="contact.html">Contact</a>
    <a href="contact.html" class="btn btn-white" style="margin-top:14px">Get a Quote</a>
  </nav>`;

  const footerHTML = `
  <footer>
    <svg class="constellation" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <filter id="cglow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <g stroke="rgba(180,210,255,0.22)" stroke-width="0.6" fill="none">
        <line x1="80" y1="80" x2="320" y2="160"/>
        <line x1="320" y1="160" x2="540" y2="100"/>
        <line x1="540" y1="100" x2="780" y2="180"/>
        <line x1="780" y1="180" x2="1020" y2="120"/>
        <line x1="1020" y1="120" x2="1140" y2="220"/>
        <line x1="80" y1="80" x2="160" y2="260"/>
        <line x1="160" y1="260" x2="380" y2="280"/>
        <line x1="380" y1="280" x2="540" y2="100"/>
        <line x1="380" y1="280" x2="620" y2="360"/>
        <line x1="620" y1="360" x2="780" y2="180"/>
        <line x1="620" y1="360" x2="840" y2="460"/>
        <line x1="840" y1="460" x2="1080" y2="380"/>
        <line x1="1080" y1="380" x2="1140" y2="220"/>
        <line x1="160" y1="260" x2="220" y2="440"/>
        <line x1="220" y1="440" x2="460" y2="500"/>
        <line x1="460" y1="500" x2="620" y2="360"/>
        <line x1="460" y1="500" x2="700" y2="540"/>
        <line x1="700" y1="540" x2="840" y2="460"/>
        <line x1="220" y1="440" x2="100" y2="540"/>
        <line x1="700" y1="540" x2="980" y2="560"/>
        <line x1="980" y1="560" x2="1080" y2="380"/>
      </g>
      <g fill="rgba(255,255,255,0.85)">
        <circle cx="80" cy="80" r="1.5"/><circle cx="320" cy="160" r="1.8"/>
        <circle cx="540" cy="100" r="1.2"/><circle cx="780" cy="180" r="1.6"/>
        <circle cx="1020" cy="120" r="1.4"/><circle cx="1140" cy="220" r="1.2"/>
        <circle cx="160" cy="260" r="1.4"/><circle cx="380" cy="280" r="1.6"/>
        <circle cx="620" cy="360" r="2"/><circle cx="840" cy="460" r="1.4"/>
        <circle cx="1080" cy="380" r="1.6"/><circle cx="220" cy="440" r="1.2"/>
        <circle cx="460" cy="500" r="1.5"/><circle cx="700" cy="540" r="1.3"/>
        <circle cx="100" cy="540" r="1.2"/><circle cx="980" cy="560" r="1.4"/>
        <circle cx="60" cy="380" r="0.9"/><circle cx="900" cy="80" r="0.9"/>
        <circle cx="500" cy="320" r="0.8"/><circle cx="280" cy="60" r="0.8"/>
        <circle cx="1180" cy="440" r="0.9"/><circle cx="40" cy="200" r="0.7"/>
        <circle cx="650" cy="220" r="0.8"/><circle cx="380" cy="120" r="0.7"/>
      </g>
      <g fill="#6F8AFF">
        <circle cx="240" cy="200" r="3.4" filter="url(#cglow)" opacity="0.95"/>
        <circle cx="600" cy="180" r="3" filter="url(#cglow)" opacity="0.9"/>
        <circle cx="940" cy="280" r="3.2" filter="url(#cglow)" opacity="0.95"/>
        <circle cx="320" cy="420" r="2.8" filter="url(#cglow)" opacity="0.9"/>
        <circle cx="780" cy="420" r="3.4" filter="url(#cglow)" opacity="0.95"/>
        <circle cx="1100" cy="500" r="2.8" filter="url(#cglow)" opacity="0.9"/>
      </g>
    </svg>

    <div class="wrap">
      <div class="foot-top">
        <div class="foot-brand">
          <a href="index.html" class="brand">
            <span class="brand-mark" aria-hidden="true"></span>
            <span class="brand-text"><b>LOCAL WEB</b><span>SA</span></span>
          </a>
          <p class="foot-tagline">Affordable, modern websites for South African small businesses. Where ideas go online.</p>
          <div class="socials" aria-label="Social links">
            <a href="https://wa.me/27750541175" class="social wa" aria-label="WhatsApp">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.3-.5-2.5-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.7.1-.1.3-.4.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.2-.7-1.7-1-2.3-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.2 3.4 5.3 4.7.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.4zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.1-1.3c1.4.8 3.1 1.3 4.9 1.3 5.5 0 10-4.5 10-10S17.5 2 12 2z"/></svg>
            </a>
            <a href="#" class="social ig" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.4a4 4 0 1 1-7.9 1.2A4 4 0 0 1 16 11.4z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></a>
            <a href="#" class="social li" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 2h-17A1.5 1.5 0 0 0 2 3.5v17A1.5 1.5 0 0 0 3.5 22h17a1.5 1.5 0 0 0 1.5-1.5v-17A1.5 1.5 0 0 0 20.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 1 1 8.3 6.5a1.78 1.78 0 0 1-1.8 1.75zM19 19h-3v-4.7c0-1.4-.5-2.3-1.7-2.3a1.84 1.84 0 0 0-1.7 1.2 2 2 0 0 0-.1.8V19h-3v-9h3v1.3a3 3 0 0 1 2.7-1.5c2 0 3.5 1.3 3.5 4z"/></svg></a>
            <a href="#" class="social fb" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
            <a href="#" class="social tt" aria-label="TikTok"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.6 7.2a5.5 5.5 0 0 1-3.2-1V15a5 5 0 1 1-5-5h.5v3a2 2 0 1 0 1.5 2V3h3a3 3 0 0 0 3 3z"/></svg></a>
          </div>
        </div>

        <div>
          <div class="foot-h">Quick Links</div>
          <div class="foot-links">
            <a href="index.html">Home</a>
            <a href="about.html">About Us</a>
            <a href="our-work.html">Our Work</a>
            <a href="benefits.html">Benefits</a>
          </div>
        </div>

        <div>
          <div class="foot-h">Company</div>
          <div class="foot-links">
            <a href="pricing.html">Pricing</a>
            <a href="blog.html">Blog</a>
            <a href="faq.html">FAQ</a>
            <a href="contact.html">Contact</a>
          </div>
        </div>

        <div>
          <div class="foot-h">Get in Touch</div>
          <div class="foot-links">
            <a href="mailto:localwebcorp@gmail.com">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6L12 13 2 6"/></svg>
              localwebcorp@gmail.com
            </a>
            <a href="tel:+27750541175">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.33 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              +27 75 054 1175
            </a>
            <a href="#">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              Pretoria, Gauteng
            </a>
          </div>
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

  <a class="wa-float" href="https://wa.me/27750541175" aria-label="WhatsApp us">
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.3-.5-2.5-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.7.1-.1.3-.4.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.2-.7-1.7-1-2.3-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.2 3.4 5.3 4.7.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.4zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.1-1.3c1.4.8 3.1 1.3 4.9 1.3 5.5 0 10-4.5 10-10S17.5 2 12 2z"/></svg>
  </a>

  <!-- ============ CHAT WIDGET ============ -->
  <div class="chat-widget" id="chatWidget" data-state="closed">
    <button class="chat-toggle" id="chatToggle" aria-label="Chat with Michael" aria-expanded="false">
      <svg class="chat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      <svg class="chat-icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      <span class="chat-badge" id="chatBadge" aria-hidden="true">1</span>
    </button>

    <div class="chat-window" id="chatWindow" role="dialog" aria-label="Chat with Michael" aria-hidden="true">
      <header class="chat-header">
        <div class="chat-avatar" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M20 21c0-3.5-2.5-6.5-6-6.5S8 17.5 8 21"/></svg>
        </div>
        <div class="chat-title">
          <strong>Michael</strong>
          <span>Local Web SA Assistant</span>
        </div>
        <button class="chat-minimize" id="chatMinimize" aria-label="Close chat">&times;</button>
      </header>

      <div class="chat-messages" id="chatMessages" role="log" aria-live="polite"></div>

      <div class="chat-typing" id="chatTyping" aria-hidden="true">
        <span class="typing-dots"><span></span><span></span><span></span></span>
        <span>Michael is typing...</span>
      </div>

      <form class="chat-input" id="chatForm" aria-label="Send message">
        <input type="text" id="chatInput" placeholder="Type a message..." autocomplete="off" aria-label="Message" />
        <button type="submit" aria-label="Send">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </form>

      <div class="chat-suggestions" id="chatSuggestions" aria-label="Quick questions"></div>
    </div>
  </div>

  // inject
  const navMount = document.getElementById('navMount');
  if (navMount) navMount.outerHTML = navHTML;
  const footMount = document.getElementById('footMount');
  if (footMount) footMount.outerHTML = footerHTML;
})();
