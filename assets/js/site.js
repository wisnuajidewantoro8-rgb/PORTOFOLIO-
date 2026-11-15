/* Portofolio — semua isi diambil dari data/content.json (diedit lewat /admin). */
(function () {
  const IS_BLOG = !!document.getElementById('blogApp');
  const BASE = IS_BLOG ? '' : '';

  const I = {
    send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2Z"/>',
    whatsapp: '<path d="M3 21l1.7-5A9 9 0 1 1 8 19.3Z"/><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"/>',
    linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
    instagram: '<rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".5"/>',
    scholar: '<path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
    github: '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.1-1.3-.3-2.5-1-3.5.3-1.2.3-2.4 0-3.5 0 0-1 0-3 1.5a10.3 10.3 0 0 0-5.4 0C7.6 2 6.6 2 6.6 2c-.3 1.1-.3 2.3 0 3.5A5.4 5.4 0 0 0 5.5 9c0 3.5 3 5.5 6 5.5-.4.5-.7 1.1-.8 1.7-.2.6-.2 1.2-.2 1.8v4"/><path d="M9 18c-4.5 2-5-2-7-2"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    up: '<path d="m18 15-6-6-6 6"/>',
    ext: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>'
  };
  const icon = n => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${I[n] || ''}</svg>`;
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const url = u => { u = String(u || '').trim().replace(/^\/(?=(assets|data)\/)/, ''); if (!u) return ''; if (/^(https?:|mailto:|tel:|\/|\.\/|assets\/|data\/|#|blog\.html)/i.test(u)) return esc(u); if (/^[\w.-]+\.[a-z]{2,}/i.test(u)) return esc('https://' + u); return ''; };
  const has = v => Array.isArray(v) ? v.length > 0 : !!(v && String(v).trim());
  const initials = n => String(n || '?').split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
  const fmtDate = d => { if (!d) return ''; const t = new Date(d); return isNaN(t) ? d : t.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }); };
  const readMins = s => Math.max(1, Math.round(String(s || '').split(/\s+/).length / 200));

  function sectionHead(n, kicker, title, sub) {
    return `<div class="sec-head"><div class="sec-kicker"><b>${String(n).padStart(2, '0')}</b>${esc(kicker)}</div><h2>${esc(title)}</h2>${sub ? `<p>${esc(sub)}</p>` : ''}</div>`;
  }
  function filesHtml(list) {
    list = (list || []).filter(f => has(f.url));
    if (!list.length) return '';
    return `<div class="files">${list.map(f => `<a href="${url(f.url)}" target="_blank" rel="noopener">${icon('file')}${esc(f.label || 'Berkas')} <small>${esc((f.url.split('.').pop() || '').toUpperCase().slice(0, 4))}</small></a>`).join('')}</div>`;
  }
  function tagsHtml(t) { return has(t) ? `<div class="tags">${t.map(x => `<span>${esc(x)}</span>`).join('')}</div>` : ''; }

  function socialLinks(s) {
    const L = [];
    if (has(s.linkedin)) L.push(['linkedin', 'LinkedIn', url(s.linkedin)]);
    if (has(s.instagram)) L.push(['instagram', 'Instagram', url(s.instagram)]);
    if (has(s.whatsapp)) L.push(['whatsapp', 'WhatsApp', 'https://wa.me/' + esc(String(s.whatsapp).replace(/\D/g, '').replace(/^0/, '62'))]);
    if (has(s.email)) L.push(['mail', 'Email', 'mailto:' + esc(s.email)]);
    if (has(s.scholar)) L.push(['scholar', 'Google Scholar', url(s.scholar)]);
    if (has(s.github)) L.push(['github', 'GitHub', url(s.github)]);
    return L;
  }

  /* ---------- sections ---------- */
  const S = {};
  S.hero = d => {
    const p = d.profile || {}, links = socialLinks(d.socials || {});
    const pill = (has(p.status) || has(p.location)) ? `<div class="pill">${has(p.status) ? `<span class="dot"></span>${esc(p.status)}` : ''}${has(p.status) && has(p.location) ? '<span class="sep"></span>' : ''}${has(p.location) ? `${icon('pin').replace('<svg', '<svg width="15" height="15"')}${esc(p.location)}` : ''}</div>` : '';
    const mq = (p.marquee || []).filter(Boolean);
    return `<section class="hero" id="top"><div class="container" style="width:min(1120px,100% - 40px)">
      <div class="hero-grid"><div>
        ${pill}
        <p class="eyebrow">${esc(p.greeting || 'HALO, SAYA')}</p>
        <h1>${esc(p.name)}</h1>
        ${has(p.headline) ? `<p class="headline">${esc(p.headline)}</p>` : ''}
        ${has(p.quote) ? `<blockquote>${esc(p.quote)}</blockquote>` : ''}
        <div class="actions">
          <a class="btn btn-primary" href="#contact">${icon('send')}Hubungi Saya</a>
          ${has(p.cvUrl) ? `<a class="btn btn-ghost" href="${url(p.cvUrl)}" target="_blank" rel="noopener">${icon('download')}Unduh CV</a>` : ''}
        </div>
        ${links.length ? `<div class="socials">${links.map(([i, l, h]) => `<a href="${h}" target="_blank" rel="noopener">${icon(i)}${l}</a>`).join('')}</div>` : ''}
      </div>
      <div class="photo-card">
        ${has(p.photo) ? `<img src="${url(p.photo)}" alt="${esc(p.name)}">` : `<div class="ph">${esc(initials(p.name))}</div>`}
        ${has(p.photoCaption) ? `<div class="photo-cap"><strong>${esc(p.name)}</strong><span>${esc(p.photoCaption)}</span></div>` : ''}
      </div></div>
      ${mq.length ? `<div class="marquee"><div class="marquee-track">${[...mq, ...mq].map(x => `<span>${esc(x)}</span>`).join('')}</div></div>` : ''}
    </div></section>`;
  };

  const SECTIONS = [
    { id: 'about', nav: 'Tentang', kicker: 'PROFIL', title: 'Tentang Saya', show: d => has(d.about?.paragraphs) || has(d.about?.lead), render: d => {
      const a = d.about; const hl = (a.highlights || []).filter(h => has(h.value) || has(h.label));
      return `<div class="about-grid"><div class="body">${has(a.lead) ? `<p class="lead">${esc(a.lead)}</p>` : ''}${(a.paragraphs || []).map(p => `<p>${esc(p)}</p>`).join('')}</div>
        ${hl.length ? `<div class="highlights">${hl.map(h => `<div class="card"><strong>${esc(h.value)}</strong><span class="muted">${esc(h.label)}</span></div>`).join('')}</div>` : ''}</div>`; } },
    { id: 'experience', nav: 'Pengalaman', kicker: 'PERJALANAN', title: 'Pengalaman', sub: 'Peran akademik, organisasi, dan kegiatan yang membentuk cara saya bekerja.', show: d => has(d.experience), render: d =>
      `<div class="timeline">${d.experience.map(e => `<article class="card tl-item ${has(e.image) ? '' : 'noimg'}">
        ${has(e.image) ? `<img src="${url(e.image)}" alt="" loading="lazy">` : ''}
        <div class="tl-body"><div class="tl-head">${has(e.logo) ? `<img class="logo" src="${url(e.logo)}" alt="">` : ''}<div>
          <div class="meta">${esc(e.period)}</div><h3>${esc(e.title)}</h3>
          <div class="tl-org">${esc(e.org)}${has(e.orgNote) ? ` <span class="muted">· ${esc(e.orgNote)}</span>` : ''}</div></div></div>
          ${has(e.description) ? `<p class="desc clamp">${esc(e.description)}</p><button class="more" data-more>Selengkapnya ▾</button>` : ''}
          ${tagsHtml(e.tags)}${filesHtml(e.files)}
        </div></article>`).join('')}</div>` },
    { id: 'projects', nav: 'Proyek', kicker: 'KARYA', title: 'Proyek', sub: 'Riset, kajian, dan karya yang pernah saya kerjakan.', show: d => has(d.projects), render: d => {
      const cats = [...new Set(d.projects.map(p => p.category).filter(Boolean))];
      return `${cats.length > 1 ? `<div class="filters" data-filters><button class="on" data-cat="">Semua</button>${cats.map(c => `<button data-cat="${esc(c)}">${esc(c)}</button>`).join('')}</div>` : ''}
      <div class="grid-3">${d.projects.map(p => `<article class="card proj" data-cat="${esc(p.category)}">
        ${has(p.image) ? `<img src="${url(p.image)}" alt="" loading="lazy">` : ''}
        <div class="in"><div class="meta">${esc(p.year)}${has(p.category) ? ' · ' + esc(p.category) : ''}</div><h3>${esc(p.title)}</h3><p>${esc(p.description)}</p>${tagsHtml(p.tags)}
        ${has(p.link) ? `<a class="link" href="${url(p.link)}" target="_blank" rel="noopener">${esc(p.link)}</a>` : ''}</div></article>`).join('')}</div>`; } },
    { id: 'publications', nav: 'Publikasi', kicker: 'RISET', title: 'Publikasi', sub: 'Karya ilmiah, artikel jurnal, dan presentasi konferensi.', show: d => has(d.publications), render: d =>
      d.publications.map(p => `<article class="card pub"><div class="row">${has(p.role) ? `<span class="badge">${esc(p.role)}</span>` : ''}<span class="meta">${esc(p.date)}</span></div>
        <h3>${esc(p.title)}</h3><div class="muted">${esc(p.venue)}</div>
        ${has(p.abstract) ? `<details><summary>Baca abstrak</summary><p>${esc(p.abstract)}</p></details>` : ''}
        ${has(p.link) ? `<div class="actions" style="margin-top:18px"><a class="btn btn-ghost" href="${url(p.link)}" target="_blank" rel="noopener">${icon('ext')}Baca publikasi</a></div>` : ''}</article>`).join('') },
    { id: 'skills', nav: 'Keahlian', kicker: 'KOMPETENSI', title: 'Keahlian', sub: 'Metode dan perangkat yang saya pakai.', show: d => has(d.skills), render: d =>
      `<div class="grid-3">${d.skills.map(g => `<div class="card skill-group"><h3>${esc(g.group)}</h3><div class="chips">${(g.items || []).map(x => `<span>${esc(x)}</span>`).join('')}</div></div>`).join('')}</div>` },
    { id: 'certifications', nav: 'Sertifikasi', kicker: 'KREDENSIAL', title: 'Sertifikasi', sub: 'Sertifikat dan kredensial profesional.', show: d => has(d.certifications), render: d =>
      `<div class="grid-3">${d.certifications.map(c => `<div class="card cert"><h3>${esc(c.name)}</h3><span class="muted">${esc(c.issuer)}${has(c.year) ? ' • ' + esc(c.year) : ''}</span>
        ${has(c.score) ? `<span class="score">${esc(c.score)}</span>` : ''}${has(c.url) ? `<a href="${url(c.url)}" target="_blank" rel="noopener">Lihat kredensial →</a>` : ''}</div>`).join('')}</div>` },
    { id: 'education', nav: '', kicker: 'PENDIDIKAN', title: 'Pendidikan', sub: 'Jenjang pendidikan formal.', show: d => has(d.education), render: d =>
      `<div class="timeline">${d.education.map(e => `<article class="card tl-item noimg"><div class="tl-body">
        <div class="row" style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">${has(e.badge) ? `<span class="badge">${esc(e.badge)}</span>` : ''}<span class="meta">${esc(e.period)}</span></div>
        <h3>${esc(e.degree)}</h3><div class="tl-org">${esc(e.school)}</div>
        ${has(e.description) ? `<p class="desc">${esc(e.description)}</p>` : ''}${filesHtml(e.files)}</div></article>`).join('')}</div>` },
    { id: 'volunteering', nav: '', kicker: 'KONTRIBUSI', title: 'Kesukarelawanan', sub: 'Kegiatan sosial di luar ruang kelas.', show: d => has(d.volunteering), render: d =>
      `<div class="grid-2">${d.volunteering.map(v => `<div class="card" style="padding:24px"><div class="meta">${esc(v.period)}</div><h3 style="margin:6px 0 2px">${esc(v.title)}</h3><div class="tl-org">${esc(v.org)}</div>${has(v.description) ? `<p class="muted" style="margin-top:10px">${esc(v.description)}</p>` : ''}</div>`).join('')}</div>` },
    { id: 'gallery', nav: 'Galeri', kicker: 'DOKUMENTASI', title: 'Galeri', sub: 'Foto kegiatan dan momen yang sempat terekam.', show: d => has(d.gallery), render: d =>
      `<div class="gallery">${d.gallery.filter(g => has(g.image)).map(g => `<figure data-zoom="${url(g.image)}"><img src="${url(g.image)}" alt="${esc(g.caption)}" loading="lazy">${has(g.caption) ? `<figcaption>${esc(g.caption)}</figcaption>` : ''}</figure>`).join('')}</div>` },
    { id: 'blog', nav: 'Blog', kicker: 'TULISAN', title: 'Blog', sub: 'Catatan tentang hal-hal yang saya lalui dan pelajari.', show: d => has(d.posts), render: d => {
      const posts = sortPosts(d.posts).slice(0, 3);
      return `<div class="grid-3">${posts.map(postCard).join('')}</div>${d.posts.length > 3 ? `<div class="actions"><a class="btn btn-ghost" href="blog.html">Lihat semua tulisan</a></div>` : ''}`; } },
    { id: 'contact', nav: 'Kontak', kicker: 'KONTAK', title: 'Mari Terhubung', sub: '', show: () => true, render: d => {
      const s = d.socials || {}, c = d.contact || {};
      const items = [];
      if (has(s.email)) items.push(['mail', 'Email', s.email, 'mailto:' + esc(s.email)]);
      if (has(s.phone)) items.push(['phone', 'Telepon', s.phone, 'tel:' + esc(String(s.phone).replace(/[^\d+]/g, ''))]);
      socialLinks(s).filter(l => l[0] !== 'mail').forEach(([i, l, h]) => items.push([i, l, i === 'whatsapp' ? 'Chat langsung' : decodeURI(h.replace(/^https?:\/\/(www\.)?/, '')).replace(/&amp;/g, '&'), h]));
      return `<div class="contact-grid"><div><p class="muted" style="font-size:1.1rem">${esc(c.intro)}</p>
        ${has(s.email) ? `<div class="actions"><a class="btn btn-primary" href="mailto:${esc(s.email)}">${icon('send')}Kirim Email</a></div>` : ''}
        ${has(c.services) ? `<div class="card services"><div class="meta" style="margin-bottom:12px">Layanan yang ditawarkan</div><div class="chips">${c.services.map(x => `<span>${esc(x)}</span>`).join('')}</div></div>` : ''}</div>
        <div class="contact-list">${items.map(([i, l, v, h]) => `<a class="card contact-item" href="${h}" target="_blank" rel="noopener">${icon(i)}<div><small>${esc(l)}</small><span>${esc(v)}</span></div></a>`).join('') || '<p class="muted">Kontak belum diisi.</p>'}</div></div>`; } }
  ];

  function sortPosts(p) { return [...p].sort((a, b) => String(b.date).localeCompare(String(a.date))); }
  function postCard(p) {
    return `<a class="card post-card ${has(p.cover) ? 'has-cover' : ''}" href="blog.html?p=${encodeURIComponent(p.slug)}">
      ${has(p.cover) ? `<img src="${url(p.cover)}" alt="" loading="lazy">` : ''}<div class="in">
      <div class="meta">${esc(fmtDate(p.date))} · ${readMins(p.body)} menit baca</div><h3>${esc(p.title)}</h3>${has(p.excerpt) ? `<p>${esc(p.excerpt)}</p>` : ''}<span class="go">Baca tulisan →</span></div></a>`;
  }

  /* ---------- chrome ---------- */
  function chrome(d, onHome) {
    const p = d.profile || {}, site = d.site || {};
    document.title = site.title || p.name || 'Portofolio';
    const md = document.querySelector('meta[name=description]'); if (md) md.content = site.description || '';
    document.getElementById('brand').innerHTML = `${has(p.photo) ? `<img class="avatar" src="${url(p.photo)}" alt="">` : `<span class="avatar">${esc(initials(p.name))}</span>`}${esc(site.navName || p.name)}`;
    document.getElementById('brand').href = onHome ? '#top' : './';
    const pre = onHome ? '' : './';
    document.getElementById('navLinks').innerHTML = SECTIONS.filter(s => s.nav && s.show(d)).map(s =>
      s.id === 'blog' ? `<a href="blog.html">Blog</a>` : `<a href="${pre}#${s.id}" data-sec="${s.id}">${s.nav}</a>`).join('');
    document.getElementById('footer').innerHTML = `© ${new Date().getFullYear()} ${esc(p.name)}`;

    const mb = document.getElementById('menuBtn'), nl = document.getElementById('navLinks');
    mb.innerHTML = icon('menu'); mb.onclick = () => nl.classList.toggle('open');
    nl.addEventListener('click', e => { if (e.target.tagName === 'A') nl.classList.remove('open'); });
    const tb = document.getElementById('themeBtn');
    const setIcon = () => tb.innerHTML = icon(document.documentElement.dataset.theme === 'dark' ? 'moon' : 'sun');
    setIcon(); tb.onclick = () => { const t = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; document.documentElement.dataset.theme = t; localStorage.setItem('theme', t); setIcon(); };
    const tt = document.getElementById('toTop'); tt.innerHTML = icon('up');
    tt.onclick = () => scrollTo({ top: 0 }); addEventListener('scroll', () => tt.classList.toggle('show', scrollY > 600), { passive: true });
  }

  function wire() {
    document.querySelectorAll('[data-more]').forEach(b => {
      const p = b.previousElementSibling;
      if (p.scrollHeight <= p.clientHeight + 2) { b.remove(); return; }
      b.onclick = () => { const o = p.classList.toggle('clamp'); b.textContent = o ? 'Selengkapnya ▾' : 'Tutup ▴'; };
    });
    document.querySelectorAll('[data-filters]').forEach(f => f.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      f.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b));
      f.nextElementSibling.querySelectorAll('[data-cat]').forEach(c => c.classList.toggle('hidden', !!b.dataset.cat && c.dataset.cat !== b.dataset.cat));
    }));
    document.querySelectorAll('[data-zoom]').forEach(f => f.onclick = () => {
      const lb = document.createElement('div'); lb.className = 'lightbox'; lb.innerHTML = `<img src="${f.dataset.zoom}" alt="">`;
      lb.onclick = () => lb.remove(); document.body.appendChild(lb);
    });
    const links = [...document.querySelectorAll('#navLinks a[data-sec]')];
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) links.forEach(a => a.classList.toggle('active', a.dataset.sec === e.target.id)); }), { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('section.block').forEach(s => io.observe(s));
  }

  /* ---------- blog page ---------- */
  function renderBlog(d) {
    const app = document.getElementById('blogApp');
    const slug = new URLSearchParams(location.search).get('p');
    const posts = sortPosts(d.posts || []);
    if (slug) {
      const p = posts.find(x => x.slug === slug);
      if (!p) { app.innerHTML = `<div class="article"><h1>Tulisan tidak ditemukan</h1><a href="blog.html">← Semua tulisan</a></div>`; return; }
      document.title = `${p.title} | ${d.profile?.name || ''}`;
      const html = window.marked ? marked.parse(p.body || '') : esc(p.body).replace(/\n/g, '<br>');
      app.innerHTML = `<article class="article container"><a href="blog.html">← Semua tulisan</a>
        <div class="meta" style="margin-top:28px">${esc(fmtDate(p.date))} · ${readMins(p.body)} menit baca</div><h1>${esc(p.title)}</h1>
        ${has(p.cover) ? `<img class="cover" src="${url(p.cover)}" alt="">` : ''}<div class="prose">${window.DOMPurify ? DOMPurify.sanitize(html) : html}</div></article>`;
    } else {
      document.title = `Blog | ${d.profile?.name || ''}`;
      app.innerHTML = `<section class="block container" style="padding-top:140px">${sectionHead(10, 'TULISAN', 'Blog', 'Semua tulisan.')}
        ${posts.length ? `<div class="grid-3">${posts.map(postCard).join('')}</div>` : '<p class="muted">Belum ada tulisan.</p>'}</section>`;
    }
  }

  /* ---------- boot ---------- */
  const OBJ = ['site', 'profile', 'socials', 'about', 'contact'];
  const LIST = ['experience', 'projects', 'publications', 'skills', 'certifications', 'education', 'volunteering', 'gallery', 'posts'];
  const slugify = s => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80);
  const v = Date.now();
  const load = k => fetch(`${BASE}data/${k}.json?v=${v}`).then(r => r.ok ? r.json() : null).catch(() => null);
  Promise.all([...OBJ, ...LIST].map(load)).then(res => {
    const d = {};
    OBJ.forEach((k, i) => d[k] = res[i] || {});
    LIST.forEach((k, i) => { const r = res[OBJ.length + i]; d[k] = Array.isArray(r) ? r : (r && Array.isArray(r.items) ? r.items : []); });
    if (!d.profile.name) throw new Error('data/profile.json tidak terbaca');
    d.posts.forEach(p => { if (!p.slug) p.slug = slugify(p.title); });
    return d;
  }).then(d => {
    chrome(d, !IS_BLOG);
    if (IS_BLOG) return renderBlog(d);
    let n = 0;
    document.getElementById('app').innerHTML = S.hero(d) + SECTIONS.filter(s => s.show(d)).map(s =>
      `<section class="block" id="${s.id}"><div class="container">${sectionHead(++n, s.kicker, s.title, s.sub)}${s.render(d)}</div></section>`).join('');
    wire();
    if (location.hash) document.querySelector(location.hash)?.scrollIntoView();
  }).catch(err => {
    document.getElementById(IS_BLOG ? 'blogApp' : 'app').innerHTML = `<div class="container" style="padding:160px 0"><h1>Gagal memuat konten</h1><p class="muted">${esc(err.message)}</p></div>`;
  });
})();
