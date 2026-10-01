/**
 * Fabrique un article de blog à partir d'une fiche, en reprenant le gabarit
 * d'un article existant.
 *
 * Les fichiers d'article sont des exports systeme.io : une trentaine de
 * kilo-octets de styles en ligne et une douzaine de scripts, tous identiques
 * d'un article à l'autre. On ne les réécrit pas : on recopie un article qui
 * marche et on ne remplace que ce qui lui appartient — le titre, le sommaire,
 * le corps, les sources, les partages, les données structurées.
 *
 *   node outils/nouvel-article.mjs outils/articles/<nom>.mjs
 */

import { readFile, writeFile } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const RACINE = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const GABARIT = 'src/contenu/renvoi-appel-si-non-reponse.html'
const SITE = 'https://www.concierge-ai.fr'

const echapper = (t) => String(t)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** Le texte d'un schéma n'est pas du HTML : ni balises, ni entités. */
const depouillerTexte = (h) => String(h)
  .replace(/<[^>]+>/g, '')
  .replace(/&nbsp;/g, ' ')
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&#x27;|&apos;/g, "'").replace(/&quot;/g, '"')
  .replace(/\u00a0/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()

/** Remplace ce qui se trouve entre deux repères, et refuse si le repère n'est pas unique. */
function entre(source, ouvre, ferme, remplacement, quoi) {
  const i = source.indexOf(ouvre)
  if (i === -1) throw new Error(`repère introuvable (${quoi}) : ${ouvre.slice(0, 60)}`)
  if (source.indexOf(ouvre, i + 1) !== -1) throw new Error(`repère en double (${quoi}) : ${ouvre.slice(0, 60)}`)
  const j = source.indexOf(ferme, i + ouvre.length)
  if (j === -1) throw new Error(`fin de repère introuvable (${quoi})`)
  return source.slice(0, i + ouvre.length) + remplacement + source.slice(j)
}

/** Remplace toutes les occurrences, et refuse si le compte n'est pas celui attendu. */
function toutes(source, avant, apres, attendu, quoi) {
  const n = source.split(avant).length - 1
  if (n !== attendu) throw new Error(`${quoi} : ${n} occurrence(s), ${attendu} attendue(s)`)
  return source.split(avant).join(apres)
}

const moisFr = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']

function dateLongue(iso) {
  const [a, m, j] = iso.split('-').map(Number)
  /* En français, le premier du mois s'écrit « 1er », jamais « 1 ». */
  return `${j === 1 ? '1er' : j} ${moisFr[m - 1]} ${a}`
}

const sommaire = (sections, avecClasse) => sections
  .map((s) => `<li><a ${avecClasse ? 'class="" ' : ''}href="#${s.id}">${echapper(s.h2)}</a></li>`)
  .join('')

function corps(fiche) {
  const morceaux = [`<p class="cai-chapo">${fiche.chapo}</p>`]
  if (fiche.retenir) {
    morceaux.push(
      '<div class="cai-ret">',
      `<div class="cai-ret-h"><i aria-hidden="true"></i><b>${echapper(fiche.retenir.titre)}</b></div>`,
      '<ul>',
      ...fiche.retenir.points.map((p) => `<li>${p}</li>`),
      '</ul>',
      '</div>',
    )
  }
  for (const s of fiche.sections) {
    morceaux.push(`<h2 id="${s.id}">${echapper(s.h2)}</h2>`, s.html.trim())
  }
  morceaux.push(
    `<h2 id="${fiche.faq.id}">${echapper(fiche.faq.h2)}</h2>`,
    '<div class="cai-faqa">',
    ...fiche.faq.items.map((q, i) =>
      `<details${i === 0 ? ' open=""' : ''}><summary>${echapper(q.q)}</summary>${q.r}</details>`),
    '</div>',
  )
  if (fiche.conclusion) {
    morceaux.push(
      '<div class="cai-concl">',
      `<p class="cai-concl-t">${echapper(fiche.conclusion.titre)}</p>`,
      fiche.conclusion.html.trim(),
      '</div>',
    )
  }
  return morceaux.join('\n') + '\n'
}

const sources = (liste) => liste.length ? [
  '<div class="cai-src2">',
  '<p class="cai-src2-t">Sources</p>',
  '<ul>',
  ...liste.map((s) => `<li><a href="${s.url}" rel="nofollow noopener" target="_blank">${echapper(s.texte)}</a></li>`),
  '</ul>',
].join('\n') + '\n' : '<div class="cai-src2">\n'

const lireAussi = (liste) => liste.map((a) =>
  `<a class="cai-mini cai-lia" href="${a.url}"><figure class="cai-lia-img">` +
  `<img alt="" height="475" loading="lazy" src="${a.img}" width="760"/></figure>` +
  `<h3>${echapper(a.h3)}</h3><p>${echapper(a.extrait)}</p>` +
  `<span class="cai-lia-plus">Lire l'article</span></a>`).join('')

function partages(fiche) {
  const url = `${SITE}/${fiche.slug}`
  const t = encodeURIComponent(fiche.h1)
  const u = encodeURIComponent(url)
  return {
    wa: `https://wa.me/?text=${t}%20${u}`,
    li: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
    fb: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
    mail: `mailto:?subject=${t}&body=${u}`,
  }
}

function donneesStructurees(fiche) {
  const url = `${SITE}/${fiche.slug}`
  const graphe = [{
    '@type': 'BlogPosting',
    headline: fiche.h1,
    description: fiche.description,
    image: [SITE + fiche.og],
    datePublished: fiche.publie,
    dateModified: fiche.modifie ?? fiche.publie,
    inLanguage: 'fr-FR',
    articleSection: fiche.rubrique,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    keywords: fiche.motsCles.join(', '),
    author: { '@type': 'Organization', name: 'La rédaction de concierge-ai.fr', url: SITE },
    publisher: {
      '@type': 'Organization', name: 'concierge-ai.fr', url: SITE,
      logo: { '@type': 'ImageObject', url: `${SITE}/images/6aae9b26909ad3.02855117_logoconciergeai2.webp` },
    },
  }, {
    '@type': 'FAQPage',
    mainEntity: fiche.faq.items.map((q) => ({
      '@type': 'Question', name: depouillerTexte(q.q),
      acceptedAnswer: { '@type': 'Answer', text: depouillerTexte(q.r) },
    })),
  }, {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE },
      { '@type': 'ListItem', position: 2, name: 'Le blog', item: `${SITE}/blog` },
      { '@type': 'ListItem', position: 3, name: fiche.h1, item: url },
    ],
  }]
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graphe })
}

