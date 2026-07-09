// Generates data.js (window.PORTFOLIO) by merging curated copy (sourced from the
// portfolio PDF) with the optimized image manifest. Run: node build-data.js
const fs = require('fs');
const path = require('path');
const manifest = require('./manifest.json');

// removed on request: the Sadia Afrin (Equity Officer) glass painting
const EXCLUDE = new Set(['whatsapp-image-2025-11-30-at-01-35-34-dd13aa20']);

const pick = (slug, names) => {
  const list = (manifest[slug] || []).filter(i => !EXCLUDE.has(i.name));
  if (!names) return list;
  const byName = Object.fromEntries(list.map(i => [i.name, i]));
  return names.map(n => byName[n]).filter(Boolean);
};
const cover = (slug, name) => (manifest[slug] || []).find(i => i.name === name) || (manifest[slug] || [])[0];

// ---- Site-level content (verbatim / lightly trimmed from PDF) ----
const site = {
  name: 'Tahira Jahan',
  role: 'Graphic Designer',
  tagline: 'Brand Identity · Visual Communication · Editorial Design',
  heroLine: 'Designing thoughtful visuals that bridge creativity, marketing, and storytelling.',
  heroPortrait: cover('portrait', 'tahira'),
  heroCutout: { name: 'tahira-cutout', src: 'assets/portrait/tahira-cutout.webp', w: 768, h: 1529 },
  aboutImage: cover('portrait', 'about'),
  about: [
    "I'm Tahira Jahan, a Graphic Designer and Marketing undergraduate at the University of Chittagong with a passion for creating clean, strategic, and memorable visual identities.",
    "Currently, I work as a Graphic Designer at Solvetech Solutions LLC, a software systems and automation agency that helps businesses scale through CRM systems, lead generation funnels, AI automation, and growth solutions.",
    "I also serve as the Coordinator of Graphics & Media at DCU (Debaters of Chittagong University), leading visual communication for events and digital campaigns.",
    "I contribute to FalcryX, a student-led aerospace engineering team developing AI-powered autonomous UAV systems, preparing to compete in the Student Unmanned Aerial Systems (SUAS) Competition — one of the world's largest collegiate autonomous aerial robotics competitions. As the Social Media Designer, I create technical presentations, pitch decks, sponsorship proposals, magazines, and visual communication that support the team's engineering and competition efforts.",
    "I also served as an Officer of Branding & Graphics for Hult Prize at the University of Chittagong, leading the branding and visual communication for the campus round of one of the world's largest student entrepreneurship competitions.",
    "Beyond professional work, I run It's me Iku, my own art brand. I hand-paint glass portraits for crests, gifts, and event mementos, transform illustrations into handcrafted products, and make digital art purely for the joy of it.",
    "My background in marketing helps me approach every design with both aesthetics and business goals in mind. I enjoy solving communication problems through design — whether that's building a brand identity, designing engaging social media campaigns, or crafting visuals that leave a lasting impression.",
  ],
  roles: [
    { title: 'Graphic Designer', org: 'Solvetech Solutions LLC' },
    { title: 'Coordinator, Graphics & Media', org: 'Debaters of Chittagong University' },
    { title: 'Social Media Designer', org: 'FalcryX' },
    { title: 'Former Officer, Branding & Graphics', org: 'Hult Prize at University of Chittagong' },
    { title: 'Founder', org: "It's me Iku" },
  ],
  expertise: [
    'Brand Identity Design', 'Logo Design & Visual Systems', 'Social Media & Marketing Creatives',
    'Print & Event Design', 'Adobe Illustrator & Photoshop', 'Canva', 'Premiere Pro', 'DaVinci Resolve',
  ],
  contact: {
    email: 'tahirajahan148@gmail.com',
    phone: '01728981741',
    whatsapp: 'https://wa.me/8801728981741',
    linkedin: 'https://www.linkedin.com/in/tahira-jahan-450676322/',
    behance: 'https://www.behance.net/tahirajahan2',
    facebook: 'https://www.facebook.com/tahira.iku',
    facebookPage: 'https://www.facebook.com/profile.php?id=61557223352347',
    instagram: 'https://www.instagram.com/tahi_ra_iku/',
    instagramIku: 'https://www.instagram.com/iku.lumina',
  },
};

