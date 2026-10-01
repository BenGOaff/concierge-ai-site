/**
 * Phase 1 du plan de contenu : rendre les dix-huit pages métier éligibles sur
 * la requête « métier + IA », sans les réécrire.
 *
 * Trois ajouts par page, et rien d'autre :
 *   1. le mot-clé en tête du H1, la scène d'origine conservée derrière ;
 *   2. une section « Standard téléphonique IA pour un … : ce qu'il fait
 *      vraiment », qui explique le mécanisme et annonce ses limites ;
 *   3. trois questions communes aux dix-huit pages, avec une réponse propre à
 *      chaque métier.
 *
 * Les questions sont volontairement identiques partout : ce sont les trois
 * objections qui bloquent un achat, et les moteurs de réponse citent plus
 * volontiers une formulation stable. Les réponses, elles, sont toutes
 * différentes, sinon on fabrique dix-huit pages jumelles.
 *
 * Le balisage FAQPage n'est pas écrit ici. Il est reconstruit après coup par
 * « outils/faq-schema.mjs », qui lit la page dans un vrai navigateur : c'est la
 * seule façon de garantir que le schéma dit exactement ce que la page affiche.
 *
 *   node outils/metiers-phase1.mjs            # dit ce qu'il ferait
 *   node outils/metiers-phase1.mjs --ecrire   # écrit dans src/contenu
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const RACINE = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const ecrire = process.argv.includes('--ecrire')

/* ------------------------------------------------------------------ *
 * Les trois questions, mot pour mot les mêmes sur les dix-huit pages.
 * ------------------------------------------------------------------ */
const QUESTIONS = {
  humain: 'Mes clients vont-ils savoir que ce n’est pas un humain&nbsp;?',
  agenda: 'Est-ce que ça fonctionne avec mon agenda&nbsp;?',
  legal: 'Est-ce légal de faire répondre un assistant automatique&nbsp;?',
}

/** Le premier paragraphe de la réponse juridique ne change pas : c'est le même
 *  texte de loi pour tout le monde, et une source vérifiée se cite à
 *  l'identique. Le second paragraphe, lui, est propre à chaque métier. */
const LOI = '<p>Oui, à une condition désormais écrite dans la loi : votre correspondant doit savoir qu’il parle à un système d’intelligence artificielle. C’est l’<a href="https://artificialintelligenceact.eu/article/50/" rel="nofollow noopener" target="_blank">article 50 du règlement européen sur l’intelligence artificielle</a>, applicable depuis le 2 août 2026. Une phrase d’accueil y suffit, et elle est prononcée au début de chaque appel.</p>'

/** Fin de la réponse juridique, commune elle aussi : la question
 *  de l'enregistrement se pose dans tous les métiers. */
const LOI_FIN = '<p>Dernier point à régler avant la mise en service, quel que soit le prestataire : demandez-lui ce qui est enregistré, où c’est hébergé et combien de temps c’est conservé. <a href="/conformite">Les trois règles sont détaillées ici</a>.</p>'

const M = {}

M['metiers__plombier-chauffagiste'] = {
  cle: 'Permanence téléphonique pour plombier',
  cible: 'un plombier',
  lead: 'Le mot « IA » ne dit pas grand-chose quand on a les mains dans un siphon. Voici donc le déroulé exact d’un appel, étape par étape, sans vocabulaire de salon.',
  etapes: [
    ['Il décroche après vous, jamais avant.', 'Votre numéro ne change pas. Le téléphone sonne chez vous comme d’habitude, et ce n’est qu’au bout de quelques sonneries sans réponse que l’appel bascule. Si vous décrochez, il ne se passe rien du tout.'],
    ['Il annonce ce qu’il est, puis il écoute.', 'Pas de menu, pas de « tapez 1 ». La personne décrit sa fuite avec ses mots, comme elle vous l’aurait décrite à vous. La première phrase de l’appel lui dit qu’elle parle à un assistant automatique.'],
    ['Il pose vos questions, dans votre ordre.', 'En plomberie, ce sont presque toujours les mêmes : qu’est-ce qui se passe, est-ce que l’eau coule encore, à quelle adresse, maison ou appartement, quel étage. Vous dictez cette liste une seule fois, au cadrage.'],
    ['Il trie selon vos règles, pas selon son avis.', 'Une fuite active et un devis de salle de bain ne déclenchent pas la même suite. Ce que vous avez déclaré urgent sonne sur votre portable, à n’importe quelle heure. Le reste est planifié et vous attend au réveil.'],
    ['Il pose le rendez-vous, puis il vous résume l’appel.', 'Quand ce n’est pas une urgence, il propose un créneau libre de votre agenda, relit l’adresse et le numéro à voix haute, et bloque l’intervention. Vous recevez le motif et les coordonnées par écrit, sans rien avoir à réécouter.'],
  ],
  limites: [
    'Aucun devis, aucun prix ferme. Au mieux la fourchette de déplacement que vous avez écrite vous-même.',
    'Aucun diagnostic à distance : un évier bouché par la graisse et un siphon fendu se décident sur place, pas au téléphone.',
    'Quand il ne comprend pas, il le dit et transmet au lieu d’inventer. C’est précisément ce qu’il faut écouter pendant l’essai.',
  ],
  fin: 'Le branchement sur votre ligne est expliqué sur <a href="/fonctionnement">comment ça se branche</a>, et le face-à-face avec un télésecrétariat sur <a href="/comparer/permanence-telephonique">comparer les solutions</a>.',
  faq: {
    humain: '<p>Oui, dès la première phrase : le message d’accueil dit qu’il s’agit d’un assistant automatique. Personne ne croit parler à votre secrétaire.</p><p>Ce que vos clients retiennent, en pratique, c’est qu’on leur a répondu à 20 h 15 au lieu de sonner dans le vide. Quand l’eau coule sous l’évier, c’est la seule chose qui compte.</p>',
    agenda: '<p>Oui, si votre agenda est en ligne : Google Agenda, Outlook, ou l’outil de planning que vous utilisez déjà. Les créneaux proposés sont ceux qui restent libres, et l’intervention s’y écrit pendant l’appel.</p><p>Si votre planning vit sur un carnet ou dans un logiciel fermé, la pose directe n’est pas possible : la demande vous arrive alors comme un créneau à confirmer. Posez la question avant la mise en service, <a href="/fonctionnement">le branchement est détaillé ici</a>.</p>',
    legal: LOI + '<p>Le reste relève du droit que vous connaissez déjà : majorations de nuit et de week-end annoncées avant le déplacement, devis après constat. Faites énoncer vos fourchettes, jamais un prix ferme.</p>' + LOI_FIN,
  },
}

M['metiers__electricien'] = {
  cle: 'Permanence téléphonique pour électricien',
  cible: 'un électricien',
  lead: 'On ne quitte pas une armoire sous tension pour attraper son téléphone. Voici ce qui se passe à votre place, étape par étape, et ce qui ne se passe pas.',
  etapes: [
    ['Il décroche là où vous ne pouvez pas.', 'Votre ligne reste la vôtre. L’appel sonne chez vous d’abord et ne bascule qu’après quelques sonneries sans réponse. Les mains dans un tableau, vous n’avez rien à faire et rien à couper.'],
    ['Il dit ce qu’il est, puis il laisse parler.', 'Aucun menu à touches. La personne raconte sa panne normalement, et la phrase d’accueil précise qu’elle s’adresse à un assistant automatique.'],
    ['Il pose vos questions, dans votre ordre.', 'En électricité, les bonnes questions sont courtes : tout le logement est coupé ou une seule pièce, est-ce que ça sent le chaud, est-ce que le disjoncteur se réenclenche, quelle adresse. Quatre réponses et vous savez déjà si vous bougez.'],
    ['Il trie ce qui vous réveille et ce qui attend.', 'Une odeur de brûlé au tableau n’est pas une demande de devis pour des spots encastrés. Vous fixez la liste des motifs ; il l’applique sans l’interpréter et ne transfère que ce qui la remplit.'],
    ['Il pose le rendez-vous sur un créneau libre.', 'Pour tout ce qui n’est pas urgent, il propose un créneau de votre agenda, relit l’adresse et le numéro, puis confirme. Vous retrouvez le résumé écrit en sortant du chantier.'],
  ],
  limites: [
    'Aucun diagnostic à distance : un différentiel qui saute peut venir de dix choses, et aucune ne se tranche au téléphone.',
    'Aucun devis ni prix ferme, seulement les fourchettes que vous avez validées.',
    'Aucune décision de sécurité prise à votre place. Faire couper le compteur ou non, c’est une consigne que vous écrivez au cadrage, mot pour mot.',
  ],
  fin: 'Pour voir le tri des urgences en détail, lisez <a href="/guides/astreinte-et-tri-des-urgences">astreinte et tri des urgences</a>. Pour le branchement sur votre ligne, <a href="/fonctionnement">comment ça se branche</a>.',
  faq: {
    humain: '<p>Oui, c’est annoncé au début de l’appel : la personne sait qu’elle parle à un assistant automatique, pas à un humain.</p><p>Et ce n’est pas ce qui la marque. Ce qui la marque, c’est d’avoir obtenu une réponse un dimanche à 19 h, quand les trois électriciens appelés avant n’ont pas décroché.</p>',
    agenda: '<p>Oui, dès lors qu’il est en ligne : Google Agenda, Outlook, ou l’agenda partagé de votre équipe. Seuls les créneaux restés libres sont proposés, et le rendez-vous s’y écrit pendant la conversation.</p><p>Si vous travaillez à deux ou trois avec un agenda par personne, les créneaux proposés sont ceux qui restent ouverts, sans double réservation. <a href="/fonctionnement">Le détail du branchement est ici</a>.</p>',
    legal: LOI + '<p>Vos obligations de métier ne bougent pas pour autant : devis écrit au-delà des seuils, mentions d’assurance, majorations annoncées avant le déplacement. Un assistant qui lâche un montant que vous ne tiendrez pas vous crée un litige, donc il n’énonce que vos fourchettes.</p>' + LOI_FIN,
  },
}

