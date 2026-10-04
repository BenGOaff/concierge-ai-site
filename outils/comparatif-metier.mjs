/**
 * « Meilleur standard téléphonique pour un [métier] » : une page par métier.
 *
 * Pourquoi ces pages existent, alors que le site a déjà des pages métier et un
 * comparatif. Les trois répondent à des questions différentes, et c'est la
 * seule façon de ne pas se cannibaliser :
 *   — /metiers/<x>            : ce qui arrive à mes appels, et ce que ça coûte
 *   — /comparer/permanence…   : les quatre familles de solutions, en général
 *   — cette page              : laquelle je prends, pour MON métier
 *
 * Deux règles tenues ici :
 *   — les prix nommés par prestataire vivent sur /prix-du-marche et nulle part
 *     ailleurs. Ici on ne met que des fourchettes par famille, et un lien.
 *     Dupliquer une grille, c'est se contredire au premier changement de tarif.
 *   — chaque page dit pour qui la recommandation ne vaut pas. C'est ce qui
 *     rend le reste crédible, et c'est demandé dans le référentiel.
 *
 *   node outils/comparatif-metier.mjs            # dit ce qu'il écrirait
 *   node outils/comparatif-metier.mjs --ecrire
 */

import { writeFileSync, mkdirSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const RACINE = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SITE = 'https://www.concierge-ai.fr'
const ecrire = process.argv.includes('--ecrire')

/** Le site écrit l'apostrophe droite, partout, sans exception. */
const maison = (t) => String(t).replaceAll('’', "'")
const echapper = (t) => maison(t)
  .replace(/&(?!nbsp;|amp;|lt;|gt;|quot;)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
/** Le texte d'un schéma n'est pas du HTML. */
const nu = (h) => maison(h).replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ')
  .replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim()

export const METIERS = [
  {
    slug: 'plombier',
    metier: 'plombier',
    fil: 'Plombier',
    pageMetier: '/metiers/plombier-chauffagiste',
    titre: "Meilleur standard téléphonique plombier : le comparatif",
    description: "Les cinq critères qui décident pour un plombier, les familles de solutions comparées sur un appel de 23 h, et combien d'interventions il faut récupérer pour que ce soit payé.",
    h1: "Meilleur standard téléphonique pour un plombier",
    lead: "Cinq critères qui éliminent, quatre familles de solutions mises face au même appel de 23 h, et le calcul qui dit si ça vaut le coup chez vous.",
    puces: [
      "Le critère qui élimine le plus n'est pas le prix",
      "Chaque solution est jugée sur le même appel réel",
      "Les prix sont des fourchettes relevées à la source",
    ],
    court: "Pour un plombier, ce qui élimine le plus de solutions n'est pas le prix, c'est l'heure. Une fuite active à 23&nbsp;h ne se traite pas avec un prestataire dont la ligne ferme à 20&nbsp;h.",
    courtCle: "Les télésecrétariats relevés s'arrêtent entre 18 et 20&nbsp;h. Les standards IA couvrent les 168 heures de la semaine.",
    courtSuite: "Reste à savoir ce que chacun fait de l'appel une fois qu'il décroche, parce que prendre un message et poser une intervention ne sont pas le même métier.",
    criteres: [
      ["Il doit tenir à 23 h, et le dimanche.", "Une fuite active n'attend pas l'ouverture, et c'est exactement l'heure où vos confrères ne décrochent pas. Celui qui répond prend le chantier. Si la solution ferme à 20&nbsp;h, elle ne traite pas la moitié de ce qui a de la valeur."],
      ["Il doit séparer la fuite active du devis de salle de bain.", "Les deux arrivent sur la même ligne, souvent à la même heure. L'une vous sort du lit, l'autre attend lundi matin. Sans liste écrite à l'avance, vous êtes réveillé pour un devis, et vous finissez par ne plus décrocher du tout."],
      ["Il doit prendre l'adresse juste du premier coup.", "C'est le reproche numéro un dans les avis clients des télésecrétariats&nbsp;: les noms et les numéros pris à l'oreille. Une adresse fausse à 23&nbsp;h, c'est un camion qui roule pour rien et un client qui ne rappellera pas. Demandez si les informations sont répétées à voix haute pour validation avant la fin de l'appel."],
      ["Il doit annoncer une fourchette, jamais un prix ferme.", "Les majorations de nuit et de week-end doivent être annoncées avant le déplacement. Un montant ferme donné au téléphone sur un métier où le diagnostic se fait sur place, c'est un litige en préparation. La règle sûre&nbsp;: un ordre de grandeur pour le déplacement, le devis après constat."],
      ["Il ne doit pas vous facturer la question de plus.", "Demander l'étage, le code d'accès, si l'arrivée d'eau est coupée&nbsp;: trente secondes qui changent l'intervention. Facturées à la minute, elles vous coûtent de l'argent à chaque appel, et le prestataire n'a aucun intérêt à les prendre."],
    ],
    appel: "un appel de 23 h pour une fuite active",
    tableau: {
      colonnes: ["La solution", "Couverture", "Ce qu'elle fait de l'appel de 23 h", "Prix mensuel"],
      lignes: [
        ["Le répondeur de votre opérateur", "24 h/24", "Enregistre, si le client accepte de laisser un message", "0 €"],
        ["Télésecrétariat, heures ouvrées", "Lun-ven, 8 h - 18 h", "Rien, la ligne est fermée depuis cinq heures", "38 à 160 €"],
        ["Télésecrétariat, horaires étendus", "Lun-sam, 8 h - 20 h", "Rien après 20 h, sauf option de garde facturée", "84 à 299 €"],
        ["Compteur IA à la minute", "24 h/24", "Prend la demande, et vous facture chaque question posée", "23 à 368 € selon la durée"],
        ["Standard IA au forfait", "24 h/24", "Qualifie l'urgence, vérifie l'adresse, vous transfère ou planifie", "297 €"],
        ["Une personne à l'accueil", "35 h par semaine", "Rien, elle dort", "1 700 à 2 000 € chargés"],
      ],
      surligne: 4,
    },
    apres: "Trois des six lignes ne font rien du tout de cet appel. C'est la première chose à regarder avant de comparer des prix, parce qu'une solution qui ne couvre pas vos heures n'est pas moins chère, elle est absente.",
    unite: "intervention",
    unitePluriel: "interventions",
    uniteArticle: "une intervention",
    uniteRapporte: "une intervention vous rapporte",
    demi: "une demi-intervention",
    paniers: [150, 250, 450],
    panierNote: "Une intervention de plomberie se situe couramment entre 150 et 450 € selon la nature du dépannage.",
    reco: {
      titre: "Ce qu'on vous conseille, et pour qui ça ne vaut pas",
      pour: "Si vous faites du dépannage en urgence, prenez un standard qui couvre les 168 heures et qui facture au forfait de conversations. L'heure est votre premier critère, et le compteur à la minute vous pousse à écourter l'appel au moment précis où il faut demander l'étage et si l'eau est coupée.",
      contre: "Si vous ne faites que du chantier planifié, sans astreinte, et que vos clients vous appellent en journée, un télésecrétariat en heures ouvrées suffit et coûte trois fois moins cher. Ne payez pas pour des nuits que personne n'utilise.",
      entre: "Entre les deux, le partage se fait sur une question simple&nbsp;: combien d'appels recevez-vous après 19&nbsp;h et le week-end&nbsp;? Comptez-les pendant une semaine ordinaire avant de signer quoi que ce soit.",
    },
    faq: [
      ["Quel standard téléphonique choisir quand on est plombier seul ?",
       "<p>Celui qui couvre les heures où l'on vous appelle, et qui sait distinguer une fuite active d'une demande de devis. Pour un plombier qui fait du dépannage, cela élimine d'emblée les solutions qui ferment à 18 ou 20&nbsp;h.</p><p>Le deuxième critère est la qualité de l'adresse prise. Un déplacement perdu à 23&nbsp;h coûte plus cher qu'un mois d'abonnement.</p>"],
      ["Un standard automatique sait-il reconnaître une urgence de plomberie ?",
       "<p>Selon vos règles, pas selon les siennes. Vous écrivez la liste des motifs qui justifient un transfert immédiat&nbsp;: fuite active, dégât des eaux, plus d'eau chaude en hiver, chaudière morte. Le reste est planifié et vous le découvrez au réveil.</p><p>Sans cette liste, aucune solution ne fera le tri correctement, humaine ou non.</p>"],
      ["Peut-il annoncer un prix de dépannage au téléphone ?",
       "<p>Une fourchette que vous avez écrite, oui. Un prix ferme, non. Sur un métier où le diagnostic se fait sur place, annoncer un montant que vous ne pourrez pas tenir est le meilleur moyen de vous créer un litige.</p><p>Les majorations de nuit et de week-end, elles, doivent être annoncées avant le déplacement. Faites-les énoncer sous forme de fourchette validée par vous.</p>"],
      ["Combien ça coûte, pour un plombier ?",
       "<p>De 0 € pour un répondeur à 2 000 € chargés pour une personne à l'accueil. Entre les deux, un télésecrétariat en heures ouvrées se situe entre 38 et 299 € selon le volume, un standard IA au forfait à 297 € pour les 168 heures de la semaine.</p><p>Le détail des grilles relevées chez dix prestataires est sur <a href=\"/prix-du-marche\">la page des tarifs du marché</a>.</p>"],
      ["Mes clients sont souvent âgés, est-ce que ça passe ?",
       "<p>Il n'y a ni menu à touches ni « tapez 1 »&nbsp;: la personne parle normalement. C'est plus simple qu'un serveur vocal, et nettement plus simple qu'un répondeur sur lequel il faut laisser un message.</p><p>Vérifiez une chose avant de signer&nbsp;: que l'adresse et le numéro soient répétés à voix haute pour validation. C'est ce qui fait la différence sur un appel pris dans le bruit.</p>"],
      ["Je suis déjà d'astreinte, à quoi ça sert ?",
       "<p>Être d'astreinte veut dire répondre à tout, y compris à ce qui pouvait attendre lundi. Un filtre garde l'astreinte et supprime les réveils inutiles&nbsp;: les vraies urgences arrivent sur votre portable, le reste est planifié.</p><p>C'est la différence entre une nuit où vous dormez et une nuit où vous sursautez à chaque sonnerie. La méthode est détaillée dans <a href=\"/guides/astreinte-et-tri-des-urgences\">astreinte et tri des urgences</a>.</p>"],
    ],
    cta: "Un appel de fuite à 23 h, sur votre vraie ligne",
    quiz: {
      titre: "Combien d'interventions <em>partent chez le concurrent&nbsp;?</em>",
      chapo: "Cinq questions pour savoir ce qui arrive sur votre ligne le soir et le week-end, et ce que ça représente sur un mois.",
    },
  },

  {
    slug: 'cabinet-dentaire',
    metier: 'cabinet dentaire',
    fil: 'Cabinet dentaire',
    pageMetier: '/metiers/cabinet-dentaire',
    titre: "Meilleur standard téléphonique cabinet dentaire : comparatif",
    description: "Les cinq critères qui décident pour un cabinet dentaire, dont l'hébergement des données, les familles de solutions comparées, et le calcul sur un fauteuil vide.",
    h1: "Meilleur standard téléphonique pour un cabinet dentaire",
    lead: "Cinq critères qui éliminent, à commencer par l'hébergement des données, et les solutions mises face au même appel reçu pendant un soin.",
    puces: [
      "L'hébergement des données passe avant le prix",
      "Chaque solution est jugée sur le même appel réel",
      "Le calcul tient compte des rendez-vous non honorés",
    ],
    court: "Pour un cabinet dentaire, le premier critère n'est pas le prix et ce n'est pas non plus la couverture horaire. C'est ce que devient l'enregistrement de l'appel.",
    courtCle: "Un motif d'appel associé à un nom, chez un dentiste, est une donnée de santé.",
    courtSuite: "Le deuxième critère est tout aussi concret&nbsp;: une solution qui prend un message ne vous fait rien gagner, parce que quelqu'un devra rappeler. Ce qui compte est le rendez-vous posé dans l'agenda pendant l'appel.",
    criteres: [
      ["L'hébergement des données, et la réponse écrite.", "Demandez par écrit ce qui est enregistré, où c'est hébergé, combien de temps c'est conservé et qui y accède. Pour les professions de santé, faites de la certification HDS votre premier critère d'élimination. Une phrase sur une page d'accueil n'est pas un engagement contractuel&nbsp;: la réponse qui compte est dans le contrat de sous-traitance."],
      ["Il doit poser le rendez-vous, pas prendre un message.", "Un message à rappeler, c'est votre assistante qui rappelle. Le temps n'est pas gagné, il est déplacé, et souvent sur un moment où elle est déjà au fauteuil. Vérifiez que l'agenda est connecté en écriture, pas seulement en lecture."],
      ["Il doit énoncer la consigne d'urgence hors horaires.", "En dehors des heures d'ouverture, une urgence dentaire relève du 15. Cette phrase doit être prononcée à chaque appel concerné, pas sous-entendue, et elle doit figurer dans le script que vous validez."],
      ["Il doit faire baisser les rendez-vous non honorés.", "Un fauteuil vide ne se rattrape pas. Le rappel la veille par message est la seule chose qui déplace vraiment l'aiguille. Demandez si c'est inclus ou facturé à l'unité, parce qu'à 0,18 € le message, le total change la comparaison."],
      ["Il ne doit pas écourter l'appel d'un patient âgé.", "Répéter, reformuler, confirmer l'heure deux fois&nbsp;: ça prend du temps, et c'est exactement ce qu'il faut faire. Facturé à la minute, ce temps vous coûte, et personne n'a intérêt à le prendre."],
    ],
    appel: "un appel reçu pendant un soin",
    tableau: {
      colonnes: ["La solution", "Couverture", "Ce qu'elle fait de l'appel pendant un soin", "Prix mensuel"],
      lignes: [
        ["Le répondeur du cabinet", "24 h/24", "Enregistre un message que quelqu'un devra écouter puis rappeler", "0 €"],
        ["Télésecrétariat médical", "Lun-ven, 8 h - 18 h", "Prend l'appel et pose le rendez-vous, selon le contrat", "38 à 299 €"],
        ["Compteur IA à la minute", "24 h/24", "Prend la demande, et facture chaque reformulation", "23 à 368 € selon la durée"],
        ["Standard IA au forfait", "24 h/24", "Pose le rendez-vous dans l'agenda, envoie le rappel de la veille", "297 €"],
        ["Une assistante dédiée au téléphone", "35 h par semaine", "Tout, et le reste du temps elle est au fauteuil", "1 700 à 2 000 € chargés"],
      ],
      surligne: 3,
    },
    apres: "Le télésecrétariat médical reste la solution la plus répandue chez les cabinets, et pour de bonnes raisons&nbsp;: il connaît le vocabulaire et il engage une responsabilité contractuelle sur les données. Son angle mort est l'horaire, et le prix des options quand on les additionne.",
    unite: "acte",
    unitePluriel: "actes",
    uniteArticle: "un acte",
    uniteRapporte: "un acte vous rapporte",
    demi: "un demi-acte",
    paniers: [50, 120, 300],
    panierNote: "Le montant moyen d'un acte varie fortement selon votre activité. Remplacez-le par le vôtre, c'est le seul chiffre qui compte.",
    reco: {
      titre: "Ce qu'on vous conseille, et pour qui ça ne vaut pas",
      pour: "Commencez par la question de l'hébergement, et éliminez tout prestataire qui ne répond pas par écrit. Ensuite seulement, comparez sur deux points&nbsp;: le rendez-vous est-il posé dans l'agenda pendant l'appel, et le rappel de la veille est-il inclus. Ce sont les deux seules choses qui changent une journée de cabinet.",
      contre: "Si vous tenez votre planning sur un logiciel métier fermé, la pose directe de rendez-vous n'est pas possible chez la plupart des prestataires. Posez la question avant de signer&nbsp;: vous récupérerez une demande à confirmer, ce qui reste utile mais ne vous fait pas gagner le temps annoncé.",
      entre: "Et si votre volume d'appels tient en une dizaine par jour aux heures ouvrées, un télésecrétariat médical couvre votre besoin pour moins cher. Les 168 heures ne se justifient que si l'on vous appelle hors horaires.",
    },
    faq: [
      ["Les données de mes patients sont-elles protégées ?",
       "<p>Cela dépend entièrement du prestataire, et c'est à vérifier par écrit avant de signer. Demandez ce qui est enregistré, où c'est hébergé, pendant combien de temps et qui y accède.</p><p>Pour une profession de santé, la certification HDS doit être votre premier critère d'élimination. Une mention sur une page d'accueil ne vaut pas engagement&nbsp;: demandez le contrat de sous-traitance.</p>"],
      ["Un standard automatique peut-il poser un rendez-vous dans mon agenda ?",
       "<p>Oui si votre agenda est en ligne et connecté en écriture. Les créneaux proposés sont ceux qui restent libres, et le rendez-vous s'y écrit pendant l'appel.</p><p>Si votre planning vit dans un logiciel métier fermé, la pose directe n'est généralement pas possible. La demande vous arrive alors comme un créneau à confirmer.</p>"],
      ["Que se passe-t-il pour une urgence dentaire le soir ?",
       "<p>La consigne doit être énoncée clairement&nbsp;: en dehors des heures d'ouverture, une urgence dentaire relève du 15. Cette phrase fait partie du script que vous validez, et elle doit être prononcée, pas sous-entendue.</p><p>Le reste des appels du soir est qualifié et planifié pour le lendemain matin.</p>"],
      ["Est-ce que ça réduit vraiment les rendez-vous non honorés ?",
       "<p>Le rappel la veille par message est le levier qui fonctionne, et il fonctionne quel que soit le prestataire qui l'envoie. Ce qui change d'une offre à l'autre, c'est s'il est inclus ou facturé à l'unité.</p><p>À 0,18 € le message et plusieurs centaines de rendez-vous par mois, la ligne pèse. Demandez le prix avant de comparer deux forfaits.</p>"],
      ["Mes patients vont-ils savoir que ce n'est pas une personne ?",
       "<p>Oui, dès la première phrase. Depuis le 2 août 2026, l'article 50 du règlement européen sur l'intelligence artificielle impose d'informer votre correspondant qu'il parle à un système d'intelligence artificielle.</p><p>Une phrase d'accueil y suffit, et elle est prononcée au début de chaque appel.</p>"],
      ["Combien ça coûte pour un cabinet dentaire ?",
       "<p>De 38 à 299 € par mois pour un télésecrétariat médical selon le volume et les options, 297 € pour un standard au forfait couvrant les 168 heures, 1 700 à 2 000 € chargés pour une assistante dédiée au téléphone.</p><p>Le relevé détaillé chez dix prestataires est sur <a href=\"/prix-du-marche\">la page des tarifs du marché</a>.</p>"],
    ],
    cta: "Un appel pendant un soin, sur votre vraie ligne",
    quiz: {
      titre: "Combien de patients <em>appellent ailleurs&nbsp;?</em>",
      chapo: "Cinq questions pour savoir ce qui arrive sur votre ligne pendant les soins, et ce que ça représente sur un mois.",
    },
  },

  {
    slug: 'garage',
    metier: 'garage',
    fil: 'Garage',
    pageMetier: '/metiers/garage-carrosserie',
    titre: "Meilleur standard téléphonique pour un garage : comparatif",
    description: "Les cinq critères qui décident pour un garage, dont la plaque prise sans erreur, les solutions comparées sur un appel reçu sous un capot, et le calcul par entrée d'atelier.",
    h1: "Meilleur standard téléphonique pour un garage",
    lead: "Cinq critères qui éliminent, à commencer par l'immatriculation prise juste, et les solutions face au même appel reçu les mains dans un moteur.",
    puces: [
      "Votre problème est la journée, pas la nuit",
      "Chaque solution est jugée sur le même appel réel",
      "Le calcul se fait par entrée d'atelier",
    ],
    court: "Pour un garage, le besoin n'est pas le même que chez un dépanneur. Vos clients n'appellent pas à 3&nbsp;h du matin&nbsp;: ils appellent entre 8&nbsp;h et 18&nbsp;h, pendant que vous avez les mains dans un moteur.",
    courtCle: "Ce qui vous coûte, ce n'est pas la nuit. C'est la journée.",
    courtSuite: "Du coup le critère qui élimine n'est pas la couverture horaire mais la précision&nbsp;: une immatriculation ou un modèle mal pris, et c'est une pièce commandée pour rien.",
    criteres: [
      ["Il doit prendre la plaque et le modèle sans se tromper.", "Une immatriculation mal notée, c'est une pièce commandée pour rien et deux jours perdus. C'est aussi le reproche numéro un dans les avis clients des télésecrétariats, les informations prises à l'oreille. Demandez si la plaque est répétée à voix haute pour validation avant la fin de l'appel."],
      ["Il doit donner un créneau, pas une promesse de rappel.", "« On vous rappelle » envoie votre client au garage suivant, parce qu'il a une voiture immobilisée et qu'il appelle trois numéros. Un créneau posé dans l'agenda pendant l'appel, c'est une voiture qui entre à l'atelier."],
      ["Il doit répondre en journée, pas seulement le soir.", "C'est ce qui distingue votre besoin de celui d'un dépanneur. Un standard qui brille à 3&nbsp;h du matin et qui coûte cher pour ça ne règle pas votre problème, qui tient entre 8&nbsp;h et 18&nbsp;h."],
      ["Il doit savoir dire qu'il ne sait pas.", "Un diagnostic au téléphone sur un bruit de moteur, c'est un client déçu en arrivant et une réputation abîmée. La bonne réponse à « c'est grave, docteur » est un créneau et une fourchette de main d'œuvre, pas un avis."],
      ["Il doit répondre sur le véhicule de courtoisie.", "La question tombe à presque chaque appel, et elle décide souvent du rendez-vous. Mettez la réponse dans le script que vous validez, avec vos conditions réelles&nbsp;: disponibilité, caution, carburant."],
    ],
    appel: "un appel reçu pendant que vous êtes sous un capot",
    tableau: {
      colonnes: ["La solution", "Couverture", "Ce qu'elle fait de l'appel de 10 h 30", "Prix mensuel"],
      lignes: [
        ["Le répondeur de l'atelier", "24 h/24", "Enregistre, si le client accepte de laisser un message", "0 €"],
        ["Un compagnon qui s'essuie les mains", "Vos horaires", "Répond, mais vous perdez dix minutes de travail facturable", "0 € affiché"],
        ["Télésecrétariat, heures ouvrées", "Lun-ven, 8 h - 18 h", "Prend l'appel et le message, pose le créneau selon le contrat", "38 à 299 €"],
        ["Compteur IA à la minute", "24 h/24", "Prend la demande, et facture chaque précision demandée", "23 à 368 € selon la durée"],
        ["Standard IA au forfait", "24 h/24", "Prend la plaque, propose un créneau libre, le pose dans l'agenda", "297 €"],
        ["Une personne à l'accueil", "35 h par semaine", "Tout, et elle fait aussi la facturation et le comptoir", "1 700 à 2 000 € chargés"],
      ],
      surligne: 4,
    },
    apres: "La deuxième ligne est celle qu'on oublie toujours de compter. Un compagnon qui s'arrête pour décrocher, c'est dix minutes de travail facturable perdues par appel. À quinze appels par jour et 60 € de l'heure d'atelier, le répondeur gratuit coûte cher.",
    unite: "entrée d'atelier",
    unitePluriel: "entrées d'atelier",
    uniteArticle: "une entrée d'atelier",
    uniteRapporte: "une entrée d'atelier vous rapporte",
    demi: "une demi-facture",
    paniers: [200, 400, 800],
    panierNote: "Le montant moyen d'une facture d'atelier varie selon que vous faites de l'entretien courant ou de la mécanique lourde. Remplacez-le par le vôtre.",
    reco: {
      titre: "Ce qu'on vous conseille, et pour qui ça ne vaut pas",
      pour: "Pour un garage, prenez d'abord une solution qui pose le créneau pendant l'appel et qui répète l'immatriculation pour validation. La couverture 24 h/24 est un bonus agréable, elle n'est pas votre problème principal. Testez la prise de plaque avant de signer, c'est là que tout se joue.",
      contre: "Si vous avez déjà quelqu'un au comptoir toute la journée et que le téléphone est pris à chaque fois, vous n'avez pas besoin d'un standard. Votre sujet est peut-être ailleurs, du côté de la prise de rendez-vous en ligne.",
      entre: "Et si vous faites du dépannage et du remorquage en plus de l'atelier, relisez la page plombier&nbsp;: votre besoin ressemble alors davantage au sien, et l'heure redevient le premier critère.",
    },
    faq: [
      ["Un standard automatique sait-il noter une immatriculation ?",
       "<p>C'est la première chose à tester avant de signer, chez n'importe quel prestataire. Demandez que la plaque et le modèle soient répétés à voix haute pour validation avant la fin de l'appel.</p><p>Les informations prises à l'oreille sont le reproche numéro un relevé dans les avis clients des télésecrétariats, et une plaque fausse coûte une pièce commandée pour rien.</p>"],
      ["Peut-il donner un prix de réparation au téléphone ?",
       "<p>Une fourchette de main d'œuvre que vous avez écrite, oui. Un montant ferme sur un bruit décrit au téléphone, non&nbsp;: c'est un client déçu en arrivant.</p><p>La bonne réponse à « c'est grave » est un créneau de diagnostic et un ordre de grandeur pour l'heure d'atelier.</p>"],
      ["J'ai besoin de quelqu'un en journée, pas la nuit. Est-ce que ça se justifie ?",
       "<p>Oui, et c'est même le cas le plus courant pour un garage. Votre problème n'est pas l'appel de 3&nbsp;h du matin, c'est l'appel de 10&nbsp;h 30 pendant que vous êtes sous un capot.</p><p>Comptez ce qu'un compagnon qui s'arrête pour décrocher vous coûte en temps facturable&nbsp;: dix minutes par appel, à votre taux horaire d'atelier, c'est souvent la vraie dépense.</p>"],
      ["Et la question du véhicule de courtoisie ?",
       "<p>Elle tombe à presque chaque appel et elle décide souvent du rendez-vous. Mettez la réponse dans le script&nbsp;: disponibilité réelle, caution, état du carburant, conditions d'assurance.</p><p>Une réponse claire au téléphone évite une discussion au comptoir et un client mécontent le jour de la restitution.</p>"],
      ["Combien ça coûte pour un garage ?",
       "<p>De 38 à 299 € par mois pour un télésecrétariat en heures ouvrées selon le volume, 297 € pour un standard au forfait qui couvre les 168 heures, 1 700 à 2 000 € chargés pour une personne à l'accueil.</p><p>Le relevé détaillé chez dix prestataires est sur <a href=\"/prix-du-marche\">la page des tarifs du marché</a>.</p>"],
      ["Quand les appels montent-ils le plus dans l'année ?",
       "<p>À la première gelée, puis tout janvier&nbsp;: batteries à plat, refus de démarrage le matin, pare-brise et pneus. C'est aussi la période où vos créneaux sont les plus pleins.</p><p>Le calendrier complet, métier par métier, est dans <a href=\"/appels-hiver\">les appels d'hiver</a>.</p>"],
    ],
    cta: "Un appel de 10 h 30, sur votre vraie ligne",
    quiz: {
      titre: "Combien d'entrées d'atelier <em>vous échappent&nbsp;?</em>",
      chapo: "Cinq questions pour savoir ce qui arrive sur votre ligne pendant que vous travaillez, et ce que ça représente sur un mois.",
    },
  },
]

const STYLE = `<style>
.cai h1{font-size:clamp(1.9rem,3.5vw,2.55rem)}
.cai h2{font-size:clamp(1.6rem,3.2vw,2.35rem)}
.cai .cai-head h2{max-width:26ch}
.cai .cai-head p{margin-top:4px}
.cai .cai-say{font-size:clamp(1.12rem,1.9vw,1.36rem);max-width:42ch;margin-bottom:clamp(32px,3.6vw,44px)}
.cai .cai-tbl{margin-top:clamp(34px,3.8vw,44px)}
.cai .cai-scroll{margin-top:clamp(34px,3.8vw,44px);max-width:100%;overflow-x:auto;-webkit-overflow-scrolling:touch}
.cai .cai-scroll .cai-tbl{margin-top:0;min-width:100%}
.cai .cai-tick{margin-top:clamp(34px,3.8vw,46px);padding-top:clamp(28px,3.2vw,36px);gap:14px}

/* --- les critères, en rythme --- */
.cai .cai-beats{margin-top:clamp(40px,4.4vw,52px);display:grid;gap:0;border-top:1px solid var(--line)}
.cai .cai-beat{display:grid;grid-template-columns:36px 1fr;gap:clamp(16px,2vw,24px);align-items:start;padding:clamp(20px,2.4vw,26px) 0;border-bottom:1px solid var(--line)}
.cai .cai-beat b{display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;background:var(--g1);border:1px solid #CBEFDB;font:600 .88rem/1 'Inter',sans-serif;color:var(--gd)}
.cai .cai-beat p{font-size:1rem;line-height:1.7;color:var(--grey);margin:0;padding-top:6px}
.cai .cai-beat p strong{color:var(--ink);font-weight:600;display:block;margin-bottom:5px}

/* --- lien de suite --- */
.cai .cai-more{display:inline-flex;align-items:center;gap:9px;margin-top:clamp(28px,3.4vw,40px);font:600 .95rem/1.3 'Inter',sans-serif;color:#15803D;text-decoration:none;border-bottom:2px solid rgba(21,128,61,.28);padding-bottom:5px;transition:border-color .16s}
.cai .cai-more:hover{border-color:#15803D}
.cai .cai-more::after{content:"\\2192";font-size:1.05rem;line-height:1}

/* --- la recommandation --- */
.cai .cai-reco{margin-top:clamp(34px,3.8vw,44px);display:grid;gap:clamp(16px,2vw,20px)}
.cai .cai-reco-c{background:#fff;border:1px solid var(--line);border-left:4px solid #22C55E;border-radius:calc(var(--rad) - 10px);padding:clamp(22px,2.6vw,30px)}
.cai .cai-reco-c.est-contre{border-left-color:#CBD5E1}
.cai .cai-reco-c h3{font-size:1.04rem;line-height:1.45;margin:0 0 10px}
.cai .cai-reco-c p{font-size:.98rem;line-height:1.72;color:var(--grey);margin:0}

/* --- pastilles de liens --- */
.cai .cai-aussi{margin-top:clamp(34px,3.8vw,44px);padding-top:clamp(28px,3.2vw,36px);border-top:1px solid rgba(10,37,64,.12)}
.cai .cai-aussi h4{font:600 .72rem/1 'Inter',sans-serif;letter-spacing:.12em;text-transform:uppercase;color:var(--grey);margin:0 0 18px}
.cai .cai-aussi ul{display:flex;flex-wrap:wrap;gap:9px;list-style:none;padding:0;margin:0}
.cai .cai-aussi li{margin:0;padding:0}
.cai .cai-aussi a{display:inline-flex;font:500 .87rem/1.3 'Inter',sans-serif;color:var(--ink);background:rgba(255,255,255,.72);border:1px solid rgba(10,37,64,.1);border-radius:99px;padding:10px 15px;text-decoration:none;transition:border-color .16s}
.cai .cai-aussi a:hover{border-color:rgba(10,37,64,.28)}
</style>`

/** Combien d'unités couvrent chaque solution, arrondi au supérieur. */
const combien = (cout, panier) => Math.ceil(cout / panier)

function page(m) {
  const criteres = m.criteres.map(([t, p], i) =>
    `<div class="cai-beat"><b>${i + 1}</b><p><strong>${maison(t)}</strong>${maison(p)}</p></div>`).join('\n')

  const entetes = m.tableau.colonnes.map((c) => `<th scope="col">${echapper(c)}</th>`).join('')
  const lignes = m.tableau.lignes.map((l, i) => {
    const cellules = l.slice(1).map((c, j) =>
      `<td data-l="${echapper(m.tableau.colonnes[j + 1])}">${maison(c)}</td>`).join('')
    const fort = i === m.tableau.surligne ? ' style="font-weight:600"' : ''
    return `<tr${fort}><th scope="row">${maison(l[0])}</th>${cellules}</tr>`
  }).join('\n')

  const rentable = m.paniers.map((p) =>
    `<tr><th scope="row">${p}&nbsp;€</th><td data-l="Télésecrétariat">${combien(150, p)} par mois</td>` +
    `<td data-l="Standard 24/7">${combien(297, p)} par mois</td>` +
    `<td data-l="Embauche">${combien(1700, p)} par mois</td></tr>`).join('\n')

  const faq = m.faq.map(([q, r], i) =>
    `<details${i === 0 ? ' open=""' : ''}>\n<summary>${echapper(q)}</summary>\n<div class="cai-ans">${maison(r)}</div>\n</details>`).join('\n')

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${SITE}/comparer/standard-telephonique-${m.slug}#webpage`,
        url: `${SITE}/comparer/standard-telephonique-${m.slug}`,
        name: nu(m.titre),
        description: nu(m.description),
        inLanguage: 'fr-FR',
        isPartOf: { '@id': `${SITE}/#website` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE },
          { '@type': 'ListItem', position: 2, name: 'Comparer', item: `${SITE}/comparer/permanence-telephonique` },
          { '@type': 'ListItem', position: 3, name: nu(m.fil) },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': `${SITE}/comparer/standard-telephonique-${m.slug}#faq`,
        isPartOf: { '@id': `${SITE}/comparer/standard-telephonique-${m.slug}#webpage` },
        mainEntity: m.faq.map(([q, r]) => ({
          '@type': 'Question', name: nu(q),
          acceptedAnswer: { '@type': 'Answer', text: nu(r) },
        })),
      },
    ],
  }

  return maison(`<div class="cai">
${STYLE}
<!-- 1. HERO -->
<section class="cai-box cai-box--g">
<span class="cai-eye cai-eye--w">Comparatif</span>
<h1 style="max-width:24ch;margin:22px 0 20px">${echapper(m.h1)}</h1>
<p class="cai-lead" style="max-width:58ch">${maison(m.lead)}</p>
<ul class="cai-tick">
${m.puces.map((p) => `<li>${maison(p)}</li>`).join('\n')}
</ul>
</section>
<!-- 2. RÉPONSE COURTE -->
<section class="cai-box">
<div class="cai-head">
<span class="cai-eye">En deux phrases</span>
<h2>Ce qui décide vraiment <em>pour un ${maison(m.metier)}</em></h2>
</div>
<p class="cai-say">${maison(m.court)} <span class="cai-key">${maison(m.courtCle)}</span></p>
<p style="max-width:70ch">${maison(m.courtSuite)}</p>
</section>
<!-- 3. LES CINQ CRITÈRES -->
<section class="cai-box">
<div class="cai-head">
<span class="cai-eye">Les critères</span>
<h2 id="criteres">Les cinq critères qui éliminent, <em>dans l'ordre</em></h2>
<p class="cai-lead" style="max-width:58ch">Posez ces cinq questions à chaque prestataire, dans cet ordre, avant de regarder le moindre prix. Trois solutions sur quatre tombent avant la troisième.</p>
</div>
<div class="cai-beats">
${criteres}
</div>
</section>
<!-- 4. LE TABLEAU -->
<section class="cai-box">
<div class="cai-head">
<span class="cai-eye">Face au même appel</span>
<h2 id="comparatif">Les solutions comparées sur <em>${maison(m.appel)}</em></h2>
<p class="cai-lead" style="max-width:58ch">Un seul appel, le même pour tout le monde. C'est la seule façon de comparer des offres qui ne se présentent pas de la même manière.</p>
</div>
<div class="cai-scroll"><table class="cai-tbl">
<thead>
<tr>${entetes}</tr>
</thead>
<tbody>
${lignes}
</tbody>
</table></div>
<p class="cai-fine" style="margin-top:clamp(22px,2.6vw,28px);max-width:72ch">Fourchettes relevées sur les grilles publiques de dix prestataires le 2 octobre 2026. Le détail nommé, prestataire par prestataire, est sur la page des tarifs du marché&nbsp;: les montants y sont tenus à jour à un seul endroit.</p>
<p style="margin-top:clamp(24px,2.8vw,32px);max-width:70ch">${maison(m.apres)}</p>
<a class="cai-more" href="/prix-du-marche">Les grilles de dix prestataires, nommées</a>
</section>
<!--QUIZ-->
<!-- 5. CE QUE ÇA RAPPORTE -->
<section class="cai-box">
<div class="cai-head">
<span class="cai-eye">Le calcul</span>
<h2 id="rentabilite">Combien d'${maison(m.unitePluriel)} <em>couvrent la dépense</em></h2>
<p class="cai-lead" style="max-width:58ch">Divisez le coût mensuel par ce que vous rapporte ${maison(m.uniteArticle)}. C'est la seule division qui change une décision.</p>
</div>
<div class="cai-scroll"><table class="cai-tbl">
<thead>
<tr>
<th scope="col">Si ${maison(m.uniteRapporte)}</th>
<th scope="col">Télésecrétariat 150 €</th>
<th scope="col">Standard 24/7 297 €</th>
<th scope="col">Embauche 1 700 €</th>
</tr>
</thead>
<tbody>
${rentable}
</tbody>
</table></div>
<p class="cai-fine" style="margin-top:clamp(22px,2.6vw,28px);max-width:72ch">Nombre arrondi au supérieur, puisqu'on ne récupère pas ${maison(m.demi)}. ${maison(m.panierNote)} Ce calcul dit ce qu'il faut atteindre pour être à l'équilibre, il ne promet pas que vous l'atteindrez.</p>
<a class="cai-more" href="/calculateur">Faire le calcul avec vos chiffres</a>
</section>
<!-- 6. LA RECOMMANDATION -->
<section class="cai-box">
<div class="cai-head">
<span class="cai-eye">La conclusion</span>
<h2 id="recommandation">${echapper(m.reco.titre)}</h2>
</div>
<div class="cai-reco">
<div class="cai-reco-c">
<h3>Ce qu'on vous conseille</h3>
<p>${maison(m.reco.pour)}</p>
</div>
<div class="cai-reco-c est-contre">
<h3>Et quand ça ne vaut pas le coup</h3>
<p>${maison(m.reco.contre)}</p>
</div>
</div>
<p style="margin-top:clamp(26px,3vw,34px);max-width:70ch">${maison(m.reco.entre)}</p>
<a class="cai-more" href="${m.pageMetier}">Ce qui arrive vraiment sur une ligne de ${maison(m.metier)}</a>
</section>
<!-- 7. FAQ -->
<section class="cai-box">
<div class="cai-head">
<span class="cai-eye">Questions</span>
<h2>Vos questions <em>de ${maison(m.metier)}</em></h2>
</div>
<div class="cai-faq">
${faq}
</div>
</section>
<!-- 8. SORTIE -->
<section class="cai-box cai-box--g">
<h2 style="max-width:22ch">${echapper(m.cta)}</h2>
<p class="cai-lead" style="margin-top:20px;max-width:56ch">Le meilleur comparatif reste une semaine sur votre vraie ligne, avec vos vrais appels. Sept jours, sans engagement, avant tout paiement.</p>
<div class="cai-row">
<a class="cai-btn cai-btn--k" href="/demonstration">Écouter un appel réel</a>
<a class="cai-btn cai-btn--w" href="/tarifs">Les formules et les prix</a>
</div>
<div class="cai-aussi">
<h4>À lire aussi</h4>
<ul>
<li><a href="${m.pageMetier}">Votre page métier</a></li>
<li><a href="/prix-du-marche">Les tarifs de dix prestataires</a></li>
<li><a href="/comparer/permanence-telephonique">Les quatre familles de solutions</a></li>
<li><a href="/appels-hiver">Vos appels d'hiver, métier par métier</a></li>
<li><a href="/repondeur-ia">Le panorama des standards IA</a></li>
</ul>
</div>
<p class="cai-fine" style="margin-top:clamp(26px,3vw,32px)">Cette page mentionne un service pour lequel concierge-ai.fr perçoit une commission d'affiliation. <a href="/mentions-legales" style="color:inherit;text-decoration:underline">Détails</a>.</p>
</section>
</div>
<script type="application/ld+json">
${JSON.stringify(schema)}
</script>
`)
}

