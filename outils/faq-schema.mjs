/**
 * Aligne les données structurées FAQPage sur ce que la page affiche vraiment.
 *
 * Google demande que question et réponse du balisage soient visibles à
 * l'identique. Un schéma qui dit autre chose fait perdre le résultat enrichi,
 * et donne aux assistants une version qui contredit le texte lu par l'humain.
 *
 * La lecture se fait dans un vrai navigateur, sur le site construit : les
 * expressions régulières confondaient le sommaire repliable avec la FAQ.
 *
 *   npm run build && npx --yes http-server dist -p 4328 --silent &
 *   node outils/faq-schema.mjs            # signale les écarts
 *   node outils/faq-schema.mjs --corriger # les corrige dans src/contenu
 */

import { chromium } from 'playwright'
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const RACINE = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const BASE = process.env.CAI_BASE || 'http://127.0.0.1:4328'
const corriger = process.argv.includes('--corriger')

/** Le fichier de contenu qui alimente une URL donnée. */
function fichierSource(chemin) {
  const nu = chemin.replace(/^\/|\/$/g, '')
  const candidats = nu === ''
    ? ['accueil.html']
    : [nu.replace(/\//g, '__') + '.html', nu.split('/').pop() + '.html']
  for (const c of candidats) {
    try { readFileSync(join(RACINE, 'src/contenu', c)); return c } catch {}
  }
  return null
}

const nav = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
const p = await (await nav.newContext({ viewport: { width: 1280, height: 900 } })).newPage()

const pages = [...readFileSync(join(RACINE, 'dist/sitemap-0.xml'), 'utf8')
  .matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname)

let vus = 0, ecarts = 0, corriges = 0, sansSource = []
for (const chemin of pages) {
  await p.goto(BASE + chemin, { waitUntil: 'domcontentloaded' })

  const donnees = await p.evaluate(() => {
    const net = (e) => (e.textContent || '').replace(/ /g, ' ').replace(/\s+/g, ' ').trim()
    // on ne prend que les questions des blocs de FAQ, jamais le sommaire repliable
    const boites = document.querySelectorAll('.cai-faq, .cai-faqa')
    const qs = []
    for (const b of boites) {
      for (const d of b.querySelectorAll(':scope > details')) {
        const s = d.querySelector('summary')
        if (!s) continue
        const corps = d.querySelector('.cai-ans') || d
        const texte = corps === d
          ? net(d).slice(net(s).length).trim()
          : net(corps)
        qs.push({ q: net(s), r: texte })
      }
    }
    const blocs = [...document.querySelectorAll('script[type="application/ld+json"]')].map((x) => x.textContent)
    return { qs, blocs }
  })

  let graphe = null, objet = null
  for (const b of donnees.blocs) {
    try {
      const d = JSON.parse(b)
      const g = d['@graph'] || [d]
      if (g.some((n) => n['@type'] === 'FAQPage')) { graphe = g; objet = d; break }
    } catch {}
  }
  if (!graphe) continue
  vus++

  const faq = graphe.find((n) => n['@type'] === 'FAQPage')
  if (!donnees.qs.length) { console.log(`  !! ${chemin} : FAQPage déclaré, aucune question visible`); ecarts++; continue }

  const attendu = donnees.qs.map(({ q, r }) => ({
    '@type': 'Question', name: q,
    acceptedAnswer: { '@type': 'Answer', text: r },
  }))
  const different = JSON.stringify(faq.mainEntity) !== JSON.stringify(attendu)
  if (!different) continue

  const libelles = donnees.qs.filter((x, i) => x.q !== faq.mainEntity[i]?.name).length
  const src = fichierSource(chemin)
  if (!src) { sansSource.push(chemin); continue }
  console.log(`  ${corriger ? '✓' : '!!'} ${chemin.padEnd(42)} ${faq.mainEntity.length} → ${attendu.length} question(s), ${libelles} libellé(s) à aligner`)
  ecarts++
  if (!corriger) continue

  const fichier = join(RACINE, 'src/contenu', src)
  let html = readFileSync(fichier, 'utf8')
  const bloc = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)
  const d = JSON.parse(bloc[1])
  const g2 = d['@graph'] || [d]
  const faq2 = g2.find((n) => n['@type'] === 'FAQPage')
  if (!faq2) continue
  faq2.mainEntity = attendu
  html = html.slice(0, bloc.index) +
    '<script type="application/ld+json">\n' + JSON.stringify(d) + '\n</script>' +
    html.slice(bloc.index + bloc[0].length)
  writeFileSync(fichier, html, 'utf8')
  corriges++
}
await nav.close()

if (sansSource.length) console.log(`\n  (fichier source introuvable pour ${sansSource.length} page(s) : ${sansSource.join(' ')})`)
console.log(`\n${vus} pages avec un FAQPage · ${ecarts} en écart${corriger ? ` · ${corriges} corrigée(s)` : ''}`)
if (ecarts && !corriger) process.exitCode = 1
