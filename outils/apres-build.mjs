/**
 * Quelques finitions après « astro build ».
 *
 * 1. /sitemap.xml — l'extension Astro produit « sitemap-index.xml », mais tout
 *    le monde, humains comme outils, va d'abord chercher « /sitemap.xml ».
 *    On recopie l'index sous ce nom à chaque construction, jamais à la main :
 *    si le site grandit et qu'Astro ajoute un sitemap-1.xml, la copie suit.
 */

import { copyFileSync, existsSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const DIST = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'dist')

const index = join(DIST, 'sitemap-index.xml')
if (existsSync(index)) {
  copyFileSync(index, join(DIST, 'sitemap.xml'))
  console.log('sitemap.xml : copie de sitemap-index.xml')
} else {
  console.error('sitemap-index.xml introuvable : rien à recopier')
  process.exitCode = 1
}