function pageAstro(fiche) {
  return `---
import Base from '../layouts/Base.astro'
import contenu from '../contenu/${fiche.slug}.html?raw'
import { sectionQuiz, MARQUEUR } from '../lib/quiz.js'
const contenuAvecQuiz = contenu.replace(MARQUEUR, sectionQuiz({
  titre: \`${fiche.quiz?.titre ?? 'Combien vous coûtent <em>vos appels manqués&nbsp;?</em>'}\`,
  chapo: \`${fiche.quiz?.chapo ?? "Cinq questions pour savoir ce qui se passe aujourd'hui sur votre ligne, et ce que vous pouvez changer en premier."}\`,
}))
---

<Base
  titre="${fiche.titre.replace(/"/g, '&quot;')}"
  description="${fiche.description.replace(/"/g, '&quot;')}"
  chemin="/${fiche.slug}"
  og="${fiche.og}"
>
  <Fragment set:html={contenuAvecQuiz} />
</Base>
`
}

export async function fabriquer(fiche) {
  let s = await readFile(resolve(RACINE, GABARIT), 'utf8')

  s = entre(s, '<section class="cai-box cai-art-tete"><h1>', '</h1></section>', echapper(fiche.h1), 'titre h1')
  s = entre(s, '<span id="cai-meta">', '</span>',
    `Publié le ${dateLongue(fiche.publie)} · ${fiche.lecture} min de lecture`, 'date')
  s = entre(s, '<ol class="cai-toc-l" id="cai-toc-l">', '</ol>',
    sommaire([...fiche.sections, fiche.faq].map((x) => ({ id: x.id, h2: x.h2 })), true), 'sommaire ordinateur')
  s = entre(s, '<ol class="cai-toc-l" id="cai-tocm-l">', '</ol>',
    sommaire([...fiche.sections, fiche.faq].map((x) => ({ id: x.id, h2: x.h2 })), false), 'sommaire mobile')
  s = entre(s, '</ol>\n</details>\n', '<div class="cai-src2">', corps(fiche), 'corps')
  s = entre(s, '<div class="cai-src2">\n<p class="cai-src2-t">Sources</p>\n<ul>\n', '</ul>',
    fiche.sources.map((x) =>
      `<li><a href="${x.url}" rel="nofollow noopener" target="_blank">${echapper(x.texte)}</a></li>`).join('\n') + '\n',
    'sources')
  s = entre(s, '<div class="cai-acta-t">', '</div>', fiche.cta, 'accroche finale')
  s = entre(s, '<div class="cai-steps cai-lia-grille">', '</a></div>', lireAussi(fiche.lireAussi), 'à lire aussi')
  s = entre(s, '<script type="application/ld+json">', '</script>',
    '\n' + donneesStructurees(fiche) + '\n', 'données structurées')

  // Les quatre liens de partage apparaissent deux fois, en haut et en bas.
  const p = partages(fiche)
  for (const [reseau, lien] of Object.entries(p)) {
    const motif = new RegExp(`(data-net="${reseau}" href=")[^"]*(")`, 'g')
    const n = (s.match(motif) || []).length
    if (n !== 2) throw new Error(`partage ${reseau} : ${n} lien(s), 2 attendus`)
    s = s.replace(motif, `$1${lien.replace(/\$/g, '$$$$')}$2`)
  }

  await writeFile(resolve(RACINE, `src/contenu/${fiche.slug}.html`), s, 'utf8')
  await writeFile(resolve(RACINE, `src/pages/${fiche.slug}.astro`), pageAstro(fiche), 'utf8')
  return { contenu: `src/contenu/${fiche.slug}.html`, page: `src/pages/${fiche.slug}.astro`, octets: s.length }
}

if (process.argv[2]) {
  const fiche = (await import(pathToFileURL(resolve(process.argv[2])).href)).default
  const r = await fabriquer(fiche)
  console.log(`${r.page}\n${r.contenu}  (${(r.octets / 1024).toFixed(0)} Ko)`)
}