// ---- Projects (grouped by organization) ----
const groups = [
  {
    id: 'dcu', org: 'Debaters of Chittagong University', short: 'DCU', role: 'Graphics & Media Coordinator',
    note: 'Leading visual communication for events and digital campaigns as Graphics & Media Coordinator.',
    projects: [
      {
        slug: 'bahas', title: 'BAHAS', subtitle: 'English National Debate Festival 2026',
        cover: cover('bahas', 'bahas-open-cover'),
        overview: "As the Graphics & Media Coordinator of Debaters of Chittagong University (DCU), I independently led the visual identity and social media campaign for BAHAS, DCU's English National Debate Festival. From concept development to campaign execution, I was responsible for designing every promotional asset and maintaining a cohesive digital presence throughout the event.",
        story: {
          heading: 'The Story Behind BAHAS',
          body: [
            "Launching a debate festival during Ramadan presented an opportunity to create something more meaningful than a conventional event campaign. Rather than relying on familiar religious motifs, I looked to the Islamic Golden Age — an era where debate, scholarship, and the pursuit of knowledge shaped civilizations.",
            'The festival was named "BAHAS", a word that translates to debate or discussion. That single word became the foundation of the campaign, connecting the spirit of competitive debating with the intellectual legacy of one of history’s greatest periods of learning.',
            "Each campaign visual highlighted a significant center of knowledge from the Islamic Golden Age — such as Bayt al-Hikma (House of Wisdom) and other influential cities and institutions. Every post was paired with a carefully written caption that introduced the historical importance of the featured location.",
          ],
        },
        direction: "The campaign was built around a simple idea: every debate begins with the pursuit of knowledge. By combining historical storytelling with modern visual design, the campaign transformed promotional content into an educational experience — creating a distinctive identity that became one of DCU’s most memorable event campaigns.",
        contributions: [
          'Built the campaign concept around the Islamic Golden Age — each post spotlighted a historic center of knowledge, from Bayt al-Hikma onward',
          'Designed the BAHAS calligraphic logo, the festival cover art, and the campaign backgrounds',
          'Designed the introduction series for adjudicators and the organizing team',
          'Created the full announcement system — prize pool reveals, eligibility rules, slot allotments, deadline extensions, and countdown posters',
          'Wrote historically contextual captions pairing every visual with its story',
          'Scheduled and managed the campaign end-to-end under one cohesive brand language',
        ],
        galleries: [
          { title: 'Logo & Cover', images: pick('bahas', ['bahas-open-cover','whatsapp-image-2026-02-23-at-10-57-33-pm','bahas-logo','bg-for-bahas']) },
          { title: 'Adjudicator & Org Team Intros', images: pick('bahas', ['abid-bin-ahmad','mahathir-mahmud','boku-bhai','ishrak','sadman-chowdhury','shuchi-apu']) },
          { title: 'Announcement Posters', images: pick('bahas', ['prizepool-open-final','prizepool-novice-final','prize-pool-total-amount','deadline-extended','slot-allotment','waiting-list-3','novice-elegibty-rules','dot-dof','dot-dof-novice','1-day-left','2-days-left','3-day-left-for-slot-confirmation','untitled-1']) },
        ],
      },
      {
        slug: 'discourse', title: 'Discourse 2.0', subtitle: 'DCU Recruitment & Training Program',
        cover: cover('discourse', 'flyer-1-1'),
        overview: "Discourse 2.0 was a month-long recruitment and training program designed to introduce new members to competitive debating. The campaign promoted an immersive learning journey through eight interactive training sessions, guidance from experienced mentors, and a one-day intra debate tournament, helping participants build confidence before entering the debating community.",
        direction: "The campaign was built around the idea of taking the first step. The central visual of a participant walking down a red path symbolized every debater’s journey — from discovering their voice to standing confidently on the debate stage. Bold typography, directional composition, and a restrained red-and-black palette reinforced the theme of growth, confidence, and progression.",
        contributions: [
          'Developed the "first step" concept — a participant walking a red path toward the debate stage',
          'Designed the Discourse 2.0 logo and the restrained red-and-black campaign identity',
          'Created the promotional flyers, event cover, stage backdrop, and registration announcements',
          'Structured session details, mentorship info, and the tournament format into clear, scannable layouts',
        ],
        galleries: [ { title: 'Campaign Assets', images: pick('discourse', ['flyer-1-1','flyer-2-1','discourse-2-0-logo-01','backdrop-and-event-cover','registration-form-live-discourse2-0','dropdown']) } ],
      },
      {
        slug: 'dcu-agm', title: 'DCU 2nd AGM & Panel Handover', subtitle: 'Announcement Series',
        cover: cover('dcu-agm', 'tushar-nath-antu'),
        overview: "As the Graphics & Media Coordinator of DCU, I designed the visual campaign for the 2nd Annual General Meeting (AGM) and Executive Panel Handover, introducing the newly elected executive committee through a cohesive social media announcement series.",
        direction: "Inspired by the idea of Breaking News, the campaign used newspaper-style layouts, editorial typography, and vintage textures to present each executive announcement as a headline, emphasizing the significance of a new chapter for the organization.",
        directionLabel: 'Concept',
        contributions: [
          'Developed the "Breaking News" concept for the executive panel handover',
          'Designed the newspaper-style template — editorial typography, headline layouts, and vintage textures',
          'Created an individual announcement post for each newly elected executive',
          'Kept the whole series reading as one continuous front-page story',
        ],
        galleries: [ { title: 'Announcement Series', images: pick('dcu-agm') } ],
      },
      {
        slug: 'dcu-brand', title: 'DCU Brand Communication', subtitle: 'Day-to-day Visual Identity',
        cover: cover('dcu-brand', 'aura-iv-finalist-2'),
        overview: "Responsible for DCU’s day-to-day visual communication, creating social media content that keeps the community informed and engaged. My work includes event promotions, achievement announcements, recruitment campaigns, committee updates, and branded graphics that maintain a consistent visual identity across the club’s digital platforms.",
        contributions: [
          'Design the day-to-day social content — event promotions, results, and achievement announcements',
          'Create recruitment campaigns and committee & organizational update graphics',
          'Develop branded templates that keep DCU’s feed consistent and instantly recognizable',
        ],
        galleries: [ { title: 'Selected Communications', images: pick('dcu-brand') } ],
      },
    ],
  },
  {
    id: 'falcryx', org: 'FalcryX', short: 'FalcryX', role: 'Social Media Designer',
    note: 'Technical presentations, pitch decks, and visual communication for a student-led aerospace team.',
    projects: [
      {
        slug: 'falcryx-handbook', title: 'Technical Handbook & Brand Presentation', subtitle: '26-page Publication',
        cover: cover('falcryx-handbook', '1'),
        overview: "As the Social Media Designer at FalcryX, I designed the team’s official 26-page handbook, presenting its mission, UAV technology, engineering approach, and participation in the Student Unmanned Aerial Systems (SUAS) Competition. The publication serves as a comprehensive resource for sponsors, collaborators, and new members, communicating complex technical concepts through clear and engaging visual storytelling.",
        direction: "The handbook was designed to simplify complex engineering concepts through clean editorial layouts, technical illustrations, and structured information design, creating a visual narrative that reflects FalcryX’s vision, innovation, and engineering excellence.",
        contributions: [
          'Designed all 26 pages — cover, mission, UAV technology, engineering approach, and SUAS competition sections',
          'Developed the layout system: editorial grids, technical illustration placements, and typographic hierarchy',
          'Translated UAV engineering concepts into clear, sponsor-friendly visual explanations',
          'Carried FalcryX’s deep-space brand identity through every page',
        ],
        galleries: [ { title: 'Handbook Pages — in order', type: 'grid', images: pick('falcryx-handbook').sort(function (a, b) { return Number(a.name) - Number(b.name); }) } ],
      },
      {
        slug: 'falcryx-social', title: 'Social Media Communication', subtitle: 'Ongoing Campaign Design',
        cover: cover('falcryx-social', 'recruitment-poster-1'),
        overview: "I manage FalcryX’s social media presence on a regular basis — designing recruitment campaigns, member introductions, and announcement graphics that keep the team’s audience engaged and informed.",
        contributions: [
          'Design recruitment campaigns — role openings across AI, engineering, and media positions',
          'Create member introduction and team announcement graphics',
          'Produce registration and deadline reminders on a regular publishing schedule',
          'Keep the team’s aerospace identity consistent across every post',
        ],
        galleries: [ { title: 'Social Media Design', images: pick('falcryx-social') } ],
      },
    ],
  },
  {
    id: 'solvetech', org: 'Solvetech Solutions LLC', short: 'Solvetech', role: 'Graphic Designer',
    note: 'Strategic branded content and visual development for a software systems and automation agency.',
    projects: [
      {
        slug: 'solvetech-clients', title: 'Client Social Media Management', subtitle: 'MCQ Properties',
        cover: cover('solvetech-clients', 'chatgpt-image-jun-17-2026-09-53-38-pm'),
        overview: "As part of my role at SolveTech Solutions LLC, I manage the social media presence of Denis McQueen, founder of MCQ Properties, a U.S.-based real estate investment firm. My work focuses on creating strategic visual content that communicates investment insights, builds brand credibility, and maintains a consistent digital identity across social platforms.",
        contributions: [
          'Design branded investment-insight content for MCQ Properties’ social platforms',
          'Develop visual assets aligned with the firm’s real-estate identity',
          'Translate the client’s business insights into credible, engaging visual communication',
          'Maintain one consistent digital identity across every platform',
        ],
        galleries: [ { title: 'Content & Campaigns', images: pick('solvetech-clients') } ],
      },
      {
        slug: 'solvetech-visual', title: 'Solvetech Solutions Visual Development', subtitle: 'Brand & Weekly Content',
        cover: cover('solvetech-weekly', 'tuesday-educational-insights-square'),
        overview: "Contributed to the visual development of SolveTech Solutions LLC by creating branded content, marketing assets, and social media insights that strengthened the company’s digital presence and maintained a consistent visual identity across platforms.",
        contributions: [
          'Design the weekly content series — educational insights, tips, and promotional posts',
          'Created the logo variations and brand assets for Impact AI Academy',
          'Produce marketing banners and promotional graphics for campaigns',
          'Prepare social media audit reports and visual performance analyses',
        ],
        galleries: [
          { title: 'Weekly Content', images: pick('solvetech-weekly') },
          { title: 'Recruitment & Hiring Design', images: pick('solvetech-hiring') },
          { title: 'Impact AI Academy — Logo Variations', images: pick('solvetech-impact', ['impact-ai-logo-1','impact-ai-logo-2','impact-ai-logo-3','chatgpt-image-jun-30-2026-10-01-16-pm','chatgpt-image-jun-30-2026-10-37-53-pm','chatgpt-image-jun-30-2026-10-54-46-pm']) },
        ],
      },
    ],
  },
  {
    id: 'hult', org: 'Hult Prize at University of Chittagong', short: 'Hult Prize', role: 'Officer, Branding & Graphics',
    note: 'Branding and visual communication for the campus round of a global student entrepreneurship competition.',
    projects: [
      {
        slug: 'odhora', title: 'Project ODHORA', subtitle: 'Menstrual Health Awareness',
        cover: cover('odhora', 'logo-board'),
        overview: "Project ODHORA is a menstrual health awareness initiative focused on providing age-appropriate education for school-aged girls. The project required a visual identity that could support learning while remaining emotionally safe and approachable for a young audience.",
        contributions: [
          'Designed ODHORA’s official logo — soft forms and an approachable palette, built to feel safe for school-aged girls',
          'Created the branded bookmarks and stickers used as educational collateral',
        ],
        galleries: [ { title: 'Identity & Collateral', images: pick('odhora', ['logo-board','odhora-logo-file-1-1','female-vector','bookmark','odhora-bookmarks-odhora-bookmarks-1','odhora-bookmarks-odhora-bookmarks-2','odhora-bookmarks-odhora-bookmarks-3','odhora-bookmarks-odhora-bookmarks-4','odhora-bookmarks-odhora-bookmarks-5']) } ],
      },
      {
        slug: 'hpcu-campus', title: 'Campus Round HPCU & Hult Prize Junior', subtitle: 'Event Poster Design',
        cover: cover('hpcu-campus', '614904641-1197439579232739-450392648653911007-n'),
        overview: "I designed posters for two events — the Hult Prize campus round at the University of Chittagong and Hult Prize Junior — leading the branding and visual communication across both.",
        contributions: [
          'Designed the event posters for the HPCU campus round and Hult Prize Junior',
          'Created speaker, judge, and mentor announcement graphics',
          'Produced motion content promoting the campus round',
          'Kept Hult Prize’s global brand guidelines consistent across both events',
        ],
        video: { src: 'assets/hpcu-campus/campus-round-reel.mp4', poster: cover('hpcu-campus', '614904641-1197439579232739-450392648653911007-n').src },
        galleries: [ { title: 'Event Posters', images: pick('hpcu-campus') } ],
      },
    ],
  },
];