M['metiers__serrurier'] = {
  cle: 'Permanence téléphonique pour serrurier',
  cible: 'un serrurier',
  lead: 'Une personne enfermée dehors appelle quatre numéros en six minutes. Voici ce que fait un standard automatique dans cet intervalle, et ce qu’il refuse de faire.',
  etapes: [
    ['Il décroche à la deuxième minute, pas le lendemain.', 'Votre numéro ne change pas. L’appel sonne d’abord chez vous ; faute de réponse, il bascule au lieu de tomber sur un répondeur. Sur une porte claquée, c’est toute la différence entre un chantier et un appel perdu.'],
    ['Il annonce ce qu’il est, puis il écoute.', 'Pas de « tapez 1 » : la personne, souvent dehors et pressée, explique sa situation avec ses mots. La première phrase lui dit qu’elle parle à un assistant automatique.'],
    ['Il pose vos questions, dans votre ordre.', 'En serrurerie, l’essentiel tient en quatre : porte claquée ou fermée à clé, serrure multipoints ou non, porte blindée ou non, adresse exacte et étage. Ce sont ces réponses qui décident du déplacement et du temps à prévoir.'],
    ['Il sépare l’urgence réelle de la demande qui attend.', 'Une personne dehors à minuit et un changement de cylindre prévu la semaine prochaine ne suivent pas le même chemin. Ce que vous avez déclaré urgent arrive sur votre portable, le reste est planifié.'],
    ['Il énonce la fourchette que vous avez écrite, et rien de plus.', 'Sur un métier où l’affichage des prix est surveillé de près, c’est un garde-fou plus qu’un argument commercial : il annonce le montant de déplacement que vous avez validé et renvoie le reste au constat sur place.'],
  ],
  limites: [
    'Aucun prix ferme, aucun devis, et jamais d’engagement sur une méthode d’ouverture.',
    'Aucune vérification d’identité ni de titre d’occupation : ce contrôle reste le vôtre, sur place, comme aujourd’hui.',
    'Aucun jugement sur la possibilité d’ouvrir sans dégât. Il décrit ce qu’il a entendu, vous décidez.',
  ],
  fin: 'Les prix constatés chez les autres prestataires sont sur <a href="/prix-du-marche">les prix du marché</a>, et le tri des appels de nuit sur <a href="/guides/astreinte-et-tri-des-urgences">astreinte et tri des urgences</a>.',
  faq: {
    humain: '<p>Oui. L’appel commence en disant qu’il s’agit d’un assistant automatique, et cette phrase n’est pas négociable.</p><p>Quelqu’un qui attend sur son palier à 23 h ne vous en tiendra pas rigueur : il voulait savoir si quelqu’un venait et dans combien de temps. Il l’a su. C’est plus que ce qu’un répondeur lui donne.</p>',
    agenda: '<p>Oui pour tout ce qui se planifie — changement de serrure, blindage, pose de cylindre — à condition que votre agenda soit en ligne. Les créneaux libres sont les seuls proposés.</p><p>Pour les dépannages de nuit, l’agenda ne sert à rien : ce qui compte est le transfert immédiat sur votre portable quand la situation remplit vos critères. <a href="/fonctionnement">Les deux se règlent au branchement</a>.</p>',
    legal: LOI + '<p>Et la vigilance porte plutôt ailleurs, dans votre métier : les prix doivent être annoncés avant l’intervention et le client doit pouvoir les retrouver. Faites donc énoncer votre fourchette de déplacement validée, jamais un montant improvisé.</p>' + LOI_FIN,
  },
}

M['garage-carrosserie'] = {
  cle: 'Permanence téléphonique pour garage',
  cible: 'un garage',
  lead: 'Entre la clé à choc et le compresseur, personne n’entend le téléphone. Voici ce que fait un standard automatique pendant ce temps, et ce qu’il laisse à l’atelier.',
  etapes: [
    ['Il décroche quand l’atelier couvre la sonnerie.', 'Votre numéro reste le même, celui de vos plaques et de votre fiche Google. L’appel sonne d’abord à l’atelier ; il ne bascule qu’après quelques sonneries sans réponse.'],
    ['Il annonce ce qu’il est, puis il écoute.', 'Aucun menu à touches : le client décrit son problème comme il l’aurait décrit au comptoir. La première phrase lui dit qu’il parle à un assistant automatique.'],
    ['Il pose vos questions, dans votre ordre.', 'Au garage, la liste est connue : modèle et immatriculation, ce qui est vu ou entendu, depuis quand, est-ce que le véhicule roule encore, mécanique ou carrosserie, et s’il y a un constat ou une assurance derrière.'],
    ['Il sépare le véhicule immobilisé du rendez-vous à poser.', 'Une voiture arrêtée sur une voie rapide et une révision à planifier n’appellent pas la même suite. Vous écrivez la liste de ce qui doit vous être transféré tout de suite.'],
    ['Il pose la dépose sur un créneau d’atelier libre.', 'Il propose un créneau que vous avez ouvert, relit l’immatriculation et le numéro de rappel, puis confirme. Vous retrouvez le motif par écrit, avec ce que le client a dit exactement.'],
  ],
  limites: [
    'Aucun chiffrage de réparation : un bruit décrit au téléphone ne vaut pas un diagnostic, et vous le savez mieux que personne.',
    'Aucun véhicule de prêt promis si vous ne l’avez pas écrit noir sur blanc.',
    'Aucun suivi de dossier d’assurance ni d’expertise. Il note qu’il y en a un et vous le signale.',
  ],
  fin: 'Le coût d’un appel manqué dans un garage est chiffré sur <a href="/calculateur">le calculateur</a>, et les solutions comparées sur <a href="/comparer/permanence-telephonique">comparer les solutions</a>.',
  faq: {
    humain: '<p>Oui, c’est dit au début de l’appel. Vos clients savent qu’ils parlent à un assistant automatique.</p><p>Et ils préfèrent largement ça au signal occupé. Un client qui obtient un créneau de dépose à 18 h 40 ne rappelle pas le garage d’en face.</p>',
    agenda: '<p>Oui, si votre planning d’atelier est en ligne : Google Agenda, Outlook, ou l’agenda de votre logiciel de gestion lorsqu’il se synchronise. Seuls les créneaux de dépose que vous avez ouverts sont proposés.</p><p>Si votre planning tient sur un tableau blanc, la pose directe n’est pas possible : les demandes vous arrivent alors comme des créneaux à confirmer. <a href="/fonctionnement">Posez la question au branchement</a>.</p>',
    legal: LOI + '<p>Pour le reste, vos obligations habituelles s’appliquent telles quelles : ordre de réparation, devis avant travaux, accord du client sur les pièces. Un assistant qui annonce un tarif que l’atelier ne tiendra pas vous crée un litige, donc il n’énonce que vos fourchettes.</p>' + LOI_FIN,
  },
}

