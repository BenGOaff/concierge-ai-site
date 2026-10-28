# concierge-ai.fr

Le site de concierge-ai.fr, reconstruit en fichiers statiques, sans aucune dépendance
à une plateforme tierce. 49 pages, servies telles quelles.

## Ce que contient ce dépôt

| Dossier | Ce qu'il contient |
| --- | --- |
| `src/contenu/` | **Le contenu des pages, en HTML.** C'est ici qu'on écrit |
| `src/pages/` | Une ligne par page, qui associe une adresse à son contenu |
| `src/layouts/Base.astro` | L'en-tête, le pied de page et les balises de référencement, écrits une seule fois |
| `src/styles/base.css` | Les styles communs à tout le site |
| `public/images/` | Les images et la vidéo de démonstration |

## Ce qu'il ne contient pas, et ne contiendra jamais

Aucune donnée personnelle, aucun contact, aucune clé d'API. Les contacts captués par le
quiz vivent chez le prestataire d'emailing ; la clé qui permet d'y accéder se déclare
dans les variables d'environnement de l'hébergeur, jamais dans un fichier.

## Ajouter ou modifier une page

1. Écrire ou modifier le HTML dans `src/contenu/<nom>.html`.
2. Pour une nouvelle page, créer `src/pages/<adresse>.astro` sur le modèle d'une page
   existante : elle porte le titre, la description et l'adresse.
3. Pousser sur `main`. L'hébergeur reconstruit et met en ligne tout seul.

## Commandes

```bash
npm install      # installer
npm run dev      # travailler en local, avec rechargement automatique
npm run build    # produire le site dans dist/
npm run preview  # vérifier le résultat avant de pousser
```

## Réglages de mise en ligne

Le site est servi par Cloudflare Workers. Chaque push sur `main` déclenche la
construction et la mise en ligne.

| Réglage | Valeur |
| --- | --- |
| Framework | Astro |
| Commande d'installation | `npm install` |
| Commande de build | `npm run build` |
| Commande de déploiement | `npx wrangler deploy` |
| Dossier de sortie | `dist` |
| Version de Node | 22 |

| Fichier | Rôle |
| --- | --- |
| `wrangler.jsonc` | `force-trailing-slash`, pour que `/page` mène à `/page/` comme le déclarent les 75 canonical et le sitemap |
| `public/_headers` | en-têtes de sécurité, et cache d'un an sur `/_astro/` dont les noms portent une empreinte |
| `public/_redirects` | redirections traitées au niveau du réseau |

`concierge-ai.fr` sans www redirige en 301 vers `www`, par une règle Cloudflare
et non par le dépôt.

Pas de politique de sécurité du contenu restrictive : l'accueil charge quatre
origines tierces et porte trois scripts en ligne. En ajouter une demande ses
propres tests, sous peine de casser l'analytique ou le consentement en silence.

## Une redirection à connaître

La page garage était publiée à `/garage-carrosserie` alors que 60 liens du site
pointaient vers `/metiers/garage-carrosserie`, qui renvoyait une erreur 404. La page est
désormais à l'adresse attendue, et l'ancienne y redirige en 301.
