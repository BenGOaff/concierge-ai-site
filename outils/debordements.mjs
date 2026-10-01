/**
 * Cherche les débordements horizontaux : les pages où le doigt peut faire
 * glisser le contenu sur le côté.
 *
 * C'est le défaut le plus visible sur tablette et le plus facile à rater
 * depuis un écran d'ordinateur, puisqu'il ne se produit qu'à certaines
 * largeurs. « outils/espacements.mjs » surveille les blocs collés, celui-ci
 * surveille la largeur.
 *
 *   npm run build && npx --yes http-server dist -p 4328 --silent &
 *   node outils/debordements.mjs
 *   node outils/debordements.mjs --tous-moteurs
 */

import { chromium, firefox, webkit } from 'playwright'
import { readFileSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const RACINE = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const BASE = process.env.CAI_BASE || 'http://127.0.0.1:4328'
const LARGEURS = [390, 820, 1280]
/** Deux pixels de tolérance : les arrondis de rendu en produisent un. */
const TOLERANCE = 2

const moteurs = process.argv.includes('--tous-moteurs')
  ? [['chromium', chromium, { executablePath: '/opt/pw-browsers/chromium' }], ['firefox', firefox, {}], ['webkit', webkit, {}]]
  : [['chromium', chromium, { executablePath: '/opt/pw-browsers/chromium' }]]

const pages = [...readFileSync(join(RACINE, 'dist/sitemap-0.xml'), 'utf8')
  .matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname)

let trouves = 0
for (const [nom, moteur, options] of moteurs) {
  const nav = await moteur.launch(options)
  for (const largeur of LARGEURS) {
    const ctx = await nav.newContext({ viewport: { width: largeur, height: 900 } })
    const p = await ctx.newPage()
    for (const chemin of pages) {
      await p.goto(BASE + chemin, { waitUntil: 'networkidle' })
      const r = await p.evaluate((tol) => {
        const W = document.documentElement.clientWidth
        if (document.documentElement.scrollWidth <= W + tol) return null
        /* On ne garde que les coupables : ceux qui débordent sans qu'aucun de
           leurs enfants ne déborde, sinon on remonte toute la page. */
        const trop = [...document.querySelectorAll('body *')]
          .filter((e) => e.getBoundingClientRect().right > W + tol)
        const feuilles = trop.filter((e) => ![...e.children]
          .some((k) => k.getBoundingClientRect().right > W + tol))
        return {
          de: document.documentElement.scrollWidth - W,
          qui: feuilles.slice(0, 3).map((e) => e.tagName.toLowerCase()
            + (e.className ? '.' + String(e.className).trim().split(/\s+/).join('.') : '')),
        }
      }, TOLERANCE)
      if (r) {
        trouves++
        console.log(`  !! ${nom} ${largeur}px ${chemin} déborde de ${r.de}px`)
        r.qui.forEach((q) => console.log(`       ${q}`))
      }
    }
    await ctx.close()
  }
  await nav.close()
  console.log(`${nom} : terminé`)
}

console.log(trouves === 0
  ? `\nAucun débordement. ${pages.length} pages × ${LARGEURS.length} largeurs × ${moteurs.length} moteur(s).`
  : `\n${trouves} débordement(s).`)
process.exit(trouves === 0 ? 0 : 1)