M['metiers__renovation-batiment'] = {
  cle: 'Permanence téléphonique pour entreprise du bâtiment',
  cible: 'une entreprise du bâtiment',
  lead: 'Sur un chantier, le téléphone est toujours dans la veste, à l’autre bout de la pièce. Voici ce qu’un standard automatique fait des appels pendant ce temps-là.',
  etapes: [
    ['Il décroche quand la ponceuse tourne.', 'Votre numéro ne change pas. L’appel sonne d’abord chez vous et ne bascule qu’après quelques sonneries sans réponse, ce qui arrive une dizaine de fois par semaine sur un chantier.'],
    ['Il annonce ce qu’il est, puis il écoute.', 'Pas de menu à touches. La personne décrit son projet avec ses mots, et la première phrase lui dit qu’elle parle à un assistant automatique.'],
    ['Il pose vos questions de qualification.', 'C’est là que tout se joue en rénovation : nature des travaux, surface approximative, logement occupé ou vide, commune, et à quelle échéance la personne se projette. Cinq réponses qui vous évitent une visite pour rien.'],
    ['Il sépare le chantier en cours du premier contact.', 'Un chantier qui prend l’eau un samedi n’est pas une demande de devis de cuisine. Vous écrivez la liste de ce qui doit vous joindre tout de suite, et celle de ce qui attend lundi.'],
    ['Il pose la visite technique sur un créneau libre.', 'Pour une demande sérieuse, il propose un créneau de votre agenda, relit l’adresse, et confirme. Vous arrivez en sachant déjà de quoi il s’agit et si le budget tient debout.'],
  ],
  limites: [
    'Aucun chiffrage de chantier, et c’est heureux : un devis de rénovation se fait sur place, après avoir vu les murs.',
    'Aucun engagement sur une date de démarrage, qui dépend de chantiers en cours qu’il ne connaît pas.',
    'Aucune appréciation de solvabilité ni d’éligibilité aux aides. Il note ce que la personne déclare, rien de plus.',
  ],
  fin: 'Pour chiffrer ce que vous coûtent les appels perdus, utilisez <a href="/calculateur">le calculateur</a>. Pour comparer embauche et automatisation, lisez <a href="/comparer/embaucher-ou-automatiser">embaucher ou automatiser</a>.',
  faq: {
    humain: '<p>Oui, l’appel le dit en commençant. La personne sait qu’elle s’adresse à un assistant automatique.</p><p>Dans la rénovation, ce n’est pas un sujet : ce qui se joue au premier appel, c’est de savoir si l’entreprise existe vraiment et si elle rappelle. Une réponse immédiate répond déjà à la moitié de la question.</p>',
    agenda: '<p>Oui, si votre agenda est en ligne. Les visites techniques se posent sur les créneaux que vous avez laissés ouverts, et jamais sur un créneau déjà pris.</p><p>Beaucoup de patrons du bâtiment n’ouvrent qu’un ou deux créneaux de visite par semaine, en fin de journée. C’est tout à fait possible : ce qui n’est pas ouvert n’est jamais proposé. <a href="/fonctionnement">Le branchement est détaillé ici</a>.</p>',
    legal: LOI + '<p>Vos obligations ne changent pas : devis écrit, mentions d’assurance décennale, délai de rétractation quand le contrat est signé chez le client. Rien de tout cela ne se traite au téléphone, et c’est pour ça qu’un assistant ne doit pas s’y aventurer.</p>' + LOI_FIN,
  },
}

M['metiers__paysagiste'] = {
  cle: 'Permanence téléphonique pour paysagiste',
  cible: 'un paysagiste',
  lead: 'Casque anti-bruit sur les oreilles, on n’entend rien. Et le printemps est à la fois le pic d’appels et le moment où vous êtes le moins disponible pour les prendre.',
  etapes: [
    ['Il décroche quand le taille-haie tourne.', 'Votre numéro ne change pas. L’appel sonne chez vous d’abord ; il ne bascule qu’après quelques sonneries sans réponse, ce qui arrive toute la journée en saison.'],
    ['Il annonce ce qu’il est, puis il écoute.', 'Aucun menu à touches : la personne explique ce qu’elle veut faire de son terrain, avec ses mots. La première phrase lui dit qu’elle parle à un assistant automatique.'],
    ['Il pose vos questions, dans votre ordre.', 'En paysage, cinq réponses suffisent à savoir si ça vaut un déplacement : ce qu’il y a à faire, la surface ou le linéaire de haie, l’accès au terrain, la commune, et s’il s’agit d’un entretien régulier ou d’une intervention unique.'],
    ['Il distingue l’urgence du devis à poser.', 'Un arbre tombé sur un portail après une tempête n’est pas une demande de devis d’allée. Vous écrivez la liste de ce qui doit vous joindre tout de suite ; le reste se planifie.'],
    ['Il pose la visite sur un créneau libre.', 'Il propose un créneau de votre agenda, relit l’adresse et le numéro, puis confirme. Les contrats d’entretien à l’année se gagnent souvent à ce moment-là, pas trois jours plus tard.'],
  ],
  limites: [
    'Aucun devis au téléphone : une surface annoncée et une surface vue ne sont jamais la même chose.',
    'Aucun engagement de date en pleine saison, quand votre planning se remplit à la semaine.',
    'Aucun avis sur l’état sanitaire d’un arbre ni sur la nécessité d’un abattage. Il note la description et vous la transmet.',
  ],
  fin: 'Pour mesurer ce que la saison vous fait perdre, essayez <a href="/calculateur">le calculateur</a>. Pour les solutions possibles, <a href="/comparer/permanence-telephonique">comparer les solutions</a>.',
  faq: {
    humain: '<p>Oui, c’est annoncé au début de l’appel. Vos clients savent qu’ils parlent à un assistant automatique.</p><p>Et au mois de mars, quand ils appellent six paysagistes dans l’après-midi, celui qui répond est celui qui obtient la visite. Même si c’est une machine qui a décroché.</p>',
    agenda: '<p>Oui, à condition qu’il soit en ligne : Google Agenda, Outlook, ou l’agenda partagé de votre équipe. Les créneaux proposés sont uniquement ceux qui restent libres.</p><p>En saison, le réglage utile est de n’ouvrir que quelques créneaux de visite par semaine : ce qui n’est pas ouvert n’est jamais réservé. <a href="/fonctionnement">Le branchement est expliqué ici</a>.</p>',
    legal: LOI + '<p>Le reste est votre quotidien : devis écrit, mention de l’assurance, et pour les particuliers, l’information sur le délai de rétractation quand le contrat se signe à domicile. Un assistant qui chiffre à votre place vous expose, donc il ne chiffre pas.</p>' + LOI_FIN,
  },
}

M['metiers__cabinet-dentaire'] = {
  cle: 'Permanence téléphonique pour cabinet dentaire',
  cible: 'un cabinet dentaire',
  lead: 'Vos mains sont dans la bouche d’un patient et le téléphone sonne : la scène se répète vingt fois par jour. Voici ce qu’un standard automatique en fait, et surtout ce qu’il ne fait pas.',
  etapes: [
    ['Il décroche quand l’assistante est au fauteuil.', 'Le numéro du cabinet ne change pas. L’appel sonne à l’accueil d’abord, et ne bascule qu’après quelques sonneries sans réponse, ou en cas de double appel.'],
    ['Il annonce ce qu’il est, puis il écoute.', 'Pas de menu à touches, pas de musique d’attente. Le patient explique son motif avec ses mots, et la première phrase lui dit qu’il parle à un assistant automatique.'],
    ['Il pose vos questions, dans votre ordre.', 'Patient du cabinet ou nouveau patient, motif de l’appel, depuis quand, douleur ou non. Et pour ce qui ressemble à une urgence : traumatisme, abcès, dent cassée, saignement persistant.'],
    ['Il trie selon la liste que vous avez écrite.', 'Un traumatisme dentaire chez un enfant et un détartrage n’appellent pas la même suite. Vous écrivez ce qui doit vous être transmis tout de suite, et ce qui attend la réouverture.'],
    ['Il pose le rendez-vous sur les créneaux que vous ouvrez.', 'Il propose uniquement ce que vous avez rendu disponible, relit le nom et le numéro, puis confirme. Les désistements de dernière minute se recomblent à partir de la même liste, au lieu de laisser un fauteuil vide.'],
  ],
  limites: [
    'Aucun conseil médical, aucun diagnostic, aucune indication de médicament ou d’antalgique. Jamais, sous aucune formulation.',
    'Pour une urgence hors horaires, il énonce la consigne que vous avez écrite — service de garde, numéro d’urgence — sans jamais la décider à votre place.',
    'Le secret professionnel ne disparaît pas parce que l’appel est automatisé : ce qui est recueilli reste sous votre responsabilité de praticien.',
  ],
  fin: 'La question du cadre réglementaire est traitée à part sur <a href="/conformite">conformité et RGPD</a>. Pour le branchement sur la ligne du cabinet, <a href="/fonctionnement">comment ça se branche</a>.',
  faq: {
    humain: '<p>Oui, c’est annoncé dès le début de l’appel : le patient sait qu’il s’adresse à un assistant automatique.</p><p>C’est d’ailleurs préférable dans une profession de santé. Un patient qui croirait parler à votre assistante pourrait attendre d’elle un avis qu’une machine ne doit pas donner. Dire ce que c’est, c’est aussi fixer ce qu’on peut lui demander.</p>',
    agenda: '<p>Oui, si votre agenda est accessible en ligne. Les créneaux proposés sont ceux que vous avez ouverts, et le rendez-vous s’y inscrit pendant l’appel.</p><p>Beaucoup de cabinets travaillent sur un logiciel métier fermé : dans ce cas, la pose directe n’est pas toujours possible et la demande vous arrive comme un créneau à confirmer. C’est la première question à poser à l’éditeur, avant toute mise en service.</p>',
    legal: LOI + '<p>S’y ajoutent, pour une profession de santé, le secret professionnel, le RGPD appliqué à des données de santé, et les règles de votre ordre sur l’information des patients et la continuité des soins. Vérifiez auprès du Conseil de l’Ordre ce que votre cadre autorise avant de déléguer la prise d’appels, quelle que soit la solution.</p>' + LOI_FIN,
  },
}