// ---- Standalone sections ----
const otherWorks = {
  slug: 'other-designs', title: 'Other Design Works', subtitle: 'Selected Graphics',
  cover: cover('other-designs', 'banner-cusd'),
  overview: 'A selection of additional graphic design work — logos, banners, posters, and thumbnails across a range of briefs.',
  categories: [
    { title: 'Logo Designs', images: pick('other-designs', ['odhora-logo-1-01','odhora-logo-2-01']) },
    { title: 'Banners', images: pick('other-designs', ['banner-cusd','banner-1']) },
    { title: 'Posters', images: pick('other-designs', ['hiring-1','the-laziness-myth-20251013-142515-0000','copy-of-copy-of-department-deep-dive-20251013-134009-0000','add-a-heading-20251009-161731-0000','sunscreen-2']) },
    { title: 'Thumbnails & Other Works', images: pick('other-designs', ['thumbnail-2','youtube-thumbnail']) },
  ],
};

const arts = {
  slug: 'my-arts', title: 'My Arts', subtitle: "It's me Iku",
  cover: cover('glass-paintings', 'whatsapp-image-2025-11-30-at-01-35-11-c781ca60'),
  description: 'Beyond client work, I make glass paintings for crests and events, and create digital art for the joy of it — a personal practice that feeds back into everything I design.',
  categories: [
    { title: 'Glass Paintings', images: pick('glass-paintings') },
    { title: 'Digital Art', images: pick('digital-art') },
  ],
};

const out = 'window.PORTFOLIO = ' + JSON.stringify({ site, groups, otherWorks, arts }, null, 2) + ';\n';
fs.writeFileSync(path.join(__dirname, 'data.js'), out);
console.log('data.js written:', out.length, 'bytes');
