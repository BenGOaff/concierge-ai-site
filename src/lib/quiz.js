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
 * La section tient sur deux colonnes : l'argumentaire à gauche, l'illustration
 * du quiz à droite. Ça prend moins de hauteur qu'un bloc empilé, et l'image
 * fait le travail de conviction à la place d'un paragraphe de plus.
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
 * @param {'vert'|'blanc'} [o.fond]
 */
export function sectionQuiz({
  titre,
  chapo,
  bouton = 'Je fais le test →',
  eyebrow = 'Le test',
  fond = 'vert',
}) {
  const points = ARGUMENTS.map((t) => `<li>${echapper(t)}</li>`).join('\n')
  return `
<section class="cai-box cai-quiz${fond === 'vert' ? ' cai-box--g' : ''}">
<div class="cai-quiz-in">
<div class="cai-quiz-txt">
<span class="cai-eye">${echapper(eyebrow)}</span>
<h2>${titre}</h2>
<p class="cai-lead">${chapo}</p>
<ul class="cai-quiz-pts">
${points}
</ul>
<p class="cai-quiz-go"><a class="cai-btn cai-btn--k" href="${ADRESSE_QUIZ}">${echapper(bouton)}</a></p>
<p class="cai-quiz-fine">Gratuit, sans carte bancaire. Vous vous désabonnez en un clic si ça ne vous parle pas.</p>
</div>
<figure class="cai-quiz-vis">
<img src="${VISUEL}" alt="${echapper(VISUEL_ALT)}" width="900" height="883" loading="lazy" decoding="async">
</figure>
</div>
</section>
`
}