M['metiers__kine-osteopathe'] = {
  cle: 'Permanence téléphonique pour kiné et ostéopathe',
  cible: 'un kinésithérapeute',
  lead: 'On n’interrompt pas une séance pour décrocher, et c’est bien normal. Le problème, c’est que les appels arrivent précisément pendant les séances. Voici ce qu’un standard automatique en fait.',
  etapes: [
    ['Il décroche pendant la séance.', 'Votre numéro ne change pas. L’appel sonne chez vous d’abord, puis bascule après quelques sonneries sans réponse. Vous ne quittez pas la table.'],
    ['Il annonce ce qu’il est, puis il écoute.', 'Aucun menu à touches. Le patient décrit sa demande avec ses mots, et la première phrase lui dit qu’il parle à un assistant automatique.'],
    ['Il pose vos questions, dans votre ordre.', 'Nouveau patient ou suivi en cours, zone concernée, depuis combien de temps, prescription médicale ou non, et la disponibilité réelle de la personne. De quoi savoir quel créneau proposer.'],
    ['Il distingue l’annulation du premier rendez-vous.', 'Ici, l’urgence n’est pas le bon critère. Le tri utile, c’est la différence entre une annulation à recaser dans la journée et un premier rendez-vous à poser dans trois semaines.'],
    ['Il pose le rendez-vous sur un créneau libre.', 'Il propose ce que vous avez ouvert, relit le nom et le numéro, confirme. Un créneau libéré par une annulation et repris dans l’heure est le plus rentable de votre journée.'],
  ],
  limites: [
    'Aucun conseil de soin, aucun diagnostic, aucun avis sur ce qu’il faut faire en attendant. Jamais.',
    'Aucune appréciation du caractère urgent d’une douleur : il note la description et vous la transmet.',
    'Aucune réponse sur la nécessité d’une prescription ou sur un remboursement. Ces questions vous reviennent, et le patient est renvoyé vers vous.',
  ],
  fin: 'Les rendez-vous annulés et leur coût sont traités sur <a href="/category/rendez-vous-annules">rendez-vous annulés</a>. Pour le cadre réglementaire, <a href="/conformite">conformité et RGPD</a>.',
  faq: {
    humain: '<p>Oui, la phrase d’accueil le dit. Le patient sait qu’il parle à un assistant automatique.</p><p>Dans une profession de santé, cette annonce vaut mieux qu’une voix ambiguë : elle fixe d’emblée ce qu’on peut demander à cette voix, c’est-à-dire un rendez-vous, et rien d’autre.</p>',
    agenda: '<p>Oui, si votre agenda est en ligne. Les créneaux proposés sont ceux restés libres, et le rendez-vous s’y écrit pendant l’appel — y compris le créneau qu’une annulation vient de libérer.</p><p>Si vous utilisez un logiciel de prise de rendez-vous fermé, la pose automatique n’est pas toujours possible : la demande vous arrive alors comme un créneau à confirmer. Posez la question avant la mise en service.</p>',
    legal: LOI + '<p>À cela s’ajoutent le secret professionnel, le RGPD sur des données de santé, et les règles de votre ordre quant à l’information des patients. Demandez à votre ordre ce que votre mode d’exercice autorise avant de déléguer vos appels, quelle que soit la solution envisagée.</p>' + LOI_FIN,
  },
}

M['metiers__veterinaire'] = {
  cle: 'Permanence téléphonique pour vétérinaire',
  cible: 'une clinique vétérinaire',
  lead: 'Un propriétaire inquiet appelle pendant que vous êtes en consultation. Il veut savoir une seule chose : est-ce que ça peut attendre demain. Voici ce qu’un standard automatique peut faire de cet appel, et ce qu’il ne peut pas.',
  etapes: [
    ['Il décroche pendant la consultation.', 'Le numéro de la clinique ne change pas. L’appel sonne à l’accueil d’abord et ne bascule qu’après quelques sonneries sans réponse, ou sur un double appel.'],
    ['Il annonce ce qu’il est, puis il écoute.', 'Pas de menu à touches. Le propriétaire décrit ce qu’il observe, avec ses mots et son inquiétude. La première phrase lui dit qu’il parle à un assistant automatique.'],
    ['Il pose vos questions, dans votre ordre.', 'Espèce et âge, ce qui est observé, depuis quand, est-ce que l’animal mange et respire normalement, et s’il y a eu accident ou ingestion. Une description précise vous fait gagner les trois minutes qui comptent.'],
    ['Il trie selon la liste que vous avez écrite.', 'Une suspicion d’intoxication ou de torsion d’estomac n’est pas un rappel de vaccin. Ce que vous avez déclaré urgent vous est transféré ; le reste est planifié.'],
    ['Il pose le rendez-vous ou énonce votre consigne de garde.', 'Pour une consultation, il propose un créneau libre et confirme. Hors horaires, il énonce exactement la consigne que vous avez écrite : service de garde, clinique d’urgence, numéro à appeler.'],
  ],
  limites: [
    'Aucun conseil vétérinaire, aucun geste dicté au téléphone, aucune appréciation de gravité. Il transmet la description, vous décidez.',
    'Aucun avis sur la nécessité de venir tout de suite : seule votre liste de critères déclenche un transfert.',
    'Aucune improvisation sur la garde. Il dit ce que vous avez écrit, mot pour mot, et rien d’autre.',
  ],
  fin: 'Le fonctionnement du tri des urgences est détaillé sur <a href="/guides/astreinte-et-tri-des-urgences">astreinte et tri des urgences</a>. Pour le cadre réglementaire, <a href="/conformite">conformité et RGPD</a>.',
  faq: {
    humain: '<p>Oui, c’est annoncé au début de l’appel. Le propriétaire sait qu’il parle à un assistant automatique.</p><p>Et c’est préférable : quelqu’un d’inquiet pour son chien demanderait un avis à une voix humaine. Annoncer la machine, c’est éviter qu’on attende d’elle une réponse qu’elle ne doit pas donner — et accélérer le passage au vétérinaire de garde.</p>',
    agenda: '<p>Oui, si l’agenda de la clinique est en ligne. Les créneaux proposés sont ceux que vous avez ouverts, et la consultation s’y inscrit pendant l’appel.</p><p>Si vous travaillez sur un logiciel métier fermé, la pose directe n’est pas toujours possible : la demande vous arrive alors comme un créneau à confirmer. C’est à vérifier auprès de l’éditeur avant la mise en service.</p>',
    legal: LOI + '<p>S’y ajoutent vos obligations propres : l’information sur la continuité des soins et le service de garde, que votre message doit énoncer sans l’interpréter. Vérifiez auprès de votre ordre ce que votre mode d’exercice autorise avant de déléguer la prise d’appels.</p>' + LOI_FIN,
  },
}

