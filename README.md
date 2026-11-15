# Portofolio — Wisnu Aji Dewantoro

Situs portofolio statis untuk GitHub Pages, lengkap dengan panel admin.

- Situs: `https://wisnuajidewantoro8-rgb.github.io/PORTOFOLIO-/`
- Panel admin: `https://wisnuajidewantoro8-rgb.github.io/PORTOFOLIO-/admin/`

## Cara kerja
Isi situs ada di `data/*.json` (satu file per bagian). Panel admin memakai [Sveltia CMS](https://sveltiacms.app)
(`admin/config.yml`): menyimpan perubahan dan unggahan (`assets/uploads/`) langsung sebagai commit ke `main`,
lalu GitHub Pages memperbarui situs (±1 menit). Bagian yang kosong otomatis disembunyikan.

## Masuk ke panel admin
Panel admin memakai **fine-grained personal access token**:

1. Buka https://github.com/settings/personal-access-tokens/new
2. Repository access → *Only select repositories* → pilih `PORTOFOLIO-`
3. Permissions → Repository permissions → **Contents: Read and write**
4. Generate, salin token. Di halaman admin klik **Sign In Using Access Token**, tempel token.

Token hanya disimpan di browser yang dipakai. Halaman admin bisa dibuka siapa saja, tapi tanpa token
tidak bisa mengubah apa pun.

## Struktur
| Berkas | Isi |
|---|---|
| `index.html`, `blog.html` | Halaman situs |
| `assets/css/site.css`, `assets/js/site.js` | Tampilan dan render konten |
| `data/*.json` | Isi portofolio per bagian |
| `assets/uploads/` | Foto dan berkas yang diunggah lewat admin |
| `admin/index.html`, `admin/config.yml` | Panel admin Sveltia CMS |
