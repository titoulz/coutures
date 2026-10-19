# Template de site vitrine

Site vitrine d'une page pour artisan, commerce ou entreprise locale : HTML/CSS/JS sans framework ni build, optimisé pour le référencement local, compatible avec l'éditeur IA `site-editor`.

Sections : barre d'urgence, en-tête avec menu mobile, hero, 4 prestations phares avec photos, grille de services, à propos, galerie avec visionneuse, zones d'intervention, contact (téléphones, WhatsApp, formulaire, adresse), pied de page, barre d'appel fixe sur mobile.

## Démarrer un nouveau client

1. Créer le dépôt avec `nouveau-site.ps1` (ou « Use this template » sur GitHub).
2. Remplacer les contenus d'exemple (voir la liste ci-dessous), même provisoirement pour une maquette.
3. Remplacer les images de `images/`.
4. Présenter les **5 styles** au client (voir ci-dessous), puis garder celui qu'il choisit.
5. Déployer et brancher l'éditeur IA.

## Les 5 styles (présentation client)

Un seul contenu (`index.html`), cinq habillages complets dans `css/themes/` (couleurs, polices, mise en page) :

| Id | Style | Ambiance |
|---|---|---|
| `mineral` | Minéral | sobre, architectural : pierre, anthracite, sable |
| `terracotta` | Terracotta | chaleureux, artisanal : crème, terre cuite, olive, titres à empattements |
| `atelier` | Atelier | industriel, sombre : orange, titres condensés en capitales |
| `prestige` | Prestige | haut de gamme : noir, ivoire, or, typographie élégante |
| `azur` | Azur | frais, lumineux : blanc, bleu, turquoise, formes arrondies |

Pour la démo :

- **`/styles.html`** : les 5 styles côte à côte, vue ordinateur ou mobile (page `noindex`).
- **`/index.html?style=<id>`** : le site complet dans un style donné (lien à envoyer au client).
- Sur le site : bouton flottant en bas à gauche, ou touches `1` à `5`.

Adapter un style au client : modifier les variables au début du fichier du thème (`--c-accent`, `--c-bg`…), sans toucher aux autres thèmes. Penser à mettre à jour les pastilles de couleur dans `js/style-switcher.js` et `styles.html`.

### Passage en production (une fois le style choisi)

1. Dans `index.html`, mettre le thème choisi dans `<link id="theme-css" href="css/themes/XXX.css">`.
2. Supprimer la balise `<script src="js/style-switcher.js">`, puis les fichiers `js/style-switcher.js`, `styles.html` et les thèmes non retenus.

## Contenus d'exemple à remplacer

Tout le texte est dans `index.html`. Les valeurs d'exemple sont volontairement repérables :