M['metiers__avocat-juriste'] = {
  cle: 'Permanence téléphonique pour avocat',
  cible: 'un cabinet d’avocats',
  lead: 'Un justiciable qui n’obtient pas de réponse appelle le cabinet suivant, et il le fait dans l’heure. Voici ce qu’un standard automatique peut faire de cet appel sans jamais empiéter sur votre métier.',
  etapes: [
    ['Il décroche quand vous êtes en audience.', 'La ligne du cabinet ne change pas. L’appel sonne au secrétariat d’abord, et ne bascule qu’après quelques sonneries sans réponse, ou pendant les plages où personne ne peut répondre.'],
    ['Il annonce ce qu’il est, puis il écoute.', 'Aucun menu à touches. La personne expose sa situation avec ses mots, et la première phrase lui dit qu’elle parle à un assistant automatique.'],
    ['Il pose vos questions, dans votre ordre.', 'La matière concernée (famille, pénal, travail, bail), l’existence d’une date limite ou d’une convocation, la juridiction, et si une autre partie est déjà représentée. C’est là que se repère un conflit d’intérêts, avant même le premier rendez-vous.'],
    ['Il sépare le délai contraint du simple renseignement.', 'Une garde à vue ou une convocation à quarante-huit heures n’est pas une demande de consultation. Vous écrivez la liste de ce qui doit vous joindre immédiatement, et à quel numéro.'],
    ['Il pose le premier rendez-vous et annonce votre tarif.', 'Il propose un créneau que vous avez ouvert et précise si la consultation est payante et à quel montant — celui que vous avez écrit. Beaucoup de temps perdu en cabinet vient de ce point non dit au premier appel.'],
  ],
  limites: [
    'Aucun conseil juridique, pas même une orientation, sous aucune formulation. C’est une activité réservée, et la limite n’est pas négociable.',
    'Aucune appréciation des chances de succès, et aucun montant d’honoraires au-delà du tarif de consultation que vous avez fixé.',
    'Le secret professionnel s’applique aux informations recueillies : le périmètre de ce qui est noté se décide avec vous, et votre ordre a son mot à dire.',
  ],
  fin: 'Le cadre réglementaire est traité sur <a href="/conformite">conformité et RGPD</a>. Pour comparer avec un télésecrétariat juridique, <a href="/comparer/permanence-telephonique">comparer les solutions</a>.',
  faq: {
    humain: '<p>Oui, c’est annoncé dès le début de l’appel : la personne sait qu’elle s’adresse à un assistant automatique.</p><p>Dans votre profession, c’est une protection autant qu’une obligation. Un justiciable qui croirait parler à un collaborateur du cabinet attendrait un premier avis. L’annonce lève l’ambiguïté : cette voix prend un rendez-vous, elle ne conseille pas.</p>',
    agenda: '<p>Oui, si l’agenda du cabinet est en ligne : Google Agenda, Outlook, ou l’agenda partagé entre associés. Seuls les créneaux de consultation que vous avez ouverts sont proposés.</p><p>Le réglage utile dans un cabinet, c’est de n’ouvrir que des plages de premier rendez-vous, en laissant les audiences et les délais hors d’atteinte. Ce qui n’est pas ouvert n’est jamais réservé.</p>',
    legal: LOI + '<p>Deux points comptent davantage dans votre cas : le secret professionnel, qui couvre dès le premier contact ce que la personne a confié, et l’interdiction de délivrer une consultation juridique hors du cadre réservé. Vérifiez avec votre ordre ce que vous pouvez faire recueillir, et par qui, avant toute mise en service.</p>' + LOI_FIN,
  },
}

M['metiers__expert-comptable'] = {
  cle: 'Permanence téléphonique pour expert-comptable',
  cible: 'un cabinet d’expertise comptable',
  lead: 'De janvier à mai, le volume d’appels double et personne au cabinet n’a le temps de décrocher. Voici ce qu’un standard automatique prend en charge dans cette période, et ce qu’il laisse aux collaborateurs.',
  etapes: [
    ['Il décroche en pleine saison des bilans.', 'La ligne du cabinet ne change pas. L’appel sonne à l’accueil d’abord, puis bascule après quelques sonneries sans réponse ou sur un double appel — c’est-à-dire tout le temps, de février à avril.'],
    ['Il annonce ce qu’il est, puis il écoute.', 'Pas de menu à touches. L’interlocuteur explique sa demande avec ses mots, et la première phrase lui dit qu’il parle à un assistant automatique.'],
    ['Il pose vos questions, dans votre ordre.', 'Client du cabinet ou prospect, nature de la demande — liasse, TVA, paie, création —, l’échéance qui approche, et le dossier concerné. Quatre réponses, et l’appel est déjà qualifié.'],
    ['Il sépare l’échéance réelle de la question courante.', 'Un contrôle fiscal ou une TVA à déposer le lendemain n’est pas une question de classement de factures. Vous écrivez la liste de ce qui doit remonter tout de suite, et à quel associé.'],
    ['Il route vers le bon collaborateur, ou pose le rendez-vous.', 'Pour un client, il oriente selon la règle d’affectation que vous avez écrite. Pour un prospect, il pose le rendez-vous de découverte sur un créneau libre, en recueillant la forme juridique et le volume d’activité.'],
  ],
  limites: [
    'Aucun conseil fiscal, comptable ou social, même général, même « à titre indicatif ».',
    'Aucun détail de dossier donné au téléphone. Il identifie l’appelant et transmet, il ne consulte rien.',
    'Aucun engagement sur un délai de production ni sur une date de dépôt.',
  ],
  fin: 'Le coût d’un appel non pris est chiffré sur <a href="/calculateur">le calculateur</a>, et l’arbitrage entre recrutement et automatisation sur <a href="/comparer/embaucher-ou-automatiser">embaucher ou automatiser</a>.',
  faq: {
    humain: '<p>Oui, l’appel le dit en commençant. Vos clients savent qu’ils parlent à un assistant automatique.</p><p>Et ils le vivent plutôt bien en pleine saison : un chef d’entreprise qui obtient une réponse et un rappel programmé préfère ça au cinquième appel sans réponse de la semaine.</p>',
    agenda: '<p>Oui, si l’agenda du cabinet est en ligne. Les rendez-vous de découverte se posent sur les créneaux que vous avez ouverts, sans jamais toucher aux plages de production.</p><p>Pour les clients existants, l’usage le plus courant n’est pas la prise de rendez-vous mais le routage : la demande part vers le collaborateur du dossier selon la règle que vous avez écrite. <a href="/fonctionnement">Les deux se règlent au branchement</a>.</p>',
    legal: LOI + '<p>S’y ajoute le secret professionnel auquel vous êtes tenu, qui couvre aussi ce qui se dit au téléphone. La règle pratique est simple : l’assistant identifie et transmet, il ne consulte aucun dossier et n’en restitue aucun élément. Vérifiez auprès de l’Ordre ce que votre cadre autorise en matière de sous-traitance.</p>' + LOI_FIN,
  },
}

M['metiers__agence-immobiliere'] = {
  cle: 'Permanence téléphonique pour agence immobilière',
  cible: 'une agence immobilière',
  lead: 'Un acquéreur qui appelle sur une annonce a quatre autres onglets ouverts. Il appellera les quatre. Voici ce qu’un standard automatique fait de cet appel quand vos négociateurs sont en visite.',
  etapes: [
    ['Il décroche quand tout le monde est en visite.', 'Le numéro de l’agence ne change pas. L’appel sonne d’abord à l’agence et ne bascule qu’après quelques sonneries sans réponse, ou le soir et le week-end — c’est-à-dire quand les acquéreurs cherchent.'],
    ['Il annonce ce qu’il est, puis il écoute.', 'Aucun menu à touches : la personne dit sur quelle annonce elle appelle, avec ses mots. La première phrase lui précise qu’elle parle à un assistant automatique.'],
    ['Il pose vos questions de qualification.', 'La référence de l’annonce, achat ou location, le budget et l’état du financement, le délai de projet, et si la personne est déjà suivie par un négociateur. C’est la qualification que vos négociateurs n’ont pas le temps de faire le samedi à 11 h.'],
    ['Il distingue l’acquéreur du curieux.', 'Un acquéreur financé sur un bien à 400 000 € et une demande de visite de curiosité ne se traitent pas pareil. Le tri remplit votre agenda de visites utiles au lieu de l’encombrer.'],
    ['Il pose la visite sur l’agenda du négociateur concerné.', 'Il propose un créneau resté libre, relit le nom et le numéro, puis confirme. Le négociateur retrouve le dossier déjà qualifié en sortant de sa visite précédente.'],
  ],
  limites: [
    'Aucune négociation, et aucune indication sur la marge de négociation d’un vendeur.',
    'Aucune adresse exacte communiquée si vous ne l’avez pas autorisée. Le réglage se décide annonce par annonce.',
    'Aucune vérification de capacité d’emprunt : il note ce que la personne déclare, et c’est au négociateur de vérifier.',
  ],
  fin: 'Le coût d’un acquéreur perdu est chiffré sur <a href="/calculateur">le calculateur</a>. Pour comparer avec un télésecrétariat, <a href="/comparer/permanence-telephonique">comparer les solutions</a>.',
  faq: {
    humain: '<p>Oui, c’est annoncé au début de l’appel. L’acquéreur sait qu’il parle à un assistant automatique.</p><p>Ce qui le décide, ce n’est pas la nature de la voix : c’est d’avoir obtenu un créneau de visite pour samedi alors que les trois autres agences l’ont laissé sonner. Le premier rendez-vous posé gagne la vente.</p>',
    agenda: '<p>Oui, si les agendas sont en ligne : Google Agenda, Outlook, ou l’agenda partagé de votre logiciel de transaction quand il se synchronise. Les visites se posent sur les créneaux libres du négociateur concerné.</p><p>Avec un agenda par négociateur, seuls les créneaux restés ouverts sont proposés, sans double réservation. <a href="/fonctionnement">Le branchement est détaillé ici</a>.</p>',
    legal: LOI + '<p>Le reste tient à vos obligations habituelles : mandat écrit avant toute commercialisation, mentions de la carte professionnelle, et information sur les honoraires. Un assistant qui s’engagerait sur un prix ou une négociation sortirait de son rôle, donc il ne le fait pas.</p>' + LOI_FIN,
  },
}

