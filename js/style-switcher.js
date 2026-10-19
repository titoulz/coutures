/* =========================================================
   DÉMO UNIQUEMENT — Sélecteur de style pour la présentation.
   En production : supprimer ce fichier et la balise <script>
   qui l'appelle dans index.html, puis garder le thème choisi
   dans <link id="theme-css">.

   Utilisation :
   - index.html?style=atelier  → ouvre directement un style
   - touches 1 à 5             → change de style
   - index.html?embed=1        → masque le panneau (aperçus)
   ========================================================= */
(function () {
  var THEMES = [
    { id: 'mineral',    name: 'Minéral',    desc: 'Sobre et architectural : pierre, anthracite, touche de sable', colors: ['#f6f4f0', '#1c1f22', '#b08d57'] },
    { id: 'terracotta', name: 'Terracotta', desc: 'Chaleureux et artisanal : crème, terre cuite, vert olive', colors: ['#fbf6ef', '#b9532c', '#6f7a45'] },
    { id: 'atelier',    name: 'Atelier',    desc: 'Industriel et brut : fond sombre, orange chantier', colors: ['#121212', '#f26a1b', '#f2f4f7'] },
    { id: 'prestige',   name: 'Prestige',   desc: 'Haut de gamme : noir, ivoire et or, typographie élégante', colors: ['#0e0e0e', '#c8a96a', '#f4efe6'] },
    { id: 'azur',       name: 'Azur',       desc: 'Frais et lumineux : blanc, bleu et turquoise, formes arrondies', colors: ['#ffffff', '#0d63b8', '#17b3c4'] }
  ];
  var KEY = 'demo-style';
  var params = new URLSearchParams(location.search);
  var embed = params.get('embed') === '1';

  function find(id) {
    for (var i = 0; i < THEMES.length; i++) if (THEMES[i].id === id) return i;
    return -1;
  }
  function stored() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }

  var current = find(params.get('style'));
  if (current < 0 && !embed) current = find(stored());
  if (current < 0) current = 0;

  function apply(index, updateUrl) {
    current = (index + THEMES.length) % THEMES.length;
    var theme = THEMES[current];
    var link = document.getElementById('theme-css');
    if (link) link.href = 'css/themes/' + theme.id + '.css';
    document.documentElement.setAttribute('data-theme', theme.id);
    if (!embed) { try { localStorage.setItem(KEY, theme.id); } catch (e) {} }
    if (updateUrl) {
      params.set('style', theme.id);
      history.replaceState(null, '', location.pathname + '?' + params.toString() + location.hash);
    }
    render();
  }

  // Applique le thème avant le premier affichage
  apply(current, false);
  if (embed) return;

  var panel, label;
  function render() {
    if (!panel) return;
    label.textContent = THEMES[current].name + ' (' + (current + 1) + '/' + THEMES.length + ')';
    panel.querySelectorAll('[data-style]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(btn.getAttribute('data-style') === THEMES[current].id));
    });
  }

  var css = [
    '.ss{position:fixed;left:16px;bottom:16px;z-index:9999;font:500 14px/1.35 system-ui,-apple-system,"Segoe UI",sans-serif;color:#f3f5f7;letter-spacing:0;text-transform:none}',
    '@media (max-width:767px){.ss{bottom:84px;left:12px}}',
    '.ss *{box-sizing:border-box}',
    '.ss__bar{display:flex;align-items:center;gap:4px;background:rgba(14,17,22,.92);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.14);border-radius:999px;padding:5px;box-shadow:0 12px 32px rgba(0,0,0,.35)}',
    '.ss button{font:inherit;color:inherit;background:none;border:0;cursor:pointer}',
    '.ss__nav{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;font-size:18px}',
    '.ss__nav:hover,.ss__toggle:hover{background:rgba(255,255,255,.12)}',
    '.ss__toggle{display:flex;align-items:center;gap:8px;padding:8px 14px;border-radius:999px;font-weight:600}',
    '.ss__dot{width:10px;height:10px;border-radius:50%;background:conic-gradient(#b08d57,#b9532c,#f26a1b,#c8a96a,#17b3c4,#b08d57)}',
    '.ss__panel{position:absolute;left:0;bottom:calc(100% + 10px);width:min(340px,calc(100vw - 24px));background:rgba(14,17,22,.96);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.14);border-radius:18px;padding:10px;box-shadow:0 20px 50px rgba(0,0,0,.45);display:none}',
    '.ss.is-open .ss__panel{display:block}',
    '.ss__title{font-size:11px;letter-spacing:.14em;text-transform:uppercase;opacity:.6;padding:6px 10px 8px}',
    '.ss__opt{display:flex;gap:12px;align-items:center;width:100%;text-align:left;padding:10px;border-radius:12px}',
    '.ss__opt:hover{background:rgba(255,255,255,.08)}',
    '.ss__opt[aria-pressed=true]{background:rgba(255,255,255,.14)}',
    '.ss__sw{display:flex;flex:none;border-radius:8px;overflow:hidden;border:1px solid rgba(255,255,255,.25)}',
    '.ss__sw i{display:block;width:12px;height:32px}',
    '.ss__name{font-weight:700;display:block}',
    '.ss__desc{font-size:12.5px;opacity:.7}',
    '.ss__key{margin-left:auto;font-size:11px;opacity:.5;border:1px solid rgba(255,255,255,.3);border-radius:5px;padding:1px 6px}',
    '.ss__all{display:block;text-align:center;margin-top:6px;padding:10px;border-radius:12px;color:#fff;text-decoration:none;font-weight:600;background:rgba(255,255,255,.08)}',
    '.ss__all:hover{background:rgba(255,255,255,.16)}'
  ].join('');

  function build() {
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    panel = document.createElement('div');
    panel.className = 'ss';
    var opts = THEMES.map(function (t, i) {
      return '<button type="button" class="ss__opt" data-style="' + t.id + '" aria-pressed="false">' +
        '<span class="ss__sw">' + t.colors.map(function (c) { return '<i style="background:' + c + '"></i>'; }).join('') + '</span>' +
        '<span><span class="ss__name">' + t.name + '</span><span class="ss__desc">' + t.desc + '</span></span>' +
        '<span class="ss__key">' + (i + 1) + '</span></button>';
    }).join('');
    panel.innerHTML =
      '<div class="ss__panel" role="dialog" aria-label="Choisir un style">' +
        '<div class="ss__title">Proposition de styles</div>' + opts +
        '<a class="ss__all" href="styles.html">Comparer tous les styles côte à côte →</a>' +
      '</div>' +
      '<div class="ss__bar">' +
        '<button type="button" class="ss__nav" data-step="-1" aria-label="Style précédent">‹</button>' +
        '<button type="button" class="ss__toggle" aria-expanded="false"><span class="ss__dot"></span><span class="ss__label"></span></button>' +
        '<button type="button" class="ss__nav" data-step="1" aria-label="Style suivant">›</button>' +
      '</div>';
    document.body.appendChild(panel);
    label = panel.querySelector('.ss__label');
    var toggle = panel.querySelector('.ss__toggle');

    panel.addEventListener('click', function (e) {
      var opt = e.target.closest('[data-style]');
      var step = e.target.closest('[data-step]');
      if (opt) apply(find(opt.getAttribute('data-style')), true);
      if (step) apply(current + Number(step.getAttribute('data-step')), true);
      if (e.target.closest('.ss__toggle')) {
        var open = !panel.classList.contains('is-open');
        panel.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', String(open));
      }
    });
    document.addEventListener('click', function (e) {
      if (!panel.contains(e.target)) { panel.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.ctrlKey || e.metaKey || e.altKey || /input|textarea|select/i.test(e.target.tagName)) return;
      var n = parseInt(e.key, 10);
      if (n >= 1 && n <= THEMES.length) apply(n - 1, true);
      if (e.key === 'Escape') { panel.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); }
    });
    render();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();
