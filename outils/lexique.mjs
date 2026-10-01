/**
 * Le lexique : une page par terme, plus l'index.
 *
 * Pourquoi ce format. Les concurrents qui tiennent la première page sur
 * « permanence téléphonique tarifs » le font avec des entrées de glossaire,
 * pas avec des articles. Et une définition courte, autonome, est exactement ce
 * qu'un moteur de réponse recopie.
 *
 * Deux règles qui font la différence, et qui sont dans le référentiel :
 *   — on ne prend que des termes sur lesquels le site n'a pas déjà une page,
 *     sinon le lexique vient concurrencer les pages qu'il devrait servir ;
 *   — chaque entrée dit ce que le terme recouvre ET ce qu'il ne recouvre pas,
 *     avec le prix constaté quand il y en a un. Aucun lexique concurrent ne
 *     met de chiffres.
 *
 *   node outils/lexique.mjs            # dit ce qu'il écrirait
 *   node outils/lexique.mjs --ecrire
 */

import { writeFileSync, mkdirSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const RACINE = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SITE = 'https://www.concierge-ai.fr'
const ecrire = process.argv.includes('--ecrire')

/** Le site écrit l'apostrophe droite, partout. */
const maison = (t) => String(t).replaceAll('’', "'")
const echapper = (t) => maison(t)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
/** Le texte d'un schéma n'est pas du HTML. */
const nu = (h) => maison(h).replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ')
  .replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim()

export const TERMES = [
  {
    slug: 'serveur-vocal-interactif',
    h2fait: "Ce que fait un serveur vocal interactif",
    terme: 'Serveur vocal interactif (SVI)',
    court: 'Le menu à touches. Il range votre appel dans une case, il ne comprend pas la demande.',
    titre: 'Serveur vocal interactif (SVI) : définition et limites',
    description: "Ce qu'est un serveur vocal interactif, ce qu'il fait d'un appel, ce qu'il ne sait pas faire, et pourquoi il tient mal l'urgence.",
    h1: 'Serveur vocal interactif : ce que fait vraiment un menu à touches',
    def: `Un serveur vocal interactif, ou SVI, est un système qui fait écouter un menu enregistré à votre correspondant et lui demande d'appuyer sur une touche pour être orienté. «&nbsp;Tapez&nbsp;1 pour un devis, tapez&nbsp;2 pour le service technique.&nbsp;» Il classe l'appel, il ne le comprend pas.`,
    fait: [
      ['Il oriente.', `Selon la touche, l'appel part vers un poste, une boîte vocale ou une file d'attente.`],
      ['Il annonce.', `Horaires, adresse, message d'absence : tout ce qui peut être enregistré une fois et rejoué.`],
      ['Il fait patienter.', `Musique, rang dans la file, temps d'attente estimé quand l'opérateur le propose.`],
    ],
    pasfait: `Il ne comprend pas une phrase. Une personne qui a de l'eau qui coule dans son couloir doit traduire son urgence en numéro de touche, et aucune touche ne correspond. Il ne pose pas de rendez-vous, il ne reconnaît pas une urgence décrite avec des mots, et il ne répond à aucune question qui sort du menu.<br><br>C'est la confusion la plus fréquente sur ce sujet&nbsp;: beaucoup de gens croient qu'on leur parle d'un SVI quand on leur dit «&nbsp;standard automatique&nbsp;».`,
    prix: `Le SVI est le plus souvent inclus dans une offre de téléphonie professionnelle, ou facturé en option. Les grilles varient trop d'un opérateur à l'autre pour qu'une fourchette soit utile&nbsp;: demandez la vôtre à votre opérateur.`,
    voir: ['centre-d-appels', 'script-d-accueil', 'qualification-d-appel'],
    pages: [['/standard-telephonique-ia', 'Ce que fait un standard téléphonique IA'], ['/comparer/permanence-telephonique', 'Les quatre solutions comparées']],
  },
  {
    slug: 'taux-de-decroche',
    h2fait: "Ce que mesure le taux de décroché",
    terme: 'Taux de décroché',
    court: 'La part de vos appels à laquelle quelqu’un répond. Le chiffre que presque personne ne mesure.',
    titre: 'Taux de décroché : définition, calcul et ce qu’il cache',
    description: "Comment se calcule un taux de décroché, ce qui le fait chuter chez un artisan, comment connaître le vôtre, et le chiffre qui compte davantage.",
    h1: 'Taux de décroché : comment le calculer, et ce qu’il ne dit pas',
    def: `Le taux de décroché est la part des appels entrants auxquels quelqu'un répond, rapportée au total des appels reçus. Soixante appels reçus dans la semaine, quarante-deux décrochés&nbsp;: le taux est de 70&nbsp;%. Les dix-huit autres sont des clients qui ont entendu sonner dans le vide.`,
    fait: [
      ['Il se calcule simplement.', `Appels décrochés divisés par appels reçus, sur une période donnée. Une semaine ordinaire suffit à se faire une idée.`],
      ['Il chute toujours aux mêmes moments.', `Pendant une intervention, le soir, le week-end, et sur les doubles appels. Ce ne sont pas des accidents, c'est votre métier.`],
      ['Il se connaît sans outil.', `Votre opérateur fournit l'historique des appels. Votre fiche d'établissement Google compte aussi les appels passés depuis la recherche.`],
    ],
    pasfait: `Il ne dit rien de la qualité de la réponse. Un appel décroché pendant qu'on tient un tournevis entre les dents compte dans le taux, et n'aboutit pas forcément à un chantier.<br><br>Et il ne dit rien de ce que les appels perdus valaient. C'est pourtant le seul chiffre qui change une décision&nbsp;: dix-huit appels manqués dans le mois, à 250&nbsp;€ l'intervention et un appel sur trois qui se transforme, font environ 1&nbsp;500&nbsp;€ qui sont partis ailleurs.`,
    voir: ['double-appel', 'hors-heures-ouvrees', 'debordement-d-appels'],
    pages: [['/calculateur', 'Chiffrer vos appels manqués'], ['/appels-manques-perdre-des-clients', 'Ce que deviennent les appels manqués']],
  },
  {
    slug: 'conversation-facturee',
    h2fait: "Ce que recouvre une conversation facturée",
    terme: 'Conversation facturée',
    court: 'L’unité qui décide de votre facture, et dont la définition change selon le prestataire.',
    titre: 'Conversation facturée : ce que le mot recouvre vraiment',
    description: "Ce qu'un prestataire appelle une conversation, pourquoi la définition change tout, et les trois unités de facturation du marché avec les prix relevés.",
    h1: 'Conversation facturée : l’unité qu’il faut faire préciser avant de signer',
    def: `Une conversation est l'unité de facturation de la plupart des standards automatiques&nbsp;: un échange complet avec un appelant, du décroché au raccroché. Sa définition exacte change d'un prestataire à l'autre, et c'est elle, bien plus que le prix affiché, qui décide de ce que vous paierez à la fin de l'année.`,
    fait: [
      ['Elle sert de compteur.', `Une formule d'entrée à 297&nbsp;€ comprend 500 conversations par mois chez Concierge AI, soit une vingtaine par jour ouvré.`],
      ['Elle coexiste avec deux autres unités.', `Elio facture des minutes, 79&nbsp;€&nbsp;HT pour 150 puis 0,24&nbsp;€&nbsp;HT la minute. VOKAI facture des agents, 299&nbsp;€ pour un agent et un numéro. Trois unités, trois factures qui ne se comparent pas.`],
      ['Elle se convertit.', `Comptez vos appels d'une semaine, multipliez par 4,33, estimez la durée moyenne. C'est le seul calcul qui rend deux devis comparables.`],
    ],
    pasfait: `Elle ne garantit pas que l'échange ait servi à quelque chose. Les questions à poser par écrit, et à faire figurer au contrat&nbsp;:<br><br>Un appel raccroché au bout de trois secondes compte-t-il pour une conversation&nbsp;? Un client qui rappelle dans l'heure en compte-t-il une deuxième&nbsp;? Que se passe-t-il au-delà du forfait, blocage ou facturation à l'unité&nbsp;? Et dans ce dernier cas, à quel prix&nbsp;?`,
    prix: `Relevé le 1<sup>er</sup> octobre 2026&nbsp;: de 79&nbsp;€&nbsp;HT à 499&nbsp;€ par mois chez les trois prestataires qui affichent leurs grilles. Le détail est sur <a href="/prix-du-marche">les tarifs d'une permanence téléphonique</a>.`,
    voir: ['taux-de-decroche', 'debordement-d-appels', 'numero-dedie'],
    pages: [['/prix-du-marche', "Les tarifs d'une permanence téléphonique"], ['/standard-telephonique-ia', 'Standard téléphonique IA : prix et limites']],
  },
  {
    slug: 'debordement-d-appels',
    h2fait: "Ce qu'est un débordement d'appels",
    terme: 'Débordement d’appels',
    court: 'Le moment où plusieurs appels arrivent ensemble et où la ligne ne suit plus.',
    titre: 'Débordement d’appels : définition et solutions',
    description: "Ce qu'est un débordement d'appels, à partir de quand il commence chez un artisan seul, quand il arrive dans l'année, et ce qu'on peut y faire.",
    h1: 'Débordement d’appels : quand la ligne ne suit plus',
    def: `Il y a débordement quand plusieurs appels arrivent en même temps et que la ligne ne peut plus les prendre. Chez une entreprise de dix personnes, le débordement commence à la dixième communication simultanée. Chez un artisan seul, il commence au deuxième appel.`,
    fait: [
      ['Il se voit à trois signes.', `Le signal occupé, la file d'attente qui s'allonge, et la messagerie qui se remplit de messages identiques.`],
      ['Il suit le calendrier.', `Vague de gel pour les chauffagistes, canicule pour la climatisation, tempête pour les couvreurs, rentrée pour le bâtiment. Ces dates sont connues à l'avance.`],
      ['Il se reporte.', `Un appel qui déborde ne disparaît pas&nbsp;: il part chez le confrère suivant, et il ne revient pas.`],
    ],
    pasfait: `Un débordement n'est pas un pic de saison. Le pic est un volume sur une période, le débordement est une simultanéité sur une minute. On peut déborder un mardi ordinaire à 8&nbsp;h&nbsp;10, quand trois personnes appellent en même temps avant de partir travailler.<br><br>Et ce n'est pas non plus une question d'équipement&nbsp;: une ligne mobile prend un appel à la fois, quelle que soit l'offre.`,
    voir: ['double-appel', 'taux-de-decroche', 'centre-d-appels'],
    pages: [['/guides/astreinte-et-tri-des-urgences', 'Trier les urgences en période de pointe'], ['/fermeture-fin-annee', 'Les périodes où tout le monde ferme']],
  },
  {
    slug: 'double-appel',
    h2fait: "Ce que recouvre un double appel",
    terme: 'Double appel',
    court: 'L’appel qui arrive pendant que vous êtes déjà en ligne. Le plus fréquent, et le plus invisible.',
    titre: 'Double appel : pourquoi c’est l’appel manqué le plus courant',
    description: "Ce qu'est un double appel, pourquoi il n'apparaît pas toujours dans vos appels manqués, et les trois façons de ne plus le perdre.",
    h1: 'Double appel : l’appel manqué que vous ne voyez pas',
    def: `Un double appel est un deuxième appel qui arrive pendant que vous êtes déjà en ligne. Sur un téléphone professionnel tenu par une seule personne, c'est le cas d'appel manqué le plus fréquent, et celui dont on se rend le moins compte.`,
    fait: [
      ['Il se signale discrètement.', `Un bip pendant la conversation en cours, parfois rien du tout selon le réglage du téléphone.`],
      ['Il bascule.', `Faute de réponse, l'appel part vers la messagerie, vers le signal occupé, ou vers le numéro de renvoi si vous en avez réglé un.`],
      ['Il arrive en rafale.', `Les gens appellent aux mêmes heures&nbsp;: avant 9&nbsp;h, à la pause de midi, et vers 18&nbsp;h.`],
    ],
    pasfait: `Il n'apparaît pas forcément dans votre liste d'appels en absence. Selon l'opérateur et le réglage, un double appel non pris peut ne laisser aucune trace visible sur le téléphone, ce qui explique l'écart entre ce que vous croyez rater et ce que vous ratez réellement.<br><br>Le réglage qui le récupère est le renvoi sur occupation, distinct du renvoi sur non-réponse. Les deux se règlent séparément.`,
    voir: ['taux-de-decroche', 'debordement-d-appels', 'numero-dedie'],
    pages: [['/renvoi-appel-si-non-reponse', "Les codes de renvoi d'appel, opérateur par opérateur"], ['/calculateur', 'Chiffrer ce que ça représente']],
  },
  {
    slug: 'qualification-d-appel',
    h2fait: "Ce que recouvre la qualification d'un appel",
    terme: 'Qualification d’appel',
    court: 'Recueillir pendant l’appel ce qui décide de la suite, au lieu de rappeler pour le demander.',
    titre: 'Qualification d’appel : définition et questions à poser',
    description: "Ce que recouvre la qualification d'un appel entrant, les questions qui décident vraiment de la suite, et ce qu'elle ne remplace pas.",
    h1: 'Qualification d’appel : les questions qui évitent le rappel du soir',
    def: `Qualifier un appel, c'est recueillir pendant la conversation les informations qui décident de la suite&nbsp;: qui appelle, pour quoi, à quelle adresse, dans quel délai, et si la demande entre dans votre zone et dans vos compétences. Un appel qualifié n'a pas besoin d'être rappelé pour être compris.`,
    fait: [
      ['Elle repose sur une liste écrite.', `Les mêmes questions, dans le même ordre, à chaque appel. En plomberie&nbsp;: ce qui se passe, si l'eau coule encore, l'adresse, maison ou appartement, l'étage.`],
      ["Elle sépare l'urgent du planifiable.", `C'est la règle que vous écrivez une fois et qui décide, pour chaque appel, s'il doit sonner sur votre portable ou attendre lundi.`],
      ['Elle filtre.', `Hors zone, hors compétence, hors budget. Ces trois filtres font gagner plus de temps que tout le reste.`],
    ],
    pasfait: `Elle ne vend rien et elle ne chiffre rien. Un devis se fait après avoir vu, pas au téléphone. Une qualification qui annonce un montant ferme vous crée un litige plutôt qu'un chantier.<br><br>Elle ne décide pas non plus à votre place&nbsp;: elle applique une règle que vous avez écrite, et elle transmet ce qui n'y entre pas.`,
    voir: ['appel-de-cadrage', 'zone-d-intervention', 'script-d-accueil'],
    pages: [['/guides/astreinte-et-tri-des-urgences', 'Écrire vos règles de tri'], ['/demonstration', 'Écouter un appel qualifié du début à la fin']],
  },
  {
    slug: 'appel-de-cadrage',
    h2fait: "Ce qui se décide pendant l'appel de cadrage",
    terme: 'Appel de cadrage',
    court: 'La demi-heure où vous racontez votre métier. C’est elle qui fait la qualité du résultat.',
    titre: 'Appel de cadrage : ce qu’on vous demande, et ce qu’il faut préparer',
    description: "Ce qui se décide pendant l'appel de cadrage d'un standard téléphonique, ce qu'il faut préparer en une page, et ce qu'il n'est pas.",
    h1: 'Appel de cadrage : la demi-heure qui décide de tout le reste',
    def: `L'appel de cadrage est l'entretien d'une trentaine de minutes pendant lequel vous décrivez votre métier à votre prestataire&nbsp;: les demandes qui reviennent dix fois par jour, ce que vous appelez une urgence, vos fourchettes de prix, votre zone, vos horaires, et ce que vous refusez.`,
    fait: [
      ['Il produit vos règles.', `Tout ce qui sera dit à votre place sort de cet entretien. Rien n'est inventé ensuite.`],
      ['Il se prépare en une page.', `Vos tarifs indicatifs, votre zone, vos horaires, les cinq questions qu'on vous pose le plus souvent, et la liste de ce qui doit vous joindre tout de suite.`],
      ['Il se fait à votre heure.', `Le soir après 19&nbsp;h convient à la plupart des artisans, et c'est le créneau à demander.`],
    ],
    pasfait: `Ce n'est pas une formation et ce n'est pas un paramétrage technique. Vous ne touchez à aucun outil, vous ne retenez aucune manipulation, et vous n'avez rien à installer ensuite.<br><br>Ce n'est pas non plus définitif. Les règles s'ajustent pendant les premiers jours, en écoutant de vrais appels. C'est même la seule bonne façon de les ajuster.`,
    voir: ['script-d-accueil', 'qualification-d-appel', 'zone-d-intervention'],
    pages: [['/fonctionnement', 'Le déroulé complet de la mise en service'], ['/standard-telephonique-ia#tester-standard-telephonique-ia', "Les sept appels à passer pendant l'essai"]],
  },
  {
    slug: 'zone-d-intervention',
    h2fait: "Ce que recouvre une zone d'intervention",
    terme: 'Zone d’intervention',
    court: 'Le périmètre où vous acceptez de vous déplacer. Déclaré, il devient un filtre.',
    titre: 'Zone d’intervention : définition et usage comme filtre d’appels',
    description: "Comment se définit une zone d'intervention, pourquoi elle fait gagner plus de temps que tout le reste, et ce qu'elle ne règle pas.",
    h1: 'Zone d’intervention : le filtre qui vous rend des heures',
    def: `La zone d'intervention est le périmètre géographique dans lequel vous acceptez de vous déplacer. Déclarée à votre accueil téléphonique, elle cesse d'être une information et devient un filtre&nbsp;: les demandes situées en dehors ne vous sont plus transmises, ou vous arrivent signalées comme telles.`,
    fait: [
      ['Elle se décrit de trois façons.', `Un rayon en kilomètres autour de votre adresse, une liste de communes, ou une liste de codes postaux. La troisième est la plus fiable au téléphone.`],
      ['Elle peut avoir des exceptions.', `Un client existant hors zone, un chantier assez gros pour justifier la route, une période creuse. Ces exceptions s'écrivent, elles aussi.`],
      ['Elle fait gagner du temps immédiatement.', `Les demandes hors zone sont, chez la plupart des dépanneurs, le premier poste d'appels sans suite.`],
    ],
    pasfait: `Elle ne correspond pas à votre zone de visibilité sur Google. Votre fiche d'établissement vous expose à des gens qui cherchent depuis bien plus loin que là où vous allez, et c'est de là que viennent la plupart des appels hors zone.<br><br>Elle ne dit rien non plus du temps de route réel. Trente kilomètres de montagne ne valent pas trente kilomètres de rocade, et c'est à vous de traduire ça en règle.`,
    voir: ['qualification-d-appel', 'appel-de-cadrage', 'script-d-accueil'],
    pages: [['/metiers', 'Les scènes par métier'], ['/guides/astreinte-et-tri-des-urgences', 'Les règles de tri à écrire']],
  },
  {
    slug: 'hors-heures-ouvrees',
    h2fait: "Ce que recouvrent les heures non ouvrées",
    terme: 'Hors heures ouvrées',
    court: 'Tout ce qui n’est pas vos horaires. Pour beaucoup, c’est sept jours sur dix.',
    titre: 'Hors heures ouvrées : ce que ça représente vraiment',
    description: "Ce que recouvrent les heures non ouvrées, le calcul sur une semaine de 168 heures, et pourquoi le vrai trou est plus large que ça.",
    h1: 'Hors heures ouvrées : 118 heures sur 168, et ce n’est pas tout',
    def: `Les heures non ouvrées sont tout ce qui tombe en dehors de vos horaires d'ouverture&nbsp;: le soir, la nuit, le week-end, les jours fériés et les congés. Une activité ouverte de 8&nbsp;h à 18&nbsp;h du lundi au vendredi est ouverte 50&nbsp;heures et fermée 118, sur les 168 que compte une semaine. Sept jours sur dix.`,
    fait: [
      ['Il se calcule.', `168 heures dans une semaine. Retirez vos heures d'ouverture réelles, pas celles affichées sur votre fiche Google.`],
      ['Il contient les meilleurs appels.', `Les particuliers appellent quand ils rentrent chez eux et découvrent la fuite, c'est-à-dire précisément quand vous avez fermé.`],
      ['Il se couvre par degrés.', `Une permanence humaine courante couvre 72 des 168 heures. Un standard automatique les couvre toutes. Un poste d'accueil à temps plein en couvre 35.`],
    ],
    pasfait: `Le calcul ne compte pas les heures où vous êtes ouvert mais injoignable, et elles pèsent souvent plus lourd. Les mains dans un tableau électrique à 14&nbsp;h, c'est une heure ouvrée pendant laquelle personne ne décroche.<br><br>Additionnez les deux et le trou réel dépasse largement les 118 heures du tableau.`,
    voir: ['taux-de-decroche', 'double-appel', 'debordement-d-appels'],
    pages: [['/telephone-pro-soir-week-end', 'Le soir et le week-end, qui décroche'], ['/secretariat-telephonique', 'Les heures réellement couvertes par un télésecrétariat']],
  },
  {
    slug: 'centre-d-appels',
    h2fait: "Ce que fait un centre d'appels",
    terme: 'Centre d’appels',
    court: 'Une structure conçue pour les gros volumes. Rarement adaptée à une entreprise de trois personnes.',
    titre: 'Centre d’appels : définition et différence avec un télésecrétariat',
    description: "Ce qu'est un centre d'appels, ce qui le distingue d'un télésecrétariat et d'un standard automatique, et pourquoi il convient mal aux TPE.",
    h1: 'Centre d’appels : ce que c’est, et pourquoi ce n’est pas pour une TPE',
    def: `Un centre d'appels est une structure qui traite de gros volumes d'appels pour le compte d'autres entreprises, avec des équipes de téléconseillers, des scripts et des objectifs de productivité. Il est conçu pour des donneurs d'ordre qui reçoivent des milliers d'appels par mois.`,
    fait: [
      ['Il traite dans les deux sens.', `Réception des appels entrants, et émission pour de la prospection, des relances ou des enquêtes.`],
      ['Il industrialise.', `Scripts, supervision, mesure du temps par appel. C'est ce qui lui permet d'absorber le volume.`],
      ['Il facture au volume.', `Le modèle économique suppose un engagement et un minimum mensuel, souvent hors de portée d'une entreprise de un à cinq.`],
    ],
    pasfait: `Ce n'est pas un télésecrétariat. Le télésecrétariat travaille pour des indépendants et de petites structures, avec des équipes réduites et des consignes propres à chaque client. La différence se joue sur la taille du donneur d'ordre, pas sur le métier.<br><br>Ce n'est pas non plus un standard automatique&nbsp;: dans un centre d'appels, il y a des personnes au bout du fil, avec les horaires et le coût que cela suppose.`,
    voir: ['serveur-vocal-interactif', 'debordement-d-appels', 'conversation-facturee'],
    pages: [['/secretariat-telephonique', "Le télésecrétariat : ce qu'il fait, où il s'arrête"], ['/comparer/permanence-telephonique', 'Les quatre solutions comparées']],
  },
  {
    slug: 'numero-dedie',
    h2fait: "Ce que recouvre un numéro dédié",
    terme: 'Numéro dédié',
    court: 'Le numéro du prestataire, vers lequel vos appels basculent. Vous ne le donnez à personne.',
    titre: 'Numéro dédié : pourquoi vous ne changez pas de numéro',
    description: "Ce qu'est un numéro dédié, comment il s'articule avec le renvoi d'appel, et pourquoi votre numéro habituel ne change pas.",
    h1: 'Numéro dédié : votre numéro ne change pas, et personne n’a à le savoir',
    def: `Un numéro dédié est un numéro attribué par le prestataire, distinct du vôtre, vers lequel vos appels basculent quand vous ne décrochez pas. Vous ne le communiquez à personne&nbsp;: il ne sert qu'à recevoir le renvoi, en coulisses.`,
    fait: [
      ['Il reçoit le renvoi.', `Votre ligne sonne d'abord. Au bout de quelques sonneries sans réponse, l'appel part sur ce numéro, et c'est là que quelqu'un décroche.`],
      ['Il permet de mesurer.', `Comme il ne reçoit que les appels que vous n'avez pas pris, il donne pour la première fois le volume exact de ce qui vous échappait.`],
      ['Il se coupe en une manipulation.', `Supprimer le renvoi suffit à revenir à la situation d'avant, sans démarche ni préavis.`],
    ],
    pasfait: `Ce n'est pas un changement de numéro. Vos cartes de visite, le marquage de votre véhicule, votre fiche d'établissement Google et vos anciens clients gardent le numéro qu'ils ont toujours eu. Vous n'avez aucune démarche à faire auprès de votre opérateur, et vous ne perdez pas votre historique.<br><br>Ce n'est pas non plus un transfert de ligne. En cas d'incident chez le prestataire, votre ligne continue de sonner chez vous&nbsp;: vous revenez à la situation d'aujourd'hui, pas à une ligne morte.`,
    voir: ['double-appel', 'conversation-facturee', 'appel-de-cadrage'],
    pages: [['/renvoi-appel-si-non-reponse', "Régler le renvoi d'appel, opérateur par opérateur"], ['/fonctionnement', 'Comment ça se connecte sur votre ligne']],
  },
  {
    slug: 'script-d-accueil',
    h2fait: "Ce que contient un script d'accueil",
    terme: 'Script d’accueil',
    court: 'Le texte et les règles de ce qui est dit à votre place. Y compris quand on ne sait pas.',
    titre: 'Script d’accueil : ce qu’il contient et ce qu’il interdit',
    description: "Ce que contient un script d'accueil téléphonique, l'obligation d'annonce depuis le 2 août 2026, et la ligne la plus importante du document.",
    h1: 'Script d’accueil : ce qui est dit à votre place, mot pour mot',
    def: `Le script d'accueil est le document qui fixe ce qui sera dit à votre place&nbsp;: la phrase d'accueil, les questions posées, les montants qu'on a le droit d'annoncer, ce qui déclenche un transfert vers votre portable, et la conduite à tenir quand la demande n'était pas prévue.`,
    fait: [
      ['Il commence par une annonce obligatoire.', `Depuis le 2&nbsp;août 2026, l'article&nbsp;50 du règlement européen sur l'intelligence artificielle impose d'informer votre correspondant qu'il parle à un système d'IA. Une phrase suffit, et elle se place en tête.`],
      ['Il fixe ce qui peut être dit sur les prix.', `Des fourchettes que vous avez écrites, jamais un montant ferme ni un devis. C'est la règle qui vous évite le plus de litiges.`],
      ['Il prévoit le silence.', `La phrase la moins glamour du document est aussi la plus importante&nbsp;: que répondre quand on ne sait pas. Un script sérieux dit qu'il ne sait pas et transmet.`],
    ],
    pasfait: `Ce n'est pas une improvisation encadrée. Rien de ce qui n'y figure pas ne doit être inventé, et c'est précisément ce qu'il faut vérifier pendant un essai en posant une question qui n'était pas prévue.<br><br>Ce n'est pas non plus un document figé. Il s'ajuste en écoutant de vrais appels pendant les premiers jours, et c'est la seule bonne façon de l'affiner.`,
    voir: ['appel-de-cadrage', 'qualification-d-appel', 'serveur-vocal-interactif'],
    pages: [['/conformite', 'Les trois règles à tenir'], ['/message-repondeur-professionnel', 'Générer votre message de répondeur']],
  },
]

/* ------------------------------------------------------------------ *
 * La fabrication.
 * ------------------------------------------------------------------ */

const parSlug = Object.fromEntries(TERMES.map((t) => [t.slug, t]))

const pastilles = (slugs) => slugs.map((s) => {
  const t = parSlug[s]
  return `<li><a href="/lexique/${t.slug}">${echapper(t.terme)}</a></li>`
}).join('\n')

function pageTerme(t) {
  const fait = t.fait.map(([titre, texte]) =>
    `<li><strong>${maison(titre)}</strong> ${maison(texte)}</li>`).join('\n')
  const prix = t.prix ? `<h2>Combien ça coûte</h2>\n<p>${maison(t.prix)}</p>\n` : ''
  const pages = t.pages.map(([u, l]) => `<li><a href="${u}">${echapper(l)}</a></li>`).join('\n')

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [{
      '@type': 'DefinedTerm',
      '@id': `${SITE}/lexique/${t.slug}#terme`,
      name: nu(t.terme),
      description: nu(t.def),
      inDefinedTermSet: { '@type': 'DefinedTermSet', '@id': `${SITE}/lexique#set`, name: 'Lexique de la permanence téléphonique', url: `${SITE}/lexique` },
      url: `${SITE}/lexique/${t.slug}`,
    }, {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE },
        { '@type': 'ListItem', position: 2, name: 'Lexique', item: `${SITE}/lexique` },
        { '@type': 'ListItem', position: 3, name: nu(t.terme) },
      ],
    }],
  }

  return maison(`<div class="cai">
<section class="cai-box cai-box--g">
<span class="cai-eye cai-eye--w">Lexique</span>
<h1 style="max-width:26ch;margin:22px 0 20px">${echapper(t.h1)}</h1>
<div class="cai-lex-def">
<p>${t.def}</p>
</div>
</section>
<section class="cai-box cai-lex">
<h2>${echapper(t.h2fait)}</h2>
<ul class="cai-lex-l">
${fait}
</ul>
<h2>Ce que ça ne recouvre pas</h2>
<div class="cai-lex-non">
<p>${t.pasfait}</p>
</div>
${prix}<div class="cai-lex-voir">
<h3>À ne pas confondre avec</h3>
<ul>
${pastilles(t.voir)}
</ul>
</div>
</section>
<section class="cai-box cai-box--g">
<h2 style="max-width:24ch">Le reste du sujet, <em>en détail</em></h2>
<div class="cai-lex-voir" style="border:0;padding-top:clamp(18px,2vw,24px);margin-top:0">
<ul>
${pages}
<li><a href="/lexique">Tout le lexique</a></li>
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

function pageIndex() {
  const cartes = TERMES.map((t) =>
    `<a href="/lexique/${t.slug}"><b>${echapper(t.terme)}</b><span>${echapper(t.court)}</span></a>`).join('\n')
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [{
      '@type': 'DefinedTermSet',
      '@id': `${SITE}/lexique#set`,
      name: 'Lexique de la permanence téléphonique',
      url: `${SITE}/lexique`,
      description: 'Les mots de la permanence téléphonique et de l’accueil des appels, définis pour les indépendants et les petites entreprises.',
      hasDefinedTerm: TERMES.map((t) => ({ '@type': 'DefinedTerm', name: nu(t.terme), description: nu(t.court), url: `${SITE}/lexique/${t.slug}` })),
    }, {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE },
        { '@type': 'ListItem', position: 2, name: 'Lexique' },
      ],
    }],
  }
  return maison(`<div class="cai">
<section class="cai-box cai-box--g">
<span class="cai-eye cai-eye--w">Lexique</span>
<h1 style="max-width:24ch;margin:22px 0 20px">Les mots de la permanence téléphonique, <em>expliqués simplement</em></h1>
<p class="cai-lead" style="max-width:58ch">Douze termes que vous croiserez en cherchant qui peut décrocher à votre place. Chacun dit ce qu'il recouvre, ce qu'il ne recouvre pas, et ce que ça coûte quand il y a un prix.</p>
</section>
<section class="cai-box">
<div class="cai-lex-idx">
${cartes}
</div>
</section>
<section class="cai-box cai-box--g">
<h2 style="max-width:24ch">Par où commencer <em>si vous découvrez le sujet</em></h2>
<div class="cai-lex-voir" style="border:0;padding-top:clamp(18px,2vw,24px);margin-top:0">
<ul>
<li><a href="/comparer/permanence-telephonique">Les quatre solutions comparées</a></li>
<li><a href="/prix-du-marche">Les tarifs d'une permanence téléphonique</a></li>
<li><a href="/calculateur">Chiffrer vos appels manqués</a></li>
<li><a href="/metiers">Les scènes par métier</a></li>
</ul>
</div>
<p class="cai-fine" style="margin-top:clamp(26px,3vw,32px)">Ce site mentionne un service pour lequel concierge-ai.fr perçoit une commission d'affiliation. <a href="/mentions-legales" style="color:inherit;text-decoration:underline">Détails</a>.</p>
</section>
</div>
<script type="application/ld+json">
${JSON.stringify(schema)}
</script>
`)
}