M['metiers__coiffeur-barbier'] = {
  cle: 'Permanence téléphonique pour salon de coiffure',
  cible: 'un salon de coiffure',
  lead: 'Un fauteuil vide une heure ne se rattrape jamais, et c’est pourtant à ces heures-là que le téléphone sonne sans réponse. Voici ce qu’un standard automatique en fait.',
  etapes: [
    ['Il décroche les mains dans une couleur.', 'Le numéro du salon ne change pas. L’appel sonne au salon d’abord, puis bascule après quelques sonneries sans réponse — ou pendant la fermeture, quand beaucoup de clientes prennent rendez-vous.'],
    ['Il annonce ce qu’il est, puis il écoute.', 'Aucun menu à touches : la personne dit ce qu’elle veut comme elle le dirait au comptoir. La première phrase lui précise qu’elle parle à un assistant automatique.'],
    ['Il pose vos questions, dans votre ordre.', 'La prestation, la longueur de cheveux, coloration ou non, le coiffeur souhaité, et le créneau qui arrange. C’est ce qui détermine la durée à bloquer, et c’est vous qui donnez les durées.'],
    ['Il distingue l’annulation de la nouvelle demande.', 'Ici l’urgence n’existe pas. Ce qui compte est le bon enchaînement : une annulation libère un créneau, et la demande suivante peut le prendre dans la minute au lieu de le laisser vide.'],
    ['Il pose le rendez-vous sur la bonne durée.', 'Une coupe et une couleur avec mèches ne bloquent pas le même créneau. Il applique vos durées, relit le prénom et le numéro, puis confirme.'],
  ],
  limites: [
    'Aucun conseil de couleur, de technique ou de coupe. Il note la demande, vous conseillez au fauteuil.',
    'Aucun rendez-vous sur une durée que vous n’avez pas paramétrée, ni sur un créneau que vous n’avez pas ouvert.',
    'Aucun encaissement et aucun acompte, sauf si vous mettez expressément ce point en place.',
  ],
  fin: 'Ce que coûte un créneau perdu est chiffré sur <a href="/calculateur">le calculateur</a>, et les annulations sont traitées sur <a href="/category/rendez-vous-annules">rendez-vous annulés</a>.',
  faq: {
    humain: '<p>Oui, c’est dit dès le début de l’appel : votre cliente sait qu’elle parle à un assistant automatique.</p><p>Et pour prendre un rendez-vous, cela n’a jamais gêné personne. Ce qui agace, c’est de rappeler trois fois un salon qui ne décroche pas parce qu’il travaille.</p>',
    agenda: '<p>Oui, si votre planning est en ligne : Google Agenda, Outlook, ou l’outil de réservation que vous utilisez déjà quand il se synchronise. Les créneaux proposés sont ceux restés libres, avec la durée de la prestation demandée.</p><p>Avec un agenda par coiffeur, la demande se pose sur la personne souhaitée quand elle est disponible, et sur une alternative quand elle ne l’est pas. <a href="/fonctionnement">Le branchement est expliqué ici</a>.</p>',
    legal: LOI + '<p>Pour le reste, rien de particulier dans votre métier : l’affichage des prix reste une obligation de salon, et les coordonnées recueillies au téléphone relèvent du RGPD comme votre fichier client habituel.</p>' + LOI_FIN,
  },
}

M['metiers__institut-spa'] = {
  cle: 'Permanence téléphonique pour institut de beauté',
  cible: 'un institut de beauté',
  lead: 'En cabine, le téléphone sonne dans le vide et vous ne saurez jamais qui appelait. Voici ce qu’un standard automatique fait de ces appels, et ce qu’il refuse de faire.',
  etapes: [
    ['Il décroche quand vous êtes en soin.', 'Le numéro de l’institut ne change pas. L’appel sonne chez vous d’abord, puis bascule après quelques sonneries sans réponse — ou pendant la fermeture, quand on prend le temps de réserver.'],
    ['Il annonce ce qu’il est, puis il écoute.', 'Aucun menu à touches : la cliente dit ce qu’elle veut, avec ses mots. La première phrase lui précise qu’elle parle à un assistant automatique.'],
    ['Il pose vos questions, dans votre ordre.', 'La prestation, la durée correspondante, la praticienne souhaitée, le créneau voulu, et s’il s’agit d’un bon cadeau à utiliser. Cinq réponses, et le rendez-vous peut être posé.'],
    ['Il enchaîne annulation et nouvelle demande.', 'Une cliente qui annule libère une cabine ; la demande suivante peut la prendre tout de suite. C’est ce chaînage, plus que l’urgence, qui fait la différence sur un mois.'],
    ['Il pose le rendez-vous sur la bonne durée de cabine.', 'Un soin du visage d’une heure et une épilation de vingt minutes ne bloquent pas le même créneau. Il applique vos durées, relit le prénom et le numéro, puis confirme.'],
  ],
  limites: [
    'Aucun avis sur une contre-indication — grossesse, traitement en cours, peau réactive. Il note ce qui est signalé et vous le transmet, vous tranchez.',
    'Aucun conseil de soin ni promesse de résultat.',
    'Aucun rendez-vous sur une durée ou une cabine que vous n’avez pas ouverte.',
  ],
  fin: 'Le coût d’une cabine vide est chiffré sur <a href="/calculateur">le calculateur</a>, et les désistements sont traités sur <a href="/category/rendez-vous-annules">rendez-vous annulés</a>.',
  faq: {
    humain: '<p>Oui, c’est annoncé dès le début de l’appel : votre cliente sait qu’elle parle à un assistant automatique.</p><p>Pour réserver un soin, ça ne pose aucun problème. Ce qui en pose un, c’est de sonner dans le vide à 19 h quand la cliente voulait justement caler sa séance du samedi.</p>',
    agenda: '<p>Oui, si votre planning est en ligne : Google Agenda, Outlook, ou votre outil de réservation lorsqu’il se synchronise. Les créneaux proposés sont ceux restés libres, pour la durée de la prestation demandée.</p><p>Avec un planning par praticienne, la demande se pose sur la personne souhaitée quand elle est disponible, et sur une alternative sinon. <a href="/fonctionnement">Le branchement est expliqué ici</a>.</p>',
    legal: LOI + '<p>Pour le reste, votre cadre habituel suffit : affichage des prix, information sur les prestations, et les coordonnées recueillies traitées comme votre fichier client, dans les règles du RGPD. Attention toutefois aux informations de santé qu’une cliente peut signaler d’elle-même : elles sont sensibles, et ne doivent pas être conservées sans raison.</p>' + LOI_FIN,
  },
}