const astro = (m) => `---
import Base from '../../layouts/Base.astro'
import contenu from '../../contenu/comparer__standard-telephonique-${m.slug}.html?raw'
import { sectionQuiz, MARQUEUR } from '../../lib/quiz.js'
const contenuAvecQuiz = contenu.replace(MARQUEUR, sectionQuiz({
  titre: \`${m.quiz.titre}\`,
  chapo: \`${m.quiz.chapo}\`,
}))
---

<Base
  titre="${m.titre.replace(/"/g, '&quot;')}"
  description="${m.description.replace(/"/g, '&quot;')}"
  chemin="/comparer/standard-telephonique-${m.slug}"
>
  <Fragment set:html={contenuAvecQuiz} />
</Base>
`

let n = 0
const ecrit = (chemin, contenu) => {
  if (ecrire) { mkdirSync(dirname(chemin), { recursive: true }); writeFileSync(chemin, contenu) }
  console.log(`${ecrire ? '✓' : '→'} ${chemin.replace(RACINE + '/', '')}`)
  n++
}

for (const m of METIERS) {
  ecrit(join(RACINE, `src/contenu/comparer__standard-telephonique-${m.slug}.html`), page(m))
  ecrit(join(RACINE, `src/pages/comparer/standard-telephonique-${m.slug}.astro`), astro(m))
}

console.log(`\n${n} fichier(s) ${ecrire ? 'écrits' : 'à écrire'} pour ${METIERS.length} métiers.`)