const astro = (fichier, chemin, titre, description, profondeur) => `---
import Base from '${'../'.repeat(profondeur)}layouts/Base.astro'
import contenu from '${'../'.repeat(profondeur)}contenu/${fichier}?raw'
---

<Base
  titre="${titre.replace(/"/g, '&quot;')}"
  description="${description.replace(/"/g, '&quot;')}"
  chemin="${chemin}"
>
  <Fragment set:html={contenu} />
</Base>
`

let n = 0
const ecrit = (chemin, contenu) => {
  if (ecrire) { mkdirSync(dirname(chemin), { recursive: true }); writeFileSync(chemin, contenu) }
  console.log(`${ecrire ? '✓' : '→'} ${chemin.replace(RACINE + '/', '')}`)
  n++
}

ecrit(join(RACINE, 'src/contenu/lexique.html'), pageIndex())
ecrit(join(RACINE, 'src/pages/lexique.astro'), astro('lexique.html', '/lexique',
  'Lexique de la permanence téléphonique : 12 termes expliqués',
  "Douze mots que vous croiserez en cherchant qui peut décrocher à votre place : ce qu'ils recouvrent, ce qu'ils ne recouvrent pas, et ce que ça coûte.", 1))

for (const t of TERMES) {
  ecrit(join(RACINE, `src/contenu/lexique__${t.slug}.html`), pageTerme(t))
  ecrit(join(RACINE, `src/pages/lexique/${t.slug}.astro`),
    astro(`lexique__${t.slug}.html`, `/lexique/${t.slug}`, t.titre, t.description, 2))
}

console.log(`\n${n} fichier(s) ${ecrire ? 'écrits' : 'à écrire'} pour ${TERMES.length} termes.`)
if (!ecrire) console.log('Rien n’a été modifié. Relancer avec --ecrire.')