M['metiers__clinique-esthetique'] = {
  cle: 'Permanence téléphonique pour clinique esthétique',
  cible: 'une clinique esthétique',
  lead: 'Un patient opéré qui appelle le soir attend une consigne claire, pas un répondeur. Voici ce qu’un standard automatique peut faire de cet appel, et la ligne qu’il ne franchit jamais.',
  etapes: [
    ['Il décroche le soir et le week-end.', 'La ligne de la clinique ne change pas. L’appel sonne au secrétariat d’abord et bascule après quelques sonneries sans réponse, ou en dehors des heures d’ouverture — c’est-à-dire au moment où les patients opérés s’inquiètent.'],
    ['Il annonce ce qu’il est, puis il écoute.', 'Aucun menu à touches. Le patient décrit ce qu’il observe, avec ses mots. La première phrase lui dit qu’il parle à un assistant automatique.'],
    ['Il pose vos questions, dans votre ordre.', 'Patient opéré ou premier contact, l’acte concerné, la date de l’intervention, ce qui est observé et depuis quand. Pour un suivi post-opératoire, ces quatre réponses déterminent tout le reste.'],
    ['Il sépare le post-opératoire du premier contact.', 'Un patient opéré il y a trois jours qui décrit un saignement n’est pas une demande de rendez-vous de consultation. C’est la distinction la plus importante à écrire, et elle se décide avec le praticien, pas avec le prestataire.'],
    ['Il énonce votre consigne, ou pose le rendez-vous.', 'Pour un suivi, il dit exactement ce que vous avez écrit : qui joindre, à quel numéro, dans quel délai. Pour un premier contact, il pose la consultation sur un créneau que vous avez ouvert.'],
  ],
  limites: [
    'Aucun conseil médical, aucune réassurance improvisée sur une suite opératoire. Il énonce votre consigne et transmet, rien de plus.',
    'Aucun tarif d’intervention annoncé : la publicité des actes médicaux est encadrée, et un montant lâché au téléphone vous expose.',
    'Aucune promesse de résultat, aucun délai de cicatrisation, aucune comparaison entre techniques.',
  ],
  fin: 'Le cadre réglementaire est traité sur <a href="/conformite">conformité et RGPD</a>. Pour le branchement sur la ligne de la clinique, <a href="/fonctionnement">comment ça se branche</a>.',
  faq: {
    humain: '<p>Oui, c’est annoncé dès la première phrase : le patient sait qu’il parle à un assistant automatique.</p><p>Dans votre spécialité, cette annonce est une protection. Un patient qui croirait parler à une infirmière du bloc attendrait un avis sur sa cicatrice. Dire ce que c’est, c’est écarter cette attente et l’orienter plus vite vers la personne qui peut répondre.</p>',
    agenda: '<p>Oui, si l’agenda de la clinique est en ligne. Les consultations se posent sur les créneaux que vous avez ouverts, et jamais sur une plage opératoire.</p><p>Beaucoup de structures travaillent sur un logiciel métier fermé : la pose directe n’est alors pas toujours possible, et la demande vous arrive comme un créneau à confirmer. C’est la première chose à vérifier auprès de l’éditeur.</p>',
    legal: LOI + '<p>S’y ajoutent, dans votre cas, trois contraintes plus lourdes que l’annonce : le secret médical, le RGPD appliqué à des données de santé, et l’encadrement de la publicité des actes à visée esthétique. Faites valider le script d’appel par le praticien, et interrogez votre ordre avant toute mise en service.</p>' + LOI_FIN,
  },
}

M['metiers__salle-de-sport'] = {
  cle: 'Permanence téléphonique pour salle de sport',
  cible: 'une salle de sport',
  lead: 'Un abonnement perdu, c’est dix mois de cotisation en moins. Et le prospect qui appelle pendant un cours collectif ne rappellera pas. Voici ce qu’un standard automatique fait de cet appel.',
  etapes: [
    ['Il décroche pendant le cours collectif.', 'Le numéro de la salle ne change pas. L’appel sonne à l’accueil d’abord, puis bascule après quelques sonneries sans réponse — notamment aux heures de pointe, quand personne n’est au comptoir.'],
    ['Il annonce ce qu’il est, puis il écoute.', 'Aucun menu à touches : la personne dit ce qu’elle cherche avec ses mots. La première phrase lui précise qu’elle parle à un assistant automatique.'],
    ['Il pose vos questions, dans votre ordre.', 'Ce que la personne cherche — musculation, cours collectifs, coaching —, si elle a déjà pratiqué, quand elle veut venir, et par quel canal elle vous a trouvé. La dernière réponse vous dit où va votre budget de publicité.'],
    ['Il distingue le prospect de la demande administrative.', 'Quelqu’un qui veut venir essayer ce soir n’est pas une demande de résiliation. Le premier remplit votre planning d’essais ; la seconde suit la procédure écrite, sans improvisation.'],
    ['Il pose la séance d’essai sur un créneau de coach libre.', 'Il propose un créneau que vous avez ouvert, relit le prénom et le numéro, puis confirme. Un essai posé dans l’heure se transforme beaucoup mieux qu’un rappel trois jours plus tard.'],
  ],
  limites: [
    'Aucune vente d’abonnement, aucun encaissement, aucun engagement sur une offre promotionnelle que vous n’avez pas écrite.',
    'Aucun traitement de résiliation : il enregistre la demande et la fait suivre selon votre procédure, parce que les délais contractuels vous engagent.',
    'Aucun conseil d’entraînement et aucun avis sur une aptitude ou un certificat médical.',
  ],
  fin: 'La valeur d’un abonnement perdu est chiffrée sur <a href="/calculateur">le calculateur</a>. Pour l’arbitrage avec un poste d’accueil, <a href="/comparer/embaucher-ou-automatiser">embaucher ou automatiser</a>.',
  faq: {
    humain: '<p>Oui, l’appel le dit en commençant. Le prospect sait qu’il parle à un assistant automatique.</p><p>Et il s’en moque, honnêtement. Ce qu’il veut savoir, c’est s’il peut venir essayer ce soir et à quelle heure. Celui qui obtient cette réponse s’inscrit ; celui qui tombe sur un répondeur va voir la salle d’à côté.</p>',
    agenda: '<p>Oui, si le planning des coachs est en ligne : Google Agenda, Outlook, ou l’agenda de votre logiciel de gestion lorsqu’il se synchronise. Les séances d’essai se posent sur les créneaux que vous avez ouverts.</p><p>Vous gardez la main sur le nombre d’essais possibles par jour : ce qui n’est pas ouvert n’est jamais réservé. <a href="/fonctionnement">Le branchement est expliqué ici</a>.</p>',
    legal: LOI + '<p>Attention en revanche à un point propre à votre métier : les conditions d’abonnement et les délais de résiliation engagent votre salle. Un assistant qui improviserait une réponse sur un préavis créerait un litige, donc il ne répond rien et transmet la demande à votre procédure.</p>' + LOI_FIN,
  },
}

M['metiers__auto-ecole'] = {
  cle: 'Permanence téléphonique pour auto-école',
  cible: 'une auto-école',
  lead: 'Vous ne pouvez pas décrocher en leçon, et ce n’est pas une question d’organisation : c’est la loi. Voici ce qu’un standard automatique fait des appels pendant que vous êtes au volant.',
  etapes: [
    ['Il décroche pendant la leçon de conduite.', 'Le numéro de l’auto-école ne change pas. L’appel sonne d’abord chez vous, puis bascule après quelques sonneries sans réponse. Vous gardez les deux mains sur le volant, ce qui est la seule option légale.'],
    ['Il annonce ce qu’il est, puis il écoute.', 'Aucun menu à touches : le candidat ou son parent explique sa demande avec ses mots. La première phrase lui précise qu’il parle à un assistant automatique.'],
    ['Il pose vos questions, dans votre ordre.', 'Le permis visé, première inscription ou conduite accompagnée, si le code est déjà obtenu, les disponibilités réelles pour les heures de conduite, et la commune. C’est ce qui décide du forfait à présenter.'],
    ['Il distingue l’annulation du prospect.', 'Un élève qui annule son heure de demain n’est pas un candidat qui veut s’inscrire. Le premier libère un créneau de moniteur, le second peut le prendre — et un créneau de conduite vide ne se rattrape pas.'],
    ['Il pose le rendez-vous sur un créneau de moniteur libre.', 'Il propose un créneau que vous avez ouvert — rendez-vous d’inscription ou heure de conduite —, relit le prénom et le numéro, puis confirme.'],
  ],
  limites: [
    'Aucune vente de forfait et aucun encaissement.',
    'Aucun engagement sur une date d’examen, qui ne dépend pas de vous mais des places attribuées.',
    'Aucune estimation du nombre d’heures nécessaires : c’est une évaluation, elle se fait en voiture.',
  ],
  fin: 'Le coût d’une heure de conduite non remplie est chiffré sur <a href="/calculateur">le calculateur</a>, et les annulations sont traitées sur <a href="/category/rendez-vous-annules">rendez-vous annulés</a>.',
  faq: {
    humain: '<p>Oui, c’est annoncé dès le début de l’appel : le candidat ou son parent sait qu’il parle à un assistant automatique.</p><p>Cela ne change rien à sa décision. Ce qui la change, c’est d’avoir obtenu un rendez-vous d’inscription pour mercredi, pendant que les deux autres auto-écoles de la ville laissaient sonner.</p>',
    agenda: '<p>Oui, si le planning des moniteurs est en ligne : Google Agenda, Outlook, ou l’agenda de votre logiciel de gestion lorsqu’il se synchronise. Les heures de conduite se posent sur les créneaux restés libres.</p><p>Avec un planning par moniteur, seuls les créneaux ouverts sont proposés, sans double réservation. <a href="/fonctionnement">Le branchement est détaillé ici</a>.</p>',
    legal: LOI + '<p>Pour le reste, votre cadre habituel s’applique : contrat écrit, affichage des tarifs et des taux de réussite, information sur les conditions d’inscription. Un assistant qui s’engagerait sur un forfait ou une date d’examen vous mettrait en difficulté, donc il n’en parle pas.</p>' + LOI_FIN,
  },
}

