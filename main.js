/* =========================================================================
   Tahira Jahan — Portfolio · shared behaviour + home rendering
   ========================================================================= */
(function () {
  'use strict';
  var P = window.PORTFOLIO || {};
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- helpers ---------- */
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* image with lazy-load + intrinsic size (prevents layout shift) */
  function imgTag(im, alt, eager) {
    return '<img src="' + im.src + '" width="' + im.w + '" height="' + im.h + '" alt="' + esc(alt) + '" ' +
      (eager ? 'loading="eager"' : 'loading="lazy"') + ' decoding="async" />';
  }

  /* ---------- nav: scroll state + progress + active link + burger ---------- */
  function initNav() {
    var nav = document.getElementById('nav');
    var bar = document.getElementById('progress');
    var onScroll = function () {
      if (nav) nav.classList.toggle('scrolled', window.scrollY > 24);
      if (bar) {
        var h = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    var burger = document.getElementById('burger');
    var links = document.getElementById('navLinks');
    if (burger && links) {
      var toggle = function (open) {
        document.body.classList.toggle('menu-open', open);
        burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      };
      burger.addEventListener('click', function () { toggle(!document.body.classList.contains('menu-open')); });
      links.addEventListener('click', function (e) { if (e.target.closest('a')) toggle(false); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') toggle(false); });
    }

    // scroll-spy for same-page anchors
    var spy = [].slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));
    if (spy.length && 'IntersectionObserver' in window) {
      var map = {};
      spy.forEach(function (a) {
        var id = a.getAttribute('href').slice(1);
        var sec = document.getElementById(id);
        if (sec) map[id] = a;
      });
      var so = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            spy.forEach(function (a) { a.classList.remove('active'); });
            if (map[en.target.id]) map[en.target.id].classList.add('active');
          }
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      Object.keys(map).forEach(function (id) { so.observe(document.getElementById(id)); });
    }
  }

  /* ---------- scroll reveal (idempotent) ---------- */
  var revealObserver = null;
  function initReveal(root) {
    root = root || document;
    var nodes = [].slice.call(root.querySelectorAll('[data-reveal]')).filter(function (n) { return !n.__rev; });
    if (reduce || !('IntersectionObserver' in window)) {
      nodes.forEach(function (n) { n.classList.add('in'); n.__rev = 1; });
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('in'); revealObserver.unobserve(en.target); }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    }
    nodes.forEach(function (n) { n.__rev = 1; revealObserver.observe(n); });
  }

  /* ---------- lightbox (event-delegated) ---------- */
  var LB = { list: [], i: 0 };
  function initLightbox() {
    var box = document.getElementById('lightbox');
    if (!box) return;
    var img = document.getElementById('lbImg');
    var count = document.getElementById('lbCount');

    function show() {
      var it = LB.list[LB.i];
      if (!it) return;
      img.src = it.src; img.alt = it.alt || '';
      count.textContent = (LB.i + 1) + ' / ' + LB.list.length;
    }
    function open(list, i) {
      LB.list = list; LB.i = i;
      box.classList.add('open');
      document.body.style.overflow = 'hidden';
      show();
    }
    function close() { box.classList.remove('open'); document.body.style.overflow = ''; }
    function next(d) { LB.i = (LB.i + d + LB.list.length) % LB.list.length; show(); }

    // delegate: any gallery item click opens its gallery group
    document.addEventListener('click', function (e) {
      var item = e.target.closest('.g-item, .s-item');
      if (!item) return;
      var group = item.closest('[data-gallery]') || document;
      var items = [].slice.call(group.querySelectorAll('.g-item, .s-item'));
      var list = items.map(function (n) { var im = n.querySelector('img'); return { src: im.getAttribute('src'), alt: im.getAttribute('alt') }; });
      open(list, items.indexOf(item));
    });

    document.getElementById('lbClose').addEventListener('click', close);
    document.getElementById('lbPrev').addEventListener('click', function () { next(-1); });
    document.getElementById('lbNext').addEventListener('click', function () { next(1); });
    box.addEventListener('click', function (e) { if (e.target === box) close(); });
    document.addEventListener('keydown', function (e) {
      if (!box.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') next(1);
      else if (e.key === 'ArrowLeft') next(-1);
    });
    // swipe
    var x0 = null;
    box.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    box.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 45) next(dx < 0 ? 1 : -1);
      x0 = null;
    });
  }

  /* ---------- contact form (no backend: graceful mailto fallback) ---------- */
  function initForm() {
    var form = document.getElementById('contactForm');
    if (!form) return;
    var status = document.getElementById('formStatus');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.name.value.trim(), email = form.email.value.trim(), msg = form.message.value.trim();
      status.className = 'form-status';
      if (!name || !email || !msg) { status.textContent = 'Please fill in all fields.'; status.classList.add('err'); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { status.textContent = 'Please enter a valid email address.'; status.classList.add('err'); return; }
      var subject = encodeURIComponent('Portfolio enquiry from ' + name);
      var body = encodeURIComponent(msg + '\n\n— ' + name + ' (' + email + ')');
      window.location.href = 'mailto:tahirajahan148@gmail.com?subject=' + subject + '&body=' + body;
      status.textContent = 'Opening your email app… if nothing happens, email tahirajahan148@gmail.com directly.';
      status.classList.add('ok');
      form.reset();
    });
  }

  /* ---------- home: render work bands + arts ---------- */
  function countImages(pr) {
    var n = 0;
    (pr.galleries || []).forEach(function (g) { n += (g.images || []).length; });
    (pr.categories || []).forEach(function (g) { n += (g.images || []).length; });
    return n;
  }

  function projectCard(pr, pi, wide, g) {
    var a = document.createElement('a');
    a.className = 'card' + (wide ? ' wide' : '');
    a.href = 'case-study.html#' + encodeURIComponent(pr.slug);
    a.setAttribute('data-reveal', '');
    a.setAttribute('data-delay', String((pi % 3) + 1));
    var cov = pr.cover || {};
    var initial = (g.short || pr.title || 'T').charAt(0);
    var assets = pr.assetCount != null ? pr.assetCount : countImages(pr);
    a.innerHTML =
      '<div class="card-media">' + imgTag(cov, pr.title) +
        '<span class="card-save" aria-hidden="true">✦</span>' +
        '<span class="card-avatar" aria-hidden="true">' + esc(initial) + '</span></div>' +
      '<div class="card-body">' +
        '<div class="card-titles"><div>' +
          '<div class="card-title">' + esc(pr.title) + '</div>' +
          '<div class="card-sub">' + esc(pr.subtitle || '') + '</div>' +
        '</div><span class="card-index">' + String(pi + 1).padStart(2, '0') + '</span></div>' +
        '<div class="card-meta">' +
          '<span class="m"><span class="mv">' + esc(g.short || '') + '</span><span class="mk">team</span></span>' +
          '<span class="m"><span class="mv">' + esc(g.roleShort || g.role || '') + '</span><span class="mk">my role</span></span>' +
          (assets ? '<span class="m"><span class="mv">' + assets + '+</span><span class="mk">designs</span></span>' : '') +
        '</div>' +
        '<span class="card-cta">View full project →</span>' +
      '</div>';
    return a;
  }

  function bandHead(num, kicker, title, note, count) {
    var head = el('header', 'band-head');
    head.setAttribute('data-reveal', '');
    head.innerHTML =
      '<span class="band-num" aria-hidden="true">' + num + '</span>' +
      '<div>' +
        '<p class="band-kicker">' + esc(kicker) + '</p>' +
        '<h3 class="band-title">' + esc(title) + '</h3>' +
        (note ? '<p class="band-note">' + esc(note) + '</p>' : '') +
      '</div>' +
      '<span class="band-count">' + esc(count) + '</span>';
    return head;
  }

  function renderHome() {
    var mount = document.getElementById('workGroups');
    if (!mount || !P.groups) return;

    // short role labels for card meta
    var ROLE_SHORT = {
      'Graphics & Media Coordinator': 'Coordinator',
      'Social Media Designer': 'Designer',
      'Graphic Designer': 'Designer',
      'Officer, Branding & Graphics': 'Branding',
    };

    // each organization = a full-bleed band; alternate light / dark
    var all = P.groups.map(function (g) {
      return { kicker: 'Organization', title: g.org, note: g.note, projects: g.projects, short: g.short, role: g.role, roleShort: ROLE_SHORT[g.role] || g.role };
    });
    if (P.otherWorks) {
      all.push({
        kicker: 'Archive', title: 'Other Design Works',
        note: 'Logos, banners, posters, and thumbnails across a range of briefs.',
        short: 'Misc', role: 'Designer', roleShort: 'Designer',
        projects: [{ slug: 'other-designs', title: 'A selection of graphics', subtitle: 'Logos · Banners · Posters · Thumbnails', cover: P.otherWorks.cover, assetCount: (P.otherWorks.categories || []).reduce(function (n, c) { return n + c.images.length; }, 0) }],
      });
    }

    all.forEach(function (g, gi) {
      var band = el('section', 'band' + (gi % 2 === 1 ? ' dark' : ''));
      var inner = el('div', 'wrap band-inner');
      var n = g.projects.length;
      inner.appendChild(bandHead(String(gi + 1).padStart(2, '0'), g.kicker, g.title, g.note, n + (n === 1 ? ' project' : ' projects')));
      var cards = el('div', 'cards');
      g.projects.forEach(function (pr, pi) {
        var wide = n % 2 === 1 && pi === n - 1;
        cards.appendChild(projectCard(pr, pi, wide, g));
      });
      inner.appendChild(cards);
      band.appendChild(inner);
      mount.appendChild(band);
    });

    // Arts
    var ac = document.getElementById('artsCats');
    if (ac && P.arts) {
      P.arts.categories.forEach(function (cat) {
        var h = el('h3', 'arts-cat'); h.setAttribute('data-reveal', ''); h.textContent = cat.title;
        ac.appendChild(h);
        var grid = el('div', 'arts-grid'); grid.setAttribute('data-gallery', '');
        cat.images.forEach(function (im) {
          var d = el('div', 'art g-item'); d.setAttribute('data-reveal', '');
          d.innerHTML = imgTag(im, cat.title);
          grid.appendChild(d);
        });
        ac.appendChild(grid);
      });
    }
  }

  /* ---------- reviews: smooth one-by-one rotation ---------- */
  function initReviews() {
    var stage = document.getElementById('reviewStage');
    var dotsWrap = document.getElementById('reviewDots');
    if (!stage || !dotsWrap) return;
    var slides = [].slice.call(stage.querySelectorAll('.review-slide'));
    if (slides.length < 2) return;
    var i = 0, timer = null;

    slides.forEach(function (_, di) {
      var b = document.createElement('button');
      b.className = 'review-dot' + (di === 0 ? ' is-active' : '');
      b.type = 'button';
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-label', 'Review ' + (di + 1));
      b.addEventListener('click', function () { go(di); restart(); });
      dotsWrap.appendChild(b);
    });
    var dots = [].slice.call(dotsWrap.children);

    function go(n) {
      if (n === i) return;
      slides[i].classList.remove('is-active');
      slides[i].classList.add('is-leaving');
      (function (old) { setTimeout(function () { old.classList.remove('is-leaving'); }, 700); })(slides[i]);
      dots[i].classList.remove('is-active');
      i = n;
      slides[i].classList.add('is-active');
      dots[i].classList.add('is-active');
    }
    function next() { go((i + 1) % slides.length); }
    function restart() { if (timer) clearInterval(timer); if (!reduce) timer = setInterval(next, 3600); }

    // pause while hovered or off-screen
    stage.addEventListener('mouseenter', function () { if (timer) clearInterval(timer); timer = null; });
    stage.addEventListener('mouseleave', restart);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) {
        if (en[0].isIntersecting) restart();
        else if (timer) { clearInterval(timer); timer = null; }
      }, { threshold: .2 }).observe(stage);
    } else {
      restart();
    }
  }

  /* ---------- hero typing effect ---------- */
  function initTyped() {
    var elT = document.getElementById('typed');
    if (!elT) return;
    var words = ['Graphic Designer', 'Brand Identity Designer', 'Visual Storyteller', 'Editorial Designer'];
    if (reduce) { elT.textContent = words[0]; return; }
    var wi = 0, ci = words[0].length, deleting = false;
    (function tick() {
      var w = words[wi];
      elT.textContent = w.slice(0, ci);
      var delay;
      if (!deleting) {
        if (ci < w.length) { ci++; delay = 65; }
        else { deleting = true; delay = 2400; }
      } else {
        if (ci > 0) { ci--; delay = 32; }
        else { deleting = false; wi = (wi + 1) % words.length; delay = 350; }
      }
      setTimeout(tick, delay);
    })();
  }

  /* ---------- boot ---------- */
  function boot() {
    document.getElementById('year') && (document.getElementById('year').textContent = new Date().getFullYear());
    initNav();
    initLightbox();
    initForm();
    renderHome();
    initTyped();
    initReviews();
    if (window.__renderCaseStudy) window.__renderCaseStudy(P, { el: el, esc: esc, imgTag: imgTag });
    initReveal(document);
  }

  window.SITE = { initReveal: initReveal, el: el, esc: esc, imgTag: imgTag };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
