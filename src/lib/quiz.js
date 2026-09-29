/**
 * Le quiz Tiquiz, sous forme de section HTML à insérer dans le contenu.
 *
 * Les pages du site sont enveloppées dans un unique conteneur « .cai » qui
 * porte tout leur style. On ne peut donc pas couper le contenu en deux pour
 * glisser un composant au milieu : on insère la section dans la chaîne, à un
 * emplacement marqué, et le conteneur reste intact.
 *
 * Le cadre se redimensionne tout seul : Tiquiz annonce sa hauteur par message,
 * et public/site.js répond. Si cet échange échoue, la hauteur de repli
 * garde le quiz utilisable.
 */

export const MARQUEUR = '<!--QUIZ-->'
export const ADRESSE_QUIZ = 'https://quiz.concierge-ai.fr/test'

const echapper = (t) => String(t)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/**
 * @param {object} o
 * @param {string} o.id      identifiant du cadre, unique dans la page
 * @param {string} o.titre   peut contenir un <em>
 * @param {string} o.chapo
 * @param {string} [o.eyebrow]
 * @param {'vert'|'blanc'} [o.fond]
 */
export function sectionQuiz({ id, titre, chapo, eyebrow = 'Le test', fond = 'vert' }) {
  return `
<section class="cai-box cai-quiz${fond === 'vert' ? ' cai-box--g' : ''}">
<div class="cai-head">
<span class="cai-eye">${echapper(eyebrow)}</span>
<h2>${titre}</h2>
<p class="cai-lead">${chapo}</p>
</div>
<iframe id="tiquiz-${echapper(id)}" data-tiquiz src="${ADRESSE_QUIZ}" loading="lazy"
        title="Combien vous coûtent vos appels manqués ? Le test en cinq questions"
        width="100%" height="640" frameborder="0"></iframe>
</section>
`
}
