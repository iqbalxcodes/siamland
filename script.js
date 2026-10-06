// Tambah bahasa: buat lang/<kode>.html, tambah kode ke LANGS + UI.
const LANGS = ['id'];
const UI = { id: { contents: 'Daftar isi', intro: '(Awal)' } };

const q = new URLSearchParams(location.search).get('lang');
const L = LANGS.includes(q) ? q : LANGS[0];
document.documentElement.lang = L;

document.getElementById('langs').innerHTML = LANGS
  .map(l => `<a href="?lang=${l}">${l.toUpperCase()}</a>`).join('');

// Butuh server (fetch tidak jalan di file://). Codespaces: Live Server / python3 -m http.server
fetch(`lang/${L}.html`)
  .then(r => r.text())
  .then(html => {
    const c = document.getElementById('content');
    c.innerHTML = html;
    document.title = c.querySelector('h1').textContent + ' – Siamlandpedia';
    buildToc(c);
    if (location.hash) document.querySelector(location.hash)?.scrollIntoView();
  });

function buildToc(c) {
  const toc = document.getElementById('toc');
  let out = `<b>${UI[L].contents}</b><ul><li><a href="#title">${UI[L].intro}</a></li>`;
  let sub = false;
  c.querySelectorAll('h2, h3').forEach(h => {
    if (h.tagName === 'H3' && !sub) { out += '<ul>'; sub = true; }
    if (h.tagName === 'H2' && sub) { out += '</ul>'; sub = false; }
    out += `<li><a href="#${h.id}">${h.textContent}</a></li>`;
  });
  toc.innerHTML = out + (sub ? '</ul>' : '') + '</ul>';

  // Sorot bagian yang sedang dibaca
  const links = [...toc.querySelectorAll('a')];
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    links.forEach(a => a.classList.toggle('active', a.hash === '#' + e.target.id));
  }), { rootMargin: '-56px 0px -75% 0px' });
  c.querySelectorAll('h1, h2, h3').forEach(h => io.observe(h));
}