| Exemple | À remplacer par |
|---|---|
| `Nom de l'entreprise` | nom du client |
| `Votre métier`, `Votre-Ville`, `Votre région`, `00000` | activité, ville, région, code postal |
| `01 23 45 67 89` / `+33123456789` | téléphone principal (affiché / format international pour les liens `tel:`) |
| `06 12 34 56 78` / `+33612345678` / `wa.me/33612345678` | téléphone d'urgence ou mobile, WhatsApp |
| `contact@exemple.fr` | email |
| `1 rue de l'Exemple` | adresse (aussi dans le lien Google Maps, encodée) |
| `Prénom Nom`, `000 000 000 00000` | responsable, SIRET |
| `https://www.exemple.fr` | nom de domaine (canonical, Open Graph, JSON-LD, `robots.txt`, `sitemap.xml`) |
| `Prestation phare 1…4`, `Service 1…6`, `Point fort 1…3`, `Argument 1…3`, `Zone 2…4` | contenus du client |
| `Lun-Ven : 8h-12h / 14h-18h` | horaires (aussi dans `openingHoursSpecification` du JSON-LD) |
| `"latitude": 0, "longitude": 0` | coordonnées GPS (clic droit sur le lieu dans Google Maps) |
| `VOTRE_CLE_WEB3FORMS` | clé du formulaire (gratuite sur web3forms.com, avec l'email du client) |

Pour vérifier qu'il ne reste rien :

```bash
grep -nE "exemple|Votre|Prénom Nom|01 23 45 67 89|06 12 34 56 78|00000|Prestation phare|Service [0-9]|Point fort|Argument [0-9]|Zone [0-9]|Légende|Décrivez|VOTRE_CLE" index.html robots.txt sitemap.xml
```

Supprimer ce qui ne sert pas (bouton WhatsApp, barre d'urgence, label…) en retirant le bloc HTML correspondant.

## Images

| Fichier | Usage | Taille conseillée |
|---|---|---|
| `images/logo.svg` | logo image (optionnel : par défaut le logo est en texte, voir le commentaire dans l'en-tête ; l'en-tête est clair ou sombre selon le thème) | ~480 × 240, fond transparent |
| `images/logo-footer.svg` | logo image du pied de page (optionnel, fond sombre) | idem, version claire |
| `images/hero.svg` | photo principale | 1280 × 960 |
| `images/prestation-1…4.svg` | photos des prestations phares | 640 × 480 |
| `images/a-propos.svg` | photo de l'équipe ou des locaux | 1280 × 720 |
| `images/galerie-1…6.svg` | galerie (formats libres) | 1280 px de large max |
| `images/label.svg` | logo d'un label / réseau / partenaire | ~324 × 155 |
| `images/og-image.jpg` | image de partage réseaux sociaux | 1200 × 630, JPG |
| `favicon.svg` | icône d'onglet | carré |

Les photos réelles doivent être converties en **WebP** (environ 5 fois plus léger) : penser à mettre à jour l'extension, `width` et `height` dans `index.html`. Pour les grandes photos, prévoir une version 640 px et un `srcset`.

## Couleurs et polices

- Couleurs : variables au début de chaque `css/themes/*.css` (`--c-accent` = couleur principale, `--c-accent-hover`, fonds `--c-bg`, `--c-alt`…).
- Polices : chaque thème charge les siennes (Google Fonts) avec un `@import` en tête de fichier. En production, on peut le remplacer par des `<link>` dans le `<head>` (un peu plus rapide).
- `css/base.css` contient la structure commune à tous les thèmes (grilles, menu, composants) : en principe à ne pas modifier par client.

## Mise en ligne (Cloudflare Pages)

Workers & Pages → Créer → Pages → *Import an existing Git repository* → choisir le dépôt.
Pas de commande de build, répertoire de sortie `/`. Laisser les aperçus activés pour toutes les branches.

## Éditeur IA (site-editor)

Le template est prévu pour être modifié par le client via `site-editor` : dans le dépôt de l'éditeur, copier `clients/exemple.json` en `clients/<id>.json`, puis :

- `allowedPaths` : `["index.html", "css/themes/<style retenu>.css"]` ;
- `protectedValues` : téléphones, email, adresse, SIRET du client ;
- `siteNotes` : particularités du site à signaler à l'IA.

## Avant la mise en ligne (SEO)

- [ ] Plus aucun contenu d'exemple (commande `grep` ci-dessus).
- [ ] Nom de domaine définitif partout, `robots.txt` et `sitemap.xml` à jour.
- [ ] Nom, adresse et téléphone **identiques** à la fiche Google Business Profile ; lien de la fiche dans `sameAs` du JSON-LD.
- [ ] Type Schema.org adapté à l'activité (`LocalBusiness` par défaut : `Plumber`, `Electrician`, `AutoRepair`, `Restaurant`, `HairSalon`…).
- [ ] Photos réelles en WebP avec un `alt` descriptif.
- [ ] Mentions légales et politique de confidentialité (obligatoires avec le formulaire de contact).
- [ ] Site déclaré dans Google Search Console avec le sitemap.
