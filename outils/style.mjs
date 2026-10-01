/**
 * Contrôle le style d'un article contre les règles du référentiel.
 *
 * Elles sont écrites noir sur blanc dans « referentiel-operationnel.md » et
 * dans le guide anti-style IA, et je les ai toutes enfreintes au moins une
 * fois. Autant les faire vérifier par une machine plutôt que par la relecture.
 *
 *   node outils/style.mjs                       # tous les articles
 *   node outils/style.mjs standard-telephonique-ia
 */

import { readFileSync, readdirSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const RACINE = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const demande = process.argv.slice(2).filter((a) => !a.startsWith('--'))

/** Ce qui ne doit jamais apparaître, nulle part. */
const INTERDITS = [
  [/—/g, 'tiret cadratin (virgule, deux-points, parenthèses ou deux phrases)'],
  [/(?<!mettre |mis |mise |met )\b(le|ce|un|du|au|les|des) points?\b/gi, 'famille « le point »'],
  [/personne ne (le )?(dit|pense|parle)|on ne vous (le )?dit pas|ce qu.on ne vous dit pas|contrairement à ce qu|les autres se trompent|aucun (des )?(prestataire|concurrent)s? ne/gi,
   '« personne ne le dit » : le fait qu’un sujet soit peu traité sert à le choisir, jamais à l’écrire'],
  [/par ailleurs|en outre|il est important de noter|dans l.ensemble|en résumé|force est de constater/gi, 'connecteur de remplissage'],
  [/s.impose comme|fait figure de|au cœur de|en constante évolution|met en lumière|témoigne de|incarne\b/gi, 'tournure de brochure'],
  [/machine à cash|game.?changer|révolutionnaire|scalable|disruptif|booster|impacter|délivrer de la valeur/gi, 'lexique banni'],
  [/\bbrancher\b/gi, '« brancher » un outil : on écrit « connecter »'],
  [/TL;?DR|tout savoir en \d+ secondes/gi, 'intitulé banni'],
]

/** Ce qui ne doit pas apparaître dans le H1 ni dans le chapô : un artisan de
 *  52 ans ne dirait pas ces mots au comptoir d'un fournisseur. Plus bas dans
 *  l'article, dans une section technique ou de conformité, c'est permis. */
const JARGON = /intelligence artificielle|serveur vocal interactif|\bSVI\b|modèle de langage|synthèse vocale|reconnaissance vocale|transcription|agent vocal|voicebot|callbot|\bLLM\b|algorithme|automatisation|\bSaaS\b|plateforme|dashboard|workflow|onboarding/gi

/** Son vocabulaire à lui. Un article qui n'en contient presque rien est écrit
 *  dans notre langage, pas dans le sien. */
const SES_MOTS = /mains prises|rater|raté|perdre|perd|chantier|sonne|créneau|pleine saison|hors zone|réveillé|soirée|le soir|dimanche|camion|résumé|votre numéro|sans engagement|agenda|urgence|décroche|rappeler/gi

/** Les deux axes de la promesse. Une page qui n'en porte qu'un perd la moitié
 *  de sa force, c'est écrit dans le référentiel. */
const AXE_CHIFFRE = /chantier|intervention|client|rendez-vous|créneau|chiffre/gi
const AXE_VIE = /soirée|le soir|dimanche|nuit|réveillé|famille|repas|vacances|week-end|tranquille|couper/gi

const texteNu = (h) => h.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ')
  .replace(/&amp;/g, '&').replace(/&#?\w+;/g, ' ').replace(/\s+/g, ' ').trim()

const articles = demande.length ? demande : readdirSync(join(RACINE, 'outils/articles'))
  .filter((f) => f.endsWith('.mjs')).map((f) => f.slice(0, -4))

/* Les entrées du lexique sont des définitions, pas des articles : on ne leur
   demande ni le vocabulaire du chantier ni les deux axes de la promesse. Les
   règles dures, elles, valent pour elles aussi. */
const lexique = demande.length ? [] : readdirSync(join(RACINE, 'src/contenu'))
  .filter((f) => f.startsWith('lexique') && f.endsWith('.html'))

let defauts = 0
for (const slug of articles) {
  let html
  try { html = readFileSync(join(RACINE, 'src/contenu', slug + '.html'), 'utf8') } catch { continue }

  const debut = html.indexOf('<p class="cai-chapo">')
  const fin = html.indexOf('<div class="cai-src2"', debut)
  const corps = texteNu(html.slice(debut, fin > debut ? fin : html.length))
  const h1 = texteNu((html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [, ''])[1])
  const chapo = texteNu(html.slice(debut, html.indexOf('</p>', debut)))

  const ennuis = []
  for (const [motif, libelle] of INTERDITS) {
    const m = corps.match(motif)
    if (m) ennuis.push(`${m.length}× ${libelle}` + (m.length <= 3 ? `  (${[...new Set(m)].join(', ')})` : ''))
  }
  const jargon = (h1 + ' ' + chapo).match(JARGON)
  if (jargon) ennuis.push(`jargon dans le H1 ou le chapô : ${[...new Set(jargon)].join(', ')}`)

  const siens = (corps.match(SES_MOTS) || []).length
  const pourMille = Math.round((siens / Math.max(corps.split(' ').length, 1)) * 1000)
  if (pourMille < 12) ennuis.push(`son vocabulaire : ${pourMille} pour mille, écrit dans notre langage (viser 20)`)

  const chiffre = (corps.match(AXE_CHIFFRE) || []).length
  const vie = (corps.match(AXE_VIE) || []).length
  if (vie < 4) ennuis.push(`l’axe « récupérer sa vie » manque : ${vie} mention(s) contre ${chiffre} pour l’axe chiffre`)

  if (ennuis.length) {
    defauts++
    console.log(`\n!! ${slug}`)
    ennuis.forEach((e) => console.log('     ' + e))
  } else {
    console.log(`ok ${slug}   (son vocabulaire : ${pourMille} ‰, les deux axes : ${chiffre} / ${vie})`)
  }
}

for (const f of lexique) {
  const corps = texteNu(readFileSync(join(RACINE, 'src/contenu', f), 'utf8'))
  const ennuis = []
  for (const [motif, libelle] of INTERDITS) {
    const m = corps.match(motif)
    if (m) ennuis.push(`${m.length}× ${libelle}  (${[...new Set(m)].slice(0, 3).join(', ')})`)
  }
  if (ennuis.length) {
    defauts++
    console.log(`\n!! ${f}`)
    ennuis.forEach((e) => console.log('     ' + e))
  }
}
if (lexique.length) console.log(`ok ${lexique.length} page(s) de lexique (règles dures)`)

console.log(defauts === 0
  ? `\n${articles.length + lexique.length} page(s) contrôlée(s), rien à redire.`
  : `\n${defauts} page(s) à revoir.`)
process.exit(defauts === 0 ? 0 : 1)
