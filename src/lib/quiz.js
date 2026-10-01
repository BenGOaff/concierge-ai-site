/**
 * L'appel au quiz Tiquiz, sous forme de section HTML à insérer dans le contenu.
 *
 * C'est un simple lien, pas un cadre intégré : ça se charge instantanément,
 * ça se lit mieux sur téléphone, et le quiz s'affiche en pleine page plutôt
 * que dans une fenêtre de 640 pixels.
 *
 * Les pages du site sont enveloppées dans un unique conteneur « .cai » qui
 * porte tout leur style. On ne peut donc pas couper le contenu en deux pour
 * glisser un composant au milieu : on insère la section à un emplacement
 * marqué, et le conteneur reste intact.
 *
 * ATTENTION, LE PIÈGE À NE PAS REFAIRE. Ce bloc a longtemps été un cadre vert
 * avec un gros titre et un bouton foncé, c'est-à-dire exactement la même chose
 * que le bloc d'appel à l'action de fin de page, posé juste au-dessus de lui.
 * Deux actions de même poids visuel l'une sur l'autre, aucune ne gagne.
 *
 * Donc deux règles, et elles vont ensemble :
 *   — le quiz est DOUX et il vit DANS le texte, au moment où le lecteur vient
 *     de comprendre ce qu'il perd. Fond pâle, titre de niveau 3, bouton à
 *     contour. C'est un outil qu'on lui tend en passant ;
 *   — l'essai de sept jours est FORT et il reste SEUL à la fin. Cadre vert,
 *     gros titre, bouton plein. C'est la seule action de la page.
 */

export const MARQUEUR = '<!--QUIZ-->'
export const ADRESSE_QUIZ = 'https://quiz.concierge-ai.fr/test'

/** L'illustration : les personnages et les pastilles, sans le titre ni le
 *  bouton dessinés dans l'image de partage, qui feraient doublon ici. */
const VISUEL = '/images/quiz-appels-manques.jpg'
const VISUEL_ALT =
  'Un plombier et une infirmière, pensifs, entourés de trois constats : appels manqués, clients perdus, soirées interrompues.'

const echapper = (t) => String(t)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const ARGUMENTS = [
  'Cinq questions, deux minutes chrono',
  'Votre diagnostic personnalisé par email',
  'En bonus, cinq jours pour faire le point',
]

/**
 * @param {object} o
 * @param {string} o.titre   peut contenir un <em>
 * @param {string} o.chapo
 * @param {string} [o.bouton]
 * @param {string} [o.eyebrow]
 */
export function sectionQuiz({
  titre,
  chapo,
  bouton = 'Je fais le test',
  eyebrow = 'Votre diagnostic',
}) {
  const points = ARGUMENTS.map((t) => `<li>${echapper(t)}</li>`).join('\n')
  return `
<section class="cai-quiz">
<div class="cai-quiz-in">
<div class="cai-quiz-txt">
<span class="cai-eye">${echapper(eyebrow)}</span>
<h3>${titre}</h3>
<p class="cai-quiz-lead">${chapo}</p>
<ul class="cai-quiz-pts">
${points}
</ul>
<p class="cai-quiz-go"><a class="cai-btn cai-btn--o" href="${ADRESSE_QUIZ}">${echapper(bouton)}</a></p>
<p class="cai-quiz-fine">Gratuit, sans carte bancaire. Vous vous désabonnez en un clic si ça ne vous parle pas.</p>
</div>
<figure class="cai-quiz-vis">
<img src="${VISUEL}" alt="${echapper(VISUEL_ALT)}" width="900" height="883" loading="lazy" decoding="async">
</figure>
</div>
</section>
`
}
