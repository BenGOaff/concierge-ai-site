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

**Le deuxième piège : la largeur.** `.cai` est une grille. Un élément de
grille a par défaut `min-width: auto`, c'est-à-dire la largeur minimale de son
contenu : une image large ou un tableau faisait donc gonfler sa section
au-delà du conteneur, et la page glissait horizontalement. Corrigé par
`.cai > * { min-width: 0 }`. Le défaut ne se voyait qu'à certaines largeurs,
surtout sur tablette, jamais sur un écran d'ordinateur. `outils/debordements.mjs`
le surveille maintenant sur les 53 pages.

**Les deux commandes à lancer avant de pousser quoi que ce soit.**

```
npm run build && npx --yes http-server dist -p 4328 --silent &
node outils/espacements.mjs --tous-moteurs
node outils/debordements.mjs --tous-moteurs
```

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

## Les mots du client, pas les nôtres

Tout est dans le Drive, dossier `REFERENTIEL` : `referentiel-operationnel.md`
(le document de travail), `partie-1-avatar.md`, `partie-2-concurrence.md`. **À
relire avant d'écrire quoi que ce soit.** Le résumé qui suit ne remplace pas la
lecture.

**Ses mots.** Rater des appels, perdre des chantiers, avoir les mains prises,
ça sonne dans le vide, caler un créneau, filtrer, être réveillé pour rien,
garder mon numéro, sans engagement, installé en 48 h, résumé après chaque
appel, hors zone, pleine saison.

**Les mots bannis en accroche** : IA, intelligence artificielle, agent vocal,
voicebot, SVI, serveur vocal interactif, modèle de langage, algorithme,
automatisation, plateforme, dashboard, workflow, scalable. La règle du
référentiel : si un artisan de 52 ans ne dirait pas le mot au comptoir d'un
fournisseur, il ne va ni dans un titre ni dans un chapô. Plus bas dans une
section technique ou de conformité, c'est permis.

**Les formules bannies partout** : la famille « le point » (« le point le plus
important », « ce point », « un point qui ») ; « personne ne le dit », « ce
qu'on ne vous dit pas », « contrairement à ce qu'on croit » ; « ce n'est pas X,
c'est Y » ; les connecteurs de remplissage (par ailleurs, en outre, il est
important de noter) ; « brancher » un outil, on écrit « connecter ».

**Zéro tiret cadratin, jamais.** Virgule, deux-points, parenthèses, ou deux
phrases. C'est la signature d'IA qu'elle repère en premier.

**La promesse tient sur deux axes, toujours ensemble** : ne plus perdre
d'interventions, et récupérer sa vie. Une page qui ne porte que le chiffre
d'affaires perd la moitié de sa force. Les soirées à rappeler quinze numéros,
les réveils à 3 h pour rien, le dimanche haché, ça compte autant que les
chantiers.

**Les trois réassurances, sur chaque page** : ça sonne d'abord chez vous ; vous
gardez la main et vous recevez un résumé ; vous arrêtez quand vous voulez.

**Ne jamais dénigrer le télésecrétariat frontalement.** Beaucoup de prospects
en ont un et n'aiment pas qu'on leur dise qu'ils ont eu tort. Rester factuel
sur les horaires, la qualification et le rendez-vous.

**La phrase test** : un contenu est bon quand un artisan commente « c'est
exactement ça ».

`node outils/style.mjs` vérifie tout ça automatiquement, article par article.
Il sort en erreur tant qu'il reste quelque chose.

## Un tableau n'est pas une conclusion

Ce site n'est pas un comparateur neutre, c'est un site affilié. Donner des
chiffres bruts et laisser le lecteur se débrouiller, c'est lui faire le travail
à moitié et ne rien vendre. **Après chaque tableau, on écrit ce qu'il faut en
conclure**, et on le mâche.

La règle qui rend ça honnête&nbsp;: **on conclut avec de l'arithmétique que le
lecteur peut refaire**, pas avec des résultats qu'on n'a pas mesurés.

Ce qui est permis, parce que ça se recalcule à partir des grilles publiées&nbsp;:

- le coût d'une heure réellement couverte (le prix divisé par les heures) ;
- le nombre d'interventions à récupérer pour couvrir l'abonnement (le prix
  divisé par le panier) ;
- le volume à partir duquel une formule passe devant une autre ;
- ce qu'un mode de facturation fait payer et pas l'autre.

Ce qui est interdit, et c'est sa ligne rouge numéro un&nbsp;: **«&nbsp;ça
rapporte X clients de plus&nbsp;»**. Il n'y a aujourd'hui ni client, ni
témoignage, ni chiffre de rétention. Le référentiel est explicite&nbsp;: aucune
statistique non sourcée ne part dans un contenu signé, et les projections de
l'étude restent dans l'étude.

On dit aussi quand le concurrent gagne. «&nbsp;Moins de 100 appels par mois, la
facturation à la minute est franchement moins chère&nbsp;» rend crédible tout
ce qui suit, et ce qui suit est vrai aussi.

## Deux appels à l'action, deux poids

Le quiz et l'essai de sept jours ont longtemps été le même objet visuel, deux
cadres verts à gros titre et bouton plein, posés l'un sur l'autre en bas de
page. Deux actions de même poids ne se départagent pas, et aucune ne gagne.

