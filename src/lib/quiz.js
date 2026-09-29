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
 */

export const MARQUEUR = '<!--QUIZ-->'
export const ADRESSE_QUIZ = 'https://quiz.concierge-ai.fr/test'

const echapper = (t) => String(t)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

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
  return `
<section class="cai-box cai-quiz${fond === 'vert' ? ' cai-box--g' : ''}">
<span class="cai-eye">${echapper(eyebrow)}</span>
<h2>${titre}</h2>
<p class="cai-lead">${chapo}</p>
<div class="cai-row">
<a class="cai-btn cai-btn--k" href="${ADRESSE_QUIZ}">${echapper(bouton)}</a>
</div>
<p class="cai-quiz-fine">Cinq questions, deux minutes. Votre diagnostic arrive par email, et vous vous désabonnez en un clic si ça ne vous parle pas.</p>
</section>
`
}
