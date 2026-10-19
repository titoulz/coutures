/* =========================================================
   Demande de réparation sur un mannequin cliquable.
   Tout se passe sur un seul écran :
   zone du corps → vêtement → réparations → demande.
   Le mannequin et les vêtements sont dessinés en SVG à partir
   des mesures du mannequin (BODY).
   ========================================================= */
(function () {
  var app = document.getElementById('mannequin');
  if (!app) return;

  var NS = 'http://www.w3.org/2000/svg';
  var CX = 150;

  // ---------- Mesures du mannequin (unités du viewBox), silhouette neutre ----------
  var BODY = {
    head: { cy: 71, r: 27.5 }, neck: { top: 93, bottom: 117, half: 10 },
    shoulder: { y: 125, half: 55 }, chest: { y: 170, half: 47 },
    waist: { y: 243, half: 36 }, hip: { y: 294, half: 48 },
    crotchY: 329, kneeY: 441, ankleY: 556, footY: 574,
    leg: { c: [24, 22, 20], h: [23.5, 16.5, 9.5] },
    arm: { sx: 51, sy: 133, ex: 71, ey: 236, wx: 84, wy: 322, w: [12, 9, 6.5], hand: 9.5 },
    foot: [13.5, 6]
  };

  var ZONES = {
    tete: 'Tête & accessoires',
    haut: 'Hauts & manteaux',
    bas: 'Bas & jupes',
    pieds: 'Pieds',
    autres: 'Autres articles'
  };

  var REPAIRS = {
    zip: ['Fermeture éclair', 'Remplacer ou réparer'],
    bouton: ['Bouton / pression', 'Recoudre ou remplacer'],
    trou: ['Trou, accroc, déchirure', 'Réparation discrète ou pièce'],
    couture: ['Couture décousue', 'Reprendre la couture'],
    ourlet: ['Ourlet', 'Raccourcir ou rallonger'],
    cintrage: ['Cintrage', 'Ajuster à la taille'],
    manches_bas: ['Longueur des manches', 'Raccourcir ou rallonger'],
    manches_ajust: ['Fuselage des manches', 'Affiner les manches'],
    coudes: ['Coudières', 'Trou ou renfort aux coudes'],
    doublure: ['Doublure', 'Réparer ou remplacer'],
    col: ['Col', 'Réparer ou retourner le col'],
    nettoyage: ['Nettoyage & imperméabilisation', 'Entretien du vêtement'],
    taille: ['Tour de taille', 'Reprendre ou élargir'],
    genoux: ['Genoux', 'Trou ou renfort'],
    entrejambe: ['Entrejambe', 'Couture ou usure'],
    poches: ['Poches', 'Fond de poche percé'],
    fuselage: ['Fuselage des jambes', 'Affiner la coupe'],
    bretelles: ['Bretelles', 'Raccourcir ou réparer'],
    reprisage: ['Reprisage', 'Trou au talon ou aux orteils'],
    autre: ['Autre chose', 'Précisez dans le message']
  };

  var PANTS = ['zip', 'bouton', 'taille', 'poches', 'entrejambe', 'genoux', 'fuselage', 'ourlet', 'autre'];
  var GARMENTS = {
    manteau: { label: 'Manteau / doudoune', short: 'Manteau', zones: ['haut'], kind: 'coat', color: '#a8794f',
      repairs: ['zip', 'bouton', 'trou', 'couture', 'doublure', 'manches_bas', 'manches_ajust', 'ourlet', 'cintrage', 'nettoyage', 'autre'] },
    veste: { label: 'Veste / blouson', short: 'Veste', zones: ['haut'], kind: 'jacket', color: '#6f7a45',
      repairs: ['zip', 'bouton', 'trou', 'couture', 'doublure', 'manches_bas', 'manches_ajust', 'cintrage', 'ourlet', 'autre'] },
    chemise: { label: 'Chemise / chemisier', short: 'Chemise', zones: ['haut'], kind: 'shirt', color: '#eef1f4', light: true,
      repairs: ['bouton', 'col', 'trou', 'couture', 'manches_bas', 'cintrage', 'ourlet', 'autre'] },
    pull: { label: 'Pull / sweat', short: 'Pull', zones: ['haut'], kind: 'sweater', color: '#c0603f',
      repairs: ['trou', 'couture', 'coudes', 'manches_bas', 'ourlet', 'autre'] },
    top: { label: 'T-shirt / top', short: 'T-shirt', zones: ['haut'], kind: 'tee', color: '#e3b663', light: true,
      repairs: ['trou', 'couture', 'cintrage', 'ourlet', 'autre'] },
    robe: { label: 'Robe', zones: ['haut', 'bas'], kind: 'dress', color: '#9c4a58',
      repairs: ['zip', 'bretelles', 'trou', 'couture', 'doublure', 'cintrage', 'ourlet', 'autre'] },
    combinaison: { label: 'Combinaison', zones: ['haut', 'bas'], kind: 'jumpsuit', color: '#5b6b7c',
      repairs: ['zip', 'trou', 'couture', 'cintrage', 'entrejambe', 'ourlet', 'autre'] },
    pantalon: { label: 'Pantalon', zones: ['bas'], kind: 'pants', color: '#4a4d56', repairs: PANTS },
    jean: { label: 'Jean', zones: ['bas'], kind: 'jeans', color: '#4f6d8f', stitch: '#e7a95c', repairs: PANTS },
    short: { label: 'Short / bermuda', short: 'Short', zones: ['bas'], kind: 'shorts', color: '#c8b08a', light: true,
      repairs: ['zip', 'bouton', 'taille', 'poches', 'entrejambe', 'ourlet', 'autre'] },
    jupe: { label: 'Jupe', zones: ['bas'], kind: 'skirt', color: '#7f5a4a',
      repairs: ['zip', 'taille', 'doublure', 'couture', 'trou', 'ourlet', 'autre'] },
    bonnet: { label: 'Bonnet / chapeau', short: 'Bonnet', zones: ['tete'], kind: 'hat', color: '#c4583a',
      repairs: ['trou', 'couture', 'doublure', 'autre'] },
    echarpe: { label: 'Écharpe / foulard', short: 'Écharpe', zones: ['tete'], kind: 'scarf', color: '#d9a441', light: true,
      repairs: ['trou', 'ourlet', 'autre'] },
    chaussettes: { label: 'Chaussettes', zones: ['pieds'], kind: 'socks', color: '#c4583a',
      repairs: ['reprisage', 'autre'] },
    collants: { label: 'Collants', zones: ['pieds', 'bas'], kind: 'tights', color: '#2f2a28',
      repairs: ['reprisage', 'entrejambe', 'autre'] },
    // Articles sans place sur le mannequin
    lingerie: { label: 'Sous-vêtements', zones: ['autres'], repairs: ['bretelles', 'couture', 'trou', 'autre'] },
    linge: { label: 'Linge de maison', hint: 'Rideaux, nappes, housses…', zones: ['autres'], repairs: ['ourlet', 'couture', 'trou', 'autre'] },
    pressing: { label: 'Pressing', zones: ['autres'], repairs: ['nettoyage', 'autre'] },
    creation: { label: 'Création sur mesure', zones: ['autres'], repairs: ['autre'] }
  };

  // ---------- Géométrie ----------
  function lerp(a, b, t) { return a + (b - a) * t; }
  function clamp(t) { return Math.max(0, Math.min(1, t)); }
  function P(x, y) { return [Math.round(x * 10) / 10, Math.round(y * 10) / 10]; }
  function poly(pts) { return 'M' + pts.map(function (p) { return p.join(' '); }).join('L') + 'Z'; }
  function line(pts) { return 'M' + pts.map(function (p) { return p.join(' '); }).join('L'); }
  // Courbe fermée lissée passant par les points (Catmull-Rom → Bézier)
  function smooth(pts) {
    var n = pts.length, d = 'M' + pts[0].join(' ');
    for (var i = 0; i < n; i++) {
      var p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
      var c1 = P(p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6);
      var c2 = P(p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6);
      d += 'C' + c1.join(' ') + ' ' + c2.join(' ') + ' ' + p2.join(' ');
    }
    return d + 'Z';
  }
  function mirror(pts) { return pts.map(function (p) { return P(2 * CX - p[0], p[1]); }).reverse(); }

  // Point sur le bras : t de 0 (épaule) à 1 (coude) à 2 (poignet) ;
  // edge 1 = bord extérieur, -1 = bord intérieur, 0 = axe ; extra = élargissement
  function armAt(m, s, t, edge, extra) {
    var a = m.arm;
    var A = [CX + s * a.sx, a.sy], E = [CX + s * a.ex, a.ey], W = [CX + s * a.wx, a.wy];
    var p, q, u, h;
    if (t <= 1) { p = A; q = E; u = t; h = lerp(a.w[0], a.w[1], t); }
    else { p = E; q = W; u = t - 1; h = lerp(a.w[1], a.w[2], u); }
    var dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy);
    var nx = -dy / L, ny = dx / L;
    if (nx * s < 0) { nx = -nx; ny = -ny; }
    var k = edge * (h + (extra || 0));
    return P(lerp(p[0], q[0], u) + nx * k, lerp(p[1], q[1], u) + ny * k);
  }

  // Point sur une jambe à la hauteur y (edge 1 = extérieur, -1 = intérieur)
  function legAt(m, s, y, edge, extra) {
    var c, h, u;
    if (y <= m.kneeY) {
      u = clamp((y - m.crotchY) / (m.kneeY - m.crotchY));
      c = lerp(m.leg.c[0], m.leg.c[1], u); h = lerp(m.leg.h[0], m.leg.h[1], u);
    } else {
      u = clamp((y - m.kneeY) / (m.ankleY - m.kneeY));
      c = lerp(m.leg.c[1], m.leg.c[2], u); h = lerp(m.leg.h[1], m.leg.h[2], u);
    }
    return P(CX + s * (c + edge * (h + (extra || 0))), y);
  }

  // Demi-largeur du torse à la hauteur y
  function torsoHalf(m, y) {
    var k = [[m.shoulder.y, m.shoulder.half], [m.chest.y, m.chest.half], [m.waist.y, m.waist.half], [m.hip.y, m.hip.half]];
    if (y <= k[0][0]) return k[0][1];
    for (var i = 1; i < k.length; i++) {
      if (y <= k[i][0]) return lerp(k[i - 1][1], k[i][1], (y - k[i - 1][0]) / (k[i][0] - k[i - 1][0]));
    }
    return m.hip.half;
  }

  function footCenter(m, s) { return P(CX + s * (m.leg.c[2] + 3), m.footY); }

  // ---------- Mannequin ----------
  function bodyShapes(m) {
    var shapes = [];
    var torso = [
      P(CX - m.neck.half, m.neck.bottom), P(CX - m.shoulder.half, m.shoulder.y), P(CX - m.chest.half, m.chest.y),
      P(CX - m.waist.half, m.waist.y), P(CX - m.hip.half, m.hip.y), P(CX - m.hip.half * 0.8, m.crotchY - 6)
    ];
    shapes.push({ d: smooth(torso.concat([P(CX, m.crotchY + 2)], mirror(torso))) });
    [-1, 1].forEach(function (s) {
      shapes.push({ d: smooth([
        P(CX + s * (m.hip.half - 2), m.hip.y), legAt(m, s, m.crotchY, 1), legAt(m, s, m.kneeY, 1), legAt(m, s, m.ankleY, 1),
        legAt(m, s, m.ankleY, -1), legAt(m, s, m.kneeY, -1), legAt(m, s, m.crotchY, -1), P(CX + s * 2, m.hip.y)
      ]) });
      shapes.push({ d: smooth([
        P(CX + s * m.arm.sx, m.arm.sy - m.arm.w[0] * 0.4), armAt(m, s, 0, 1), armAt(m, s, 1, 1), armAt(m, s, 2, 1),
        armAt(m, s, 2, -1), armAt(m, s, 1, -1), armAt(m, s, 0, -1)
      ]) });
      var w = armAt(m, s, 2.0, 0), e = armAt(m, s, 1.7, 0);
      var dx = w[0] - e[0], dy = w[1] - e[1], L = Math.hypot(dx, dy);
      shapes.push({ circle: [w[0] + dx / L * m.arm.hand * 0.8, w[1] + dy / L * m.arm.hand * 0.8, m.arm.hand] });
      var f = footCenter(m, s);
      shapes.push({ ellipse: [f[0], f[1], m.foot[0], m.foot[1]] });
    });
    shapes.push({ rect: [CX - m.neck.half, m.neck.top, m.neck.half * 2, m.neck.bottom - m.neck.top + 8] });
    shapes.push({ ellipse: [CX, m.head.cy, m.head.r * 0.86, m.head.r] });
    return shapes;
  }

  // ---------- Vêtements ----------
  // Haut à manches : renvoie le contour et l'ourlet
  function topShape(m, o) {
    var e = o.extra || 3;
    function side(s) {
      var sh = armAt(m, s, 0, 1, e);
      var pts = [P(CX + s * (m.neck.half + 4), m.neck.bottom - 3), P(sh[0], sh[1] - 3)];
      if (o.sleeve > 1) pts.push(armAt(m, s, 1, 1, e));
      pts.push(armAt(m, s, o.sleeve, 1, e), armAt(m, s, o.sleeve, -1, e));
      if (o.sleeve > 1) pts.push(armAt(m, s, 1, -1, e));
      pts.push(P(CX + s * (m.chest.half + e), m.chest.y - 10));
      if (o.hemY > m.waist.y + 4) pts.push(P(CX + s * (m.waist.half + e + (o.loose || 0)), m.waist.y));
      if (o.hemY > m.hip.y + 6) pts.push(P(CX + s * (m.hip.half + e + (o.loose || 0)), m.hip.y));
      pts.push(P(CX + s * o.hemHalf, o.hemY));
      return pts;
    }
    var left = side(-1);
    return left.concat(mirror(left), [P(CX, m.neck.bottom + (o.dip || 4))]);
  }

  function pantsShape(m, o) {
    var e = o.extra || 4, b = o.bottom, f = o.flare || 0;
    var left = [P(CX - (torsoHalf(m, o.top) + e), o.top)];
    if (o.top < m.hip.y) left.push(P(CX - (m.hip.half + e), m.hip.y));
    left.push(legAt(m, -1, m.crotchY, 1, e));
    if (b > m.kneeY + 10) left.push(legAt(m, -1, m.kneeY, 1, e));
    left.push(legAt(m, -1, b, 1, e + f), legAt(m, -1, b, -1, e + f));
    if (b > m.kneeY + 10) left.push(legAt(m, -1, m.kneeY, -1, e));
    left.push(P(CX - 1, m.crotchY + 3));
    return left.concat(mirror(left));
  }

  function hemStitch(a, b, dy) { return line([P(a[0], a[1] - dy), P(b[0], b[1] - dy)]); }

  function buildGarment(m, g) {
    var out = { shapes: [], details: [], buttons: [], meta: {} };
    var k = g.kind, top, hemY, hemHalf, pts;
    var waistTop = m.waist.y + 4;

    if (k === 'coat' || k === 'jacket' || k === 'shirt' || k === 'sweater' || k === 'tee') {
      var cfg = {
        coat: { sleeve: 1.92, hemY: lerp(m.hip.y, m.kneeY, 0.62), add: 14, extra: 5, loose: 4, dip: 40 },
        jacket: { sleeve: 1.9, hemY: m.hip.y + 8, add: 6, extra: 4, loose: 2, dip: 34 },
        shirt: { sleeve: 1.92, hemY: m.hip.y + 4, add: 3, extra: 3, loose: 0, dip: 10 },
        sweater: { sleeve: 1.92, hemY: m.hip.y - 4, add: 2, extra: 4, loose: 1, dip: 5 },
        tee: { sleeve: 0.42, hemY: m.hip.y - 8, add: 2, extra: 3, loose: 0, dip: 6 }
      }[k];
      hemY = cfg.hemY;
      hemHalf = (hemY > m.hip.y ? m.hip.half : torsoHalf(m, hemY)) + cfg.add;
      pts = topShape(m, { sleeve: cfg.sleeve, hemY: hemY, hemHalf: hemHalf, extra: cfg.extra, loose: cfg.loose, dip: cfg.dip });
      out.shapes.push(poly(pts));
      out.meta = { hemY: hemY, hemHalf: hemHalf, sleeve: cfg.sleeve };
      var neckY = m.neck.bottom + cfg.dip;
      // Ourlet et poignets surpiqués
      out.details.push({ d: hemStitch([CX - hemHalf + 3, hemY], [CX + hemHalf - 3, hemY], 5), cls: 'stitch' });
      if (cfg.sleeve > 1) {
        [-1, 1].forEach(function (s) {
          out.details.push({ d: line([armAt(m, s, cfg.sleeve - 0.1, 1, cfg.extra - 1), armAt(m, s, cfg.sleeve - 0.1, -1, cfg.extra - 1)]), cls: k === 'sweater' ? 'seam' : 'stitch' });
        });
      }
      if (k === 'coat' || k === 'jacket') {
        out.details.push({ d: line([P(CX, neckY), P(CX, hemY)]), cls: 'seam' });
        // Revers du col
        out.details.push({ d: line([P(CX - m.neck.half - 4, m.neck.bottom - 3), P(CX - 12, neckY - 14), P(CX, neckY)]), cls: 'seam' });
        out.details.push({ d: line([P(CX + m.neck.half + 4, m.neck.bottom - 3), P(CX + 12, neckY - 14), P(CX, neckY)]), cls: 'seam' });
        if (k === 'coat') {
          for (var i = 0; i < 4; i++) out.buttons.push(P(CX + 6, lerp(neckY + 12, hemY - 30, i / 3)));
          // Poches à rabat
          [-1, 1].forEach(function (s) {
            out.details.push({ d: line([P(CX + s * 10, m.hip.y - 4), P(CX + s * (m.hip.half - 4), m.hip.y - 4)]), cls: 'seam' });
          });
        } else {
          out.details.push({ d: line([P(CX + 3, neckY + 4), P(CX + 3, hemY - 4)]), cls: 'stitch' });
        }
      }
      if (k === 'shirt') {
        out.details.push({ d: line([P(CX, neckY), P(CX, hemY)]), cls: 'seam' });
        out.details.push({ d: line([P(CX - m.neck.half - 5, m.neck.bottom - 4), P(CX - 7, neckY + 6), P(CX, neckY)]), cls: 'seam' });
        out.details.push({ d: line([P(CX + m.neck.half + 5, m.neck.bottom - 4), P(CX + 7, neckY + 6), P(CX, neckY)]), cls: 'seam' });
        for (var j = 0; j < 5; j++) out.buttons.push(P(CX + 4, lerp(neckY + 10, hemY - 12, j / 4)));
      }
      if (k === 'sweater') {
        out.details.push({ d: hemStitch([CX - hemHalf + 2, hemY], [CX + hemHalf - 2, hemY], 9), cls: 'seam' });
        out.details.push({ d: 'M' + (CX - m.neck.half - 4) + ' ' + (m.neck.bottom - 1) + 'Q' + CX + ' ' + (m.neck.bottom + 12) + ' ' + (CX + m.neck.half + 4) + ' ' + (m.neck.bottom - 1), cls: 'seam' });
      }
      if (k === 'tee') {
        out.details.push({ d: 'M' + (CX - m.neck.half - 4) + ' ' + (m.neck.bottom - 1) + 'Q' + CX + ' ' + (m.neck.bottom + 12) + ' ' + (CX + m.neck.half + 4) + ' ' + (m.neck.bottom - 1), cls: 'stitch' });
      }
    } else if (k === 'dress') {
      hemY = m.kneeY + 8;
      hemHalf = m.hip.half + 22;
      var dl = [
        P(CX - m.shoulder.half * 0.36, m.shoulder.y - 4), P(CX - m.shoulder.half * 0.66, m.shoulder.y - 1),
        P(CX - (m.chest.half + 3), m.chest.y - 10), P(CX - (m.waist.half + 3), m.waist.y),
        P(CX - (m.hip.half + 7), m.hip.y), P(CX - hemHalf, hemY)
      ];
      out.shapes.push(poly(dl.concat([P(CX, hemY + 5)], mirror(dl), [P(CX, m.shoulder.y + 24)])));
      out.details.push({ d: line([P(CX - m.waist.half - 3, m.waist.y), P(CX + m.waist.half + 3, m.waist.y)]), cls: 'seam' });
      out.details.push({ d: line([P(CX - hemHalf + 4, hemY - 6), P(CX, hemY - 1), P(CX + hemHalf - 4, hemY - 6)]), cls: 'stitch' });
      out.meta = { hemY: hemY, hemHalf: hemHalf };
    } else if (k === 'jumpsuit') {
      var tl = topShape(m, { sleeve: 0.42, hemY: m.waist.y, hemHalf: m.waist.half + 4, extra: 3, dip: 22 });
      // Côté gauche du haut (sans l'ourlet), puis jambe gauche du pantalon, puis le miroir
      var halfTop = tl.slice(0, tl.length / 2 - 0.5 | 0);
      var leftTop = halfTop.slice(0, halfTop.length - 1);
      var bottom = m.ankleY - 6;
      var pl = pantsShape(m, { top: m.waist.y, bottom: bottom, extra: 4 });
      var leftPants = pl.slice(0, pl.length / 2);
      var left = leftTop.concat(leftPants.slice(1));
      out.shapes.push(poly(left.concat(mirror(left), [P(CX, m.neck.bottom + 22)])));
      out.details.push({ d: line([P(CX - m.waist.half - 4, m.waist.y + 4), P(CX + m.waist.half + 4, m.waist.y + 4)]), cls: 'seam' });
      out.details.push({ d: line([P(CX, m.neck.bottom + 22), P(CX, m.crotchY - 8)]), cls: 'stitch' });
      out.meta = { bottom: bottom };
    } else if (k === 'pants' || k === 'jeans' || k === 'shorts') {
      top = waistTop;
      var bot = k === 'shorts' ? lerp(m.crotchY, m.kneeY, 0.55) : m.ankleY - 4;
      out.shapes.push(poly(pantsShape(m, { top: top, bottom: bot, extra: k === 'jeans' ? 3 : 4, flare: k === 'shorts' ? 4 : 1 })));
      var wh = torsoHalf(m, top) + 4;
      out.details.push({ d: line([P(CX - wh + 1, top + 8), P(CX + wh - 1, top + 8)]), cls: k === 'jeans' ? 'stitch' : 'seam' });
      out.details.push({ d: 'M' + CX + ' ' + (top + 8) + 'L' + CX + ' ' + (m.crotchY - 12) + 'Q' + (CX + 9) + ' ' + (m.crotchY - 12) + ' ' + (CX + 10) + ' ' + (top + 20), cls: k === 'jeans' ? 'stitch' : 'seam' });
      [-1, 1].forEach(function (s) {
        out.details.push({ d: 'M' + (CX + s * (wh - 14)) + ' ' + (top + 8) + 'Q' + (CX + s * (wh - 10)) + ' ' + (top + 26) + ' ' + (CX + s * (m.hip.half + 2)) + ' ' + (top + 30), cls: k === 'jeans' ? 'stitch' : 'seam' });
        out.details.push({ d: line([legAt(m, s, bot - 6, 1, 3), legAt(m, s, bot - 6, -1, 3)]), cls: 'stitch' });
      });
      out.buttons.push(P(CX, top + 4));
      out.meta = { top: top, bottom: bot };
    } else if (k === 'skirt') {
      top = waistTop;
      hemY = m.kneeY - 6;
      hemHalf = m.hip.half + 18;
      var sl = [P(CX - (torsoHalf(m, top) + 3), top), P(CX - (m.hip.half + 6), m.hip.y), P(CX - hemHalf, hemY)];
      out.shapes.push(poly(sl.concat([P(CX, hemY + 4)], mirror(sl))));
      out.details.push({ d: line([P(CX - torsoHalf(m, top) - 3, top + 8), P(CX + torsoHalf(m, top) + 3, top + 8)]), cls: 'seam' });
      out.details.push({ d: line([P(CX - hemHalf + 4, hemY - 6), P(CX, hemY - 2), P(CX + hemHalf - 4, hemY - 6)]), cls: 'stitch' });
      out.meta = { top: top, hemY: hemY, hemHalf: hemHalf };
    } else if (k === 'hat') {
      var r = m.head.r, yb = m.head.cy - r * 0.18;
      out.shapes.push('M' + (CX - r * 0.98) + ' ' + yb + 'A' + (r * 0.98) + ' ' + (r * 1.08) + ' 0 0 1 ' + (CX + r * 0.98) + ' ' + yb + 'Z');
      out.shapes.push('M' + (CX - r - 2) + ' ' + (yb - 3) + 'h' + (2 * r + 4) + 'v12a4 4 0 0 1-4 4h-' + (2 * r - 4) + 'a4 4 0 0 1-4-4Z');
      out.shapes.push('M' + CX + ' ' + (m.head.cy - r * 1.1 - 16) + 'a9 9 0 1 0 0.1 0Z');
      for (var x = -r + 6; x < r; x += 7) out.details.push({ d: line([P(CX + x, yb - 1), P(CX + x, yb + 10)]), cls: 'seam' });
    } else if (k === 'scarf') {
      var ny = m.neck.top + (m.neck.bottom - m.neck.top) * 0.45;
      out.shapes.push('M' + (CX - m.neck.half - 9) + ' ' + (ny - 6) + 'h' + (2 * m.neck.half + 18) + 'v16a6 6 0 0 1-6 6h-' + (2 * m.neck.half + 6) + 'a6 6 0 0 1-6-6Z');
      var tailEnd = m.chest.y + 40;
      out.shapes.push(poly([P(CX + 2, ny + 8), P(CX + 18, ny + 8), P(CX + 24, tailEnd), P(CX + 6, tailEnd + 3)]));
      for (var f = 0; f < 4; f++) {
        var fx = lerp(CX + 8, CX + 22, f / 3);
        out.details.push({ d: line([P(fx, tailEnd + 1), P(fx + 1, tailEnd + 9)]), cls: 'fringe' });
      }
      out.details.push({ d: line([P(CX + 5, tailEnd - 6), P(CX + 23, tailEnd - 9)]), cls: 'stitch' });
      out.meta = { tailEnd: tailEnd, ny: ny };
    } else if (k === 'socks') {
      [-1, 1].forEach(function (s) {
        var fc = footCenter(m, s), y0 = m.ankleY - 34;
        out.shapes.push(poly([legAt(m, s, y0, 1, 2), legAt(m, s, m.ankleY, 1, 2), P(fc[0] + s * (m.foot[0] + 1), fc[1]), P(fc[0] - s * (m.foot[0] + 1), fc[1] + 2), legAt(m, s, m.ankleY, -1, 2), legAt(m, s, y0, -1, 2)]));
        out.shapes.push('M' + (fc[0] - m.foot[0] - 1) + ' ' + fc[1] + 'a' + (m.foot[0] + 1) + ' ' + (m.foot[1] + 1) + ' 0 1 0 ' + (2 * m.foot[0] + 2) + ' 0a' + (m.foot[0] + 1) + ' ' + (m.foot[1] + 1) + ' 0 1 0-' + (2 * m.foot[0] + 2) + ' 0Z');
        out.details.push({ d: line([legAt(m, s, y0 + 6, 1, 2), legAt(m, s, y0 + 6, -1, 2)]), cls: 'seam' });
      });
    } else if (k === 'tights') {
      out.shapes.push(poly(pantsShape(m, { top: waistTop, bottom: m.ankleY + 2, extra: 1 })));
      [-1, 1].forEach(function (s) {
        var fc = footCenter(m, s);
        out.shapes.push('M' + (fc[0] - m.foot[0] - 1) + ' ' + fc[1] + 'a' + (m.foot[0] + 1) + ' ' + (m.foot[1] + 1) + ' 0 1 0 ' + (2 * m.foot[0] + 2) + ' 0a' + (m.foot[0] + 1) + ' ' + (m.foot[1] + 1) + ' 0 1 0-' + (2 * m.foot[0] + 2) + ' 0Z');
        out.shapes.push(poly([legAt(m, s, m.ankleY - 4, 1, 1), P(fc[0] + s * m.foot[0], fc[1]), P(fc[0] - s * m.foot[0], fc[1]), legAt(m, s, m.ankleY - 4, -1, 1)]));
      });
    }
    return out;
  }

  // Position des points de réparation sur le vêtement porté
  function anchor(m, g, id, meta) {
    var k = g.kind;
    var isTop = /coat|jacket|shirt|sweater|tee/.test(k);
    var isPants = /pants|jeans|shorts/.test(k);
    var r = m.head.r;
    switch (id) {
      case 'zip':
        if (isPants) return P(CX + 5, lerp(meta.top, m.crotchY, 0.55));
        if (k === 'dress') return P(CX + m.waist.half + 3, m.waist.y - 24);
        if (k === 'skirt') return P(CX - torsoHalf(m, meta.top) * 0.6, meta.top + 22);
        if (k === 'jumpsuit') return P(CX, m.chest.y + 6);
        return P(CX, m.waist.y + 12);
      case 'bouton':
        if (isPants) return P(CX - 10, meta.top + 4);
        return P(CX, m.chest.y - 2);
      case 'col': return P(CX, m.neck.bottom + 1);
      case 'trou':
        if (k === 'hat') return P(CX - r * 0.55, m.head.cy - r * 0.72);
        if (k === 'scarf') return P(CX + 14, lerp(meta.ny, meta.tailEnd, 0.45));
        if (k === 'skirt') return P(CX - 14, lerp(m.hip.y, meta.hemY, 0.5));
        if (k === 'dress') return P(CX - m.chest.half * 0.5, (m.chest.y + m.waist.y) / 2);
        return P(CX - m.chest.half * 0.55, (m.chest.y + m.waist.y) / 2 + 8);
      case 'couture':
        if (k === 'hat') return P(CX + r * 0.55, m.head.cy - r * 0.72);
        if (k === 'skirt') return P(CX + m.hip.half + 7, m.hip.y + 16);
        if (k === 'dress') return P(CX + m.hip.half + 8, m.hip.y + 6);
        return P(CX + m.waist.half + 4, k === 'tee' || k === 'sweater' ? m.waist.y + 14 : (m.waist.y + m.hip.y) / 2 - 2);
      case 'cintrage': return P(CX - m.waist.half - 4, m.waist.y - (k === 'dress' || k === 'jumpsuit' ? 8 : 0));
      case 'doublure':
        if (k === 'hat') return P(CX, m.head.cy - r * 0.18 + 5);
        if (k === 'skirt') return P(CX + 16, lerp(m.hip.y, meta.hemY, 0.6));
        if (k === 'dress') return P(CX - m.hip.half * 0.45, lerp(m.hip.y, meta.hemY, 0.5));
        return P(CX + m.chest.half * 0.5, m.chest.y + 16);
      case 'ourlet':
        if (isPants || k === 'jumpsuit') return legAt(m, 1, (meta.bottom || m.ankleY) - 8, 0);
        if (k === 'scarf') return P(CX + 15, meta.tailEnd - 2);
        if (k === 'skirt' || k === 'dress') return P(CX - meta.hemHalf * 0.45, meta.hemY - 8);
        return P(CX - meta.hemHalf * 0.5, meta.hemY - 7);
      case 'manches_bas': return armAt(m, -1, meta.sleeve - 0.12, 0);
      case 'manches_ajust': return armAt(m, 1, 0.55, 0);
      case 'coudes': return armAt(m, 1, 1, 0);
      case 'nettoyage': return armAt(m, 1, 0.02, -0.4);
      case 'bretelles': return P(CX + m.shoulder.half * 0.52, m.shoulder.y + 1);
      case 'taille': return P(CX + torsoHalf(m, meta.top || m.waist.y) * 0.62, (meta.top || m.waist.y) + 4);
      case 'poches': return P(CX - m.hip.half * 0.66, m.hip.y - 4);
      case 'entrejambe': return P(CX, m.crotchY + (k === 'tights' ? 4 : 10));
      case 'genoux': return legAt(m, 1, m.kneeY, 0);
      case 'fuselage': return legAt(m, -1, lerp(m.kneeY, m.ankleY, 0.4), 0);
      case 'reprisage': { var fc = footCenter(m, 1); return P(fc[0] + 4, fc[1] - 1); }
    }
    return null;
  }

  // ---------- Zones cliquables ----------
  function zoneShapes(m, zone) {
    var split = (m.waist.y + m.hip.y) / 2;
    if (zone === 'tete') return ['M' + (CX - m.head.r - 10) + ' ' + m.head.cy + 'a' + (m.head.r + 10) + ' ' + (m.head.r + 12) + ' 0 1 0 ' + (2 * m.head.r + 20) + ' 0a' + (m.head.r + 10) + ' ' + (m.head.r + 12) + ' 0 1 0-' + (2 * m.head.r + 20) + ' 0Z'];
    if (zone === 'haut') return [poly(topShape(m, { sleeve: 2.15, hemY: split, hemHalf: torsoHalf(m, split) + 7, extra: 7, dip: 2 }))];
    if (zone === 'bas') return [poly(pantsShape(m, { top: split, bottom: m.ankleY - 16, extra: 7 }))];
    if (zone === 'pieds') {
      return [-1, 1].map(function (s) {
        var fc = footCenter(m, s);
        return 'M' + (fc[0] - m.foot[0] - 7) + ' ' + (m.ankleY - 16) + 'h' + (2 * m.foot[0] + 14) + 'v' + (m.footY - m.ankleY + 26) + 'h-' + (2 * m.foot[0] + 14) + 'Z';
      });
    }
    return [];
  }

  // Étiquette de zone reliée au mannequin par un fil
  function zoneTag(m, zone) {
    if (zone === 'tete') return { at: P(CX - m.head.r * 0.75, m.head.cy - 4), x: -56, y: m.head.cy - 14, side: -1 };
    if (zone === 'haut') return { at: P(CX + m.chest.half * 0.45, m.chest.y + 18), x: 262, y: m.chest.y + 4, side: 1 };
    if (zone === 'bas') return { at: legAt(m, -1, lerp(m.crotchY, m.kneeY, 0.55), 0), x: -56, y: lerp(m.crotchY, m.kneeY, 0.55) - 10, side: -1 };
    if (zone === 'pieds') { var f = footCenter(m, 1); return { at: P(f[0] + 2, f[1] - 2), x: 262, y: m.footY - 30, side: 1 }; }
  }

  // ---------- État ----------
  var state = { zone: null, garment: null, repairs: [], note: '', basket: [], lastDressed: null };

  var svg = app.querySelector('.mq');
  var panel = app.querySelector('.repair__step');
  var crumbs = app.querySelector('.repair__crumbs');
  var basketEl = app.querySelector('.repair__basket');

  function el(name, attrs, parent) {
    var n = document.createElementNS(NS, name);
    for (var a in attrs) if (attrs[a] !== undefined && attrs[a] !== null) n.setAttribute(a, attrs[a]);
    if (parent) parent.appendChild(n);
    return n;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function garmentsFor(zone) {
    return Object.keys(GARMENTS).filter(function (id) { return GARMENTS[id].zones.indexOf(zone) > -1; });
  }
  function zoneLabel(z) { return ZONES[z]; }
  function repairLabel(id, g) {
    if (id === 'zip' && /pants|jeans|shorts/.test(g.kind || '')) return 'Braguette';
    return REPAIRS[id][0];
  }
  function shortName(g) { return g.short || g.label; }

  function drawShape(s, parent, cls) {
    if (s.circle) return el('circle', { cx: s.circle[0], cy: s.circle[1], r: s.circle[2], class: cls }, parent);
    if (s.ellipse) return el('ellipse', { cx: s.ellipse[0], cy: s.ellipse[1], rx: s.ellipse[2], ry: s.ellipse[3], class: cls }, parent);
    if (s.rect) return el('rect', { x: s.rect[0], y: s.rect[1], width: s.rect[2], height: s.rect[3], class: cls }, parent);
    return el('path', { d: s.d, class: cls }, parent);
  }

  function renderStage() {
    var m = BODY;
    var g = state.garment ? GARMENTS[state.garment] : null;
    svg.textContent = '';
    svg.setAttribute('class', 'mq' + (state.zone ? ' has-zone' : '') + (g && g.kind ? ' has-garment' : ''));

    // Socle
    el('ellipse', { cx: CX, cy: 590, rx: 74, ry: 10, class: 'mq__base' }, svg);

    // Mannequin : contour puis remplissage, pour un contour unique
    var body = el('g', { class: 'mq__body' }, svg);
    var shapes = bodyShapes(m);
    var outline = el('g', { class: 'mq__outline' }, body);
    var fill = el('g', { class: 'mq__fill' }, body);
    shapes.forEach(function (s) { drawShape(s, outline); drawShape(s, fill); });
    el('path', { d: line([P(CX, m.neck.bottom + 6), P(CX, m.crotchY - 14)]), class: 'mq__seam' }, body);

    // Vêtement porté
    var meta = {};
    if (g && g.kind) {
      var built = buildGarment(m, g);
      meta = built.meta;
      var fresh = state.lastDressed !== state.garment;
      state.lastDressed = state.garment;
      var wear = el('g', { class: 'mq__garment' + (fresh ? ' is-new' : '') + (g.light ? ' is-light' : ''), style: '--fabric:' + g.color + (g.stitch ? ';--thread:' + g.stitch : '') }, svg);
      built.shapes.forEach(function (d) { el('path', { d: d, class: 'mq__cloth' }, wear); });
      built.details.forEach(function (dt) { el('path', { d: dt.d, class: 'mq__' + dt.cls }, wear); });
      built.buttons.forEach(function (b) { el('circle', { cx: b[0], cy: b[1], r: 2.2, class: 'mq__button' }, wear); });
    }

    // Zones cliquables (masquées une fois le vêtement choisi)
    if (!g || !g.kind) {
      var zonesG = el('g', { class: 'mq__zones' }, svg);
      ['bas', 'haut', 'pieds', 'tete'].forEach(function (z) {
        var zg = el('g', {
          class: 'mq__zone' + (state.zone === z ? ' is-active' : ''), 'data-zone': z,
          tabindex: 0, role: 'button', 'aria-label': zoneLabel(z), 'aria-pressed': String(state.zone === z)
        }, zonesG);
        zoneShapes(m, z).forEach(function (d) { el('path', { d: d }, zg); });
      });
      // Étiquettes reliées par un fil, avec une épingle sur le mannequin
      ['tete', 'haut', 'bas', 'pieds'].forEach(function (z) {
        if (state.zone && state.zone !== z) return;
        var t = zoneTag(m, z), label = zoneLabel(z);
        var w = label.length * 6.3 + 22;
        // Calées sur les bords du cadre large (-70 → 370)
        var bx = t.side < 0 ? -64 : 364 - w;
        var tag = el('g', { class: 'mq__tag' + (state.zone === z ? ' is-active' : ''), 'data-zone': z, 'aria-hidden': 'true' }, svg);
        var tx = t.side < 0 ? bx + w : bx;
        el('path', { d: 'M' + t.at.join(' ') + 'Q' + ((t.at[0] + tx) / 2) + ' ' + (t.y + 24) + ' ' + tx + ' ' + (t.y + 11), class: 'mq__thread' }, tag);
        el('rect', { x: bx, y: t.y, width: w, height: 22, rx: 11 }, tag);
        el('text', { x: bx + w / 2, y: t.y + 15, 'text-anchor': 'middle' }, tag).textContent = label;
        el('circle', { cx: t.at[0], cy: t.at[1], r: 3.4, class: 'mq__pin' }, tag);
      });
    }

    // Points de réparation
    if (g && g.kind) {
      var hs = el('g', { class: 'mq__hotspots' }, svg);
      g.repairs.forEach(function (id, i) {
        var p = anchor(m, g, id, meta);
        if (!p) return;
        var on = state.repairs.indexOf(id) > -1;
        var h = el('g', {
          class: 'mq__hotspot' + (on ? ' is-on' : ''), 'data-repair': id, tabindex: 0, role: 'checkbox',
          'aria-checked': String(on), 'aria-label': repairLabel(id, g), transform: 'translate(' + p[0] + ' ' + p[1] + ')',
          style: 'animation-delay:' + (0.35 + i * 0.05) + 's'
        }, hs);
        el('circle', { r: 15, class: 'mq__hit' }, h);
        el('circle', { r: 8, class: 'mq__ring' }, h);
        el('circle', { r: 7, class: 'mq__dot' }, h);
        el('path', { d: 'M-3 0h6M0-3v6', class: 'mq__plus' }, h);
        el('path', { d: 'M-3.2 0.2l2.2 2.2 4-4.4', class: 'mq__check' }, h);
        var label = repairLabel(id, g), w = label.length * 5.7 + 18, left = p[0] > CX;
        var lg = el('g', { class: 'mq__label', transform: 'translate(' + (left ? 14 : -14 - w) + ' -11)' }, h);
        el('rect', { width: w, height: 22, rx: 11 }, lg);
        el('text', { x: w / 2, y: 15, 'text-anchor': 'middle' }, lg).textContent = label;
      });
    }
  }

  // Cadrage : vue large avec les étiquettes, puis zoom sur la silhouette habillée
  var view = null;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function fitView(wide) {
    var b = svg.querySelector('.mq__body').getBBox();
    var g = svg.querySelector('.mq__garment');
    var top = b.y, x0 = b.x, x1 = b.x + b.width;
    if (g) { var gb = g.getBBox(); top = Math.min(top, gb.y); x0 = Math.min(x0, gb.x); x1 = Math.max(x1, gb.x + gb.width); }
    var y = top - 24;
    var target = wide ? [-70, y, 440, 602 - y] : [x0 - 34, y, x1 - x0 + 68, 602 - y];
    if (!view || reduced) { view = target; svg.setAttribute('viewBox', target.join(' ')); return; }
    var from = view.slice(), t0 = performance.now();
    cancelAnimationFrame(fitView.raf);
    (function step(now) {
      var k = Math.min(1, (now - t0) / 450), e = 1 - Math.pow(1 - k, 3);
      view = from.map(function (v, i) { return v + (target[i] - v) * e; });
      svg.setAttribute('viewBox', view.map(function (v) { return v.toFixed(2); }).join(' '));
      if (k < 1) fitView.raf = requestAnimationFrame(step);
    })(t0);
  }

  function renderCrumbs() {
    var parts = ['<button type="button" data-go="body">Mannequin</button>'];
    if (state.zone) parts.push('<button type="button" data-go="zone">' + esc(zoneLabel(state.zone)) + '</button>');
    if (state.garment) parts.push('<span aria-current="step">' + esc(shortName(GARMENTS[state.garment])) + '</span>');
    crumbs.innerHTML = parts.join('<span class="repair__sep" aria-hidden="true">›</span>');
  }

  function renderPanel() {
    var html = '';
    if (!state.zone) {
      html += '<h3 class="repair__title">Que souhaitez-vous faire réparer ?</h3>' +
        '<p class="repair__hint">Touchez une partie du mannequin, ou choisissez ci-dessous.</p>' +
        '<div class="repair__chips">' + ['tete', 'haut', 'bas', 'pieds'].map(function (z) {
          return '<button type="button" class="repair__chip" data-zone="' + z + '">' + esc(zoneLabel(z)) + '</button>';
        }).join('') + '</div>' +
        '<p class="repair__sub">Autres articles</p><div class="repair__chips">' + garmentsFor('autres').map(function (id) {
          return '<button type="button" class="repair__chip repair__chip--soft" data-garment="' + id + '">' + esc(GARMENTS[id].label) + '</button>';
        }).join('') + '</div>';
    } else if (!state.garment) {
      html += '<h3 class="repair__title">Quel vêtement ?</h3>' +
        '<p class="repair__hint">' + esc(zoneLabel(state.zone)) + '</p>' +
        '<div class="repair__chips">' + garmentsFor(state.zone).map(function (id) {
          return '<button type="button" class="repair__chip" data-garment="' + id + '">' + esc(GARMENTS[id].label) + '</button>';
        }).join('') + '</div>';
    } else {
      var g = GARMENTS[state.garment];
      html += '<h3 class="repair__title">Quelles réparations pour votre ' + esc(shortName(g).toLowerCase()) + ' ?</h3>' +
        '<p class="repair__hint">' + (g.kind ? 'Touchez les points sur le mannequin ou cochez ci-dessous. Plusieurs choix possibles.' : esc(g.hint || 'Plusieurs choix possibles.')) + '</p>' +
        '<ul class="repair__list">' + g.repairs.map(function (id) {
          var on = state.repairs.indexOf(id) > -1;
          return '<li><label class="repair__option' + (on ? ' is-on' : '') + '" data-repair="' + id + '">' +
            '<input type="checkbox" value="' + id + '"' + (on ? ' checked' : '') + '>' +
            '<span class="repair__box" aria-hidden="true"></span>' +
            '<span><span class="repair__name">' + esc(repairLabel(id, g)) + '</span>' +
            '<span class="repair__desc">' + esc(REPAIRS[id][1]) + '</span></span></label></li>';
        }).join('') + '</ul>' +
        '<label class="repair__note"><span>Précisions <small>(facultatif)</small></span>' +
        '<textarea rows="2" placeholder="Ex. : raccourcir de 3 cm, fermeture de 60 cm…">' + esc(state.note) + '</textarea></label>' +
        '<button type="button" class="btn btn--primary repair__add"' + (state.repairs.length ? '' : ' disabled') + '>Ajouter à ma demande</button>';
    }
    panel.innerHTML = html;
  }

  function renderBasket() {
    if (!state.basket.length) { basketEl.hidden = true; return; }
    basketEl.hidden = false;
    basketEl.innerHTML = '<p class="repair__basket-title">Ma demande <span>' + state.basket.length + ' article' + (state.basket.length > 1 ? 's' : '') + '</span></p>' +
      '<ul>' + state.basket.map(function (it, i) {
        return '<li><span><strong>' + esc(it.name) + '</strong><br>' + esc(it.repairs.join(', ')) +
          (it.note ? '<br><em>« ' + esc(it.note) + ' »</em>' : '') + '</span>' +
          '<button type="button" class="repair__remove" data-remove="' + i + '" aria-label="Retirer ' + esc(it.name) + '">×</button></li>';
      }).join('') + '</ul>' +
      '<a href="#contact" class="btn btn--primary btn--lg repair__send">Envoyer ma demande</a>';
  }

  function renderAll() {
    renderStage(); renderCrumbs(); renderPanel(); renderBasket();
    var g = state.garment && GARMENTS[state.garment];
    fitView(!(g && g.kind));
  }

  // Sur mobile, le panneau est sous le mannequin : on le ramène dans l'écran
  function revealPanel() {
    if (window.matchMedia('(min-width: 900px)').matches) return;
    var r = panel.getBoundingClientRect();
    if (r.top > window.innerHeight * 0.75) panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ---------- Actions ----------
  function setZone(z) {
    state.zone = z; state.garment = null; state.repairs = []; state.note = '';
    renderAll(); revealPanel();
  }
  function setGarment(id) {
    var g = GARMENTS[id];
    if (!state.zone || g.zones.indexOf(state.zone) < 0) state.zone = g.zones[0];
    state.garment = id; state.repairs = []; state.note = '';
    renderAll(); revealPanel();
  }
  function toggleRepair(id) {
    var i = state.repairs.indexOf(id);
    if (i > -1) state.repairs.splice(i, 1); else state.repairs.push(id);
    // Mise à jour ciblée : ne relance pas les animations du mannequin
    var on = i < 0;
    app.querySelectorAll('[data-repair="' + id + '"]').forEach(function (n) {
      n.classList.toggle('is-on', on);
      if (n.getAttribute('role') === 'checkbox') n.setAttribute('aria-checked', String(on));
      var cb = n.querySelector('input'); if (cb) cb.checked = on;
    });
    var add = panel.querySelector('.repair__add');
    if (add) add.disabled = !state.repairs.length;
  }
  function addToBasket() {
    var g = GARMENTS[state.garment];
    // Ordre de la liste, pas de l'ordre des clics
    var chosen = g.repairs.filter(function (id) { return state.repairs.indexOf(id) > -1; });
    state.basket.push({
      name: shortName(g),
      repairs: chosen.map(function (id) { return repairLabel(id, g); }), note: state.note.trim()
    });
    state.zone = null; state.garment = null; state.repairs = []; state.note = '';
    renderAll();
    var toast = app.querySelector('.repair__toast');
    toast.textContent = 'Ajouté à votre demande : ' + shortName(g).toLowerCase();
    toast.classList.add('is-visible');
    clearTimeout(addToBasket.t);
    addToBasket.t = setTimeout(function () { toast.classList.remove('is-visible'); }, 2600);
    basketEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // Préremplit le formulaire de contact avec le récapitulatif
  function sendToForm() {
    var msg = document.getElementById('cf-message');
    var type = document.getElementById('cf-type');
    var recap = 'Ma demande de réparation :\n' + state.basket.map(function (it) {
      return '- ' + it.name + ' : ' + it.repairs.join(', ') + (it.note ? '. ' + it.note : '');
    }).join('\n');
    if (msg) msg.value = recap + '\n\n' + msg.value.replace(/^Ma demande de réparation :[\s\S]*?\n\n/, '');
    if (type) type.value = 'Demande de réparation';
    setTimeout(function () { var n = document.getElementById('cf-name'); if (n) n.focus({ preventScroll: true }); }, 700);
  }

  app.addEventListener('click', function (e) {
    var t = e.target;
    var go = t.closest('[data-go]');
    if (go) {
      if (go.getAttribute('data-go') === 'body') { state.zone = null; state.garment = null; }
      else { state.garment = null; }
      state.repairs = []; state.note = '';
      return renderAll();
    }
    var hot = t.closest('.mq__hotspot'); if (hot) return toggleRepair(hot.getAttribute('data-repair'));
    var z = t.closest('[data-zone]'); if (z) return setZone(z.getAttribute('data-zone'));
    var gb = t.closest('[data-garment]'); if (gb) return setGarment(gb.getAttribute('data-garment'));
    var rm = t.closest('[data-remove]');
    if (rm) { state.basket.splice(+rm.getAttribute('data-remove'), 1); return renderBasket(); }
    if (t.closest('.repair__add')) return addToBasket();
    if (t.closest('.repair__send')) return sendToForm();
  });
  app.addEventListener('change', function (e) {
    if (e.target.matches('.repair__option input')) {
      // L'état de la case est déjà basculé : on resynchronise depuis l'état
      e.target.checked = !e.target.checked;
      toggleRepair(e.target.value);
    }
  });
  app.addEventListener('input', function (e) {
    if (e.target.matches('.repair__note textarea')) state.note = e.target.value;
  });
  // Clavier sur les éléments SVG
  svg.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var n = e.target.closest('.mq__zone, .mq__hotspot');
    if (!n) return;
    e.preventDefault();
    if (n.classList.contains('mq__hotspot')) toggleRepair(n.getAttribute('data-repair'));
    else { setZone(n.getAttribute('data-zone')); }
  });
  // Survol d'une case → le point correspondant s'allume, et inversement
  app.addEventListener('pointerover', function (e) {
    var n = e.target.closest('[data-repair]');
    app.querySelectorAll('.is-hover').forEach(function (x) { x.classList.remove('is-hover'); });
    if (n) app.querySelectorAll('[data-repair="' + n.getAttribute('data-repair') + '"]').forEach(function (x) { x.classList.add('is-hover'); });
  });

  renderAll();
})();
