/**
 * Finitions après « astro build ».
 *
 * L'extension Astro produit un index (« sitemap-index.xml ») qui renvoie vers
 * un fichier enfant. Cela fait deux requêtes là où une suffit pour 53 URL, et
 * autant d'occasions qu'une des deux échoue. On publie donc :
 *
 *   /sitemap.xml   la liste complète, sans index, en une seule requête
 *   /sitemap.txt   la même liste en texte brut, un lien par ligne
 *
 * Google accepte les deux formats. Le format texte ne peut pas mal s'analyser :
 * c'est le recours si le XML pose encore problème.
 */

import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const DIST = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'dist')

const enfant = join(DIST, 'sitemap-0.xml')
if (!existsSync(enfant)) {
  console.error('sitemap-0.xml introuvable : rien à publier')
  process.exit(1)
}

// /sitemap.xml : la liste complète, pas l'index
copyFileSync(enfant, join(DIST, 'sitemap.xml'))

// /sitemap.txt : un lien par ligne
const xml = readFileSync(enfant, 'utf8')
const liens = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
writeFileSync(join(DIST, 'sitemap.txt'), liens.join('\n') + '\n', 'utf8')

console.log(`sitemap.xml et sitemap.txt : ${liens.length} URL`)