**Le quiz est doux et il vit dans le texte.** Fond pâle, bordure fine, titre de
niveau&nbsp;3, bouton à contour (`cai-btn--o`). Il se pose au moment où le
lecteur vient de comprendre ce qu'il perd&nbsp;: après la troisième section
d'un article, avant la section mécanisme d'une page métier. C'est un outil
qu'on lui tend en passant.

**L'essai de sept jours est fort et il reste seul à la fin.** Cadre vert, gros
titre, bouton plein. C'est la seule action de la page, et le référentiel est
formel&nbsp;: jamais «&nbsp;appelez-nous&nbsp;», un seul bouton par écran.

Le placement est automatique&nbsp;: `outils/nouvel-article.mjs` pose le
marqueur `<!--QUIZ-->` lui-même, `outils/metiers-phase1.mjs` aussi. Ne pas le
remettre en bas de page.

## Le lexique

Douze entrées sous `/lexique`, fabriquées par `outils/lexique.mjs`. Le format
vient des concurrents qui tiennent la première page avec des glossaires, et les
moteurs de réponse recopient volontiers une définition courte et autonome.

Deux règles&nbsp;:

- **On ne prend que des termes sur lesquels le site n'a pas déjà une page.**
  Une entrée «&nbsp;permanence téléphonique&nbsp;» viendrait concurrencer
  `/comparer/permanence-telephonique`, une entrée «&nbsp;télésecrétariat&nbsp;»
  concurrencerait `/secretariat-telephonique`. C'est exactement la
  cannibalisation qu'on a passé du temps à corriger.
- **Chaque entrée dit ce que le terme recouvre ET ce qu'il ne recouvre pas**,
  avec le prix constaté quand il y en a un. Aucun lexique concurrent ne met de
  chiffres, et c'est ce qui rend celui-ci citable.

Le balisage est un `DefinedTerm` par page, rattaché au `DefinedTermSet` de
l'index.

## Le calendrier, et il est français

On publie **8 à 12 semaines avant le pic**, pour que la page soit indexée et
vieillie quand les gens cherchent. Publier pendant le pic, c'est arriver après.

| Quand ça cherche | Qui | L'angle |
|---|---|---|
| Mi-novembre à fin décembre | Tous | Fermeture de fin d'année, message de répondeur, astreinte des fêtes |
| Novembre à février | Plombier, chauffagiste | Gel, pannes de chaudière, astreinte de nuit |
| Janvier | Bâtiment, rénovation | Les chantiers décidés pendant les fêtes |
| Février | Garage | Départs au ski, contrôles techniques |
| Mars à mai | Paysagiste | Le pic de printemps, taille et entretien |
| Juin à août | Climatisation, électricien | Canicule, surcharge |
| Juillet, août | Tous | Congés d'été, partir sans perdre de clients |
| Septembre | Bâtiment, auto-école | Rentrée, reprise des chantiers, inscriptions |
| Toute l'année, nuits et week-ends | Serrurier | Porte claquée, urgence nocturne |

**On est en France.** Pas de Thanksgiving, pas de Black Friday comme angle
éditorial, pas de « back to school ». Les repères sont les jours fériés de
l'article L3133-1, les ponts, les vacances scolaires et les congés d'août.

Les dates se vérifient avant d'écrire&nbsp;: en 2026, le 25 décembre et le
1<sup>er</sup> janvier tombent tous les deux un vendredi, ce qui fait deux
ponts de quatre jours. Le 26 décembre est férié en Alsace-Moselle au titre du
droit local.

## Référencement classique

- **Le sitemap déclaré dans la Search Console est `/sitemap.txt`**, et c'est
  volontaire. Les versions XML — `sitemap-index.xml` puis `sitemap.xml` — ont
  toutes deux échoué avec « Impossible de lire le sitemap », alors que les
  fichiers étaient valides et servis en 200. Le format texte est passé du
  premier coup : 53 pages découvertes. Ne pas « corriger » ça en repassant au
  XML. Les deux fichiers restent publiés et déclarés dans `robots.txt`.
- `outils/apres-build.mjs` régénère `/sitemap.xml` et `/sitemap.txt` à chaque
  construction, à partir du fichier produit par Astro. Aucune liste n'est tenue
  à la main.
- Le CDN Hostinger renvoie sa page « Checking your browser » sur toute requête
  GET qui accepte la compression, quel que soit le fichier. Ce n'est pas
  corrigeable depuis le dépôt : un `.htaccess` `no-gzip` a été essayé et n'a eu
  aucun effet, le CDN décide avant d'atteindre le serveur. Googlebot, lui,
  passe : les pages du site reçoivent des impressions dans la Search Console.
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
| `outils/debordements.mjs` | Vérifie qu'aucune page ne glisse sur le côté, sur trois largeurs et trois moteurs |
| `outils/style.mjs` | Vérifie les règles d'écriture du référentiel : mots bannis, jargon en accroche, vocabulaire du client, les deux axes |
| `outils/lexique.mjs` | Fabrique les douze entrées du lexique et son index |
| `outils/metiers-phase1.mjs` | Les trois ajouts de la phase 1 sur les dix-huit pages métier |
| `outils/apres-build.mjs` | Finitions après `astro build` ; recopie l'index de sitemap en `/sitemap.xml` |

Les polices Archivo et Inter sont téléchargées au premier appel dans
`.polices/`, hors dépôt.