M['metiers__restaurant-traiteur'] = {
  cle: 'Permanence téléphonique pour restaurant',
  cible: 'un restaurant',
  lead: 'Le téléphone sonne le plus fort au moment du coup de feu, quand personne ne peut le prendre. Voici ce qu’un standard automatique fait de ces appels, et ce qu’il laisse à la cuisine.',
  etapes: [
    ['Il décroche pendant le service.', 'Le numéro du restaurant ne change pas. L’appel sonne en salle d’abord, puis bascule après quelques sonneries sans réponse — c’est-à-dire entre 12 h et 14 h, et entre 19 h et 22 h.'],
    ['Il annonce ce qu’il est, puis il écoute.', 'Aucun menu à touches : la personne demande sa table comme elle le ferait au comptoir. La première phrase lui précise qu’elle parle à un assistant automatique.'],
    ['Il pose vos questions, dans votre ordre.', 'Le nombre de couverts, le jour et l’heure, en salle ou en terrasse, les allergies ou régimes signalés, et le numéro de rappel. Cinq réponses, et la réservation peut être posée.'],
    ['Il distingue le groupe de la table ordinaire.', 'Douze personnes un samedi soir et une table de deux en semaine n’appellent pas la même suite. Le groupe passe par votre validation ; la table de deux se pose toute seule.'],
    ['Il pose la réservation sur les créneaux que vous avez ouverts.', 'Il relit le nom, le nombre de couverts et l’heure, puis confirme. Vous retrouvez la liste du service sans avoir écouté un seul message.'],
  ],
  limites: [
    'Aucune commande à emporter ni paiement, sauf si vous mettez expressément ce point en place.',
    'Aucune garantie d’absence d’allergène et aucun plat inventé : il note la demande, la cuisine décide.',
    'Aucune sur-réservation. Ce qui n’est pas ouvert dans votre plan de salle n’est jamais proposé.',
  ],
  fin: 'Ce que coûte une table perdue est chiffré sur <a href="/calculateur">le calculateur</a>. Pour comparer avec un télésecrétariat, <a href="/comparer/permanence-telephonique">comparer les solutions</a>.',
  faq: {
    humain: '<p>Oui, c’est dit dès le début de l’appel : la personne sait qu’elle parle à un assistant automatique.</p><p>Pour réserver une table, personne n’y voit d’objection. Ce qui fait partir un client ailleurs, c’est de sonner quinze fois un vendredi soir sans réponse.</p>',
    agenda: '<p>Oui, si votre plan de salle ou votre outil de réservation est accessible en ligne. Les réservations se posent sur les créneaux et les tables que vous avez ouverts, jamais au-delà.</p><p>Si vous tenez le cahier de réservation sur papier, la pose directe n’est pas possible : les demandes vous arrivent alors comme des réservations à confirmer. C’est à régler avant la mise en service, <a href="/fonctionnement">le branchement est détaillé ici</a>.</p>',
    legal: LOI + '<p>Pour le reste, votre cadre habituel suffit : information sur les allergènes, affichage des prix, et traitement des coordonnées dans les règles du RGPD. La règle à tenir est de ne faire garantir aucune absence d’allergène par téléphone : l’assistant note, la cuisine répond.</p>' + LOI_FIN,
  },
}

/* ------------------------------------------------------------------ *
 * La fabrication du HTML.
 * ------------------------------------------------------------------ */

/** Une minuscule sur la première lettre, pour que la scène passe derrière
 *  « Permanence téléphonique pour plombier&nbsp;: ». */
const minuscule = (t) => t.charAt(0).toLowerCase() + t.slice(1)

/** Le site écrit l'apostrophe droite, partout, sans exception. Les textes
 *  ci-dessus utilisent l'apostrophe courbe parce qu'elle se lit mieux dans le
 *  code ; on la ramène à la convention de la maison en sortie. */
const maison = (t) => t.replaceAll('\u2019', '\u0027')

function sectionMecanisme(d) {
  const etapes = d.etapes.map(([t, p], i) =>
    `<div class="cai-mec-p"><b>${i + 1}</b><p><strong>${t}</strong>${p}</p></div>`).join('\n')
  const limites = d.limites.map((l) => `<li>${l}</li>`).join('\n')
  return maison(`<!-- LE MÉCANISME -->
<section class="cai-box">
<div class="cai-head">
<span class="cai-eye">Le mécanisme</span>
<h2>Standard téléphonique IA pour ${d.cible}&nbsp;: <em>ce qu’il fait vraiment</em></h2>
<p class="cai-lead" style="max-width:60ch">${d.lead}</p>
</div>
<div class="cai-mec">
${etapes}
</div>
<div class="cai-mec-no">
<h3>Ce qu’il ne fait pas</h3>
<ul>
${limites}
</ul>
</div>
<p class="cai-fine cai-mec-fin">Le fonctionnement détaillé, les prix relevés chez trois prestataires et les sept appels à passer pendant l’essai sont dans notre guide du <a href="/standard-telephonique-ia">standard téléphonique IA</a>. ${d.fin}</p>
</section>
`)
}

function questions(d) {
  return maison(['humain', 'agenda', 'legal'].map((k) =>
    `<details data-r="cai-faq-${k}">
<summary>${QUESTIONS[k]}</summary>
<div class="cai-ans">${d.faq[k]}</div>
</details>`).join('\n') + '\n')
}

/* ------------------------------------------------------------------ *
 * L'application sur les fichiers.
 * ------------------------------------------------------------------ */

let faits = 0, sautes = 0
for (const [nom, d] of Object.entries(M)) {
  const chemin = join(RACINE, 'src/contenu', nom + '.html')
  let h = readFileSync(chemin, 'utf8')

  if (h.includes('cai-mec-p')) { console.log(`· ${nom} : déjà fait`); sautes++; continue }

  /* 1. le mot-clé en tête du H1 ------------------------------------ */
  const avant = h
  h = h.replace(/<h1 style="max-width:\d+ch;margin:22px 0 20px">([\s\S]*?)<\/h1>/,
    (_, scene) => maison(`<h1 style="max-width:30ch;margin:22px 0 20px">${d.cle}&nbsp;: ${minuscule(scene)}</h1>`))
  if (h === avant) throw new Error(`${nom} : H1 non reconnu`)

  /* Le H1 s'allonge d'une demi-ligne. Sur un écran de 390 pixels, le plancher
     de 1,95 rem en faisait une tour de six lignes : on descend le plancher
     sans toucher au maximum sur grand écran. */
  h = h.replaceAll('.cai h1{font-size:clamp(1.95rem,3.6vw,2.6rem)}',
    '.cai h1{font-size:clamp(1.72rem,3.6vw,2.6rem)}')

  /* 2. la section mécanisme, juste avant la FAQ -------------------- */
  const iFaq = h.indexOf('<div class="cai-faq">')
  if (iFaq < 0) throw new Error(`${nom} : pas de bloc FAQ`)
  let debut = h.lastIndexOf('<section', iFaq)
  if (debut < 0) throw new Error(`${nom} : pas de section autour de la FAQ`)
  /* Le commentaire de repère qui précède la section lui appartient : on passe
     devant lui, sinon « <!-- 7. FAQ --> » se retrouve au-dessus du mécanisme. */
  const avantSection = h.slice(0, debut).trimEnd()
  if (/<!--[^>]*-->$/.test(avantSection)) debut = avantSection.lastIndexOf('<!--')
  h = h.slice(0, debut) + sectionMecanisme(d) + h.slice(debut)

  /* 3. les trois questions, à la fin du bloc FAQ ------------------- */
  const iFaq2 = h.indexOf('<div class="cai-faq">')
  const fin = h.indexOf('\n</div>', h.lastIndexOf('</details>', h.indexOf('</section>', iFaq2)))
  if (fin < 0) throw new Error(`${nom} : fin du bloc FAQ introuvable`)
  h = h.slice(0, fin + 1) + questions(d) + h.slice(fin + 1)

  if (ecrire) writeFileSync(chemin, h)
  console.log(`${ecrire ? '✓' : '→'} ${nom}`)
  faits++
}

console.log(`\n${faits} page(s) ${ecrire ? 'écrite(s)' : 'à écrire'}, ${sautes} sautée(s).`)
if (!ecrire) console.log('Rien n’a été modifié. Relancer avec --ecrire.')
