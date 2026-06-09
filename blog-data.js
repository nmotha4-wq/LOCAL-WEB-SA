/* =========================================================
   Local Web SA — Blog data + cover generator
   To add a new post: prepend a new object to LWSA_POSTS below.
   Each post needs: slug, title, date, readMin, tag, excerpt, body.
   ========================================================= */

/* ---------- Cover generator (seeded, deterministic) ---------- */
(function () {
  function hashStr(s) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }
  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  window.LWSA_makeCover = function (seed, opts) {
    opts = opts || {};
    const w = opts.w || 1600;
    const h = opts.h || 900;
    const sid = hashStr(seed || 'default');
    const rng = mulberry32(sid);

    const palette = [
      '#0A0A0F', // deep navy
      '#023E8A', // dark teal
      '#0077B6', // electric blue
      '#00B4D8', // cyan
      '#0A0A0F',
      '#023E8A',
      '#03335E'
    ];
    const accents = ['#FFFFFF', '#2A2D34'];

    let x = 0;
    const stripes = [];
    while (x < w) {
      const isAccent = rng() < 0.14;
      let ww, color, opacity = 1;
      if (isAccent) {
        ww = 2 + Math.floor(rng() * 5);
        color = accents[Math.floor(rng() * accents.length)];
        opacity = color === '#FFFFFF' ? (0.05 + rng() * 0.1) : (0.55 + rng() * 0.25);
      } else {
        ww = 28 + Math.floor(rng() * 170);
        color = palette[Math.floor(rng() * palette.length)];
      }
      if (x + ww > w) ww = w - x;
      stripes.push({ x, w: ww, color, opacity });
      x += ww;
    }

    const stripeSvg = stripes.map(s =>
      `<rect x="${s.x}" y="0" width="${s.w}" height="${h}" fill="${s.color}" opacity="${s.opacity}"/>`
    ).join('');

    const glowCx = 40 + rng() * 20;
    const glowCy = 45 + rng() * 15;

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <defs>
    <radialGradient id="g_${sid}" cx="${glowCx}%" cy="${glowCy}%" r="55%">
      <stop offset="0%"  stop-color="#00B4D8" stop-opacity="0.42"/>
      <stop offset="35%" stop-color="#0077B6" stop-opacity="0.14"/>
      <stop offset="100%" stop-color="#0A0A0F" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="v_${sid}" cx="50%" cy="50%" r="75%">
      <stop offset="40%" stop-color="#000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.62"/>
    </radialGradient>
    <filter id="n_${sid}" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="${sid % 1000}"/>
      <feColorMatrix values="0 0 0 0 0.7  0 0 0 0 0.85  0 0 0 0 1  0 0 0 0.12 0"/>
    </filter>
  </defs>
  ${stripeSvg}
  <rect width="${w}" height="${h}" fill="url(#g_${sid})" style="mix-blend-mode:screen"/>
  <rect width="${w}" height="${h}" fill="url(#v_${sid})"/>
  <rect width="${w}" height="${h}" filter="url(#n_${sid})" opacity="0.55"/>
</svg>`;
  };
})();

/* ---------- Posts ---------- */
/* New posts go at the TOP of this array — newest first. */
window.LWSA_POSTS = [
  {
    slug: 'your-google-maps-pin-needs-a-website',
    title: 'Your Google Maps pin needs a website',
    date: 'June 08, 2026',
    readMin: 5,
    tag: 'Local Search',
    excerpt: 'Your Google Business Profile gets you on the map. Your website gets you the job. One without the other is a shop with no door.',
    body: `\n<p>You've claimed your Google Business Profile. You added photos. You got your cousin to leave a five-star review. The little pin on the map shows your bakery in Mamelodi, your plumbing service in Centurion, your tutoring centre in Sandton. You exist on the map. Good.</p>\n<p>Now watch what happens next. A mom in Mamelodi searches "birthday cake near me". Your pin shows up. She taps it. She sees your photos. Nice. She sees your hours. Open. She sees your phone number. She hesitates. She wants to know: do you do custom designs? What's the lead time? Can she see more cakes? Is there a WhatsApp button? She taps "Website" and... nothing. Or worse, a broken link. She goes back. She taps the next pin. They have a website. She books with them.</p>\n<p>Your Google Maps pin is not your website. It's the sign outside your shop. The website is the shop itself.</p>\n<p>Google Business Profiles are brilliant at one thing: getting you discovered in "near me" searches. They put you on the shortlist. But they're terrible at closing the deal. Seven photos max. No pricing. No FAQ. No portfolio. No booking form. No "tap to WhatsApp" that opens a pre-written message. Just a phone number and hope.</p>\n<p>A website fixes every one of those gaps. It answers the questions the map pin can't. "Do you service Roodepoort?" Yes, here's our service area map. "Can I see your past geyser installations?" Here's a gallery with twenty photos. "What's your call-out fee?" It's on the pricing page. "Can I book for Tuesday morning?" Here's the calendar. The customer never has to call to ask. They decide, they tap, they're in.</p>\n<p>This is the multiplier effect nobody talks about. A Google profile without a website converts maybe 5% of profile views into contacts. Add a proper website and that jumps to 15–25%. Same traffic. Five times the leads. The map pin brings them to your door. The website opens it.</p>\n<p>And here's the part that matters for South African small businesses: your competitors mostly haven't figured this out. Search "electrician Pretoria" or "maths tutor Durban" or "house cleaning Bloemfontein". Count how many map pins have a working website linked. It's usually under 30%. The rest are dead ends. That's not competition. That's opportunity wearing a high-vis vest.</p>\n<p>You don't need a fancy site. You need a clean one-page that loads fast on mobile, shows your work, lists your areas, puts your WhatsApp number in a sticky button, and has a "Get a Quote" form that emails you instantly. That's it. That's the shop behind the sign.</p>\n<p>Google even rewards you for it. Profiles with verified websites rank higher in the local pack. More impressions. More clicks. More calls. The algorithm knows: a business that invested in a website is a business that's still going to be here next year.</p>\n<p>Your pin on the map cost you nothing. The website costs R799 once. The customers you convert because you had both? That's revenue you'd never have seen otherwise. The sign is up. Build the shop.</p>\n`
  },
  {
    slug: 'the-invisible-business',
    title: 'The invisible business',
    date: 'May 17, 2026',
    readMin: 3,
    tag: 'Visibility',
    excerpt: "A customer in Centurion needs a plumber tonight. They open their phone. If you're not in there, you don't exist.",
    body: `
<p>A customer in Centurion needs a plumber tonight. Geyser's leaking, kids are losing it, dinner's late. They pick up their phone. Not a phone book, not a friend's WhatsApp. Their phone. They type four words. <em>Plumber near me now.</em></p>
<p>The first three results get their attention. The fourth gets their click. If you're the best plumber in Pretoria but you're not in those four results, you didn't lose a customer. You were never in the room.</p>
<p>This is the part most small business owners miss. We tend to think of "not having a website" the way we'd think of "not having a billboard". A nice-to-have. A flex. Something the bigger guys do. But that's not what's happening anymore. A website isn't your billboard. It's your address. Without one, you don't have a location on the modern map. You're not invisible to <em>most</em> people. You're invisible to <em>every</em> person who didn't already know your name.</p>
<p>That's a quiet but ruthless filter. The customers who find you by accident, the foot traffic, the friend-of-a-friend, those still come through. They're the survivors of an older system. But the customer who searches? The one with money in their hand, ready to buy <em>right now</em>? They never even know you tried.</p>
<p>The honest truth: most small SA businesses lose more money to invisibility every month than a website would cost them once. The damage isn't dramatic. It's quiet. A lost lead here, an unread enquiry there. You don't see the customers you didn't get. They just go to whoever showed up.</p>
<p>If you're reading this on a phone right now, look up. There are probably three people within arm's reach also looking at theirs. That's your storefront window. You either have something in it, or you don't.</p>
`
  },
  {
    slug: 'what-customers-do-at-11pm',
    title: 'What customers do at 11pm',
    date: 'May 10, 2026',
    readMin: 3,
    tag: 'Behaviour',
    excerpt: "Nobody books a service at 11pm. But that's when they decide who to book in the morning. Your website is the salesperson on that shift.",
    body: `
<p>Nobody books a hairdresser at 11pm. Nobody hires a tutor at 11pm. Nobody calls a panel beater at 11pm. But that's exactly when customers <em>decide</em> who they'll call in the morning.</p>
<p>Lying in bed. Phone on chest. Light off. A long, slow scroll through three or four options. By the time they fall asleep, the decision is mostly made. Whoever earned trust on that scroll wins. Whoever didn't, doesn't get a call, and never knows why.</p>
<p>If your business shows up on that screen as a thoughtful website with clear prices, a few good photos, and a sentence that sounds like a real person, you win that night. If you show up as a half-finished Facebook page, the same three blurry photos from 2019, and a phone number that may or may not work, they keep scrolling. Quietly. Politely. Permanently.</p>
<p>This is the silent shift in how South Africans now buy. We research before we commit. We screenshot. We send links to a friend. We sleep on it. The customer who calls you in the morning is the one who decided last night. Your website is the salesperson working that shift, in their bedroom, on their phone, in the dark.</p>
<p>You're not paying that salesperson. You only have to hire them once.</p>
`
  },
  {
    slug: 'why-a-facebook-page-isnt-enough',
    title: "Why a Facebook page isn't your business",
    date: 'May 3, 2026',
    readMin: 4,
    tag: 'Platform Risk',
    excerpt: "Renting your business on Facebook is like renting your shop floor from someone who can change the locks tomorrow.",
    body: `
<p>A Facebook page is a great thing. Treat it as a marketing channel. Treat it as a community. Treat it as a place to post the daily special or the new haircut.</p>
<p>Don't treat it as your business.</p>
<p>Here's the difference. A Facebook page is rented space. You don't own the audience. You don't own the layout. You don't own the rules. Facebook can change the algorithm tomorrow and your reach drops by 80% overnight. They've done it before. They'll do it again. When Mark Zuckerberg sneezes, your small business in Mamelodi catches a cold.</p>
<p>You also don't own the trust. Walk up to any customer over thirty-five and ask them, honestly: <em>do you trust a business that only exists on Facebook?</em> Most will hesitate. The page might be active. The reviews might be good. But there's a faint, uneasy feeling: "is this a real business?" That feeling costs you customers, and it costs you the right to charge proper prices.</p>
<p>A website fixes both. It's land you own, a place that doesn't disappear because a platform changed its mind. And it's a trust signal in itself. Your own domain. Your own design. Your own words, laid out the way <em>you</em> want them laid out. It tells a customer, before they read a single sentence: <em>this person takes their business seriously.</em></p>
<p>Keep the Facebook page. Keep the Instagram. Use them to point people to your real home, the one with your name on the gate.</p>
`
  },
  {
    slug: 'the-247-shopfront',
    title: 'The 24/7 shopfront',
    date: 'Apr 26, 2026',
    readMin: 3,
    tag: 'Always Open',
    excerpt: 'Your shop closes at six. Your competitors don\'t. A website is the part of your business that works while you sleep.',
    body: `
<p>You close at six. Your competitors don't.</p>
<p>Not the ones around the corner. They probably close at six too. The ones who took the time to put up a website. They keep selling at 7pm. They keep selling at 11pm. They keep selling at 3am on Sunday. They keep selling on Christmas Day. The shop's "closed" sign means nothing to a Google search.</p>
<p>This is the part of having a website that's easiest to underestimate, because we think of selling as a thing that requires <em>us</em>. A conversation. A phone call. A meeting. But most of what selling actually is, in 2026, is <em>answering questions before someone has to ask them.</em> Are you in my area? What do you charge? Do you do this thing I need? Are you any good?</p>
<p>Every one of those questions can be answered on a page that costs you nothing to keep open. You wrote the answers once. The website serves them, in your voice, in your branding, with a one-tap WhatsApp button at the bottom, forever. While you cook dinner. While you sleep. While you're on holiday in Margate.</p>
<p>This is the part most owners only feel after they have it. The phone starts ringing in the morning from people who already decided, last night, that you were the one. That's not magic. That's a salesperson who never logs off.</p>
`
  },
  {
    slug: 'the-trust-gap',
    title: 'The trust gap',
    date: 'Apr 19, 2026',
    readMin: 3,
    tag: 'Trust',
    excerpt: "\"Do they have a website?\" is the first thing a customer asks themselves before parting with money. You don't get to be in the conversation if the answer is no.",
    body: `
<p>There's a question every customer asks, silently, before they hand over money to a business they've never used. Most of them don't even know they're asking it.</p>
<p>"Do they have a website?"</p>
<p>Not "is it beautiful?" Not "is it long?" Just this: does it exist. The presence of a real website, with a real domain, with a real address and a real phone number, settles something in a customer's nervous system. It's a tiny, instant trust signal. <em>This is a real business. This isn't a scam. This person will probably still be here next month.</em></p>
<p>The absence of one does the opposite. It's not a deal-breaker for every customer. But it's a tax. It's a doubt. It's a reason to ask one more friend, or check one more competitor, or hold off till next week. And next week is where customers go to die.</p>
<p>In South Africa especially, where scams are everywhere and small businesses come and go, that trust signal is louder than people realise. A R799 website pays for itself the first time a customer didn't have to wonder.</p>
<p>You can be the most honest plumber, the best tutor, the most reliable cleaner in town. None of that matters if the customer never quite gets past the doubt. The website doesn't sell you. The website lets the customer give themselves permission to trust you.</p>
`
  },
  {
    slug: 'word-of-mouth-has-a-url',
    title: 'Word of mouth has a URL now',
    date: 'Apr 12, 2026',
    readMin: 3,
    tag: 'Referrals',
    excerpt: 'Your best customer can\'t refer you if they can\'t send a link. A website turns every happy customer into a salesperson.',
    body: `
<p>Word of mouth is still the best marketing there is. But the way it travels has changed.</p>
<p>Twenty years ago, "I know a guy" was a verbal handoff. A phone number scribbled on the back of a card. A name spoken at a braai. Today, the same recommendation happens in a WhatsApp group, on a Sunday afternoon, while everyone's looking at their phones. The mom in the school group asks: "Anyone know a good tutor?" Three people reply. Two send a link. One sends a phone number.</p>
<p>Who do you think gets called first?</p>
<p>The link wins, every time. It's tap-and-go. It opens a page that's already designed to convince. It works on the recommender's behalf without them having to type a single character of explanation. Your happy customer didn't have to be a great salesperson. Your website did the selling.</p>
<p>The owner without a website forces every referral to do work. Look up the business. Find the phone number. Hope the WhatsApp is monitored. That friction is invisible but it's brutal. Most referrals never complete that journey. They just don't.</p>
<p>If you have one customer who loves you, give them a link. Give every customer who loves you a link. That link is the lightest, fastest, most leverageable piece of marketing you'll ever own.</p>
`
  },
  {
    slug: 'what-youre-losing-each-month',
    title: 'What every month without a website costs you',
    date: 'Apr 5, 2026',
    readMin: 4,
    tag: 'Economics',
    excerpt: 'A website costs less than one job. The customers you don\'t get every month, because they couldn\'t find you, cost more than that. Forever.',
    body: `
<p>Let's do the maths. Honestly, without flinching.</p>
<p>A basic, professional website from us is R799 once. Hosting is R149 a month. So for a year, the all-in cost of being properly findable online is under R2,500. That's less than one decent job for most service businesses. One. Job.</p>
<p>Now let's look at the other side. How many people search for what you do, every month, in your suburb? Even conservatively, even if it's just twenty searches a month for "[your service] near [your area]", and even if only one of those becomes a paying customer, that's twelve new customers a year you didn't have. Twelve. Customers.</p>
<p>If the average customer is worth R500 to you over their lifetime, that's R6,000 of revenue you didn't earn. If they're worth R2,000, it's R24,000. If they're worth R10,000, and for plumbers, electricians, contractors, they often are, we're talking R120,000 of revenue you handed quietly to the competitor who showed up.</p>
<p>This is the part that makes us a little angry on behalf of business owners. The cost of a website is small. The cost of not having one compounds. Every month you wait is another month of customers who chose someone else, not because they were better, but because they were findable.</p>
<p>If you can find R799, you can stop the bleeding. That's the whole calculation.</p>
`
  },
  {
    slug: 'first-impressions-are-now-first-scrolls',
    title: 'First impressions are now first scrolls',
    date: 'Mar 29, 2026',
    readMin: 3,
    tag: 'Perception',
    excerpt: 'Your customer decided what you cost before they ever asked. They decided it in the first scroll of your website. So design what you want them to decide.',
    body: `
<p>By the time a customer asks for a quote, they've already decided what you cost.</p>
<p>Not the exact rand amount. That comes later. But the shape of it. The order of magnitude. The class of business you are. They decided it in the first three seconds of looking at your website. They decided it before they read a single word.</p>
<p>This is uncomfortable but it's true. Customers price you by the way your website feels in their hand. A site that loads slowly, with stretched logos and clashing fonts, says "cheap", even if you're actually excellent. A site that loads cleanly, with confident type and one good photo, says "premium", even before you've shown them what you do.</p>
<p>You can fight this. You can insist that customers should care about the work, not the website. You'd be right, philosophically. And you'd still lose the bidding war to the competitor whose homepage felt expensive.</p>
<p>The thing nobody tells small business owners is that <em>design is just permission to charge what you're worth.</em> A good website doesn't make you a better plumber. It lets you charge like a better plumber. It lets you walk into a quote conversation with the customer already half-convinced you're the premium choice, because they already saw the premium choice. They saw it before you opened your mouth.</p>
<p>So design what you want them to decide. They will decide it, either way.</p>
`
  }
];

/* ---------- Helpers ---------- */
window.LWSA_findPost = function (slug) {
  return (window.LWSA_POSTS || []).find(p => p.slug === slug);
};

window.LWSA_shareLinks = function (post) {
  const url = window.location.origin + window.location.pathname.replace(/[^/]*$/, '') + 'blog-post.html?slug=' + encodeURIComponent(post.slug);
  const title = post.title;
  return {
    url,
    whatsapp: 'https://wa.me/?text=' + encodeURIComponent(title + '\n' + url),
    twitter: 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(title) + '&url=' + encodeURIComponent(url),
    facebook: 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url),
    linkedin: 'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(url),
    email: 'mailto:?subject=' + encodeURIComponent(title) + '&body=' + encodeURIComponent(url)
  };
};
