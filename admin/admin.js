/* Panel admin portofolio — menyimpan data/content.json dan berkas unggahan langsung ke GitHub lewat API. */
(function () {
  const CONTENT_PATH = 'data/content.json';
  const UPLOAD_DIR = 'assets/uploads';
  const $ = s => document.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------- skema editor ---------- */
  const FILES = { k: 'files', label: 'Berkas terkait', type: 'list', titleKey: 'label', fields: [
    { k: 'label', label: 'Nama berkas', type: 'text' }, { k: 'url', label: 'Berkas / tautan', type: 'file' }] };

  const TABS = [
    { id: 'profile', label: 'Profil & Hero', type: 'object', desc: 'Bagian paling atas halaman.', fields: [
      { k: 'name', label: 'Nama lengkap', type: 'text' },
      { k: 'greeting', label: 'Sapaan kecil di atas nama', type: 'text', hint: 'mis. HALO, SAYA' },
      { k: 'headline', label: 'Kalimat utama', type: 'textarea' },
      { k: 'quote', label: 'Kutipan (huruf miring)', type: 'textarea' },
      { k: 'status', label: 'Status', type: 'text', hint: 'mis. Terbuka untuk kolaborasi riset. Kosongkan untuk menyembunyikan.' },
      { k: 'location', label: 'Lokasi', type: 'text' },
      { k: 'photo', label: 'Foto profil', type: 'image' },
      { k: 'photoCaption', label: 'Keterangan di bawah foto', type: 'text' },
      { k: 'cvUrl', label: 'CV (PDF)', type: 'file', hint: 'Tombol "Unduh CV" muncul kalau diisi.' },
      { k: 'marquee', label: 'Kata kunci berjalan', type: 'tags' }] },
    { id: 'about', label: 'Tentang', type: 'object', fields: [
      { k: 'lead', label: 'Kalimat pembuka (tebal)', type: 'text' },
      { k: 'paragraphs', label: 'Paragraf', type: 'lines' },
      { k: 'highlights', label: 'Angka sorotan', type: 'list', titleKey: 'label', hint: 'mis. 18 / informan diwawancarai', fields: [
        { k: 'value', label: 'Angka / nilai', type: 'text' }, { k: 'label', label: 'Keterangan', type: 'text' }] }] },
    { id: 'experience', label: 'Pengalaman', type: 'list', titleKey: 'title', fields: [
      { k: 'period', label: 'Periode', type: 'text', hint: 'mis. MAR 2026 - SEKARANG' },
      { k: 'title', label: 'Jabatan / peran / penghargaan', type: 'text' },
      { k: 'org', label: 'Instansi / penyelenggara', type: 'text' },
      { k: 'orgNote', label: 'Keterangan tambahan', type: 'text' },
      { k: 'logo', label: 'Logo instansi', type: 'image' },
      { k: 'image', label: 'Foto / sertifikat', type: 'image' },
      { k: 'description', label: 'Deskripsi', type: 'textarea' },
      { k: 'tags', label: 'Label', type: 'tags' }, FILES] },
    { id: 'projects', label: 'Proyek', type: 'list', titleKey: 'title', fields: [
      { k: 'year', label: 'Tahun', type: 'text' },
      { k: 'title', label: 'Judul', type: 'text' },
      { k: 'category', label: 'Kategori', type: 'text', hint: 'Dipakai sebagai tombol filter.' },
      { k: 'description', label: 'Deskripsi', type: 'textarea' },
      { k: 'image', label: 'Gambar', type: 'image' },
      { k: 'link', label: 'Tautan', type: 'url' },
      { k: 'tags', label: 'Label', type: 'tags' }] },
    { id: 'publications', label: 'Publikasi', type: 'list', titleKey: 'title', fields: [
      { k: 'role', label: 'Peran', type: 'text', hint: 'mis. Penulis Utama' },
      { k: 'date', label: 'Tanggal terbit', type: 'text' },
      { k: 'title', label: 'Judul', type: 'textarea' },
      { k: 'venue', label: 'Jurnal / konferensi', type: 'text' },
      { k: 'abstract', label: 'Abstrak', type: 'textarea' },
      { k: 'link', label: 'Tautan / DOI', type: 'url' }] },
    { id: 'skills', label: 'Keahlian', type: 'list', titleKey: 'group', fields: [
      { k: 'group', label: 'Nama kelompok', type: 'text' }, { k: 'items', label: 'Keahlian', type: 'tags' }] },
    { id: 'certifications', label: 'Sertifikasi', type: 'list', titleKey: 'name', fields: [
      { k: 'name', label: 'Nama sertifikat', type: 'text' },
      { k: 'issuer', label: 'Penerbit', type: 'text' },
      { k: 'year', label: 'Tahun', type: 'text' },
      { k: 'score', label: 'Skor (opsional)', type: 'text', hint: 'mis. skor TOEFL' },
      { k: 'url', label: 'Kredensial / berkas', type: 'file' }] },
    { id: 'education', label: 'Pendidikan', type: 'list', titleKey: 'degree', fields: [
      { k: 'degree', label: 'Jenjang & program studi', type: 'text' },
      { k: 'school', label: 'Institusi', type: 'text' },
      { k: 'period', label: 'Periode', type: 'text' },
      { k: 'badge', label: 'Label kecil', type: 'text', hint: 'mis. Lulus, Sedang berjalan' },
      { k: 'description', label: 'Keterangan', type: 'textarea' }, FILES] },
    { id: 'volunteering', label: 'Kesukarelawanan', type: 'list', titleKey: 'title', fields: [
      { k: 'title', label: 'Kegiatan', type: 'text' }, { k: 'org', label: 'Organisasi', type: 'text' },
      { k: 'period', label: 'Periode', type: 'text' }, { k: 'description', label: 'Deskripsi', type: 'textarea' }] },
    { id: 'gallery', label: 'Galeri', type: 'list', titleKey: 'caption', fields: [
      { k: 'image', label: 'Foto', type: 'image' }, { k: 'caption', label: 'Keterangan', type: 'text' }] },
    { id: 'posts', label: 'Blog', type: 'list', titleKey: 'title', desc: 'Isi tulisan memakai Markdown: **tebal**, *miring*, ## Subjudul, - daftar, [tautan](https://...).', fields: [
      { k: 'title', label: 'Judul', type: 'text' },
      { k: 'slug', label: 'Alamat (slug)', type: 'text', hint: 'Otomatis dari judul bila kosong.' },
      { k: 'date', label: 'Tanggal', type: 'date' },
      { k: 'cover', label: 'Gambar sampul', type: 'image' },
      { k: 'excerpt', label: 'Ringkasan', type: 'textarea' },
      { k: 'body', label: 'Isi tulisan', type: 'markdown' }] },
    { id: 'socials', label: 'Kontak & Sosial', type: 'object', desc: 'Kosongkan yang tidak ingin ditampilkan. Semua yang diisi akan terlihat publik.', fields: [
      { k: 'email', label: 'Email', type: 'text' },
      { k: 'phone', label: 'Telepon', type: 'text' },
      { k: 'whatsapp', label: 'Nomor WhatsApp', type: 'text', hint: 'mis. 0812xxxx' },
      { k: 'linkedin', label: 'LinkedIn', type: 'url' },
      { k: 'instagram', label: 'Instagram', type: 'url' },
      { k: 'scholar', label: 'Google Scholar', type: 'url' },
      { k: 'github', label: 'GitHub', type: 'url' }] },
    { id: 'contact', label: 'Bagian Kontak', type: 'object', fields: [
      { k: 'intro', label: 'Kalimat ajakan', type: 'textarea' },
      { k: 'services', label: 'Layanan yang ditawarkan', type: 'tags' }] },
    { id: 'site', label: 'Pengaturan Situs', type: 'object', fields: [
      { k: 'title', label: 'Judul tab browser', type: 'text' },
      { k: 'description', label: 'Deskripsi untuk mesin pencari', type: 'textarea' },
      { k: 'navName', label: 'Nama di navbar', type: 'text' }] }
  ];

  /* ---------- state ---------- */
  let cfg = null, data = null, sha = null, current = TABS[0].id, dirty = false;
  const markDirty = () => { dirty = true; $('#dirty').classList.remove('hidden'); };
  addEventListener('beforeunload', e => { if (dirty) { e.preventDefault(); e.returnValue = ''; } });

  function toast(msg, kind = '') {
    const t = $('#toast'); t.textContent = msg; t.className = 'toast show ' + kind;
    clearTimeout(t._h); t._h = setTimeout(() => t.className = 'toast', kind === 'bad' ? 7000 : 3500);
  }

  /* ---------- GitHub API ---------- */
  async function gh(path, opts = {}) {
    const r = await fetch(`https://api.github.com/repos/${cfg.owner}/${cfg.repo}${path}`, {
      ...opts, headers: { Authorization: `Bearer ${cfg.token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', ...(opts.headers || {}) }
    });
    const j = r.status === 204 ? {} : await r.json().catch(() => ({}));
    if (!r.ok) { const e = new Error(j.message || `HTTP ${r.status}`); e.status = r.status; throw e; }
    return j;
  }
  const b64FromBytes = bytes => { let s = ''; for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000)); return btoa(s); };
  const b64FromText = t => b64FromBytes(new TextEncoder().encode(t));
  const textFromB64 = b => new TextDecoder().decode(Uint8Array.from(atob(b.replace(/\s/g, '')), c => c.charCodeAt(0)));
  const encPath = p => p.split('/').map(encodeURIComponent).join('/');

  async function loadContent() {
    const j = await gh(`/contents/${CONTENT_PATH}?ref=${encodeURIComponent(cfg.branch)}`);
    sha = j.sha; return JSON.parse(textFromB64(j.content));
  }
  async function putFile(path, b64, message, fileSha) {
    return gh(`/contents/${encPath(path)}`, { method: 'PUT', body: JSON.stringify({ message, content: b64, branch: cfg.branch, ...(fileSha ? { sha: fileSha } : {}) }) });
  }

  /* ---------- unggah ---------- */
  async function shrinkImage(file) {
    if (!/^image\/(jpeg|webp|png)$/.test(file.type) || file.size < 400 * 1024) return file;
    const img = await createImageBitmap(file).catch(() => null); if (!img) return file;
    const max = 1800, sc = Math.min(1, max / Math.max(img.width, img.height));
    if (file.type === 'image/png' && sc === 1 && file.size < 1.5 * 1024 * 1024) return file;
    const c = document.createElement('canvas'); c.width = Math.round(img.width * sc); c.height = Math.round(img.height * sc);
    const ctx = c.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height); ctx.drawImage(img, 0, 0, c.width, c.height);
    const blob = await new Promise(r => c.toBlob(r, 'image/jpeg', .85));
    return blob && blob.size < file.size ? new File([blob], file.name.replace(/\.\w+$/, '') + '.jpg', { type: 'image/jpeg' }) : file;
  }
  async function upload(file) {
    if (file.size > 25 * 1024 * 1024) throw new Error('Berkas lebih dari 25 MB.');
    file = await shrinkImage(file);
    const safe = file.name.toLowerCase().replace(/[^a-z0-9.\-_]+/g, '-').replace(/-+/g, '-').slice(-60);
    const path = `${UPLOAD_DIR}/${Date.now()}-${safe}`;
    const bytes = new Uint8Array(await file.arrayBuffer());
    await putFile(path, b64FromBytes(bytes), `Unggah ${safe} via panel admin`);
    return path;
  }

  /* ---------- render field ---------- */
  const preview = v => !v ? '' : /^https?:/i.test(v) ? v : '../' + v.replace(/^\.?\//, '');
  const slugify = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80);

  function field(obj, f, onTitle) {
    const wrap = document.createElement('div');
    const hint = f.hint ? ` <span class="hint">${esc(f.hint)}</span>` : '';
    const set = v => { obj[f.k] = v; markDirty(); if (onTitle) onTitle(); };

    if (['text', 'url', 'date', 'textarea', 'markdown'].includes(f.type)) {
      const multi = f.type === 'textarea' || f.type === 'markdown';
      wrap.innerHTML = `<label>${esc(f.label)}${hint}${multi ? `<textarea class="${f.type === 'markdown' ? 'md' : ''}"></textarea>` : `<input type="${f.type === 'date' ? 'date' : f.type === 'url' ? 'url' : 'text'}" ${f.type === 'url' ? 'placeholder="https://..."' : ''}>`}</label>`;
      const el = wrap.querySelector('input,textarea'); el.value = obj[f.k] ?? ''; el.oninput = () => set(el.value);
    }
    else if (f.type === 'image' || f.type === 'file') {
      const isImg = f.type === 'image';
      wrap.innerHTML = `<label>${esc(f.label)}${hint}</label><div class="media"><div class="thumb"></div><div class="col">
        <input type="text" placeholder="${isImg ? 'Unggah gambar atau tempel tautan' : 'Unggah berkas atau tempel tautan'}">
        <div class="row"><label class="btn sm">Unggah${isImg ? ' gambar' : ' berkas'}<input type="file" hidden ${isImg ? 'accept="image/*"' : ''}></label><button type="button" class="btn sm ghost danger">Hapus</button></div></div></div>`;
      const inp = wrap.querySelector('input[type=text]'), th = wrap.querySelector('.thumb'), fi = wrap.querySelector('input[type=file]');
      const draw = () => { const v = obj[f.k]; th.innerHTML = !v ? '—' : isImg ? `<img class="thumb" src="${esc(preview(v))}" alt="" onerror="this.replaceWith('baru')">` : `<a href="${esc(preview(v))}" target="_blank" rel="noopener">buka</a>`; };
      inp.value = obj[f.k] ?? ''; draw();
      inp.onchange = () => { set(inp.value.trim()); draw(); };
      wrap.querySelector('.danger').onclick = () => { inp.value = ''; set(''); draw(); };
      fi.onchange = async () => {
        const file = fi.files[0]; if (!file) return; fi.value = '';
        th.textContent = '…'; toast('Mengunggah ' + file.name + '…');
        try { const p = await upload(file); inp.value = p; set(p); draw(); toast('Berkas terunggah. Jangan lupa klik Simpan & Terbitkan.', 'ok'); }
        catch (e) { draw(); toast('Gagal mengunggah: ' + e.message, 'bad'); }
      };
    }
    else if (f.type === 'tags') {
      if (!Array.isArray(obj[f.k])) obj[f.k] = [];
      wrap.innerHTML = `<label>${esc(f.label)}${hint}<span class="hint">Ketik lalu tekan Enter atau koma.</span></label><div class="chips-edit"></div>`;
      const box = wrap.querySelector('.chips-edit');
      const draw = () => {
        box.innerHTML = obj[f.k].map((t, i) => `<span>${esc(t)}<button type="button" data-i="${i}" aria-label="hapus">×</button></span>`).join('') + '<input placeholder="Tambah…">';
        const inp = box.querySelector('input');
        inp.onkeydown = e => {
          if ((e.key === 'Enter' || e.key === ',') && inp.value.trim()) { e.preventDefault(); obj[f.k].push(inp.value.trim()); markDirty(); draw(); box.querySelector('input').focus(); }
          else if (e.key === 'Backspace' && !inp.value && obj[f.k].length) { obj[f.k].pop(); markDirty(); draw(); box.querySelector('input').focus(); }
        };
        inp.onblur = () => { if (inp.value.trim()) { obj[f.k].push(inp.value.trim()); markDirty(); draw(); } };
        box.querySelectorAll('button').forEach(b => b.onclick = () => { obj[f.k].splice(+b.dataset.i, 1); markDirty(); draw(); });
      };
      draw();
    }
    else if (f.type === 'lines') {
      if (!Array.isArray(obj[f.k])) obj[f.k] = [];
      wrap.innerHTML = `<label>${esc(f.label)}${hint}</label><div class="lines"></div><button type="button" class="btn sm" style="margin-top:8px">+ Tambah paragraf</button>`;
      const box = wrap.querySelector('.lines');
      const draw = () => {
        box.innerHTML = ''; obj[f.k].forEach((t, i) => {
          const row = document.createElement('div'); row.className = 'line';
          row.innerHTML = `<textarea></textarea><button type="button" class="btn sm ghost danger">×</button>`;
          const ta = row.querySelector('textarea'); ta.value = t; ta.oninput = () => { obj[f.k][i] = ta.value; markDirty(); };
          row.querySelector('button').onclick = () => { obj[f.k].splice(i, 1); markDirty(); draw(); };
          box.appendChild(row);
        });
      };
      wrap.querySelector(':scope > button').onclick = () => { obj[f.k].push(''); markDirty(); draw(); box.lastChild?.querySelector('textarea').focus(); };
      draw();
    }
    else if (f.type === 'list') {
      if (!Array.isArray(obj[f.k])) obj[f.k] = [];
      wrap.innerHTML = `<label>${esc(f.label)}${hint}</label>`;
      wrap.appendChild(listEditor(obj[f.k], f, true));
    }
    return wrap;
  }

  function listEditor(arr, spec, nested) {
    const box = document.createElement('div'); box.className = 'fields';
    const add = document.createElement('button'); add.type = 'button'; add.className = 'btn' + (nested ? ' sm' : ' primary');
    add.textContent = '+ Tambah ' + (nested ? '' : 'item baru');
    const draw = (openIdx = -1) => {
      box.innerHTML = '';
      if (!nested) box.appendChild(add);
      arr.forEach((it, i) => {
        const el = document.createElement('div'); el.className = 'item' + (i === openIdx ? ' open' : '');
        const title = () => esc(String(it[spec.titleKey] || '').replace(/\s+/g, ' ').slice(0, 120) || '(tanpa judul)');
        el.innerHTML = `<div class="item-head"><span class="chev">▶</span><strong>${title()}</strong>
          <button type="button" class="btn sm ghost" data-a="up" title="Naik">↑</button><button type="button" class="btn sm ghost" data-a="down" title="Turun">↓</button>
          <button type="button" class="btn sm ghost danger" data-a="del" title="Hapus">Hapus</button></div><div class="item-body"></div>`;
        const body = el.querySelector('.item-body');
        const upd = () => el.querySelector('strong').innerHTML = title();
        spec.fields.forEach(f => body.appendChild(field(it, f, f.k === spec.titleKey ? upd : null)));
        if (spec === TABS.find(t => t.id === 'posts')) body.querySelectorAll('input')[0].addEventListener('blur', () => {
          if (!it.slug && it.title) { it.slug = slugify(it.title); body.querySelectorAll('input')[1].value = it.slug; markDirty(); }
        });
        el.querySelector('.item-head').onclick = e => {
          const a = e.target.closest('[data-a]')?.dataset.a;
          if (!a) return el.classList.toggle('open');
          e.stopPropagation();
          if (a === 'del') { if (confirm('Hapus "' + (it[spec.titleKey] || 'item ini') + '"?')) { arr.splice(i, 1); markDirty(); draw(); } }
          else { const j = a === 'up' ? i - 1 : i + 1; if (j < 0 || j >= arr.length) return; [arr[i], arr[j]] = [arr[j], arr[i]]; markDirty(); draw(j); }
        };
        box.appendChild(el);
      });
      if (nested) box.appendChild(add);
    };
    add.onclick = () => {
      const blank = {}; spec.fields.forEach(f => blank[f.k] = ['tags', 'lines', 'list'].includes(f.type) ? [] : '');
      if (spec.fields.some(f => f.k === 'date' && f.type === 'date')) blank.date = new Date().toISOString().slice(0, 10);
      if (nested) { arr.push(blank); draw(arr.length - 1); } else { arr.unshift(blank); draw(0); }
      markDirty();
    };
    draw();
    return box;
  }

  /* ---------- halaman ---------- */
  function renderTabs() {
    $('#tabs').innerHTML = TABS.map(t => {
      const n = t.type === 'list' && Array.isArray(data[t.id]) ? `<small>${data[t.id].length}</small>` : '';
      return `<button data-t="${t.id}" class="${t.id === current ? 'on' : ''}">${esc(t.label)}${n}</button>`;
    }).join('');
    $('#tabs').querySelectorAll('button').forEach(b => b.onclick = () => { current = b.dataset.t; renderTabs(); renderEditor(); $('.side').classList.remove('open'); scrollTo(0, 0); });
  }
  function renderEditor() {
    const t = TABS.find(x => x.id === current); $('#secTitle').textContent = t.label;
    const ed = $('#editor'); ed.innerHTML = '';
    if (t.desc) { const p = document.createElement('p'); p.className = 'desc-box'; p.textContent = t.desc; ed.appendChild(p); }
    if (t.type === 'object') {
      if (!data[t.id] || typeof data[t.id] !== 'object') data[t.id] = {};
      const c = document.createElement('div'); c.className = 'card';
      t.fields.forEach(f => c.appendChild(field(data[t.id], f))); ed.appendChild(c);
    } else {
      if (!Array.isArray(data[t.id])) data[t.id] = [];
      if (current !== 'posts' && current !== 'gallery') { const p = document.createElement('p'); p.className = 'desc-box'; p.textContent = 'Urutan di sini = urutan di situs. Bagian ini otomatis tersembunyi di situs bila kosong.'; ed.appendChild(p); }
      ed.appendChild(listEditor(data[t.id], t, false));
    }
  }

  function validate() {
    const seen = new Set();
    for (const p of data.posts || []) {
      if (!p.slug) p.slug = slugify(p.title) || 'tulisan-' + Date.now();
      if (seen.has(p.slug)) throw new Error(`Slug blog "${p.slug}" dipakai lebih dari sekali.`);
      seen.add(p.slug);
    }
  }

  async function save() {
    const btn = $('#saveBtn'); btn.disabled = true; btn.textContent = 'Menyimpan…';
    try {
      validate();
      const json = JSON.stringify(data, null, 2) + '\n';
      const r = await putFile(CONTENT_PATH, b64FromText(json), 'Perbarui konten via panel admin', sha);
      sha = r.content.sha; dirty = false; $('#dirty').classList.add('hidden'); renderTabs();
      toast('Tersimpan. Situs akan diperbarui dalam ±1 menit.', 'ok');
    } catch (e) {
      toast(e.status === 409 ? 'Konten berubah di GitHub sejak dibuka. Unduh cadangan JSON, muat ulang halaman, lalu pulihkan.' : 'Gagal menyimpan: ' + e.message, 'bad');
    } finally { btn.disabled = false; btn.textContent = 'Simpan & Terbitkan'; }
  }

  /* ---------- login ---------- */
  function guessRepo() {
    const h = location.hostname.match(/^([^.]+)\.github\.io$/i);
    const seg = location.pathname.split('/').filter(Boolean);
    if (h) return { owner: h[1], repo: seg.length > 1 ? seg[0] : `${h[1]}.github.io` };
    return { owner: 'wisnuajidewantoro8-rgb', repo: 'PORTOFOLIO-' };
  }
  async function start(c) {
    cfg = c;
    const info = await gh('');
    if (!info.permissions?.push) throw new Error('Token tidak punya izin tulis (Contents: Read and write) untuk repo ini.');
    data = await loadContent();
    $('#repoName').textContent = `${cfg.owner}/${cfg.repo} · ${cfg.branch}`;
    $('#login').classList.add('hidden'); $('#app').classList.remove('hidden');
    renderTabs(); renderEditor();
  }

  const form = $('#loginForm'); const g = guessRepo();
  form.owner.value = g.owner; form.repo.value = g.repo;
  form.onsubmit = async e => {
    e.preventDefault(); $('#loginErr').textContent = '';
    const c = { owner: form.owner.value.trim(), repo: form.repo.value.trim(), branch: form.branch.value.trim() || 'main', token: form.token.value.trim() };
    const btn = form.querySelector('button'); btn.disabled = true;
    try {
      await start(c);
      (form.remember.checked ? localStorage : sessionStorage).setItem('pf-admin', JSON.stringify(c));
    } catch (err) {
      $('#loginErr').textContent = err.status === 401 ? 'Token tidak valid atau sudah kedaluwarsa.' : err.status === 404 ? 'Repo atau data/content.json tidak ditemukan, atau token tidak punya akses ke repo ini.' : err.message;
    } finally { btn.disabled = false; }
  };
  const saved = localStorage.getItem('pf-admin') || sessionStorage.getItem('pf-admin');
  if (saved) start(JSON.parse(saved)).catch(() => { localStorage.removeItem('pf-admin'); sessionStorage.removeItem('pf-admin'); $('#loginErr').textContent = 'Sesi berakhir, silakan masuk lagi.'; });

  /* ---------- tombol lain ---------- */
  $('#saveBtn').onclick = save;
  addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key === 's' && data) { e.preventDefault(); save(); } });
  $('#logoutBtn').onclick = () => { if (dirty && !confirm('Ada perubahan yang belum disimpan. Tetap keluar?')) return; dirty = false; localStorage.removeItem('pf-admin'); sessionStorage.removeItem('pf-admin'); location.reload(); };
  $('#menuBtn').onclick = () => $('.side').classList.toggle('open');
  $('#exportBtn').onclick = () => {
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
    a.download = `content-backup-${new Date().toISOString().slice(0, 10)}.json`; a.click();
  };
  $('#importInput').onchange = async e => {
    const f = e.target.files[0]; if (!f) return; e.target.value = '';
    try { const j = JSON.parse(await f.text()); if (!j.profile) throw new Error('Bukan berkas cadangan portofolio.'); data = j; markDirty(); renderTabs(); renderEditor(); toast('Cadangan dimuat. Klik Simpan & Terbitkan untuk menerapkan.', 'ok'); }
    catch (err) { toast('Gagal membaca JSON: ' + err.message, 'bad'); }
  };
})();
