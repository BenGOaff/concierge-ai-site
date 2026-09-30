/**
 * Contrôle les espacements du site : rien ne doit être collé.
 *
 * Le défaut revient toujours au même endroit : deux blocs qui se suivent dans
 * un parent en « display:block », où l'espace ne peut venir que d'une marge.
 * Quand l'un des deux n'en a pas, ils se touchent. Les enfants d'une grille ou
 * d'un flex sont ignorés : leur écart est voulu et porté par « gap ».
 *
 *   node outils/espacements.mjs                  # Chromium, trois largeurs
 *   node outils/espacements.mjs --tous-moteurs   # + Firefox et WebKit
 */

import { chromium, firefox, webkit } from 'playwright'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const RACINE = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const BASE = process.env.CAI_BASE || 'http://127.0.0.1:4328'
const MINIMUM = 14 // en dessous, deux blocs distincts se touchent

const LARGEURS = [['ordinateur', 1280], ['tablette', 820], ['mobile', 390]]

/** Les blocs qui doivent respirer. Pas les puces d'une liste ni les cellules. */
const BLOCS = [
  'section', 'figure', 'table', 'img',
  '.cai-box', '.cai-msg', '.cai-ret', '.cai-bon', '.cai-enc', '.cai-sch',
  '.cai-concl', '.cai-tw', '.cai-fig', '.cai-gen', '.cai-faqa', '.cai-src2',
  '.cai-redac', '.cai-acta', '.cai-lire-t', '.cai-abas-share', '.cai-quiz',
  '.cai-btn', '.cai-row', '.cai-ul', '.cai-steps', '.cai-tick',
  'h2', 'h3',
].join(',')

function pages() {
  const xml = readFileSync(resolve(RACINE, 'dist/sitemap-0.xml'), 'utf8')
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => new URL(m[1]).pathname)
    .filter((p) => !p.startsWith('/garage-carrosserie'))
}

async function auditer(nav, nomMoteur) {
  const soucis = []
  for (const [nomL, w] of LARGEURS) {
    const ctx = await nav.newContext({ viewport: { width: w, height: 1000 } })
    const p = await ctx.newPage()
    for (const chemin of pages()) {
      await p.goto(BASE + chemin, { waitUntil: 'domcontentloaded' })
      const refus = p.locator('button', { hasText: 'Tout refuser' }).first()
      if (await refus.count()) { await refus.click().catch(() => {}); await p.waitForTimeout(120) }
      const trouves = await p.evaluate(({ sel, mini }) => {
        const etiquette = (e) => e.tagName.toLowerCase() +
          (e.className && typeof e.className === 'string' ? '.' + e.className.trim().split(/\s+/).slice(0, 2).join('.') : '')
        const out = []
        for (const el of document.querySelectorAll(sel)) {
          const suivant = el.nextElementSibling
          if (!suivant || !suivant.matches(sel)) continue
          const parent = el.parentElement
          if (!parent) continue
          const dp = getComputedStyle(parent).display
          if (dp !== 'block' && dp !== 'flow-root') continue   // grille et flex : écart voulu
          const a = el.getBoundingClientRect(), b = suivant.getBoundingClientRect()
          if (!a.height || !b.height) continue
          if (b.top < a.bottom - 1) continue                    // superposés ou flottants
          const ecart = Math.round(b.top - a.bottom)
          if (ecart < mini) out.push({ a: etiquette(el), b: etiquette(suivant), ecart })
        }
        return out
      }, { sel: BLOCS, mini: MINIMUM })
      for (const t of trouves) soucis.push({ moteur: nomMoteur, largeur: nomL, chemin, ...t })
    }
    await ctx.close()
  }
  return soucis
}

const moteurs = process.argv.includes('--tous-moteurs')
  ? [['chromium', chromium, { executablePath: '/opt/pw-browsers/chromium' }], ['firefox', firefox, {}], ['webkit', webkit, {}]]
  : [['chromium', chromium, { executablePath: '/opt/pw-browsers/chromium' }]]

let total = []
for (const [nom, type, opts] of moteurs) {
  const nav = await type.launch(opts)
  total = total.concat(await auditer(nav, nom))
  await nav.close()
  console.error(`${nom} : terminé`)
}

if (!total.length) {
  console.log(`Aucun bloc collé. ${pages().length} pages × ${LARGEURS.length} largeurs × ${moteurs.length} moteur(s).`)
} else {
  // on regroupe : le même défaut se répète sur beaucoup de pages
  const parDefaut = new Map()
  for (const s of total) {
    const cle = `${s.a} → ${s.b}`
    const g = parDefaut.get(cle) || { ecarts: new Set(), pages: new Set(), contextes: new Set() }
    g.ecarts.add(s.ecart); g.pages.add(s.chemin); g.contextes.add(`${s.moteur}/${s.largeur}`)
    parDefaut.set(cle, g)
  }
  console.log(`${total.length} cas, ${parDefaut.size} défauts distincts :\n`)
  for (const [cle, g] of [...parDefaut].sort((x, y) => y[1].pages.size - x[1].pages.size)) {
    console.log(`  ${cle}`)
    console.log(`     écart ${[...g.ecarts].sort((a, b) => a - b).join(', ')}px · ${g.pages.size} page(s) · ${[...g.contextes].join(' ')}`)
    console.log(`     ex. ${[...g.pages].slice(0, 3).join(' ')}\n`)
  }
  process.exitCode = 1
}
