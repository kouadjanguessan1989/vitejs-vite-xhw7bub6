import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════
// SIMULATEUR PMP® 2026 — AFRICA TALENT CONSULTING v2
// Charte ATC : Orange #F97316 | Violet #7C3AED | Blanc
// ECO officiel PMI juillet 2026 — 26 tâches, 3 domaines
// + Section thématique IA & Durabilité
// ═══════════════════════════════════════════════════

const ATC = {
  orange:"#F97316", orangeL:"#FED7AA", orangeD:"#C2410C",
  violet:"#7C3AED", violetL:"#EDE9FE", violetD:"#5B21B6",
  white:"#FFFFFF", gray50:"#F9FAFB", gray100:"#F3F4F6",
  gray200:"#E5E7EB", gray400:"#9CA3AF", gray600:"#4B5563",
  gray800:"#1F2937", green:"#059669", greenL:"#D1FAE5",
  red:"#DC2626", redL:"#FEE2E2", cyan:"#0891B2", cyanL:"#ECFEFF",
};

const DOMAINES = {
  "Personnes":                {couleur:ATC.violet,fond:ATC.violetL,pct:33,label:"Personnes"},
  "Processus":                {couleur:ATC.green, fond:ATC.greenL, pct:41,label:"Processus"},
  "Environnement d'affaires":{couleur:ATC.orange,fond:ATC.orangeL,pct:26,label:"Env. d'affaires"},
  "IA & Durabilité":          {couleur:ATC.cyan,  fond:ATC.cyanL,  pct:0, label:"IA & Durabilité"},
};

const APPROCHES = {
  "Prédictif":{couleur:ATC.violetD,fond:ATC.violetL},
  "Agile":    {couleur:ATC.cyan,   fond:ATC.cyanL},
  "Hybride":  {couleur:ATC.orangeD,fond:ATC.orangeL},
};

const MODES = {
  30: {label:"30 Questions", desc:"~45 min — Entraînement rapide",       duree:45*60},
  60: {label:"60 Questions", desc:"~90 min — Mi-parcours",               duree:90*60},
  120:{label:"120 Questions",desc:"~160 min — Simulation avancée",       duree:160*60},
  180:{label:"180 Questions",desc:"~240 min — Examen complet PMP® 2026", duree:240*60},
};

const THEME_DUREE = 25*60; // 25 minutes pour la révision thématique (20 questions)
const THEMES = [
  {id:"personnes", label:"Personnes",       domaine:"Personnes",                approche:null,        icon:"👥",desc:"Leadership, conflits, équipe"},
  {id:"processus", label:"Processus",        domaine:"Processus",                approche:null,        icon:"⚙️",desc:"EVM, risques, qualité, achats"},
  {id:"affaires",  label:"Env. d'affaires", domaine:"Environnement d'affaires", approche:null,        icon:"🏢",desc:"Gouvernance, bénéfices, conformité"},
  {id:"ia_durable",label:"IA & Durabilité", domaine:"IA & Durabilité",           approche:null,        icon:"🤖",desc:"IA responsable, ESG, biais"},
  {id:"agile",     label:"Agile & Hybride", domaine:null,                        approche:"Agile",     icon:"🔄",desc:"Scrum, SAFe, vélocité, sprints"},
  {id:"predictif", label:"Prédictif",        domaine:null,                        approche:"Prédictif", icon:"📊",desc:"Valeur acquise, chemin critique"},
];

// ═══════════════════════════════════════════════════
// BANQUE DE 360 QUESTIONS — randomisées à chaque session
// Domaines : Personnes 33% | Processus 41% | Env.Aff. 26%
// + Section thématique IA & Durabilité (20 questions)
// ═══════════════════════════════════════════════════
const TOUTES_QUESTIONS = [
// ── ÉTUDE DE CAS EC1 ─────────────────────────────────────────────
{ id:"EC1-Q1", domaine:"Personnes", approche:"Hybride", type:"etude-de-cas",
  etudeDeCas:{ id:"EC1",
    titre:"Étude de cas : Programme de digitalisation bancaire — FinWest Africa",
    contexte:`Vous êtes chef de projet senior certifié PMP® en charge d'un programme de digitalisation bancaire de 18 mois pour FinWest Africa, opérant dans 6 pays d'Afrique de l'Ouest. Le programme comprend trois flux parallèles : (1) plateforme de banque mobile pour 2,4 M clients, (2) modernisation du core banking, (3) conformité réglementaire dans chaque pays. Équipe de 34 personnes répartie entre Abidjan (centrale), Lagos (développement), Accra (conformité) et un prestataire offshore en Inde (intégration). Mode hybride : flux 1 et 3 en Scrum (sprints 3 semaines), flux 2 entièrement prédictif. Budget : 12,4 M€, réserve de management : 8 %. Au mois 7 : vélocité mobile = 41 pts (cible 48), core banking retard 3 semaines, réglementation Sénégal changée impactant 23 % des exigences. Tension entre Kwame (tech lead Lagos) et Raj (architecte offshore) sur les standards qualité : 3 rejets qualité en 2 sprints.` },
  question:`Dans ce contexte de conflit entre Kwame et Raj, avec 3 rejets qualité en 2 sprints et une polarisation de l'équipe qui commence, vous disposez de 4 heures demain. Quelle approche structurée adoptez-vous EN PRIORITÉ ?`,
  options:[
    `A. Convoquer immédiatement une réunion plénière des 34 membres pour exposer le conflit, obtenir l'avis collectif et décider des standards de qualité — la transparence totale est la meilleure approche multiculturelle.`,
    `B. Mener d'abord des entretiens individuels séparés avec Kwame et Raj pour identifier les causes factuelles (spécifications incomplètes ? standards ambigus ? communication interculturelle ?), puis organiser une session de résolution structurée à trois avec un cadre d'accord documenté.`,
    `C. Escalader immédiatement au DSI sponsor pour arbitrage, documenter le conflit comme risque critique et suspendre les livraisons d'intégration jusqu'à résolution formelle.`,
    `D. Demander au prestataire offshore de remplacer Raj et demander à Kwame de rédiger une charte qualité unilatérale applicable à l'ensemble du programme.`
  ],
  correct:1,
  explication:`La réponse B est correcte. L'ECO PMP® 2026 (Tâche T1 — Gérer les conflits) prescrit une approche en deux temps : diagnostic individuel puis résolution structurée. Les entretiens séparés permettent d'identifier la nature réelle du conflit (problèmes techniques + communication interculturelle). Une réunion publique avec 34 personnes (A) amplifierait le conflit et créerait des coalitions. L'escalade immédiate (C) abdique la responsabilité du chef de projet. Le remplacement de Raj (D) est une mesure punitive sans diagnostic.` },

{ id:"EC1-Q2", domaine:"Personnes", approche:"Agile", type:"etude-de-cas",
  etudeDeCas:{ id:"EC1" },
  question:`Après les entretiens, vous constatez que Kwame a documenté 14 non-conformités réelles et que Raj a relevé 9 spécifications contradictoires. Il y a aussi une dimension interculturelle : l'équipe indienne utilise la communication implicite que l'équipe ghanéenne interprète comme de l'évasion. Comment structurez-vous la session de résolution à trois pour maximiser les chances d'accord durable ?`,
  options:[
    `A. Présenter les 14 non-conformités et les 9 contradictions, demander des excuses formelles mutuelles, puis imposer un contrat signé sous votre autorité.`,
    `B. Structurer en 4 phases : (1) établir des règles de communication explicites et culturellement neutres, (2) analyser les faits sans attribution de faute, (3) co-construire une Définition de Fini renforcée et un protocole de gestion des ambiguïtés, (4) définir un suivi hebdomadaire bilatéral documenté dans un team charter amendé.`,
    `C. Arbitrer en décidant vous-même qui a tort et qui a raison selon les évidences, puis communiquer votre verdict à l'équipe.`,
    `D. Inviter un médiateur RH externe et vous retirer du processus pour éviter toute apparence de partialité.`
  ],
  correct:1,
  explication:`La réponse B est correcte. Une résolution de conflit multiculturelle doit adresser les dimensions factuelles ET relationnelles/culturelles. La phase 1 (règles explicites) est essentielle dans un contexte indien-ghanéen où les styles de communication divergent. La co-construction (phase 3) génère des accords durables appropriés. L'arbitrage autoritaire (C) crée un perdant et un gagnant, perpétuant le conflit. Les excuses formelles imposées (A) sont humiliantes.` },

{ id:"EC1-Q3", domaine:"Processus", approche:"Hybride", type:"etude-de-cas",
  etudeDeCas:{ id:"EC1" },
  question:`Le flux core banking est en retard de 3 semaines. Données EVM au mois 7 : BAC = 4,2 M€, VP = 2,1 M€, VA = 1,68 M€, CR = 1,89 M€. Option X — Crashing : +3 ingénieurs 6 semaines, coût 180 k€, récupération 2,5 semaines. Option Y — Fast-tracking : superposer modules (coût 0 €, probabilité reprise 35 %, impact si reprise : +4 semaines). Pénalité contractuelle retard : 250 k€/semaine. Quelle recommandation au comité de pilotage ?`,
  options:[
    `A. Recommander Option Y (fast-tracking) : zéro coût additionnel et le risque de 35 % est acceptable compte tenu de la pression.`,
    `B. Recommander Option X (crashing) après avoir calculé IPC-Cal = 0,80 et IPC-C = 0,89 confirmant dégradation sur deux axes ; EAC recalculé = 4,72 M€ dépasse le BAC ; le crashing à 180 k€ est inférieur à la pénalité de 250 k€/semaine — présenter l'EAC révisé au comité.`,
    `C. Combiner les deux options simultanément pour maximiser les chances de récupération tout en demandant une extension de délai de 2 semaines.`,
    `D. Attendre les résultats du sprint suivant avant d'engager des ressources — la précipitation est l'ennemi de la qualité.`
  ],
  correct:1,
  explication:`La réponse B est correcte. IPC-Cal = 1,68/2,1 = 0,80 (retard), IPC-C = 1,68/1,89 = 0,89 (surcoût). EAC = 4,2/0,89 = 4,72 M€. La VME de l'Option Y = 0,35 × (coût d'une reprise de 4 semaines) dépasse probablement 180 k€. Le crashing est justifié car 180 k€ < 250 k€/semaine de pénalité. La transparence sur l'EAC révisé est obligatoire selon le Code d'Éthique PMI. Attendre (D) avec IPC-Cal de 0,80 est une négligence.` },

// ── ÉTUDE DE CAS EC2 ─────────────────────────────────────────────
{ id:"EC2-Q1", domaine:"Personnes", approche:"Agile", type:"etude-de-cas",
  etudeDeCas:{ id:"EC2",
    titre:"Étude de cas : Transformation RH — Groupe MineralCo",
    contexte:`MineralCo est un groupe minier panafricain de 8 200 employés dans 4 pays. Projet SIRH unifié sur 24 mois, budget 3,8 M€. Équipe : 2 consultants RH, 3 développeurs, 1 chef de projet client (Claire), 1 représentant syndicat (Abdoulaye), 1 responsable sécurité données (Fatou). Approche hybride : discovery/paramétrage en Agile, déploiement pays en prédictif. Au mois 11, crise simultanée : (A) Abdoulaye menace une grève — il a reçu une note confidentielle indiquant que le SIRH permettra une surveillance des présences ; (B) le DRH veut accélérer le déploiement Côte d'Ivoire de 6 semaines pour la présentation aux actionnaires ; (C) Fatou découvre que le module paie stocke des données non conformes à la loi PDCI ivoirienne ; (D) l'intégrateur signale une faille de sécurité exploitable dans l'API de paie.` },
  question:`Face à ces quatre crises simultanées, quelle est votre séquence de priorisation et vos premières actions dans les 24 prochaines heures ?`,
  options:[
    `A. Prioriser : (1) accélérer le déploiement CIV comme demandé par le DRH, (2) traiter la faille de sécurité, (3) rassurer verbalement Abdoulaye, (4) corriger la non-conformité PDCI lors du prochain sprint.`,
    `B. Prioriser : (1) suspendre l'accès au module paie et corriger la faille de sécurité (risque immédiat données personnelles) ; (2) informer Fatou et DRH de la non-conformité PDCI avec feuille de route corrective ; (3) réunion urgente avec Abdoulaye sur les fonctionnalités réelles vs perçues ; (4) analyser avec Claire l'impact réel de l'accélération et présenter les options au DRH sans s'engager sur un calendrier irréaliste.`,
    `C. Escalader l'ensemble des quatre problèmes au DRH et suspendre toutes les activités jusqu'à arbitrage du sponsor.`,
    `D. Résoudre d'abord le conflit syndical (risque le plus visible), puis traiter les problèmes techniques — la conformité PDCI peut attendre les prochaines semaines.`
  ],
  correct:1,
  explication:`La réponse B est correcte. La priorisation suit une logique de risque légal, éthique et stratégique. La faille sécurité (priorité 1) crée une exposition immédiate aux données personnelles. La non-conformité PDCI (priorité 2) est une obligation légale non négociable — la dissimuler au DRH constituerait une faute grave selon le Code d'Éthique PMI. Le conflit syndical (priorité 3) nécessite un dialogue honnête. L'accélération (priorité 4) exige une analyse d'impact rigoureuse avant engagement. L'option A subordonne la conformité légale à la volonté du sponsor.` },

{ id:"EC2-Q2", domaine:"Environnement d'affaires", approche:"Hybride", type:"etude-de-cas",
  etudeDeCas:{ id:"EC2" },
  question:`Vous avez présenté l'impact de l'accélération de 6 semaines au DRH : réduction tests de 4 à 2 semaines, suppression formation 240 managers, risque d'erreurs paie 7-12 % (vs objectif <0,5 %), 35 % d'utilisateurs non opérationnels à J+30. Le DRH répond : "La présentation actionnaires est non négociable. Trouvez une solution." Comment répondez-vous ?`,
  options:[
    `A. Accepter la directive du DRH sans condition — il a l'autorité finale sur les compromis périmètre/délai/qualité.`,
    `B. Proposer un déploiement en 2 phases : Phase 1 dans le délai demandé — modules RH core uniquement (40 % fonctions), formation accélérée ciblée, exclusion du module paie (risque trop élevé). Phase 2 — module paie + formation complète 4 semaines après. Présenter au DRH avec mise à jour formelle du business case et documentation des risques résiduels.`,
    `C. Refuser catégoriquement et menacer de se retirer du projet si la directive est maintenue.`,
    `D. Accepter verbalement mais continuer le plan initial en espérant que les actionnaires accepteront un déploiement partiel présenté comme complet.`
  ],
  correct:1,
  explication:`La réponse B est correcte. Elle illustre la négociation sur le triangle périmètre/délai/qualité : quand le délai est fixe, on réduit intelligemment le périmètre. Le déploiement en 2 phases respecte la contrainte calendaire du sponsor tout en protégeant l'intégrité opérationnelle. L'exclusion du module paie est essentielle — un taux d'erreur de 7-12 % sur les salaires de 8 200 employés est inacceptable. La documentation des risques protège chef de projet et organisation. L'option D est une fraude envers les actionnaires.` },

// ── Questions Personnes indépendantes ─────────────────────────────
{ id:"P-001", domaine:"Personnes", approche:"Agile", type:"standard",
  question:`Vous gérez un programme SAFe avec 6 équipes et 58 personnes. Lors du PI Planning, l'équipe Infrastructure refuse de s'engager sur les user stories attribuées, arguant que les estimations sont sous-évaluées de 40 % et que le Product Management "impose des deadlines irréalistes". Cette situation bloque la cérémonie (120 personnes en attente). Le RTE vous demande d'intervenir. Quelle est votre réponse immédiate ?`,
  options:[
    `A. Demander à l'équipe de se conformer immédiatement — les négociations individuelles ne sont pas appropriées dans une cérémonie formelle.`,
    `B. Suspendre la session 30 min : organiser un breakout avec le tech lead Infrastructure, le Product Manager et vous-même pour examiner les 3 stories les plus contestées ; proposer ensuite soit des stories réduites avec engagement ferme, soit des stories complètes avec flag risque élevé — documenter dans le Program Board.`,
    `C. Remplacer le représentant qui bloque par quelqu'un de plus coopératif pour débloquer la cérémonie.`,
    `D. Accepter les engagements des autres équipes sans l'équipe Infrastructure et planifier une session de rattrapage la semaine suivante.`
  ],
  correct:1,
  explication:`La réponse B est correcte. Dans SAFe, le PI Planning est précisément l'espace pour résoudre ces tensions. La résistance de l'équipe signale souvent un problème réel d'estimation. Le breakout (30 min) traite le fond sans bloquer 120 personnes. Les deux options de sortie (stories réduites ou avec flag risque) sont valides dans SAFe. Forcer l'engagement (A) génère des PI Objectives non crédibles. Remplacer le représentant (C) est contre-productif.` },

{ id:"P-002", domaine:"Personnes", approche:"Prédictif", type:"standard",
  question:`Dans un projet de construction d'infrastructure portuaire (38 M€, 36 mois), à mois 14, votre ingénieur en chef présente des signes clairs de burnout : absences répétées, qualité dégradée, communication minimale. Il est sur le chemin critique et son remplacement nécessiterait 3-4 mois d'onboarding, menaçant le jalon critique de mois 18 (pénalité 450 000 €/semaine). Comment gérez-vous cette situation ?`,
  options:[
    `A. Mettre en place immédiatement un plan de transfert de connaissances d'urgence (30 jours) en affectant un ingénieur junior en binôme et commencer le recrutement en parallèle.`,
    `B. Engager d'abord un entretien individuel approfondi pour comprendre ses préoccupations (charge ? reconnaissance ? problèmes personnels ?), co-construire un plan de soutien personnalisé ; simultanément initier discrètement un plan de continuité des connaissances et évaluer les options de protection du jalon critique.`,
    `C. Notifier formellement le sponsor et le client de la menace sur le jalon critique et demander une extension de délai contractuelle préventive.`,
    `D. Confier à la DRH la gestion intégrale de la situation et commencer à chercher un remplaçant de niveau équivalent.`
  ],
  correct:1,
  explication:`La réponse B est correcte. L'ECO PMP® 2026 (T3 — Soutenir la performance) et le Code d'Éthique PMI placent le bien-être des membres de l'équipe parmi les responsabilités fondamentales. Traiter la personne avant le risque projet est éthiquement juste et stratégiquement optimal : un ingénieur soutenu a de bonnes chances de rester. La cartographie des connaissances est prudente mais doit rester discrète. L'escalade immédiate au client (C) exposerait prématurément une situation gérée en interne.` },

{ id:"P-003", domaine:"Personnes", approche:"Hybride", type:"standard",
  question:`Vous gérez la mise en place d'un WMS (système de gestion d'entrepôts). Les 8 employés internes acquiescent systématiquement aux propositions des 4 consultants externes même quand leur langage corporel indique une forte réticence. Après enquête, vous découvrez que la culture organisationnelle punit implicitement ceux qui questionnent les consultants. Trois décisions de conception inadaptées aux réalités opérationnelles ont déjà été validées. Comment abordez-vous cette situation ?`,
  options:[
    `A. Organiser une réunion séparée avec les 8 employés pour collecter leurs préoccupations réelles et les présenter aux consultants en votre nom propre en masquant la source.`,
    `B. Créer un environnement de sécurité psychologique : introduire des techniques de recueil d'avis anonymes (pre-mortems, brainwriting, votes silencieux), valoriser explicitement les perspectives opérationnelles, revoir les 3 décisions contestées via un processus basé sur des critères objectifs, et avoir une conversation directe avec le sponsor sur la culture organisationnelle.`,
    `C. Demander aux consultants de réduire leur présence dans les réunions et reconfigurer l'équipe en deux groupes travaillant séparément.`,
    `D. Documenter les trois décisions comme risques qualité et prévoir des tests approfondis en fin de projet pour valider a posteriori les préoccupations.`
  ],
  correct:1,
  explication:`La réponse B est correcte. La sécurité psychologique est un prérequis à l'efficacité d'équipe (ECO PMP® 2026 T4 — Autonomiser les membres). Les techniques de décision anonymes brisent la pression sociale sans exposer les individus. Revoir les 3 décisions est impératif — ce sont des bugs de processus décisionnel qui impacteront la qualité du WMS. Masquer les sources (A) mine la confiance à terme.` },

{ id:"P-004", domaine:"Personnes", approche:"Agile", type:"standard",
  question:`Votre équipe Scrum de 9 personnes présente une vélocité fluctuant entre 28 et 52 points (moyenne cible : 40) — variabilité de ±30 % anormale. Causes identifiées : (1) 2 membres régulièrement sollicités par d'autres projets, (2) user stories arrivent sans critères d'acceptation dans 40 % des cas, (3) environnements de test instables bloquent 1,5 jours/sprint, (4) Sébastien réalise 35 % de la vélocité totale à lui seul. Quelle approche systémique adoptez-vous ?`,
  options:[
    `A. Réduire la capacité de sprint à 28 points pour stabiliser les engagements et refuser les stories sans critères d'acceptation.`,
    `B. Plan d'amélioration systémique à 3 sprints : (1) négocier un accord de protection du focus des 2 membres multi-projets ; (2) Définition de Prêt stricte en backlog refinement ; (3) SLA de disponibilité des environnements avec l'équipe Ops ; (4) programme de knowledge sharing pour distribuer les compétences de Sébastien (pair programming, rotation des tâches complexes) — mesurer l'amélioration sprint par sprint.`,
    `C. Identifier le membre le moins performant, lui donner un plan d'amélioration de 30 jours et recruter un second profil senior.`,
    `D. Présenter la situation au Product Owner et demander de réduire le périmètre du backlog de 30 % pour rendre le projet plus réalisable.`
  ],
  correct:1,
  explication:`La réponse B est correcte. La variabilité excessive de la vélocité est un symptôme de causes systémiques multiples — chacune doit être adressée spécifiquement. Chaque action du plan est ciblée : accord de focus (décision organisationnelle), Définition de Prêt (responsabilité PO/équipe), SLA Ops (dépendance externe), distribution des compétences de Sébastien (résilience d'équipe). Réduire artificiellement la capacité (A) cache le problème sans le résoudre. Blâmer les individus (C) méconnaît la nature systémique du problème.` },

{ id:"P-005", domaine:"Personnes", approche:"Prédictif", type:"standard",
  question:`Lors d'une réunion d'équipe sur un projet de construction industrielle, vous observez qu'un sous-traitant refuse systématiquement de partager les plans d'avancement détaillés requis par le contrat, arguant qu'il "gère bien ses affaires". Cette situation dure depuis 3 semaines et commence à affecter votre capacité à gérer les interdépendances du planning global. Quelle est votre approche ?`,
  options:[
    `A. Accepter la situation et ajuster votre planning global en ajoutant des tampons pour absorber les incertitudes liées à ce sous-traitant.`,
    `B. Rencontrer le responsable du sous-traitant pour comprendre les raisons du refus (incompréhension contractuelle ? manque de ressources ? culture différente de reporting ?), rappeler clairement les obligations contractuelles, proposer un format de reporting simplifié si la complexité est le problème, et si la situation persiste, activer la clause de non-conformité contractuelle avec notification écrite formelle.`,
    `C. Escalader immédiatement à votre sponsor pour qu'il contacte la direction du sous-traitant — les relations inter-entreprises se gèrent au niveau direction.`,
    `D. Indiquer au sous-traitant que vous ne pourrez pas valider ses factures tant qu'il ne respectera pas ses obligations de reporting contractuelles.`
  ],
  correct:1,
  explication:`La réponse B est correcte. La gestion des achats (ECO T5) dans un contexte de résistance prestataire requiert d'abord un dialogue pour comprendre les causes profondes avant d'activer les mécanismes contractuels de contrainte. Le sous-traitant peut avoir des raisons légitimes (surcharge, incompréhension, culture différente) qu'un format simplifié pourrait résoudre. L'escalade directe (C) brûle les étapes et peut dégrader une relation commerciale. La rétention des paiements (D) est une mesure de dernier recours, pas une réponse initiale.` },

{ id:"P-006", domaine:"Personnes", approche:"Hybride", type:"standard",
  question:`Vous êtes chef de projet pour la mise en place d'un nouveau processus de gestion des retours clients (projet de 8 mois). À mi-parcours, vous réalisez que les 12 employés du service client — qui utiliseront quotidiennement le nouveau système — n'ont jamais été consultés sur les fonctionnalités. Leur manager dit qu'ils sont "trop occupés pour participer aux réunions projet". Quelles sont les conséquences potentielles et comment rectifiez-vous la situation ?`,
  options:[
    `A. Continuer le projet tel que planifié — les employés du service client seront formés à la fin du projet et s'adapteront au nouveau système.`,
    `B. Reconnaître que l'exclusion des utilisateurs finaux est un risque majeur d'adoption ; créer un groupe d'utilisateurs représentatifs (2-3 personnes sur rotation courte), organiser des sessions de 30 minutes en dehors des heures de pointe pour collecter leurs retours, revoir les fonctionnalités clés avec leur input, et planifier un test utilisateur avant le déploiement final — en gérant l'impact sur le planning via une demande de modification formelle si nécessaire.`,
    `C. Envoyer un questionnaire de 20 questions aux 12 employés par email pour collecter leurs besoins sans mobiliser leur temps de réunion.`,
    `D. Demander au manager de filtrer les retours des employés et de vous transmettre une synthèse des 5 points les plus importants — cela limite la perturbation opérationnelle.`
  ],
  correct:1,
  explication:`La réponse B est correcte. L'exclusion des utilisateurs finaux est l'une des causes les plus fréquentes d'échec d'adoption des projets. À mi-parcours, il reste encore suffisamment de temps pour intégrer les retours utilisateurs sur les fonctionnalités clés. La rotation de 2-3 représentants est un compromis pratique entre participation et continuité opérationnelle. Un questionnaire (C) est insuffisant pour capter les besoins réels d'usage. Le filtre du manager (D) risque de déformer ou de minimiser les préoccupations des utilisateurs.` },

{ id:"P-007", domaine:"Personnes", approche:"Agile", type:"standard",
  question:`Lors d'une rétrospective de sprint, un membre junior de l'équipe propose de modifier le processus de revue de code pour le rendre plus efficace. Sa proposition est techniquement pertinente mais deux membres seniors font des commentaires condescendants ("c'est pas si simple", "on a essayé ça il y a 2 ans"). La proposition est enterrée sans vraie discussion. En tant que Scrum Master / chef de projet, comment réagissez-vous ?`,
  options:[
    `A. Intervenir immédiatement pendant la rétrospective pour défendre la proposition du membre junior et contraindre une discussion formelle.`,
    `B. Terminer la rétrospective normalement, puis avoir des conversations individuelles avec les membres seniors pour leur signaler l'impact de leurs commentaires ; lors de la prochaine rétrospective, introduire une technique de facilitation (dot voting anonyme, 1-2-4-all) qui donne un poids égal aux idées indépendamment de leur source, et reprendre la proposition avec un cadre structuré d'évaluation.`,
    `C. Ignorer l'incident — les frictions entre juniors et seniors sont normales et se résolvent avec le temps quand les juniors gagnent en expérience.`,
    `D. Documenter l'incident dans un rapport de dynamique d'équipe et le soumettre au sponsor pour que la direction adresse la culture d'équipe.`
  ],
  correct:1,
  explication:`La réponse B est correcte. La sécurité psychologique dans les rétrospectives est fondamentale — si les bonnes idées sont étouffées par les dynamiques de pouvoir, l'amélioration continue Agile est impossible. Les conversations individuelles avec les seniors adressent le comportement sans humiliation publique. La refonte du processus de facilitation (techniques qui neutralisent les hiérarchies informelles) crée un changement systémique. Intervenir directement pendant la rétrospective (A) peut créer une confrontation improductive.` },

{ id:"P-008", domaine:"Personnes", approche:"Prédictif", type:"standard",
  question:`Vous êtes chef de projet pour un programme gouvernemental de numérisation des archives nationales (5,8 M€, 30 mois). L'équipe comprend 6 archivistes permanents du gouvernement et 4 consultants en numérisation. Après 8 mois, les archivistes expriment des craintes que la numérisation ne rende leurs postes obsolètes. Cette inquiétude crée une résistance passive : délais dans la fourniture des documents à numériser, erreurs de classement "accidentelles", et participation minimale aux formations. Comment gérez-vous cette résistance ?`,
  options:[
    `A. Ignorer la résistance et maintenir le calendrier — les archivistes sont des employés gouvernementaux et leur coopération est contractuellement requise.`,
    `B. Organiser des sessions de travail avec les archivistes et la direction RH pour discuter ouvertement des impacts du projet sur leurs rôles, présenter des exemples concrets d'évolution professionnelle vers des rôles d'archiviste numérique, les impliquer activement dans la conception du nouveau système (leur expertise est irremplaçable), et travailler avec la direction pour documenter formellement que le projet ne conduit pas à des suppressions de postes si c'est la réalité — ou être honnête sur les impacts si ce ne l'est pas.`,
    `C. Signaler la résistance passive au directeur de l'administration pour qu'il prenne des mesures disciplinaires contre les archivistes non coopératifs.`,
    `D. Remplacer les archivistes dans les formations par des consultants qui peuvent fournir les informations nécessaires au projet sans résistance.`
  ],
  correct:1,
  explication:`La réponse B est correcte. La résistance des archivistes est une réponse rationnelle à une menace perçue sur leurs emplois — pas de la mauvaise volonté. La gestion du changement organisationnel (ECO T6) exige d'adresser les préoccupations réelles des personnes impactées. Impliquer les archivistes dans la conception valorise leur expertise irremplaçable (connaissance des archives, des exceptions, des règles de classement) et réduit la résistance. La transparence sur les impacts réels sur les emplois est une obligation éthique. Les mesures disciplinaires (C) aggraveraient la résistance passive.` },

{ id:"P-009", domaine:"Personnes", approche:"Agile", type:"standard",
  question:`Votre équipe Agile vient d'intégrer deux nouveaux membres seniors recrutés pour accélérer le projet. Après 2 sprints, la vélocité a paradoxalement baissé de 38 à 29 points. Les membres historiques de l'équipe se plaignent que les nouveaux arrivants "ne comprennent pas nos pratiques" et passent beaucoup de temps à expliquer des contextes. Les nouveaux arrivants se sentent "mis à l'écart". Comment interprétez-vous cette situation et comment agissez-vous ?`,
  options:[
    `A. Conclure que les nouveaux membres ne sont pas à la hauteur et les remplacer par des profils mieux adaptés à la culture de l'équipe.`,
    `B. Reconnaître que cette baisse de vélocité est normale lors d'une intégration (Loi de Brooks / courbe de Tuckman phase de Confrontation) et non un signal d'alarme en soi ; organiser une session de team building structurée pour créer un nouveau team charter intégrant les pratiques des nouveaux membres et les pratiques historiques ; assigner des projets binômes (nouveau + historique) sur des stories spécifiques pour accélérer le transfert de contexte — projeter une normalisation de la vélocité dans 2-3 sprints.`,
    `C. Demander aux membres historiques d'écrire une documentation complète des pratiques et du contexte projet pour que les nouveaux puissent s'autonomiser rapidement.`,
    `D. Séparer le travail : les anciens membres sur les fonctionnalités critiques, les nouveaux sur les fonctionnalités secondaires, jusqu'à ce qu'ils aient acquis le contexte nécessaire.`
  ],
  correct:1,
  explication:`La réponse B est correcte. La baisse de vélocité lors d'une intégration est un phénomène documenté (Loi de Brooks, modèle de Tuckman). Il ne faut pas paniquer ni attribuer la baisse à un problème de compétence. La session de team building avec nouveau team charter permet d'intégrer formellement les apports des nouveaux membres plutôt que de les contraindre à se conformer. Les binômes accélèrent le transfert de contexte mieux que la documentation seule. Séparer les équipes (D) retarde l'intégration et crée une hiérarchie informelle.` },

{ id:"P-010", domaine:"Personnes", approche:"Prédictif", type:"standard",
  question:`Vous gérez un projet de mise en œuvre d'un ERP dans une PME de 200 personnes. Le PDG (sponsor) a un style de management très directif et commence à contacter directement les membres de votre équipe projet pour leur donner des instructions contradictoires avec le plan de projet validé. L'équipe est désorientée et certains membres suivent les instructions du PDG, créant des incohérences. Comment gérez-vous cette situation ?`,
  options:[
    `A. Accepter la situation — le PDG est le sponsor et a le droit de gérer les ressources de son entreprise comme il l'entend.`,
    `B. Solliciter une réunion privée avec le PDG pour reconnaître son investissement dans le projet, lui expliquer l'impact des instructions directes sur la cohérence du plan et la clarté des rôles pour l'équipe, et proposer un accord clair : il communique ses instructions au chef de projet qui les intègre dans le plan ou les traite comme des demandes de modification — en lui garantissant un accès direct aux informations dont il a besoin via des rapports adaptés.`,
    `C. Convoquer une réunion de toute l'équipe pour clarifier publiquement la chaîne de commandement et indiquer que seules les instructions du chef de projet doivent être suivies.`,
    `D. Documenter chaque instruction contradictoire du PDG dans le registre des risques et laisser l'équipe gérer par elle-même la priorisation des instructions reçues.`
  ],
  correct:1,
  explication:`La réponse B est correcte. Un sponsor qui bypass le chef de projet est un problème de gouvernance courant dans les PME. L'approche correcte est une conversation directe, respectueuse et orientée solutions avec le PDG — pas une confrontation publique ni une acceptation passive. La proposition d'un protocole de communication clair et d'accès direct aux informations répond au besoin légitime du PDG de rester impliqué, tout en protégeant la cohérence opérationnelle du projet.` },

{ id:"P-011", domaine:"Personnes", approche:"Agile", type:"standard",
  question:`Dans une équipe Scrum de 7 membres travaillant sur une application financière, vous constatez que les deux membres responsables des tests (QA) signalent systématiquement des défauts critiques le dernier jour du sprint, empêchant la validation de la Définition de Fini et conduisant à des reports de stories d'un sprint sur l'autre (ce pattern dure depuis 4 sprints). Comment analysez-vous ce problème et que faites-vous ?`,
  options:[
    `A. Demander aux membres QA de commencer les tests plus tôt dans le sprint pour éviter le rush du dernier jour.`,
    `B. Analyser le problème systémiquement : les tests en fin de sprint sont probablement le symptôme d'une intégration QA insuffisante dans le flux de développement (développeurs livrent du code trop tardivement dans le sprint pour que QA puisse tester raisonnablement) ; proposer à l'équipe d'adopter un flux plus intégré (critères d'acceptation définis en sprint planning, développeurs considèrent la story terminée seulement quand les tests de base passent, QA impliqué dès la définition des critères d'acceptation) — discuter en rétrospective du concept de "shift left" testing.`,,
    `C. Allonger les sprints de 2 à 3 semaines pour donner plus de temps aux QA pour réaliser les tests correctement.`,
    `D. Créer un sprint de test dédié toutes les 4 itérations où l'équipe de développement pause et l'équipe QA peut tester toutes les fonctionnalités accumulées.`
  ],
  correct:1,
  explication:`La réponse B est correcte. Les tests en fin de sprint sont un anti-pattern Agile classique — ils révèlent que la qualité est traitée comme une phase séparée plutôt qu'intégrée au flux de développement. La solution systémique est le "shift left" (tester plus tôt) en intégrant QA dès la définition des critères d'acceptation. Demander aux QA de "tester plus tôt" (A) sans changer le flux de développement ne résout rien. Les sprints de test dédiés (D) contredisent fondamentalement le principe Agile de livraison d'un incrément potentiellement livrable à chaque sprint.` },

{ id:"P-012", domaine:"Personnes", approche:"Hybride", type:"standard",
  question:`Un membre clé de votre équipe vous informe en privé qu'un de ses collègues falsifie ses feuilles de temps depuis 2 mois — déclarant des heures sur votre projet alors qu'il travaille sur un autre. Vous avez déjà observé une qualité de travail insuffisante de ce collègue sur votre projet et l'information vous semble crédible. Comment procédez-vous selon les principes du Code d'Éthique PMI ?`,
  options:[
    `A. Ignorer l'information car elle est basée sur une dénonciation informelle — vous ne pouvez pas agir sur des rumeurs.`,
    `B. Vérifier discrètement les données objectives disponibles (jalons, livrables, présences documentées) pour évaluer la crédibilité de l'information ; si confirmée ou fortement suspectée, documenter les faits et les escalader au responsable RH ou au PMO selon le processus établi — sans accuser publiquement ni mentionner la source ; ajuster la surveillance du travail de ce membre sur votre projet.`,
    `C. Confronter directement le collègue en question en présence du membre qui vous a informé pour résoudre la situation directement.`,
    `D. Convoquer une réunion d'équipe générale sur l'honnêteté dans les feuilles de temps sans nommer personne — le message passera implicitement.`
  ],
  correct:1,
  explication:`La réponse B est correcte. Le Code d'Éthique PMI requiert d'agir face à des violations éthiques suspectées tout en respectant les processus établis et la dignité des personnes. La vérification objective préalable évite les accusations non fondées. L'escalade formelle via les canaux appropriés (RH, PMO) est la voie correcte. La confrontation directe (C) sans préparation ni processus peut créer un conflit et compromettre une investigation formelle. L'accusation implicite en réunion (D) est injuste et non professionnelle.` },

{ id:"P-013", domaine:"Personnes", approche:"Agile", type:"standard",
  question:`Votre organisation vient d'adopter une approche Agile dans un département qui fonctionnait en mode cascade depuis 15 ans. Vous êtes nommé Agile Coach / chef de projet pour accompagner la transition. Après 2 mois, vous observez : les sprints existent sur le papier mais les réunions restent des réunions d'avancement traditionnelles, les "user stories" sont des spécifications techniques déguisées, et les "rétrospectives" se terminent sans aucune action identifiée. Comment caractérisez-vous cette situation et que faites-vous ?`,
  options:[
    `A. Conclure que l'Agile ne convient pas à ce département et recommander un retour à la méthode cascade.`,
    `B. Identifier que le département pratique le "Cargo Cult Agile" — les rituels Agile existent mais sans les valeurs et principes sous-jacents (collaboration, feedback, amélioration continue, livraison de valeur). Aborder le problème par la compréhension et la conviction plutôt que par la contrainte : faciliter une session sur le "Pourquoi l'Agile ?" avec des exemples concrets, travailler sur une vraie user story avec le format correct (en tant que... je veux... afin de...), conduire une rétrospective avec la technique 5 pourquoi sur un vrai problème récent — et célébrer les premières vraies améliorations.`,,
    `C. Rédiger un rapport de non-conformité Agile pour la direction et exiger que les équipes respectent les processus Agile tels qu'ils ont été définis.`,
    `D. Accepter que la transition Agile prend du temps et laisser l'équipe évoluer à son propre rythme — forcer la cadence crée plus de résistance que d'apprentissage.`
  ],
  correct:1,
  explication:`La réponse B est correcte. Le "Cargo Cult Agile" est un phénomène documenté : adopter les rituels sans les principes produit peu de valeur. La transformation culturelle nécessite compréhension, pratique et conviction — pas de conformité forcée. Travailler sur des exemples concrets (une vraie user story, une vraie rétrospective avec 5 pourquoi) crée une expérience directe des bénéfices plutôt qu'un enseignement théorique. Un rapport de non-conformité (C) renforce la résistance. Laisser évoluer sans accompagnement (D) permet la consolidation des mauvaises pratiques.` },

{ id:"P-014", domaine:"Personnes", approche:"Prédictif", type:"standard",
  question:`Dans un projet de développement d'une plateforme e-learning pour une université (budget 2,8 M€, 20 mois), le comité d'académiciens représentant les parties prenantes clés commence à demander des fonctionnalités de plus en plus sophistiquées lors des revues mensuelles, bien au-delà du périmètre initial ("puisqu'on est là, pourquoi pas ajouter..."). Le périmètre a déjà dérivé de 34 % sans modification formelle. Comment gérez-vous cette situation de "scope creep" chronique ?`,
  options:[
    `A. Accepter les demandes des académiciens — ce sont des experts de leur domaine et leurs demandes reflètent les besoins réels des utilisateurs.`,
    `B. Organiser une réunion de clarification avec le comité académique et le sponsor (Vice-Recteur) pour documenter l'état actuel du dérive de périmètre et ses impacts sur le budget et le délai ; mettre en place un processus formel de demande de modification (Change Request) avec évaluation d'impact systématique avant toute intégration ; proposer un backlog des fonctionnalités souhaitées pour les phases futures ; et affirmer positivement que toutes les idées sont précieuses et méritent une évaluation formelle — ce n'est pas un refus mais une gestion responsable du projet.`,
    `C. Arrêter de participer aux réunions de revue mensuelle pour éviter d'être exposé à de nouvelles demandes — changer le format en livrables uniquement.`,
    `D. Documenter toutes les demandes non approuvées dans un registre informel et les traiter après la livraison principale dans une "phase 1.5" non contractuelle.`
  ],
  correct:1,
  explication:`La réponse B est correcte. Le scope creep de 34 % est une situation critique qui compromet à la fois le budget, le délai et la qualité. La solution n'est pas de bloquer les idées (ce qui créerait un ressentiment chez les académiciens dont l'input est précieux) mais de créer un processus formel et transparent d'évaluation et de décision sur chaque demande. La réunion de clarification avec le sponsor est indispensable pour que la direction comprenne l'ampleur de la dérive. Le backlog des futures fonctionnalités valorise les idées sans les intégrer dans le périmètre courant.` },

{ id:"P-015", domaine:"Personnes", approche:"Hybride", type:"standard",
  question:`Vous êtes chef de projet d'un programme de transformation de la supply chain. Lors d'une revue de programme, le directeur supply chain (partie prenante clé) vous informe qu'il ne recevra plus de mises à jour hebdomadaires — "trop de rapports, pas le temps de tout lire". Cependant, vous avez besoin de ses décisions sur 3 problèmes critiques dans les 2 prochaines semaines. Comment adaptez-vous votre approche de communication tout en obtenant les décisions nécessaires ?`,
  options:[
    `A. Continuer d'envoyer les rapports hebdomadaires — si le directeur ne les lit pas, c'est sa responsabilité ; vous avez documenté que vous avez communiqué.`,
    `B. Rencontrer le directeur pour comprendre son format de communication préféré ; proposer un dashboard d'une page (ou un message hebdomadaire de 3 lignes maximum) résumant les 3 décisions à prendre, l'impact de chaque décision, et votre recommandation — simplifier la communication pour maximiser l'engagement. Pour les 3 problèmes urgents, préparer une note d'une page par problème avec les options et recommandations claires et demander un slot de 30 minutes cette semaine.`,
    `C. Déléguer la communication avec le directeur à un membre senior de votre équipe qui aura plus de disponibilité pour suivre ses préférences.`,
    `D. Escalader au sponsor principal que le directeur supply chain est insuffisamment impliqué dans le programme — son manque d'engagement est un risque projet à adresser formellement.`
  ],
  correct:1,
  explication:`La réponse B est correcte. La gestion de la communication (ECO T7 — Communiquer avec les parties prenantes) exige une adaptation aux besoins et contraintes réelles des parties prenantes. Le directeur supply chain surcharge d'information n'est pas un problème à escalader mais à résoudre par une communication plus ciblée. Un dashboard d'une page avec 3 décisions maximales est plus efficace que 15 pages de rapport. La rencontre directe pour comprendre le format préféré est la première étape de tout ajustement de communication.` },

{ id:"P-016", domaine:"Personnes", approche:"Agile", type:"standard",
  question:`Vous êtes Scrum Master d'une équipe distribuée (3 villes différentes, 5 fuseaux horaires). Les cérémonies Scrum sont organisées sur une fenêtre de 4 heures communes (8h-12h UTC) mais certains membres sont systématiquement en retard ou en avance et l'attention diminue progressivement au fil des réunions. Les rétrospectives à distance sont particulièrement peu efficaces — peu de participation, discussions superficielles. Comment améliorez-vous l'efficacité des cérémonies pour cette équipe distribuée ?`,
  options:[
    `A. Enregistrer toutes les cérémonies et les envoyer aux membres qui ne peuvent pas participer en temps réel — la flexibilité temporelle est une nécessité pour les équipes distribuées.`,
    `B. Adapter le format des cérémonies au contexte distribué : mêlées asynchrones quotidiennes (chaque membre poste une mise à jour écrite à un moment qui lui convient dans sa fenêtre de travail) ; sprints planning et reviews synchrones mais avec outils collaboratifs visuels (Miro, FigJam) pour maintenir l'engagement ; rétrospectives avec techniques anonymes et asynchrones (EasyRetro, Parabol) permettant à chacun de contribuer avant la session synchrone — la session synchrone se concentre sur la discussion des thèmes identifiés, pas sur la collecte des inputs.`,
    `C. Concentrer toutes les cérémonies sur un seul jour par semaine pour minimiser le nombre de réunions en dehors des heures confortables de chaque fuseau.`,
    `D. Demander à l'organisation d'aligner les horaires de travail de tous les membres de l'équipe sur un fuseau horaire unique.`
  ],
  correct:1,
  explication:`La réponse B est correcte. Les équipes distribuées avec plusieurs fuseaux horaires nécessitent une adaptation fondamentale des pratiques Agile, pas simplement de la flexibilité sur les enregistrements. La combinaison d'asynchrone (mêlées, inputs de rétrospective) et de synchrone ciblé (decisions, discussions) maximise l'engagement de chacun à son moment optimal. Les outils collaboratifs visuels maintiennent l'engagement mieux que les partages d'écran. L'alignement forcé sur un fuseau (D) imposerait des horaires impossibles à certains membres.` },

{ id:"P-017", domaine:"Personnes", approche:"Prédictif", type:"standard",
  question:`Dans un projet de développement d'un nouveau médicament (phase II), vous découvrez que votre data manager a commis une erreur dans le protocole de collecte des données cliniques — erreur qui a conduit à la collecte de 3 mois de données avec un paramètre incorrect. Les données doivent être recollectées ou le protocole doit être amendé (un processus réglementaire de 4-6 semaines). L'erreur est humaine et le data manager est très perturbé. Comment gérez-vous cet incident sur les plans humain, technique et éthique ?`,
  options:[
    `A. Imposer une sanction disciplinaire au data manager pour l'erreur et confier les responsabilités de collecte de données à un autre membre plus expérimenté.`,
    `B. Gérer séparément mais simultanément les dimensions humaine et technique : humaine — rassurer le data manager que les erreurs humaines arrivent et que l'objectif est de comprendre la cause profonde et d'améliorer le processus (entretien individuel de soutien, sans blâme) ; technique — analyser avec l'équipe scientifique les options (recollecte ? amendement de protocole ? les deux données sont-elles récupérables ?) et soumettre l'amendement réglementaire si nécessaire sans délai ; éthique — documenter l'incident de façon complète et transparente dans le dossier de l'étude clinique comme le requiert la réglementation, même si cela retarde l'étude.`,
    `C. Vérifier si l'erreur de paramètre peut être "corrigée" dans le traitement statistique des données sans recollecte ni amendement — une solution technique qui préserve le calendrier.`,,
    `D. Réduire la portée de l'étude en excluant les 3 mois de données incorrectes sans le mentionner dans les rapports réglementaires — l'étude restante est suffisamment large pour rester statistiquement valide.`
  ],
  correct:1,
  explication:`La réponse B est correcte. Dans un contexte clinique réglementé, la transparence documentaire est une obligation légale absolue — toute manipulation des données (C, D) constitue une fraude scientifique aux conséquences légales et éthiques graves. Sur le plan humain, punir une erreur sans analyse de cause profonde (A) détruit la confiance de l'équipe et n'améliore pas les processus. La distinction entre responsabilité individuelle et culture de l'erreur (comprendre sans blâmer) est une compétence de leadership fondamentale. L'amendement réglementaire, même si coûteux en délai, est non négociable.` },

{ id:"P-018", domaine:"Personnes", approche:"Agile", type:"standard",
  question:`Vous gérez un projet de création d'une application mobile pour une association caritative. L'équipe de 6 bénévoles est très motivée mais travaille à temps partiel (quelques heures le soir et le week-end). Après 4 sprints, la vélocité est très faible (12-15 points vs objectif de 25) et plusieurs membres expriment un début d'épuisement car ils accumulent les engagements Scrum sur leurs obligations professionnelles et familiales. Comment adaptez-vous l'approche pour ce contexte spécifique de bénévolat ?`,
  options:[
    `A. Maintenir le cadre Scrum standard car la rigueur des cérémonies est nécessaire même dans un contexte bénévole pour assurer la qualité des livrables.`,
    `B. Adapter radicalement le cadre au contexte : réduire les cérémonies (mêlées asynchrones 2x/semaine, planification mensuelle plutôt que bimensuelle), adopter Kanban (flux continu sans engagement de sprint) plutôt que Scrum, revoir l'objectif de vélocité à la baisse sur la base de la capacité réelle (12-15 points), célébrer chaque contribution même petite, et revoir les attentes de délai avec le commanditaire de l'association en recalibrant le périmètre sur la capacité réelle — un projet bénévole épuisant perd ses ressources et échoue.`,
    `C. Remplacer les bénévoles surmenés par des personnes plus disponibles — le projet a des objectifs à tenir.`,
    `D. Demander à chaque bénévole d'identifier et de libérer un bloc de 20 heures par mois dans leur agenda professionnel pour le projet — la prévisibilité de la disponibilité est la clé de la performance.`
  ],
  correct:1,
  explication:`La réponse B est correcte. Un cadre de management de projet doit être adapté au contexte — le management de bénévoles à temps partiel nécessite des ajustements fondamentaux. La flexibilité et l'adaptabilité sont des principes Agile fondamentaux. La vélocité de 12-15 points reflète la réalité de la capacité disponible — l'objectif de 25 est déconnecté du contexte. Un projet bénévole qui épuise ses ressources perd la motivation et l'engagement, mettant en péril la livraison bien plus sûrement qu'une vélocité réduite.` },

{ id:"P-019", domaine:"Personnes", approche:"Prédictif", type:"standard",
  question:`Dans un projet de restructuration d'une organisation publique (budget 4,5 M€, 24 mois), votre plan de communication prévoit des réunions d'information mensuelles pour les 450 employés impactés. Après 3 mois, vous constatez que les rumeurs et la désinformation circulent massivement dans les couloirs, que l'anxiété est palpable, et que la productivité a baissé de 22 % dans les services concernés. Les 3 réunions mensuelles n'ont pas suffi. Comment révisez-vous votre plan de communication ?`,
  options:[
    `A. Augmenter la fréquence des réunions d'information (bi-mensuel) et en améliorer le contenu — la communication insuffisante est le problème.`,
    `B. Faire un diagnostic complet du plan de communication actuel : analyser les types de rumeurs qui circulent pour identifier les questions auxquelles le plan de communication ne répond pas ; multiplier les canaux (FAQ mise à jour hebdomadairement sur l'intranet, managers formés comme relais locaux d'information, messagerie instantanée pour questions en temps réel, sessions de questions-réponses ouvertes avec la direction) ; s'assurer que les messages répondent aux vraies préoccupations (sécurité de l'emploi ? périmètre des changements ? calendrier ?) plutôt que de répéter les messages institutionnels.`,
    `C. Communiquer uniquement les décisions finales et définitives pour éviter l'anxiété créée par les informations partielles — le trop-plein d'information incertaine est la source des rumeurs.`,
    `D. Mettre en place un système de signalement anonyme des rumeurs pour identifier et contredire rapidement les informations erronées.`
  ],
  correct:1,
  explication:`La réponse B est correcte. Les rumeurs dans un contexte de changement organisationnel comblent les vides d'information avec des scénarios anxiogènes. Le diagnostic des rumeurs est la clé : elles révèlent les questions auxquelles le plan de communication actuel ne répond pas. La multiplicité des canaux (notamment les managers comme relais locaux — ceux en qui les employés ont confiance) est plus efficace que l'augmentation de la fréquence des réunions formelles. Réduire la communication (C) accroît les rumeurs. Le signalement des rumeurs (D) est réactif ; il faut une approche proactive.` },

{ id:"P-020", domaine:"Personnes", approche:"Agile", type:"standard",
  question:`Vous êtes chef de projet pour le développement d'une fonctionnalité d'IA dans une application existante. En sprint planning, le Product Owner présente une user story très vague : "En tant qu'utilisateur, je veux que l'IA m'aide à prendre de meilleures décisions". L'équipe est incapable d'estimer cette story car les critères d'acceptation sont entièrement absents. Le PO dit : "C'est volontairement ouvert pour laisser de la liberté à l'équipe". Comment gérez-vous cette situation ?`,
  options:[
    `A. Accepter la story telle quelle et laisser l'équipe définir elle-même les critères d'acceptation pendant le sprint — la liberté créative est un principe Agile valorisé.`,
    `B. Expliquer au PO que même si la liberté créative est valorisée en Agile, une user story sans critères d'acceptation n'est pas estimable ni testable — elle ne respecte pas la Définition de Prêt. Proposer de conduire immédiatement une session de 2 heures (design studio ou Event Storming) avec le PO, 2 développeurs et 1 QA pour co-définir les critères d'acceptation sur la base des comportements utilisateur concrets attendus — la story peut ensuite être décomposée en stories plus petites et estimables pour le prochain sprint planning.`,
    `C. Estimer la story à 100 points de récit (estimation maximum) pour signaler qu'elle est trop grande et doit être découpée.`,
    `D. Refuser d'inclure la story dans le sprint backlog tant que le PO n'a pas fourni des critères d'acceptation complets et validés — le respect de la Définition de Prêt n'est pas négociable.`
  ],
  correct:1,
  explication:`La réponse B est correcte. Une user story sans critères d'acceptation ne peut pas être estimée ni testée — ce n'est pas un principe de liberté créative mais une lacune qui génère du gaspillage (reprises, divergences d'interprétation). La session de co-définition avec le PO est une démarche collaborative qui valorise à la fois la vision du PO et l'expertise de l'équipe. L'estimation à 100 points (C) est un signal mais ne résout pas le problème de fond. Le refus catégorique (D) est correct sur le fond mais bloque la collaboration sans proposer de solution.` },

{ id:"P-021", domaine:"Personnes", approche:"Hybride", type:"standard",
  question:`Un projet de déploiement d'un nouveau système de gestion des incidents dans une centrale électrique a une contrainte de sécurité absolue : aucune interruption du système de monitoring pendant le déploiement. Votre équipe technique propose une fenêtre de maintenance de 4 heures à 3h du matin un dimanche pour le déploiement. L'opérateur de nuit refuse catégoriquement d'être présent car "ce n'est pas dans sa description de poste". Comment gérez-vous cette situation ?`,
  options:[
    `A. Passer outre le refus de l'opérateur — la sécurité de la centrale est prioritaire sur les considérations individuelles de description de poste.`,
    `B. Ne pas forcer la présence de l'opérateur contre son gré ; analyser avec la direction des opérations les options : (1) inclure formellement cette obligation dans la description de poste et rémunérer en conséquence, (2) trouver un opérateur volontaire (avec prime de nuit), (3) planifier le déploiement dans la fenêtre d'horaire normal mais accepter des contraintes supplémentaires de sécurité, (4) évaluer si un déploiement sans présence d'opérateur est techniquement envisageable avec les automatismes en place — traiter la question par la négociation et la rémunération équitable plutôt que par la contrainte.`,
    `C. Déléguer la gestion de ce conflit au responsable RH et continuer la planification du déploiement en supposant que la présence de l'opérateur sera obtenue.`,
    `D. Demander au responsable de l'opérateur de donner l'ordre direct à ce dernier d'être présent — le responsable hiérarchique a l'autorité pour gérer ce type de situation.`
  ],
  correct:1,
  explication:`La réponse B est correcte. Forcer un employé à travailler en dehors de ses obligations contractuelles (A) est potentiellement illégal et crée un précédent problématique. La résolution du problème par la négociation et des conditions équitables (rémunération de nuit, volontariat) est à la fois plus éthique et plus susceptible d'obtenir un résultat de qualité. L'exploration des alternatives techniques (déploiement en heures normales, automatismes) est une démarche de gestion des risques. Déléguer à la RH (C) sans plan B est insuffisant.` },

{ id:"P-022", domaine:"Personnes", approche:"Agile", type:"standard",
  question:`En tant que Scrum Master, vous observez que la vélocité de votre équipe a régulièrement augmenté de 20 % sur les 6 derniers sprints, passant de 30 à 50 points. Le Product Owner est ravi. Mais vous remarquez que le taux de défauts post-sprint a également triplé, que les estimations sont devenues systématiquement optimistes, et que certains développeurs avouent en aparté "marquer des stories comme terminées même si ce n'est pas vraiment le cas". Comment interprétez-vous cette situation et agissez-vous ?`,
  options:[
    `A. Féliciter l'équipe pour l'amélioration de sa vélocité — c'est exactement ce que le PO attendait et l'objectif du projet est d'accélérer les livraisons.`,
    `B. Identifier que l'équipe est en train de "gonfler artificiellement" la vélocité (story points inflation) — probablement sous pression implicite ou explicite du PO pour livrer plus vite. Aborder le problème directement en rétrospective en présentant les données corrélées (vélocité vs taux de défauts) ; avoir une conversation honnête avec le PO sur le fait qu'une vélocité artificiellement augmentée ne reflète pas une vraie capacité de livraison et génère une dette de qualité coûteuse ; réinitialiser les pratiques d'estimation et renforcer la Définition de Fini.`,,
    `C. Demander à l'équipe de QA d'augmenter les tests pour compenser le taux de défauts croissant — l'accélération du développement entraîne naturellement plus de défauts.`,
    `D. Recommander d'augmenter la durée des sprints pour donner plus de temps à l'équipe de vérifier la qualité avant de fermer les stories.`
  ],
  correct:1,
  explication:`La réponse B est correcte. Une vélocité croissante avec un taux de défauts triplé est un signal d'alarme classique de "story points inflation" ou de dérive de la Définition de Fini. La pression (implicite ou explicite) pour livrer plus contribue à ce comportement. La corrélation des données (vélocité vs qualité) présentée en rétrospective est une approche factuelle et non accusatoire. La conversation honnête avec le PO est indispensable — il doit comprendre que la vitesse apparente masque une dette de qualité qui se paiera plus tard. Compenser par plus de tests (C) traite le symptôme, pas la cause.` },

{ id:"P-023", domaine:"Personnes", approche:"Prédictif", type:"standard",
  question:`Dans un programme de construction d'un aéroport (780 M€, 5 ans), vous êtes directeur de programme. Votre équipe de management de programme comprend 18 personnes couvrant 12 projets parallèles. Vous identifiez que trois chefs de projet juniors gèrent des projets au-delà de leurs capacités actuelles (complexité technique, parties prenantes multiples) et commencent à montrer des signes de dépassement. Comment développez-vous leurs compétences tout en maintenant la qualité de livraison des projets ?`,
  options:[
    `A. Réaffecter immédiatement les 3 projets à des chefs de projet plus expérimentés — la qualité de livraison d'un programme de 780 M€ prime sur le développement de carrière.`,
    `B. Mettre en place un système de mentorat structuré : assigner un chef de projet senior comme mentor à chacun des 3 juniors (2 heures hebdomadaires de co-gestion, revue des décisions importantes avant action, debriefing post-réunion) ; simplifier leur charge en retirant 1-2 projets de leur portefeuille et en confiant ces projets à des personnes plus expérimentées ; augmenter la fréquence des revues de leurs projets (hebdomadaire au lieu de mensuel) ; investir dans leur formation ciblée sur leurs lacunes identifiées — tout en fixant des objectifs de développement clairs sur 6 mois.`,
    `C. Organiser une formation intensive de 2 semaines sur la gestion de projets complexes pour les 3 juniors — la formation résoudra les lacunes identifiées.`,
    `D. Laisser les juniors gérer par eux-mêmes en les soutenant à distance — l'apprentissage par l'expérience est le meilleur développeur de compétences.`
  ],
  correct:1,
  explication:`La réponse B est correcte. Le développement des compétences (ECO T5 — Assurer la formation) et la protection de la qualité de livraison ne sont pas des objectifs incompatibles. Le mentorat structuré (co-gestion) permet un apprentissage en situation réelle tout en maintenant un filet de sécurité. La réduction de leur charge (retrait de 1-2 projets) reconnait honnêtement que le niveau de complexité actuel dépasse leurs capacités — sans les en exclure entièrement. La formation seule (C) sans changement de contexte est insuffisante. L'apprentissage sans filet (D) dans un programme de 780 M€ expose le programme à des risques inacceptables.` },

{ id:"P-024", domaine:"Personnes", approche:"Agile", type:"standard",
  question:`Dans votre équipe Agile, un développeur senior (Jacques) est reconnu comme un expert technique incontesté. Cependant, il monopolise toutes les décisions d'architecture, refuse les revues de code par ses pairs ("ils ne comprendront pas"), et plusieurs membres plus juniors commencent à perdre confiance en leurs propres compétences. Jacques produit d'excellents résultats individuellement mais l'équipe dans son ensemble ne progresse pas. Comment gérez-vous cette situation ?`,
  options:[
    `A. Laisser Jacques continuer comme il le fait — son expertise produit des résultats et perturber un performeur individuel de haut niveau est risqué pour le projet.`,
    `B. Engager une conversation directe et respectueuse avec Jacques pour reconnaître son expertise tout en lui présentant l'impact de son comportement sur la progression et la confiance de l'équipe ; proposer de réorienter son expertise vers le rôle de mentor/tech lead (participation aux revues de code comme formateur, présentation des décisions d'architecture à l'équipe avec explication, sessions de pair programming) — en faisant de son expertise un multiplicateur pour l'équipe plutôt qu'un facteur d'exclusion.`,
    `C. Imposer des revues de code croisées obligatoires en présentant cette décision à toute l'équipe sans préparation préalable avec Jacques — les règles du processus Agile s'appliquent à tous.`,
    `D. Retirer Jacques des responsabilités d'architecture et les redistribuer à l'équipe pour favoriser le développement collectif.`
  ],
  correct:1,
  explication:`La réponse B est correcte. Le problème avec Jacques n'est pas son expertise mais son comportement d'exclusion qui nuit à la croissance collective. La solution n'est pas de le pénaliser (D) mais de rediriger son expertise vers un rôle qui bénéficie à l'équipe entière. La conversation directe et préalable avec Jacques est indispensable avant tout changement de processus — le confronter publiquement (C) sans préparation créerait une réaction défensive. Laisser la situation se dégrader (A) compromet la résilience de l'équipe et crée une dépendance critique à un seul individu.` },

{ id:"P-025", domaine:"Personnes", approche:"Hybride", type:"standard",
  question:`Vous gérez un projet de déploiement d'un nouveau logiciel de comptabilité dans une entreprise de distribution. À 2 semaines du déploiement final, votre comptable expert (seule personne qui connaît les subtilités de la migration des données historiques) vous informe qu'elle part en congé maternité anticipé dans 3 jours — une semaine plus tôt que prévu. Aucun autre membre de l'équipe ne maîtrise les règles de migration. Comment gérez-vous cette situation d'urgence ?`,
  options:[
    `A. Demander à la comptable de rester jusqu'au déploiement — ses obligations professionnelles priment dans ce contexte critique.`,
    `B. Profiter des 3 jours disponibles de façon maximale : organiser des sessions intensives de transfert de connaissances documenté (enregistrées), créer des guides pas-à-pas pour chaque procédure critique de migration, faire valider les procédures par un pair externe si possible, évaluer si le déploiement peut être décalé de 2 semaines pour sécuriser la qualité de la migration, ou identifier un consultant externe spécialisé en migration de données comptables qui pourrait compléter le déploiement — sans exercer de pression sur la comptable sur sa décision médicale.`,
    `C. Décaler le déploiement de 2-3 mois jusqu'au retour de la comptable de son congé maternité.`,
    `D. Procéder au déploiement dans les 2 semaines prévues en mode dégradé — les règles de migration complexes peuvent être gérées manuellement par l'équipe comptable après le déploiement.`
  ],
  correct:1,
  explication:`La réponse B est correcte. La situation est une urgence qui nécessite un maximum de transfert de connaissances dans un délai très court, sans compromettre les droits de la comptable (congé maternité anticipé = décision médicale non négociable — la réponse A est inacceptable éthiquement et légalement). L'option B explore toutes les alternatives : transfert de connaissances accéléré, report limité si possible, expert externe. Le déploiement en mode dégradé (D) dans un logiciel de comptabilité peut créer des erreurs financières aux conséquences graves.` },

{ id:"P-026", domaine:"Personnes", approche:"Agile", type:"standard",
  question:`Lors d'une revue de sprint, un membre important de l'équipe exprime ouvertement devant le Product Owner et les parties prenantes que "cette fonctionnalité est complètement inutile et personne dans l'équipe ne comprend pourquoi on la développe". Cette déclaration surprend tout le monde, crée un malaise et fragilise la confiance des parties prenantes dans l'équipe. Comment gérez-vous cet incident ?`,
  options:[
    `A. Ignorer la remarque et passer rapidement à la suite de la revue — les commentaires intempestifs en réunion sont mieux gérés par l'oubli que par la réponse.`,
    `B. En réunion : reconnaître la préoccupation avec calme ("C'est une question légitime sur la valeur de cette fonctionnalité"), demander brièvement au PO de rappeler le contexte et la valeur métier de la fonctionnalité pour l'équipe et les parties prenantes, et clore avec positivisme ; en dehors de la réunion : avoir un entretien individuel avec le membre concerné pour comprendre sa frustration profonde (manque de contexte ? désaccord légitime sur la valeur ? frustration autre chose transférée ?) et travailler avec le PO pour améliorer la transparence sur les décisions de priorisation — la frustration exprimée publiquement signale souvent un manque de contexte ou d'engagement réel.`,,
    `C. Demander au membre de s'excuser publiquement auprès des parties prenantes pour son comportement non professionnel.`,
    `D. Exclure ce membre des prochaines revues de sprint pour protéger la relation avec les parties prenantes.`
  ],
  correct:1,
  explication:`La réponse B est correcte. La gestion de cet incident en deux temps (en réunion puis en dehors) est la clé. En réunion, reconnaître la préoccupation sans valider le comportement permet de maintenir la fluidité de la revue tout en signalant que la question est prise au sérieux. L'entretien individuel ultérieur traite le fond — la frustration exprimée publiquement révèle souvent un manque d'engagement réel sur la valeur du travail, qui est une responsabilité du PO (clarifier le contexte) et du chef de projet. L'exclusion (D) crée du ressentiment et masque un problème de fond.` },

{ id:"P-027", domaine:"Personnes", approche:"Prédictif", type:"standard",
  question:`Vous êtes chef de projet pour la mise en place d'un centre de tri automatisé pour un opérateur postal (budget 23 M€, 30 mois). Votre équipe inclut 5 ingénieurs employés de l'opérateur postal et 8 consultants externes. Après 10 mois, vous constatez que les ingénieurs internes développent une attitude de "spectateurs" lors des réunions techniques — ils participent peu aux décisions, laissent les consultants dominer et semblent attendre que le projet se termine. Pourtant, ce sont eux qui devront maintenir le système pendant 15 ans après la fin du projet. Que faites-vous ?`,
  options:[
    `A. Accepter la situation — les consultants sont les experts techniques et leur leadership dans les décisions techniques est normal et bénéfique pour la qualité.`,
    `B. Reconnaître que ce comportement signale un risque majeur de transfert de compétences — les ingénieurs internes n'acquièrent pas la maîtrise du système qu'ils devront maintenir. Restructurer la dynamique : assigner des responsabilités de décision techniques aux ingénieurs internes (avec support des consultants, pas à leur place), créer des ateliers de co-conception où les ingénieurs internes sont responsables des livrables techniques, exiger que toute documentation soit rédigée par les ingénieurs internes (avec revue des consultants) — transformer les ingénieurs internes de spectateurs en acteurs principaux.`,
    `C. Organiser une formation technique intensive pour les ingénieurs internes en fin de projet pour accélérer le transfert de connaissances avant la clôture.`,
    `D. Inclure dans le contrat des consultants une clause de transfert de compétences avec des indicateurs mesurables pour s'assurer qu'ils forment correctement les ingénieurs internes.`
  ],
  correct:1,
  explication:`La réponse B est correcte. Le risque identifié est critique : le système sera maintenu 15 ans par des personnes qui ne l'ont pas maîtrisé. La restructuration de la dynamique (ingénieurs internes comme acteurs principaux, consultants comme supports) est la solution systémique. Une formation en fin de projet (C) est trop tardive — la compréhension d'un système complexe s'acquiert en le construisant, pas en l'étudiant après coup. La clause contractuelle (D) est un mécanisme de contrôle utile mais insuffisant seul — elle ne change pas la dynamique actuelle.` },

{ id:"P-028", domaine:"Personnes", approche:"Agile", type:"standard",
  question:`Votre équipe Agile a été formée il y a 3 mois. Selon le modèle de Tuckman, elle est en phase de "Normalisation" (Norming) — les règles de travail commencent à s'établir et la cohésion progresse. Une restructuration organisationnelle vient d'intégrer 2 nouveaux membres dans l'équipe (une experte métier et un architecte senior) et a retiré un membre fondateur populaire. Comment cela affecte-t-il le développement de l'équipe et comment gérez-vous la transition ?`,
  options:[
    `A. Les 2 nouveaux membres s'adapteront naturellement — une équipe en Norming a suffisamment de maturité pour intégrer de nouveaux membres sans régression.`,
    `B. Reconnaître que l'ajout de 2 membres et le départ d'un membre fondateur constituent un changement suffisamment significatif pour faire régresser l'équipe vers la phase de Confrontation (Storming) — les dynamiques établies sont perturbées. Gérer proactivement cette régression : session de team building incluant les nouveaux membres, révision du team charter pour intégrer leurs perspectives, période d'accompagnement renforcé (1-2 sprints), et attention particulière au moral de l'équipe suite au départ d'un membre populaire (créer un espace pour exprimer les sentiments).`,
    `C. Accélérer la phase d'intégration en assignant immédiatement des responsabilités exigeantes aux nouveaux membres — les nouvelles responsabilités forcent une intégration rapide.`,
    `D. Demander à la direction d'attendre que l'équipe soit en phase de Performance (Performing) avant d'effectuer des changements de composition — les changements d'équipe devraient être planifiés en fonction de la maturité de l'équipe.`
  ],
  correct:1,
  explication:`La réponse B est correcte. Le modèle de Tuckman (T5 — Assurer la formation/développement de l'équipe) prédit qu'un changement significatif de composition d'équipe réinitialise partiellement ou totalement le cycle de développement. La régression vers la phase de Confrontation est normale et prévisible — pas un échec. La gestion proactive (team building, révision du team charter) accélère le retour à la phase de Normalisation. Ignorer la régression (A) laisse les nouvelles dynamiques de conflict se développer sans intervention. La responsabilisation immédiate et intense des nouveaux membres (C) sans période d'intégration est contreproductive.` },

{ id:"P-029", domaine:"Personnes", approche:"Hybride", type:"standard",
  question:`Vous gérez un projet IoT pour la gestion de l'eau dans des villes de taille moyenne. Lors d'une démonstration aux élus de la première ville pilote, votre équipe présente des métriques purement techniques (latence des capteurs, taux de transmission, précision de la mesure) sans aucune contextualisation sur les bénéfices pour les citoyens. Les élus quittent la réunion peu convaincus. Comment transformez-vous la prochaine démonstration ?`,
  options:[
    `A. Préparer des slides avec plus de détails techniques — les élus ont probablement manqué certains aspects importants.`,
    `B. Reconnaître que l'équipe a présenté la solution du point de vue de l'ingénieur alors que les élus ont besoin du point de vue du citoyen : restructurer la prochaine démonstration autour de scénarios concrets, associer les ingénieurs à la préparation de ces scénarios pour transformer leur compréhension technique en bénéfices tangibles, et inviter des citoyens comme observateurs.`,
    `C. Demander à un communicant externe de préparer et animer la prochaine démonstration — les ingénieurs ne sont pas les mieux placés pour communiquer avec les élus.`,
    `D. Réduire la durée des prochaines démonstrations aux 5 minutes essentielles pour ne pas perdre l'attention des élus.`,
  ],
  correct:1,
  explication:`La réponse B est correcte. Ce problème illustre la nécessité d'adapter le message à l'audience (ECO T7 — Communiquer avec les parties prenantes). Les élus s'intéressent aux économies d'eau, à la détection des fuites, à la réduction des coûts pour les citoyens — pas à la latence des capteurs. Transformer l'expertise technique en bénéfices tangibles est une compétence communicationnelle que l'équipe doit développer, pas déléguer entièrement.`,
},
{ id:"P-030", domaine:"Personnes", approche:"Agile", type:"standard",
  question:`Dans une organisation qui adopte l'Agile à grande échelle, vous êtes chef de projet d'une équipe qui fonctionne bien en Agile depuis 18 mois. Une nouvelle directive managériale impose à tous les projets de produire un rapport d'avancement hebdomadaire de 8 pages dans un format standardisé conçu pour les projets prédictifs — incluant des sections sans pertinence pour l'Agile (% d'avancement des tâches, Gantt mis à jour, plan de ressources détaillé). Cette obligation prend 6-8 heures par semaine à votre équipe. Comment abordez-vous cette situation ?`,
  options:[
    `A. Remplir le rapport de 8 pages tel qu'exigé — la conformité aux directives managériales prime sur l'efficacité de l'équipe.`,
    `B. Construire un cas d'affaires montrant le coût du rapport actuel (6-8h/semaine = 300-400h/an pour votre équipe seule) et le proposant en remplacement un format adapté à l'Agile (dashboard d'une page : vélocité, burn-down, prochaines milestones, risques, décisions nécessaires) qui répond aux mêmes besoins d'information de la direction en moins de 2h ; présenter la proposition à votre management et au PMO avec l'objectif d'améliorer le reporting Agile pour toutes les équipes concernées.`,
    `C. Remplir le rapport avec des estimations approximatives pour réduire le temps passé — la précision n'est pas critique pour un rapport d'avancement.`,
    `D. Demander une exemption formelle pour votre équipe Agile en argumentant que les projets Agile ne peuvent pas produire les métriques demandées par le format prédictif.`
  ],
  correct:1,
  explication:`La réponse B est correcte. Le problème n'est pas d'éviter le reporting (les parties prenantes ont un besoin légitime d'information) mais de remplacer un format inadapté par un format plus efficace pour tous. Le cas d'affaires (coût actuel vs alternative) est le langage que la direction comprend. L'objectif d'améliorer le reporting pour toutes les équipes Agile est une contribution à l'organisation, pas seulement un bénéfice individuel. Les estimations approximatives (C) compromettent l'intégrité des données. Une exemption individuelle (D) ne résout pas le problème systémique pour les autres équipes Agile.` },,
// ── ÉTUDE DE CAS EC3 — Smart City ─────────────────────────────────
{ id:"EC3-Q1", domaine:"Processus", approche:"Prédictif", type:"etude-de-cas",
  etudeDeCas:{ id:"EC3",
    titre:"Étude de cas : Programme Smart City — Métropole de Kasaville",
    contexte:`La métropole de Kasaville a lancé un programme Smart City de 72 M€ sur 48 mois : (1) 1 200 capteurs IoT pour trafic et qualité de l'air, (2) plateforme de données urbaines (data lake + tableaux de bord temps réel), (3) gestion intelligente de l'éclairage public (14 000 points lumineux), (4) application citoyenne multiservice. Vous êtes directeur de programme nommé par le Maire. EVM au mois 22 : BAC = 72 M€, VP = 34,5 M€, VA = 27,6 M€, CR = 31,05 M€. Capteurs IoT : 85 % livrés mais précision ±18 % (spec : ±5 %). Data lake : opérationnel mais 12 % d'erreurs de données. Éclairage : retard 5 mois (fournisseur microcontrôleurs). App citoyenne : NPS = -23 en tests beta. Audit interne : 2,1 M€ de dépenses sur le data lake engagées sans approbation du CCM.` },
  question:`L'audit interne identifie les 2,1 M€ de dépenses non autorisées sur le data lake. Quelles sont vos obligations immédiates et comment gérez-vous cette situation sur les plans éthique, gouvernance et opérationnel ?`,
  options:[
    `A. Mandater une investigation interne pour identifier le responsable avant de communiquer — comprendre les faits avant d'exposer le programme à des sanctions politiques.`,
    `B. Informer immédiatement le DGS et le comité de pilotage de la totalité des faits, initier une demande de modification rétroactive au CCM pour les dépenses justifiables, identifier les ajustements de contrôle interne pour éviter toute récurrence, préparer un rapport complet avec actions correctives — sans minimiser ni retarder la divulgation.`,
    `C. Régulariser les dépenses discrètement en les reclassant dans des lignes budgétaires autorisées pour éviter un incident de gouvernance.`,
    `D. Demander au responsable data lake de préparer une justification pour le prochain comité de pilotage dans 3 semaines, en attendant une présentation bien construite.`
  ],
  correct:1,
  explication:`La réponse B est correcte. Le Code d'Éthique PMI est explicite : la transparence et l'honnêteté dans les rapports aux organes de gouvernance sont non négociables. Les 2,1 M€ non autorisés constituent une déviation sérieuse — la dissimuler (C, D) constituerait une faute grave aggravant la situation. L'investigation pour identifier le responsable (A) peut être conduite en parallèle mais ne précède pas la divulgation. Dans un programme public (fonds publics), les obligations de transparence sont encore plus strictes.` },

{ id:"EC3-Q2", domaine:"Processus", approche:"Hybride", type:"etude-de-cas",
  etudeDeCas:{ id:"EC3" },
  question:`Les capteurs IoT ont une précision de ±18 % (spec contractuelle : ±5 %). 85 % des 1 200 capteurs sont déployés. Le fournisseur argue que la spec était "ambiguë". Options : (A) Remplacement complet (1,8 M€, 6 mois, 95 % de succès) ; (B) Correction logicielle (280 000 €, 8 semaines, amélioration à ±9-11 %) ; (C) Acceptation avec indicateur de fiabilité visible et communication transparente aux citoyens (40 000 €, 2 semaines). Quelle recommandation pour le comité de pilotage ?`,
  options:[
    `A. Imposer immédiatement le remplacement complet aux frais exclusifs du fournisseur et suspendre les données de qualité d'air dans tous les tableaux de bord.`,
    `B. Engager une analyse contractuelle formelle pour déterminer la responsabilité ; soumettre une demande de modification au CCM avec analyse coût-bénéfice-risque des trois options ; recommander une solution hybride (correction logicielle immédiate + clause de remplacement progressif si les seuils ne sont pas atteints) ; maintenir l'utilisation des données avec indicateur de fiabilité transparent.`,
    `C. Choisir Option C (acceptation) car c'est la solution la moins coûteuse et la plus rapide — les citoyens comprennent les limites de l'IoT.`,
    `D. Exiger que le fournisseur présente son propre plan sous 48h et résilier en cas de refus de l'Option A.`
  ],
  correct:1,
  explication:`La réponse B est correcte. Ce cas illustre la gestion de la qualité (ECO T7) combinée aux achats (T5) et au contrôle des modifications (T10). L'analyse contractuelle préalable est indispensable — "ambiguïté de spec" est une défense juridique légitime. La solution hybride (correction logicielle + clause contractuelle) adresse l'amélioration immédiate tout en protégeant les intérêts de la ville. L'exigence immédiate de remplacement total (A, D) sans analyse contractuelle expose la ville à des contentieux coûteux.` },

// ── Questions Processus indépendantes ─────────────────────────────
{ id:"PR-001", domaine:"Processus", approche:"Prédictif", type:"standard",
  question:`Dans un projet de développement de médicament de phase III (28 M€, 36 mois), l'EVM au mois 14 donne : BAC = 28 M€, VA = 11,76 M€, VP = 14 M€, CR = 13,44 M€. La nature du projet impose une contrainte de qualité absolue (les essais cliniques ne peuvent pas être accélérés). Calculez les indicateurs EVM principaux et recommandez une action au comité de pilotage.`,
  options:[
    `A. IPC-Cal = 0,84 ; IPC-C = 0,88 ; EAC ≈ 31,8 M€. Recommandation : accélérer les activités non critiques en parallèle et renégocier le budget.`,
    `B. IPC-Cal = 0,84 ; IPC-C = 0,875 ; EAC = 32 M€. Recommandation : présenter l'EAC révisé à 32 M€ au comité (dépassement de 4 M€) ; concentrer les actions correctives sur la réduction des coûts administratifs compressibles ; ne pas comprimer le calendrier des essais ; évaluer si l'IPA (environ 1,11) est atteignable ou si une révision du BAC est nécessaire.`,
    `C. IPC-Cal = 0,84 ; IPC-C = 0,875 ; EAC = 32 M€. Recommandation : suspendre 20 % des activités non critiques pour ramener l'IPC-C à 1,0 — la maîtrise du coût est prioritaire sur le calendrier.`,
    `D. IPC-Cal = 0,84 ; IPC-C = 0,875 ; EAC = 32 M€. Recommandation : ne pas alerter le comité — les déviations de ±15 % sont dans la norme et peuvent se corriger seules.`
  ],
  correct:1,
  explication:`IPC-Cal = VA/VP = 11,76/14 = 0,84 (retard de 16 %). IPC-C = VA/CR = 11,76/13,44 = 0,875 (surcoût de 12,5 %). EAC = BAC/IPC-C = 28/0,875 = 32 M€. Dans un projet pharmaceutique Phase III, les essais cliniques sont réglementairement contraints — toute compression calendaire est impossible et légalement risquée. Les actions correctives doivent cibler les coûts compressibles (coordination, administration). La transparence vers le comité sur l'EAC de 32 M€ est une obligation éthique PMI. Ne pas alerter (D) est une faute éthique grave.` },

{ id:"PR-002", domaine:"Processus", approche:"Agile", type:"standard",
  question:`Vous gérez un projet digital de 14 mois (plateforme e-commerce B2B). À mi-parcours (sprint 13/26), la dette technique a fortement augmenté : 23 % du code nécessite refactorisation, temps de build CI/CD passé de 8 à 34 minutes, taux d'échec des builds : 28 %. Le Product Owner refuse d'allouer du temps à la réduction de dette car "ça n'apporte pas de valeur visible au client". 2 développeurs ont évoqué leur intention de partir si la situation ne change pas. Comment gérez-vous ce conflit entre livraison immédiate et santé technique ?`,
  options:[
    `A. Soutenir la position du PO — la dette technique est normale en Agile et l'équipe doit s'y adapter.`,
    `B. Faciliter une session avec le PO en quantifiant l'impact : build 4x plus lent = équivalent 1,5 développeur perdu par sprint ; risque de départ de 2 développeurs = coût de remplacement 4-6 mois de salaire + perte de connaissance ; proposer une allocation structurée de 15-20 % de la capacité de sprint à la réduction de la dette avec KPIs mesurables (temps de build, taux d'échec) — recadrer la dette technique comme une dette métier impactant la vélocité future.`,
    `C. Permettre à l'équipe de consacrer 20 % de leur temps à la dette technique discrètement sans le dire au PO.`,
    `D. Escalader immédiatement au sponsor pour qu'il arbitre entre priorités techniques et fonctionnelles.`
  ],
  correct:1,
  explication:`La réponse B est correcte. La dette technique est un problème métier — c'est en ces termes qu'il faut l'adresser avec le PO. La quantification de l'impact (build 4x plus lent, équivalent 1,5 FTE perdu/sprint, risque de départ) traduit la dette en langage décisionnel. L'allocation structurée de 15-20 % est une pratique Agile reconnue (Google, Spotify). La dissimulation (C) viole le principe de transparence. L'escalade immédiate (D) est prématurée avant la conversation PO-équipe.` },

{ id:"PR-003", domaine:"Processus", approche:"Prédictif", type:"standard",
  question:`Dans un projet de construction d'hôpital public (42 M€, 30 mois), au mois 19, votre responsable qualité découvre que le sous-traitant électrique a utilisé des câbles de 4 mm² au lieu des 6 mm² spécifiés sur 23 % des circuits (340 m de câblage). Le sous-traitant affirme que "c'est équivalent". Coût de correction : 210 000 €, délai : 6 semaines sur le chemin critique. Le directeur des travaux vous presse de "fermer les yeux" car le projet est déjà en retard de 3 semaines. Quelle est votre décision ?`,
  options:[
    `A. Accepter un compromis : certification a posteriori par un ingénieur électricien indépendant que les câbles 4 mm² sont suffisants pour les charges prévues.`,
    `B. Exiger la mise en conformité complète (remplacement des 340 m) ; documenter la non-conformité dans le registre qualité ; notifier formellement le client/maître d'ouvrage ; traiter la question de la responsabilité financière (le sous-traitant devrait supporter le coût) ; refuser catégoriquement la pression — dans un hôpital public, la sécurité des patients est une contrainte absolue non négociable.`,
    `C. Documenter la non-conformité mais permettre au projet de continuer en imposant une pénalité de 210 000 € au sous-traitant comme dédommagement.`,
    `D. Convoquer une réunion d'urgence avec le directeur des travaux, le sous-traitant et l'ingénieur de contrôle pour évaluer collectivement le risque réel et décider collégialement.`
  ],
  correct:1,
  explication:`La réponse B est la seule acceptable. Dans un hôpital public, les normes électriques sont des exigences de sécurité vitale réglementées — elles ne font pas l'objet de compromis pragmatiques. Les câbles sous-dimensionnés présentent des risques réels d'incendie et de panne électrique dans des services critiques (urgences, blocs opératoires, réanimation). La certification a posteriori (A) contourne le processus formel. La pénalité sans correction (C) laisse une installation non conforme dans un bâtiment de santé. La pression du directeur est un test éthique — "fermer les yeux" constituerait une faute professionnelle grave.` },

{ id:"PR-004", domaine:"Processus", approche:"Hybride", type:"standard",
  question:`Vous gérez un programme de migration cloud (7 M€, 20 mois) migrant 147 applications legacy vers AWS. À mi-parcours, vous découvrez : (1) 23 applications ont des dépendances non documentées avec 14 systèmes patrimoniaux dont l'extinction est planifiée ; (2) votre outil IA de mapping des dépendances a produit des recommandations acceptées sans validation humaine sur 7 migrations récentes. Comment gérez-vous ces deux problèmes simultanément ?`,
  options:[
    `A. Arrêter complètement le programme 4 semaines pour un audit exhaustif de toutes les dépendances des 147 applications.`,
    `B. Pour les dépendances : cartographie accélérée (2 sprints) ciblée sur les 23 applications problématiques, suspension des extinctions des 14 systèmes concernés jusqu'à validation. Pour l'IA : établir immédiatement un processus de validation humaine obligatoire pour toute recommandation avant exécution, auditer les 7 migrations non validées a posteriori, définir des critères d'escalade pour les recommandations à risque élevé — documenter dans le plan de gouvernance.`,
    `C. Faire confiance à l'IA pour analyser les dépendances non documentées — utiliser l'IA pour résoudre le problème qu'elle a créé.`,
    `D. Traiter les deux problèmes séquentiellement sur 6 mois : dépendances (3 mois) puis gouvernance IA (3 mois).`
  ],
  correct:1,
  explication:`La réponse B est correcte. Ce cas illustre deux risques critiques : la gestion des dépendances complexes (ECO T8) et la supervision humaine de l'IA (ECO 2026 — nouveau thème). La cartographie ciblée (23 applications, pas 147) est efficiente. Le problème de validation IA est critique — accepter des recommandations algorithmiques sans validation humaine dans un contexte de migration production est une négligence professionnelle. L'ECO 2026 est explicite : l'IA doit augmenter le jugement humain, pas le remplacer. La gestion séquentielle (D) laisse le problème IA sans réponse 3 mois — inacceptable.` },

{ id:"PR-005", domaine:"Processus", approche:"Prédictif", type:"standard",
  question:`Dans un projet EPC (Engineering, Procurement, Construction) de station de traitement d'eau (22 M€, 28 mois), l'entrepreneur soumet au mois 16 un claim de 1,85 M€ et 8 semaines de délai, arguant des "Changed Conditions" géotechniques (article 12 du contrat). Votre analyse montre : données géotechniques initiales couvraient 60 % de la zone, les conditions dans la zone non couverte sont effectivement différentes et ont nécessité des fondations spéciales, surcoût documenté = 1,2 M€, reste non justifié = 650 000 €. Réserve de management : 1,4 M€. Comment traitez-vous ce claim ?`,
  options:[
    `A. Rejeter l'intégralité du claim — l'entrepreneur aurait dû réaliser ses propres investigations géotechniques.`,
    `B. Analyser contractuellement l'article 12 et la documentation probante ; reconnaître la partie justifiée (1,2 M€ documentés, 4-5 semaines de délai proportionnel) après vérification indépendante ; négocier fermement le rejet de la partie non justifiée (650 000 €) en demandant une documentation détaillée ; soumettre une demande de modification formelle au CCM pour les montants reconnus ; informer le comité de pilotage de l'impact sur la réserve (1,2 M€ sur 1,4 M€ disponibles).`,
    `C. Accepter l'intégralité du claim pour préserver la relation et éviter un arbitrage coûteux.`,
    `D. Demander à l'entrepreneur de réaliser ses propres nouvelles investigations géotechniques avant toute discussion.`
  ],
  correct:1,
  explication:`La réponse B est correcte. La gestion des claims contractuels (ECO T5 — Achats) exige une approche analytique rigoureuse. L'article 12 "Changed Conditions" est une clause standard dans les contrats EPC — son existence légitime l'examen du claim. La distinction entre partie justifiée (1,2 M€ documentés) et non justifiée (650 000 €) est la clé de la négociation. La transparence vers le CCM et le comité sur l'impact en réserve de management (1,2/1,4 M€) est obligatoire. Accepter l'intégralité (C) crée un précédent négatif.` },

{ id:"PR-006", domaine:"Processus", approche:"Agile", type:"standard",
  question:`Vous gérez le développement d'un capteur médical connecté en Agile matérielle (cycles de 6 semaines). Au 5ème cycle, les tests révèlent un taux de faux positifs de 3,2 % en humidité > 75 % (seuil FDA : 2 %). Option A : Refonte complète du PCB (380 000 €, 14 semaines, 95 % de succès). Option B : Correction logicielle (45 000 €, 4 semaines, amélioration à ±2,1-2,4 %). Option C : Restriction d'usage par étiquetage (déconseiller en humidité > 75 %). Quelle est votre recommandation au comité de direction ?`,
  options:[
    `A. Recommander Option B (correction logicielle) car les coût et délai sont nettement inférieurs — la FDA accepte généralement les corrections logicielles.`,
    `B. Recommander Option A (refonte PCB) : la FDA réglemente selon des seuils stricts (2 % maximum), pas des approximations — un taux de 2,1-2,4 % entraîne le rejet de la certification 510(k) avec très haute probabilité ; l'Option C est médicalement inacceptable (humidité élevée fréquente en milieu clinique) ; l'analyse VME montre qu'Option A (380 k€ + 14 sem.) est économiquement dominante sur le cycle complet vs Option B (45 k€ + risque refus FDA = 6-12 mois de retard + refonte de toute façon).`,
    `C. Recommander Option C (restriction d'étiquetage) pour permettre un lancement rapide sur certains marchés et planifier la correction PCB dans la version 2.0.`,
    `D. Suspendre le projet et consulter un expert FDA externe avant toute décision — l'enjeu réglementaire dépasse les responsabilités du chef de projet.`
  ],
  correct:1,
  explication:`La réponse B est correcte. La gestion de la qualité dans un contexte réglementaire strict (ECO T7) et la prise de décision sous contrainte exigent une analyse coût total du cycle de vie. La FDA réglemente en valeurs absolues : 2,1-2,4 % de faux positifs entraîne le rejet de la certification 510(k). L'analyse VME favorise clairement Option A malgré son coût apparent supérieur (Option B à 45 k€ + risque de refus FDA + refonte quand même = coût total supérieur à Option A). Option C est médicalement irresponsable dans les environnements hospitaliers (salles d'opération, réanimation) où l'humidité est élevée par conception.` },

{ id:"PR-007", domaine:"Processus", approche:"Prédictif", type:"standard",
  question:`Vous êtes chef de projet pour la mise en conformité réglementaire BÂLE IV d'une banque (délai imposé par le régulateur : 31 mars N+1). Un cabinet de conseil est contractuellement responsable du modèle de risque de crédit — composant critique du chemin critique. Au mois 8 (sur 14 mois) : 55 % des livrables produits (cible : 70 %), qualité insuffisante sur 3 des 5 modules livrés. Le cabinet argue que "les retards sont dus aux changements de spécifications" et menace un claim. Votre analyse montre que 2 retards sont liés à des changements documentés mais 3 autres et les problèmes qualité ne le sont pas. Comment gérez-vous cette situation ?`,
  options:[
    `A. Accepter la position du cabinet pour éviter le conflit contractuel et absorber les retards dans vos réserves.`,
    `B. Conduire une analyse contractuelle distinguant les retards liés aux changements de spécifications (2 cas — responsabilité partagée) des retards non justifiés et problèmes qualité (3 cas — responsabilité du cabinet) ; formaliser cette analyse par écrit avec un plan de redressement exigé sous 15 jours ; activer la clause de performance pour les manquements documentés ; initier discrètement un plan de contingence (prestataire alternatif ou ressources internes de backup) ; informer le comité de pilotage du risque résiduel sur le délai réglementaire.`,
    `C. Résilier immédiatement le contrat et mobiliser des ressources internes pour terminer le modèle de risque de crédit.`,
    `D. Demander au régulateur une extension de délai de 3 mois en argumentant les difficultés avec le prestataire.`
  ],
  correct:1,
  explication:`La réponse B est correcte. La gestion des achats (ECO T5) dans un contexte de sous-performance prestataire requiert une analyse précise qui distingue les responsabilités partagées des manquements purs. Reconnaître honnêtement la part de la banque (2 retards) tout en exigeant le redressement sur les manquements documentés du cabinet est à la fois juste et efficace. Le plan de contingence parallèle est une mesure prudente (ECO T3 — Risques), pas un signal de rupture. La résiliation immédiate (C) à mois 8 créerait un chaos encore plus grave. Demander une extension au régulateur (D) expose la réputation de la banque.` },

{ id:"PR-008", domaine:"Processus", approche:"Agile", type:"standard",
  question:`Votre équipe Scrum développe une plateforme de gestion des ressources humaines. Lors de la revue du sprint 8, le product owner demande d'intégrer une fonctionnalité de "suivi en temps réel de la localisation des employés pendant les heures de travail" pour permettre aux managers de voir où se trouvent leurs équipes à tout moment. La fonctionnalité est techniquement réalisable en 2 sprints. Comment réagissez-vous ?`,
  options:[
    `A. Accepter la fonctionnalité dans le backlog puisque le PO a l'autorité sur le backlog produit.`,
    `B. Alerter le PO et le management que cette fonctionnalité soulève des questions légales et éthiques significatives : dans de nombreux pays, la surveillance en temps réel de la localisation des employés est soumise à des restrictions légales strictes (RGPD, codes du travail) et peut constituer une violation de la vie privée ; recommander de consulter le juriste/DPO avant d'intégrer cette fonctionnalité au backlog, et de remplacer par des alternatives fonctionnellement équivalentes mais légalement robustes (suivi opt-in, rapports de présence, etc.).`,
    `C. Développer la fonctionnalité avec un disclaimer visible dans l'interface indiquant que l'utilisation est soumise au droit local.`,
    `D. Soumettre la question à la direction pour qu'elle décide — c'est une décision stratégique qui dépasse les responsabilités du chef de projet.`
  ],
  correct:1,
  explication:`La réponse B est correcte. La surveillance en temps réel de la localisation des employés est une zone à risque légal et éthique majeur dans la plupart des juridictions (RGPD en Europe, codes du travail nationaux). Le chef de projet (ECO T2 — Confirmer la conformité, T7 — Qualité) a la responsabilité de signaler ces risques avant qu'une fonctionnalité non conforme soit développée. Un disclaimer (C) ne suffit pas quand la fonctionnalité elle-même peut être illégale. Déléguer la décision (D) sans formuler clairement le risque est insuffisant.` },

{ id:"PR-009", domaine:"Processus", approche:"Prédictif", type:"standard",
  question:`Lors d'une révision du planning d'un projet de construction d'un barrage (95 M€, 48 mois), votre analyse du chemin critique révèle que le délai prévu pour la "pose des fondations" est de 8 semaines selon le planning approuvé. Cependant, votre ingénieur principal vous informe discrètement que compte tenu des conditions géologiques réelles découvertes, cette activité prendra au minimum 14 semaines — ce qui créerait un retard de 6 semaines sur le chemin critique. L'ingénieur hésite à "créer des problèmes" en le signalant officiellement. Comment gérez-vous cette situation ?`,
  options:[
    `A. Accepter la position de l'ingénieur de ne pas signaler officiellement — modifier le planning officiellement à ce stade créerait une alarme prématurée chez le client.`,
    `B. Encourager et aider l'ingénieur à documenter formellement l'analyse technique révisée des fondations, mettre à jour officiellement le planning pour refléter la durée réaliste de 14 semaines, informer le comité de pilotage et le client du retard identifié avec une analyse des options de mitigation — un retard signalé tôt peut être géré ; découvert en retard il devient une crise.`,
    `C. Modifier le planning en changeant uniquement l'activité fondations à 14 semaines mais en réduisant d'autres activités non critiques pour masquer le délai total.`,
    `D. Demander à un deuxième ingénieur d'évaluer indépendamment les fondations avant de prendre toute décision sur la révision du planning.`
  ],
  correct:1,
  explication:`La réponse B est correcte. La dissimulation d'informations sur le planning à des parties prenantes (A, C) viole les principes fondamentaux du Code d'Éthique PMI (honnêteté, transparence). L'ECO T8 (Gérer le calendrier) et T9 (Évaluer le statut du projet) imposent une évaluation réaliste et une communication transparente. Un retard identifié à l'avance peut être géré par des options de compression (crashing, fast-tracking sur d'autres activités) ; un retard découvert trop tard devient une crise sans solution. L'ingénieur hésite par peur des conséquences — le chef de projet doit créer un contexte sûr pour signaler les mauvaises nouvelles.` },

{ id:"PR-010", domaine:"Processus", approche:"Agile", type:"standard",
  question:`Votre équipe développe une application SaaS en mode Agile. Le Product Owner reçoit fréquemment des demandes urgentes de clients importants qui nécessitent d'interrompre le sprint en cours et de rediriger immédiatement l'équipe. Sur les 6 derniers sprints, 4 ont été interrompus de cette façon, et la vélocité a chuté de 45 à 22 points. L'équipe est frustrée et le PO est sous pression des clients. Comment résolvez-vous ce problème systémique ?`,
  options:[
    `A. Accepter les interruptions de sprint comme inhérentes au travail avec des clients B2B — la réactivité est un avantage concurrentiel.`,
    `B. Reconnaître que le modèle Scrum avec des sprints fixes n'est pas adapté à ce flux de travail réactif ; travailler avec le PO sur une solution hybride : définir un "fast lane" (20 % de la capacité de sprint réservé aux urgences client sans engagement de sprint) et un "planned lane" (80 % pour les fonctionnalités planifiées) ; établir des critères clairs pour ce qui constitue une "vraie urgence" vs une "fonctionnalité souhaitée urgent", et améliorer la communication des engagements de sprint avec les clients pour réduire les attentes irréalistes de réactivité immédiate.`,,
    `C. Passer entièrement à Kanban sans sprints pour s'adapter à la nature réactive du travail avec les clients.`,
    `D. Imposer une règle stricte de protection des sprints sans aucune exception — la discipline Agile est nécessaire pour retrouver la productivité.`
  ],
  correct:1,
  explication:`La réponse B est correcte. Ce cas illustre le principe que le cadre Agile doit être adapté au contexte réel — la "protection absolue du sprint" (D) peut être contre-productive quand les urgences client sont réelles et légitimes. La solution hybride "fast lane / planned lane" est une pratique éprouvée (utilisée notamment chez Spotify et d'autres) qui équilibre réactivité et planification. Le passage complet à Kanban (C) peut être une solution mais représente un changement de processus plus radical — la solution hybride permet une transition progressive.` },

{ id:"PR-011", domaine:"Processus", approche:"Prédictif", type:"standard",
  question:`Vous êtes chef de projet pour un programme de déploiement de bornes de recharge électrique (285 bornes, budget 12 M€, 18 mois). Au mois 12, votre fournisseur principal de bornes vous informe d'une pénurie mondiale de composants électroniques qui retardera sa livraison de 14 semaines. Cette pénurie était documentée dans les actualités industrielles depuis 6 mois mais n'avait pas été identifiée comme risque dans votre registre. Quelles sont les leçons à tirer et comment gérez-vous la situation immédiate ?`,
  options:[
    `A. Demander des pénalités au fournisseur pour le retard — c'est son équipement, sa responsabilité de gérer ses risques d'approvisionnement.`,
    `B. Pour la situation immédiate : évaluer les options alternatives (fournisseur secondaire, modèles de bornes alternatifs, déploiement partiel de bornes disponibles en stock) ; soumettre une demande de modification formelle au CCM pour réviser le calendrier avec les nouvelles données ; informer toutes les parties prenantes impactées (clients, collectivités, maître d'ouvrage) du retard et du nouveau calendrier prévisionnel. Pour les leçons : reconnaître que la veille des risques externes (marchés de composants, chaînes d'approvisionnement) aurait dû identifier cette tendance ; améliorer le processus d'identification des risques pour inclure une surveillance de l'environnement marché dans les futurs programmes.`,
    `C. Ignorer le retard et l'absorber en réduisant la portée (200 bornes au lieu de 285) pour rester dans le délai initial.`,
    `D. Demander une extension de délai au client sans proposer d'alternatives — la force majeure (pénurie mondiale) décharge votre responsabilité.`
  ],
  correct:1,
  explication:`La réponse B est correcte. Ce cas illustre une lacune dans le processus d'identification des risques — une information publique (pénurie documentée depuis 6 mois) aurait dû déclencher une analyse de risque. La gestion de la situation immédiate doit explorer toutes les alternatives avant de simplement annoncer un retard. La transparence avec toutes les parties prenantes impactées est obligatoire. La réduction de périmètre sans consultation (C) constitue un changement non autorisé. Invoquer la force majeure (D) est un dernier recours après épuisement de toutes les alternatives.` },

{ id:"PR-012", domaine:"Processus", approche:"Agile", type:"standard",
  question:`Vous gérez le développement d'une application mobile pour le commerce de détail. Lors du sprint planning du sprint 9, le Product Owner présente le backlog avec 12 user stories. L'équipe réalise que 3 de ces stories ont des dépendances techniques sur des fonctionnalités non encore développées (sprints futurs) et que 2 autres nécessitent des données de l'API d'un partenaire externe dont l'accès n'a pas encore été confirmé. Que faites-vous lors du sprint planning ?`,
  options:[
    `A. Accepter toutes les stories dans le sprint et gérer les dépendances et l'accès API au fur et à mesure pendant le sprint.`,
    `B. Appliquer la Définition de Prêt : les 3 stories avec dépendances techniques non résolues et les 2 stories avec accès API non confirmé ne respectent pas les critères d'acceptation en sprint planning ; les retirer du sprint courant et les remplacer par des stories du backlog qui respectent la Définition de Prêt ; pour les stories retirées, créer des tâches d'action spécifiques (résoudre les dépendances, confirmer l'accès API) à réaliser cette semaine pour permettre leur intégration dans le prochain sprint.`,
    `C. Demander à l'équipe de travailler sur les 7 stories sans dépendances en premier, puis d'intégrer les 5 autres si le temps le permet.`,
    `D. Reporter le sprint planning d'une semaine pour donner le temps de résoudre toutes les dépendances avant de planifier.`
  ],
  correct:1,
  explication:`La réponse B est correcte. La Définition de Prêt existe précisément pour éviter que des stories avec des bloqueurs identifiés entrent dans un sprint. Accepter des stories non prêtes (A) crée une vélocité imprévisible et génère des carrys-over. L'approche (B) d'exclure les stories bloquées et de les remplacer par des stories prêtes maximise la probabilité de succès du sprint. Les actions concrètes pour débloquer les stories retirées (résoudre dépendances, confirmer API) transforment le blocage en travail actionnable. Reporter le sprint (D) n'est pas nécessaire si d'autres stories prêtes sont disponibles.` },

{ id:"PR-013", domaine:"Processus", approche:"Prédictif", type:"standard",
  question:`Dans un projet de développement d'un nouveau produit chimique (7,4 M€, 28 mois), l'analyse de risques quantitative réalisée avec Monte Carlo donne les résultats suivants : probabilité de terminer le projet dans le délai prévu à 36 mois = 23 %, délai P50 (50 % de probabilité) = 41 mois, délai P80 (80 % de probabilité) = 46 mois. Le client insiste pour un engagement contractuel à 36 mois. Comment présentez-vous et gérez-vous cette situation ?`,
  options:[
    `A. Accepter l'engagement contractuel à 36 mois — l'analyse Monte Carlo est une prévision statistique, pas une certitude ; l'équipe fera de son mieux pour respecter le délai.`,
    `B. Présenter au client les résultats de l'analyse Monte Carlo de façon transparente : un délai contractuel de 36 mois n'a que 23 % de probabilité d'être respecté — c'est un risque inacceptable pour un engagement contractuel ; proposer un contrat à 41 mois (P50) avec clause d'incitation si livraison avant 41 mois, ou à 46 mois (P80) avec penalty réduit si retard — ou revoir le périmètre pour augmenter la probabilité de respecter 36 mois. Ne pas signer un contrat à 36 mois en ayant la preuve que la probabilité de tenue est de 23 %.`,
    `C. Signer le contrat à 36 mois et prévoir une réserve de management de 10 % pour compenser les risques — le Monte Carlo est connu pour ses résultats pessimistes.`,
    `D. Demander à l'équipe de l'analyse de risques de revoir leurs hypothèses pour obtenir un P80 proche de 36 mois avant de présenter les résultats au client.`
  ],
  correct:1,
  explication:`La réponse B est correcte. Signer un engagement contractuel avec 23 % de probabilité de respect constitue une tromperie envers le client (Code d'Éthique PMI — honnêteté). La simulation Monte Carlo est un outil quantitatif basé sur des données — modifier les hypothèses pour obtenir un résultat souhaité (D) serait une manipulation. La proposition de contrat à P50 ou P80 avec clauses d'incitation est une négociation équitable basée sur les données réelles. La réserve de management de 10 % (C) est notoirement insuffisante pour compenser un écart de probabilité de 23 % à 80 %.` },

{ id:"PR-014", domaine:"Processus", approche:"Agile", type:"standard",
  question:`Vous gérez un programme de développement logiciel en mode SAFe avec 4 équipes Agile. Lors du premier Program Board (tableau des dépendances inter-équipes), vous identifiez 28 dépendances entre les équipes pour le prochain Program Increment (PI). L'équipe A dépend de l'équipe B pour 8 composants, l'équipe C est en attente de 6 livraisons de l'équipe D. Lors du PI Planning, les 4 équipes ont du mal à s'accorder sur l'ordre de développement. Comment facilitez-vous la résolution de ces dépendances ?`,
  options:[
    `A. Laisser les équipes s'auto-organiser — dans SAFe, les équipes Agile sont responsables de résoudre leurs propres dépendances.`,
    `B. Faciliter une session dédiée de résolution des dépendances (Dependency Resolution Workshop) lors du PI Planning : visualiser toutes les dépendances sur le Program Board avec des fils de couleur, identifier les 5-8 dépendances les plus critiques (sur le chemin critique du programme), faciliter des négociations bilatérales entre les équipes concernées pour définir les interfaces et les dates de livraison, et attribuer un "dependency owner" pour chaque dépendance critique — en documentant les engagements dans le PI Plan.`,,
    `C. Éliminer les dépendances en redécoupant l'architecture pour rendre chaque équipe entièrement autonome.`,
    `D. Centraliser la gestion de toutes les dépendances auprès du Release Train Engineer qui sera le point de coordination unique entre toutes les équipes.`
  ],
  correct:1,
  explication:`La réponse B est correcte. Dans SAFe, les dépendances inter-équipes sont gérées via le Program Board et des négociations structurées lors du PI Planning — c'est précisément pourquoi cet événement existe. La session dédiée avec visualisation (fils de couleur sur le Program Board) et négociations bilatérales est la pratique SAFe standard. L'auto-organisation sans facilitation (A) fonctionne pour les dépendances simples mais pas pour 28 dépendances complexes. Éliminer les dépendances par refactoring architectural (C) est une solution à long terme pertinente mais pas pour le PI en cours. Centraliser la coordination (D) va à l'encontre de l'auto-organisation Agile.` },

{ id:"PR-015", domaine:"Processus", approche:"Prédictif", type:"standard",
  question:`Vous êtes chef de projet pour la rénovation d'un bâtiment classé monument historique (6,8 M€, 18 mois). En phase de démolition intérieure contrôlée, les ouvriers découvrent des fresques murales du XVIIe siècle sous plusieurs couches de peinture — non mentionnées dans les études préalables. La découverte crée une obligation légale de déclaration aux autorités patrimoniales et pourrait bloquer les travaux pendant 3 à 12 mois le temps d'une évaluation et d'une décision de conservation. Le maître d'ouvrage vous presse de "continuer les travaux discrètement" car il a des obligations de livraison. Quelle est votre décision ?`,
  options:[
    `A. Suivre la pression du maître d'ouvrage — il est responsable contractuel du bien et sa décision engage sa propre responsabilité, pas la vôtre.`,
    `B. Arrêter immédiatement les travaux dans la zone concernée, effectuer la déclaration obligatoire aux autorités patrimoniales dans les délais légaux, informer le maître d'ouvrage par écrit de l'obligation légale et des conséquences du non-respect (responsabilité pénale pour destruction de patrimoine culturel), analyser les options d'adaptation du planning (poursuite des travaux dans d'autres zones pendant l'évaluation patrimoniale) et mettre à jour le registre des risques avec ce nouvel événement.`,
    `C. Consulter un avocat spécialisé en droit du patrimoine pour confirmer l'obligation avant d'agir — vous voulez être sûr avant de bloquer les travaux.`,
    `D. Documenter la découverte par photos et continuer les travaux — si le maître d'ouvrage assume la responsabilité légale par écrit, vous êtes couvert.`
  ],
  correct:1,
  explication:`La réponse B est la seule légalement et éthiquement acceptable. La découverte de patrimoine culturel crée une obligation légale immédiate dans la quasi-totalité des pays — cette obligation ne peut pas être ignorée ou différée, même par décision du maître d'ouvrage. La destruction de fresques du XVIIe siècle constitue un délit pénal. Le chef de projet qui "ferme les yeux" devient complice. La poursuite des travaux dans d'autres zones pendant l'évaluation patrimoniale est une solution pragmatique qui minimise l'impact tout en respectant la loi. La couverture par écrit du maître d'ouvrage (D) ne protège pas contre la responsabilité pénale.` },

{ id:"PR-016", domaine:"Processus", approche:"Agile", type:"standard",
  question:`Lors d'un sprint review, vous présentez l'incrément développé au sponsor et aux parties prenantes clés. Le sponsor indique qu'il est "satisfait mais aurait aimé voir quelque chose de totalement différent". Après discussion, il apparaît que sa vision initiale du produit était fondamentalement différente de celle qui a été implémentée, bien que toutes les user stories formellement définies aient été livrées comme prévu. Quel est le problème fondamental et comment l'évitez-vous à l'avenir ?`,
  options:[
    `A. Le sponsor n'a pas relu attentivement les user stories — il est responsable des exigences qu'il a signées.`,
    `B. Identifier que ce cas illustre le problème de "complétude sans valeur" : l'équipe a livré exactement ce qui était demandé mais pas ce dont le sponsor avait besoin — l'écart entre les user stories écrites et la vision du produit n'a pas été suffisamment validé. Pour l'avenir : introduire des checkpoints de vision produit plus fréquents (product vision workshops, prototypes tôt, démos de concept avant le développement), améliorer les techniques d'élicitation des exigences (storyboards, exemples concrets, maquettes cliquables validées par le sponsor) et s'assurer que le sponsor est actif lors des revues de sprint, pas seulement à la fin.`,,
    `C. Demander au sponsor de signer les user stories pour s'assurer qu'il les a lues et approuvées avant chaque sprint.`,
    `D. Recommencer le projet depuis le début avec de meilleures spécifications — les exigences initiales étaient fondamentalement incorrectes.`
  ],
  correct:1,
  explication:`La réponse B est correcte. Ce problème classique ("build it right but build the wrong thing") est une défaillance de validation de la vision produit, pas seulement de la rédaction des user stories. Les user stories peuvent être précises tout en étant déconnectées de la vision globale du sponsor. La solution systémique est l'introduction de checkpoints de vision plus fréquents (prototypes tôt, maquettes cliquables) et l'implication active du sponsor dans les revues de sprint — pas seulement à la livraison finale. La signature des user stories (C) crée une fausse sécurité contractuelle sans garantie de compréhension partagée.` },

{ id:"PR-017", domaine:"Processus", approche:"Prédictif", type:"standard",
  question:`Vous gérez un programme de mise en place d'un système de gestion de l'eau dans une ville de 500 000 habitants (45 M€, 36 mois). L'analyse des risques a identifié un risque de sécheresse saisonnière pouvant réduire l'approvisionnement en eau brute pendant les travaux de 3 mois. La probabilité est estimée à 40 % et l'impact potentiel est un retard de 8 semaines et un surcoût de 450 000 € (approvisionnement alternatif en eau). Votre fournisseur d'assurance propose une police couvrant ce risque pour une prime annuelle de 85 000 €. Recommandez-vous de souscrire cette assurance et pourquoi ?`,
  options:[
    `A. Ne pas souscrire — le risque de 40 % est trop élevé pour être couvert à un prix acceptable et la prime de 85 000 € est trop chère.`,
    `B. Analyser par la VME : VME du risque = 0,40 × 450 000 € = 180 000 €. La prime d'assurance de 85 000 € est inférieure à la VME de 180 000 € — l'assurance est financièrement justifiée. De plus, l'assurance transforme un risque variable (0 à 450 000 €) en un coût certain (85 000 €) permettant une meilleure maîtrise budgétaire — recommander la souscription au comité de pilotage.`,
    `C. Souscrire uniquement si le programme ne dispose pas d'une réserve pour aléas suffisante pour absorber le risque.`,
    `D. Ne pas souscrire — les risques naturels sont des cas de force majeure que les assurances couvrent rarement complètement.`
  ],
  correct:1,
  explication:`La réponse B est correcte. L'analyse par la VME est l'outil standard de l'ECO PMP® 2026 (T3 — Risques) pour les décisions de transfert de risque. VME = 0,40 × 450 000 € = 180 000 €. La prime de 85 000 € est inférieure à la VME de 180 000 € — l'assurance est financièrement avantageuse sur une base actuarielle. L'avantage additionnel est la transformation d'un risque variable en coût certain, facilitant la gestion budgétaire. La condition de réserve (C) est un facteur à considérer mais ne remet pas en question l'analyse VME fondamentale.` },

{ id:"PR-018", domaine:"Processus", approche:"Agile", type:"standard",
  question:`Votre équipe Agile travaille sur une application de gestion de stock. Lors d'un sprint, un développeur identifie une faille de sécurité dans le code existant (injection SQL possible dans le module de recherche) — non planifiée dans le sprint en cours. La correction prendra 1,5 jours. Il hésite à l'intégrer car cela réduirait la vélocité du sprint et il ne veut "pas créer de problèmes". Comment gérez-vous cette situation ?`,
  options:[
    `A. Demander au développeur de ne pas intégrer la correction dans le sprint courant et de la planifier dans le prochain sprint via le processus normal de backlog.`,
    `B. Encourager le développeur à signaler immédiatement la faille (c'est la bonne décision) ; évaluer la sévérité de la faille avec l'équipe de sécurité ; si la faille est critique (accès potentiel aux données clients), la corriger immédiatement dans le sprint courant comme priorité de sécurité — la vélocité du sprint est secondaire face à un risque de sécurité ; documenter la correction comme un bug de sécurité et non une story standard ; mettre à jour le processus de revue de sécurité pour détecter ce type de faille plus tôt dans le cycle.`,
    `C. Demander au développeur de corriger la faille pendant ses heures personnelles pour ne pas affecter la vélocité du sprint.`,
    `D. Créer une user story "corriger l'injection SQL" dans le backlog et la prioriser dans le prochain sprint planning.`
  ],
  correct:1,
  explication:`La réponse B est correcte. Les failles de sécurité critiques ne peuvent pas attendre le prochain sprint — chaque jour de non-correction est un jour d'exposition potentielle des données clients. La vélocité du sprint est un indicateur de productivité, pas une fin en soi — elle ne peut pas justifier de laisser une faille de sécurité ouverte. Le comportement du développeur de vouloir signaler la faille mais d'hésiter par peur de "créer des problèmes" révèle un problème de culture d'équipe : les bonnes pratiques de sécurité doivent être encouragées et valorisées, pas découragées par la pression de la vélocité.` },

{ id:"PR-019", domaine:"Processus", approche:"Prédictif", type:"standard",
  question:`Dans un projet de développement de logiciels financiers (12 M€, 24 mois), vous avez réalisé une évaluation des risques quantitative. Le risque le plus critique identifié est la "défaillance de l'intégration avec le système bancaire legacy" avec une probabilité de 35 % et un impact de 2,8 M€ (retard de 4 mois + surcoût). Les stratégies de réponse évaluées sont : (R1) Atténuation : développer un middleware d'intégration robuste (coût : 340 000 €, réduit la probabilité à 12 %) ; (R2) Acceptation active : créer une réserve pour contingence de 980 000 € (probabilité reste à 35 %) ; (R3) Transfert : souscrire une assurance projet (prime : 180 000 €, couverture à 80 % de l'impact). Quelle stratégie recommandez-vous et pourquoi ?`,
  options:[
    `A. Recommander R2 (acceptation active) : la réserve de 980 000 € est la stratégie la moins chère à mettre en place.`,
    `B. Analyser par la VME et recommander R1 (atténuation) : VME initiale = 0,35 × 2,8 M€ = 980 000 €. Avec R1 : VME résiduelle = 0,12 × 2,8 M€ = 336 000 € (réduction de 644 000 €) pour un coût de 340 000 € — ROI positif (économie nette de 304 000 €). R1 est supérieure à R2 (coût identique mais réduction effective du risque) et à R3 (prime 180 000 € mais couverture partielle et probabilité inchangée). Recommander R1 avec une réserve résiduelle de 350 000 € pour le risque résiduel.`,
    `C. Recommander R3 (transfert) : l'assurance décharge l'organisation du risque financier pour seulement 180 000 €.`,
    `D. Combiner R1 et R3 pour maximiser la protection : développer le middleware ET souscrire l'assurance.`
  ],
  correct:1,
  explication:`La réponse B est correcte. L'analyse comparative par la VME est la méthode standard (ECO T3 — Risques) pour choisir entre stratégies de réponse. R1 (Atténuation) : coût 340 000 €, réduction de risque de 644 000 € → ROI positif de 304 000 €. R2 (Acceptation) : réserve 980 000 € sans réduction de risque → coût supérieur à R1. R3 (Transfert) : prime 180 000 € mais probabilité inchangée et couverture partielle (80 %) → VME résiduelle = 0,35 × 0,20 × 2,8 M€ = 196 000 € de risque non couvert. R1 est la stratégie économiquement optimale, complétée par une réserve pour le risque résiduel.` },

{ id:"PR-020", domaine:"Processus", approche:"Hybride", type:"standard",
  question:`Vous gérez un projet de déploiement d'un système de paiement mobile dans 3 pays d'Afrique subsaharienne (8,5 M€, 22 mois). Votre plan de qualité prévoit des tests d'acceptation utilisateur (UAT) à la fin de chaque phase de déploiement pays. Lors des UAT au premier pays (Ghana), vous découvrez que 34 % des transactions échouent en cas de faible connectivité réseau — une condition très fréquente dans les zones rurales qui représentent 60 % de votre cible. Ce problème n'avait pas été identifié lors des tests techniques en laboratoire. Comment gérez-vous cette découverte et son impact sur les déploiements dans les 2 autres pays ?`,
  options:[
    `A. Déployer dans les 2 autres pays comme prévu et corriger le problème de connectivité dans une version 2.0 — les délais contractuels ne permettent pas d'attendre.`,
    `B. Suspendre le déploiement dans les 2 autres pays jusqu'à la correction du problème de connectivité ; analyser la cause profonde (architecture ne gérant pas le mode offline, protocoles de reprise de transaction insuffisants) ; développer et tester une correction avant tout nouveau déploiement ; réviser le plan de test pour inclure des tests de réseau dégradé dans les futurs UAT ; informer le client et les autorités régulatrices des pays concernés de la situation et du délai de correction — avec un plan de déploiement révisé réaliste.`,
    `C. Déployer dans les 2 autres pays uniquement dans les zones urbaines avec bonne connectivité et exclure les zones rurales du premier déploiement.`,
    `D. Demander à l'opérateur réseau de garantir une meilleure couverture dans les zones rurales avant le déploiement — le problème est une infrastructure réseau insuffisante, pas l'application.`
  ],
  correct:1,
  explication:`La réponse B est correcte. Un taux d'échec de 34 % dans les conditions réelles d'usage (faible connectivité) est un défaut critique qui compromet l'utilité du produit pour 60 % de la cible. Déployer avec un tel défaut connu dans les 2 autres pays (A) serait imprudent et potentiellement trompeur pour les utilisateurs et les régulateurs. La correction et la révision des processus de test (inclure des tests de réseau dégradé) sont des mesures d'amélioration systémique. La communication transparente avec le client et les régulateurs est une obligation éthique et légale. Le déploiement urbain uniquement (C) dénature fondamentalement l'objectif d'inclusion financière du projet.` },

{ id:"PR-021", domaine:"Processus", approche:"Prédictif", type:"standard",
  question:`Vous êtes chef de projet pour la construction d'une usine de production de vaccins (76 M€, 42 mois). Votre plan d'approvisionnement prévoit un seul fournisseur qualifié pour un équipement de stérilisation critique (délai de fabrication : 9 mois, livraison critique au mois 28). Au mois 18, votre fournisseur vous informe qu'il a été racheté par un concurrent et que la qualification de l'équipement devra être refaite selon les nouvelles normes de l'acheteur — ce qui repoussera la livraison de 5 mois (mois 33 au lieu de 28). Comment gérez-vous cette situation ?`,
  options:[
    `A. Accepter le retard de 5 mois et l'intégrer dans le planning — les changements de propriété des fournisseurs sont des événements imprévus hors de contrôle.`,
    `B. Évaluer immédiatement l'impact sur le chemin critique et le délai global (un retard de 5 mois sur l'équipement critique crée probablement un retard similaire sur la mise en service de l'usine) ; explorer toutes les alternatives : fournisseur secondaire (délai de qualification ?), équipement d'occasion qualifié, négociation avec le nouveau propriétaire pour accélérer la requalification ; activer la clause contractuelle de changement de contrôle du contrat fournisseur si elle existe ; informer le client/maître d'ouvrage du risque et des options en cours d'évaluation — avec une mise à jour du planning révisée dans 2 semaines.`,
    `C. Imposer au fournisseur de respecter le délai contractuel initial de 9 mois sous peine de pénalités — le changement de propriétaire ne modifie pas les obligations contractuelles.`,
    `D. Suspendre le projet pendant 5 mois le temps que la situation fournisseur se clarifie avant de prendre une décision.`
  ],
  correct:1,
  explication:`La réponse B est correcte. La gestion de la chaîne d'approvisionnement (ECO T5 — Achats) dans un contexte de perturbation fournisseur exige une évaluation immédiate de l'impact sur le chemin critique et l'exploration active de toutes les alternatives. Dans une usine pharmaceutique, les équipements de stérilisation sont soumis à des qualifications réglementaires strictes (FDA, EMA) — "forcer" le fournisseur (C) ne résout pas le problème de requalification qui est une obligation réglementaire indépendante de la relation contractuelle. La suspension du projet (D) est disproportionnée. La clause contractuelle de changement de contrôle est un mécanisme de protection à activer immédiatement.` },

{ id:"PR-022", domaine:"Processus", approche:"Agile", type:"standard",
  question:`Vous êtes chef de projet d'un programme de développement d'une plateforme de formation en ligne. Le release manager vous informe que pour une raison technique, le dernier déploiement en production a accidentellement supprimé les données de progression de 2 400 utilisateurs (cours terminés, certificats obtenus, notes de cours). Une sauvegarde existe mais avec 6 heures de décalage — environ 3-4 % des données ne peuvent pas être récupérées. Les utilisateurs ne sont pas encore informés. Quelle est votre décision et votre plan d'action ?`,
  options:[
    `A. Restaurer silencieusement les données depuis la sauvegarde sans informer les utilisateurs — 96 % des données seront récupérées et la plupart ne remarqueront pas les 4 % manquants.`,
    `B. Restaurer immédiatement les données depuis la sauvegarde (6 heures de décalage) ; communiquer proactivement et honnêtement avec les 2 400 utilisateurs impactés sur ce qui s'est passé, ce qui a été récupéré et ce qui ne l'a pas été ; pour les utilisateurs ayant perdu des données non récupérables (certificats, progressions récentes), proposer des solutions de compensation (recertification gratuite, prolongation d'accès, reconstitution manuelle via logs serveur si possible) ; analyser la cause profonde de l'incident et renforcer les procédures de déploiement et de sauvegarde.`,
    `C. Ne restaurer que les données des utilisateurs qui signalent activement un problème — cette approche pragmatique limite la perturbation pour les utilisateurs qui ne remarquent rien.`,
    `D. Demander à l'équipe juridique d'évaluer la responsabilité légale avant de communiquer avec les utilisateurs — la communication doit être validée juridiquement.`
  ],
  correct:1,
  explication:`La réponse B est correcte. La communication proactive et honnête est une obligation éthique et, selon le RGPD et équivalents, souvent une obligation légale (notification des violations de données). Restaurer silencieusement (A) prive les utilisateurs qui ont perdu des données non récupérables de la possibilité d'obtenir une compensation. La compensation proactive pour les données perdues démontre la responsabilité organisationnelle. Attendre les signalements (C) laisse les utilisateurs avec des données incorrectes sans le savoir. La consultation juridique (D) est pertinente mais ne justifie pas de retarder la restauration et la communication — les deux peuvent se faire en parallèle.` },

{ id:"PR-023", domaine:"Processus", approche:"Prédictif", type:"standard",
  question:`Votre projet de développement d'un nouveau système de contrôle aérien (230 M€, 60 mois) est à mi-parcours. L'EVM donne : BAC = 230 M€, VA = 98 M€, VP = 115 M€, CR = 112 M€. Une alternative de compression de planning a été étudiée — fast-tracking de 3 sous-systèmes qui pourraient être développés en parallèle plutôt qu'en séquence, réduisant le planning de 6 mois. Le risque identifié est une probabilité de 45 % d'introduction de défauts d'intégration nécessitant 8 mois de correction si le problème se matérialise. Analysez et recommandez.`,
  options:[
    `A. Recommander le fast-tracking — la réduction de 6 mois est significative et la probabilité de 45 % de problèmes est gérable.`,
    `B. Calculer les indicateurs EVM et analyser la VME du fast-tracking : IPC-Cal = 0,85 (retard de 15 %), IPC-C = 0,875 (surcoût de 12,5 %). Le fast-tracking sauve 6 mois mais crée une VME de risque = 0,45 × 8 mois de correction = 3,6 mois en espérance — le gain net attendu est seulement de 6 - 3,6 = 2,4 mois. Dans un système de contrôle aérien où les défauts d'intégration peuvent avoir des conséquences sécurité critiques, la probabilité de 45 % de problèmes est inacceptable même pour un gain de 2,4 mois. Recommander de ne pas fast-tracker et d'explorer d'autres options de compression (crashing sur les activités à faible risque).`,
    `C. Recommander le fast-tracking avec une réserve de contingence de 90 M€ (8 mois × coût mensuel) pour couvrir le risque potentiel.`,
    `D. Recommander d'attendre le résultat des 2 prochains mois avant de décider du fast-tracking — une décision sur la base des tendances actuelles est prématurée.`
  ],
  correct:1,
  explication:`La réponse B est correcte. L'analyse combine EVM et VME pour une décision éclairée. IPC-Cal = 98/115 = 0,85 (retard). IPC-C = 98/112 = 0,875 (surcoût). La VME du fast-tracking : gain de 6 mois mais risque de 0,45 × 8 mois = 3,6 mois en espérance, soit un gain net de 2,4 mois seulement. Dans un système de contrôle aérien, les défauts d'intégration touchent directement à la sécurité des vols — le niveau de risque de 45 % est clairement inacceptable dans ce contexte, quelle que soit l'analyse quantitative. La réserve de contingence (C) ne résout pas le problème de sécurité — elle ne fait que le financer.` },

{ id:"PR-024", domaine:"Processus", approche:"Agile", type:"standard",
  question:`Dans une équipe Scrum qui développe une application de santé connectée, l'équipe utilise une Définition de Fini (DoD) qui inclut "tests unitaires avec couverture ≥ 80 %" et "revue de code par un pair". Lors du sprint 12, sous pression pour livrer une fonctionnalité critique dans le délai du sprint, un développeur propose de "baisser temporairement" le seuil de couverture à 60 % pour cette story et de faire la revue de code le sprint suivant. Le Scrum Master est en réunion et le Product Owner dit "d'accord si ça permet de livrer à temps". Que doit faire l'équipe ?`,
  options:[
    `A. Accepter la proposition — le PO a l'autorité sur les décisions de livraison et la flexibilité dans les standards est parfois nécessaire.`,
    `B. Refuser de baisser la DoD en dehors du processus formel ; si la story ne peut pas être complétée selon la DoD dans ce sprint, elle ne sera pas considérée comme "Done" et passera au sprint suivant — la DoD est un engagement collectif de l'équipe et ne peut être modifiée unilatéralement par un développeur et le PO en l'absence du Scrum Master ; si l'équipe considère que la DoD est trop exigeante, elle devra être révisée lors d'une rétrospective avec l'ensemble de l'équipe.`,,
    `C. Accepter de baisser temporairement la couverture mais insister sur la revue de code immédiate.`,
    `D. Appeler le Scrum Master immédiatement pour qu'il arbitre — aucune décision ne peut être prise sur la DoD en son absence.`
  ],
  correct:1,
  explication:`La réponse B est correcte. La Définition de Fini est un accord collectif de l'équipe — elle ne peut pas être modifiée unilatéralement pendant un sprint par un sous-ensemble de l'équipe (développeur + PO) sans le Scrum Master. Si la story ne peut pas être complétée selon la DoD dans ce sprint, elle doit être reportée au sprint suivant. Baisser les standards sous pression est précisément le type de décision que la DoD est censée prévenir. Si la DoD est perçue comme trop exigeante, la voie correcte est une révision formelle en rétrospective. Une application de santé connectée avec couverture de tests insuffisante crée des risques de sécurité médicale.` },

{ id:"PR-025", domaine:"Processus", approche:"Prédictif", type:"standard",
  question:`Vous êtes chef de projet pour la rénovation d'une chaîne de production alimentaire (18 M€, 22 mois). Au mois 14, vous réalisez que la phase "test et mise en service" (mois 16-18) a été sous-estimée par votre équipe lors de la planification initiale : elle nécessitera 5 mois au lieu de 3. Cela crée un retard de 2 mois sur la date de mise en service finale. Le contrat avec le client prévoit une pénalité de 80 000 € par semaine de retard au-delà de la date prévue. Quand et comment informez-vous le client ?`,
  options:[
    `A. Attendre la fin du mois 15 pour avoir plus de certitude sur le retard avant d'informer le client — communiquer trop tôt sur une information incertaine crée une alarme inutile.`,
    `B. Informer le client immédiatement (vous êtes au mois 14, la mise en service est prévue au mois 18 — il reste 4 mois) : préparer une présentation factuelle du problème identifié, de sa cause, de l'impact estimé (2 mois de retard = 8 semaines × 80 000 € = 640 000 € de pénalité potentielle), et des options disponibles (accélération de la phase test, ressources additionnelles, révision de périmètre) ; permettre au client de participer aux décisions pour minimiser l'impact — informer tôt préserve la relation et laisse plus d'options.`,
    `C. Tenter d'abord de rattraper le retard en ajoutant des ressources sans en informer le client — si vous réussissez, la situation se régule seule.`,
    `D. Informer le client seulement si les tentatives de rattrapage échouent — la communication proactive de mauvaises nouvelles non confirmées nuit à votre crédibilité.`
  ],
  correct:1,
  explication:`La réponse B est correcte. La communication proactive des risques identifiés est une obligation éthique et professionnelle (Code d'Éthique PMI). Informer le client au mois 14 d'un problème qui affectera le mois 18 lui laisse 4 mois pour coopérer à la solution — ce qui est bien plus favorable que d'attendre. La pénalité de 640 000 € potentielle est un enjeu financier majeur que le client doit connaître le plus tôt possible. Attendre (A, D) ou tenter de résoudre en cachette (C) sont des comportements qui endommagent la confiance client quand le problème finit par être révélé — et le client aurait pu avoir des options à mois 14 qu'il n'a plus à mois 17.` },

{ id:"PR-026", domaine:"Processus", approche:"Agile", type:"standard",
  question:`Vous êtes chef de projet d'un programme de développement de contenu éducatif numérique. Le Product Owner souhaite calculer la prévision de date de livraison du backlog restant. Il dispose des données de vélocité des 8 derniers sprints (en story points) : 38, 42, 35, 44, 40, 37, 43, 41. Le backlog restant contient 280 story points. Les sprints durent 2 semaines. Quelle est la meilleure estimation de la date de livraison et quelle fourchette d'incertitude présentez-vous ?`,
  options:[
    `A. Date unique : 280 / 40 = 7 sprints = 14 semaines. Présenter cette date au client comme engagement ferme.`,
    `B. Calculer la vélocité moyenne (320/8 = 40 pts/sprint) et l'écart-type (σ ≈ 3,1 pts) pour construire une fourchette : prévision centrale = 280/40 = 7 sprints = 14 semaines ; fourchette pessimiste (vélocité moyenne - 1σ = 36,9 pts) = 280/36,9 = 7,6 sprints ≈ 15-16 semaines ; fourchette optimiste (vélocité + 1σ = 43,1 pts) = 280/43,1 = 6,5 sprints ≈ 13 semaines. Présenter la fourchette de 13 à 16 semaines avec une prévision centrale de 14 semaines — permettre au PO de décider du niveau de risque qu'il veut prendre pour ses engagements.`,
    `C. Calculer uniquement sur la base de la vélocité minimale observée (35 pts) pour avoir un engagement conservateur : 280/35 = 8 sprints = 16 semaines.`,
    `D. Refuser de fournir une estimation de date ferme en Agile — les projections de livraison ne peuvent pas être fiables et créent des engagements irréalistes.`
  ],
  correct:1,
  explication:`La réponse B est correcte. La prévision de release en Agile doit combiner une estimation centrale (vélocité moyenne) avec une fourchette d'incertitude (basée sur la variabilité historique). La vélocité moyenne de 40 pts/sprint et l'écart-type de 3,1 pts permettent de construire une fourchette probabiliste de 13 à 16 semaines. Présenter une date unique (A) sans fourchette crée une fausse précision. La fourchette permet au PO de prendre une décision consciente sur le risque d'engagement. Refuser toute estimation (D) est non professionnel — les parties prenantes ont besoin de visibilité sur la livraison.` },

{ id:"PR-027", domaine:"Processus", approche:"Prédictif", type:"standard",
  question:`Vous gérez un projet de construction d'une clinique vétérinaire privée (3,2 M€, 12 mois). Au mois 7, un problème survient sur le système de ventilation des salles opératoires — le sous-traitant CVC a mal interprété les spécifications et a installé un système de 8 000 m³/h au lieu des 12 000 m³/h requis (normes vétérinaires pour les salles stériles). Le remplacement coûterait 95 000 € et prendrait 4 semaines. Le sous-traitant CVC argue qu'il a "suivi les plans fournis" qui contenaient effectivement une erreur. Votre bureau d'études reconnaît l'erreur dans les plans. Comment résolvez-vous ce conflit de responsabilité ?`,
  options:[
    `A. Faire payer l'intégralité des 95 000 € au sous-traitant CVC — en tant que professionnel, il aurait dû identifier l'incohérence entre les plans et les normes applicables.`,
    `B. Reconnaître que la responsabilité est partagée (erreur de plans du bureau d'études + non-vérification des normes applicables par le CVC) ; engager une discussion constructive entre les trois parties (maître d'ouvrage, bureau d'études, CVC) pour partager équitablement le coût de correction selon la responsabilité respective ; procéder immédiatement à la correction pour ne pas bloquer le projet en attente de l'arbitrage financier — et finaliser l'accord de répartition en parallèle.`,
    `C. Faire payer l'intégralité des 95 000 € au bureau d'études — l'erreur est dans les plans qu'il a produits.`,
    `D. Payer les 95 000 € sur le budget projet sans chercher de responsabilité — les arbitrages entre parties prenantes risquent de retarder la correction et compromettre le planning.`
  ],
  correct:1,
  explication:`La réponse B est correcte. Ce cas de responsabilité partagée illustre la gestion des contrats et des réclamations (ECO T5 — Achats). Dans un projet de construction, la responsabilité pour une non-conformité peut être distribuée entre plusieurs acteurs. La priorité opérationnelle est de corriger l'installation (les salles stériles doivent respecter les normes vétérinaires) sans attendre l'arbitrage financier. La répartition du coût se fait selon les responsabilités respectives documentées — le bureau d'études pour l'erreur de plans, le CVC pour ne pas avoir vérifié les normes applicables. Aucune partie ne supporte l'intégralité seule.` },

{ id:"PR-028", domaine:"Processus", approche:"Agile", type:"standard",
  question:`Lors d'un sprint retrospective, l'équipe identifie que les user stories épiques doivent être décomposées en stories plus petites avant le sprint planning. L'équipe décide d'introduire une cérémonie de "Backlog Refinement" hebdomadaire de 1 heure. Après 4 semaines, la qualité des stories en sprint planning s'est effectivement améliorée mais les membres de l'équipe se plaignent que les réunions totales (mêlée, planning, review, rétrospective + refinement) occupent maintenant 25 % de leur temps de sprint. Comment évaluez-vous cette situation ?`,
  options:[
    `A. Accepter le ratio de 25 % de réunions — les cérémonies Agile sont nécessaires et ce niveau est dans la norme.`,
    `B. Évaluer si la valeur apportée par le refinement justifie le temps investi : si la qualité des stories s'est améliorée (moins de reprises, moins de carry-overs), le ROI peut être positif même à 25 % de temps de réunion. Cependant, explorer des optimisations : refinement asynchrone pour la partie documentaire (les membres préparent leurs questions avant la réunion), réduction de la durée de la mêlée si elle est redondante avec le refinement, et vérifier si 1h/semaine est nécessaire ou si 45 min tous les 10 jours serait suffisant — l'objectif n'est pas de minimiser les réunions mais d'optimiser le ratio valeur/coût.`,
    `C. Supprimer le refinement hebdomadaire car 25 % de temps de réunion est clairement excessif — l'amélioration de la qualité des stories ne justifie pas ce coût.`,
    `D. Maintenir le refinement exactement tel quel — toute modification risque de dégrader la qualité des stories obtenue depuis 4 semaines.`
  ],
  correct:1,
  explication:`La réponse B est correcte. La question n'est pas si 25 % est trop ou pas assez — c'est si la valeur créée justifie le coût. Le Scrum Guide recommande environ 10 % de la capacité de sprint pour le refinement comme guideline (mais non comme règle absolue). L'évaluation doit être basée sur le ROI mesurable (moins de reprises, stories mieux définies) et l'exploration d'optimisations (asynchrone, fréquence ajustée). Supprimer le refinement (C) risque de perdre les gains obtenus. Le maintien rigide (D) ferme la porte à l'amélioration continue.` },

{ id:"PR-029", domaine:"Processus", approche:"Prédictif", type:"standard",
  question:`Vous êtes directeur de programme pour un programme d'infrastructure de transport de 320 M€ sur 6 ans. Un rapport d'avancement trimestriel doit être soumis au bailleur de fonds international. Vos données EVM montrent : IPC-Cal = 0,78 (retard de 22 %), IPC-C = 0,91 (surcoût de 9 %). L'EAC recalculé est de 352 M€ (dépassement de 32 M€). Votre équipe suggère de "rebasaligner" le planning (créer un nouveau planning de référence plus réaliste) sans en informer le bailleur pour "améliorer les indicateurs". Comment répondez-vous ?`,
  options:[
    `A. Accepter le rebasalinement — un planning de référence plus réaliste permettra un meilleur pilotage du programme.`,
    `B. Refuser le rebasalinement non autorisé : il s'agirait d'une manipulation des données de performance qui tromperait le bailleur de fonds sur la situation réelle du programme. Si une révision du planning de référence est justifiée (périmètre modifié, changements approuvés), elle doit passer par un processus de maîtrise intégrée des modifications avec approbation formelle du bailleur. Le rapport trimestriel doit présenter honnêtement les données EVM actuelles avec une analyse causale des écarts et un plan d'action correctif crédible.`,
    `C. Rebasaligner uniquement le planning (pas le budget) pour améliorer l'IPC-Cal tout en gardant l'IPC-C visible.`,
    `D. Inclure le rebasalinement dans le rapport en le présentant comme une "mise à jour de référence de management" — une pratique courante dans les programmes de grande envergure.`
  ],
  correct:1,
  explication:`La réponse B est correcte. Un rebasalinement non autorisé constitue une manipulation des données de performance qui trompe le bailleur sur la situation réelle — c'est une violation grave du Code d'Éthique PMI (honnêteté, transparence). Dans un programme financé par un bailleur international, cette pratique peut constituer une fraude. La solution n'est pas de masquer les mauvaises performances mais de les expliquer honnêtement et de présenter un plan correctif crédible. Si des changements approuvés justifient une révision du planning, le processus formel de modification avec accord du bailleur est la voie correcte.` },

{ id:"PR-030", domaine:"Processus", approche:"Agile", type:"standard",
  question:`Votre équipe Agile de 8 développeurs travaille sur une application de gestion de flotte. Lors du sprint 10, vous découvrez que deux développeurs ont introduit des architectures techniques divergentes pour le même module — sans coordination préalable. Les deux approches sont techniquement valables mais incompatibles entre elles, et la refactorisation pour harmoniser les deux prendra 3 jours. Comment évitez-vous ce type de situation à l'avenir tout en gérant l'incident actuel ?`,
  options:[
    `A. Traiter immédiatement l'incident (1 développeur refactorise pendant que l'autre continue une autre story) et ajouter une règle "toutes les décisions architecturales doivent être validées par le tech lead avant implémentation".`,,
    `B. Pour l'incident immédiat : faire décider à l'équipe (pas uniquement au tech lead) laquelle des deux approches est la meilleure pour le long terme, allouer 3 jours pour la refactorisation, et traiter cela comme un coût d'apprentissage documenté dans la rétrospective. Pour l'avenir : introduire une pratique d'Architecture Decision Records (ADR) — documents courts décrivant les décisions architecturales importantes, leur contexte et leurs implications — partagés dans le repository de code et discutés brièvement en équipe avant implémentation ; des pratiques de mob programming pour les décisions architecturales complexes.`,
    `C. Désigner un architecte solution dédié qui devra valider toutes les décisions techniques avant implémentation — supprimer l'autonomie architecturale de l'équipe.`,
    `D. Accepter les deux approches et laisser l'équipe gérer la divergence progressivement au fil des sprints — la cohérence architecturale se consolidera naturellement.`
  ],
  correct:1,
  explication:`La réponse B est correcte. L'incident est d'abord traité collectivement (décision d'équipe sur l'approche à conserver), puis transformé en amélioration systémique. Les ADR (Architecture Decision Records) sont une pratique Agile mature qui crée une mémoire architecturale sans nécessiter une validation centralisée par un "gatekeeper". Le mob programming pour les décisions complexes favorise l'alignement naturel sans bureaucratie. La centralisation sur un architecte (C) crée un goulot et contredit l'auto-organisation Agile. Laisser diverger (D) crée une dette architecturale croissante.` },,
// ── ÉTUDE DE CAS EC4 ──────────────────────────────────────────────
{ id:"EC4-Q1", domaine:"Environnement d'affaires", approche:"Hybride", type:"etude-de-cas",
  etudeDeCas:{ id:"EC4",
    titre:"Étude de cas : Programme de transformation — Groupe PanAfrica Assurances",
    contexte:`PanAfrica Assurances est un groupe régional dans 9 pays africains (4 200 employés). Programme "Vision 2028" de 47 M€ sur 36 mois : (1) unifier les 9 SI nationaux, (2) déployer une souscription automatisée par IA, (3) passer à un modèle omnicanal, (4) conformité aux directives CIMA 2026. Vous êtes Directeur de Programme mandaté par le PDG. Au mois 18, cinq crises simultanées : (A) La filiale Sénégal veut rester indépendante techniquement — compromet l'architecture unifiée. (B) Le régulateur CIMA impose des exigences de cybersécurité additionnelles (délai 6 mois) non prévues. (C) Un audit externe identifie un biais discriminatoire dans l'algorithme de souscription IA (taux de refus 2,3x supérieur pour les 25-35 ans sans justification actuarielle). (D) Deux chefs de projet de flux démissionnent avec 1 mois de préavis. (E) Réalisation des bénéfices à mi-programme : 34 % seulement (objectif 55 %).` },
  question:`Face à ces cinq crises simultanées, vous avez 72 heures avant le comité de pilotage extraordinaire convoqué par le PDG. Quelle est votre priorisation et votre plan d'action structuré ?`,
  options:[
    `A. Présenter les 5 crises simultanément au comité en demandant au PDG de prioriser lui-même — il a seul l'autorité et la vision stratégique.`,
    `B. Structurer le comité autour d'une priorisation par impact immédiat et irréversibilité : (1) Biais IA [C] — suspendre immédiatement les décisions automatisées pour ce segment (éthique + légal non négociable) ; (2) Conformité CIMA [B] — plan de mise en conformité 6 mois avec ressources additionnelles (obligation réglementaire) ; (3) Démissions [D] — plan de continuité d'urgence et identification des remplaçants ; (4) Résistance Sénégal [A] — plan de négociation avec compromis d'architecture possibles ; (5) Bénéfices [E] — analyse des causes et plan correctif. Présenter les impacts financiers et délais de chaque crise avec des options de réponse.`,
    `C. Recommander au PDG de suspendre le programme pendant 3 mois pour stabiliser la situation — gérer 5 crises simultanément est irréaliste.`,
    `D. Traiter les crises dans l'ordre chronologique d'apparition : d'abord la résistance Sénégal (plus ancienne), puis CIMA, biais IA, démissions et bénéfices.`
  ],
  correct:1,
  explication:`La réponse B est correcte. La priorisation en situation de crise multi-facteurs suit une logique d'impact-irréversibilité, pas d'ancienneté (D). Le biais IA (C) est en première priorité car des décisions discriminatoires actives causent un préjudice à chaque instant de continuité — éthiquement inacceptable et potentiellement illégal. La conformité CIMA (B) a une deadline fixe. Les démissions (D) menacent la capacité opérationnelle immédiate. La résistance Sénégal (A) nécessite une négociation stratégique mais n'est pas encore une impasse. Les bénéfices (E) sont préoccupants mais non urgents à 72h.` },

{ id:"EC4-Q2", domaine:"Environnement d'affaires", approche:"Hybride", type:"etude-de-cas",
  etudeDeCas:{ id:"EC4" },
  question:`L'audit externe documente que l'algorithme de souscription IA refuse automatiquement 38 % des demandes de la tranche 25-35 ans contre 16,5 % en moyenne globale — sans justification actuarielle. Votre data scientist estime que le biais provient de la sous-représentation historique de ce segment dans les souscripteurs (biais de données d'entraînement) + variables proxy socio-économiques corrélées à l'âge. Comment gérez-vous la correction de ce biais ?`,
  options:[
    `A. Désactiver définitivement l'IA de souscription et revenir entièrement à la souscription manuelle — le risque de biais est trop élevé pour continuer.`,
    `B. Mettre en place un processus de correction en 4 phases : Phase 1 (0-4 sem.) — suspendre l'automatisation pour la tranche 25-35 ans, passer en revue humaine systématique, analyser l'impact rétrospectif sur les dossiers rejetés ; Phase 2 (4-12 sem.) — re-entraînement du modèle avec techniques de débiaisage, audit du modèle corrigé par le cabinet externe ; Phase 3 (12-16 sem.) — déploiement progressif avec monitoring des indicateurs de biais en temps réel ; Phase 4 (continu) — gouvernance IA avec comité d'éthique algorithmique et revue semestrielle. Documenter pour le régulateur CIMA.`,
    `C. Ajouter une règle de surclassement manuel pour la tranche 25-35 ans sans modifier l'algorithme — solution rapide corrigeant l'effet sans refonte technique.`,
    `D. Informer le régulateur CIMA et attendre ses instructions avant toute action corrective — agir sans mandat réglementaire pourrait être mal interprété.`
  ],
  correct:1,
  explication:`La réponse B est correcte. La correction d'un biais algorithmique nécessite une approche systémique en 4 phases. La revue rétrospective des dossiers rejetés (Phase 1) est une obligation éthique — les candidats discriminés ont potentiellement subi un préjudice. Le re-entraînement avec techniques de débiaisage (Phase 2) traite la cause racine. Le monitoring continu et la gouvernance IA formalisée créent la résilience systémique. La désactivation définitive (A) est excessive. La règle de surclassement (C) est acceptable temporairement mais ne corrige pas le biais systémique. Attendre le régulateur (D) sans agir alors que des décisions discriminatoires sont en cours serait une négligence.` },

// ── Questions Environnement d'affaires indépendantes ───────────────
{ id:"EA-001", domaine:"Environnement d'affaires", approche:"Prédictif", type:"standard",
  question:`Vous êtes chef de projet pour un programme de déploiement d'énergie solaire (18 M€, 24 mois) co-financé par un bailleur international (70 %) et le gouvernement national (30 %). Au mois 16, vous recevez simultanément : (1) un audit du bailleur identifiant que 12 % des équipements ne respectent pas les standards qualité ; (2) une directive du ministre pour accélérer le déploiement dans sa région d'origine ; (3) un rapport HSE signalant 3 quasi-accidents lors d'installations en hauteur avec des équipements insuffisants ; (4) une hausse de 18 % du prix des panneaux solaires affectant les commandes restantes. Présentez votre priorisation justifiée.`,
  options:[
    `A. Priorité : (1) directive ministérielle — le gouvernement est co-financeur et la réactivité protège la relation politique ; (2) quasi-accidents HSE ; (3) non-conformité équipements ; (4) hausse des prix.`,
    `B. Priorité et justifications : (1) Quasi-accidents HSE — la sécurité des travailleurs est une obligation légale absolue ; suspendre immédiatement les activités à risque jusqu'à audit HSE et formation ; (2) Non-conformité équipements — informer proactivement le bailleur et proposer un plan correctif avant que l'audit ne devienne officiel (transparence = crédibilité) ; (3) Hausse des prix — soumettre une demande de modification budgétaire documentée au bailleur ; (4) Directive ministérielle — analyser l'impact et présenter au comité de pilotage les options légales de révision du périmètre sans s'engager unilatéralement.`,
    `C. Traiter tous les problèmes en parallèle en déléguant chaque problème au responsable fonctionnel concerné et consolider un rapport dans 2 semaines.`,
    `D. Demander une réunion d'urgence avec le bailleur et le gouvernement pour un arbitrage conjoint sur les priorités — seuls les co-financeurs ont l'autorité pour décider.`
  ],
  correct:1,
  explication:`La réponse B est correcte. La priorisation suit une logique d'obligations légales et éthiques (HSE > conformité contractuelle > finances > périmètre politique). Les quasi-accidents HSE sont des indicateurs avancés d'accident grave imminent — la sécurité des travailleurs prime toute autre considération. La transparence proactive avec le bailleur sur la non-conformité (avant que l'audit ne soit officiel) préserve la confiance. La directive ministérielle est un changement de périmètre qui doit passer par la gouvernance formelle.` },

{ id:"EA-002", domaine:"Environnement d'affaires", approche:"Hybride", type:"standard",
  question:`En tant que chef de programme pour la transformation numérique d'une chaîne de 12 supermarchés (8,4 M€), vous présentez l'état du programme au conseil d'administration à 6 mois de la fin. Données : 78 % des fonctionnalités livrées (cible 85 %), adoption des outils par les employés 52 % (cible 75 %), économies de 340 000 € (cible 450 000 €), NPS client +8 points (cible +15). Mais les 2 magasins pilotes affichent 91 % d'adoption et des résultats dépassant les cibles ; les 10 autres sont à 38 %. Comment présentez-vous honnêtement cette situation au CA ?`,
  options:[
    `A. Présenter uniquement les indicateurs positifs (2 magasins pilotes exemplaires, 340 k€ d'économies) et indiquer que le programme est "globalement sur la bonne voie".`,,
    `B. Présenter une analyse complète et honnête : tous les indicateurs avec les gaps clairement documentés ; analyse causale de l'écart d'adoption (corrélation entre management local et intensité de l'accompagnement au changement) ; plan correctif concentrant les ressources sur les 10 magasins en retard ; révision des prévisions de bénéfices finaux avec scénarios optimiste/réaliste/pessimiste — pour que le CA puisse décider en toute connaissance de cause.`,
    `C. Demander un report de 3 mois de la présentation au CA pour disposer de données plus complètes après intensification du déploiement.`,
    `D. Recommander d'arrêter le programme dans les 10 magasins en retard et de le considérer comme un succès partiel sur la base des 2 magasins pilotes.`
  ],
  correct:1,
  explication:`La réponse B est correcte. Le Code d'Éthique PMI (responsabilité et honnêteté) exige une transparence totale dans les rapports aux organes de gouvernance. La présentation sélective (A) constitue une tromperie par omission. L'analyse comparative des 2 pilotes vs les 10 autres révèle que l'écart d'adoption est lié aux facteurs de conduite du changement identifiables et corrigeables — une bonne nouvelle pour le CA. La révision réaliste des prévisions de bénéfices est une obligation fiduciaire. Le report (C) retarde une conversation nécessaire.` },

{ id:"EA-003", domaine:"Environnement d'affaires", approche:"Prédictif", type:"standard",
  question:`Vous gérez un programme de déploiement de 5 bâtiments tertiaires (95 M€, 48 mois) avec obligation contractuelle de certification BREEAM "Excellent" pour chaque bâtiment. À mi-programme (mois 24), les audits pré-certification révèlent que 3 bâtiments sont sur la trajectoire "Very Good" (insuffisant). Les écarts : (1) qualité de l'air intérieur insuffisante (matériaux à émission COV élevée), (2) absence de récupération des eaux grises, (3) surchauffe d'été sans brise-soleil suffisant. Surcoût estimé pour correction : 2,1 M€. Comment présentez-vous la situation au client ?`,
  options:[
    `A. Recommander au client de réviser les objectifs RSE de BREEAM Excellent à BREEAM Very Good pour les 3 bâtiments problématiques.`,
    `B. Présenter au client une analyse complète et honnête : état actuel vs objectif pour chaque bâtiment avec les écarts spécifiques ; analyse des causes (spécifications initiales insuffisantes pour BREEAM Excellent — question de responsabilité à clarifier) ; plan de correction avec coût (2,1 M€), délai et probabilité d'atteindre BREEAM Excellent ; conséquences de non-correction (impact sur la valeur immobilière, les engagements RSE du client, les critères de financement) ; proposition de processus de décision incluant la répartition de la responsabilité financière.`,
    `C. Engager immédiatement les corrections des 3 bâtiments sur le budget de réserve du programme sans impliquer le client.`,
    `D. Demander une extension de délai de 6 mois pour effectuer les corrections nécessaires sans surcoût budgétaire.`
  ],
  correct:1,
  explication:`La réponse B est correcte. La gestion des bénéfices (ECO T3) et de la durabilité (ECO T7) dans un contexte de certification environnementale exige une transparence complète avec le client sur les 5 dimensions (état réel, causes, plan correctif, conséquences, responsabilité). L'analyse de responsabilité est cruciale — si les spécifications initiales étaient insuffisantes pour BREEAM Excellent, la charge financière peut ne pas incomber entièrement au programme. Réviser les objectifs (A) sans analyse préalable est une capitulation prématurée. Engager les corrections sans autorisation (C) est une décision unilatérale sur une ressource du programme.` },

{ id:"EA-004", domaine:"Environnement d'affaires", approche:"Agile", type:"standard",
  question:`Votre startup développe une application de santé avec un modèle de données centralisé. Votre CTO vous informe que le nouveau règlement européen sur les données de santé (EHDS — European Health Data Space, entré en vigueur depuis 2026) imposera dans 18 mois des obligations de portabilité des données de santé qui nécessiteront une refonte architecturale significative de votre application (coût estimé : 850 000 €, délai : 8 mois). Votre conseil d'administration veut retarder la mise en conformité pour préserver la trésorerie. Quelle est votre position et recommandation ?`,
  options:[
    `A. Soutenir la position du CA — retarder la mise en conformité préserve la trésorerie et 18 mois est un délai suffisant pour agir plus tard.`,
    `B. Expliquer au CA que la mise en conformité EHDS n'est pas optionnelle — c'est une obligation légale avec des sanctions significatives (amendes, interdiction de traiter des données de santé). Recommander d'initier immédiatement la planification de la mise en conformité (18 mois, c'est exactement le délai nécessaire pour une refonte architecturale de 8 mois avec marge) ; explorer les options de financement (subventions publiques numérique/santé, intégration dans les fonctionnalités vendables comme avantage concurrentiel) ; les données de santé conformes EHDS deviendront un avantage différenciateur sur le marché.`,
    `C. Commencer la mise en conformité uniquement quand les premiers avertissements réglementaires seront émis — les régulateurs accordent généralement des délais de grâce aux startups.`,
    `D. Vendre la startup avant l'échéance de conformité pour éviter d'investir dans une refonte non rentable.`
  ],
  correct:1,
  explication:`La réponse B est correcte. La conformité réglementaire dans le secteur de la santé est non négociable (ECO T2 — Confirmer la conformité). Le EHDS n'est pas une recommandation mais une obligation légale avec des sanctions pouvant inclure l'interdiction de traiter des données de santé — ce qui mettrait fin à l'activité. 18 mois de délai pour une refonte de 8 mois signifie que l'initiation doit commencer maintenant pour avoir une marge. La position du CA (A) trade un risque de trésorerie contre un risque existentiel (arrêt d'activité). Les délais de grâce (C) ne sont pas garantis, surtout pour des données de santé sensibles.` },

{ id:"EA-005", domaine:"Environnement d'affaires", approche:"Prédictif", type:"standard",
  question:`Vous êtes directeur de programme pour la transformation d'une administration publique régionale (budget programme : 34 M€, 48 mois). À mi-programme, une élection régionale amène une nouvelle majorité politique avec un programme différent. Le nouveau président du Conseil Régional (votre sponsor politique) remet en question 3 des 6 composantes du programme — représentant 42 % du budget total. Il souhaite "réévaluer les priorités" mais n'a pas pris de décision formelle. Comment gérez-vous cette incertitude stratégique ?`,
  options:[
    `A. Continuer l'exécution de l'ensemble du programme jusqu'à ce qu'une décision formelle soit prise — les programmes publics ne s'arrêtent pas en l'absence de directive officielle.`,
    `B. Solliciter une réunion avec le nouveau président du Conseil pour présenter l'état d'avancement de chaque composante, les investissements réalisés à date, les bénéfices attendus et le coût de l'arrêt prématuré pour les 3 composantes remises en question — lui fournir les informations nécessaires à une décision éclairée ; dans l'intervalle, continuer l'exécution des 3 composantes non remises en question et ralentir (sans arrêter) les 3 composantes incertaines pour limiter les engagements non réversibles, dans l'attente d'une décision formelle.`,
    `C. Arrêter immédiatement les 3 composantes remises en question — poursuivre sans mandat politique clairement renouvelé est risqué dans un contexte de changement politique.`,
    `D. Ignorer la remise en question politique — les programmes approuvés ont une autonomie d'exécution que les changements politiques ne peuvent pas modifier unilatéralement.`
  ],
  correct:1,
  explication:`La réponse B est correcte. Un changement de leadership politique dans un programme public crée une incertitude légitime qui doit être gérée avec pragmatisme. L'arrêt immédiat (C) sans décision formelle peut créer des perturbations inutiles si le nouveau président décide de maintenir les composantes. La continuité totale (A) sans engagement du nouveau leadership peut conduire à des investissements futurs sur des composantes qui seront finalement abandonnées. La stratégie optimale est de ralentir (pas arrêter) les composantes incertaines tout en facilitant activement une décision formelle informée.` },

{ id:"EA-006", domaine:"Environnement d'affaires", approche:"Hybride", type:"standard",
  question:`Vous êtes chef de projet senior dans une entreprise de conseil. Un client demande que vous commenciez un projet confidentiel sans contrat signé, "pour ne pas perdre de temps". Votre direction commerciale est enthousiaste car c'est un client important. L'engagement estimé est de 380 000 €. Vous avez travaillé avec ce client sans problème sur 3 projets précédents. Quels risques identifiez-vous et quelle est votre décision ?`,
  options:[
    `A. Démarrer le projet — la relation de confiance établie sur 3 projets précédents et l'importance du client justifient cette flexibilité.`,
    `B. Ne pas démarrer le projet sans contrat signé ; expliquer au client et à votre direction les risques concrets : absence de définition formelle du périmètre (risque de désaccord sur les livrables), absence de clause de paiement (risque de non-paiement en cas de litige ou de changement de direction chez le client), absence de clause de confidentialité formelle (risque légal sur les informations échangées) ; proposer au client de signer un "accord de démarrage" simplifié (1-2 pages) définissant le périmètre, les livrables initiaux et les conditions de paiement — cela peut être fait en 24-48 heures sans ralentir significativement le démarrage.`,,
    `C. Démarrer sur une base informelle mais documenter soigneusement toutes les réunions et échanges pour se protéger en cas de litige.`,
    `D. Démarrer uniquement les activités préliminaires non facturables (réunion de kick-off, collecte d'informations) en attendant la signature du contrat.`
  ],
  correct:1,
  explication:`La réponse B est correcte. La gestion des achats et des contrats (ECO T5) impose des engagements formels avant le démarrage de projets commerciaux, même avec des clients de confiance. Les risques d'un démarrage sans contrat sont réels même dans une relation établie : changement d'interlocuteur chez le client, désaccord sur le périmètre réel, difficultés de paiement en cas de rotation d'équipe dirigeante. Un accord simplifié de 1-2 pages est une solution pratique qui ne crée pas de délai significatif. La documentation informelle (C) ne remplace pas la protection contractuelle.` },

{ id:"EA-007", domaine:"Environnement d'affaires", approche:"Agile", type:"standard",
  question:`Votre organisation vient d'adopter OKR (Objectives and Key Results) comme cadre de management de la performance. En tant que chef de projet, on vous demande d'aligner les sprints de votre équipe Agile sur les OKR trimestriels de l'organisation. Votre premier OKR organisationnel est : "Objectif : Devenir le leader de l'expérience client dans notre secteur. KR1 : NPS > 70 (actuellement 42). KR2 : Taux de résolution au premier contact > 85 % (actuellement 68 %). KR3 : Délai moyen de réponse < 2 heures (actuellement 8 heures)." Comment traduisez-vous ces OKR en travail Agile concret pour votre équipe ?`,
  options:[
    `A. Intégrer les OKR comme des user stories directement dans le backlog produit : "En tant que client, je veux un NPS > 70".`,,
    `B. Faciliter une session de mapping OKR-to-backlog avec le Product Owner et l'équipe : identifier quelles fonctionnalités ou améliorations du produit pourraient impacter chaque KR ; créer des hypothèses testables (si nous développons X, nous prévoyons une amélioration de Y sur le KR Z) ; prioriser les stories du backlog selon leur impact estimé sur les KRs ; définir des métriques de mesure pour chaque sprint (est-ce que les fonctionnalités livrées ont l'impact attendu ?) — les OKR guident la priorisation du backlog, pas sa formulation.`,
    `C. Remplacer la vélocité en story points par des indicateurs OKR pour mesurer la performance de l'équipe.`,
    `D. Traiter les OKR comme des contraintes organisationnelles et continuer à travailler le backlog tel qu'il est — les OKR sont un cadre de direction générale qui ne change pas le travail quotidien de l'équipe.`
  ],
  correct:1,
  explication:`La réponse B est correcte. Les OKR sont des objectifs stratégiques qui doivent être traduits en travail concret via des hypothèses testables (si nous développons X, nous améliorons Y). La session de mapping OKR-to-backlog crée une ligne de visée claire entre le travail de l'équipe et les objectifs organisationnels — ce qui est au cœur de l'ECO PMP® 2026 (alignement stratégique, livraison de valeur). Formuler les OKR directement en user stories (A) perd la dimension d'hypothèse testable. Remplacer la vélocité (C) par des OKR confond les métriques de performance d'équipe (sortie : vélocité) avec les métriques d'impact business (résultat : NPS).` },

{ id:"EA-008", domaine:"Environnement d'affaires", approche:"Prédictif", type:"standard",
  question:`En tant que chef de projet d'un programme de développement logiciel (22 M€, 30 mois), vous réalisez à mi-programme que les bénéfices projetés dans le business case ont été significativement surestimés lors de l'initiation. Le business case projetait 4,8 M€ d'économies annuelles — votre analyse actuelle suggère 1,9 M€ d'économies annuelles réalistes. Le programme est sur le point de recevoir une nouvelle tranche de financement de 8 M€ pour la deuxième phase. Que faites-vous ?`,
  options:[
    `A. Ne rien changer — le business case a été approuvé et les estimations d'économies initiales peuvent encore se réaliser si les conditions changent.`,
    `B. Documenter rigoureusement l'analyse révisée des bénéfices avec les hypothèses et données qui soutiennent les 1,9 M€ réalistes ; informer le sponsor et le comité de financement de la révision avant l'approbation de la nouvelle tranche de financement — ils doivent pouvoir décider de la poursuite du programme sur la base d'informations exactes ; préparer une analyse coût-bénéfice révisée : est-ce que le programme reste rentable à 1,9 M€/an ? Si oui, le programme peut continuer avec un business case révisé. Si non, le comité doit décider d'arrêter ou de réduire le périmètre.`,
    `C. Réviser discrètement les hypothèses du business case pour les rapprocher des projections initiales — une révision formelle créerait une alarme injustifiée.`,
    `D. Attendre d'avoir plus de données après la phase 2 avant de réviser le business case — les estimations à mi-programme sont naturellement imprécises.`
  ],
  correct:1,
  explication:`La réponse B est correcte. Permettre au comité de financement d'approuver une nouvelle tranche de 8 M€ sur la base d'un business case qu'on sait être significativement surestimé constituerait une tromperie grave (Code d'Éthique PMI). La transparence sur la révision des bénéfices avant la décision de financement est une obligation éthique et de gouvernance fondamentale (ECO T3 — Bénéfices du projet, T8 — Gouvernance de portefeuille). La manipulation des hypothèses (C) est une fraude. Attendre (D) permettrait d'engager 8 M€ supplémentaires sur la base d'informations incorrectes.` },

{ id:"EA-009", domaine:"Environnement d'affaires", approche:"Hybride", type:"standard",
  question:`Votre organisation lance un projet de mise en place d'un système de management de l'énergie (ISO 50001) dans son réseau de 15 usines. L'objectif est de réduire la consommation d'énergie de 18 % en 3 ans. À la fin de la première année, les données montrent une réduction de 6,8 % (cible : 7 % pour la première année — quasi-atteinte) mais votre analyse révèle que 9 % de cette réduction est due à une production exceptionnellement basse cette année (récession économique) et non aux améliorations d'efficacité énergétique. L'efficacité énergétique réelle (normalisée par unité produite) n'a amélioré que de 1,4 %. Comment reportez-vous ces résultats ?`,
  options:[
    `A. Reporter les 6,8 % de réduction comme atteints — c'est la réduction réelle de consommation d'énergie, indépendamment de la cause.`,
    `B. Reporter les deux métriques dans le rapport de performance : réduction absolue de consommation (6,8 %) et efficacité énergétique normalisée par unité produite (amélioration de 1,4 %) — en expliquant la différence par la baisse de production. La métrique pertinente pour évaluer l'efficacité du programme ISO 50001 est la deuxième (performance par unité) pas la première (consommation absolue affectée par la récession). Réviser les projections pour les années 2 et 3 en tenant compte du fait que les actions d'efficacité réelles n'ont produit que 1,4 % d'amélioration vs 7 % attendus.`,
    `C. Reporter les 6,8 % et mentionner en note que la production était inférieure à la normale — l'information est divulguée même si elle n'est pas mise en avant.`,
    `D. Attendre l'année 2 pour évaluer si l'efficacité énergétique normalisée s'améliore avant de réviser les prévisions — une année est insuffisante pour tirer des conclusions.`
  ],
  correct:1,
  explication:`La réponse B est correcte. Le reporting ESG et de durabilité (ECO T7 — Qualité et durabilité) exige la présentation des métriques les plus pertinentes pour évaluer la performance réelle du programme. Présenter uniquement la réduction absolue (6,8 %) sans contextualiser l'impact de la récession constituerait un biais de reporting — les parties prenantes comprendraient que l'efficacité du programme est 5x supérieure à ce qu'elle est réellement. La note en bas de page (C) divulgue l'information mais ne lui donne pas la visibilité qu'elle mérite. La révision des prévisions est indispensable — les années 2 et 3 doivent être recalculées sur la base de la vraie performance d'efficacité (1,4 %).` },

{ id:"EA-010", domaine:"Environnement d'affaires", approche:"Agile", type:"standard",
  question:`Vous êtes chef de projet pour le lancement d'une nouvelle ligne de produits alimentaires biologiques pour un groupe de distribution. Le project manager marketing vous informe que pour atteindre les objectifs de part de marché, il faudrait lancer 6 mois avant la date prévue de certification biologique — en vendant les produits sans label "bio" mais avec des arguments marketing suggérant des caractéristiques biologiques sans les affirmer explicitement. La direction commerciale approuve cette approche. Comment répondez-vous ?`,
  options:[
    `A. Accepter l'approche — les arguments marketing "suggèrent sans affirmer" et la direction commerciale a approuvé.`,,
    `B. Refuser de participer à cette approche et expliquer clairement pourquoi : les arguments marketing qui "suggèrent des caractéristiques biologiques" sans certification constituent du greenwashing — une pratique illégale dans de nombreuses juridictions (directive anti-greenwashing EU 2024, lois nationales équivalentes) exposant l'entreprise à des amendes significatives, des class actions de consommateurs, et des dommages de réputation majeurs. Le chef de projet a la responsabilité de signaler ce risque légal à la direction générale et aux services juridiques, indépendamment de l'approbation de la direction commerciale. Proposer une alternative : un pré-lancement dans des canaux spécialisés "bio en cours de certification" transparent avec les consommateurs.`,,
    `C. Lancer les produits avec les arguments marketing suggérés mais documenter formellement votre désaccord par écrit pour vous protéger.`,
    `D. Déléguer la décision finale à la direction juridique — c'est une question légale qui dépasse les responsabilités du chef de projet.`
  ],
  correct:1,
  explication:`La réponse B est correcte. Le greenwashing est une pratique illégale avec des conséquences légales, financières et réputationnelles graves. La directive anti-greenwashing européenne (2024) et les équivalents nationaux sanctionnent précisément les allégations suggérées sans certification. Le chef de projet a la responsabilité éthique de signaler ce risque à la direction générale et aux services juridiques (ECO T2 — Conformité) — l'approbation de la direction commerciale ne suffit pas quand une pratique potentiellement illégale est en jeu. La documentation du désaccord (C) ne suffit pas quand on participe quand même à une pratique illégale. Déléguer uniquement au juridique (D) évite la responsabilité sans traiter le problème.` },

{ id:"EA-011", domaine:"Environnement d'affaires", approche:"Prédictif", type:"standard",
  question:`Vous gérez un projet de construction d'une usine de production (23 M€, 26 mois) pour une entreprise qui vient d'être acquise par un groupe international. Le nouvel actionnaire impose une politique de "zéro accident" (TRIR cible = 0) et exige que tout accident, même bénin, soit déclaré et investigué. Lors du mois 8, un ouvrier se blesse légèrement (coupure superficielle nécessitant un pansement) sur votre chantier. Le chef de chantier vous suggère de "ne pas déclarer" car "c'est très bénin et ça va faire mauvaise impression au nouveau groupe". Comment répondez-vous ?`,
  options:[
    `A. Accepter la suggestion du chef de chantier — une coupure superficielle n'est pas un accident significatif et la déclaration créerait des complications administratives inutiles.`,
    `B. Refuser catégoriquement de ne pas déclarer : la politique "zéro accident" signifie précisément que tous les incidents, même bénins, doivent être déclarés et investigués — c'est cette complétude des données qui permet d'identifier les risques avant qu'ils génèrent des accidents graves. Déclarer l'incident selon la procédure, réaliser l'investigation requise, et expliquer au chef de chantier que la non-déclaration est précisément le comportement que la politique vise à éliminer car il masque les signaux précurseurs d'accidents graves.`,,
    `C. Déclarer l'incident à l'équipe de direction interne mais pas au groupe international — une gestion locale de cet incident bénin est suffisante.`,
    `D. Attendre que le chef de chantier prenne sa décision — la sécurité sur le chantier est sa responsabilité opérationnelle, pas la vôtre.`
  ],
  correct:1,
  explication:`La réponse B est correcte. La politique "zéro accident" avec déclaration obligatoire de tous les incidents n'est pas arbitraire — elle est basée sur le Triangle de Heinrich (pour chaque accident grave, il y a des dizaines d'accidents bénins et des centaines de quasi-accidents). Masquer un incident bénin (A, C) détruit précisément l'information qui permettrait d'éviter un accident grave. La non-déclaration n'est pas un "problème d'impression" mais une violation délibérée de la politique de sécurité du groupe — ce qui constitue un risque pour l'intégrité professionnelle du chef de projet. La délégation au chef de chantier (D) abdique la responsabilité de supervision HSE.` },

{ id:"EA-012", domaine:"Environnement d'affaires", approche:"Hybride", type:"standard",
  question:`Vous êtes chef de programme pour la construction de 3 hôpitaux dans un pays en développement, financé par une ONG internationale (65 M€, 48 mois). Votre sous-traitant local de gros œuvre vous propose de réduire les coûts de 12 % en utilisant des matériaux locaux qui ne respectent pas les normes internationales de construction parasismique spécifiées dans les plans — mais qui "sont suffisants dans ce pays car il n'y a pas de séisme depuis 50 ans". La direction de l'ONG est pressée par ses bailleurs de réduire les coûts. Quelle est votre décision ?`,
  options:[
    `A. Accepter la proposition — réduire les coûts de 12 % dans un contexte de financement limité ONG est une décision pragmatique, et le risque sismique est documenté comme faible.`,
    `B. Refuser fermement et expliquer les raisons : (1) les normes parasismiques définies dans les spécifications contractuelles sont non négociables dans des bâtiments recevant du public (un hôpital non parasismique est potentiellement mortel en cas de séisme, même de faible probabilité) ; (2) "50 ans sans séisme" n'est pas une garantie d'absence de risque — c'est au contraire un signe que le risque de séisme n'est pas nul mais simplement peu fréquent ; (3) les normes internationales existent précisément pour protéger les populations vulnérables dans des pays parfois moins stricts réglementairement. Proposer des alternatives d'économies qui ne compromettent pas la sécurité structurale.`,,
    `C. Soumettre la décision à la direction de l'ONG et à ses bailleurs — c'est à eux de décider du niveau de risque acceptable pour leur programme.`,
    `D. Faire une étude de risque sismique indépendante avant de décider — si le risque réel est confirmé comme négligeable, les matériaux locaux peuvent être acceptés.`
  ],
  correct:1,
  explication:`La réponse B est correcte. La sécurité structurale des bâtiments accueillant du public (hôpitaux particulièrement) est une exigence fondamentale non négociable, même dans un contexte de financement contraint. L'argument "50 ans sans séisme" est un biais de probabilité — il ne garantit pas l'absence de risque mais signifie simplement que le risque se matérialisera éventuellement. Les normes parasismiques internationales existent précisément pour protéger les populations vulnérables. La délégation à la direction ONG (C) est insuffisante quand une décision potentiellement mortelle est en jeu — le chef de programme a la responsabilité de maintenir les standards de sécurité indépendamment des pressions budgétaires. Une étude de risque (D) peut être pertinente mais ne peut pas justifier de descendre sous les normes contractuelles.` },

{ id:"EA-013", domaine:"Environnement d'affaires", approche:"Agile", type:"standard",
  question:`Votre organisation envisage de passer d'un déploiement en cascade à un déploiement continu (CI/CD) pour ses applications web. Vous êtes chargé d'évaluer la maturité de l'organisation pour ce changement. Votre évaluation révèle : couverture de tests automatisés actuelle : 31 % (recommandation pour CI/CD : >80 %), infrastructure cloud : en cours de migration (60 % sur cloud), culture de la qualité : revues de code optionnelles (70 % sont réalisées), processus de déploiement : manuel avec 4 approbations séquentielles. Quelle est votre recommandation ?`,
  options:[
    `A. Recommander le déploiement CI/CD immédiatement — les avantages (réduction des délais de livraison, réduction des erreurs) justifient le saut vers CI/CD malgré les lacunes actuelles.`,
    `B. Recommander une feuille de route de 12-18 mois vers le CI/CD en 3 phases : Phase 1 (0-6 mois) — atteindre >80 % de couverture de tests automatisés (indispensable pour CI/CD sécurisé), finaliser la migration cloud, rendre les revues de code obligatoires dans la Définition de Fini. Phase 2 (6-12 mois) — automatiser le pipeline de déploiement avec des gates qualité automatiques, réduire les approbations de 4 à 2 (validation automatique + approbation humaine unique). Phase 3 (12-18 mois) — déploiement continu avec rollback automatique et monitoring avancé — avec métriques de succès définies pour chaque phase.`,
    `C. Recommander d'attendre que la migration cloud soit à 100 % avant d'initier le projet CI/CD — l'infrastructure est le prérequis fondamental.`,
    `D. Recommander CI/CD uniquement pour les applications non critiques dans un premier temps, et maintenir le processus manuel pour les applications critiques.`
  ],
  correct:1,
  explication:`La réponse B est correcte. Un changement organisationnel majeur comme le passage au CI/CD nécessite une évaluation de la maturité et une feuille de route progressive — pas un "big bang" (A) ni une attente d'une condition parfaite (C). La couverture de tests de 31 % est le facteur bloquant le plus critique : sans tests automatisés robustes, le CI/CD déploierait fréquemment des bugs en production. La feuille de route en 3 phases permet de construire les capacités progressivement avec des métriques de validation à chaque étape (ECO T7 — Amélioration continue). La recommandation D est acceptable mais sous-optimale car elle maintient deux processus en parallèle indéfiniment.` },

{ id:"EA-014", domaine:"Environnement d'affaires", approche:"Prédictif", type:"standard",
  question:`Vous êtes chef de projet pour le déploiement d'un système ERP dans une entreprise de 1 200 personnes. Le projet est à sa 3ème semaine de phase de test pré-déploiement. Votre équipe QA découvre un bug critique : sous certaines conditions spécifiques (combinaison de 3 modules actifs simultanément), le système peut dupliquer des écritures comptables sans les détecter. La probabilité d'occurrence en production estimée est de 15-20 % par jour de fonctionnement. Le déploiement est prévu dans 10 jours. Le DG a annoncé publiquement cette date à toutes les parties prenantes. Comment gérez-vous cette situation ?`,
  options:[
    `A. Déployer selon le calendrier prévu mais bloquer temporairement les 3 modules concernés jusqu'à la correction du bug — les autres fonctionnalités peuvent être mises en service.`,
    `B. Reporter le déploiement jusqu'à la correction complète et testée du bug, quel que soit l'impact sur la communication publique du DG ; préparer immédiatement avec le DG et l'équipe de communication une annonce honnête expliquant que le report est lié à la découverte d'un bug de qualité critique lors des tests — les parties prenantes comprendront mieux un report proactif qu'une correction d'urgence post-déploiement de duplications d'écritures comptables.`,
    `C. Déployer selon le calendrier mais informer uniquement l'équipe comptable du risque pour qu'elle surveille manuellement les écritures.`,
    `D. Demander à l'équipe QA de préparer une évaluation du risque plus précise — 15-20 % par jour peut être acceptable si les impacts sont limités.`
  ],
  correct:1,
  explication:`La réponse B est correcte. Un bug qui peut dupliquer des écritures comptables avec 15-20 % de probabilité par jour est un défaut critique incompatible avec le déploiement — les erreurs comptables ont des implications légales, fiscales et de gouvernance graves. La pression de la communication publique du DG ne constitue pas une raison de déployer un système comptable défaillant. Un report proactif expliqué honnêtement (bug détecté lors des tests = le processus QA fonctionne) est bien mieux reçu qu'une crise post-déploiement. Le déploiement partiel (A) avec 3 modules bloqués n'est pas viable si ces modules sont interconnectés dans l'ERP. Surveiller manuellement (C) n'est pas une réponse acceptable pour un bug de cette nature.` },

{ id:"EA-015", domaine:"Environnement d'affaires", approche:"Hybride", type:"standard",
  question:`Vous êtes directeur de programme pour la transformation des processus opérationnels d'une banque (budget : 28 M€, 36 mois). Un audit de mi-programme révèle que votre programme a significativement amélioré l'efficacité opérationnelle (objectif atteint à 94 %) mais que les employés de 3 filiales ont été remplacés par des processus automatisés — résultant en 47 suppressions d'emplois non prévues dans le business case initial. La direction de la banque avait indiqué au début du programme "pas de suppressions de postes prévues". Comment gérez-vous la situation actuelle et les communications ?`,
  options:[
    `A. Continuer le programme — les suppressions d'emplois sont une conséquence imprévue mais non planifiée de l'optimisation des processus, et la direction était au courant.`,
    `B. Reconnaître que les suppressions d'emplois créent un écart significatif entre les engagements initiaux de la direction et la réalité du programme ; informer immédiatement la direction de la banque de la situation réelle et de son ampleur ; travailler avec les RH et la direction pour développer un plan d'accompagnement des 47 employés impactés (reclassement interne, formation, accompagnement externe) ; revoir les projections pour les 18 mois restants du programme pour identifier si d'autres suppressions sont à prévoir et les intégrer dans une communication proactive et honnête avec les comités de dialogue social et les parties prenantes concernées.`,
    `C. Présenter les suppressions d'emplois comme des "redéploiements" dans la communication publique — le terme est moins choquant et techniquement certains employés pourraient être réaffectés.`,,
    `D. Bloquer toute automatisation supplémentaire jusqu'à la mise en place d'un plan social formel — la banque avait pris un engagement de non-suppression de postes.`
  ],
  correct:1,
  explication:`La réponse B est correcte. La gestion du changement organisationnel (ECO T6) et l'éthique professionnelle imposent de traiter honnêtement les conséquences sociales d'un programme d'automatisation. L'écart entre l'engagement initial ("pas de suppressions de postes") et la réalité (47 suppressions) est significatif et doit être adressé directement avec la direction. L'accompagnement des personnes impactées est une obligation éthique et souvent légale (droit du travail). La terminologie euphémique "redéployements" (C) sans plan concret constitue une tromperie. Bloquer toute automatisation future (D) sans dialogue préalable avec la direction est une décision unilatérale excessive.` },,
{ id:"IA-001", domaine:"IA & Durabilité", approche:"Hybride", type:"standard",
  question:`Votre organisation vient d'implémenter un outil d'IA générative pour l'estimation des coûts de projet. Sur les 6 premiers mois, 4 chefs de projet ont accepté les estimations IA sans validation humaine. Deux projets présentent maintenant des dépassements budgétaires de 22 % et 31 %. Un chef de projet défend l'outil en disant "l'IA a analysé 10 000 projets historiques, elle est forcément plus précise que nous". En tant que chef de programme, comment répondez-vous et quelle gouvernance mettez-vous en place ?`,
  options:[
    `A. Valider la position du chef de projet — un outil entraîné sur 10 000 projets est statistiquement plus fiable que l'intuition humaine.`,
    `B. Expliquer que les outils IA d'estimation fonctionnent par pattern matching sur données historiques — ils reproduisent les biais et lacunes de ces données, et ne capturent pas le contexte organisationnel spécifique ni les risques émergents. Mettre en place une gouvernance à 3 niveaux : (1) validation humaine obligatoire de toute estimation IA avec documentation des ajustements ; (2) calibration continue sur les données réelles de l'organisation ; (3) formation des chefs de projet à l'interprétation critique des sorties IA — les former à être des superviseurs intelligents, pas des exécutants.`,
    `C. Désactiver l'outil d'estimation car les dépassements observés prouvent son inefficacité.`,
    `D. Demander au fournisseur d'améliorer son algorithme pour corriger les erreurs — la responsabilité revient au fournisseur.`
  ],
  correct:1,
  explication:`La réponse B est correcte. L'ECO PMP® 2026 intègre explicitement l'IA comme facteur dans la planification. Un outil IA d'estimation est un support à la décision, pas un substitut au jugement professionnel. Les dépassements signalent un problème de supervision humaine. La gouvernance à 3 niveaux (validation, calibration, formation) est la réponse systémique appropriée. La désactivation (C) jette l'outil avec l'eau du bain — une calibration et une gouvernance appropriées peuvent résoudre le problème.` },

{ id:"IA-002", domaine:"IA & Durabilité", approche:"Agile", type:"standard",
  question:`Vous gérez le développement d'un assistant IA pour conseillers financiers d'une banque. L'assistant recommande des produits financiers aux clients. Lors des tests pré-lancement, votre équipe découvre que l'assistant recommande systématiquement des produits à frais plus élevés pour les clients avec des revenus inférieurs à 30 000 € annuels — sans justification par leur profil de risque. Le product manager dit "c'est peut-être un biais, mais l'assistant génère de meilleures marges — c'est une bonne chose pour la banque." Comment répondez-vous ?`,
  options:[
    `A. Accepter provisoirement et lancer le produit — si des clients se plaignent, on ajustera l'algorithme dans une version future.`,
    `B. Bloquer le lancement et expliquer que ce comportement viole simultanément : les obligations fiduciaires du conseiller financier (devoir de conseil dans l'intérêt du client), les directives réglementaires sur la commercialisation des produits financiers (MiFID II équivalent), et les principes d'IA responsable (ECO PMP® 2026). Initier une correction de l'algorithme pour aligner les recommandations sur le profil réel du client indépendamment des revenus. Soumettre la situation à la conformité et à l'éthique de la banque.`,
    `C. Lancer avec un disclaimer indiquant que les recommandations sont "à titre informatif uniquement" — cela protège la banque légalement.`,,
    `D. Demander à l'équipe de data science de documenter le biais dans le rapport technique mais pas dans la documentation produit visible.`
  ],
  correct:1,
  explication:`La réponse B est la seule éthiquement et légalement acceptable. Ce comportement constitue une recommandation non dans l'intérêt du client (violation fiduciaire) pouvant constituer une pratique commerciale trompeuse. Le Product Manager a une vision court-termiste qui expose la banque à des risques réglementaires et de réputation bien supérieurs aux bénéfices marginaux. L'ECO PMP 2026 place la responsabilité du déploiement éthique de l'IA au niveau du chef de projet. La clause disclaimer (C) ne supprime pas la responsabilité légale.` },

{ id:"IA-003", domaine:"IA & Durabilité", approche:"Prédictif", type:"standard",
  question:`Votre organisation a déployé un outil IA de recommandation d'allocation des chefs de projet basé sur leurs performances historiques. Vous constatez que l'outil attribue systématiquement les projets à forte visibilité aux profils les plus anciens, et que les femmes récemment promues chefs de projet sont majoritairement affectées aux projets à faible risque et visibilité. L'algorithme ne fait que refléter les patterns d'allocation des 7 dernières années. Quelle est votre position ?`,
  options:[
    `A. Accepter les recommandations IA car elles sont basées sur des données objectives de performance historique — éliminer le biais humain est précisément l'objectif de l'outil.`,
    `B. Rejeter ce mode d'allocation et expliquer que l'algorithme encode et perpétue les inégalités historiques d'opportunités — si des profils n'ont pas eu accès aux projets à forte visibilité historiquement, leurs données de performance sur ces projets sont absentes. L'IA n'évalue pas leur capacité mais leur historique d'opportunités. Mettre en place une allocation mixte : recommandations IA comme input parmi d'autres facteurs (potentiel évalué, développement de carrière, diversité) avec décision humaine finale et traçabilité des critères.`,
    `C. Faire appel à un audit externe du fournisseur pour corriger le biais — la responsabilité de correction incombe au fournisseur.`,
    `D. Utiliser l'outil pour les projets à risque élevé seulement et revenir à l'allocation manuelle pour les profils juniors et féminins.`
  ],
  correct:1,
  explication:`La réponse B est correcte. L'algorithme encode le "biais historique amplifié par l'IA" — il ne mesure pas la compétence mais l'opportunité historiquement accordée. Un système d'allocation basé sur ce biais perpétue et institutionnalise les inégalités existantes. L'ECO PMP® 2026 intègre l'équité, la diversité et l'inclusion comme responsabilités du chef de projet — l'IA ne dispense pas de ces responsabilités. L'approche hybride (D) ne traite toujours pas la cause racine du biais systémique.` },

{ id:"IA-004", domaine:"IA & Durabilité", approche:"Hybride", type:"standard",
  question:`Vous gérez la construction d'un complexe logistique de 85 000 m² (34 M€, 24 mois). Votre client a adopté la Science Based Targets initiative (SBTi) et impose un bilan carbone inférieur à 650 kgCO₂e/m² (moyenne sectorielle : 920). Votre estimation initiale est 810 kgCO₂e/m². Trois leviers disponibles : (L1) béton bas carbone (surcoût 420 k€, réduction -95 kgCO₂e/m²) ; (L2) structure bois lamellé-collé (surcoût 680 k€, réduction -85 kgCO₂e/m²) ; (L3) installation solaire PV avec revente surplus (surcoût 310 k€, réduction -35 kgCO₂e/m², revenus sur 20 ans estimés à 1,2 M€). Les trois combinés atteignent 595 kgCO₂e/m². Comment présentez-vous l'analyse au client ?`,
  options:[
    `A. Recommander uniquement L1 (béton bas carbone) car c'est le meilleur ratio réduction/surcoût — mais 810-95 = 715 kgCO₂e/m², encore au-dessus de l'objectif.`,
    `B. Présenter une analyse multicritères complète : scénario L1+L2 (surcoût 1,1 M€, résultat 630 kgCO₂e/m² — sous l'objectif) ; scénario L1+L3 (surcoût 730 k€, résultat 680 — au-dessus) ; scénario L1+L2+L3 (surcoût 1,41 M€, résultat 595, VAN sur 20 ans positive après revenus PV). Présenter les trois scénarios avec impact financier, carbone et business case du client pour une décision éclairée.`,
    `C. Recommander la combinaison complète L1+L2+L3 car c'est la seule garantissant l'objectif avec marge — le client a adopté la SBTi et doit respecter ses engagements.`,
    `D. Informer le client que l'objectif de 650 est difficile à atteindre dans le budget actuel et recommander de réviser la cible à 750.`
  ],
  correct:1,
  explication:`La réponse B est correcte. La gestion de la durabilité (ECO T7 — Qualité et durabilité, T3 — Bénéfices) exige une analyse multicritères honnête et complète. Le chef de projet ne doit pas choisir unilatéralement une option — le client doit décider en connaissance de cause. L'analyse L1+L2+L3 montre une VAN positive sur 20 ans grâce aux revenus PV — ce qui transforme radicalement la présentation financière du surcoût de 1,41 M€. Réviser la cible à la baisse (D) sans analyse préalable est une capitulation prématurée.` },

{ id:"IA-005", domaine:"IA & Durabilité", approche:"Agile", type:"standard",
  question:`Votre équipe développe une plateforme de matching emploi avec un algorithme de recommandation IA. Après 4 mois en production, les données montrent que les candidats avec des noms à consonance étrangère reçoivent 34 % moins de recommandations vers des postes qualifiés que les candidats avec des noms locaux, à compétences équivalentes. Le Product Owner veut ignorer ce fait car "l'algorithme optimise le taux d'acceptation des employeurs, et c'est ce que le marché demande". Quelle est votre position ?`,
  options:[
    `A. Soutenir la position du PO — l'algorithme reflète les préférences réelles du marché de l'emploi, et optimiser le taux d'acceptation est l'objectif commercial légitime.`,
    `B. Expliquer au PO que l'algorithme amplifie une discrimination illégale dans la plupart des pays (discrimination à l'embauche basée sur l'origine). Engager : (1) suspension ou déclassement de l'algorithme biaisé ; (2) correction en retirant les variables proxy discriminatoires ; (3) notification à l'équipe juridique et conformité ; (4) communication transparente si des candidats ont été lésés ; (5) monitoring anti-discrimination dans le pipeline MLOps.`,
    `C. Proposer une option de "mode neutre" où les candidats peuvent masquer leur nom dans les recommandations — solution technique contournant le biais sans modifier l'algorithme.`,,
    `D. Documenter le biais dans le backlog produit comme story à traiter dans les prochains sprints selon les priorités du PO.`
  ],
  correct:1,
  explication:`La réponse B est correcte. La discrimination algorithmique dans l'emploi est illégale dans la quasi-totalité des juridictions. L'argument du PO ne constitue pas une justification légale — optimiser la complicité avec les biais discriminatoires des employeurs est illégal. L'ECO PMP® 2026 place la responsabilité éthique du déploiement de l'IA au niveau du chef de projet — qui ne peut pas se défausser sur le PO. Déléguer la priorité au PO (D) abdique la responsabilité légale du chef de projet alors qu'une discrimination active est en cours.` },

{ id:"IA-006", domaine:"IA & Durabilité", approche:"Prédictif", type:"standard",
  question:`Votre programme de rénovation énergétique de 1 200 logements sociaux (28 M€, 36 mois) a un double objectif : réduction de la consommation d'énergie de 40 % et amélioration du confort des locataires. À mois 20 : réduction énergétique 38 % (proche de l'objectif) ; taux de satisfaction locataires 54 % (objectif 80 %) — plaintes sur les perturbations sans préavis, complexité du thermostat connecté (43 % ne savent pas l'utiliser), qualité acoustique insuffisante des nouvelles fenêtres. Par ailleurs, votre analyse du bilan carbone révèle que les émissions liées au transport des matériaux représentent 28 % du bilan total — non comptabilisées initialement. Comment ajustez-vous votre approche pour les 16 mois restants ?`,
  options:[
    `A. Prioriser l'atteinte de l'objectif de -40 % de consommation énergétique — c'est l'objectif contractuel principal ; les problèmes de satisfaction se résoudront naturellement une fois les travaux terminés.`,
    `B. Réviser l'approche sur 3 axes : (1) Satisfaction locataires — protocole de préavis de 15 jours, sessions de formation au thermostat connecté (présentiel + tutoriels vidéo), évaluation du remplacement des fenêtres problématiques ; (2) Bilan carbone — intégrer les émissions de transport dans le reporting ESG, évaluer le sourcing local pour les matériaux restants et optimiser les flux de livraison ; (3) Révision du plan de bénéfices — actualiser le business case avec les deux dimensions (énergie + satisfaction) et présenter une évaluation honnête au commanditaire.`,
    `C. Concentrer tous les efforts restants sur la satisfaction locataires car c'est le domaine le plus dégradé — retarder si nécessaire les dernières tranches de travaux énergétiques.`,
    `D. Commander une étude externe de satisfaction pour avoir une mesure plus précise avant d'ajuster le programme — les données actuelles peuvent être biaisées.`
  ],
  correct:1,
  explication:`La réponse B est correcte. Ce cas illustre la gestion intégrée de la durabilité dans l'ECO 2026 (T7, T3, T9). Un programme de rénovation énergétique a deux dimensions indissociables : performance énergétique (mesurable) ET bien-être des bénéficiaires (critère social de durabilité). La découverte que les transports représentent 28 % du bilan carbone (non comptabilisé) est une lacune de méthode ESG à corriger dans le reporting. Un taux de satisfaction de 54 % avec 16 mois restants est corrigeable par des actions ciblées.` },

{ id:"IA-007", domaine:"IA & Durabilité", approche:"Hybride", type:"standard",
  question:`En tant que chef de programme pour la digitalisation d'une grande administration publique (45 M€), vous introduisez un outil IA de traitement automatisé des permis de construire — promettant de réduire le délai de 28 à 5 jours pour 70 % des dossiers standard. Avant le déploiement, votre équipe identifie que l'outil ne peut pas traiter les demandes en langues régionales minoritaires (8 % des demandes) et rejette automatiquement les dossiers avec des caractères spéciaux dans les noms de propriétaires (3 % — problème d'encodage affectant souvent des noms étrangers). La correction nécessite 4 mois supplémentaires. Le DG veut lancer immédiatement pour "montrer des résultats" avant les élections municipales dans 3 mois. Que recommandez-vous ?`,
  options:[
    `A. Lancer l'outil immédiatement pour les 89 % de dossiers non affectés, avec un processus manuel exceptionnel pour les 11 % exclus.`,
    `B. Expliquer au DG que le lancement avec des exclusions connues sur des groupes de citoyens identifiables crée des inégalités d'accès au service public constituant une discrimination indirecte illégale. Proposer un lancement en 2 phases : Phase 1 immédiate (3 mois) — déploiement en mode assistance à la décision humaine sur 100 % des dossiers (gain partiel de productivité sans exclusion) ; Phase 2 (mois 4-6) — automatisation complète après correction des deux problèmes. Présenter cette alternative comme une réponse visible aux citoyens sans risque légal.`,
    `C. Recommander d'attendre les 4 mois de correction avant tout déploiement — un service public ne peut pas être lancé avec des défauts connus.`,
    `D. Lancer selon le calendrier du DG mais documenter formellement votre désaccord — vous aurez respecté votre obligation de signalement tout en exécutant la décision du donneur d'ordre.`
  ],
  correct:1,
  explication:`La réponse B est correcte. Les deux problèmes identifiés constituent des discriminations indirectes illégales dans un service public : exclure les locuteurs de langues régionales viole les droits linguistiques, et les problèmes d'encodage de noms étrangers reproduisent une discrimination d'origine. L'option B propose une solution créative qui répond aux deux impératifs : résultats visibles immédiats et conformité légale. L'option D (documenter son désaccord et exécuter quand même) est insuffisante quand l'action envisagée est potentiellement illégale.` },

{ id:"IA-008", domaine:"IA & Durabilité", approche:"Agile", type:"standard",
  question:`Votre chatbot IA de support client pour un opérateur télécom a 6 mois en production. Analyse des 33 % de cas non résolus : (1) 18 % sont des cas où le chatbot a répondu de façon incorrecte MAIS confiante (le client a agi sur une mauvaise information avant de contacter un agent) ; (2) 9 % sont des cas refusés par excès de prudence ; (3) 6 % sont des escalades correctes vers un agent humain. Le problème le plus grave est le groupe (1). Comment gérez-vous cette situation ?`,
  options:[
    `A. Augmenter le seuil de confiance minimum du chatbot pour ne répondre que quand il est très sûr — cela réduira le taux de résolution mais éliminera les réponses incorrectes confiantes.`,
    `B. Traiter en priorité les réponses incorrectes confiantes (groupe 1) : auditer les 18 % de cas problématiques pour identifier les domaines où l'IA est systématiquement incorrecte mais confiante ; corriger les bases de connaissance ou désactiver l'autonomie du chatbot pour ces catégories ; contacter proactivement les clients impactés pour corriger les actions erronées ; mettre en place un indicateur de calibration de la confiance (le niveau de certitude exprimé correspond-il à la précision réelle ?) dans le monitoring continu.`,
    `C. Augmenter l'équipe d'agents humains pour absorber les 33 % de cas non résolus.`,
    `D. Communiquer en début de conversation que "le chatbot peut faire des erreurs et que ses réponses doivent être vérifiées" — une clause de responsabilité appropriée.`
  ],
  correct:1,
  explication:`La réponse B est correcte. Les réponses incorrectes confiantes (groupe 1) représentent le risque le plus grave car elles créent un faux sentiment de certitude conduisant à des actions réelles des clients. La calibration de la confiance — alignement entre le niveau de certitude exprimé et la précision réelle — est un indicateur de qualité IA fondamental. Le contact proactif des clients impactés est une obligation de responsabilité. L'augmentation du seuil de confiance (A) peut réduire les réponses incorrectes mais sans résoudre le problème de calibration de fond.` },

{ id:"IA-009", domaine:"IA & Durabilité", approche:"Prédictif", type:"standard",
  question:`Vous gérez la mise en œuvre d'un système de maintenance prédictive IA dans une usine pétrochimique (6,2 M€, 18 mois). Le système prédit correctement 78 % des pannes mais génère 23 % de fausses alarmes. Après 8 mois d'exposition, l'équipe de maintenance commence à ignorer les alertes ("c'est encore une fausse alarme"). Deux incidents de sécurité viennent de se produire sur des équipements que le système avait correctement alertés mais que l'équipe avait ignorés. Comment résolvez-vous ce problème critique ?`,
  options:[
    `A. Améliorer l'algorithme pour réduire les fausses alarmes à moins de 5 % avant tout autre déploiement.`,
    `B. Traiter simultanément le problème technique et le problème humain : (1) Technique — analyser les 23 % de fausses alarmes pour identifier les patterns et segmenter par niveau de confiance du modèle ; (2) Humain — reconnaître avec l'équipe que leur comportement d'ignorer les alertes est une réponse rationnelle à la fatigue des alertes, co-construire un protocole de traitement différencié par criticité et confiance du modèle ; (3) Sécurité immédiate — procédure d'escalade obligatoire pour les alertes sur équipements critiques ; (4) Enquêter sur les deux incidents pour en tirer les leçons.`,
    `C. Revenir à la maintenance préventive traditionnelle pour les équipements critiques tant que le taux de fausses alarmes n'est pas résolu.`,
    `D. Former intensivement l'équipe sur l'importance de traiter toutes les alertes sans exception — le problème est principalement comportemental.`
  ],
  correct:1,
  explication:`La réponse B est correcte. Ce cas illustre la "fatigue des alertes" ou "normalisation de la déviance" — quand un système génère trop de faux positifs, les opérateurs développent une immunité comportementale aux vraies alertes. Les deux incidents de sécurité en sont la conséquence directe. La solution doit adresser simultanément le problème technique ET le problème humain. La formation seule (D) sans correction technique ne résout rien — les opérateurs ont raison de douter d'un système qui se trompe 23 % du temps. Le retour à la maintenance préventive (C) abandonne prématurément un système à 78 % de précision.` },

{ id:"IA-010", domaine:"IA & Durabilité", approche:"Hybride", type:"standard",
  question:`Votre organisation a intégré un outil IA de génération automatique de rapports de statut de projet. Certains chefs de projet envoient les rapports IA sans les relire. Un rapport a présenté un projet en "bonne progression" alors que votre revue manuelle des données montrait un risque critique non couvert — le rapport IA avait mal interprété l'avancement car des tâches étaient marquées "terminées" dans l'outil alors qu'elles étaient en réalité bloquées. Quelle politique de gouvernance établissez-vous ?`,
  options:[
    `A. Interdire l'utilisation de l'outil de génération de rapports jusqu'à ce que le fournisseur améliore la précision.`,
    `B. Mettre en place une politique de gouvernance à 4 points : (1) Validation humaine obligatoire par le chef de projet avant tout envoi — le rapport IA est un draft, pas un document final ; (2) Les chefs de projet sont responsables de la véracité des rapports signés, qu'ils soient rédigés par l'IA ou manuellement ; (3) L'incident révèle un problème de qualité des données source (statuts déclarés vs réels) — lancer une initiative de rigueur de mise à jour des statuts dans les outils de gestion ; (4) Former les chefs de projet à reconnaître les types de situations où l'IA de reporting est insuffisante.`,
    `C. Continuer sans politique formelle — les chefs de projet expérimentés sauront quand vérifier les rapports IA.`,
    `D. Informer les parties prenantes dans chaque rapport que "ce rapport a été généré par un outil IA et peut contenir des inexactitudes".`
  ],
  correct:1,
  explication:`La réponse B est correcte. L'incident révèle deux problèmes : délégation sans supervision à l'IA, et qualité insuffisante des données source. Le principe fondamental est que la responsabilité professionnelle du chef de projet sur ses rapports est inaliénable — l'IA est un outil d'assistance, pas un substitut à la responsabilité. La rigueur des données source (point 3) est une cause racine que l'IA ne peut pas corriger seule. La continuité sans politique (C) reproduit l'incident. La clause de disclaimer (D) dégrade la confiance des parties prenantes.` },

{ id:"IA-011", domaine:"IA & Durabilité", approche:"Agile", type:"standard",
  question:`Votre équipe Scrum développe une plateforme SaaS pour PME. À sprint 8, le Product Owner demande d'intégrer une fonctionnalité d'"analyse prédictive de la solvabilité des clients" via une API IA tierce. Le système bloquerait automatiquement l'accès à certaines fonctionnalités aux clients dont le score est inférieur à un seuil. Votre développeur lead alerte : le modèle IA est une boîte noire, les données d'entraînement sont inconnues, et des études documentent des biais de ce type de modèle contre les auto-entrepreneurs et petites entreprises récentes. Le PO répond "c'est une fonctionnalité commerciale importante". Comment gérez-vous cette situation ?`,
  options:[
    `A. Implémenter la fonctionnalité — le PO a l'autorité sur le backlog et les décisions commerciales ; les questions académiques sur les biais sont théoriques.`,
    `B. Engager une discussion avec le PO sur les risques concrets : (1) réglementaire — l'EU AI Act classe les systèmes de scoring de solvabilité comme systèmes à risque élevé nécessitant une explicabilité et une documentation obligatoires ; (2) discrimination — les biais documentés contre auto-entrepreneurs et jeunes entreprises peuvent constituer une discrimination commerciale illégale ; proposer une alternative : un système de scoring avec modèle explicable (régression logistique, arbres de décision) utilisant des critères transparents documentés, avec décision humaine finale pour les cas limites.`,
    `C. Ajouter un disclaimer indiquant que "le score est fourni à titre indicatif et ne constitue pas une décision automatisée".`,,
    `D. Réaliser un spike de 2 jours pour évaluer le modèle IA avant de décider — l'implémentation ou le rejet sans évaluation sont tous deux prématurés.`
  ],
  correct:1,
  explication:`La réponse B est correcte. L'EU AI Act (applicable depuis 2024-2026) classe explicitement les systèmes d'évaluation de solvabilité comme systèmes à risque élevé soumis à des obligations strictes d'explicabilité. Un modèle boîte noire non documenté viole ces exigences. La réponse B propose une alternative fonctionnellement équivalente et légalement conforme. Le disclaimer (C) ne satisfait pas les exigences réglementaires quand le système prend des décisions automatisées affectant les droits des clients. Le spike (D) est pertinent mais ne résout pas le problème d'explicabilité requis.` },

{ id:"IA-012", domaine:"IA & Durabilité", approche:"Hybride", type:"standard",
  question:`Vous gérez le déploiement d'une flotte de 320 véhicules électriques dans une collectivité territoriale (14 M€, 30 mois). Le rapport de durabilité annuel demandé par les tutelles présente les données réelles suivantes : réduction CO₂ directes -68 % (objectif -70 %) ; coût total de possession sur 5 ans -12 % (objectif -15 %) ; temps de charge moyen 6,8 heures (objectif <4 heures — infrastructure insuffisante) ; satisfaction des conducteurs 61 % (objectif 80 % — problèmes d'autonomie sur trajets ruraux) ; empreinte carbone du cycle de vie complet (incluant fabrication des batteries) +22 % vs rapport initial (les batteries proviennent d'une usine à 78 % charbon — non intégré dans l'analyse initiale). Comment rédigez-vous ce rapport de durabilité ?`,
  options:[
    `A. Ne présenter que les indicateurs positifs (réduction CO₂ directes, coût TCO) et mentionner les objectifs non atteints comme "en cours d'amélioration" sans donner les chiffres précis.`,,
    `B. Rédiger un rapport complet et transparent : tous les indicateurs avec réalisations vs objectifs (positifs et négatifs) ; analyse causale des écarts (infrastructure de charge insuffisante, trajets ruraux non anticipés, mix énergétique batteries non intégré) ; plan d'action correctif concret pour les 18 mois restants ; note méthodologique reconnaissant la lacune de l'analyse initiale sur l'empreinte cycle de vie — ce rapport servira à améliorer les pratiques de reporting ESG futures.`,
    `C. Reporter la publication de 3 mois pour permettre de corriger les données sur l'empreinte carbone cycle de vie (contacter le fournisseur pour obtenir des données plus favorables).`,
    `D. Publier le rapport avec les données réelles mais ajouter une note de bas de page indiquant que "les méthodes de calcul de l'empreinte carbone cycle de vie varient selon les sources".`
  ],
  correct:1,
  explication:`La réponse B est correcte. Le reporting ESG/durabilité impose une transparence complète — les standards internationaux (GRI, CSRD, TCFD) exigent que les écarts négatifs soient documentés avec la même rigueur que les performances positives. La lacune sur l'empreinte carbone cycle de vie des batteries est une erreur méthodologique significative devant être reconnue publiquement. Sélectionner les indicateurs positifs (A) constitue une falsification partielle. Reporter pour manipuler les données (C) est une tentative de dissimulation. La note de bas de page (D) s'apparente à de la mauvaise foi dans un rapport officiel.` },

{ id:"IA-013", domaine:"IA & Durabilité", approche:"Agile", type:"standard",
  question:`Votre équipe développe une application de microassurance pour agriculteurs en Afrique subsaharienne utilisant un algorithme IA pour personnaliser les primes en temps réel. Deux options d'algorithme : Algorithme X — précision 88 %, boîte noire non explicable, utilise 47 variables dont certaines corrélées à l'ethnie et au groupe socio-économique historique ; Algorithme Y — précision 82 %, entièrement explicable (chaque prime décomposable en facteurs), utilise uniquement des variables climatiques et d'exploitation vérifiables, mais nécessite 3 sprints supplémentaires. Le business development pousse pour X ("performance supérieure = avantage concurrentiel"). Quelle est votre recommandation ?`,
  options:[
    `A. Recommander l'Algorithme X — la précision supérieure (88 % vs 82 %) permet une meilleure tarification du risque, ce qui protège à la fois les assureurs et les agriculteurs.`,
    `B. Recommander l'Algorithme Y : (1) les variables corrélées à l'ethnie dans X constituent un risque de discrimination potentiellement illégale dans les réglementations d'assurance ; (2) les agriculteurs qui ne comprennent pas pourquoi leur prime change n'adopteront pas le produit (adoption = survie du produit) ; (3) les régulateurs d'assurance exigent de plus en plus l'explicabilité (directive IA UE, tendance dans les régulateurs africains) ; (4) un algorithme équitable et compréhensible est plus durable qu'un avantage de précision marginal bâti sur des corrélations discriminatoires.`,
    `C. Recommander une approche hybride : utiliser X en interne pour la tarification du risque, et afficher à l'agriculteur une prime calculée selon Y "pour la transparence".`,,
    `D. Soumettre la décision à un comité d'éthique externe — la complexité dépasse les responsabilités du chef de projet.`
  ],
  correct:1,
  explication:`La réponse B est correcte. L'Algorithme X présente trois risques majeurs : discrimination potentielle (variables corrélées ethnie), non-conformité réglementaire croissante (explicabilité exigée), et risque d'adoption (les agriculteurs ne feront pas confiance à une prime incompréhensible). Dans le contexte de l'assurance agricole en Afrique subsaharienne — où la confiance communautaire est un facteur d'adoption critique — l'Algorithme Y avec 82 % de précision et explicabilité totale est stratégiquement supérieur. L'approche hybride (C) est une tromperie (utiliser X en interne, afficher Y) — éthiquement inacceptable.` },

{ id:"IA-014", domaine:"IA & Durabilité", approche:"Prédictif", type:"standard",
  question:`Un groupe de distribution paneuropéen, votre client pour la construction d'un parc logistique de 120 000 m² (78 M€, 30 mois), vient d'adopter la Science Based Targets initiative (SBTi) et vous demande de produire, pour la première fois, un bilan carbone complet (scope 1, 2 et 3) conforme aux standards GHG Protocol. Ce livrable n'était pas prévu dans le plan de projet initial et votre équipe n'a pas l'expertise. Le client indique que "c'est maintenant une exigence non négociable pour continuer la relation commerciale". Comment répondez-vous ?`,
  options:[
    `A. Refuser poliment — la demande n'est pas dans le périmètre contractuel initial et ajouter un bilan carbone sans budget ni ressources est irréaliste.`,
    `B. Traiter comme une modification formelle du périmètre : (1) soumettre une demande de modification au CCM avec analyse d'impact (ressources, budget, délai nécessaires — estimation 45-65 k€ avec un cabinet spécialisé, 3-4 mois) ; (2) proposer une feuille de route de mise en compétence (court terme : sous-traiter à un cabinet spécialisé ; moyen terme : former 2 membres de l'équipe aux méthodologies carbone pour les programmes futurs) ; (3) voir dans cette demande une opportunité d'avancer sur la compétence durabilité de l'organisation.`,
    `C. Demander à votre équipe de produire une estimation carbone sur la base de ratios sectoriels génériques — le client comprendra que c'est une première approximation.`,
    `D. Externaliser le bilan carbone à un cabinet spécialisé, absorber le coût dans les réserves du programme sans informer le client ni le CCM.`
  ],
  correct:1,
  explication:`La réponse B est correcte. Une demande de bilan carbone conforme GHG Protocol sur un programme de 78 M€ est une modification significative de périmètre nécessitant un processus formel de contrôle des modifications (ECO T10). La qualification de l'impact (45-65 k€, 3-4 mois) est la première étape honnête. Voir l'opportunité de développement de compétence interne en durabilité reflète la vision long terme. L'estimation générique (C) produit un livrable de mauvaise qualité exposant le client à des risques ESG. Absorber sans autorisation (D) contourne le CCM — violation de la gouvernance.` },

{ id:"IA-015", domaine:"IA & Durabilité", approche:"Hybride", type:"standard",
  question:`Vous gérez le déploiement d'un système de détection de fraude bancaire utilisant le machine learning. Le modèle a une précision globale de 94 %. Analyse post-déploiement : taux de faux positifs (transactions légitimes bloquées) = 1,2 % en moyenne, mais 4,8 % pour les transactions depuis des zones géographiques défavorisées et 5,1 % pour les petits commerçants informels. La direction commerciale indique que "le taux de fraude est effectivement légèrement plus élevé dans ces zones, donc le modèle est rationnel". Comment évaluez-vous et gérez-vous ce problème ?`,
  options:[
    `A. Accepter la position de la direction — si le taux de fraude est effectivement plus élevé dans ces zones, la précision différentielle est statistiquement justifiée.`,
    `B. Expliquer que même si la corrélation géographique avec la fraude est statistiquement réelle, un taux de faux positifs 4x supérieur pour des populations déjà financièrement vulnérables constitue un impact disproportionné discriminatoire (les réglementations bancaires imposent une équité de traitement dans l'accès aux services financiers). Lancer une analyse de performance différenciée et explorer des techniques de fair ML (contraintes d'équité sur les faux positifs par groupe) pour réduire le différentiel de traitement sans dégrader significativement la détection de fraude réelle.`,
    `C. Implémenter un seuil de blocage différencié par zone géographique — un seuil plus élevé dans les zones défavorisées réduira mécaniquement les faux positifs.`,
    `D. Mettre en place un processus de contestation accéléré (24h) pour les clients bloqués dans les zones affectées — cela compense partiellement l'impact sans modifier l'algorithme.`
  ],
  correct:1,
  explication:`La réponse B est correcte. Ce cas illustre le "disparate impact" — une pratique peut être statistiquement justifiée sans être légalement ni éthiquement acceptable si elle crée des inégalités structurelles d'accès aux services pour des groupes vulnérables. Les techniques de fair ML permettent de contraindre les modèles pour réduire les disparités de traitement entre groupes. L'inclusion financière (particulièrement stratégique en Afrique) est un impératif qui dépasse la seule optimisation statistique. Le seuil différencié (C) encode la discrimination géographique directement dans les règles.` },

{ id:"IA-016", domaine:"IA & Durabilité", approche:"Agile", type:"standard",
  question:`Vous présentez à votre organisation un cas pour l'adoption d'un outil de planification de projet assisté par IA. L'outil promet 40 % de gain sur la planification initiale, une meilleure détection des conflits de ressources et une cohérence accrue. Vous identifiez aussi des risques : dépendance potentielle à l'outil, risque de réduction des compétences de planification, coût de licence annuel de 85 000 €, risque de sur-confiance dans des plannings IA non contextualisés. Quelle recommandation faites-vous à la direction ?`,
  options:[
    `A. Recommander l'adoption immédiate et complète — le gain de 40 % justifie largement le coût et les risques sont mineurs.`,
    `B. Recommander une adoption progressive et conditionnelle : (1) Phase pilote de 6 mois sur 3-4 projets de complexité variée avec mesure rigoureuse du gain réel (vs 40 % promis) et des effets non désirables ; (2) Maintien d'une formation obligatoire à la planification manuelle — l'IA doit augmenter les compétences, pas les remplacer ; (3) Protocole de validation humaine obligatoire de tous les plannings IA ; (4) Clause contractuelle de réversibilité ; (5) Décision d'adoption permanente basée sur les données du pilote avec critères de succès définis a priori.`,
    `C. Refuser l'adoption — la dépendance à un outil externe pour une compétence core crée un risque stratégique inacceptable et le coût de 85 000 € n'est pas justifié.`,
    `D. Recommander l'adoption en commençant par les projets les plus simples en excluant les projets complexes où les erreurs auraient le plus d'impact.`
  ],
  correct:1,
  explication:`La réponse B est correcte. L'adoption d'outils IA dans les processus de management de projet doit suivre une démarche empirique rigoureuse. Le pilote avec mesure rigoureuse est essentiel car les gains promis par les vendeurs d'IA (40 %) sont souvent surestimés. La formation continue à la planification manuelle est non négociable : si les chefs de projet perdent leurs compétences fondamentales, la dépendance à l'outil devient critique. Les critères de succès définis a priori garantissent une évaluation objective.` },

{ id:"IA-017", domaine:"IA & Durabilité", approche:"Prédictif", type:"standard",
  question:`Vous gérez un projet de rénovation d'un hôpital public (12 M€, 18 mois). L'hôpital vient d'adopter une politique "zéro déchet de chantier en décharge". Votre plan initial prévoyait 35 % de valorisation des déchets. Pour atteindre l'objectif zéro décharge (95 %+) : (1) tri sélectif renforcé (surcoût 28 000 €) ; (2) contrats avec 4 filières de recyclage spécialisées au lieu de 2 (délai supplémentaire 6 semaines en préparation) ; (3) suivi documentaire de 14 flux de déchets (0,5 ETP/18 mois). L'entreprise générale soumettra un claim de 95 000 €. Comment intégrez-vous ces exigences dans votre plan ?`,
  options:[
    `A. Refuser l'objectif "zéro décharge" car non prévu dans les spécifications initiales et générant un surcoût (95 k€ + 28 k€) non prévu.`,,
    `B. Intégrer par un processus formel : (1) soumettre une demande de modification au CCM documentant l'impact complet (123 000 € de surcoût estimé, 6 semaines additionnelles, 0,5 ETP) ; (2) négocier avec l'entreprise générale le claim de 95 000 € en demandant une décomposition détaillée — certains coûts peuvent être optimisés ; (3) évaluer si des économies compensatrices existent ailleurs dans le projet ; (4) proposer à l'hôpital un amendement contractuel intégrant formellement l'objectif zéro décharge comme exigence qualité avec ses impacts documentés.`,
    `C. Accepter l'objectif et absorber le surcoût dans les réserves du programme sans en informer le CCM.`,
    `D. Proposer un objectif intermédiaire de 70 % de valorisation comme compromis raisonnable entre 35 % initial et 95 % demandé.`
  ],
  correct:1,
  explication:`La réponse B est correcte. L'intégration d'exigences de durabilité en cours de projet constitue une modification de périmètre devant passer par le processus formel de contrôle des modifications (ECO T10). La transparence sur l'impact financier (123 000 €) est une obligation éthique. La négociation du claim de l'entreprise générale est une responsabilité du chef de projet (T5 — Achats). Absorber sans autorisation (C) viole la gouvernance. Le compromis à 70 % (D) retire au client son droit de décider du niveau d'ambition.` },

{ id:"IA-018", domaine:"IA & Durabilité", approche:"Agile", type:"standard",
  question:`Vous gérez un programme d'innovation numérique. Un projet développe un outil IA générative pour automatiser la rédaction de rapports financiers. Lors des tests, les utilisateurs découvrent que l'outil peut générer des rapports qui "paraissent" conformes mais contiennent parfois des calculs subtillement incorrects ou des formulations amplifiant les performances positives en minimisant les signaux négatifs. Un directeur financier qui a utilisé l'outil dit "c'est parfait — le rapport que ça génère est exactement ce que je voulais présenter au CA". Comment réagissez-vous ?`,
  options:[
    `A. Déployer en production — si le directeur financier est satisfait du résultat, c'est que l'outil répond au besoin.`,
    `B. Alerter la direction du programme et la conformité : (1) les rapports financiers avec des calculs incorrects constituent des documents potentiellement erronés pouvant induire en erreur les organes de gouvernance (CA, auditeurs, régulateurs) — risque légal majeur ; (2) un outil IA qui amplifie les performances positives et minimise les signaux négatifs produit des rapports biaisés non conformes aux obligations de reporting financier ; (3) la satisfaction du directeur financier ("c'est ce que je voulais") est précisément un signal d'alerte — l'outil produit ce que l'utilisateur veut entendre, pas la réalité. Bloquer le déploiement jusqu'à correction.`,,
    `C. Ajouter une mention "généré par IA — à vérifier par un professionnel" sur chaque rapport et former les utilisateurs à vérifier les chiffres avant diffusion.`,,
    `D. Demander à l'équipe de data science de corriger les erreurs de calcul mais de conserver la fonctionnalité de mise en forme "optimisée" — les erreurs de calcul sont des bugs techniques, la présentation favorable est une feature de communication.`
  ],
  correct:1,
  explication:`La réponse B est correcte. La satisfaction du directeur financier est paradoxalement un signal d'alarme — elle indique que l'outil est utilisé pour produire des rapports orientés plutôt que fidèles. Les obligations de reporting financier (IFRS, normes comptables, obligations CA/auditeurs) exigent une représentation fidèle et exhaustive — y compris les signaux négatifs. La mention "généré par IA" (C) ne suffit pas quand l'outil produit des calculs incorrects. La distinction entre "bug de calcul" (à corriger) et "présentation favorable" (à conserver) dans l'option D est éthiquement inacceptable dans un contexte de reporting financier.` },

{ id:"IA-019", domaine:"IA & Durabilité", approche:"Hybride", type:"standard",
  question:`Votre organisation a une politique d'achats durables imposant à tous les projets de plus de 2 M€ d'évaluer et prioriser les fournisseurs selon leurs critères ESG. Dans votre programme de construction d'un centre de données (23 M€), l'appel d'offres pour les équipements de refroidissement reçoit 4 offres. Fournisseur A : -18 % vs budget, technologie éprouvée, aucune politique ESG, sous-traitance sans contrôle des conditions de travail. Fournisseur B : dans le budget, certifié ISO 14001, rapport ESG publié, conditions de travail auditées, délai +4 semaines. Fournisseur C : +12 % vs budget, technologie innovante adiabatique (-40 % eau), certifié B-Corp, première implémentation à cette échelle (risque technique). Fournisseur D : dans le budget, rapport ESG partiel, technologie standard, délai dans les objectifs. Comment gérez-vous cette décision ?`,
  options:[
    `A. Choisir le Fournisseur A car l'économie de 18 % représente une ressource réinvestissable dans d'autres composants du programme.`,
    `B. Conduire une analyse multicritères formelle intégrant les dimensions financière, technique, calendaire et ESG conformément à la politique d'achats durables : documenter les critères et pondérations avant l'évaluation (ex : coût 35 %, technique 25 %, délai 15 %, ESG 25 %), appliquer la grille à chaque fournisseur, présenter l'analyse et la recommandation au CCM — vraisemblablement B ou D selon les pondérations, avec note sur C (innovant mais risqué) et exclusion motivée de A (non-conformité politique ESG).`,
    `C. Choisir le Fournisseur C car sa technologie adiabatique réduit de 40 % la consommation d'eau — c'est l'option la plus alignée avec les objectifs ESG à long terme.`,
    `D. Négocier avec le Fournisseur A pour qu'il adopte une politique ESG minimale avant signature — bénéficier de l'économie budgétaire tout en respectant l'esprit de la politique ESG.`
  ],
  correct:1,
  explication:`La réponse B est correcte. La décision d'achat avec politique ESG obligatoire doit suivre un processus formel de pondération multicritères — pas une décision unilatérale du chef de projet (ECO T2 — Conformité, T5 — Achats). Documenter les critères et pondérations avant l'évaluation évite le biais post-hoc. L'exclusion motivée du Fournisseur A est cohérente avec la politique — une économie budgétaire ne justifie pas de contourner une politique organisationnelle formelle. La négociation ESG avec A (D) est une tentative de contournement — sans audit indépendant, une déclaration d'intention est insuffisante.` },

{ id:"IA-020", domaine:"IA & Durabilité", approche:"Agile", type:"standard",
  question:`En tant que chef de projet dans une organisation de conseil, vous êtes sollicité par un client pour livrer une analyse comparative de marché. Vous avez accès à un outil d'IA générative capable de générer cette analyse en 2 heures au lieu de 5 jours de travail manuel. Votre contrat stipule "analyses réalisées par nos consultants seniors". Le client ne sait pas que vous disposez de cet outil. Si vous l'utilisez, vous facturerez 5 jours selon votre contrat alors que vous n'y aurez passé que 2 heures. Comment gérez-vous cette situation ?`,
  options:[
    `A. Utiliser l'outil IA et facturer 5 jours — le client achète un résultat (l'analyse) pas une méthode, et vous avez toujours supervisé et validé le contenu.`,
    `B. Deux options éthiques : (1) Informer le client que vous utilisez des outils d'IA pour accélérer l'analyse — renégocier les conditions (facturation au résultat plutôt qu'au temps, ou facturer 1 journée de validation et supervision) ; (2) Ne pas utiliser l'outil IA et réaliser l'analyse selon les termes contractuels actuels. Facturer 5 jours pour 2 heures de travail réel constitue une fraude contractuelle, indépendamment de la qualité du résultat. Si l'IA devient un avantage compétitif de votre cabinet, renégociez vos modalités de facturation.`,
    `C. Utiliser l'outil IA mais facturer uniquement 2 jours pour partager équitablement le gain de productivité avec le client.`,
    `D. Utiliser l'outil IA pour la structure et les données brutes, puis consacrer les 5 jours à l'enrichissement et la personnalisation — ainsi vous avez réellement travaillé 5 jours.`
  ],
  correct:1,
  explication:`La réponse B est correcte. Ce cas illustre un problème éthique fondamental : facturer un temps qui n'a pas été consacré à la mission constitue une fraude contractuelle, même si le résultat est de qualité égale ou supérieure. Le Code d'Éthique PMI (honnêteté, intégrité) est explicite. La transformation de la chaîne de valeur par l'IA crée des nouveaux modèles de facturation (à la valeur, au résultat) que les professionnels doivent négocier transparentement avec leurs clients — pas exploiter unilatéralement. Facturer 2 jours (C) est plus honnête mais reste dans une zone ambiguë si le contrat prévoit 5 jours. L'enrichissement sur 5 jours (D) peut être légitime mais doit être expliqué au client.` },

{ id:"IA-021", domaine:"IA & Durabilité", approche:"Hybride", type:"standard",
  question:`Vous êtes chef de projet pour la mise en place d'un système IA de triage des patients aux urgences d'un CHU. Le système utilise des données cliniques, vitales et administratives pour attribuer une priorité de prise en charge. En phase de test clinique, vous identifiez que le système attribue systématiquement une priorité légèrement inférieure aux patients de plus de 75 ans pour certaines pathologies, sans que cela soit justifié médicalement — le pattern suggère que les données d'entraînement historiques reflétaient des pratiques implicites de déprioritisation des personnes âgées. Les médecins urgentistes sont divisés : certains veulent déployer malgré le biais ("c'est mieux que l'humain pour 90 % des cas"), d'autres veulent attendre la correction. Quelle est votre position ?`,
  options:[
    `A. Déployer avec les médecins qui souhaitent l'utiliser — si 90 % des décisions sont meilleures, le bénéfice net est positif.`,
    `B. Refuser le déploiement jusqu'à correction du biais : dans un système de triage médical, un biais systématique de déprioritisation basé sur l'âge constitue une discrimination illégale et médicalement dangereuse — il n'existe pas de seuil acceptable de discrimination dans les décisions de triage vital. Initier immédiatement une correction de l'algorithme avec techniques de débiaisage, auditer les données d'entraînement pour identifier et corriger les pratiques historiques discriminatoires encodées, et constituer un comité pluridisciplinaire (médecins, éthiciens, juristes, patients) pour superviser la validation clinique du système corrigé avant tout déploiement.`,
    `C. Déployer en mode "aide à la décision" où le système fournit une recommandation mais les médecins gardent l'autorité finale — le biais humain de supervision compensera le biais algorithmique.`,,
    `D. Déployer uniquement dans les cas où les patients de plus de 75 ans ne sont pas concernés et traiter ce groupe en triage manuel traditionnel.`
  ],
  correct:1,
  explication:`La réponse B est correcte. Dans un système de triage médical, un biais systématique basé sur l'âge est une discrimination illégale et une faute médicale potentielle — l'argument "90 % d'amélioration" ne justifie pas un biais discriminatoire dans les 10 % restants quand ces 10 % peuvent représenter des décisions vitales pour des patients âgés. L'ECO PMP® 2026 (IA & Durabilité) est clair : les systèmes IA dans des contextes à enjeux vitaux doivent être exempts de biais discriminatoires avant tout déploiement. Le "mode aide à la décision" (C) ne résout pas le problème si les médecins surchargés aux urgences ont tendance à suivre la recommandation IA par défaut.` },

{ id:"IA-022", domaine:"IA & Durabilité", approche:"Agile", type:"standard",
  question:`Votre organisation utilise un Large Language Model (LLM) commercial pour assister les chefs de projet dans la rédaction de plans de gestion des risques. Vous constatez que plusieurs chefs de projet ont soumis des plans de risques au comité de pilotage qui contenaient des risques "hallucinés" par le LLM — des risques formulés de façon très professionnelle mais basés sur des données incorrectes (ex : "selon la réglementation X de 2023 article Y, le projet est exposé au risque Z" — la réglementation X n'existe pas). Les membres du comité de pilotage n'ont pas détecté les erreurs. Comment gérez-vous cette situation systémique ?`,
  options:[
    `A. Interdire immédiatement l'utilisation des LLM pour tout document soumis au comité de pilotage.`,
    `B. Traiter le problème systémiquement : (1) Communication immédiate aux chefs de projet sur le phénomène des "hallucinations" des LLM (informations fabriquées présentées de façon convaincante) — particulièrement dangereux dans les registres de risques car les risques fabriqués ont l'air crédibles ; (2) Mise en place d'une obligation de vérification factuelle de toute référence réglementaire, statistique ou événement historique citée par un LLM avant intégration dans un document officiel ; (3) Formation à l'utilisation des LLM comme assistants de structuration et formulation (points forts) pas comme sources de données factuelles (point faible) ; (4) Revue des registres de risques récemment soumis pour identifier et corriger les erreurs.`,,
    `C. Maintenir l'utilisation des LLM mais demander à tous les chefs de projet de mentionner dans leurs documents que "ce document a été assisté par IA".`,,
    `D. Remplacer le LLM commercial par un modèle interne entraîné uniquement sur les données de l'organisation — cela éliminera le risque d'hallucination de données externes.`
  ],
  correct:1,
  explication:`La réponse B est correcte. Les hallucinations des LLM sont un phénomène documenté et bien connu — particulièrement dangereux quand les erreurs concernent des références réglementaires ou des données factuelles qui sonnent crédibles. La solution systémique combine formation (comprendre les limites des LLM), processus (vérification obligatoire des faits), et correction rétrospective (revoir les documents récents). L'interdiction totale (A) est disproportionnée — les LLM ont une valeur réelle pour la structuration et la formulation. La mention "assisté par IA" (C) décharge la responsabilité sur le lecteur sans résoudre le problème. Un modèle interne (D) ne résout pas le problème des hallucinations.` },

{ id:"IA-023", domaine:"IA & Durabilité", approche:"Prédictif", type:"standard",
  question:`Dans un projet de construction d'une centrale solaire de 45 MW (38 M€, 24 mois), votre client intègre des critères ESG dans l'évaluation de performance du projet, incluant un indicateur de "contenu local" : au moins 35 % de la valeur des achats doit provenir d'entreprises locales (dans un rayon de 150 km). Au mois 12, votre analyse montre que le contenu local est à 22 % seulement — principalement parce que les panneaux photovoltaïques (qui représentent 55 % des achats totaux) ne sont pas disponibles localement. Comment gérez-vous cet écart par rapport à l'objectif ESG ?`,
  options:[
    `A. Considérer l'objectif de 35 % comme non atteignable du fait de la nature des équipements principaux et le documenter comme "exception justifiée" dans le rapport ESG.`,,
    `B. Analyser rigoureusement la situation : les panneaux PV représentant 55 % des achats ne sont pas disponibles localement (fait avéré) — l'objectif de 35 % sur la totalité des achats était peut-être irréaliste sans exclure les équipements non disponibles localement de la base de calcul. Proposer au client : (1) une révision de l'indicateur (ex : 35 % sur les achats hors panneaux PV, ou 55 % sur les achats de biens et services disponibles localement) ; (2) identifier et maximiser les opportunités de contenu local sur les autres achats (BTP, câblage, installation, formation, maintenance) pour atteindre un maximum réalisable ; (3) documenter honnêtement l'analyse dans le reporting ESG avec le plan d'action.`,
    `C. Comptabiliser la main d'œuvre locale (installation, formation) comme "achat local" pour augmenter l'indicateur de contenu local artificiellement.`,,
    `D. Changer le fournisseur de panneaux PV pour un fournisseur local, même si le coût est 25 % supérieur et la qualité technique est inférieure — l'objectif ESG de contenu local prime.`
  ],
  correct:1,
  explication:`La réponse B est correcte. Ce cas illustre un objectif ESG mal calibré face aux réalités de la chaîne d'approvisionnement. La solution n'est pas de falsifier les données (C), de compromettre la qualité technique (D), ou de reclasser comme "exception" sans dialogue (A) — mais d'engager une discussion honnête avec le client pour recalibrer l'indicateur sur une base réaliste. La révision de l'indicateur (ex : contenu local sur les achats disponibles localement) est une pratique standard dans les rapports ESG sérieux (GRI). Le reporting honnête de la situation et du plan d'action préserve la crédibilité du programme ESG.` },

{ id:"IA-024", domaine:"IA & Durabilité", approche:"Hybride", type:"standard",
  question:`Votre organisation vient de déployer un outil d'IA pour automatiser les décisions de priorisation de votre portefeuille de projets. L'outil analyse les projets selon des critères de ROI, risque et alignement stratégique, et recommande quels projets démarrer, continuer ou arrêter. Lors du premier comité de portefeuille assisté par l'outil, l'IA recommande d'arrêter un projet de conformité réglementaire (faible ROI financier) et de prioriser 3 projets commerciaux à fort ROI. Le directeur général trouve la recommandation "logique". Comment évaluez-vous cette recommandation ?`,
  options:[
    `A. Valider la recommandation de l'IA — les 3 projets commerciaux à fort ROI créent plus de valeur que le projet de conformité à faible ROI.`,
    `B. Alerter le DG que l'IA a optimisé sur le ROI financier mais n'a pas correctement évalué le risque de non-conformité réglementaire : arrêter un projet de conformité peut exposer l'organisation à des amendes, sanctions réglementaires, ou suspension d'activité dont l'impact financier peut dépasser de loin le ROI des 3 projets commerciaux. Recommander de corriger les paramètres de l'algorithme pour intégrer les projets de conformité réglementaire obligatoire comme non-négociables (not subject to ROI optimization) avant toute utilisation du système pour les décisions de portefeuille.`,
    `C. Accepter la recommandation mais demander une analyse complémentaire sur le projet de conformité pour s'assurer qu'il peut être retardé sans conséquence.`,
    `D. Remplacer l'outil IA de portefeuille par une décision humaine — les décisions de portefeuille sont trop stratégiques pour être déléguées à un algorithme.`
  ],
  correct:1,
  explication:`La réponse B est correcte. Ce cas illustre un défaut de paramétrage d'un outil IA de gouvernance de portefeuille (ECO T8 — Gouvernance de portefeuille). L'algorithme a optimisé sur une métrique (ROI financier) en ignorant une contrainte fondamentale (conformité réglementaire non optionnelle). Les projets de conformité réglementaire ne sont pas comparables à des projets d'investissement discrétionnaires — ils doivent être traités comme des contraintes, pas comme des options. La correction du paramétrage de l'algorithme est la solution systémique. Déléguer entièrement à l'humain (D) ignore les bénéfices réels de l'outil IA de portefeuille.` },

{ id:"IA-025", domaine:"IA & Durabilité", approche:"Agile", type:"standard",
  question:`Vous êtes Scrum Master d'une équipe qui développe un système de recommandation de contenu pour une plateforme d'apprentissage destinée aux enfants de 8 à 14 ans. Lors du sprint 6, votre data scientist identifie que l'algorithme de recommandation optimisé pour maximiser le "temps passé sur la plateforme" recommande systématiquement des contenus de plus en plus sensationnels et émotionnellement stimulants pour maintenir l'engagement — un pattern similaire à celui identifié dans les controverses des réseaux sociaux. Les parents qui utilisent la plateforme ne sont pas informés de ce mécanisme. Quelle est votre position ?`,
  options:[
    `A. Continuer l'optimisation sur le temps de session — c'est l'indicateur de succès défini par le client et une plateforme d'apprentissage à fort engagement est bénéfique pour les enfants.`,
    `B. Alerter immédiatement le Product Owner et la direction : optimiser l'engagement d'enfants de 8-14 ans via des contenus de plus en plus sensationnels est éthiquement problématique (risque de dépendance aux contenus stimulants, impact sur la qualité d'apprentissage, manipulation psychologique de mineurs) et potentiellement non conforme aux réglementations sur la protection des mineurs en ligne (COPPA, DSA enfants). Proposer de remplacer la métrique "temps de session" par des métriques d'apprentissage réel (progression de compétences, taux de complétion de modules, résultats aux évaluations) et concevoir l'algorithme pour maximiser la valeur pédagogique, pas l'engagement maximal.`,,
    `C. Informer les parents des mécanismes de recommandation via les CGU de la plateforme — la transparence suffit à remplir les obligations légales.`,
    `D. Limiter les sessions à 45 minutes pour compenser les effets de l'algorithme d'engagement — une limite de temps protège les enfants sans modifier l'algorithme.`
  ],
  correct:1,
  explication:`La réponse B est correcte. L'optimisation de l'engagement des mineurs via des contenus de plus en plus sensationnels est précisément le mécanisme documenté dans les controverses des réseaux sociaux (Facebook, TikTok) — avec des effets prouvés sur la santé mentale des adolescents. Sur une plateforme d'apprentissage pour enfants, ce mécanisme contredit l'objectif pédagogique fondamental. Les réglementations sur la protection des mineurs en ligne (DSA, COPPA) réglementent précisément ce type de design algorithmique. Remplacer la métrique d'engagement par des métriques pédagogiques est la solution alignée sur la mission réelle de la plateforme. Les CGU (C) et les limites de temps (D) ne corrigent pas le problème algorithmique de fond.` },

{ id:"IA-026", domaine:"IA & Durabilité", approche:"Prédictif", type:"standard",
  question:`Dans le cadre d'un programme de construction d'infrastructures portuaires (125 M€, 5 ans), vous devez calculer et reporter le bilan carbone du programme selon la méthode GHG Protocol. Le scope 1 (émissions directes) = 2 340 tCO₂e, le scope 2 (énergie) = 890 tCO₂e. Pour le scope 3 (indirects), vous disposez de données sur les matériaux (acier, béton, bitume = 18 400 tCO₂e) et le transport (4 200 tCO₂e), mais pas sur les émissions "amont de la chaîne d'approvisionnement" ni sur les émissions "utilisation future de l'infrastructure" sur 30 ans. Votre client veut un "bilan carbone complet" pour son rapport RSE annuel. Comment gérez-vous les lacunes de données ?`,
  options:[
    `A. Reporter uniquement les données disponibles (scope 1 + 2 + scope 3 partiel) sans mentionner les lacunes — les données disponibles représentent l'essentiel des émissions.`,
    `B. Reporter toutes les données disponibles de façon transparente avec leur périmètre exact et leurs limitations : total des émissions calculées = 25 830 tCO₂e (scope 1 + 2 + scope 3 matériaux + transport) ; éléments non calculés (amont chaîne d'approvisionnement, utilisation future) documentés avec justification (données non disponibles, méthode de calcul non standardisée pour l'infrastructure spécifique) et plan d'amélioration pour les exercices futurs. Un bilan carbone transparent sur ses limites est plus crédible et plus conforme aux standards GHG Protocol qu'un bilan incomplet présenté comme complet.`,
    `C. Utiliser des facteurs d'émission sectoriels pour estimer les données manquantes et présenter un bilan complet — les estimations vaut mieux que les lacunes.`,
    `D. Solliciter un audit externe pour valider les données disponibles avant de reporter quoi que ce soit — le client mérite des données validées, pas des estimations.`
  ],
  correct:1,
  explication:`La réponse B est correcte. Le GHG Protocol (et les standards qui en découlent comme CSRD) autorise et encourage explicitement la transparence sur les limites du reporting plutôt que la fabrication de données complètes. Une méthode d'estimation sectorielle (C) pour les données manquantes peut être acceptable si les facteurs sont reconnus et documentés — mais elle doit également être présentée comme estimation, pas comme mesure. La transparence sur les périmètres calculés et non calculés est la pratique professionnelle standard dans les bilans carbone certifiables. Un rapport honnête sur ses limites renforce la crédibilité du reporting RSE du client.` },

{ id:"IA-027", domaine:"IA & Durabilité", approche:"Hybride", type:"standard",
  question:`Vous êtes chef de projet pour le développement d'une application de reconnaissance faciale pour le contrôle d'accès dans une entreprise de 3 000 employés. Les tests de performance révèlent que le système a un taux de reconnaissance correcte de 98,2 % globalement, mais de seulement 91,4 % pour les employés à peau foncée et de 96,8 % pour les femmes. La DRH considère que 91,4 % est "acceptable" car "ça reste meilleur que beaucoup d'alternatives". Le client veut déployer immédiatement. Quelle est votre position ?`,
  options:[
    `A. Déployer — 91,4 % de reconnaissance est statistiquement très bon et la DRH a évalué et accepté le risque.`,
    `B. Refuser le déploiement avec les performances actuelles : un taux de faux négatifs de 8,6 % pour les employés à peau foncée signifie que ces employés subissent des refus d'accès légitimes 7x plus fréquemment que les autres (1,8 % global) — ce qui constitue une discrimination indirecte fondée sur l'origine, illégale dans la plupart des juridictions. Recommander la correction du modèle avant déploiement (données d'entraînement plus représentatives, techniques de débiaisage) et établir un standard de performance équitable : taux de faux négatifs < 2 % pour tous les groupes démographiques, pas seulement en moyenne globale.`,
    `C. Déployer avec un processus de recours manuel rapide pour les employés non reconnus — cela compense le biais sans bloquer le déploiement.`,
    `D. Accepter le déploiement uniquement si la DRH obtient le consentement écrit de tous les employés à peau foncée sur les performances différenciées.`
  ],
  correct:1,
  explication:`La réponse B est correcte. Le calcul révèle le problème : 8,6 % de faux négatifs pour les employés à peau foncée = 7x plus de refus d'accès que les autres. Dans un système de contrôle d'accès professionnel, cela crée une perturbation quotidienne et humiliante pour un groupe d'employés identifié par leur origine — discrimination indirecte illégale. La "moyenne globale de 98,2 %" masque des disparités de performance inacceptables. Le standard d'équité (< 2 % pour tous les groupes) est la métrique correcte. Le recours manuel (C) impose aux employés discriminés une charge administrative supplémentaire comme "compensation" — ce qui aggrave le traitement différentiel.` },

{ id:"IA-028", domaine:"IA & Durabilité", approche:"Agile", type:"standard",
  question:`Votre équipe développe un assistant IA pour les services juridiques d'une grande entreprise. L'assistant peut rechercher de la jurisprudence, rédiger des premières versions de contrats et répondre à des questions juridiques des managers. Lors des tests, vous constatez que sur 200 questions juridiques testées, l'assistant donne des réponses correctes dans 87 % des cas — mais les 13 % d'erreurs concernent des cas complexes où la réponse est présentée avec la même confiance que les réponses correctes. Les avocats internes s'inquiètent que les managers "feront confiance à l'IA pour des questions qui nécessitent un avis d'avocat". Comment concevez-vous le déploiement ?`,
  options:[
    `A. Déployer avec les performances actuelles — 87 % de précision est excellent et les 13 % d'erreurs peuvent être corrigés dans les versions futures.`,
    `B. Déployer avec un design de confiance calibrée : (1) afficher clairement pour chaque réponse un indicateur de confiance ("Confiance élevée — jurisprudence abondante" vs "Confiance limitée — droit en évolution") ; (2) pour les questions à faible confiance ou fort enjeu, afficher automatiquement une recommandation de validation par un avocat interne ; (3) journaliser toutes les questions et réponses pour revue périodique par les avocats ; (4) former les managers sur les limites de l'assistant et les types de questions nécessitant toujours une validation humaine — l'IA est un accélérateur pour les cas simples, pas un substitut à l'avis juridique.`,,
    `C. Limiter l'accès de l'assistant aux seuls avocats internes qui peuvent valider les réponses avant de les transmettre aux managers.`,
    `D. Attendre que la précision atteigne 95 % avant de déployer — le risque juridique de 13 % d'erreurs est trop élevé pour une utilisation en production.`
  ],
  correct:1,
  explication:`La réponse B est correcte. Le problème n'est pas la précision de 87 % en elle-même — c'est la confiance uniforme affichée sur toutes les réponses (correctes ou incorrectes). Un bon design d'IA responsable inclut une calibration de la confiance transparente pour l'utilisateur. L'indicateur de confiance différencié, les recommandations automatiques de validation pour les cas complexes, et la formation des utilisateurs sur les limites de l'assistant créent un système où l'IA augmente l'efficacité juridique sans remplacer le jugement professionnel. Limiter aux avocats (C) annule les bénéfices d'accessibilité. Attendre 95 % (D) est arbitraire — 87 % avec confiance calibrée peut être plus sûr que 95 % sans calibration.` },

{ id:"IA-029", domaine:"IA & Durabilité", approche:"Prédictif", type:"standard",
  question:`Vous êtes directeur de programme pour la transformation numérique d'un réseau de 48 hôpitaux publics (280 M€, 6 ans). Au cours de l'année 3, une analyse comparative avec les benchmarks sectoriels révèle que votre programme consomme 34 % d'énergie supplémentaire par rapport aux programmes équivalents en raison d'une architecture de data centers non optimisée décidée en début de programme. La correction (migration vers une architecture cloud hybride plus efficiente) coûterait 8,2 M€ et prendrait 18 mois, mais générerait 12,4 M€ d'économies d'énergie sur les 3 années restantes + les 10 années d'exploitation suivantes. Comment présentez-vous ce sujet au comité de pilotage ?`,
  options:[
    `A. Ne pas présenter ce sujet — la décision d'architecture a été prise en début de programme et revenir dessus créerait de la confusion et remettrait en question la qualité de la gouvernance initiale.`,
    `B. Présenter une analyse complète et honnête au comité de pilotage : (1) état actuel documenté vs benchmarks (surcoût énergétique de 34 %) ; (2) analyse coût-bénéfice de la correction (investissement 8,2 M€ vs économies 12,4 M€ + bénéfices environnementaux sur 13 ans) ; (3) plan de migration avec jalons et risques ; (4) alternative de non-correction avec ses coûts sur la durée d'exploitation. La responsabilité de transparence envers le comité inclut de signaler les opportunités d'amélioration identifiées en cours de programme, même quand elles remettent en question des décisions passées.`,
    `C. Corriger l'architecture discrètement en réallouant des budgets existants — l'amélioration sera visible dans les rapports de performance sans créer de bruit politique autour d'une erreur initiale.`,
    `D. Attendre la fin du programme pour adresser l'optimisation énergétique — toute modification en cours de programme d'une décision d'architecture fondamentale est trop risquée.`
  ],
  correct:1,
  explication:`La réponse B est correcte. L'identification d'une opportunité d'amélioration significative (ROI positif sur l'investissement de correction) est une information que le comité de pilotage doit recevoir pour exercer sa responsabilité de gouvernance (ECO T8 — Gouvernance de portefeuille). La transparence inclut les opportunités d'amélioration, pas seulement les problèmes. La correction discrète (C) contourne la gouvernance et constitue une réallocation non autorisée de budgets. Attendre la fin du programme (D) signifie renoncer à 3 ans d'économies d'énergie et d'émissions réduites. L'analyse coût-bénéfice positive (12,4 M€ vs 8,2 M€) justifie clairement la présentation au comité.` },

{ id:"IA-030", domaine:"IA & Durabilité", approche:"Agile", type:"standard",
  question:`Vous êtes chef de projet pour le développement d'un outil d'IA de scoring du crédit immobilier dans une banque. L'algorithme a été entraîné sur 15 ans de données historiques de prêts. Après 6 mois en production, une analyse interne révèle que le système approuve automatiquement 73 % des demandes dans les quartiers à revenu élevé mais seulement 31 % dans les quartiers défavorisés — même en contrôlant les variables financières (revenu, apport, taux d'endettement). La direction de la banque indique que "c'est le marché" et que "le risque est objectivement plus élevé dans ces zones". En tant que chef de projet responsable du système, quelle est votre position ?`,
  options:[
    `A. Accepter l'analyse de la direction — si les variables de contrôle ont été intégrées et que l'écart persiste, il reflète un risque réel différentiel entre les quartiers.`,
    `B. Exprimer une préoccupation sérieuse et demander une analyse approfondie : si l'écart d'approbation persiste après contrôle des variables financières pertinentes (revenu, apport, endettement), cela suggère que l'algorithme utilise l'adresse géographique (ou des variables corrélées) comme proxy de risque — ce qui peut constituer du redlining (discrimination géographique historiquement associée à la discrimination raciale) illégal dans de nombreuses juridictions. Recommander un audit indépendant par des experts en équité algorithmique et en droit du crédit, et suspendre l'automatisation des décisions dans les quartiers défavorisés en attendant les résultats de l'audit.`,
    `C. Demander à l'équipe de data science de neutraliser l'adresse géographique comme variable d'entrée du modèle — si la variable n'est pas utilisée directement, le modèle ne peut pas discriminer géographiquement.`,
    `D. Informer les régulateurs bancaires de la situation et attendre leurs instructions avant de prendre une position interne — les décisions sur l'équité du crédit relèvent de la supervision réglementaire.`
  ],
  correct:1,
  explication:`La réponse B est correcte. Le "redlining" (discrimination dans l'accès au crédit basée sur la localisation géographique, souvent corrélée à la composition raciale des quartiers) est illégal dans la plupart des pays avec des réglementations bancaires avancées (Fair Housing Act aux USA, équivalents européens). La persistance d'un écart d'approbation significatif après contrôle des variables financières pertinentes est un signal sérieux de discrimination indirecte. La neutralisation simple de l'adresse (C) ne résout pas le problème si d'autres variables sont des proxies géographiques (type d'emploi, école fréquentée, etc.). Un audit indépendant est la démarche appropriée avant de conclure dans un sens ou dans l'autre.` },
,
// ── Questions supplémentaires Personnes ──
{ id:"P-031", domaine:"Personnes", approche:"Agile", type:"standard",
  question:`Vous êtes chef de projet d'une équipe de 8 développeurs. Lors du sprint 5, vous remarquez que deux membres ne participent jamais aux discussions techniques pendant les réunions de planification, bien qu'ils soient compétents selon leurs livrables individuels. En aparté, ils vous confient qu'ils "ne voient pas l'utilité de ces réunions". Comment abordez-vous cette situation ?`,
  options:[
    `A. Rendre la participation aux réunions obligatoire et noter les absences — la discipline collective est non négociable dans une équipe Agile.`,
    `B. Explorer avec eux les raisons de ce désengagement (format inadapté ? sentiment que leur avis n'est pas pris en compte ? préférence pour la communication écrite ?) ; tester des adaptations du format (réunions plus courtes, contribution asynchrone préalable, rôles tournants d'animateur) pour voir ce qui augmente leur engagement réel.`,
    `C. Accepter la situation — certains profils sont naturellement introvertis et leur contribution individuelle est suffisante.`,
    `D. Les retirer des réunions de planification et leur transmettre les décisions par email pour gagner en efficacité collective.`,
  ],
  correct:1,
  explication:`La réponse B est correcte. Le désengagement en réunion est souvent un symptôme d'un problème de format ou de dynamique, pas d'un manque de motivation. Comprendre les causes réelles avant d'agir permet de trouver des adaptations qui bénéficient à toute l'équipe. Rendre la participation obligatoire (A) sans adresser le fond crée une présence physique sans engagement réel. Accepter (C) prive l'équipe de perspectives précieuses. Exclure (D) aggrave le problème d'intégration.`,
},

{ id:"P-032", domaine:"Personnes", approche:"Prédictif", type:"standard",
  question:`Dans un projet de 24 mois, votre équipe de 15 personnes traverse une période de forte pression (3 jalons critiques en 6 semaines). Vous constatez que les heures supplémentaires s'accumulent (moyenne de 55h/semaine), que les erreurs augmentent, et que 2 membres ont pris des arrêts maladie. Le sponsor presse pour maintenir le calendrier. Comment gérez-vous cette situation ?`,
  options:[
    `A. Maintenir le rythme — la pression des jalons est temporaire et l'équipe peut tenir encore 6 semaines.`,
    `B. Présenter au sponsor une analyse de risque chiffrée : le taux d'erreurs croissant en période de surcharge génère une dette qualité (reprises, bugs) qui coûte généralement plus que le bénéfice du maintien du calendrier ; proposer soit une extension de 2 semaines sur un jalon, soit un renfort temporaire de ressources, soit une réduction du périmètre livré — en montrant que la soutenabilité du rythme protège la qualité finale du projet.`,
    `C. Demander à chaque membre de l'équipe de gérer personnellement sa charge et de signaler s'ils sont dépassés — la responsabilité individuelle est fondamentale.`,
    `D. Recruter immédiatement des intérimaires pour absorber la surcharge sans remettre en question le calendrier.`,
  ],
  correct:1,
  explication:`La réponse B est correcte. La surcharge chronique (55h/semaine + arrêts maladie) est un signal d'alarme sérieux — elle génère des erreurs coûteuses et risque de perdre des membres clés. Le chef de projet a la responsabilité de signaler ce risque au sponsor avec des données factuelles (ECO T3 — Soutenir la performance). La présentation d'options (extension, renfort, périmètre réduit) donne au sponsor les leviers pour décider. Maintenir le rythme (A) sans action est une négligence de management.`,
},

{ id:"P-033", domaine:"Personnes", approche:"Hybride", type:"standard",
  question:`Vous gérez un projet international avec des membres d'équipe en France, au Sénégal et en Indonésie. Vous observez que les membres français ont tendance à exprimer leurs désaccords directement en réunion, tandis que les membres sénégalais et indonésiens expriment rarement des désaccords en public mais vous contactent individuellement après les réunions avec des préoccupations importantes. Des décisions sont prises en réunion sur la base d'un consensus apparent qui ne reflète pas les vraies positions. Comment améliorez-vous ce processus ?`,
  options:[
    `A. Demander à tous les membres de s'adapter au mode de communication direct — c'est la norme professionnelle internationale.`,
    `B. Adapter le processus de prise de décision pour valoriser les deux styles : introduire un temps de réflexion asynchrone avant les décisions importantes (les membres soumettent leurs positions par écrit avant la réunion), utiliser des votes anonymes pour les décisions sensibles, et créer explicitement un espace pour les retours post-réunion qui sont intégrés dans les décisions finales — documenter que le consensus est provisoire jusqu'à confirmation individuelle.`,
    `C. Tenir deux types de réunions : des réunions plénières pour les informations, et des réunions bilatérales avec chaque culture pour collecter les vrais avis.`,
    `D. Désigner un représentant culturel pour chaque groupe qui synthétise les positions avant les réunions plénières.`,
  ],
  correct:1,
  explication:`La réponse B est correcte. Les styles de communication directe vs indirecte sont des différences culturelles légitimes — forcer l'adaptation unilatérale (A) marginalise les membres des cultures à communication indirecte et appauvrit les décisions. L'introduction de mécanismes asynchrones et anonymes crée un espace où chaque style peut s'exprimer authentiquement. Les décisions reflètent ainsi les vraies positions de tous les membres, pas seulement de ceux qui s'expriment aisément en public.`,
},

{ id:"P-034", domaine:"Personnes", approche:"Agile", type:"standard",
  question:`Votre Product Owner est constamment indisponible — il répond aux emails en moyenne après 3 jours, manque 40 % des sprint plannings et les user stories arrivent sans critères d'acceptation. L'équipe avance en faisant ses propres suppositions, créant un taux de reprise élevé. Comment résolvez-vous ce problème structurel ?`,
  options:[
    `A. Continuer à travailler avec les suppositions de l'équipe — le PO est responsable des conséquences de son indisponibilité.`,
    `B. Documenter l'impact concret de l'indisponibilité du PO (taux de reprise, vélocité réduite, stories non livrables) et présenter cette analyse au sponsor ou au management du PO pour obtenir soit une augmentation de la disponibilité du PO, soit la désignation d'un PO délégué ou d'un proxy PO pour les décisions quotidiennes — un PO indisponible est un risque projet critique, pas une contrainte à absorber passivement.`,
    `C. Prendre vous-même les décisions de priorisation en l'absence du PO — quelqu'un doit décider.`,
    `D. Réduire la fréquence des sprints à mensuelle pour s'adapter au rythme de disponibilité du PO.`,
  ],
  correct:1,
  explication:`La réponse B est correcte. L'indisponibilité chronique du PO est un dysfonctionnement organisationnel qui compromet la valeur livrée par l'équipe Agile. Le chef de projet/Scrum Master doit escalader ce problème avec des données factuelles (taux de reprise, vélocité, stories non livrables) aux parties prenantes qui peuvent agir. Se substituer au PO (C) crée une confusion des rôles et des responsabilités. Réduire la fréquence des sprints (D) masque le problème sans le résoudre.`,
},

{ id:"P-035", domaine:"Personnes", approche:"Prédictif", type:"standard",
  question:`Dans un projet de construction d'une plateforme logistique, votre équipe inclut un expert senior externe (consultant) dont les honoraires sont 3x supérieurs aux employés internes. Cet expert produit un travail de haute qualité mais commence à créer une dépendance — les membres internes cessent de développer leurs propres compétences car "l'expert s'en occupe". Comment gérez-vous cette situation ?`,
  options:[
    `A. Accepter la situation — avoir un expert de haut niveau est un avantage compétitif pour le projet.`,
    `B. Reconnaître le risque de dépendance et restructurer l'engagement de l'expert : le faire travailler en mode mentorat/transfert de compétences (il documente ses méthodes, travaille en binôme avec des membres internes, explique ses décisions) plutôt qu'en mode prestation pure — avec un objectif clair de montée en compétence des équipes internes sur sa durée d'intervention.`,
    `C. Réduire les heures de l'expert pour forcer les membres internes à prendre en charge le travail.`,
    `D. Séparer complètement les périmètres : l'expert sur les sujets complexes, les internes sur les sujets simples — sans interaction pour éviter la dépendance.`,
  ],
  correct:1,
  explication:`La réponse B est correcte. La dépendance à un consultant externe est un risque de continuité post-projet (ECO T5 — Assurer la formation). La restructuration en mode mentorat maximise la valeur de l'expert (son savoir se multiplie via l'équipe) tout en développant les capacités internes. Réduire brutalement les heures (C) risque de dégrader la qualité sans que les internes soient prêts. La séparation des périmètres (D) perpétue la dépendance.`,
},

{ id:"P-036", domaine:"Personnes", approche:"Agile", type:"standard",
  question:`Lors d'une rétrospective, un membre de l'équipe propose de modifier le processus de déploiement pour réduire les temps de mise en production de 4 heures à 30 minutes. L'idée est techniquement solide mais sa mise en place prendra 2 sprints complets sans livraison de fonctionnalités. Le Product Owner refuse catégoriquement : "2 sprints sans valeur livrée, c'est hors de question". Comment médiez-vous ce conflit ?`,
  options:[
    `A. Soutenir le PO — 2 sprints sans livraison de fonctionnalités est un coût trop élevé.`,
    `B. Faciliter une analyse de retour sur investissement avec les deux parties : 2 sprints investis (6 semaines) pour réduire les déploiements de 4h à 30 min représente un gain de 3h30 par déploiement. Si l'équipe déploie 3 fois par semaine, le ROI est atteint en 6 semaines (30 jours de gains = coût des 2 sprints) ; ensuite chaque déploiement économise 3h30. Présenter cette analyse au PO et lui proposer de répartir l'investissement sur 4 sprints (20 % de capacité/sprint) pour maintenir la livraison de valeur.`,
    `C. Mettre l'amélioration en attente jusqu'à la fin du projet — c'est une amélioration technique importante mais non urgente.`,
    `D. Laisser l'équipe mettre en place l'amélioration sans le dire au PO en parallèle du travail normal.`,
  ],
  correct:1,
  explication:`La réponse B est correcte. Le conflit entre amélioration technique et livraison de valeur est classique en Agile. La médiation efficace passe par la quantification du ROI — transformer un argument qualitatif ("c'est utile") en argument économique ("payé en X semaines, économies de Y ensuite"). La répartition sur 4 sprints à 20 % est un compromis pratique qui maintient la livraison tout en investissant dans l'amélioration. La dissimulation (D) viole la transparence Agile fondamentale.`,
},

{ id:"P-037", domaine:"Personnes", approche:"Prédictif", type:"standard",
  question:`Vous êtes chef de projet pour la rénovation d'un stade de 45 000 places (78 M€, 30 mois). À mois 18, un accident de travail grave (fracture multiple d'un ouvrier suite à une chute de 4 mètres) se produit sur votre chantier. L'enquête préliminaire révèle que les garde-corps de la zone concernée n'avaient pas été installés conformément au plan de prévention. Quelles sont vos obligations immédiates dans les 24 heures ?`,
  options:[
    `A. Continuer les travaux dans les autres zones non concernées par l'accident et attendre les conclusions de l'enquête avant toute action.`,
    `B. Arrêter immédiatement tous les travaux à risque similaire (travaux en hauteur) jusqu'à audit complet des dispositifs de protection sur l'ensemble du chantier ; déclarer l'accident à l'inspection du travail et à la CPAM dans les délais légaux (24h) ; organiser une réunion d'urgence avec tous les sous-traitants sur les exigences de sécurité ; prendre en charge l'assistance à l'ouvrier blessé ; et informer le maître d'ouvrage de l'incident et des mesures prises.`,
    `C. Déclarer l'accident aux autorités compétentes et laisser l'enquête suivre son cours sans interrompre les travaux — l'accident est isolé et les autres zones sont conformes.`,
    `D. Demander au conducteur de travaux de vérifier informellement les garde-corps dans les autres zones avant de reprendre les travaux dès le lendemain.`,
  ],
  correct:1,
  explication:`La réponse B est correcte. Un accident grave sur chantier déclenche des obligations légales immédiates (déclaration dans les 24h) et des obligations éthiques (arrêt des travaux à risque similaire jusqu'à audit de sécurité complet). Le chef de projet ne peut pas présumer que "les autres zones sont conformes" après une non-conformité grave documentée — un audit systématique est indispensable. La vérification informelle (D) ne satisfait pas les exigences légales post-accident. Continuer sans mesures (A, C) exposerait le projet et ses responsables à des sanctions pénales graves.`,
},

{ id:"P-038", domaine:"Personnes", approche:"Hybride", type:"standard",
  question:`Vous êtes chef de programme pour un programme de transformation digitale de 42 M€. Parmi vos 6 chefs de projet de flux, deux ont des styles de management très différents : l'un est très structuré et process-oriented, l'autre est très agile et informel. Les deux produisent d'excellents résultats dans leurs flux respectifs. Cependant, leurs équipes commencent à comparer les pratiques et créent des tensions ("pourquoi eux ils peuvent faire X et pas nous ?"). Comment gérez-vous cette diversité managériale ?`,
  options:[
    `A. Uniformiser les pratiques de management sur l'ensemble du programme — la cohérence est indispensable pour éviter les tensions.`,
    `B. Organiser une session avec les deux chefs de projet pour documenter ensemble les pratiques non négociables du programme (reporting, qualité, communication inter-flux) et les pratiques flexibles (organisation interne des équipes, outils, rituels) — permettre la diversité managériale sur les pratiques flexibles tout en garantissant la cohérence sur les pratiques critiques. Communiquer clairement cette distinction aux équipes.`,
    `C. Laisser chaque chef de projet gérer son flux indépendamment — les comparaisons entre équipes sont inévitables et sans importance si les résultats sont bons.`,
    `D. Demander au chef de projet structuré d'assouplir son approche pour se rapprocher du style agile — le management moderne favorise la flexibilité.`,
  ],
  correct:1,
  explication:`La réponse B est correcte. La diversité managériale est un atout si elle est gérée consciemment. La distinction entre pratiques non négociables (cohérence programme) et pratiques flexibles (autonomie de management) est la clé. La communication claire de cette distinction aux équipes évite les comparaisons injustes ("pourquoi eux peuvent faire X"). L'uniformisation forcée (A) réduirait l'efficacité des deux chefs de projet en les contraignant à un style qui ne leur correspond pas. Ignorer les tensions (C) les laisse s'amplifier.`,
},

{ id:"P-039", domaine:"Personnes", approche:"Agile", type:"standard",
  question:`Votre équipe Scrum de 7 membres travaille depuis 8 mois ensemble avec une excellente cohésion. Un nouveau manager (votre nouveau N+1) arrive et, lors de sa première semaine, assiste à une rétrospective. Il en ressort avec la conclusion que l'équipe "manque de structure et de discipline" et demande d'introduire des rapports d'activité individuels quotidiens, des objectifs individuels hebdomadaires, et des revues de performance mensuelles individuelles. Comment répondez-vous ?`,
  options:[
    `A. Mettre en place immédiatement les mesures demandées — votre nouveau manager a l'autorité hiérarchique et doit être respecté.`,
    `B. Demander un entretien avec votre nouveau manager pour lui présenter les données de performance de l'équipe (vélocité, taux de satisfaction, qualité des livrables sur 8 mois), expliquer comment les pratiques Agile génèrent ces résultats, et discuter des indicateurs de performance collective qui répondent à ses besoins de visibilité sans dégrader la dynamique d'équipe — proposer un dashboard de performance collective comme alternative aux rapports individuels.`,
    `C. Ignorer les demandes du manager en espérant qu'il comprendra avec le temps le fonctionnement Agile.`,
    `D. Demander à l'équipe de s'adapter aux nouvelles pratiques — les exigences managériales font partie des contraintes organisationnelles à intégrer.`,
  ],
  correct:1,
  explication:`La réponse B est correcte. Un nouveau manager qui impose des pratiques incompatibles avec l'Agile sans comprendre le contexte est une situation à gérer par le dialogue et les données. Les rapports individuels quotidiens et objectifs individuels hebdomadaires dans un contexte Scrum briseraient la responsabilité collective et l'auto-organisation. La présentation des données de performance sur 8 mois est l'argument le plus crédible. Ignorer (C) est irresponsable. L'adaptation immédiate (A, D) sans dialogue sacrifie une équipe performante.`,
},

{ id:"P-040", domaine:"Personnes", approche:"Prédictif", type:"standard",
  question:`Dans un projet de déploiement d'un système de gestion hospitalière (18 M€, 28 mois), vous découvrez à mois 15 que deux membres de votre équipe ont un conflit personnel intense issu d'un désaccord hors du contexte professionnel (réseaux sociaux). Ce conflit commence à impacter la qualité de leur collaboration sur les livrables communs. Quelle est votre approche ?`,
  options:[
    `A. Séparer physiquement les deux membres en les affectant à des tâches sans interaction — la prévention du conflit est plus efficace que sa résolution.`,
    `B. Rencontrer chaque personne individuellement pour reconnaître la situation, rappeler que les relations professionnelles exigent un niveau minimum de coopération indépendamment des désaccords personnels, et discuter des modalités de collaboration professionnelle sans exiger une réconciliation personnelle — si la situation impacte les livrables malgré cet effort, envisager une médiation RH formelle.`,
    `C. Ignorer le conflit tant qu'il ne génère pas de problèmes documentés sur les livrables — interférer dans les relations personnelles dépasse les attributions du chef de projet.`,
    `D. Demander aux deux membres de résoudre leur désaccord personnel dans les 48 heures ou l'un d'eux sera retiré du projet.`,
  ],
  correct:1,
  explication:`La réponse B est correcte. Un conflit personnel impactant la qualité du travail professionnel entre dans le périmètre de responsabilité du chef de projet (ECO T1 — Gérer les conflits). La distinction cruciale est de ne pas exiger une réconciliation personnelle mais d'établir un standard minimal de coopération professionnelle. Les rencontres individuelles préalables permettent d'éviter un affrontement en réunion. L'ultimatum (D) sans dialogue est contre-productif. La séparation physique (A) masque le problème sans le résoudre et peut priver l'équipe de collaborations nécessaires.`,
},

{ id:"P-041", domaine:"Personnes", approche:"Agile", type:"standard",
  question:`Votre équipe vient de terminer un PI Planning SAFe très réussi avec des engagements clairs et un Program Board bien construit. À la fin de la session, le directeur général assiste à la présentation des PI Objectives et décide "spontanément" d'ajouter 3 nouvelles fonctionnalités majeures au programme — représentant environ 30 % de capacité supplémentaire — en affirmant que "l'équipe a l'air très motivée et peut sûrement faire plus". Comment répondez-vous dans ce contexte ?`,
  options:[
    `A. Accepter les 3 nouvelles fonctionnalités — le DG a l'autorité finale et sa motivation est positive.`,
    `B. Remercier le DG pour son enthousiasme et expliquer calmement et respectueusement que : les PI Objectives viennent d'être construits sur la base de la capacité réelle des équipes après 2 jours de planification rigoureuse ; ajouter 30 % de charge en fin de session invaliderait les engagements qui viennent d'être pris et la confiance dans le processus ; proposer d'inscrire les 3 fonctionnalités dans le backlog programme pour le prochain PI Planning, ou de remplacer des fonctionnalités de priorité inférieure si elles sont urgentes.`,
    `C. Faire semblant d'accepter pendant la réunion et réajuster le planning en interne pour maintenir la capacité réelle.`,
    `D. Demander aux équipes si elles peuvent absorber la charge supplémentaire — si elles disent oui devant le DG, le problème est résolu.`,
  ],
  correct:1,
  explication:`La réponse B est correcte. L'ajout d'un scope non planifié en fin de PI Planning par un DG enthousiaste est un anti-pattern classique qui détruit la crédibilité du processus de planification. Le chef de programme a la responsabilité de protéger l'intégrité du processus tout en restant respectueux de l'autorité du DG. Le processus de PI Planning représente 2 jours d'investissement collectif — le contourner en dernière minute envoie un signal destructeur aux équipes. Faire semblant d'accepter (C) est une forme de dissimulation. Demander aux équipes (D) sous pression hiérarchique garantit un "oui" peu fiable.`,
},

{ id:"P-042", domaine:"Personnes", approche:"Hybride", type:"standard",
  question:`Vous gérez un projet de transformation culturelle dans une organisation de 2 000 personnes. Six mois après le lancement, les indicateurs de satisfaction des employés montrent une amélioration de 8 % (objectif : 20 %). En analysant les résultats par département, vous constatez que 3 départements affichent +22 % (dépassant l'objectif) et 4 départements affichent -3 % (détérioration). Comment interprétez-vous et agissez-vous ?`,
  options:[
    `A. Consolider les résultats globaux (+8 %) et les présenter positivement — la moyenne est en progression.`,
    `B. Analyser les facteurs de succès des 3 départements à +22 % (style managérial ? implication des équipes ? nature des changements ?) et les facteurs de détérioration dans les 4 départements à -3 % ; développer une approche différenciée : accélérer dans les départements performants et adapter profondément l'approche dans les départements en régression ; présenter honnêtement la disparité au sponsor avec le plan d'action différencié.`,
    `C. Concentrer tous les efforts sur les 4 départements en régression en retirant les ressources des départements performants — ils n'ont plus besoin de soutien.`,
    `D. Revoir la méthode de mesure — une variation de -3 % peut être dans la marge d'erreur statistique et ne nécessite pas d'action.`,
  ],
  correct:1,
  explication:`La réponse B est correcte. La présentation de la moyenne (+8 %) masquerait une réalité bimodale — des succès significatifs et des échecs réels dans d'autres départements. L'analyse différenciée des facteurs de succès et d'échec est précieuse : les 3 départements à +22 % sont des laboratoires de bonnes pratiques. Retirer les ressources des départements performants (C) risque de faire régresser leurs gains. Une détérioration de -3 % dans 4 départements n'est pas dans la marge d'erreur — c'est un signal de résistance ou d'inadaptation de l'approche.`,
},

{ id:"P-043", domaine:"Personnes", approche:"Agile", type:"standard",
  question:`Votre équipe Scrum développe un produit depuis 12 mois. Les 3 membres fondateurs de l'équipe ont développé une culture forte et des pratiques bien rodées. L'organisation décide d'intégrer votre équipe dans une équipe plus grande (fusion de 3 équipes en une équipe de 18 personnes) pour travailler sur un programme plus ambitieux. Comment gérez-vous la préservation de la culture positive tout en facilitant l'intégration ?`,
  options:[
    `A. Dissoudre complètement l'ancienne structure et recréer une nouvelle équipe à partir de zéro — les anciennes cultures peuvent créer des clans dans la nouvelle équipe.`,
    `B. Documenter explicitement les pratiques et valeurs qui ont fait le succès de l'ancienne équipe (comment vous prenez les décisions, comment vous gérez les conflits, comment vous définissez la qualité) ; organiser une session de co-construction de la nouvelle équipe où les 3 équipes fusionnées contribuent à définir ensemble les nouvelles pratiques — en partant de ce qui a fonctionné dans chacune, pas en imposant une culture ; les membres fondateurs peuvent devenir des ambassadeurs des bonnes pratiques, pas des gardiens d'une culture exclusive.`,
    `C. Maintenir les 3 équipes distinctes au sein de la grande équipe avec leurs propres pratiques — la fusion n'implique pas l'homogénéisation.`,
    `D. Laisser la culture émerger naturellement de la nouvelle équipe sans intervention — forcer la culture crée de la résistance.`,
  ],
  correct:1,
  explication:`La réponse B est correcte. La fusion d'équipes est l'un des changements les plus délicats en Agile — elle remet à zéro le développement de l'équipe (modèle de Tuckman). La documentation des pratiques réussies et la co-construction d'une nouvelle culture intégrant le meilleur de chaque équipe est la stratégie optimale. Les membres fondateurs comme ambassadeurs (pas comme gardiens exclusifs) valorisent leur expérience sans créer de clans. La dissolution totale (A) perd une culture précieuse construite sur 12 mois. Maintenir 3 sous-équipes distinctes (C) empêche la vraie fusion.`,
},

{ id:"P-044", domaine:"Personnes", approche:"Prédictif", type:"standard",
  question:`Dans un projet de mise en place d'un système de contrôle qualité dans une usine de composants aéronautiques (14 M€, 22 mois), votre responsable tests découvre que des pièces déjà validées et livrées au client (Airbus) présentent potentiellement une non-conformité sur un paramètre de résistance thermique. Les données sont encore incertaines (probabilité estimée à 40 % que la non-conformité soit réelle). Airbus n'est pas encore au courant. Comment gérez-vous cette situation ?`,
  options:[
    `A. Attendre les résultats des tests de confirmation avant de contacter Airbus — informer d'une non-conformité incertaine créerait une alarme injustifiée.`,
    `B. Informer immédiatement Airbus de la situation telle qu'elle est : des données préliminaires indiquent une possible non-conformité sur le paramètre X avec une probabilité estimée de 40 % ; des tests de confirmation sont en cours (délai : X jours) ; des mesures conservatoires sont envisageables (blocage de l'utilisation des pièces concernées jusqu'à confirmation) — la décision de l'action conservatoire appartient à Airbus. Dans l'aéronautique, informer tardivement d'une non-conformité potentielle sur des pièces en service est une faute grave.`,
    `C. Lancer les tests de confirmation en urgence et n'informer Airbus que si la non-conformité est confirmée — éviter les fausses alarmes préserve la relation commerciale.`,
    `D. Consulter d'abord votre service juridique pour évaluer les responsabilités avant d'informer Airbus — une communication prématurée pourrait être utilisée contre vous en cas de litige.`,
  ],
  correct:1,
  explication:`La réponse B est correcte. Dans l'aéronautique (secteur à sécurité critique), les obligations de traçabilité et de notification des non-conformités potentielles sont réglementairement strictes — même avec une probabilité de 40 %, Airbus doit être informé immédiatement pour prendre ses propres mesures conservatoires (pièces peuvent être installées sur des avions en service). Attendre la confirmation (A, C) expose à une responsabilité pénale en cas d'incident. Consulter le juridique d'abord (D) ne dispense pas d'informer dans les délais requis — les deux peuvent se faire simultanément.`,
},

{ id:"P-045", domaine:"Personnes", approche:"Agile", type:"standard",
  question:`Vous êtes chef de projet d'une start-up de 25 personnes qui passe d'un fonctionnement informel à l'adoption de pratiques Agile structurées. Le fondateur/CEO (qui est aussi votre sponsor direct) résiste à l'idée de sprint reviews formelles avec les clients : "Nos clients nous font confiance, on n'a pas besoin de leur présenter chaque fonctionnalité". Les deux fois où des sprint reviews ont eu lieu, le CEO est intervenu pour minimiser les feedbacks négatifs des clients. Comment abordez-vous cette situation ?`,
  options:[
    `A. Respecter la position du CEO — dans une start-up, la relation client directe du fondateur est un avantage compétitif à préserver.`,
    `B. Avoir une conversation directe avec le CEO sur la valeur des sprint reviews : les feedbacks clients négatifs sont précisément les plus précieux car ils évitent de construire la mauvaise chose ; les minimiser revient à se priver de l'information la plus critique. Proposer d'expérimenter 3 sprint reviews avec un protocole clair (le CEO présente mais s'engage à ne pas filtrer les retours) et de mesurer l'impact sur la satisfaction client et la qualité du produit.`,
    `C. Organiser des sprint reviews sans inviter le CEO pour éviter l'interférence.`,
    `D. Accepter de remplacer les sprint reviews par des démonstrations informelles sans feedback structuré — l'adaptation au contexte start-up est nécessaire.`,
  ],
  correct:1,
  explication:`La réponse B est correcte. Le comportement du CEO (minimiser les feedbacks négatifs) est contre-productif — il prive l'équipe de l'information la plus précieuse pour construire le bon produit. La conversation directe sur la valeur des feedbacks négatifs est nécessaire, assortie d'une proposition expérimentale avec métriques. Les sprint reviews sans le CEO (C) crée un conflit de gouvernance. L'abandon des reviews structurées (D) prive l'équipe d'un mécanisme fondamental de validation de la valeur.`,
},

{ id:"P-046", domaine:"Personnes", approche:"Prédictif", type:"standard",
  question:`Vous gérez un projet d'infrastructure critique pour une ville (système d'alerte aux inondations, 8,5 M€, 20 mois). À mois 16, vous réalisez que le système ne pourra pas atteindre le temps de réponse garanti de 90 secondes (du déclenchement de l'alerte à la notification des habitants) — les tests montrent 140 secondes dans les conditions réelles. Modifier l'architecture pour atteindre 90 secondes nécessite 6 mois supplémentaires et 1,2 M€. La saison des crues commence dans 4 mois. Comment gérez-vous cette situation critique ?`,
  options:[
    `A. Livrer le système à 140 secondes dans les délais prévus — c'est mieux que rien et la ville peut communiquer sur cette limitation.`,
    `B. Informer immédiatement la ville (client) et les autorités compétentes de la situation réelle ; présenter les options : (1) livraison partielle dans 4 mois du système à 140 secondes avec protocoles compensatoires (alertes précoces, redondance avec d'autres canaux), (2) extension de 6 mois pour atteindre les 90 secondes garantis, (3) combinaison des deux (livraison partielle + amélioration post-saison). Travailler avec les autorités de gestion des crises pour évaluer si 140 secondes est acceptable avec des protocoles adaptés, ou si le risque est inacceptable. La transparence est obligatoire — un système d'alerte livré avec une performance non conforme à la spec sans le signaler serait une faute grave.`,
    `C. Modifier discrètement la spécification contractuelle de 90 à 150 secondes pour que le système soit "conforme" à la livraison.`,
    `D. Livrer le système à 140 secondes sans mentionner l'écart avec la spec — la ville pourra identifier le problème lors des tests d'acceptation.`,
  ],
  correct:1,
  explication:`La réponse B est correcte. Un système d'alerte aux inondations est un système à sécurité critique — une performance dégradée de 56 % sur le temps de réponse (140s vs 90s) peut avoir des conséquences vitales. La transparence immédiate avec le client et les autorités de gestion des crises est une obligation légale et éthique absolue. Les autorités peuvent évaluer si 140 secondes est acceptable avec des protocoles compensatoires — c'est leur décision, pas celle du chef de projet. La modification discrète de la spec (C) est une fraude contractuelle. Livrer sans signaler (D) dissimule un écart critique.`,
},

{ id:"P-047", domaine:"Personnes", approche:"Hybride", type:"standard",
  question:`Vous êtes chef de projet pour le développement d'une application RH dans une entreprise. Lors d'une réunion de validation, le directeur des ressources humaines (votre principal sponsor) vous demande d'ajouter une fonctionnalité permettant aux managers de consulter les communications privées des employés sur la messagerie interne de l'entreprise "pour détecter les problèmes d'ambiance". La fonctionnalité est techniquement réalisable en 2 sprints. Comment répondez-vous ?`,
  options:[
    `A. Développer la fonctionnalité — la messagerie interne de l'entreprise appartient à l'entreprise et le DRH a l'autorité.`,
    `B. Expliquer au DRH que cette fonctionnalité soulève des problèmes légaux sérieux (le RGPD et les droits du travail dans la plupart des pays encadrent strictement la surveillance des communications des employés, même sur les outils de l'entreprise, et exigent consultation des représentants du personnel et base légale explicite) et des risques majeurs de confiance organisationnelle ; recommander de consulter le DPO et le service juridique avant toute décision, et proposer des alternatives légales pour détecter les problèmes d'ambiance (enquêtes anonymes, entretiens managériaux structurés, indicateurs RH de bien-être).`,
    `C. Développer la fonctionnalité avec un accès réservé au DRH uniquement — limiter l'accès réduit le risque.`,
    `D. Soumettre la demande au comité de direction pour validation — une décision aussi sensible doit être approuvée au plus haut niveau.`,
  ],
  correct:1,
  explication:`La réponse B est correcte. La surveillance des communications privées des employés est strictement réglementée — le RGPD, la jurisprudence des droits du travail (arrêts Nikon en France, CEDH) et les législations équivalentes dans la plupart des pays imposent des conditions très strictes. Développer la fonctionnalité sans analyse juridique préalable (A, C) exposerait l'entreprise à des sanctions légales graves et détruirait la confiance des employés. Le DPO et le service juridique sont les interlocuteurs appropriés avant toute décision. Les alternatives légales proposées répondent au besoin réel (détecter les problèmes d'ambiance) sans risque légal.`,
},

{ id:"P-048", domaine:"Personnes", approche:"Agile", type:"standard",
  question:`Dans votre équipe Scrum, vous introduisez la pratique du "pair programming" pour améliorer la qualité du code. Après 3 sprints, les données montrent que la vélocité a légèrement baissé (-8 %) mais le taux de défauts post-sprint a chuté de 42 %. Deux développeurs seniors résistent fortement : "On perd du temps à expliquer ce qu'on fait à des juniors". Comment consolidez-vous cette pratique ?`,
  options:[
    `A. Supprimer le pair programming à la demande des seniors — leur résistance impacte le moral et ils sont les membres les plus productifs.`,
    `B. Présenter les données en rétrospective : -8 % de vélocité mais -42 % de défauts représente un gain net significatif (le coût de correction des défauts post-sprint est généralement 3-5x supérieur au coût de prévention). Aborder directement la préoccupation des seniors : "expliquer ce qu'on fait à des juniors" EST la valeur du pair programming (transfert de compétences, résilience de l'équipe, meilleure qualité) ; proposer de varier les paires (seniors entre eux sur les sujets complexes, mixtes sur les autres) pour maximiser les bénéfices.`,
    `C. Rendre le pair programming optionnel — forcer une pratique contre la volonté des membres clés est contre-productif.`,
    `D. Séparer les seniors des juniors pour les sessions de pair programming — les seniors travaillent ensemble et les juniors entre eux.`,
  ],
  correct:1,
  explication:`La réponse B est correcte. La résistance des seniors est compréhensible mais repose sur une perception incorrecte du coût-bénéfice. Les données sont éloquentes : -8 % de vélocité vs -42 % de défauts est un ROI clairement positif (les corrections de défauts post-sprint coûtent bien plus que la baisse de vélocité apparente). La présentation des données en rétrospective est une approche factuelle et non confrontationnelle. Varier les paires (seniors entre eux sur les sujets complexes) répond à la préoccupation de "perdre du temps à expliquer" sans supprimer les bénéfices du pair programming.`,
},

{ id:"P-049", domaine:"Personnes", approche:"Prédictif", type:"standard",
  question:`Vous êtes chef de projet pour un programme de transformation RH (5,2 M€, 18 mois). Lors d'une réunion de comité de pilotage, le DG annonce qu'un concurrent vient de lancer un produit similaire et demande de "tout accélérer" pour terminer en 12 mois au lieu de 18 — soit une réduction de 33 % du délai. Sans budget supplémentaire. Comment répondez-vous à cette pression ?`,
  options:[
    `A. Accepter la nouvelle date de 12 mois et reorganiser le projet en conséquence — la réactivité compétitive est une priorité stratégique.`,
    `B. Demander 48 heures pour réaliser une analyse d'impact rigoureuse de la réduction de délai de 33 % : quelles fonctionnalités peuvent être livrées en 12 mois à ressources constantes ? quel est le périmètre minimum viable qui répond à l'urgence compétitive ? quels sont les risques qualité d'une telle compression ? Présenter au DG 3 scénarios (12 mois périmètre réduit, 15 mois périmètre intermédiaire, 18 mois périmètre complet) avec les implications de chacun — et lui permettre de décider sur la base de données réelles, pas d'une promesse irréaliste.`,
    `C. Expliquer au DG que réduire le délai de 33 % sans budget supplémentaire est techniquement impossible et qu'il faut maintenir le plan initial.`,
    `D. Accepter verbalement les 12 mois et continuer le plan initial en espérant que la pression concurrentielle se dissipe.`,
  ],
  correct:1,
  explication:`La réponse B est correcte. Face à une pression de compression calendaire drastique (-33 %), la réponse professionnelle est l'analyse d'impact rapide et la présentation d'options réalistes — pas l'acceptation aveugle ni le refus catégorique. Les 48 heures demandées sont un délai raisonnable pour une analyse sérieuse. Les 3 scénarios permettent au DG de prendre une décision éclairée sur le compromis périmètre/délai. Accepter sans analyse (A) ou verbalement sans intention (D) sont des formes de manque d'intégrité professionnelle. Le refus catégorique (C) ferme le dialogue sans proposer d'alternative constructive.`,
},

{ id:"P-050", domaine:"Personnes", approche:"Agile", type:"standard",
  question:`Vous êtes Scrum Master et vous constatez que lors des mêlées quotidiennes, les membres de l'équipe répondent mécaniquement aux 3 questions (fait hier, prévu aujourd'hui, blocages) mais que la réunion ne génère pas de vraie coordination — les membres ne réagissent pas aux informations des autres et se contentent de "reporter". La mêlée dure 15 minutes au lieu de 15 et n'a pas de valeur réelle. Comment améliorez-vous cette pratique ?`,
  options:[
    `A. Supprimer les mêlées quotidiennes — si elles ne créent pas de valeur, elles sont une perte de temps.`,
    `B. Changer le format de la mêlée pour recentrer sur la collaboration : remplacer les 3 questions individuelles par une revue collective du sprint board (quelles stories avancent, lesquelles sont bloquées, quelles dépendances doivent être adressées aujourd'hui) ; debout devant le board physique ou virtuel ; timeboxer à 10 minutes maximum ; former les membres à poser des questions aux autres ("tu as dit que X bloque — qui peut t'aider ?") — la mêlée est une réunion de coordination, pas un rapport individuel au Scrum Master.`,
    `C. Rendre les mêlées hebdomadaires au lieu de quotidiennes — la fréquence réduite augmentera la densité d'information utile.`,
    `D. Imposer une règle : chaque mêlée doit générer au minimum 1 action collaborative identifiée — cela forcera la vraie coordination.`,
  ],
  correct:1,
  explication:`La réponse B est correcte. La mêlée mécanique (3 questions individuelles = rapport au Scrum Master) est un anti-pattern classique. La mêlée est conçue pour l'équipe, pas pour le Scrum Master. Recentrer sur le sprint board (ce qui avance, ce qui bloque, les dépendances) transforme la mêlée en outil de coordination réelle. Former les membres à poser des questions aux autres change la dynamique de "rapport" à "coordination". La mêlée hebdomadaire (C) est un autre anti-pattern. La règle imposée (D) peut créer une coordination artificielle sans valeur réelle.`,
},,
// ── Questions supplémentaires Processus ──
{ id:"PR-031", domaine:"Processus", approche:"Prédictif", type:"standard",
  question:`Dans un projet de construction d'un pont autoroutier (125 M€, 48 mois), l'analyse de Monte Carlo réalisée à mois 6 donne : P10 = 44 mois, P50 = 51 mois, P90 = 58 mois, pour un délai contractuel de 48 mois. La réserve pour aléas représente 6 mois. Quelle est votre analyse de la situation et votre recommandation au comité de pilotage ?`,
  options:[
    `A. La situation est sous contrôle — la réserve de 6 mois compense exactement l'écart P50 (51 - 48 = 3 mois) et nous avons une marge confortable.`,
    `B. La situation est préoccupante : le P50 est déjà à 51 mois (3 mois au-delà du contractuel), et il y a 50 % de probabilité de dépasser 51 mois. Même avec 6 mois de réserve, la probabilité de terminer dans les 48 mois contractuels est d'environ 10 % (P10 = 44 mois). Recommander au comité d'identifier immédiatement les opportunités de compression sur le chemin critique, et de préparer une analyse de scénario de renégociation partielle du délai contractuel — le contrat à 48 mois a 90 % de chances de ne pas être tenu à ressources constantes.`,
    `C. Utiliser les 6 mois de réserve comme tampon suffisant — P50 de 51 mois + réserve de 6 mois = livraison possible à 57 mois.`,
    `D. Attendre les données du mois 12 avant d'alerter — l'analyse de Monte Carlo à mois 6 est trop précoce pour être significative.`,
  ],
  correct:1,
  explication:`La réponse B est correcte. L'analyse de Monte Carlo révèle que la probabilité de livraison à 48 mois est d'environ 10 % — c'est un signal d'alarme critique, pas une situation sous contrôle. La réserve de 6 mois est indépendante de la distribution probabiliste et ne "compense" pas le P50 de 51 mois. Recommander une analyse de compression du chemin critique et envisager une renégociation précoce du délai contractuel est la démarche professionnelle responsable. Attendre (D) à mois 12 réduirait encore les options disponibles.`,
},

{ id:"PR-032", domaine:"Processus", approche:"Agile", type:"standard",
  question:`Vous gérez le développement d'une application de commerce électronique. Le Black Friday approche dans 8 semaines et représente 35 % du chiffre d'affaires annuel du client. Votre équipe Scrum est au sprint 14 et il manque encore 3 fonctionnalités critiques pour le Black Friday. Votre vélocité actuelle permet de livrer 2 fonctionnalités en 8 semaines (4 sprints). Il manque donc 1 fonctionnalité. Options : (O1) Ajouter 2 développeurs (coût 40 000 €, intégration 2 semaines) ; (O2) Réduire la qualité (tests raccourcis, dette technique accumulée) ; (O3) Simplifier la 3ème fonctionnalité à une version minimale viable. Recommandez.`,
  options:[
    `A. Recommander O1 (ajout de développeurs) — la date Black Friday est non négociable et 40 000 € est minime face à 35 % du CA annuel.`,
    `B. Recommander O3 (version minimale viable de la 3ème fonctionnalité) en premier lieu : définir avec le client quelle sous-partie de la fonctionnalité apporte 80 % de la valeur business, livrer cette partie en 8 semaines, planifier la version complète pour janvier. Si O3 est impossible (la fonctionnalité est atomique), alors O1 en évaluant le coût total (40 000 € + perte de productivité 2 semaines d'intégration = risque de ne pas livrer malgré le renfort). Exclure O2 — raccourcir les tests avant le Black Friday est le risque le plus dangereux (incidents production pendant l'événement commercial le plus critique de l'année).`,
    `C. Recommander O2 (tests raccourcis) — les tests complets peuvent être réalisés après le Black Friday ; l'essentiel est de livrer à temps.`,
    `D. Informer le client qu'il n'est pas possible de livrer les 3 fonctionnalités en 8 semaines à capacité constante et sans compromis qualité — c'est la réalité du planning.`,
  ],
  correct:1,
  explication:`La réponse B est correcte. La version minimale viable (O3) est la stratégie Agile optimale : elle maximise la valeur livrée avant la date critique sans risque qualité ni coût supplémentaire. L'option O2 (tests raccourcis) est particulièrement dangereuse avant le Black Friday — un incident de production lors de l'événement commercial le plus chargé de l'année serait catastrophique. L'option O1 (ajout de développeurs) doit être évaluée avec réalisme : 2 semaines d'intégration sur 8 semaines disponibles = seulement 6 semaines de production effective pour les nouveaux membres, avec friction sur la vélocité de l'équipe existante.`,
},

{ id:"PR-033", domaine:"Processus", approche:"Prédictif", type:"standard",
  question:`Dans un projet de déploiement d'un réseau fibre optique (34 M€, 30 mois), votre plan de communication prévoit des rapports mensuels au client. À mois 12, le client vous appelle pour vous dire qu'il "apprend des informations importantes sur son propre projet via des tiers (sous-traitants, fournisseurs)" et qu'il se sent "exclu des décisions". L'analyse révèle que vos rapports sont techniques et exhaustifs (45 pages) mais contiennent peu d'informations sur les décisions prises et les orientations choisies. Que faites-vous ?`,
  options:[
    `A. Augmenter la fréquence des rapports à la quinzaine — le client a besoin de plus d'information.`,
    `B. Reconnaître le problème de communication et réviser fondamentalement le plan : distinguer les rapports techniques détaillés (pour les équipes techniques du client) d'un rapport exécutif synthétique mensuel (2 pages maximum : décisions prises ce mois, orientations choisies et pourquoi, prochaines décisions à venir, risques actifs) ; instaurer un appel téléphonique hebdomadaire de 30 minutes pour les décisions en cours ; créer un registre des décisions accessible au client en temps réel.`,
    `C. Inviter le client à toutes les réunions internes du projet pour qu'il ait accès à toute l'information directement.`,
    `D. Demander aux sous-traitants de ne plus communiquer directement avec le client — l'information doit passer par un canal unique.`,
  ],
  correct:1,
  explication:`La réponse B est correcte. Le problème n'est pas la quantité d'information (45 pages/mois) mais sa nature — le client a besoin d'informations décisionnelles, pas techniques. La distinction rapport technique/rapport exécutif et l'appel hebdomadaire pour les décisions en cours répondent précisément au besoin exprimé. Inviter le client à toutes les réunions internes (C) est peu pratique et crée une confusion des rôles. Couper la communication des sous-traitants (D) est impossible à maintenir et crée de la méfiance. Augmenter la fréquence sans changer le contenu (A) aggrave le problème.`,
},

{ id:"PR-034", domaine:"Processus", approche:"Agile", type:"standard",
  question:`Votre Product Owner souhaite prioriser les user stories selon la technique MoSCoW (Must have, Should have, Could have, Won't have). Après 2 sprints d'utilisation, vous constatez que 85 % des stories sont classées "Must have" et que le backlog de priorité "Must have" représente 18 mois de travail pour une équipe censée livrer en 8 mois. Comment abordez-vous ce problème de priorisation ?`,
  options:[
    `A. Accepter la classification MoSCoW du PO — c'est lui qui connaît le mieux les priorités métier.`,
    `B. Organiser une session de re-priorisation avec le PO en utilisant une technique de contrainte : imposer une limite de 40 % maximum de stories "Must have" (sur la capacité de l'équipe sur 8 mois) et utiliser la technique du "20-dollar test" (chaque partie prenante dispose de 20 points à répartir entre les stories) pour forcer des choix réels entre les Must have. Un backlog où 85 % des items sont "Must have" révèle que la priorisation n'a pas vraiment eu lieu.`,
    `C. Augmenter la capacité de l'équipe en recrutant pour absorber les 18 mois de stories Must have.`,
    `D. Expliquer au PO que MoSCoW n'est pas adapté à son projet et lui proposer de classer toutes les stories par ordre de priorité numérique de 1 à N.`,
  ],
  correct:1,
  explication:`La réponse B est correcte. Un backlog où 85 % des items sont "Must have" avec 18 mois de travail pour 8 mois de capacité révèle une priorisation insuffisante — toutes les fonctionnalités ont été déclarées essentielles sans véritables arbitrages. La technique de contrainte (40 % maximum de Must have) force les vrais choix. Le "20-dollar test" ou techniques équivalentes (WSJF, dot voting) permettent de révéler les vraies priorités relatives quand les déclarations absolues gonflent. Recruter (C) pour absorber 18 mois de backlog non priorisé est une réponse disproportionnée au mauvais problème.`,
},

{ id:"PR-035", domaine:"Processus", approche:"Prédictif", type:"standard",
  question:`Dans un projet de rénovation d'un réseau électrique urbain (28 M€, 24 mois), votre analyse des risques identifie un risque de "découverte d'amiante lors des travaux de génie civil" avec probabilité 25 % et impact 450 000 € (décontamination + délai 8 semaines). Votre registre des risques actuel ne prévoit aucune réponse à ce risque. Le directeur technique vous dit "on verra si ça arrive". Comment gérez-vous ce risque ?`,
  options:[
    `A. Accepter la position du directeur technique — le risque est à 25 % et si l'amiante n'est pas trouvée, la réserve servira à autre chose.`,
    `B. Développer un plan de réponse préalable : conduire des sondages préalables de recherche d'amiante dans les zones à risque (coût 15 000 €, délai 3 semaines, réduction de la probabilité à 10 %) ; préparer un contrat cadre avec une entreprise de décontamination spécialisée (activation en 48h si découverte) ; réserver une enveloppe de contingence de 180 000 € (VME = 25 % × 450 k€ = 112 500 € + marge de sécurité) dans la réserve pour aléas ; documenter le protocole de découverte d'amiante et former les équipes de terrain à l'identification visuelle.`,
    `C. Transférer le risque à l'entrepreneur via une clause contractuelle qui lui fait supporter le coût de la découverte d'amiante.`,
    `D. Informer le comité de pilotage du risque et demander une décision sur la réponse à y apporter.`,
  ],
  correct:1,
  explication:`La réponse B est correcte. "On verra si ça arrive" est une acceptation passive non préparée qui, si le risque se matérialise, génère une crise (délai 8 semaines non anticipé, surcoût d'urgence, absence de prestataire identifié). L'approche proactive (sondages préalables pour réduire la probabilité, contrat cadre avec un prestataire identifié, réserve de contingence dimensionnée) transforme un risque subi en risque géré. La VME de 112 500 € justifie amplement les 15 000 € de sondages préalables. Le transfert contractuel (C) peut être légitime mais ne dispense pas du plan de réponse.`,
},

{ id:"PR-036", domaine:"Processus", approche:"Agile", type:"standard",
  question:`Vous gérez le développement d'une application de gestion de patrimoine immobilier. Au sprint 11, un nouveau cadre réglementaire européen sur la transparence immobilière (DPE++) entre en vigueur avec un délai de mise en conformité de 6 mois. Cette réglementation nécessite l'ajout de 3 modules non prévus dans le backlog initial, représentant environ 80 points de story. Votre backlog actuel couvre déjà 2 releases planifiées. Comment intégrez-vous cette contrainte réglementaire ?`,
  options:[
    `A. Ajouter les 3 modules réglementaires dans le backlog existant et allonger les releases en conséquence.`,
    `B. Traiter les 3 modules réglementaires comme Must Have avec deadline fixe (6 mois) : les positionner en tête du backlog produit ; analyser avec le PO quelles fonctionnalités des releases planifiées peuvent être reportées à une release 3 pour libérer la capacité nécessaire ; soumettre une demande de modification formelle au client avec l'analyse d'impact (80 points sur 6 mois = environ 4 sprints de la capacité de l'équipe réaffectés à la conformité réglementaire) ; ne pas "compresser" en espérant livrer tout le backlog initial ET les modules réglementaires — c'est irréaliste.`,
    `C. Demander au client un budget supplémentaire pour développer les modules réglementaires en plus du périmètre contractuel.`,
    `D. Développer les modules réglementaires en dehors des sprints (temps libre des développeurs) pour ne pas impacter le backlog planifié.`,
  ],
  correct:1,
  explication:`La réponse B est correcte. Une contrainte réglementaire avec deadline fixe est une priorité absolue qui prend le dessus sur les fonctionnalités planifiées. L'approche Agile correcte est de réorganiser le backlog pour intégrer cette priorité, pas de "faire plus" en compressant. La transparence avec le client sur l'impact (fonctionnalités reportées à release 3) est une obligation. Développer hors sprints (D) n'est pas une pratique Agile viable et masque le coût réel de l'effort. L'extension de releases (A) sans analyse d'impact formelle ne gère pas correctement le changement.`,
},

{ id:"PR-037", domaine:"Processus", approche:"Prédictif", type:"standard",
  question:`Vous êtes chef de projet d'un programme de construction de 3 immeubles résidentiels (85 M€, 36 mois). L'entreprise générale vous soumet une demande de paiement de 2,8 M€ pour "travaux supplémentaires liés aux intempéries exceptionnelles du mois 14". Votre analyse montre que les précipitations du mois 14 étaient effectivement 35 % au-dessus de la moyenne décennale (justifiant potentiellement une force majeure partielle) mais que l'entrepreneur n'a pas envoyé de notification préalable de retard dans les délais contractuels (48h après constatation du fait générateur). Comment traitez-vous cette demande ?`,
  options:[
    `A. Rejeter intégralement la demande — l'absence de notification préalable dans les délais contractuels invalide le claim.`,
    `B. Analyser la situation en distinguant deux aspects : (1) le fond (les intempéries exceptionnelles sont réelles et peuvent légitimement impacter les coûts et délais) ; (2) la forme (l'absence de notification préalable dans les 48h est une violation contractuelle qui affaiblit le claim mais ne l'invalide pas nécessairement selon le droit des contrats applicable). Engager une négociation avec l'entrepreneur : reconnaître les intempéries comme événement exceptionnel documenté, négocier une compensation réduite (par exemple 60-70 % du claim) tenant compte de la violation de procédure, et formaliser un accord de modification avec clause de respect strict des procédures futures.`,
    `C. Accepter l'intégralité du claim — les intempéries exceptionnelles sont documentées et l'entrepreneur a subi des préjudices réels.`,
    `D. Demander à l'entrepreneur de soumettre une notification rétroactive dans les 48h et traiter le claim comme s'il avait été soumis à temps.`,
  ],
  correct:1,
  explication:`La réponse B est correcte. La gestion des claims contractuels (ECO T5) exige une analyse qui distingue le fond (légitimité du préjudice) de la forme (respect des procédures). Le rejet total (A) peut être contesté si les intempéries constituent un cas de force majeure reconnue — un tribunal donnerait probablement raison à l'entrepreneur sur le fond. L'acceptation totale (C) ne tient pas compte de la violation de procédure qui a privé le maître d'ouvrage de la possibilité de mitiger le préjudice en temps réel. La notification rétroactive (D) est une fiction juridique.`,
},

{ id:"PR-038", domaine:"Processus", approche:"Agile", type:"standard",
  question:`Vous êtes chef de projet d'une équipe qui développe une plateforme de données pour un groupe industriel. À sprint 7, votre équipe identifie une opportunité d'architecture qui améliorerait significativement les performances et la scalabilité de la plateforme — mais nécessite de refactoriser 30 % du code existant (travail estimé à 3 sprints). Cette opportunité n'était pas prévue et le client n'a pas demandé ces améliorations. Que faites-vous ?`,
  options:[
    `A. Refactoriser immédiatement — l'équipe a identifié une opportunité d'amélioration et l'auto-organisation Agile lui donne l'autorité pour prendre cette décision.`,
    `B. Présenter l'opportunité au Product Owner avec une analyse coût-bénéfice claire : 3 sprints de refactorisation maintenant vs performances/scalabilité insuffisantes dans 12-18 mois quand la charge utilisateur augmentera. Laisser le PO décider en connaissance de cause — si approuvé, créer des stories d'architecture formelles dans le backlog et les prioriser selon la décision du PO. Si refusé, documenter la décision et les risques techniques acceptés.`,
    `C. Intégrer la refactorisation progressivement (20 % de chaque sprint) sans en informer le PO — la qualité technique est une responsabilité de l'équipe, pas du PO.`,
    `D. Documenter l'opportunité dans le registre des risques techniques et attendre que les problèmes de performance se matérialisent avant d'agir.`,
  ],
  correct:1,
  explication:`La réponse B est correcte. L'auto-organisation de l'équipe Agile ne signifie pas prendre unilatéralement des décisions qui impactent 3 sprints de travail et le périmètre du produit. La refactorisation architecturale est une décision produit qui appartient au PO, éclairé par l'expertise technique de l'équipe. La présentation de l'analyse coût-bénéfice (3 sprints maintenant vs problèmes futurs) est la contribution correcte de l'équipe. L'intégration discrète (C) viole la transparence Agile. Attendre (D) que les problèmes se matérialisent sera toujours plus coûteux.`,
},

{ id:"PR-039", domaine:"Processus", approche:"Prédictif", type:"standard",
  question:`Dans un projet de développement d'un logiciel de gestion portuaire pour l'autorité d'un grand port (22 M€, 30 mois), votre analyse des parties prenantes révèle que le syndicat des dockers (non identifié dans la charte projet initiale) est fortement opposé au projet car il perçoit le nouveau système comme une menace pour l'emploi de ses membres. Le syndicat commence à organiser des réunions avec les utilisateurs finaux du système et à créer de l'opposition. Que faites-vous ?`,
  options:[
    `A. Ignorer le syndicat — il n'est pas partie prenante contractuelle du projet et son opposition ne peut pas bloquer légalement le déploiement.`,
    `B. Identifier le syndicat comme partie prenante à haute influence/haute résistance dans votre registre des parties prenantes ; solliciter une réunion avec les représentants syndicaux pour comprendre leurs préoccupations précises (quels emplois ? quelles modifications de postes ?) ; présenter les données réelles sur l'impact du système sur l'emploi (si aucune suppression de poste n'est prévue, le dire clairement ; si des modifications de postes sont prévues, être honnête sur leur nature) ; proposer de les impliquer dans la définition des formations et du plan d'accompagnement.`,
    `C. Demander à l'autorité portuaire (votre client) de gérer la relation syndicale — c'est une question de relations sociales qui dépasse les attributions du chef de projet.`,
    `D. Accélérer le déploiement avant que l'opposition syndicale ne s'organise davantage — un fait accompli est plus facile à gérer que de long débats.`,
  ],
  correct:1,
  explication:`La réponse B est correcte. Le syndicat est une partie prenante à influence réelle même s'il n'est pas contractuel — son opposition peut retarder ou compromettre l'adoption du système par les dockers, ce qui constitue un risque projet critique. L'engagement proactif (comprendre les préoccupations, présenter les données réelles, proposer une implication dans l'accompagnement) est la stratégie optimale de gestion des parties prenantes (ECO T6 — Engager les parties prenantes). Ignorer (A) ou accélérer (D) aggravent l'opposition. Déléguer entièrement au client (C) est possible mais le chef de projet doit au minimum initier et faciliter le dialogue.`,
},

{ id:"PR-040", domaine:"Processus", approche:"Hybride", type:"standard",
  question:`Vous gérez un programme de transformation numérique en mode hybride. Au terme du 3ème trimestre, votre analyse EVM montre IPC-Cal = 0,91 et IPC-C = 1,04. La direction interprète ces chiffres comme "légèrement en retard mais sous le budget — situation acceptable". Êtes-vous d'accord avec cette interprétation et que recommandez-vous ?`,
  options:[
    `A. Être d'accord avec la direction — IPC-Cal de 0,91 est légèrement en retard mais IPC-C de 1,04 montre une bonne maîtrise des coûts. La situation est gérable.`,
    `B. Nuancer l'interprétation : IPC-Cal de 0,91 signifie que pour chaque euro de travail planifié, seulement 0,91 € de valeur a été produite — le retard actuel s'accumule. IPC-C de 1,04 (sous le budget) peut masquer le fait que du travail a été reporté à plus tard, ce qui explique en partie la sous-consommation budgétaire. Calculer l'EAC et l'IEVR (Indice d'Efficience à l'Achèvement) pour évaluer si le rythme actuel permet de terminer dans le budget et le délai. Recommander une revue du planning pour quantifier le retard en semaines et les actions correctives nécessaires.`,
    `C. Rejeter l'interprétation de la direction — IPC-Cal de 0,91 est un signal grave qui nécessite une action immédiate de compression du planning.`,
    `D. Attendre le prochain trimestre pour confirmer la tendance avant d'alerter — un seul trimestre est insuffisant pour tirer des conclusions.`,
  ],
  correct:1,
  explication:`La réponse B est correcte. L'interprétation "légèrement en retard mais sous le budget" est une simplification dangereuse. Un IPC-C > 1 combiné à un IPC-Cal < 1 peut signifier que le budget semble maîtrisé simplement parce que du travail planifié n'a pas été réalisé (donc pas dépensé) — pas que l'organisation est efficiente. L'IEVR (aussi appelé TCPI — To Complete Performance Index) permet de calculer la performance nécessaire pour terminer dans le budget restant. La nuance est essentielle pour que le comité de pilotage comprenne la situation réelle et pas une apparence rassurante.`,
},

{ id:"PR-041", domaine:"Processus", approche:"Agile", type:"standard",
  question:`Vous gérez le développement d'une application de télémédecine. Le sprint 9 se termine et lors de la sprint review, vous réalisez que 3 stories "Done" présentent des bogues critiques découverts par les utilisateurs tests — des bugs qui auraient dû être détectés par les tests de régression automatisés. Investigation : les tests automatisés ont bien été exécutés mais n'ont pas détecté ces bugs car les cas de test correspondants n'avaient pas été écrits. Quelle est votre action ?`,
  options:[
    `A. Retirer les 3 stories de la Définition de Fini et les remettre dans le sprint backlog du prochain sprint — elles ne sont pas réellement terminées.`,
    `B. Remettre les 3 stories en "In Progress" pour correction immédiate, mais surtout analyser la cause profonde : pourquoi les cas de test n'ont-ils pas été écrits ? (définition de prêt insuffisante sur les critères d'acceptation testables ? pression de vélocité qui a conduit à des raccourcis sur les tests ? manque de compétences QA ?) ; renforcer la Définition de Fini pour inclure une couverture minimale de tests de régression sur les nouvelles fonctionnalités ; et traiter cela comme un apprentissage systémique en rétrospective.`,
    `C. Accepter les 3 stories comme "Done" avec des bugs connus et créer des stories de correction dans le backlog — cette pratique est standard dans le développement logiciel.`,
    `D. Demander à l'équipe QA de re-tester manuellement toutes les fonctionnalités développées depuis le sprint 1 pour identifier les autres bugs potentiels.`,
  ],
  correct:1,
  explication:`La réponse B est correcte. Des bugs critiques post-sprint-review révèlent un problème systémique dans le processus de test, pas juste 3 stories à corriger. La cause profonde (cas de test non écrits) doit être analysée et la Définition de Fini renforcée pour prévenir la récurrence. Accepter des stories "Done" avec bugs critiques (C) est un anti-pattern qui accumule la dette de qualité. Re-tester manuellement depuis le sprint 1 (D) est disproportionné et non systématique. Le retour en "In Progress" (A) est correct opérationnellement mais insuffisant sans l'analyse de la cause profonde.`,
},

{ id:"PR-042", domaine:"Processus", approche:"Prédictif", type:"standard",
  question:`Vous êtes chef de projet pour la mise en place d'une plateforme de e-learning pour 12 000 employés d'un groupe industriel. Le projet est à 4 semaines de la mise en production. Un test de charge révèle que la plateforme ne supporte que 800 connexions simultanées, alors que les pics d'utilisation prévus sont de 2 400 connexions simultanées. Le prestataire technique estime qu'une correction complète nécessitera 8 semaines. Le DRH (sponsor) veut maintenir la date de lancement car "les formations ont déjà été planifiées et les managers informés". Comment gérez-vous cette situation ?`,
  options:[
    `A. Lancer la plateforme à la date prévue en limitant le nombre de connexions simultanées à 800 — les utilisateurs qui ne peuvent pas se connecter essaieront plus tard.`,
    `B. Présenter au DRH une analyse factuelle : lancer une plateforme qui tombera en panne pendant les pics d'utilisation crée un impact de réputation du projet (12 000 employés frustrés dès le jour 1) bien supérieur à un report de 8 semaines. Proposer des alternatives : (1) lancement en accès progressif (groupes de 800 utilisateurs par plage horaire planifiée, étalé sur 3 semaines le temps de la correction) ; (2) report de 6 semaines avec communication proactive aux managers sur la raison et la nouvelle date ; (3) lancement avec module pilote (sous-ensemble de formations peu critiques) pour maintenir la visibilité tout en corrigeant l'infrastructure.`,
    `C. Accepter la date de lancement et espérer que les 2 400 connexions simultanées ne se produiront pas réellement au même moment.`,
    `D. Demander au prestataire de compresser la correction de 8 à 4 semaines en doublant les ressources — coûteux mais nécessaire.`,
  ],
  correct:1,
  explication:`La réponse B est correcte. Lancer une plateforme qui ne supporte pas les charges prévues est une décision technique désastreuse — les pannes lors du lancement créent une impression négative durable difficile à corriger. La présentation des options (accès progressif, report, pilote) donne au DRH des alternatives réelles sans le confronter à un simple "impossible". L'accès progressif par groupes de 800 est souvent la meilleure solution : maintient la date de lancement pour les premiers groupes tout que la correction est en cours. La compression (D) de 8 à 4 semaines peut dégrader la qualité de la correction elle-même.`,
},

{ id:"PR-043", domaine:"Processus", approche:"Agile", type:"standard",
  question:`Vous êtes Scrum Master d'une équipe qui a livré 6 sprints consécutifs sans incident. Le CEO de votre startup assiste à la rétrospective du sprint 7 et, face aux 2 points d'amélioration identifiés par l'équipe (amélioration du processus de code review et du format du sprint planning), il dit : "Si vous avez des choses à améliorer, c'est que vous n'êtes pas encore performants. Une vraie équipe Agile ne devrait plus avoir de problèmes à améliorer." Comment répondez-vous ?`,
  options:[
    `A. Accepter la vision du CEO — une équipe mature ne devrait effectivement plus avoir de problèmes majeurs à résoudre.`,
    `B. Expliquer respectueusement au CEO que l'amélioration continue est un principe fondamental de l'Agile, pas un symptôme de sous-performance : une équipe qui n'identifie plus rien à améliorer est soit une équipe qui a atteint la perfection absolue (impossible), soit une équipe qui a cessé de chercher à s'améliorer (inquiétant). Les 2 points identifiés révèlent une équipe mature capable d'auto-réflexion — c'est exactement ce que le Manifeste Agile prescrit. Les équipes les plus performantes en Agile (Netflix, Spotify) ont des rétrospectives riches en points d'amélioration.`,
    `C. Supprimer les points d'amélioration de la présentation future pour éviter que le CEO tire de mauvaises conclusions.`,
    `D. Demander au CEO de ne plus assister aux rétrospectives — sa présence inhibe la liberté de parole de l'équipe.`,
  ],
  correct:1,
  explication:`La réponse B est correcte. La conception du CEO selon laquelle "améliorer = sous-performance" est une incompréhension fondamentale de l'Agile. L'amélioration continue (Kaizen) est un principe explicite du Manifeste Agile — une équipe mature identifie et traite les opportunités d'amélioration avec précision, même sur des sujets fins. L'explication respectueuse avec des exemples concrets (Netflix, Spotify) est plus efficace qu'une confrontation. Supprimer les points d'amélioration (C) sacrifie la transparence. Exclure le CEO (D) crée un conflit de gouvernance potentiellement dommageable.`,
},

{ id:"PR-044", domaine:"Processus", approche:"Prédictif", type:"standard",
  question:`Dans un projet de réhabilitation d'un réseau d'assainissement urbain (19 M€, 26 mois), votre planning de référence prévoit le remplacement séquentiel de 8 collecteurs principaux. À mois 8, une analyse révèle qu'il serait techniquement possible de travailler sur 2 collecteurs simultanément au lieu de 1, ce qui pourrait économiser 4 mois sur la durée totale du projet. Le coût supplémentaire de simultanéité est estimé à 380 000 €. La pénalité d'extension au-delà du délai contractuel est de 45 000 €/semaine. Comment évaluez-vous et présentez-vous cette opportunité ?`,
  options:[
    `A. Mettre en œuvre la simultanéité immédiatement — 4 mois d'économie justifient clairement 380 000 € d'investissement.`,
    `B. Calculer l'analyse coût-bénéfice complète avant de recommander : économie de délai = 4 mois = 16 semaines. Bénéfice direct (évitement de pénalité si le projet est en retard) = 0 à 720 000 € selon le risque actuel de retard. Bénéfice indirect = livraison anticipée de 4 mois pour les citoyens et la ville. Coût = 380 000 €. Si la probabilité actuelle de retard est > 53 % (380 000 / 720 000), la simultanéité est recommandée même sans risque de retard. Présenter l'analyse au comité de pilotage comme une demande de modification formelle avec l'analyse coût-bénéfice complète.`,
    `C. Ne pas recommander la simultanéité — le planning de référence a été approuvé et les modifications non planifiées sont à éviter.`,
    `D. Recommander la simultanéité uniquement sur les collecteurs les moins complexes pour limiter les risques d'interférences entre chantiers.`,
  ],
  correct:1,
  explication:`La réponse B est correcte. Une opportunité de compression (fast-tracking naturel via simultanéité) doit être évaluée rigoureusement avant recommandation. L'analyse coût-bénéfice montre que même sans risque de retard, l'investissement de 380 000 € pour économiser 4 mois peut être justifié par la valeur de la livraison anticipée pour les citoyens et la ville (réduction des nuisances). La présentation en demande de modification formelle avec analyse complète est le processus correct. La mise en œuvre immédiate sans analyse (A) ignore les risques de coordination entre chantiers simultanés.`,
},

{ id:"PR-045", domaine:"Processus", approche:"Agile", type:"standard",
  question:`Vous êtes chef de projet d'une équipe qui développe un système de recommandations musicales. Lors du sprint review du sprint 10, vous présentez la fonctionnalité de playlist automatique. Les utilisateurs testeurs donnent des feedbacks très positifs sur l'ergonomie mais signalent que les recommandations "manquent de diversité" — le système recommande systématiquement le même type de musique. L'algorithme est techniquement correct selon les spécifications initiales mais les spécifications ne capturaient pas ce besoin de diversité. Comment gérez-vous cette situation ?`,
  options:[
    `A. Clôturer la story comme "Done" — elle respecte les spécifications initiales. Le besoin de diversité sera traité comme une nouvelle story dans un sprint futur.`,
    `B. Reconnaître que les spécifications initiales ne capturaient pas un besoin utilisateur réel important ; créer une story de correction haute priorité "Amélioration de la diversité des recommandations" dans le backlog avec le PO ; discuter avec le PO de sa priorité relative par rapport aux autres stories planifiées ; traiter cela comme un apprentissage sur la méthode d'élicitation des besoins (les spécifications fonctionnelles statiques ne capturent pas toujours les besoins subjectifs d'expérience utilisateur — des prototypes testables plus tôt auraient révélé ce besoin).`,
    `C. Modifier l'algorithme directement dans ce sprint pour intégrer la diversité — l'équipe a identifié l'amélioration nécessaire et peut la livrer rapidement.`,
    `D. Conclure que le feedback des testeurs est subjectif et non représentatif — les spécifications validées par le PO font foi.`,
  ],
  correct:1,
  explication:`La réponse B est correcte. Les sprint reviews servent précisément à révéler les écarts entre ce qui a été spécifié et ce dont les utilisateurs ont réellement besoin. Un feedback convergent sur le "manque de diversité" est un signal utile, pas une opinion subjective à ignorer. La clôture comme "Done" (A) est techniquement correcte mais évite le problème réel. Modifier l'algorithme en cours de sprint (C) sans autorisation du PO ne respecte pas le processus. La leçon sur la méthode d'élicitation (prototypes testables plus tôt pour les besoins subjectifs d'UX) est précieuse pour les sprints futurs.`,
},

{ id:"PR-046", domaine:"Processus", approche:"Prédictif", type:"standard",
  question:`Vous gérez un projet de développement d'une centrale solaire flottante (62 M€, 40 mois). À mois 25, votre registre des risques identifie un nouveau risque émergent : l'évolution réglementaire européenne sur les normes d'ancrage des installations flottantes (directive en cours de finalisation) pourrait imposer des modifications structurelles significatives à votre installation en cours de construction. La directive devrait être publiée dans 3 mois mais son contenu exact n'est pas encore connu. Comment gérez-vous ce risque réglementaire émergent ?`,
  options:[
    `A. Attendre la publication de la directive dans 3 mois avant d'agir — agir sur un risque incertain gaspille des ressources.`,
    `B. Mettre en place une veille active : mandater un expert juridique/réglementaire spécialisé en énergie renouvelable pour suivre les travaux de rédaction de la directive et informer dès que le contenu est connu ; analyser les versions préliminaires disponibles (consultations publiques) pour évaluer l'impact potentiel ; identifier les modifications structurelles préventives qui pourraient être intégrées maintenant à faible coût (avant que la construction ne soit trop avancée) vs les modifications coûteuses post-construction ; préparer 2-3 scénarios de réponse selon les configurations possibles de la directive.`,
    `C. Intégrer des modifications structurelles préventives maximales maintenant pour être sûr d'être conforme quelle que soit la directive finale.`,
    `D. Informer le client du risque réglementaire et lui demander de prendre la décision sur la réponse à apporter.`,
  ],
  correct:1,
  explication:`La réponse B est correcte. Un risque réglementaire émergent avec une probabilité significative (directive en cours de finalisation) sur un projet de 62 M€ justifie une veille active et une analyse préventive. L'attente passive (A) peut conduire à des modifications post-construction extrêmement coûteuses si la directive est défavorable. Les modifications préventives maximales (C) sans connaître le contenu de la directive peuvent être coûteuses et inutiles. La préparation de scénarios et l'identification des modifications à faible coût intégrables maintenant permettent de minimiser l'exposition au risque.`,
},

{ id:"PR-047", domaine:"Processus", approche:"Agile", type:"standard",
  question:`Dans votre équipe Agile qui développe une application mobile de fitness, vous observez que le temps passé à corriger des bugs (bug fixing) représente 38 % de la vélocité totale depuis 5 sprints. Le Product Owner est frustré : "On passe plus de temps à corriger qu'à développer de nouvelles fonctionnalités". L'analyse montre que 70 % des bugs proviennent de 3 modules développés aux sprints 2-4. Comment résolvez-vous ce problème systémique ?`,
  options:[
    `A. Allouer 1 sprint complet exclusivement au bug fixing pour éliminer la dette de qualité accumulée.`,
    `B. Traiter le problème à deux niveaux : (1) Court terme — prioriser la correction des bugs des 3 modules problématiques (70 % des bugs) en sprints dédiés ou en capacity fixe par sprint (20 %) ; (2) Long terme — analyser pourquoi les sprints 2-4 ont généré autant de bugs (tests insuffisants ? spécifications ambiguës ? complexité sous-estimée ?) et renforcer les pratiques qualité (TDD, revues de code plus rigoureuses, critères d'acceptation plus précis) pour éviter que de nouveaux modules ne reproduisent le problème.`,
    `C. Arrêter le développement de nouvelles fonctionnalités jusqu'à ce que le taux de bugs tombe en dessous de 10 % de la vélocité.`,
    `D. Créer une équipe dédiée au bug fixing séparée de l'équipe de développement pour paralléliser les deux activités.`,
  ],
  correct:1,
  explication:`La réponse B est correcte. 38 % de la vélocité en bug fixing est un signal systémique qui révèle des pratiques de qualité insuffisantes aux sprints 2-4. La solution à deux niveaux (correction ciblée à court terme + amélioration systémique des pratiques qualité à long terme) est la plus efficace. Un sprint 100 % bug fixing (A) est parfois nécessaire mais ne résout pas les pratiques qui créent des bugs. L'arrêt des nouvelles fonctionnalités (C) est trop radical. Une équipe de bug fixing séparée (D) crée un anti-pattern connu — les développeurs qui créent les bugs ne les corrigent pas, ce qui n'améliore pas les pratiques.`,
},

{ id:"PR-048", domaine:"Processus", approche:"Prédictif", type:"standard",
  question:`Vous êtes chef de projet pour un programme de déploiement de bornes de recharge électrique pour poids lourds dans 15 aires d'autoroute (48 M€, 36 mois). À mi-programme, votre analyse identifie que 4 des 15 sites présentent des surcoûts importants (+35 % en moyenne) liés à des contraintes électriques inattendues (renforcement du réseau nécessaire), tandis que les 11 autres sites sont dans le budget. Les données EVM globales montrent IPC-C = 0,93 — acceptable en apparence. Comment présentez-vous honnêtement la situation au comité de pilotage ?`,
  options:[
    `A. Présenter l'IPC-C global de 0,93 comme indicateur principal — la situation est globalement maîtrisée.`,
    `B. Présenter une analyse différenciée : IPC-C global = 0,93 (apparemment satisfaisant) masque une réalité bimodale — 11 sites à IPC-C moyen de 1,08 (performants) et 4 sites à IPC-C moyen de 0,65 (en difficulté sévère). La cause des 4 sites problématiques (contraintes électriques inattendues) est systémique — une analyse préventive des 11 sites restants doit vérifier si le même risque existe. Présenter le coût estimé de correction pour les 4 sites et l'impact sur le budget programme si les autres sites présentent des contraintes similaires.`,
    `C. Ne pas présenter les 4 sites problématiques séparément pour éviter d'alarmer le comité — la situation globale est sous contrôle.`,
    `D. Attendre que les 4 sites problématiques soient résolus avant le prochain comité pour présenter une situation améliorée.`,
  ],
  correct:1,
  explication:`La réponse B est correcte. Un IPC-C global de 0,93 qui masque une bimodalité sévère (0,65 sur 4 sites vs 1,08 sur 11 sites) est une présentation trompeuse si elle n'est pas décomposée. Le comité de pilotage ne peut pas exercer sa gouvernance sur la base d'une moyenne qui cache des signaux de risque importants. La cause systémique (contraintes électriques inattendues) sur 4 sites suggère que les 11 sites restants peuvent présenter le même risque — une analyse préventive s'impose. Cacher ou retarder l'information (C, D) viole les obligations de transparence.`,
},

{ id:"PR-049", domaine:"Processus", approche:"Agile", type:"standard",
  question:`Votre équipe Scrum développe une application B2B de gestion de contrats. Au sprint 13, lors de la démonstration au client, celui-ci réalise qu'une fonctionnalité importante livrée au sprint 6 (gestion des avenants) fonctionne correctement selon les spécifications mais est "inutilisable dans la pratique" car elle nécessite 14 clics pour une opération que les utilisateurs font 50 fois par jour. Le client demande une refonte de l'ergonomie. Comment traitez-vous cette demande ?`,
  options:[
    `A. Refuser la refonte — la fonctionnalité a été livrée et validée selon les spécifications au sprint 6. Une refonte serait un nouveau développement facturable.`,
    `B. Reconnaître que c'est une situation courante en développement Agile : une fonctionnalité techniquement correcte peut être ergonomiquement insuffisante dans l'usage réel. Créer une story de refonte ergonomique avec le PO, l'évaluer et la prioriser selon son impact business (50 opérations/jour × N utilisateurs = impact significatif) ; dans le futur, inclure des tests d'utilisabilité dans la Définition de Fini pour les fonctionnalités à usage intensif — la responsabilité d'un problème découvert tard est partagée entre le client (qui aurait dû valider l'ergonomie plus tôt) et l'équipe (qui aurait pu proposer des tests d'usabilité).`,
    `C. Livrer la refonte dans le sprint suivant en priorité absolue — la satisfaction client est primordiale.`,
    `D. Facturer la refonte comme un nouveau projet — les spécifications ont été respectées et la refonte est une demande nouvelle.`,
  ],
  correct:1,
  explication:`La réponse B est correcte. Le problème d'ergonomie (14 clics pour une opération fréquente) est un défaut d'utilisabilité découvert tardivement — une situation évitable si des tests d'usabilité avaient été inclus dans la Définition de Fini pour les fonctionnalités à usage intensif. La réponse doit être pragmatique (créer et prioriser la story de refonte) et systémique (améliorer le processus pour éviter la récurrence). La responsabilité est partagée : le client aurait dû valider l'ergonomie plus tôt, l'équipe aurait pu proposer des tests d'usabilité. Le refus catégorique (A) ou la facturation immédiate (D) endommagent la relation client.`,
},

{ id:"PR-050", domaine:"Processus", approche:"Prédictif", type:"standard",
  question:`Vous êtes chef de projet d'un programme de transformation d'une chaîne hôtelière (12 hôtels, 95 M€, 48 mois). À mois 30, vous réalisez que le projet de rénovation de l'hôtel flagship (Paris, 5 étoiles) a un retard de 8 mois lié à des découvertes archéologiques nécessitant un arrêt pour fouilles préventives (obligation légale). Ce retard impacte l'ouverture pendant la haute saison (Jeux Olympiques prévus), générant une perte de revenus estimée à 4,2 M€. Le retard est hors de votre contrôle (force majeure légale). Comment gérez-vous la communication et les décisions ?`,
  options:[
    `A. Informer la direction hôtelière et demander si des alternatives commerciales peuvent compenser pendant la période d'indisponibilité.`,
    `B. Organiser immédiatement une réunion de crise avec le propriétaire, la direction hôtelière et l'assureur du programme : présenter la situation factuelle (découverte archéologique = arrêt obligatoire légal, durée estimée des fouilles, impact sur le calendrier d'ouverture), analyser les options (accélération post-fouilles pour récupérer partiellement le retard, ouverture partielle de l'hôtel pendant les travaux restants, plan commercial alternatif pendant la période de fermeture), activer les clauses d'assurance pour force majeure, et notifier les autorités du patrimoine archéologique selon les obligations légales.`,
    `C. Chercher à minimiser la durée des fouilles en négociant avec les archéologues pour accélérer leur travail.`,
    `D. Reprendre les travaux de rénovation dans les zones non archéologiques pour minimiser l'impact sur le planning global.`,
  ],
  correct:1,
  explication:`La réponse B est correcte. Une découverte archéologique est une force majeure légale qui déclenche des obligations multiples : légales (notification des autorités du patrimoine, arrêt des travaux dans la zone), contractuelles (activation des clauses de force majeure avec l'assureur), commerciales (alternatives pour la période d'indisponibilité) et de communication (transparence immédiate avec le propriétaire et la direction hôtelière). La perte de 4,2 M€ pendant les JO est un enjeu financier majeur qui nécessite une réunion de crise, pas une communication incrémentale. Négocier avec les archéologues (C) pour accélérer des fouilles réglementées est non réaliste.`,
},,
// ── Questions supplémentaires Env. d'affaires ──
{ id:"EA-016", domaine:"Environnement d'affaires", approche:"Prédictif", type:"standard",
  question:`Vous êtes chef de projet pour la construction d'une usine de traitement des eaux usées dans un pays d'Afrique subsaharienne (22 M€, 28 mois), financée à 60 % par un bailleur international (Banque Mondiale). Lors d'une mission de supervision du bailleur au mois 14, l'auditeur identifie que 3 marchés passés avec des sous-traitants locaux n'ont pas respecté les procédures d'appel d'offres concurrentiel du bailleur. Les marchés ont été attribués directement sans mise en concurrence. Comment gérez-vous cette situation ?`,
  options:[
    `A. Expliquer à l'auditeur du bailleur que les règles locales permettent l'attribution directe et que les sous-traitants choisis sont compétents.`,
    `B. Reconnaître la non-conformité aux procédures du bailleur ; analyser avec le chef comptable et le responsable des marchés les circonstances de ces 3 attributions directes (urgence justifiée ? méconnaissance des procédures ? autre raison ?) ; préparer une explication factuelle et honnête pour le bailleur ; s'engager sur un plan correctif pour les marchés futurs (formation aux procédures d'appel d'offres du bailleur, check-list de conformité avant toute attribution) ; dans le cas où des marchés comparables peuvent encore être mis en concurrence (services en cours), évaluer si une remise en concurrence est possible sans perturbation majeure.`,
    `C. Demander au bailleur de faire une exception pour ces 3 marchés car les sous-traitants locaux ont été choisis pour soutenir l'économie locale.`,
    `D. Contacter les sous-traitants pour régulariser rétroactivement les procédures d'attribution.`,
  ],
  correct:1,
  explication:`La réponse B est correcte. Les non-conformités aux procédures d'un bailleur international sont des situations sérieuses pouvant entraîner la suspension ou le remboursement des décaissements. La transparence et l'honnêteté avec l'auditeur sont indispensables (Code d'Éthique PMI). L'analyse des causes (méconnaissance des procédures vs abus délibéré) détermine la réponse corrective appropriée. La régularisation rétroactive (D) constitue une falsification de procédure — inacceptable. Invoquer le soutien à l'économie locale (C) ne justifie pas une non-conformité aux procédures contractuelles du bailleur.`,
},

{ id:"EA-017", domaine:"Environnement d'affaires", approche:"Agile", type:"standard",
  question:`Votre organisation lance un projet de développement d'une IA de recrutement pour remplacer les pré-sélections manuelles de CV. Le système promet de réduire le temps de pré-sélection de 8h à 20 minutes par poste. Le DRH est enthousiaste. Lors de la phase de test, vous découvrez que l'IA analyse les profils LinkedIn des candidats (sans leur consentement explicite) et intègre des données de réputation sociale pour pondérer le scoring. Quelle est votre position ?`,
  options:[
    `A. Déployer le système — l'efficacité de recrutement est l'objectif principal et les données LinkedIn sont publiques.`,
    `B. Bloquer le déploiement et alerter le DRH et le DPO : l'analyse des profils LinkedIn sans consentement explicit peut constituer une violation du RGPD (traitement de données personnelles sans base légale adéquate pour les décisions de recrutement) ; l'intégration de données de "réputation sociale" dans le scoring de candidats est particulièrement problématique (discrimination potentielle basée sur des données non pertinentes pour l'emploi, biais algorithmiques). Recommander une refonte du système pour utiliser uniquement les données fournies volontairement par les candidats dans leur candidature.`,
    `C. Modifier les CGU de l'entreprise pour inclure l'analyse des profils LinkedIn des candidats — ainsi le consentement est couvert.`,
    `D. Informer les candidats lors du processus de candidature que leurs profils sociaux peuvent être analysés — la transparence suffit à légaliser la pratique.`,
  ],
  correct:1,
  explication:`La réponse B est correcte. Le traitement de données personnelles de candidats sans base légale adéquate constitue une violation du RGPD. L'utilisation de "réputation sociale" dans le scoring de recrutement est doublement problématique : violation de la vie privée et discrimination potentielle (les réseaux sociaux reflètent des facteurs socio-économiques, culturels et familiaux non pertinents pour l'emploi). La modification des CGU (C) ne constitue pas un consentement valide au sens du RGPD pour ce type de traitement. La simple transparence (D) ne suffit pas — la base légale (consentement explicite ou intérêt légitime) doit être valide.`,
},

{ id:"EA-018", domaine:"Environnement d'affaires", approche:"Prédictif", type:"standard",
  question:`Vous êtes chef de programme pour un programme de modernisation des infrastructures d'une ville (180 M€, 5 ans). À mi-programme (année 3), une analyse de réalisation des bénéfices révèle que les économies sur la maintenance attendues (objectif principal du business case) sont de 12 % par rapport au parc existant, alors que le business case initial prévoyait 28 %. L'écart est significatif et modifie le ROI du programme. Quelles sont vos obligations et actions ?`,
  options:[
    `A. Continuer le programme sans modifier le business case — les bénéfices réalisés (12 %) restent positifs même s'ils sont inférieurs aux prévisions.`,
    `B. Analyser les causes de l'écart (hypothèses initiales trop optimistes ? changements de contexte ? problèmes d'implémentation ?) ; mettre à jour formellement le business case avec les projections révisées pour les 2 années restantes ; présenter au comité de pilotage l'analyse complète incluant les options : (1) continuer avec le business case révisé (ROI réduit mais positif), (2) modifier le programme pour maximiser les bénéfices restants, (3) arrêter si le ROI révisé est négatif. La décision appartient aux instances de gouvernance, pas au chef de programme.`,
    `C. Revisiter les méthodes de mesure des économies — les 12 % peuvent être sous-évalués si la méthode de calcul est incorrecte.`,
    `D. Compenser les économies de maintenance insuffisantes par d'autres bénéfices non prévus dans le business case initial pour maintenir le ROI apparent.`,
  ],
  correct:1,
  explication:`La réponse B est correcte. Un écart de 57 % sur les bénéfices projetés (12 % vs 28 %) est un signal critique qui doit être présenté honnêtement aux instances de gouvernance (ECO T3 — Évaluer et livrer les bénéfices). Continuer sans mise à jour du business case (A) prive le comité de pilotage d'informations essentielles pour décider de la poursuite du programme. La manipulation des méthodes de mesure (C) ou la compensation par des bénéfices non prévus (D) constituent des pratiques de dissimulation contraires au Code d'Éthique PMI. Les instances de gouvernance doivent pouvoir décider sur la base d'informations réelles.`,
},

{ id:"EA-019", domaine:"Environnement d'affaires", approche:"Hybride", type:"standard",
  question:`Votre organisation gère un portefeuille de 12 projets. Une analyse de portefeuille révèle que 3 projets consomment 45 % des ressources du portefeuille mais ne contribuent qu'à 12 % des bénéfices stratégiques attendus. Ces 3 projets ont tous été lancés par des directeurs très influents et sont considérés comme "intouchables" politiquement. En tant que directeur du PMO, comment abordez-vous cette situation ?`,
  options:[
    `A. Éviter de remettre en question ces 3 projets — le capital politique nécessaire est trop élevé et les conséquences de l'affrontement avec ces directeurs sont imprévisibles.`,
    `B. Préparer une analyse de portefeuille rigoureuse et objective présentant les données pour l'ensemble du portefeuille (pas seulement les 3 projets) : contribution des ressources vs contribution aux bénéfices stratégiques pour chaque projet. Présenter cette analyse au comité de direction (au-dessus des directeurs concernés) dans un contexte de révision stratégique du portefeuille — pas comme une attaque contre des projets spécifiques. Recommander des critères objectifs de priorisation pour l'ensemble du portefeuille et laisser le comité de direction prendre les décisions difficiles sur la base des données.`,
    `C. Demander à chaque directeur de justifier la contribution stratégique de ses projets — cette démarche les mettra face à leurs responsabilités.`,
    `D. Réallouer discrètement des ressources des 3 projets vers les projets à plus forte contribution stratégique sans en informer les directeurs concernés.`,
  ],
  correct:1,
  explication:`La réponse B est correcte. La gouvernance du portefeuille (ECO T8) exige que les décisions d'allocation des ressources soient basées sur des critères stratégiques objectifs, pas sur l'influence politique. La présentation d'une analyse de portefeuille globale (pas ciblée sur les 3 projets) au comité de direction crée le contexte approprié pour des décisions difficiles. C'est au comité de direction de prendre ces décisions — pas au PMO de les imposer ni de les contourner. La réallocation discrète (D) serait une usurpation de l'autorité de gouvernance.`,
},

{ id:"EA-020", domaine:"Environnement d'affaires", approche:"Agile", type:"standard",
  question:`Vous êtes chef de projet pour le développement d'une plateforme de services financiers pour particuliers dans un pays où la réglementation sur les services de paiement évolue rapidement. Lors de votre sprint 12, une nouvelle circulaire réglementaire est publiée qui impose de nouvelles obligations KYC (Know Your Customer) pour tous les services de paiement — avec un délai de mise en conformité de 4 mois. Votre plateforme sera lancée dans 3 mois. Comment intégrez-vous cette contrainte ?`,
  options:[
    `A. Lancer la plateforme dans 3 mois comme prévu et mettre en conformité les modules KYC dans les 4 mois suivant le lancement — la circulaire permet 4 mois de délai.`,
    `B. Analyser précisément les exigences KYC de la circulaire et leur impact sur l'architecture de la plateforme ; évaluer si la conformité peut être atteinte en 3 mois (avant le lancement) — si oui, intégrer immédiatement les requirements KYC dans le backlog prioritaire ; si non, présenter au client les deux options : (1) report du lancement de 4-6 semaines pour être conforme dès le lancement, (2) lancement dans 3 mois avec les fonctionnalités KYC existantes et mise à niveau dans les 4 mois réglementaires. Consulter le service juridique et le régulateur pour confirmer si un lancement non entièrement conforme avec plan de mise en conformité est acceptable.`,
    `C. Lancer la plateforme dans 3 mois car les 4 mois réglementaires courent à compter de la publication de la circulaire, pas du lancement de la plateforme.`,
    `D. Retarder le lancement jusqu'à pleine conformité — lancer un service financier avec des lacunes réglementaires est inacceptable.`,
  ],
  correct:1,
  explication:`La réponse B est correcte. La gestion des changements réglementaires (ECO T4 — Évaluer et adresser les changements externes) exige une analyse précise avant de décider. L'interprétation des délais réglementaires (la circulaire s'applique-t-elle aux nouvelles plateformes dès leur lancement ou seulement aux opérateurs existants ?) est une question juridique qui nécessite consultation. La présentation des deux options au client avec les implications de chacune permet une décision éclairée. Lancer non conforme (A, C) sans validation juridique de l'interprétation des délais expose l'organisation à des risques réglementaires.`,
},

{ id:"EA-021", domaine:"Environnement d'affaires", approche:"Prédictif", type:"standard",
  question:`Vous êtes directeur de programme pour un programme de transformation digitale de la fonction achat d'un groupe de 45 000 employés (35 M€, 36 mois). À mois 24, le groupe fait l'objet d'une fusion avec un concurrent. La nouvelle direction de la fusion examine tous les programmes en cours et envisage d'arrêter votre programme ("doublon avec le programme équivalent de l'entreprise fusionnée"). Comment gérez-vous cette menace sur votre programme ?`,
  options:[
    `A. Continuer le programme normalement jusqu'à une décision formelle de la nouvelle direction — sans décision officielle, le programme doit continuer.`,
    `B. Prendre l'initiative de préparer un dossier de valeur du programme à mi-parcours : bénéfices déjà réalisés (économies achats, processus améliorés), investissement déjà engagé (24 mois / 35 M€ × ratio avancement), coût d'arrêt vs coût de continuation, analyse comparative avec le programme équivalent de l'entreprise fusionnée (complémentarité vs duplication réelle), et options de synergie possibles (convergence des deux programmes en un seul). Présenter ce dossier proactivement à la nouvelle direction avant qu'une décision soit prise sur la base d'informations incomplètes.`,
    `C. Mobiliser les commanditaires internes du programme pour faire pression sur la nouvelle direction afin qu'elle maintienne le programme.`,
    `D. Accélérer le déploiement des composantes les plus visibles du programme pour créer un fait accompli difficile à abandonner.`,
  ],
  correct:1,
  explication:`La réponse B est correcte. Face à une menace d'arrêt de programme, la démarche professionnelle est de préparer un dossier de valeur objectif qui aide la nouvelle direction à prendre une décision éclairée — pas de faire de la politique (C) ou de créer des faits accomplis (D). Le dossier doit inclure honnêtement tant les arguments pour la continuation que les options de synergie avec le programme équivalent de la fusion — une décision de convergence des deux programmes peut être une bonne décision pour l'organisation fusionnée. La continuation aveugle (A) sans s'engager dans la réflexion de la nouvelle direction est une erreur stratégique.`,
},

{ id:"EA-022", domaine:"Environnement d'affaires", approche:"Hybrid", type:"standard",
  question:`Vous gérez un projet de déploiement d'une solution de supply chain pour un groupe agro-alimentaire. À mois 18 (sur 24 mois), votre analyse de risques identifie un risque critique : votre fournisseur principal de logiciels (qui fournit le composant central de la solution) vient d'annoncer qu'il sera acquis par un concurrent direct de votre client dans les 6 prochains mois. Votre client risque donc de se retrouver dépendant d'un outil dont le développement sera contrôlé par son concurrent. Comment gérez-vous ce risque stratégique ?`,
  options:[
    `A. Attendre que la fusion soit finalisée pour évaluer l'impact réel — les intentions du concurrent acquéreur ne sont pas encore connues.`,
    `B. Alerter immédiatement le client de ce risque stratégique ; analyser les options disponibles : (1) négocier maintenant avec le fournisseur (avant la fusion) des clauses contractuelles protectrices (droits source code en escrow, garanties de continuité de service, clauses de résiliation sans pénalité) ; (2) évaluer les solutions alternatives qui pourraient remplacer le composant central (coût de migration, délai, risque de transition) ; (3) accélérer la finalisation du déploiement pour minimiser la dépendance future ; (4) consulter le service juridique sur les options contractuelles. La décision stratégique appartient au client mais il doit être informé immédiatement.`,
    `C. Continuer le déploiement comme prévu — la fusion peut ne pas se réaliser et le concurrent peut ne pas modifier les conditions de la solution.`,
    `D. Proposer immédiatement une migration vers une solution alternative avant la fusion — mieux vaut prévenir.`,
  ],
  correct:1,
  explication:`La réponse B est correcte. Une acquisition par un concurrent direct est un risque stratégique majeur pour le client — sa supply chain deviendra dépendante d'un outil contrôlé par son concurrent, ce qui crée des risques de confidentialité des données et de continuité de service. L'alerte immédiate au client (ECO T4 — Évaluer et adresser les changements externes) et la préparation d'options avant la finalisation de la fusion (quand le levier de négociation est encore disponible) sont des actions urgentes. Attendre (A, C) laisse passer la fenêtre d'opportunité pour les clauses contractuelles protectrices.`,
},

{ id:"EA-023", domaine:"Environnement d'affaires", approche:"Prédictif", type:"standard",
  question:`Vous êtes chef de projet pour la construction d'un complexe hôtelier de luxe dans une zone côtière (68 M€, 36 mois). Six mois avant la livraison prévue, une étude d'impact environnemental commandée par une ONG locale révèle que la construction a endommagé un récif corallien protégé à 200 mètres du site, probablement lors des travaux de fondation offshore. L'étude n'est pas encore publique mais l'ONG vous en a informé de façon préventive avant publication. Quelle est votre réaction ?`,
  options:[
    `A. Attendre que l'étude soit publiée officiellement avant d'agir — une étude commandée par une ONG n'a pas de valeur juridique contraignante.`,
    `B. Prendre la situation au sérieux immédiatement : commander une contre-expertise indépendante pour évaluer l'étendue réelle des dommages ; informer le maître d'ouvrage et le service juridique ; contacter les autorités environnementales compétentes de manière proactive avant que l'étude soit publiée (la proactivité est valorisée par les régulateurs et les tribunaux) ; arrêter tout travail offshore susceptible d'aggraver les dommages ; évaluer les options de remédiation (restauration du récif).`,
    `C. Mandater un expert en communication de crise pour gérer la relation avec l'ONG et négocier que l'étude ne soit pas publiée.`,
    `D. Vérifier si les travaux de fondation offshore étaient dans le périmètre des autorisations accordées — si oui, la responsabilité est couverte par les autorisations obtenues.`,
  ],
  correct:1,
  explication:`La réponse B est correcte. Un dommage à un récif corallien protégé est une urgence environnementale légale — les récifs coralliens sont protégés par des conventions internationales et des législations nationales strictes. La notification proactive aux autorités avant la publication de l'étude est systématiquement perçue favorablement par les régulateurs (démonstration de bonne foi) vs la découverte via la presse. La remédiation du récif peut être obligatoire et coûteuse, mais retarder l'action aggrave les dommages et la responsabilité. Tenter de bloquer la publication (C) serait un comportement inacceptable éthiquement et juridiquement.`,
},

{ id:"EA-024", domaine:"Environnement d'affaires", approche:"Agile", type:"standard",
  question:`Vous êtes chef de programme pour la transformation numérique d'une mutuelle de santé (28 M€, 36 mois). Le programme inclut un projet de migration des données de santé de 840 000 adhérents vers une nouvelle plateforme cloud. Lors des tests de migration, votre équipe découvre que les données de santé de 2 300 adhérents ont été temporairement accessibles à un sous-traitant technique non habilité pendant 4 heures, suite à une erreur de configuration des droits d'accès. Le sous-traitant affirme n'avoir consulté aucune donnée. Comment gérez-vous cet incident ?`,
  options:[
    `A. Ne pas notifier car le sous-traitant affirme n'avoir consulté aucune donnée — il n'y a pas de preuve de violation réelle.`,
    `B. Traiter cet incident comme une violation de données personnelles au sens du RGPD : notifier la CNIL dans les 72 heures (délai légal obligatoire) avec les éléments connus (nature de l'incident, catégories de données concernées, nombre d'adhérents, mesures prises) ; évaluer avec le DPO si les 2 300 adhérents concernés doivent être notifiés individuellement (critères RGPD : risque élevé pour leurs droits et libertés) ; auditer les logs d'accès du sous-traitant pour vérifier s'il y a eu des consultations effectives ; corriger immédiatement la configuration des droits d'accès et renforcer les contrôles.`,
    `C. Notifier uniquement le DPO interne et ne pas alerter la CNIL — l'incident est limité et gérable en interne sans déclaration officielle.`,
    `D. Notifier la CNIL uniquement si l'audit des logs confirme que des données ont effectivement été consultées.`,
  ],
  correct:1,
  explication:`La réponse B est correcte. Le RGPD définit une violation de données personnelles comme "une violation de la sécurité entraînant la destruction, la perte, l'altération, la divulgation non autorisée ou l'accès non autorisé à des données personnelles" — l'accès non autorisé aux données de santé de 2 300 adhérents pendant 4 heures constitue une violation au sens du RGPD, même si aucune donnée n'a été consultée. La notification à la CNIL dans les 72 heures est une obligation légale, pas une option. Les données de santé sont des données sensibles à protection renforcée (article 9 RGPD). Attendre la confirmation de consultation (D) rate le délai légal de 72 heures.`,
},

{ id:"EA-025", domaine:"Environnement d'affaires", approche:"Prédictif", type:"standard",
  question:`Vous êtes chef de projet pour la construction d'une école publique dans une région défavorisée (5,8 M€, 18 mois), financée par l'État et une ONG internationale. À mois 10, les travaux de gros œuvre sont terminés mais les équipements électriques et informatiques, attendus d'un fournisseur européen, ont été bloqués 3 mois aux douanes en raison d'un problème de classification douanière. La livraison est désormais prévue dans 5 semaines seulement avant la date de rentrée scolaire contractuelle. Le contrat prévoit une clause de pénalités pour retard de 30 000 € par semaine après la rentrée. Comment gérez-vous cette situation critique ?`,
  options:[
    `A. Attendre la livraison des équipements bloqués en douane et espérer qu'ils arrivent à temps pour la rentrée.`,
    `B. Mobiliser immédiatement une équipe dédiée à la résolution du blocage douanier (courtier en douane spécialisé, contact avec les autorités douanières, vérification de la classification correcte) ; identifier des fournisseurs locaux ou régionaux alternatifs pour les équipements critiques qui permettraient une livraison dans les 5 semaines si le blocage douanier ne se résout pas dans les 10 jours ; informer le maître d'ouvrage (État et ONG) de la situation et du risque de retard avec les options et leur coût ; documenter la situation comme cas de force majeure partielle (blocage douanier suite à une décision administrative extérieure) pour la gestion des pénalités éventuelles.`,
    `C. Documenter le blocage douanier comme cas de force majeure et demander une extension automatique du délai contractuel.`,
    `D. Informer l'ONG que la rentrée scolaire ne pourra pas avoir lieu à la date prévue et proposer une date alternative 8 semaines plus tard.`,
  ],
  correct:1,
  explication:`La réponse B est correcte. Face à un risque de retard critique sur un projet social (école) avec pénalités significatives, la réponse doit être simultanément réactive (résoudre le blocage douanier en urgence) et préventive (identifier des alternatives locales). La force majeure (C) n'est pas automatique — elle doit être qualifiée et acceptée par le maître d'ouvrage, ce qui prend du temps. La résignation (D) sans avoir épuisé les options d'accélération n'est pas acceptable sur un projet d'intérêt public. Attendre passivement (A) laisse filer les semaines sans action.`,
},

{ id:"EA-026", domaine:"Environnement d'affaires", approche:"Hybride", type:"standard",
  question:`Vous êtes directeur de programme pour un programme de déploiement de solutions numériques dans un réseau de 200 pharmacies indépendantes (18 M€, 30 mois). À mois 20, une analyse de la réalisation des bénéfices montre que les pharmacies qui ont adopté toutes les fonctionnalités du système (35 % des pharmacies) affichent en moyenne 18 % d'amélioration de leur efficacité opérationnelle (objectif : 15 %). Cependant, 65 % des pharmacies n'utilisent que les fonctionnalités de base et affichent seulement 4 % d'amélioration. Comment analysez-vous et gérez-vous cette situation pour les 10 mois restants ?`,
  options:[
    `A. Considérer le programme comme un succès partiel (35 % d'adoption complète avec résultats au-delà des objectifs) et maintenir l'approche actuelle.`,
    `B. Analyser les facteurs qui différencient les 35 % de pharmacies à adoption complète des 65 % à adoption partielle (formation reçue ? profil du pharmacien ? type de clientèle ? accompagnement local disponible ?) ; développer un plan d'intensification de l'accompagnement ciblé sur les pharmacies à adoption partielle basé sur les facteurs identifiés ; fixer un objectif de 70 % d'adoption complète à la fin du programme ; présenter au comité de pilotage cette analyse et le plan avec les ressources nécessaires (accompagnement additionnel = investissement) et le gain de bénéfices attendu (65 pharmacies passant de 4 % à 12 % d'amélioration = impact significatif sur le bénéfice global du programme).`,
    `C. Accepter que 35 % d'adoption complète soit le maximum atteignable avec ce type de réseau — les pharmacies indépendantes ne peuvent pas être forcées à adopter des fonctionnalités qu'elles ne souhaitent pas utiliser.`,
    `D. Considérer les 65 % de pharmacies à adoption partielle comme hors périmètre et concentrer les efforts sur la consolidation et l'expansion chez les 35 % performantes.`,
  ],
  correct:1,
  explication:`La réponse B est correcte. L'écart d'adoption (35 % vs 65 %) révèle que le problème n'est pas le produit (les 35 % à adoption complète dépassent les objectifs) mais l'accompagnement au changement pour les 65 % restants. Comprendre les facteurs différenciateurs (formation, profil, accompagnement) permet de déployer des ressources ciblées pour maximiser les bénéfices dans les 10 mois restants. Accepter (C) ou ignorer (D) les 65 % de pharmacies à faible adoption représente un renoncement à 65 % du potentiel du programme — une décision difficile à justifier devant les financeurs et les pharmacies elles-mêmes.`,
},

{ id:"EA-027", domaine:"Environnement d'affaires", approche:"Agile", type:"standard",
  question:`Vous êtes chef de projet pour le développement d'une application de covoiturage destinée aux zones rurales d'Afrique francophone. L'application sera lancée dans 3 pays (Sénégal, Côte d'Ivoire, Maroc). Lors de la phase de test utilisateur dans chaque pays, vous découvrez que les comportements d'utilisation et les fonctionnalités prioritaires diffèrent significativement entre les 3 pays : au Sénégal, les utilisateurs privilégient le paiement en espèces et les groupes WhatsApp pour la coordination ; en Côte d'Ivoire, l'usage du mobile money est dominant ; au Maroc, les utilisateurs attendent des fonctionnalités de notation et de vérification d'identité avancées. Comment adaptez-vous votre product roadmap ?`,
  options:[
    `A. Développer un produit unique standardisé pour les 3 pays — la localisation excessive fragmente le produit et augmente les coûts de maintenance.`,
    `B. Réviser la roadmap pour adopter une architecture core + modules spécifiques par marché : développer un socle commun (géolocalisation, matching conducteur/passager, communication) et des modules pays différenciés (paiement espèces + intégration WhatsApp pour le Sénégal, mobile money pour la Côte d'Ivoire, notation avancée + vérification identité pour le Maroc) ; prioriser le lancement dans le pays le plus mature (Maroc pour les fonctionnalités avancées déjà connues) et adapter la roadmap des autres pays en fonction des apprentissages ; allouer une capacité permanente pour la localisation dans le budget.`,
    `C. Choisir le marché le plus simple (Côte d'Ivoire, mobile money dominant) pour le lancement initial et reporter les autres pays à une version 2.0.`,
    `D. Développer 3 applications distinctes entièrement séparées pour chaque pays — la personnalisation maximale génère la meilleure adoption.`,
  ],
  correct:1,
  explication:`La réponse B est correcte. L'architecture core + modules spécifiques est la stratégie optimale pour des marchés avec des comportements différents. Elle évite la fragmentation (3 applications séparées = 3 fois le coût de maintenance) tout en permettant l'adaptation aux spécificités locales. Les tests utilisateur ont révélé des différences fondamentales (paiement espèces vs mobile money vs fonctionnalités avancées) qui ne peuvent pas être ignorées sans risquer l'adoption. La standardisation forcée (A) sur 3 marchés aussi différents compromettrait l'usage dans au moins 2 des 3 marchés.`,
},

];

// ─── Utilitaires ────────────────────────────────────────────────
function melanger(arr){
  const a=[...arr];
  for(let i=a.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}

function construireExamen(n){
  const P  = TOUTES_QUESTIONS.filter(q=>q.domaine==="Personnes");
  const PR = TOUTES_QUESTIONS.filter(q=>q.domaine==="Processus");
  const EA = TOUTES_QUESTIONS.filter(q=>q.domaine==="Environnement d'affaires");
  const cP=Math.round(n*0.33), cPR=Math.round(n*0.41), cEA=n-cP-cPR;
  // pick with overflow: if pool smaller than needed, take all then fill from remainder
  const pick=(pool,nb)=>{
    const shuffled=melanger(pool);
    if(shuffled.length>=nb) return shuffled.slice(0,nb);
    return shuffled; // take all available
  };
  const pQ=pick(P,cP), prQ=pick(PR,cPR), eaQ=pick(EA,cEA);
  const taken=new Set([...pQ,...prQ,...eaQ].map(q=>q.id));
  // Fill remaining slots from unused questions proportionally
  const reste=TOUTES_QUESTIONS.filter(q=>!taken.has(q.id)&&q.domaine!=="IA & Durabilité");
  const combined=[...pQ,...prQ,...eaQ,...melanger(reste)];
  return melanger(combined).slice(0,n);
}

function construireTheme(theme){
  const t=THEMES.find(x=>x.id===theme);
  if(!t) return [];
  let pool;
  if(t.domaine) pool=TOUTES_QUESTIONS.filter(q=>q.domaine===t.domaine);
  else          pool=TOUTES_QUESTIONS.filter(q=>q.approche===t.approche);
  return melanger(pool).slice(0,20);
}

function fmtT(s){
  const h=Math.floor(s/3600),m=Math.floor((s%3600)/60),sc=s%60;
  if(h>0) return h+"h"+String(m).padStart(2,"0")+"m"+String(sc).padStart(2,"0")+"s";
  return String(m).padStart(2,"0")+":"+String(sc).padStart(2,"0");
}

// ─── Logo ATC SVG ────────────────────────────────────────────────
function LogoATC({size=48}){
  return(
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <ellipse cx="55" cy="48" rx="32" ry="38" fill="none" stroke={ATC.orange} strokeWidth="3"/>
      <ellipse cx="55" cy="48" rx="32" ry="38" fill="none" stroke={ATC.violet} strokeWidth="1.5" strokeDasharray="4 4"/>
      {[0,1,2,3,4,5,6,7,8,9,10,11,12].map(i=>(
        <line key={i} x1="23" y1={18+i*5} x2="87" y2={18+i*5}
          stroke={i%2===0?ATC.orange:ATC.violet} strokeWidth="2.5"
          strokeLinecap="round" opacity="0.7"/>
      ))}
    </svg>
  );
}

// ─── Composants UI ────────────────────────────────────────────────
function BadgeDomaine({domaine}){
  const c=DOMAINES[domaine]||{couleur:ATC.gray600,fond:ATC.gray100,label:domaine};
  return(
    <span style={{background:c.fond,color:c.couleur,border:`1px solid ${c.couleur}`,
      borderRadius:20,padding:"2px 10px",fontSize:12,fontWeight:700,whiteSpace:"nowrap"}}>
      {c.label}
    </span>
  );
}

function BadgeApproche({approche}){
  const c=APPROCHES[approche]||{couleur:ATC.gray600,fond:ATC.gray100};
  return(
    <span style={{background:c.fond,color:c.couleur,border:`1px solid ${c.couleur}`,
      borderRadius:20,padding:"2px 9px",fontSize:11,fontWeight:600,whiteSpace:"nowrap"}}>
      {approche}
    </span>
  );
}

function BarreProgression({v,max,couleur,h=6}){
  return(
    <div style={{background:ATC.gray200,borderRadius:99,height:h,overflow:"hidden"}}>
      <div style={{background:couleur||ATC.violet,
        width:Math.min(100,(v/(max||1))*100)+"%",
        height:"100%",transition:"width 0.4s",borderRadius:99}}/>
    </div>
  );
}

// ─── Écran d'Accueil ────────────────────────────────────────────
function Accueil({onDemarrer,onTheme}){
  const [mode,setMode]=useState(null);
  const [onglet,setOnglet]=useState("examen"); // "examen" | "theme"
  const [themeChoisi,setThemeChoisi]=useState(null);

  return(
    <div style={{minHeight:"100vh",background:`linear-gradient(135deg,#0F172A 0%,#1E1B4B 50%,#0F172A 100%)`,
      display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px 16px"}}>

      {/* Logo + Titre */}
      <div style={{textAlign:"center",marginBottom:28}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:14,marginBottom:16}}>
          <LogoATC size={52}/>
          <div>
            <div style={{color:ATC.orange,fontSize:13,fontWeight:800,letterSpacing:2,textTransform:"uppercase"}}>
              Africa Talent Consulting
            </div>
            <div style={{color:ATC.violetL,fontSize:11,fontWeight:500,letterSpacing:1}}>
              Training & Certification
            </div>
          </div>
        </div>
        <h1 style={{color:"#F8FAFC",fontSize:"clamp(24px,5vw,42px)",fontWeight:900,
          margin:"0 0 8px",letterSpacing:-1}}>
          Simulateur PMP® 2026
        </h1>
        <p style={{color:ATC.gray400,fontSize:14,margin:0}}>
          ECO officiel PMI • Juillet 2026 • 100 % en Français
        </p>
      </div>

      {/* Stats ECO */}
      <div style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",
        borderRadius:16,padding:"16px 20px",maxWidth:600,width:"100%",marginBottom:22}}>
        <div style={{color:ATC.gray400,fontSize:11,fontWeight:700,letterSpacing:1.5,marginBottom:12,textAlign:"center"}}>
          STRUCTURE ECO PMP® 2026 — SOURCE PMI.ORG
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:12}}>
          {Object.entries(DOMAINES).filter(([,d])=>d.pct>0).map(([nm,d])=>(
            <div key={nm} style={{background:"rgba(255,255,255,0.04)",
              border:`1px solid ${d.couleur}44`,borderRadius:12,padding:"12px 8px",textAlign:"center"}}>
              <div style={{color:d.couleur,fontSize:26,fontWeight:900}}>{d.pct}%</div>
              <div style={{color:ATC.gray400,fontSize:10,marginTop:4,lineHeight:1.3}}>{nm}</div>
            </div>
          ))}
        </div>
        <div style={{display:"flex",flexWrap:"wrap",gap:12,color:ATC.gray400,fontSize:11,justifyContent:"center"}}>
          <span>📋 180 questions (170 notées + 10 pilotes)</span>
          <span>⏱ 240 minutes</span>
          <span>🤖 IA & Durabilité</span>
          <span>60% Agile/Hybride · 40% Prédictif</span>
        </div>
      </div>

      {/* Onglets */}
      <div style={{display:"flex",gap:0,maxWidth:600,width:"100%",marginBottom:18,
        background:"rgba(255,255,255,0.05)",borderRadius:12,padding:4}}>
        {[["examen","🎯 Examen Complet"],["theme","📚 Révision Thématique"]].map(([id,lib])=>(
          <button key={id} onClick={()=>setOnglet(id)}
            style={{flex:1,padding:"10px 8px",border:"none",cursor:"pointer",borderRadius:9,
              fontSize:13,fontWeight:700,transition:"all 0.2s",
              background:onglet===id?`linear-gradient(135deg,${ATC.violet},${ATC.orange})`:"transparent",
              color:onglet===id?ATC.white:ATC.gray400}}>
            {lib}
          </button>
        ))}
      </div>

      {/* Mode Examen */}
      {onglet==="examen" && (
        <>
          <div style={{maxWidth:600,width:"100%",marginBottom:18}}>
            <div style={{color:ATC.gray400,fontSize:11,fontWeight:700,letterSpacing:1.5,
              marginBottom:12,textAlign:"center"}}>CHOISISSEZ VOTRE MODE D'EXAMEN</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10}}>
              {Object.entries(MODES).map(([n,m])=>(
                <button key={n} onClick={()=>setMode(Number(n))}
                  style={{background:mode===Number(n)
                    ?`linear-gradient(135deg,${ATC.violet}33,${ATC.orange}22)`
                    :"rgba(255,255,255,0.04)",
                    border:mode===Number(n)?`2px solid ${ATC.orange}`:"1px solid rgba(255,255,255,0.1)",
                    borderRadius:14,padding:"16px 14px",cursor:"pointer",textAlign:"left",transition:"all 0.2s"}}>
                  <div style={{color:"#F1F5F9",fontSize:15,fontWeight:700}}>{m.label}</div>
                  <div style={{color:ATC.gray400,fontSize:11,marginTop:4}}>{m.desc}</div>
                </button>
              ))}
            </div>
          </div>
          <button onClick={()=>mode&&onDemarrer(mode)} disabled={!mode}
            style={{background:mode?`linear-gradient(135deg,${ATC.violet},${ATC.orange})`
              :"rgba(255,255,255,0.05)",
              color:mode?ATC.white:ATC.gray400,border:"none",borderRadius:14,
              padding:"15px 48px",fontSize:16,fontWeight:700,cursor:mode?"pointer":"not-allowed",
              boxShadow:mode?"0 4px 24px rgba(249,115,22,0.3)":"none",transition:"all 0.2s"}}>
            {mode?`🚀 Démarrer — ${MODES[mode].label}`:"Sélectionnez un mode"}
          </button>
        </>
      )}

      {/* Mode Révision Thématique */}
      {onglet==="theme" && (
        <>
          <div style={{maxWidth:600,width:"100%",marginBottom:18}}>
            <div style={{color:ATC.gray400,fontSize:11,fontWeight:700,letterSpacing:1.5,
              marginBottom:12,textAlign:"center"}}>CHOISISSEZ UN THÈME (20 QUESTIONS)</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10}}>
              {THEMES.map(t=>(
                <button key={t.id} onClick={()=>setThemeChoisi(t.id)}
                  style={{background:themeChoisi===t.id
                    ?`linear-gradient(135deg,${ATC.violet}33,${ATC.orange}22)`
                    :"rgba(255,255,255,0.04)",
                    border:themeChoisi===t.id?`2px solid ${ATC.orange}`:"1px solid rgba(255,255,255,0.1)",
                    borderRadius:14,padding:"14px",cursor:"pointer",textAlign:"left",transition:"all 0.2s"}}>
                  <div style={{fontSize:20,marginBottom:4}}>{t.icon}</div>
                  <div style={{color:"#F1F5F9",fontSize:13,fontWeight:700}}>{t.label}</div>
                  <div style={{color:ATC.gray400,fontSize:11,marginTop:3}}>{t.desc}</div>
                </button>
              ))}
            </div>
          </div>
          <button onClick={()=>themeChoisi&&onTheme(themeChoisi)} disabled={!themeChoisi}
            style={{background:themeChoisi?`linear-gradient(135deg,${ATC.violet},${ATC.orange})`
              :"rgba(255,255,255,0.05)",
              color:themeChoisi?ATC.white:ATC.gray400,border:"none",borderRadius:14,
              padding:"15px 48px",fontSize:16,fontWeight:700,cursor:themeChoisi?"pointer":"not-allowed",
              boxShadow:themeChoisi?"0 4px 24px rgba(124,58,237,0.3)":"none",transition:"all 0.2s"}}>
            {themeChoisi?`📚 Réviser — ${THEMES.find(x=>x.id===themeChoisi)?.label}`:"Sélectionnez un thème"}
          </button>
        </>
      )}

      <div style={{color:ATC.gray400,fontSize:10,marginTop:20,textAlign:"center"}}>
        {TOUTES_QUESTIONS.filter(q=>q.domaine!=="IA & Durabilité").length} questions · Randomisation complète à chaque session
      </div>
    </div>
  );
}

// ─── Écran d'Examen ─────────────────────────────────────────────
function Examen({questions,onTerminer,modeLabel}){
  const [idx,setIdx]=useState(0);
  const [rep,setRep]=useState({});
  const [rev,setRev]=useState({});
  const [tps,setTps]=useState(MODES[questions.length]?MODES[questions.length].duree:THEME_DUREE);
  const [sig,setSig]=useState({});
  const [nav,setNav]=useState(false);
  const timer=useRef(null);

  useEffect(()=>{
    timer.current=setInterval(()=>setTps(t=>{
      if(t<=1){clearInterval(timer.current);return 0;}
      return t-1;
    }),1000);
    return()=>clearInterval(timer.current);
  },[]);

  const q=questions[idx];
  const repondu=rep[idx]!==undefined;
  const revele=rev[idx];
  const nbRep=Object.keys(rep).length;
  const alerte=tps<600;
  const critique=tps<120;

  // Contexte étude de cas
  const idCas=q.type==="etude-de-cas"?q.etudeDeCas?.id:null;
  const ctx=idCas?(q.etudeDeCas?.contexte||
    questions.find(x=>x.etudeDeCas?.id===idCas&&x.etudeDeCas?.contexte)?.etudeDeCas?.contexte
  ):null;
  const qCas=idCas?questions.filter(x=>x.etudeDeCas?.id===idCas):[];

  const repondre=i=>{if(!revele)setRep(r=>({...r,[idx]:i}));};
  const terminer=()=>{clearInterval(timer.current);onTerminer(rep,questions,tps);};

  return(
    <div style={{minHeight:"100vh",background:ATC.gray50}}>
      {/* Header */}
      <div style={{background:"#0F172A",padding:"10px 16px",display:"flex",
        alignItems:"center",gap:12,position:"sticky",top:0,zIndex:100,
        borderBottom:`2px solid ${ATC.orange}`}}>
        <div style={{flex:1}}>
          <BarreProgression v={idx+1} max={questions.length} couleur={ATC.orange} h={4}/>
          <div style={{color:ATC.gray400,fontSize:11,marginTop:3}}>
            Q{idx+1}/{questions.length} · {nbRep} répondues
            {modeLabel && <span style={{color:ATC.violet,marginLeft:8}}>· {modeLabel}</span>}
          </div>
        </div>
        <div style={{color:critique?ATC.red:alerte?ATC.orange:ATC.green,
          fontWeight:800,fontSize:17,minWidth:90,textAlign:"right"}}>
          ⏱ {fmtT(tps)}
        </div>
        <button onClick={()=>setNav(!nav)}
          style={{background:"rgba(255,255,255,0.1)",border:"none",color:ATC.white,
            borderRadius:8,padding:"6px 10px",cursor:"pointer",fontSize:12}}>
          📋
        </button>
      </div>

      <div style={{maxWidth:880,margin:"0 auto",padding:"20px 14px"}}>
        {/* Contexte étude de cas */}
        {ctx && (
          <div style={{background:"#EFF6FF",border:"1px solid #BFDBFE",
            borderLeft:`4px solid ${ATC.violet}`,borderRadius:12,padding:16,marginBottom:16}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,flexWrap:"wrap"}}>
              <span style={{background:ATC.violet,color:ATC.white,borderRadius:6,
                padding:"3px 10px",fontSize:11,fontWeight:700}}>ÉTUDE DE CAS</span>
              <span style={{color:ATC.violetD,fontWeight:600,fontSize:12}}>
                {q.etudeDeCas?.titre}
              </span>
            </div>
            <div style={{color:"#1E3A5F",fontSize:13,lineHeight:1.7,whiteSpace:"pre-line"}}>{ctx}</div>
            {qCas.length>1 && (
              <div style={{marginTop:10,display:"flex",gap:6,flexWrap:"wrap"}}>
                {qCas.map((cq,i)=>{
                  const qi=questions.indexOf(cq);
                  return(
                    <button key={cq.id} onClick={()=>setIdx(qi)}
                      style={{background:qi===idx?ATC.violet:"#DBEAFE",
                        color:qi===idx?ATC.white:ATC.violetD,
                        border:"none",borderRadius:6,padding:"3px 10px",cursor:"pointer",fontSize:12}}>
                      Q{i+1}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Carte question */}
        <div style={{background:ATC.white,borderRadius:16,
          boxShadow:"0 2px 16px rgba(0,0,0,0.08)",padding:"22px 20px",marginBottom:16}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14,flexWrap:"wrap"}}>
            <span style={{background:ATC.gray100,color:ATC.gray600,borderRadius:8,
              padding:"3px 10px",fontSize:12,fontWeight:700}}>#{idx+1}</span>
            <BadgeDomaine domaine={q.domaine}/>
            <BadgeApproche approche={q.approche}/>
            {q.type==="etude-de-cas" && (
              <span style={{background:"#FEF3C7",color:"#92400E",borderRadius:6,
                padding:"2px 8px",fontSize:10,fontWeight:700}}>Étude de Cas</span>
            )}
            <button onClick={()=>setSig(s=>({...s,[idx]:!s[idx]}))}
              style={{marginLeft:"auto",background:sig[idx]?ATC.redL:ATC.gray50,
                border:`1px solid ${sig[idx]?ATC.red:ATC.gray200}`,
                borderRadius:8,padding:"4px 10px",cursor:"pointer",fontSize:11,
                color:sig[idx]?ATC.red:ATC.gray400}}>
              {sig[idx]?"🚩 Signalée":"⛳ Signaler"}
            </button>
          </div>

          <p style={{color:ATC.gray800,fontSize:15,lineHeight:1.75,fontWeight:500,marginBottom:20}}>
            {q.question}
          </p>

          <div style={{display:"flex",flexDirection:"column",gap:9}}>
            {q.options.map((opt,i)=>{
              const sel=rep[idx]===i, cor=i===q.correct;
              let bg=ATC.gray50, bo=`1px solid ${ATC.gray200}`, co=ATC.gray600;
              if(revele){
                if(cor){bg=ATC.greenL;bo=`2px solid ${ATC.green}`;co="#065F46";}
                else if(sel){bg=ATC.redL;bo=`2px solid ${ATC.red}`;co="#7F1D1D";}
              } else if(sel){
                bg=ATC.violetL;bo=`2px solid ${ATC.violet}`;co=ATC.violetD;
              }
              return(
                <button key={i} onClick={()=>repondre(i)} disabled={revele}
                  style={{background:bg,border:bo,borderRadius:12,padding:"13px 15px",
                    cursor:revele?"default":"pointer",textAlign:"left",color:co,
                    fontSize:14,lineHeight:1.55,transition:"all 0.15s",
                    fontWeight:(sel||(revele&&cor))?600:400}}>
                  <span style={{display:"inline-flex",alignItems:"flex-start",gap:10}}>
                    <span style={{minWidth:24,height:24,borderRadius:"50%",flexShrink:0,
                      background:revele&&cor?ATC.green:revele&&sel?ATC.red:ATC.gray200,
                      display:"inline-flex",alignItems:"center",justifyContent:"center",
                      fontSize:11,color:revele&&(cor||sel)?ATC.white:ATC.gray600,fontWeight:700}}>
                      {revele&&cor?"✓":revele&&sel&&!cor?"✗":String.fromCharCode(65+i)}
                    </span>
                    <span>{opt.replace(/^[A-D]\. */,"")}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {repondu&&!revele && (
            <button onClick={()=>setRev(r=>({...r,[idx]:true}))}
              style={{marginTop:14,background:`linear-gradient(135deg,${ATC.violet},${ATC.orange})`,
                color:ATC.white,border:"none",borderRadius:10,padding:"10px 22px",
                cursor:"pointer",fontSize:13,fontWeight:600}}>
              📖 Voir l'explication
            </button>
          )}

          {revele && (
            <div style={{marginTop:16,background:"#FFFBEB",
              border:`1px solid #FCD34D`,borderLeft:`4px solid ${ATC.orange}`,
              borderRadius:12,padding:14}}>
              <div style={{color:"#78350F",fontWeight:700,fontSize:12,marginBottom:6}}>
                💡 EXPLICATION
              </div>
              <p style={{color:"#451A03",fontSize:13,lineHeight:1.7,margin:0}}>
                {q.explication}
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div style={{display:"flex",gap:10,justifyContent:"space-between",flexWrap:"wrap"}}>
          <button onClick={()=>setIdx(i=>Math.max(0,i-1))} disabled={idx===0}
            style={{background:idx===0?ATC.gray100:ATC.white,
              border:`1px solid ${ATC.gray200}`,borderRadius:10,padding:"10px 16px",
              cursor:idx===0?"not-allowed":"pointer",
              color:idx===0?ATC.gray400:ATC.gray800,fontWeight:600,fontSize:13}}>
            ← Précédente
          </button>

          {nbRep>=Math.floor(questions.length*0.4) && (
            <button onClick={terminer}
              style={{background:`linear-gradient(135deg,${ATC.green},#047857)`,
                color:ATC.white,border:"none",borderRadius:10,
                padding:"10px 20px",cursor:"pointer",fontWeight:700,fontSize:13}}>
              🏁 Terminer
            </button>
          )}

          <button onClick={()=>setIdx(i=>Math.min(questions.length-1,i+1))}
            disabled={idx===questions.length-1}
            style={{background:idx===questions.length-1?ATC.gray100
              :`linear-gradient(135deg,${ATC.violet},${ATC.orange})`,
              border:"none",borderRadius:10,padding:"10px 16px",
              cursor:idx===questions.length-1?"not-allowed":"pointer",
              color:idx===questions.length-1?ATC.gray400:ATC.white,fontWeight:600,fontSize:13}}>
            Suivante →
          </button>
        </div>

        {/* Navigation rapide */}
        {nav && (
          <div style={{marginTop:18,background:ATC.white,borderRadius:14,padding:16,
            boxShadow:"0 2px 12px rgba(0,0,0,0.08)"}}>
            <div style={{color:ATC.gray800,fontWeight:700,marginBottom:10,fontSize:13}}>
              Navigation rapide
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {questions.map((_,i)=>{
                let bg=ATC.gray100,co=ATC.gray600;
                if(i===idx){bg=ATC.violet;co=ATC.white;}
                else if(rep[i]!==undefined&&rev[i]){
                  bg=rep[i]===questions[i].correct?ATC.greenL:ATC.redL;
                  co=rep[i]===questions[i].correct?"#065F46":"#7F1D1D";
                } else if(rep[i]!==undefined){bg=ATC.violetL;co=ATC.violetD;}
                else if(sig[i]){bg=ATC.redL;co=ATC.red;}
                return(
                  <button key={i} onClick={()=>{setIdx(i);setNav(false);}}
                    style={{width:34,height:34,borderRadius:8,background:bg,color:co,
                      border:"none",cursor:"pointer",fontWeight:700,fontSize:11}}>
                    {i+1}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Écran Résultats ─────────────────────────────────────────────
function Resultats({reponses,questions,tempsUtilise,onRecommencer,modeLabel}){
  const [filtre,setFiltre]=useState("toutes");
  const total=questions.length;
  const repondues=Object.keys(reponses).length;
  const correctes=questions.filter((_,i)=>reponses[i]===questions[i].correct).length;
  const score=Math.round((correctes/total)*100);
  const reussi=score>=61;

  const parD={};
  Object.keys(DOMAINES).filter(d=>DOMAINES[d].pct>0).forEach(d=>{
    const dQ=questions.filter(q=>q.domaine===d);
    const dC=dQ.filter(q=>{const i=questions.indexOf(q);return reponses[i]===q.correct;});
    parD[d]={total:dQ.length,c:dC.length};
  });

  const parA={};
  ["Prédictif","Agile","Hybride"].forEach(a=>{
    const aQ=questions.filter(q=>q.approche===a);
    const aC=aQ.filter(q=>{const i=questions.indexOf(q);return reponses[i]===q.correct;});
    parA[a]={total:aQ.length,c:aC.length};
  });

  const qF=questions.filter((_,i)=>{
    if(filtre==="correctes") return reponses[i]===questions[i].correct;
    if(filtre==="incorrectes") return reponses[i]!==questions[i].correct&&reponses[i]!==undefined;
    if(filtre==="omises") return reponses[i]===undefined;
    return true;
  });

  return(
    <div style={{minHeight:"100vh",background:ATC.gray50,padding:"20px 14px"}}>
      <div style={{maxWidth:880,margin:"0 auto"}}>

        {/* Score */}
        <div style={{background:reussi
          ?`linear-gradient(135deg,${ATC.violet},${ATC.orange})`
          :`linear-gradient(135deg,#7F1D1D,${ATC.red})`,
          borderRadius:20,padding:"32px 24px",textAlign:"center",marginBottom:20,color:ATC.white}}>
          <div style={{fontSize:68,fontWeight:900,lineHeight:1}}>{score}%</div>
          <div style={{fontSize:18,fontWeight:700,marginTop:8}}>
            {reussi?"🎉 FÉLICITATIONS — RÉSULTAT SATISFAISANT":"📚 À AMÉLIORER — POURSUIVEZ L'ENTRAÎNEMENT"}
          </div>
          <div style={{opacity:0.8,marginTop:8,fontSize:13}}>
            {correctes}/{total} correctes · {repondues}/{total} répondues
            · Temps : {fmtT(tempsUtilise)}
          </div>
          <div style={{opacity:0.7,marginTop:6,fontSize:12}}>
            Seuil de réussite PMP® estimé ≈ 61% · Votre score : {score}%
          </div>
          {modeLabel && (
            <div style={{marginTop:8,background:"rgba(255,255,255,0.15)",
              borderRadius:8,padding:"4px 14px",display:"inline-block",fontSize:12}}>
              {modeLabel}
            </div>
          )}
        </div>

        {/* Performance par domaine */}
        <div style={{background:ATC.white,borderRadius:16,padding:20,marginBottom:16,
          boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
          <div style={{fontWeight:700,color:ATC.gray800,marginBottom:16,fontSize:15}}>
            📊 Performance par Domaine ECO PMP® 2026
          </div>
          {Object.entries(DOMAINES).filter(([,d])=>d.pct>0).map(([d,cfg])=>{
            const dd=parD[d]||{total:0,c:0};
            const pct=dd.total?Math.round((dd.c/dd.total)*100):0;
            return(
              <div key={d} style={{marginBottom:14}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                  <span style={{color:ATC.gray800,fontWeight:600,fontSize:13}}>
                    {d} <span style={{color:ATC.gray400,fontWeight:400}}>({cfg.pct}%)</span>
                  </span>
                  <span style={{color:cfg.couleur,fontWeight:700,fontSize:13}}>
                    {dd.c}/{dd.total} · {pct}%
                  </span>
                </div>
                <BarreProgression v={dd.c} max={dd.total} couleur={cfg.couleur} h={8}/>
              </div>
            );
          })}
        </div>

        {/* Performance par approche */}
        <div style={{background:ATC.white,borderRadius:16,padding:20,marginBottom:16,
          boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
          <div style={{fontWeight:700,color:ATC.gray800,marginBottom:14,fontSize:15}}>
            ⚡ Performance par Approche
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
            {["Prédictif","Agile","Hybride"].map(a=>{
              const d=parA[a]||{total:0,c:0};
              const pct=d.total?Math.round((d.c/d.total)*100):0;
              const cfg=APPROCHES[a];
              return(
                <div key={a} style={{background:cfg.fond,border:`1px solid ${cfg.couleur}44`,
                  borderRadius:12,padding:14,textAlign:"center"}}>
                  <div style={{color:cfg.couleur,fontSize:26,fontWeight:900}}>{pct}%</div>
                  <div style={{color:ATC.gray800,fontWeight:600,fontSize:12}}>{a}</div>
                  <div style={{color:ATC.gray400,fontSize:11}}>{d.c}/{d.total}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Revue détaillée */}
        <div style={{background:ATC.white,borderRadius:16,padding:20,marginBottom:20,
          boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
          <div style={{fontWeight:700,color:ATC.gray800,marginBottom:12,fontSize:15}}>
            🔍 Revue détaillée des questions
          </div>
          <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
            {[["toutes","Toutes",ATC.violet],
              ["correctes","Correctes",ATC.green],
              ["incorrectes","Incorrectes",ATC.red],
              ["omises","Non répondues",ATC.orange]].map(([f,lib,c])=>{
              const nb=f==="toutes"?total:f==="correctes"?correctes:
                f==="incorrectes"?repondues-correctes:total-repondues;
              return(
                <button key={f} onClick={()=>setFiltre(f)}
                  style={{background:filtre===f?c:ATC.gray100,
                    color:filtre===f?ATC.white:ATC.gray600,
                    border:"none",borderRadius:8,padding:"6px 12px",
                    cursor:"pointer",fontSize:12,fontWeight:600}}>
                  {lib} ({nb})
                </button>
              );
            })}
          </div>

          <div style={{maxHeight:600,overflowY:"auto"}}>
            {qF.map(q=>{
              const i=questions.indexOf(q);
              const r=reponses[i];
              const ok=r===q.correct, omise=r===undefined;
              return(
                <div key={q.id} style={{borderBottom:`1px solid ${ATC.gray100}`,
                  paddingBottom:16,marginBottom:16}}>
                  <div style={{display:"flex",gap:8,alignItems:"flex-start",
                    marginBottom:8,flexWrap:"wrap"}}>
                    <span style={{background:omise?"#FEF3C7":ok?ATC.greenL:ATC.redL,
                      color:omise?"#92400E":ok?"#065F46":"#7F1D1D",
                      borderRadius:6,padding:"2px 8px",fontWeight:700,fontSize:11}}>
                      {omise?"— Non répondue":ok?"✓ Correcte":"✗ Incorrecte"}
                    </span>
                    <BadgeDomaine domaine={q.domaine}/>
                    <BadgeApproche approche={q.approche}/>
                  </div>
                  <p style={{color:ATC.gray600,fontSize:13,lineHeight:1.6,marginBottom:6}}>
                    <strong>Q{i+1}.</strong> {q.question}
                  </p>
                  {!omise&&r!==q.correct && (
                    <div style={{color:"#7F1D1D",fontSize:12,marginBottom:4}}>
                      ✗ Votre réponse : {q.options[r]}
                    </div>
                  )}
                  <div style={{color:"#065F46",fontSize:12,marginBottom:8}}>
                    ✓ Bonne réponse : {q.options[q.correct]}
                  </div>
                  <div style={{background:"#FFFBEB",border:`1px solid #FCD34D`,
                    borderRadius:8,padding:12,fontSize:12,color:"#451A03",lineHeight:1.65}}>
                    <strong>💡</strong> {q.explication}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{textAlign:"center"}}>
          <button onClick={onRecommencer}
            style={{background:`linear-gradient(135deg,${ATC.violet},${ATC.orange})`,
              color:ATC.white,border:"none",borderRadius:14,
              padding:"15px 48px",fontSize:16,fontWeight:700,cursor:"pointer",
              boxShadow:"0 4px 24px rgba(124,58,237,0.3)"}}>
            🔄 Nouvel Examen
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── App principale ───────────────────────────────────────────────
export default function App(){
  const [phase,setPhase]=useState("accueil");
  const [questions,setQuestions]=useState([]);
  const [resultat,setResultat]=useState(null);
  const [modeLabel,setModeLabel]=useState("");

  const demarrer=n=>{
    setQuestions(construireExamen(n));
    setModeLabel(MODES[n].label);
    setPhase("examen");
  };

  const reviserTheme=id=>{
    const qs=construireTheme(id);
    const t=THEMES.find(x=>x.id===id);
    setQuestions(qs);
    setModeLabel(`${t?.icon} ${t?.label} — Révision`);
    setPhase("examen");
  };

  const terminer=(reponses,qs,tpsRestant)=>{
    const mode=MODES[qs.length];
    const duree=mode?mode.duree:45*60;
    setResultat({reponses,questions:qs,tempsUtilise:duree-tpsRestant});
    setPhase("resultats");
  };

  const recommencer=()=>{
    setPhase("accueil");
    setResultat(null);
    setQuestions([]);
    setModeLabel("");
  };

  if(phase==="examen")
    return <Examen questions={questions} onTerminer={terminer} modeLabel={modeLabel}/>;
  if(phase==="resultats")
    return <Resultats {...resultat} onRecommencer={recommencer} modeLabel={modeLabel}/>;
  return <Accueil onDemarrer={demarrer} onTheme={reviserTheme}/>;
}
