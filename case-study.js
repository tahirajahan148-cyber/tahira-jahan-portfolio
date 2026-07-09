/* =========================================================================
   Case study renderer. Reads ?p=<slug> and builds the page from PORTFOLIO.
   Exposes window.__renderCaseStudy, called by main.js boot() before reveal init.
   ========================================================================= */
window.__renderCaseStudy = function (P, u) {
  var mount = document.getElementById('cs');
  if (!mount || !P.groups) return;
  var esc = u.esc, imgTag = u.imgTag, el = u.el;

  // Build an ordered, flat list of everything that has a page (for prev/next)
  var flat = [];
  P.groups.forEach(function (g) {
    g.projects.forEach(function (pr) { flat.push({ kind: 'project', org: g.org, data: pr }); });
  });
  if (P.otherWorks) flat.push({ kind: 'cats', org: 'Selected Graphics', data: P.otherWorks });
  if (P.arts) flat.push({ kind: 'arts', org: 'Ikulumina', data: P.arts });

  // hash routing (#slug) — query strings get stripped by static hosts with
  // clean-URL redirects, which made every project resolve to the first one.
  var slug = decodeURIComponent(location.hash.slice(1)) || new URLSearchParams(location.search).get('p');
  var idx = flat.findIndex(function (f) { return f.data.slug === slug; });
  if (idx < 0) idx = 0;
  var cur = flat[idx];
  var d = cur.data;

  // navigating to another case study only changes the hash — re-render
  window.addEventListener('hashchange', function () { location.reload(); }, { once: true });

  document.title = d.title + ' — Tahira Jahan';
  var md = document.querySelector('meta[name="description"]');
  if (md && (d.overview || d.description)) md.setAttribute('content', (d.overview || d.description).slice(0, 155));

  /* --- gallery helpers --- */
  function galleryColsClass(images) {
    if (!images || !images.length) return '';
    var wideCount = images.filter(function (im) { return im.w / im.h > 1.25; }).length;
    return wideCount / images.length > 0.5 ? ' cols-2' : '';
  }
  function galleryBlock(title, images, type) {
    if (!images || !images.length) return '';
    if (type === 'strip') {
      // seamless edge-to-edge strip for carousel artwork (panels share one height)
      var sItems = images.map(function (im) {
        return '<figure class="s-item" style="margin:0">' + imgTag(im, title) + '</figure>';
      }).join('');
      return '<div class="gallery-block"><h4>' + esc(title) + '</h4>' +
        '<div class="strip" data-gallery>' + sItems + '</div>' +
        '<p class="strip-hint">Scroll sideways — designed as one continuous carousel</p></div>';
    }
    // logo sheets are often transparent PNGs — give them a white plate
    var white = /logo/i.test(title || '') ? ' on-white' : '';
    var items = images.map(function (im) {
      return '<figure class="g-item' + white + '" data-reveal>' + imgTag(im, title) + '</figure>';
    }).join('');
    if (type === 'grid') {
      // ordered pages: row-major grid so the sequence reads left-to-right
      return '<div class="gallery-block">' +
        (title ? '<h4>' + esc(title) + '</h4>' : '') +
        '<div class="gallery-grid" data-gallery>' + items + '</div></div>';
    }
    return '<div class="gallery-block">' +
      (title ? '<h4>' + esc(title) + '</h4>' : '') +
      '<div class="gallery' + galleryColsClass(images) + '" data-gallery>' + items + '</div></div>';
  }
  function videoBlock(v) {
    if (!v) return '';
    // preload="metadata" shows the video's own first frame — an accurate thumbnail
    return '<div class="gallery-block"><h4>Motion</h4><div class="gallery cols-2"><div class="g-video">' +
      '<video controls preload="metadata" playsinline><source src="' + v.src + '#t=0.5" type="video/mp4" />Your browser does not support the video tag.</video>' +
      '</div></div></div>';
  }

  /* --- head + cover --- */
  var html = '';
  html += '<section class="cs-hero wrap">' +
    '<a class="cs-back" href="index.html#work">← Back to projects</a>' +
    '<p class="cs-org">' + esc(cur.org) + '</p>' +
    '<h1 class="cs-title" data-reveal>' + esc(d.title) + '</h1>' +
    (d.subtitle ? '<p class="cs-sub" data-reveal data-delay="1">' + esc(d.subtitle) + '</p>' : '') +
    '</section>';

  if (d.cover) {
    html += '<div class="wrap"><figure class="cs-cover" data-reveal>' + imgTag(d.cover, d.title, true) + '</figure></div>';
  }

  /* --- overview --- */
  var overviewText = d.overview || d.description || '';
  if (overviewText) {
    html += '<section class="pad wrap"><div class="cs-overview">' +
      '<div data-reveal><p class="k">' + (cur.kind === 'arts' ? 'About' : 'Overview') + '</p></div>' +
      '<div class="big" data-reveal data-delay="1"><p>' + esc(overviewText) + '</p></div>' +
      '</div>';

    /* story (bahas) */
    if (d.story) {
      html += '<div class="cs-block" style="margin-top:clamp(40px,6vw,90px)">' +
        '<div data-reveal><h3>' + esc(d.story.heading) + '</h3></div>' +
        '<div class="body" data-reveal data-delay="1">' + d.story.body.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') + '</div>' +
        '</div>';
    }
    /* creative direction / concept */
    if (d.direction) {
      html += '<div class="cs-block" style="margin-top:clamp(40px,6vw,90px)">' +
        '<div data-reveal><h3>' + esc(d.directionLabel || 'Creative Direction') + '</h3></div>' +
        '<div class="body" data-reveal data-delay="1"><p>' + esc(d.direction) + '</p></div>' +
        '</div>';
    }
    /* contributions */
    if (d.contributions && d.contributions.length) {
      html += '<div class="cs-block" style="margin-top:clamp(40px,6vw,90px)">' +
        '<div data-reveal><h3>My Contributions</h3></div>' +
        '<ol class="contrib" data-reveal data-delay="1">' + d.contributions.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') + '</ol>' +
        '</div>';
    }
    html += '</section>';
  }

  /* --- galleries --- */
  html += '<section class="pad wrap" style="padding-top:0">';
  html += videoBlock(d.video);
  if (d.galleries) d.galleries.forEach(function (g) { html += galleryBlock(g.title, g.images, g.type); });
  if (d.categories) d.categories.forEach(function (g) { html += galleryBlock(g.title, g.images, g.type); });
  html += '</section>';

  /* --- next project --- */
  var nxt = flat[(idx + 1) % flat.length].data;
  html += '<section class="dark"><div class="wrap cs-next"><a href="case-study.html#' + encodeURIComponent(nxt.slug) + '">' +
    '<span><span class="k">Next project</span><br><span class="t">' + esc(nxt.title) + '</span></span>' +
    '<span class="t" aria-hidden="true">→</span></a></div></section>';

  mount.innerHTML = html;
  window.scrollTo(0, 0);
};
