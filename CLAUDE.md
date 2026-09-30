# concierge-ai.fr — règles de travail

Site Astro statique. `npm run build` produit `dist/`. Hostinger déploie chaque
push sur `main`. Rien d'autre n'est à faire pour mettre en ligne.

## À qui on parle

Aux entreprises qui vivent du téléphone : artisans et bâtiment, garages,
cabinets médicaux et paramédicaux, avocats, experts-comptables, agences
immobilières, instituts, salles de sport, auto-écoles, consultants.

Ne jamais rétrécir ce positionnement aux seuls artisans. Une étude d'avatar
plus ancienne le faisait ; les chiffres de la Search Console ont montré
l'inverse, et c'est la cible large qui fait foi.

## Mise en page : rien n'est collé

Le défaut qui revient le plus souvent sur ce site. Trois fois déjà, une marge
écrite dans le CSS n'est jamais arrivée à l'écran.

**La cause, toujours la même.** La ligne 35 de `src/styles/base.css` remet à
zéro les marges de `p`, `ul`, `li`, `h1`-`h4`, `figure` et `table` avec un
sélecteur `.cai p`, `.cai figure`… Ce sélecteur vaut classe + balise, donc il
l'emporte sur toute règle à classe simple. `.cai-lia-img { margin-bottom }`
est silencieusement annulée ; `.cai .cai-lia-img { margin-bottom }` passe.

**Avant de pousser une modification de mise en page :**

```bash
npm run build
npx --yes http-server dist -p 4328 --silent &
node outils/espacements.mjs                  # Chromium, trois largeurs
node outils/espacements.mjs --tous-moteurs   # + Firefox et WebKit
```

Le script parcourt toutes les pages du sitemap en 1280, 820 et 390 pixels et
signale tout couple de blocs séparés de moins de 14 pixels. Il sort en code 1
s'il trouve quelque chose. Les enfants d'une grille ou d'un flex sont ignorés :
leur écart vient de `gap` et il est voulu.

Vérifier aussi à l'œil, au moins une page par type, sur les trois largeurs.
Les trois moteurs sont installés : Chromium, Firefox et WebKit.

## Écriture

- **Aérer.** Une idée par paragraphe, trois phrases au maximum. Sauter des
  lignes. Ne jamais coller un texte à un bouton, une image, un tableau.
- **Alterner les longueurs.** Une phrase courte après deux longues. C'est ce
  qui distingue un texte écrit d'un texte généré.
- **Relier.** Chaque article pointe vers deux ou trois autres pages du site,
  avec un texte de lien qui dit où il mène. Un lecteur qui finit un article
  doit avoir envie d'en ouvrir un autre.
- **L'émotion quand elle est juste.** Le dimanche haché, la nuit coupée pour
  rien, le chantier perdu à cause d'un appel. Jamais de pathos, jamais de
  culpabilisation : la scène suffit.
- **Vite compris.** La réponse en premier, le détail ensuite. Si une phrase
  demande deux lectures, elle est à réécrire.
- **Pas de chiffre inventé.** Toute donnée est sourcée et le lien est ouvert
  avant d'être cité. Si la source est inaccessible, on cite la référence sans
  lien, ou on ne cite pas.

## Référencement classique

- Le sitemap à déclarer dans la Search Console est
  `https://www.concierge-ai.fr/sitemap-index.xml`. `/sitemap.xml` en est une
  copie, produite à chaque construction ; `/sitemap-0.xml` est le fichier
  enfant qui porte les URL.
- Un `<title>` par page, unique sur le site, 60 signes au maximum.
- Une `<meta description>` par page, unique elle aussi.
- Une intention par page. Deux pages sur la même requête se font de l'ombre :
  c'est ce qui coûtait « permanence téléphonique tarifs » au site.
- Le texte des liens internes contient le mot que la page cible vise.
- Les outils se classent mieux que les articles sur ce site. Les quatre pages
  déjà en première page de Google sont toutes des pages qu'on utilise.

## Référencement génératif et citations par les IA

Les assistants citent ce qu'ils peuvent extraire, attribuer et vérifier.

- **La réponse dès le premier paragraphe** sous chaque `h2`, en une ou deux
  phrases autonomes, compréhensibles hors contexte. C'est la classe
  `cai-rep` : c'est ce bloc qui est repris.
- **Une question par `h2`**, formulée comme on la pose à voix haute.
- **Les faits en tableau** plutôt qu'en prose : un tableau s'extrait proprement.
- **FAQPage en JSON-LD** sur chaque page qui a une FAQ, avec les mêmes
  questions que la page affiche, au mot près. Le contrôle est automatisé :
  `node outils/faq-schema.mjs` signale les écarts, `--corriger` les aligne.
  Le schéma suit la page, jamais l'inverse : c'est la page que le lecteur voit.
- **Les sources en fin d'article**, avec le nom de l'organisme, la taille de
  l'échantillon et un lien.
- **Auteur et date visibles**, et repris dans le `BlogPosting`.
- **Les chiffres en toutes lettres dans la phrase** : « 72 heures sur les 168
  d'une semaine » s'extrait, « une large amplitude » non.
- `public/llms.txt` résume le site pour les agents : le tenir à jour quand une
  page importante est ajoutée.

## Outils du dépôt

| Fichier | Ce qu'il fait |
|---|---|
| `outils/nouvel-article.mjs` | Fabrique un article à partir d'une fiche `outils/articles/*.mjs` |
| `outils/infographie.py` | Dessine une infographie maison à partir d'une fiche JSON |
| `outils/espacements.mjs` | Vérifie qu'aucun bloc n'est collé, sur trois largeurs et trois moteurs |
| `outils/faq-schema.mjs` | Aligne le schéma FAQPage sur les questions réellement affichées |
| `outils/apres-build.mjs` | Finitions après `astro build` ; recopie l'index de sitemap en `/sitemap.xml` |

Les polices Archivo et Inter sont téléchargées au premier appel dans
`.polices/`, hors dépôt.
