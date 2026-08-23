import { useState, useEffect, useRef } from "react";

// ─── Config ECO PMP® 2026 ─────────────────────────────────────────────────────
const DOMAINES = {
  "Personnes":                { couleur:"#4F46E5", fond:"#EEF2FF", pct:33, label:"Personnes" },
  "Processus":                { couleur:"#059669", fond:"#ECFDF5", pct:41, label:"Processus" },
  "Environnement d'affaires": { couleur:"#DC2626", fond:"#FEF2F2", pct:26, label:"Env. d'affaires" },
};
const APPROCHES = {
  "Prédictif":{ couleur:"#7C3AED", fond:"#F5F3FF" },
  "Agile":    { couleur:"#0891B2", fond:"#ECFEFF" },
  "Hybride":  { couleur:"#B45309", fond:"#FFFBEB" },
};
const MODES = {
  30: { label:"30 Questions", desc:"~45 min — Entraînement rapide", duree:45*60 },
  60: { label:"60 Questions", desc:"~90 min — Mi-parcours",         duree:90*60 },
  120:{ label:"120 Questions",desc:"~160 min — Simulation avancée",  duree:160*60 },
  180:{ label:"180 Questions",desc:"~240 min — Examen complet PMP® 2026", duree:240*60 },
};

// ─── Banque de questions ──────────────────────────────────────────────────────
const TOUTES_QUESTIONS = [
  { id:"EC1-Q1", domaine:"Personnes", approche:"Agile", type:"etude-de-cas",
    etudeDeCas:{ id:"EC1", titre:"Étude de cas : Transformation numérique — BanqueAfrique Digital",
      contexte:"Vous êtes chef de projet certifié PMP® à la tête d'un programme de transformation numérique de 14 mois chez BanqueAfrique Digital, une banque régionale déployant sa plateforme mobile. Le programme suit un modèle Agile/hybride. Votre équipe de 12 personnes comprend des développeurs (dont certains à distance), des analystes métier, des designers UX et un responsable conformité. Le DSI (sponsor principal) est enthousiaste mais peu disponible. Une Directrice des Risques (DRisques) nouvellement nommée soulève des inquiétudes sur le périmètre et la sécurité des données, sans encore faire partie officiellement de la gouvernance. L'équipe travaille en sprints de 2 semaines et la première livraison est prévue dans 6 mois." },
    question:"La DRisques vous signale de façon informelle qu'elle est mal à l'aise avec le rythme du projet et estime que les tests de sécurité devraient intervenir plus tôt. Elle n'a pas encore soulevé le problème officiellement. Quelle est la MEILLEURE ligne de conduite ?",
    options:["A. Informer le DSI des préoccupations de la DRisques et laisser la direction générale résoudre le problème.","B. Organiser une réunion dédiée avec la DRisques pour comprendre ses inquiétudes, évaluer leur pertinence, puis déterminer si une modification formelle de la gouvernance ou du calendrier de tests est nécessaire.","C. Ajouter immédiatement une phase de tests de sécurité avant la première livraison, car la DRisques est une partie prenante de haut rang dont les préoccupations doivent être respectées sans délai.","D. Poursuivre le projet comme prévu, car la DRisques n'a pas encore soulevé de problème formel par les canaux officiels."],
    correct:1, explication:"Le chef de projet doit mobiliser proactivement les parties prenantes dont les préoccupations peuvent impacter le projet. Rencontrer la DRisques pour comprendre et évaluer ses inquiétudes avant d'escalader ou de modifier le périmètre reflète un fort leadership serviteur et une gestion efficace des parties prenantes. Ignorer les signaux informels (D) ou escalader sans dialogue (A) contourne la responsabilité du chef de projet. Modifier immédiatement le calendrier (C) sans analyse pourrait perturber inutilement le plan de livraison." },
  { id:"EC1-Q2", domaine:"Personnes", approche:"Hybride", type:"etude-de-cas",
    etudeDeCas:{ id:"EC1" },
    question:"Après votre discussion, vous découvrez que la DRisques dispose d'une autorité légitime sur les décisions de conformité des données et devrait faire partie du comité de pilotage. Cependant, la charte actuelle du comité ne prévoit pas ce rôle. Que devez-vous faire ?",
    options:["A. Poursuivre le projet sans modification ; l'intégrer maintenant retarderait la prise de décision.","B. Recommander la mise à jour formelle de la charte du comité de pilotage pour inclure la DRisques, et l'informer pleinement du statut du projet avant la prochaine réunion du comité.","C. Accorder à la DRisques le statut d'observatrice uniquement, sans droit de vote, pour limiter sa capacité à bloquer les décisions.","D. Demander au DSI de déléguer toutes les décisions de conformité à un membre existant du comité."],
    correct:1, explication:"Une partie prenante disposant d'une autorité légitime sur un domaine du projet doit être correctement intégrée à la gouvernance. La mise à jour de la charte et le briefing de la DRisques démontrent une gouvernance proactive et garantissent des décisions prises avec les bonnes contributions. Le statut d'observatrice (C) ne répondrait pas à son autorité légitime. La délégation (D) est inappropriée lorsque c'est la titulaire du rôle qui doit directement participer." },
  { id:"EC1-Q3", domaine:"Personnes", approche:"Agile", type:"etude-de-cas",
    etudeDeCas:{ id:"EC1" },
    question:"Lors d'une rétrospective, deux développeurs seniors sont en conflit ouvert sur les pratiques de revue de code. Le développeur à distance estime que son travail est injustement scruté. La tension affecte la vélocité. Quelle est votre PRINCIPALE responsabilité en tant que chef de projet ?",
    options:["A. Désigner un responsable technique chargé de définir un processus standard de revue de code et de l'appliquer uniformément.","B. Faciliter une conversation structurée entre les deux développeurs, reconnaître le biais potentiel, établir des normes de revue équitables et assurer un suivi pour garantir la résolution du conflit.","C. Muter l'un des développeurs dans une autre équipe pour supprimer la friction.","D. Documenter le conflit dans le registre des risques et surveiller sans intervenir dans les décisions techniques."],
    correct:1, explication:"Le chef de projet est responsable de la cohésion de l'équipe et doit traiter activement les conflits interpersonnels, notamment ceux impliquant l'équité et l'inclusion. Faciliter le dialogue et établir des normes équitables adresse à la fois les dimensions techniques et humaines. L'ECO PMP® 2026 met l'accent sur l'intelligence émotionnelle, la diversité & inclusion et le leadership serviteur." },
  { id:"EC2-Q1", domaine:"Processus", approche:"Prédictif", type:"etude-de-cas",
    etudeDeCas:{ id:"EC2", titre:"Étude de cas : Modernisation infrastructures — Port Maritime de l'Ouest",
      contexte:"Une autorité portuaire réalise un programme de modernisation de 45 M€ pour ses systèmes de manutention de marchandises. Échéance stricte de 22 mois liée à une obligation réglementaire. Approche prédictive avec rapports mensuels de valeur acquise. Au mois 8 : BAC = 45 M€, Valeur Acquise (VA) = 14,4 M€, Valeur Planifiée (VP) = 18 M€, Coût Réel (CR) = 16,8 M€. Le chemin critique passe par le module d'automatisation des grues, en retard de 3 semaines. L'équipe achats négocie un ordre de modification avec l'entrepreneur principal pour un périmètre supplémentaire." },
    question:"Sur la base des données de valeur acquise, quels sont l'Indice de Performance Calendaire (IPC-Cal) et l'Indice de Performance des Coûts (IPC-C), et que révèlent-ils sur le statut du projet ?",
    options:["A. IPC-Cal = 0,80 ; IPC-C = 0,86 — Le projet est en retard sur le calendrier et dépasse le budget.","B. IPC-Cal = 1,25 ; IPC-C = 1,17 — Le projet est en avance sur le calendrier et sous le budget.","C. IPC-Cal = 0,80 ; IPC-C = 1,17 — Le projet est en retard sur le calendrier mais sous le budget.","D. IPC-Cal = 0,86 ; IPC-C = 0,80 — Le projet dépasse le budget mais est dans les délais."],
    correct:0, explication:"IPC-Cal = VA/VP = 14,4/18 = 0,80 (inférieur à 1 = retard calendaire). IPC-C = VA/CR = 14,4/16,8 ≈ 0,86 (inférieur à 1 = dépassement de budget). Le projet est à la fois en retard et au-dessus du budget au mois 8. Cette double variance sur un projet à échéance réglementaire signale un défi de management significatif." },
  { id:"EC2-Q2", domaine:"Processus", approche:"Prédictif", type:"etude-de-cas",
    etudeDeCas:{ id:"EC2" },
    question:"Le chef de projet doit recommander une action corrective au comité de pilotage. Le budget restant est fixe. Quelle option équilibre MIEUX la récupération de planning et la discipline budgétaire ?",
    options:["A. Mettre en œuvre une accélération (crashing) sur les activités du chemin critique, en analysant explicitement le compromis coût-calendrier et en présentant les options avec leurs implications financières au comité.","B. Prolonger l'échéance du projet de 3 semaines pour absorber le retard actuel.","C. Exécuter toutes les activités restantes en parallèle (fast-tracking).","D. Réduire le périmètre du projet pour respecter le budget et le calendrier actuels."],
    correct:0, explication:"Le crashing consiste à ajouter des ressources aux activités du chemin critique pour récupérer du planning, avec une analyse explicite du compromis coût-calendrier. Compte tenu de la contrainte budgétaire fixe, cette analyse est indispensable avant de recommander le crashing. Prolonger l'échéance (B) violerait la contrainte réglementaire. Le fast-tracking (C) comporte des risques de qualité et d'intégration sans garantir la récupération." },
  { id:"EC2-Q3", domaine:"Processus", approche:"Prédictif", type:"etude-de-cas",
    etudeDeCas:{ id:"EC2" },
    question:"L'entrepreneur a soumis un ordre de modification de 2,1 M€ pour un périmètre supplémentaire lié à des exigences de cybersécurité identifiées après la signature du contrat. Comment le chef de projet doit-il traiter cette demande ?",
    options:["A. Rejeter l'ordre de modification, car le contrat a été signé avec un périmètre convenu.","B. Accepter immédiatement l'ordre de modification, car la cybersécurité est une exigence obligatoire.","C. Évaluer l'ordre de modification via le processus de Maîtrise Intégrée des Modifications : déterminer si l'exigence était implicite ou nouvelle, quantifier l'impact sur le calendrier et les coûts, obtenir l'approbation du Comité de Contrôle des Modifications avant d'autoriser tout travail.","D. Demander à l'entrepreneur d'absorber le coût dans le cadre de ses obligations contractuelles."],
    correct:2, explication:"Toutes les modifications du projet, quelle que soit leur source ou nécessité apparente, doivent passer par le processus de Maîtrise Intégrée des Modifications. L'acceptation unilatérale (B) ou le rejet (A) contournent la gouvernance. Le Comité de Contrôle détermine si le coût est imputable à l'entrepreneur ou au client." },
  { id:"EC3-Q1", domaine:"Environnement d'affaires", approche:"Hybride", type:"etude-de-cas",
    etudeDeCas:{ id:"EC3", titre:"Étude de cas : Initiative durabilité — GreenRetail Distribution",
      contexte:"Une chaîne mondiale de distribution lance un projet visant à réduire son empreinte carbone de 40 % sur 3 ans, directement lié à ses engagements ESG. Le chef de projet dirige une équipe transversale (chaîne d'approvisionnement, opérations, informatique, consultant durabilité externe), sous pilotage du comité exécutif. À mi-parcours de la première année, un membre du conseil d'administration remet en question la crédibilité scientifique de l'objectif de 40 %, estimant que la ligne de base a été sous-estimée. La branche informatique intègre simultanément un optimiseur logistique IA, censé réduire la consommation de carburant de 15 %." },
    question:"La préoccupation du membre du conseil concernant la ligne de base pourrait affecter la légitimité du projet et les rapports ESG. Que doit faire le chef de projet EN PREMIER ?",
    options:["A. Défendre la méthodologie de référence actuelle auprès du conseil, car le chef de projet l'a validée.","B. Commander un audit indépendant de la méthodologie de mesure de la ligne de base, informer le sponsor et suspendre tout objectif ou rapport basé sur la ligne de base contestée jusqu'à la fin de l'audit.","C. Ajuster l'objectif à la hausse pour absorber toute incertitude sur la ligne de base.","D. Demander au consultant en durabilité de produire un document de position défendant la méthodologie actuelle."],
    correct:1, explication:"Lorsque la légitimité des fondements du projet est remise en cause, le chef de projet doit s'assurer de l'intégrité de la base de mesure avant de continuer. Un audit indépendant protège la crédibilité de l'organisation et l'exactitude de ses rapports ESG. Défendre la méthodologie sans enquête (A, D) exposerait l'organisation à un risque réputationnel significatif." },
  { id:"EC3-Q2", domaine:"Environnement d'affaires", approche:"Hybride", type:"etude-de-cas",
    etudeDeCas:{ id:"EC3" },
    question:"L'optimiseur logistique IA déployé affiche une réduction de carburant de 12 %, inférieure aux 15 % projetés. Le rapport de durabilité est dû dans 4 mois. Comment le chef de projet doit-il gérer cette situation ?",
    options:["A. Déclarer 15 % comme prévu, puisque l'algorithme n'a pas encore eu le temps de s'optimiser.","B. Déclarer la réduction réelle de 12 % en indiquant de façon transparente que l'algorithme est en phase d'optimisation et que l'objectif de 15 % reste l'issue attendue avec 6 mois de données supplémentaires.","C. Exclure les résultats de l'IA du rapport de durabilité jusqu'à l'atteinte des 15 %.","D. Commander des interventions manuelles supplémentaires pour atteindre artificiellement 15 % avant la date du rapport."],
    correct:1, explication:"Les rapports ESG exigent une communication précise et transparente. Déclarer des projections comme des réalisations (A) ou manipuler les résultats (D) constitue une fausse déclaration. Le Code d'Éthique PMI exige l'honnêteté dans les rapports." },
  { id:"EC3-Q3", domaine:"Environnement d'affaires", approche:"Hybride", type:"etude-de-cas",
    etudeDeCas:{ id:"EC3" },
    question:"De nouvelles réglementations européennes imposent des normes de comptabilisation carbone plus strictes nécessitant une refonte du cadre de mesure. Quelle est la MEILLEURE réaction du chef de projet ?",
    options:["A. Poursuivre avec la méthodologie actuelle, car la réglementation s'applique aux projets futurs.","B. Attendre que la réglementation soit pleinement mise en œuvre avant d'apporter des modifications.","C. Évaluer immédiatement l'impact réglementaire sur le périmètre et le cadre de mesure, initier une demande de modification via la Maîtrise Intégrée des Modifications pour mettre à jour le plan de projet, et informer le sponsor des délais de conformité et des besoins en ressources.","D. Demander à l'équipe juridique de trouver une exemption à la nouvelle réglementation pour les projets en cours."],
    correct:2, explication:"Les changements réglementaires affectant un projet actif doivent être traités de façon proactive. Le chef de projet doit évaluer les exigences de conformité, initier un processus formel de modification et tenir la gouvernance informée. Ignorer la réglementation (A, B) crée un risque de non-conformité." },
  { id:"P-001", domaine:"Personnes", approche:"Agile", type:"standard",
    question:"Un chef de projet dirige une équipe Scrum nouvellement constituée. Deux membres ne s'accordent pas sur la Définition de Fini pour un récit utilisateur critique, ralentissant le sprint. Que doit faire le chef de projet EN PREMIER ?",
    options:["A. Définir la Définition de Fini au nom de l'équipe pour résoudre l'impasse.","B. Faciliter une discussion d'équipe afin d'établir collaborativement une Définition de Fini à laquelle les deux membres peuvent s'engager.","C. Escalader le désaccord au Propriétaire de Produit pour qu'il prenne la décision finale.","D. Permettre à chaque membre d'appliquer ses propres critères et de les réconcilier à la fin du sprint."],
    correct:1, explication:"En Agile, l'équipe doit s'approprier collectivement les accords de travail comme la Définition de Fini. Le chef de projet/Scrum Master facilite ce processus plutôt que de le dicter. La définition unilatérale (A) nuit à l'appropriation. L'escalade (C) est prématurée. Les critères individuels (D) créent une qualité incohérente." },
  { id:"P-002", domaine:"Personnes", approche:"Prédictif", type:"standard",
    question:"Un membre clé de l'équipe s'est désengagé : il manque les réunions quotidiennes, rend son travail en retard et communique à peine. Aucun problème personnel connu n'existe. Quelle est la MEILLEURE approche initiale selon le Code d'Éthique PMI et le leadership serviteur ?",
    options:["A. Émettre un avertissement formel documentant les problèmes de performance.","B. Réaffecter les tâches critiques du membre à des collègues plus impliqués.","C. Avoir un entretien individuel privé et empathique pour comprendre ce que vit le membre et explorer le soutien qui pourrait l'aider.","D. Soulever le problème de performance lors de la prochaine réunion d'équipe pour créer une obligation de rendre des comptes."],
    correct:2, explication:"Le leadership serviteur et les principes éthiques PMI préconisent l'empathie, le respect et la compréhension individuelle. Un entretien privé est la première étape : il préserve la dignité, identifie les causes profondes et peut révéler un soutien actionnable." },
  { id:"P-003", domaine:"Personnes", approche:"Hybride", type:"standard",
    question:"Un cadre dirigeant puissant exprime une forte insatisfaction à l'égard de l'approche adaptative et préfère des plans détaillés en amont. L'équipe et le sponsor soutiennent le modèle hybride. Comment le chef de projet doit-il répondre ?",
    options:["A. S'engager immédiatement à produire un plan détaillé en amont pour satisfaire le cadre.","B. Reconnaître la préférence du cadre, expliquer la valeur que l'approche hybride apporte dans le contexte de ce projet, et l'inviter à la prochaine revue de sprint pour qu'il expérimente le modèle par lui-même.","C. Rejeter la préoccupation puisque le sponsor a déjà approuvé le modèle hybride.","D. Escalader au PMO pour faire retirer le cadre de la liste des parties prenantes."],
    correct:1, explication:"La résistance à une méthodologie appelle à l'éducation et à l'engagement, non à l'évitement ou à la capitulation. Inviter le cadre à une revue de sprint transforme le scepticisme en expérience directe. L'ECO PMP® 2026 met l'accent sur l'engagement des parties prenantes." },
  { id:"P-004", domaine:"Personnes", approche:"Agile", type:"standard",
    question:"Les membres les plus bavards d'une équipe Scrum dominent la planification de sprint tandis que les membres plus discrets se désengagent. Leurs idées se sont historiquement révélées précieuses. Quelle technique répond le MIEUX à cette dynamique ?",
    options:["A. Demander aux membres dominants de limiter leurs contributions pour laisser les autres s'exprimer.","B. Utiliser des techniques de facilitation structurées telles que le brainstorming silencieux ou le partage en tour de rôle pour s'assurer que toutes les voix sont entendues.","C. Passer les séances de planification en format asynchrone où les membres contribuent par écrit.","D. Séparer l'équipe en deux groupes selon le style de communication pour les séances de planification."],
    correct:1, explication:"Les techniques de facilitation structurées (brainstorming silencieux, vote par points, tours de rôle) neutralisent les dynamiques de domination. L'ECO PMP® 2026 met l'accent sur l'inclusion et la diversité." },
  { id:"P-005", domaine:"Personnes", approche:"Prédictif", type:"standard",
    question:"Un membre de l'équipe issu d'une culture différente évite le contact visuel lors des réunions. D'autres interprètent cela comme du désengagement. Le chef de projet sait qu'il s'agit d'une norme culturelle. Que doit-il faire ?",
    options:["A. Demander au membre de s'adapter aux normes de communication de la majorité pour améliorer la cohésion.","B. Ne rien dire, car les pratiques culturelles sont des affaires privées.","C. Partager avec l'équipe le contexte culturel sur les styles de communication diversifiés et établir des normes d'équipe respectant les différences individuelles.","D. Documenter le problème dans le plan d'engagement des parties prenantes sous risque de communication."],
    correct:2, explication:"Le chef de projet est responsable de créer un environnement inclusif et d'éduquer l'équipe sur les différences culturelles. L'ECO PMP® 2026 inclut explicitement la diversité, l'équité et l'inclusion comme compétences de leadership. Demander au membre de se conformer (A) est culturellement irrespectueux." },
  { id:"P-006", domaine:"Personnes", approche:"Agile", type:"standard",
    question:"Une équipe Scrum auto-organisée n'atteint pas régulièrement ses engagements de sprint. L'équipe se dit à l'aise avec sa charge mais la vélocité est très variable. Que doit faire le chef de projet/Scrum Master ?",
    options:["A. Allonger les sprints de 2 à 4 semaines pour donner plus de temps à l'équipe.","B. Faciliter une rétrospective axée sur l'identification des causes profondes de la variabilité de la vélocité et co-créer des actions d'amélioration.","C. Désigner un développeur senior pour superviser l'allocation des tâches.","D. Réduire la taille de l'équipe pour concentrer le travail sur les membres les plus performants."],
    correct:1, explication:"La rétrospective est le principal mécanisme Agile d'amélioration continue. Faciliter une analyse des causes profondes responsabilise l'équipe à se corriger elle-même, conformément aux valeurs Agile et au leadership serviteur." },
  { id:"P-007", domaine:"Personnes", approche:"Hybride", type:"standard",
    question:"Votre projet implique une équipe répartie dans 4 pays avec des fuseaux horaires et des normes culturelles différents. La cohésion est faible. Quelle est la stratégie la PLUS efficace ?",
    options:["A. Exiger que tous les membres travaillent pendant une fenêtre commune de 4 heures chaque jour.","B. Élaborer collaborativement une charte d'équipe établissant des normes partagées, des protocoles de communication et reconnaissant les différences culturelles, puis la renforcer par des activités régulières de team building virtuel.","C. Désigner un responsable d'équipe régional dans chaque pays pour gérer les membres locaux.","D. Réduire les interdépendances entre sites en divisant le projet en flux de travail par pays."],
    correct:1, explication:"Une charte d'équipe co-créée établit une identité partagée et des accords de travail — fondement de la cohésion dans les équipes distribuées. Les solutions purement structurelles (C, D) traitent la logistique mais pas l'élément humain." },
  { id:"P-008", domaine:"Personnes", approche:"Prédictif", type:"standard",
    question:"Deux directeurs fonctionnels revendiquent la priorité sur une ressource partagée qui est sur le chemin critique de votre projet. Quelle est la MEILLEURE action pour le chef de projet ?",
    options:["A. Escalader immédiatement au sponsor du projet pour résoudre le conflit.","B. Négocier directement avec les deux directeurs fonctionnels pour trouver un accord de partage du temps, documenter la résolution et mettre à jour le plan de management des ressources.","C. Trouver une ressource alternative au sein de votre équipe.","D. Demander à la ressource de gérer elle-même son temps entre les deux projets."],
    correct:1, explication:"Les chefs de projet doivent négocier activement pour les ressources et faciliter la résolution des conflits. La négociation directe avec les deux directeurs, suivie d'une documentation, est l'approche la plus proactive et professionnelle." },
  { id:"P-009", domaine:"Personnes", approche:"Agile", type:"standard",
    question:"Un membre de l'équipe soulève lors de la mêlée quotidienne une dépendance technique qui pourrait bloquer un récit pendant 3 jours. Le reste de l'équipe veut continuer ses mises à jour. Que doit faire le chef de projet/Scrum Master ?",
    options:["A. Laisser la mêlée se poursuivre et demander au membre de soulever le problème lors de la prochaine rétrospective.","B. Reconnaître la préoccupation, la reporter à une réunion post-mêlée avec les membres concernés, et la noter comme un obstacle nécessitant une résolution rapide.","C. Utiliser le temps de la mêlée pour analyser et résoudre entièrement la dépendance technique en équipe.","D. Affecter le membre bloqué à une autre tâche pendant que l'obstacle est résolu indépendamment."],
    correct:1, explication:"Les mêlées sont des mises à jour limitées dans le temps, non des séances de résolution de problèmes. Le Scrum Master note les obstacles et s'assure qu'ils sont résolus rapidement lors d'une réunion de suivi. Différer à la rétrospective (A) est trop lent pour un problème bloquant." },
  { id:"P-010", domaine:"Personnes", approche:"Prédictif", type:"standard",
    question:"Un membre de l'équipe informe le chef de projet qu'une collègue déclare des heures sur le projet qu'elle n'a pas réellement travaillées. Que doit faire le chef de projet ?",
    options:["A. Confronter la collègue directement lors de la prochaine réunion d'équipe.","B. Ajuster discrètement les heures de la collègue dans le système pour éviter l'impact sur le budget.","C. Enquêter discrètement pour vérifier la préoccupation, documenter les constatations et escalader via le canal approprié (RH, PMO ou sponsor) si confirmé, conformément au Code d'Éthique PMI.","D. Rejeter la préoccupation comme relevant de la politique interne."],
    correct:2, explication:"Le Code d'Éthique PMI exige l'honnêteté, la responsabilité et la transparence des rapports. La fraude aux feuilles de temps est une violation éthique grave. Ajuster discrètement les heures (B) rend le chef de projet complice. La confrontation publique (A) est inappropriée sans vérification." },
  { id:"P-011", domaine:"Personnes", approche:"Agile", type:"standard",
    question:"Un chef de projet observe que lors des rétrospectives, l'équipe ne mentionne que des points positifs et évite d'identifier de vrais points d'amélioration. Aucun changement significatif depuis 4 sprints. Quelle est la CAUSE PROFONDE et la MEILLEURE solution ?",
    options:["A. Cause profonde : la rétrospective est trop courte. Solution : l'allonger à 3 heures.","B. Cause profonde : l'équipe manque de sécurité psychologique. Solution : repenser les rétrospectives avec des méthodes de contribution anonymes, établir des règles de base pour une discussion sans jugement, et modéliser la vulnérabilité en tant que chef de projet.","C. Cause profonde : les rétrospectives sont redondantes pour les équipes très performantes. Solution : les remplacer par des rapports écrits.","D. Cause profonde : l'équipe n'a pas de vrais problèmes. Solution : aucune action nécessaire."],
    correct:1, explication:"Les rétrospectives superficielles sont un signe classique d'une faible sécurité psychologique. Les changements structurels seuls ne traitent pas la cause profonde. Les méthodes de contribution anonymes et la vulnérabilité modélisée créent la sécurité nécessaire à une rétrospection honnête." },
  { id:"P-012", domaine:"Personnes", approche:"Prédictif", type:"standard",
    question:"Lequel des éléments suivants décrit LE MIEUX le rôle d'un chef de projet pratiquant le leadership serviteur ?",
    options:["A. Prendre toutes les décisions clés du projet pour protéger l'équipe d'une responsabilité excessive.","B. Supprimer les obstacles, responsabiliser l'équipe et donner la priorité aux besoins de l'équipe sur sa propre autorité et sa reconnaissance.","C. Assigner et surveiller toutes les tâches pour s'assurer qu'elles sont accomplies dans les délais.","D. Représenter les intérêts de l'équipe auprès de la direction tout en la maintenant concentrée sur la livraison."],
    correct:1, explication:"Le leadership serviteur est centré sur la suppression des obstacles, le soutien à la croissance de l'équipe et la responsabilisation plutôt que le contrôle. L'autorité du leader serviteur vient de la confiance et du service, non de la hiérarchie." },
  { id:"P-013", domaine:"Personnes", approche:"Hybride", type:"standard",
    question:"Vous gérez un projet où un outil d'IA est introduit pour automatiser une partie du flux de travail. Deux membres résistent ouvertement, craignant que leurs rôles deviennent obsolètes. Comment le chef de projet doit-il répondre ?",
    options:["A. Les rassurer que leurs rôles ne changeront pas sans fournir de détails précis.","B. Impliquer les membres de l'équipe dans la définition de l'évolution de leurs rôles avec l'outil d'IA, les associer à la mise en œuvre, et offrir des opportunités de montée en compétences — en les transformant en champions du changement plutôt qu'en résistants.","C. Procéder au déploiement de l'IA et laisser les préoccupations se résoudre d'elles-mêmes.","D. Exclure les membres résistants des tâches liées à l'IA pour éviter les perturbations."],
    correct:1, explication:"L'intégration de l'IA dans le travail de projet est un thème croissant dans l'ECO PMP® 2026. Le chef de projet doit traiter la résistance au changement par la co-création, la montée en compétences et une communication honnête. Des assurances vagues (A) érodent la confiance. L'exclusion (D) approfondit la résistance." },
  { id:"P-014", domaine:"Personnes", approche:"Prédictif", type:"standard",
    question:"Un chef de projet est invité à évaluer la maturité de son équipe. Quel modèle aide LE MIEUX à évaluer et guider les étapes de développement de l'équipe ?",
    options:["A. La Matrice RACI — pour clarifier les responsabilités individuelles.","B. L'Échelle de Tuckman (Formation, Confrontation, Normalisation, Performance, Dissolution) — pour comprendre les étapes de développement de l'équipe.","C. La Hiérarchie des besoins de Maslow — pour identifier les motivations individuelles.","D. La simulation de Monte-Carlo — pour quantifier le risque lié à la performance de l'équipe."],
    correct:1, explication:"Le modèle de Tuckman est le cadre standard pour comprendre les étapes de développement de l'équipe et est directement applicable à la planification des interventions appropriées du chef de projet à chaque étape." },
  { id:"P-015", domaine:"Personnes", approche:"Agile", type:"standard",
    question:"Le sponsor du projet veut ajouter un nouveau membre d'équipe en milieu de sprint sans passer par l'affinage du backlog, arguant que cela accélérera la livraison. Quel conseil le chef de projet doit-il prodiguer ?",
    options:["A. Accepter le nouveau membre immédiatement puisque la demande du sponsor est prioritaire.","B. Expliquer que l'ajout d'un membre en milieu de sprint perturbe la dynamique de l'équipe (coût d'intégration, surcoût de communication) et recommander d'attendre la prochaine planification de sprint pour l'intégrer correctement.","C. Ajouter le membre mais l'exclure de toutes les cérémonies de sprint jusqu'au prochain sprint.","D. Escalader au Scrum Master et le laisser gérer l'interaction avec le sponsor."],
    correct:1, explication:"La loi de Brooks et les principes Agile mettent en garde contre l'ajout de personnes en milieu de sprint sans intégration appropriée. Le chef de projet doit informer le sponsor de façon transparente du vrai coût de cette décision et proposer un meilleur calendrier." },
  { id:"PR-001", domaine:"Processus", approche:"Prédictif", type:"standard",
    question:"Le réseau d'activités d'un projet montre : Tâche A (5 jours), Tâche B dépend de A (3 jours), Tâche C démarre au début du projet (4 jours), Tâche D dépend de B et C (2 jours). Quel est le CHEMIN CRITIQUE et la durée du projet ?",
    options:["A. A→B→D = 10 jours (Chemin critique).","B. C→D = 6 jours.","C. A→B→D = 10 jours ; C→D = 6 jours ; le chemin critique est A→B→D à 10 jours.","D. Toutes les tâches sont critiques ; durée = 14 jours."],
    correct:2, explication:"Chemin 1 : A→B→D = 5+3+2 = 10 jours. Chemin 2 : C→D = 4+2 = 6 jours. Le chemin critique est A→B→D à 10 jours. La tâche C dispose de 4 jours de marge totale (10-6=4). Durée = 10 jours." },
  { id:"PR-002", domaine:"Processus", approche:"Prédictif", type:"standard",
    question:"Un projet a : BAC = 200 000 €, VA = 120 000 €, CR = 150 000 €, VP = 140 000 €. Quel est l'Estimé à l'Achèvement (EAC) en supposant que les travaux futurs seront réalisés au même IPC actuel ?",
    options:["A. EAC = 250 000 €","B. EAC = 230 000 €","C. EAC = 220 000 €","D. EAC = 200 000 €"],
    correct:0, explication:"IPC = VA/CR = 120 000/150 000 = 0,80. EAC = BAC/IPC = 200 000/0,80 = 250 000 €. Le projet coûtera 250 000 € pour être achevé, soit 50 000 € au-dessus du budget." },
  { id:"PR-003", domaine:"Processus", approche:"Hybride", type:"standard",
    question:"Un risque projet a une probabilité de 30 % et entraînerait une perte de 100 000 € s'il se matérialise. Une assurance pour atténuer ce risque coûte 25 000 €. Sur la base de la Valeur Monétaire Espérée (VME), le chef de projet doit-il recommander l'assurance ?",
    options:["A. Oui, car la VME du risque (30 000 €) est supérieure au coût de l'assurance (25 000 €), ce qui la rend économiquement justifiée.","B. Non, car l'assurance coûte toujours plus que la valeur espérée du risque.","C. Oui, car tous les risques de projet doivent être assurés.","D. Non, car la probabilité (30 %) est trop faible pour justifier la dépense."],
    correct:0, explication:"VME = Probabilité × Impact = 0,30 × 100 000 € = 30 000 €. Le coût de l'assurance (25 000 €) est inférieur à la VME (30 000 €), ce qui la justifie financièrement. L'analyse par la VME est un outil d'analyse quantitative des risques." },
  { id:"PR-004", domaine:"Processus", approche:"Agile", type:"standard",
    question:"Lors d'une rétrospective, l'équipe identifie que l'absence d'une Définition de Prêt claire provoque des reprises dans les sprints. Quelle est la MEILLEURE action corrective ?",
    options:["A. Exiger que le propriétaire de produit rédige tous les récits utilisateurs avant la planification de sprint.","B. Définir collaborativement avec l'équipe une Définition de Prêt spécifiant les critères qu'un récit doit satisfaire avant d'être accepté dans un sprint, et l'appliquer dès le prochain sprint.","C. Ajouter une porte d'assurance qualité formelle avant chaque sprint pour réviser la qualité des récits.","D. Allonger la durée du sprint pour donner à l'équipe plus de temps pour clarifier les récits pendant le sprint."],
    correct:1, explication:"La Définition de Prêt est un accord de travail Agile qui empêche les récits incomplets d'entrer dans un sprint. Elle doit être définie collaborativement et inclure des critères tels que les critères d'acceptation, l'estimation et l'identification des dépendances." },
  { id:"PR-005", domaine:"Processus", approche:"Agile", type:"standard",
    question:"La vélocité d'une équipe Agile : Sprint 1 : 32 pts, Sprint 2 : 28 pts, Sprint 3 : 36 pts, Sprint 4 : 30 pts. Le backlog restant comporte 150 points de récit. Combien de sprints faudra-t-il approximativement pour compléter le backlog ?",
    options:["A. 3 sprints","B. 4 sprints","C. 5 sprints","D. 6 sprints"],
    correct:2, explication:"Vélocité moyenne = (32+28+36+30)/4 = 31,5 points par sprint. Sprints restants = 150/31,5 ≈ 4,76, arrondi à 5 sprints. La prévision de livraison à l'aide de la vélocité historique est une technique standard de planification Agile." },
  { id:"PR-006", domaine:"Processus", approche:"Prédictif", type:"standard",
    question:"Quel type de contrat est le PLUS approprié pour un projet de développement logiciel personnalisé complexe aux exigences techniques peu claires ?",
    options:["A. Prix Fixe Forfaitaire (PFF) — offre une certitude de coût à l'acheteur.","B. Coût Plus Honoraires Fixes (CPHF) — rembourse les coûts et prévoit des honoraires fixes, approprié lorsque le périmètre est incertain.","C. Régie (T&M) — adapté aux missions de courte durée ou d'augmentation des effectifs.","D. Prix Fixe avec Intéressement (PFI) — incite le vendeur à maîtriser les coûts."],
    correct:1, explication:"Lorsque les exigences techniques sont floues, un contrat PFF transfère injustement le risque au vendeur, qui intégrera une importante contingence dans son prix. Les contrats CPHF sont appropriés pour la R&D, les périmètres flous ou le développement personnalisé complexe." },
  { id:"PR-007", domaine:"Processus", approche:"Prédictif", type:"standard",
    question:"Un chef de projet effectue une analyse qualitative des risques. Quel est le résultat CORRECT de ce processus ?",
    options:["A. Une distribution de probabilité des résultats de coût total du projet.","B. Une liste priorisée de risques individuels du projet basée sur l'évaluation de la probabilité et de l'impact.","C. Une estimation numérique de la réserve pour aléas requise.","D. Un ensemble de stratégies de réponse aux risques pour tous les risques identifiés."],
    correct:1, explication:"L'analyse qualitative des risques priorise les risques en évaluant leur probabilité et leur impact, produisant une liste classée. Les distributions de probabilité (A) et les estimations de réserves (C) sont des résultats de l'analyse quantitative. Les stratégies de réponse aux risques (D) viennent après l'analyse." },
  { id:"PR-008", domaine:"Processus", approche:"Prédictif", type:"standard",
    question:"Un projet a un Écart de Calendrier (EC) de -45 000 € et un Écart de Coût (ECo) de +30 000 €. Qu'est-ce que cela signifie ?",
    options:["A. Le projet est en avance sur le calendrier et au-dessus du budget.","B. Le projet est en retard sur le calendrier mais en dessous du budget.","C. Le projet est en avance sur le calendrier et en dessous du budget.","D. Le projet est en retard sur le calendrier et au-dessus du budget."],
    correct:1, explication:"EC = VA - VP. EC négatif (-45 000 €) signifie VA < VP : en retard sur le calendrier. ECo = VA - CR. ECo positif (+30 000 €) signifie VA > CR : en dessous du budget. Le projet dépense moins que prévu pour le travail accompli mais accuse un retard dans l'achèvement du travail." },
  { id:"PR-009", domaine:"Processus", approche:"Prédictif", type:"standard",
    question:"Quelle est la différence clé entre l'accélération (crashing) et la compression en parallèle (fast-tracking) pour récupérer du retard de planning ?",
    options:["A. L'accélération ajoute des ressources ; la compression en parallèle réduit le périmètre.","B. L'accélération ajoute des ressources pour raccourcir la durée (à un coût) ; la compression en parallèle superpose des activités initialement prévues en séquence (avec un risque de reprise).","C. La compression en parallèle ne s'applique qu'en Agile ; l'accélération uniquement en cascade.","D. L'accélération est sans risque ; la compression en parallèle provoque toujours des reprises."],
    correct:1, explication:"L'accélération implique d'ajouter des ressources (augmentation des coûts) pour comprimer le planning. La compression en parallèle implique de démarrer des activités en parallèle avant que les prédécesseurs ne soient entièrement terminés (risque de reprise). Les deux sont des techniques de compression du planning avec des compromis coût-risque différents." },
  { id:"PR-010", domaine:"Processus", approche:"Agile", type:"standard",
    question:"Qu'est-ce qu'un 'spike' dans la gestion de projet Agile ?",
    options:["A. Un sprint entièrement dédié aux corrections de bugs.","B. Un effort de recherche ou de prototypage limité dans le temps pour réduire l'incertitude sur une approche technique ou répondre à une question qui bloquerait sinon l'estimation ou la mise en œuvre d'un récit utilisateur.","C. Un récit utilisateur hautement prioritaire qui doit être complété dans le sprint actuel.","D. Une réunion pour résoudre un conflit critique dans le projet."],
    correct:1, explication:"Un spike est une technique Agile pour l'investigation ou le prototypage limité dans le temps afin de réduire l'incertitude technique. Les spikes produisent des connaissances (non des incréments de produit) et sont suivis comme d'autres éléments du backlog." },
  { id:"PR-011", domaine:"Processus", approche:"Prédictif", type:"standard",
    question:"Quelle est la différence entre une hypothèse et une contrainte de projet ?",
    options:["A. Les hypothèses sont des facteurs externes ; les contraintes sont des limitations internes.","B. Les hypothèses sont des facteurs supposés vrais mais non confirmés, qui créent un risque si faux ; les contraintes sont des limites fermes qui restreignent les options du projet (ex. : délai fixe, plafond budgétaire, exigences réglementaires).","C. Les hypothèses sont documentées dans le registre des risques ; les contraintes uniquement dans la charte du projet.","D. Il n'y a pas de différence pratique — les deux représentent des limites du projet."],
    correct:1, explication:"Les hypothèses sont des faits incertains traités comme vrais pour la planification — si elles s'avèrent fausses, un risque se matérialise. Les contraintes sont des limites non négociables qui façonnent le projet dès le départ. Les deux doivent être explicitement documentées et gérées." },
  { id:"PR-012", domaine:"Processus", approche:"Prédictif", type:"standard",
    question:"Lors de la clôture d'un projet, quel est l'objectif PRINCIPAL de la documentation des leçons apprises ?",
    options:["A. Documenter les performances de tous les membres de l'équipe pour les dossiers RH.","B. Créer un actif organisationnel qui améliore les performances des projets futurs en capturant ce qui a bien fonctionné, ce qui n'a pas fonctionné et ce qui devrait être fait différemment.","C. Fournir une protection juridique en cas de litiges futurs sur la performance du projet.","D. Justifier les écarts budgétaires auprès du sponsor du projet."],
    correct:1, explication:"Les leçons apprises sont un résultat clé de la clôture du projet et une entrée clé pour les projets futurs. L'objectif principal est l'apprentissage organisationnel et l'amélioration continue. L'ECO PMP® 2026 met l'accent sur la gestion des connaissances comme responsabilité permanente du chef de projet." },
  { id:"PR-013", domaine:"Processus", approche:"Agile", type:"standard",
    question:"Qu'est-ce que la Définition de Fini (DoD) en Scrum, et à qui appartient-elle ?",
    options:["A. Une liste de contrôle des critères d'acceptation pour les récits individuels, appartenant au propriétaire de produit.","B. Un accord partagé définissant ce que 'fini' signifie pour tout incrément — les normes de qualité qu'il doit respecter avant d'être considéré comme potentiellement livrable — co-créé et appartenant à l'équipe Scrum.","C. Un document contractuel définissant les critères d'achèvement du projet, approuvé par le sponsor.","D. Un protocole de test créé par l'équipe QA pour chaque sprint."],
    correct:1, explication:"La Définition de Fini est une norme de qualité appartenant à l'équipe. Elle est distincte des critères d'acceptation (qui sont spécifiques au récit). La DoD crée une responsabilité qualitative partagée et est un artefact fondamental de Scrum." },
  { id:"PR-014", domaine:"Processus", approche:"Prédictif", type:"standard",
    question:"Quel est l'objectif principal de la Maîtrise Intégrée des Modifications ?",
    options:["A. Documenter toutes les demandes de modification pour les archives du projet.","B. S'assurer que toutes les modifications des livrables, de la documentation et des plans du projet sont revues, approuvées ou rejetées, et intégrées de façon coordonnée tout au long du cycle de vie du projet.","C. Prévenir toutes les modifications du périmètre du projet.","D. Tenir le journal des risques à jour avec les nouvelles modifications."],
    correct:1, explication:"La Maîtrise Intégrée des Modifications garantit que les modifications sont gérées de façon systématique : évaluées pour leur impact sur toutes les dimensions du projet, soumises à l'autorité appropriée pour approbation, et mises en œuvre de façon coordonnée." },
  { id:"PR-015", domaine:"Processus", approche:"Prédictif", type:"standard",
    question:"Que signifie un Indice de Performance pour Achèvement (IPA) de 1,35 ?",
    options:["A. Le projet doit être réalisé avec une efficacité 35 % supérieure à celle prévue sur les travaux restants pour respecter le BAC.","B. Le projet a été réalisé avec une efficacité 35 % supérieure à celle prévue.","C. Le projet a besoin de 35 % de budget supplémentaire pour se terminer comme prévu.","D. 35 % du budget du projet a été dépensé."],
    correct:0, explication:"IPA = (BAC-VA)/(BAC-CR). Un IPA de 1,35 signifie que l'équipe doit être 35 % plus efficace que prévu sur tous les travaux restants pour finir dans le BAC d'origine. Un IPA supérieur à 1,10 est souvent considéré comme irréaliste et indique que l'EAC peut nécessiter une révision." },
  { id:"EA-001", domaine:"Environnement d'affaires", approche:"Prédictif", type:"standard",
    question:"Un chef de projet vient de livrer un projet dans les délais et le budget, répondant à toutes les exigences techniques. Cependant, 6 mois après, le produit n'a atteint que 30 % des bénéfices métier projetés. Quelle est la CAUSE la plus probable ?",
    options:["A. L'équipe projet manquait de compétences techniques.","B. Le projet n'était pas correctement aligné sur les objectifs stratégiques, ou le plan de réalisation des bénéfices était inadéquat — le projet a été géré pour livrer des extrants plutôt que pour atteindre des résultats et des bénéfices.","C. Le planning du projet était trop comprimé.","D. Le projet manquait d'un engagement suffisant des parties prenantes pendant l'exécution."],
    correct:1, explication:"Livrer dans les délais/budget/périmètre est nécessaire mais pas suffisant. Les projets existent pour générer des bénéfices métier — des résultats et de la valeur — pas seulement des extrants. L'ECO PMP® 2026 (pondération à 26 % pour l'environnement d'affaires) reflète ce passage vers la responsabilité des résultats." },
  { id:"EA-002", domaine:"Environnement d'affaires", approche:"Agile", type:"standard",
    question:"Une organisation met en œuvre un outil d'IA pour automatiser une partie des tâches de reporting du chef de projet. Quelle considération est la PLUS importante à traiter ?",
    options:["A. Si l'outil d'IA réduit le rôle du chef de projet.","B. Si les rapports générés par l'IA sont exacts, si le chef de projet les valide avant distribution, et si les parties prenantes comprennent quelles parties du rapport sont générées par l'IA par rapport à celles analysées par le chef de projet.","C. Si l'outil d'IA est l'option la moins chère disponible.","D. Si l'outil d'IA a été construit par un fournisseur approuvé par le PMI."],
    correct:1, explication:"Le chef de projet reste responsable de l'exactitude et de l'intégrité des communications de projet, même lorsque l'IA génère des ébauches. L'ECO PMP® 2026 traite l'intégration de l'IA, en soulignant que l'IA augmente plutôt qu'elle ne remplace le jugement du chef de projet." },
  { id:"EA-003", domaine:"Environnement d'affaires", approche:"Hybride", type:"standard",
    question:"Un projet approche de sa clôture lorsque le sponsor est remplacé par un nouveau dirigeant ayant des priorités stratégiques différentes. Le nouveau sponsor remet en question si le projet doit être achevé. Que doit faire le chef de projet ?",
    options:["A. Poursuivre le projet puisqu'il était déjà autorisé et presque terminé.","B. Arrêter immédiatement tous les travaux jusqu'à ce que le nouveau sponsor prenne une décision.","C. Préparer un bref complet sur le statut du projet incluant l'investissement à ce jour, les travaux restants, les bénéfices attendus et l'analyse de l'alignement stratégique, et organiser une réunion avec le nouveau sponsor pour soutenir une décision éclairée.","D. Escalader au PMO pour faire réintégrer l'ancien sponsor."],
    correct:2, explication:"Lorsque la direction change, le chef de projet doit aider le nouveau sponsor à prendre une décision de continuation éclairée. Cela nécessite des informations transparentes sur les coûts engagés, l'investissement restant, les bénéfices attendus et l'adéquation stratégique." },
  { id:"EA-004", domaine:"Environnement d'affaires", approche:"Prédictif", type:"standard",
    question:"Un chef de projet présente le dossier de justification métier au comité exécutif. Le dossier montre une VAN de 1,2 M€, un TRI de 18 % et un délai de récupération de 2,5 ans. Le taux de rendement minimum de l'organisation est de 12 %. Quelle est la recommandation de décision d'investissement ?",
    options:["A. Rejeter le projet — le délai de récupération est trop long.","B. Accepter le projet — la VAN est positive et le TRI (18 %) dépasse le taux de rendement minimum (12 %), indiquant que le projet crée de la valeur au-dessus du coût du capital.","C. Demander plus d'analyses — un TRI de 18 % est trop élevé pour être crédible.","D. Différer le projet jusqu'à ce que le TRI dépasse 25 %."],
    correct:1, explication:"Une VAN positive signifie que le projet crée de la valeur en euros d'aujourd'hui. Un TRI de 18 % dépassant le taux minimum de 12 % confirme que le retour sur investissement dépasse le rendement requis. Les trois indicateurs soutiennent l'approbation du projet." },
  { id:"EA-005", domaine:"Environnement d'affaires", approche:"Agile", type:"standard",
    question:"Un projet construit un modèle d'apprentissage automatique pour prédire l'attrition des clients. Lors des tests, l'équipe découvre que le modèle performe significativement moins bien pour certains groupes démographiques. Quelle est la responsabilité du chef de projet ?",
    options:["A. Accepter le résultat car les modèles d'apprentissage automatique sont imparfaits par nature.","B. Arrêter le déploiement, escalader la découverte du biais à la direction et à l'équipe data science, évaluer les implications éthiques et légales, et s'assurer que le biais est corrigé avant le déploiement.","C. Limiter le déploiement du modèle aux groupes démographiques où il performe bien.","D. Divulguer la limitation dans la documentation et procéder au déploiement."],
    correct:1, explication:"Le biais IA est une question éthique, légale et de réputation critique. L'ECO PMP® 2026 inclut l'éthique IA et le déploiement responsable comme compétences. Déployer un modèle biaisé peut causer des dommages et violer les lois anti-discrimination." },
  { id:"EA-006", domaine:"Environnement d'affaires", approche:"Prédictif", type:"standard",
    question:"Quand un chef de projet doit-il recommander la résiliation d'un projet ?",
    options:["A. Uniquement lorsque le projet dépasse le budget et le planning.","B. Lorsque le dossier de justification métier n'est plus valide (désalignement stratégique, bénéfices non atteignables, environnement externe modifié), lorsque les risques sont devenus inacceptables, ou lorsque les ressources généreraient plus de valeur dans d'autres initiatives — indépendamment des coûts déjà engagés.","C. Jamais — achever un projet commencé est toujours préférable à le résilier.","D. Uniquement lorsque le sponsor demande la résiliation."],
    correct:1, explication:"La résiliation de projet est une décision légitime et parfois correcte. Le biais des coûts irrécupérables pousse les organisations à continuer des projets en échec. La responsabilité professionnelle du chef de projet est de fournir une analyse objective et de recommander la résiliation lorsque le dossier de justification n'est plus valable." },
  { id:"EA-007", domaine:"Environnement d'affaires", approche:"Prédictif", type:"standard",
    question:"Un chef de projet est sur le point de présenter la performance du projet au conseil d'administration. Le projet est en retard en raison d'un fournisseur sous-performant. Que requiert le Code d'Éthique PMI ?",
    options:["A. Présenter la situation honnêtement, y compris les causes profondes, le statut actuel et le plan d'action corrective, même si cela reflète négativement sur les décisions de management de projet.","B. Présenter une version positive qui maintient la confiance du conseil et traiter les problèmes en privé avec le fournisseur.","C. Ne déclarer que le problème du fournisseur ; éviter de mentionner les lacunes internes.","D. Reporter la présentation jusqu'à ce que le planning soit récupéré."],
    correct:0, explication:"Le Code d'Éthique PMI exige l'honnêteté et la transparence, en particulier lors de rapports aux organes de gouvernance. Présenter des informations complètes et exactes, y compris les causes profondes et les actions correctives, démontre l'intégrité et permet une prise de décision éclairée." },
  { id:"EA-008", domaine:"Environnement d'affaires", approche:"Hybride", type:"standard",
    question:"Quel est l'objectif d'une revue de phase (porte de phase / stage gate) dans la gestion de projet prédictive ?",
    options:["A. Évaluer les compétences techniques de l'équipe avant la phase suivante.","B. Fournir un point de contrôle de gouvernance où la viabilité, l'alignement et la performance continues du projet sont évalués, et une décision formelle est prise pour continuer, réorienter, suspendre ou résilier avant d'engager des ressources pour la phase suivante.","C. Clore formellement la phase actuelle et signer tous les livrables.","D. Calculer la valeur acquise de la phase achevée."],
    correct:1, explication:"Les revues de phase sont des points de décision de gouvernance — pas seulement des cérémonies de clôture. Elles permettent à l'organisation de prendre des décisions go/no-go conscientes basées sur la performance actuelle et l'alignement stratégique continu." },
  { id:"EA-009", domaine:"Environnement d'affaires", approche:"Agile", type:"standard",
    question:"Un cadre de OKR (Objectifs et Résultats Clés) est utilisé pour définir le succès du projet. Le chef de projet est invité à relier les résultats de sprint aux OKR. Quel est l'objectif PRINCIPAL de cette mise en correspondance ?",
    options:["A. Créer une structure de reporting plus complexe pour les sprints.","B. S'assurer que le travail au niveau du sprint contribue directement à des résultats stratégiques mesurables, maintenant un alignement continu entre la livraison quotidienne et les objectifs organisationnels.","C. Remplacer les récits utilisateurs par des éléments de travail au format OKR.","D. Satisfaire les exigences de reporting trimestriel de l'entreprise."],
    correct:1, explication:"Les OKR créent une ligne de visée des objectifs stratégiques aux activités de l'équipe. La mise en correspondance des résultats de sprint avec les OKR garantit que le travail de l'équipe fait réellement progresser les priorités stratégiques, incarnant l'accent de l'ECO PMP® 2026 sur la livraison de valeur et l'alignement stratégique." },
  { id:"EA-010", domaine:"Environnement d'affaires", approche:"Prédictif", type:"standard",
    question:"Lequel des éléments suivants décrit LE MIEUX la relation entre un projet, un programme et un portefeuille ?",
    options:["A. Les projets sont des composantes des programmes ; les programmes sont des composantes des portefeuilles — tous alignés pour délivrer des objectifs stratégiques.","B. Les projets et les programmes sont identiques ; les portefeuilles ne contiennent que des programmes.","C. Les portefeuilles sont de grands projets ; les programmes sont des projets de taille moyenne.","D. Un chef de projet gère toujours un projet au sein d'un programme au sein d'un portefeuille."],
    correct:0, explication:"La hiérarchie PMI : Portefeuilles (stratégique) → Programmes (bénéfices coordonnés) → Projets (extrants spécifiques). Les projets produisent des livrables ; les programmes coordonnent des projets liés pour des bénéfices combinés ; les portefeuilles alignent l'ensemble des initiatives sur les objectifs stratégiques." },
  { id:"EA-011", domaine:"Environnement d'affaires", approche:"Prédictif", type:"standard",
    question:"Un chef de projet élabore un plan de réalisation des bénéfices. Quel élément est ESSENTIEL à ce plan ?",
    options:["A. Un WBS détaillé des livrables du projet.","B. Un calendrier précisant quand chaque bénéfice attendu sera mesurable, qui en est responsable, quels sont les indicateurs de succès, et les actions nécessaires après le projet pour réaliser chaque bénéfice.","C. Une ventilation des coûts du projet par catégorie de bénéfices.","D. Un registre des risques axé sur les risques menaçant les bénéfices."],
    correct:1, explication:"Un plan de réalisation des bénéfices précise quels bénéfices sont attendus, quand ils seront mesurables, qui est responsable de leur réalisation et comment ils seront mesurés. Il s'étend au-delà de la clôture du projet dans les opérations, car de nombreux bénéfices ne se matérialisent qu'après la livraison." },
  { id:"EA-012", domaine:"Environnement d'affaires", approche:"Agile", type:"standard",
    question:"Une startup envisage de lancer un Produit Minimum Viable (MVP). Le chef de projet est invité à justifier cette approche auprès du directeur financier. Quel argument s'aligne le MIEUX avec les principes de livraison de valeur métier ?",
    options:["A. Le MVP permettra d'économiser de l'argent en réduisant le périmètre du produit final.","B. Le MVP permet une validation précoce sur le marché et un retour d'information réel des utilisateurs avant d'engager l'investissement total — réduisant le risque de construire un produit complet qui ne répond pas aux besoins du marché.","C. Les MVPs sont toujours plus rapides à construire que les produits complets.","D. L'approche MVP élimine le besoin d'un dossier de justification métier."],
    correct:1, explication:"L'approche MVP est fondamentalement une gestion des risques et une validation de la valeur. En testant les hypothèses de valeur fondamentales tôt avec de vrais utilisateurs, les organisations évitent le risque plus grand d'un investissement total dans un produit non validé." },
  { id:"EA-013", domaine:"Environnement d'affaires", approche:"Hybride", type:"standard",
    question:"Un projet est en cours lorsqu'une nouvelle réglementation sur la protection des données (similaire au RGPD) est promulguée. Le chef de projet est à mi-chemin d'un projet de plateforme de données. Quelle est sa PREMIÈRE responsabilité ?",
    options:["A. Achever le projet comme prévu et traiter la conformité lors de la phase opérationnelle.","B. Évaluer l'applicabilité de la réglementation au projet, consulter le conseil juridique, et déterminer l'impact sur le périmètre et le calendrier pour atteindre la conformité, puis initier le processus de contrôle des modifications approprié.","C. Demander au sponsor si la conformité est requise puisque le projet est antérieur à la réglementation.","D. Ajouter un risque de conformité légale au registre des risques et l'accepter passivement."],
    correct:1, explication:"La conformité réglementaire est une contrainte obligatoire qui ne peut pas être discrétionnaire ou différée aux opérations. Le chef de projet doit immédiatement évaluer l'applicabilité et l'impact, consulter l'expertise juridique et gérer formellement l'exigence de conformité via le contrôle des modifications." },
  { id:"EA-014", domaine:"Environnement d'affaires", approche:"Prédictif", type:"standard",
    question:"Une organisation initie fréquemment des projets sans dossier de justification métier formel, ce qui conduit à des annulations après des investissements significatifs. Quelle en est la cause profonde et que doit recommander le chef de projet ?",
    options:["A. Les chefs de projet ont besoin de meilleures compétences en planification.","B. L'organisation manque d'un processus structuré de management de portefeuille et d'initiation de projet. Le chef de projet devrait recommander l'établissement d'un processus d'intake de projet exigeant un dossier de justification métier, une analyse des bénéfices et une évaluation de l'alignement stratégique avant toute autorisation.","C. Les projets sont attribués aux mauvais chefs de projet.","D. L'organisation devrait recruter des chefs de projet plus expérimentés."],
    correct:1, explication:"L'annulation répétée de projets après des investissements significatifs est un problème de maturité du management de portefeuille. Sans dossiers de justification et filtrage stratégique, les organisations investissent dans des projets qui n'auraient pas dû démarrer. Un processus d'intake structuré protège les ressources organisationnelles." },
  { id:"EA-015", domaine:"Environnement d'affaires", approche:"Agile", type:"standard",
    question:"Dans le contexte de la pensée en chaîne de valeur, quelle métrique est la PLUS indicative de la valeur réellement livrée aux utilisateurs finaux par une équipe projet ?",
    options:["A. Points de récit complétés par sprint.","B. Nombre de fonctionnalités déployées en production.","C. Métriques de résultats mesurant le changement de comportement des utilisateurs ou les résultats métier attribuables aux fonctionnalités livrées (ex. : amélioration du taux de conversion, changement de fidélisation client, réduction des coûts atteinte).","D. Pourcentage de couverture des tests."],
    correct:2, explication:"Les métriques d'extrants (points de récit, fonctionnalités déployées) mesurent l'activité, pas la valeur. Les métriques de résultats mesurent le changement réel du comportement des utilisateurs ou de la performance métier. L'ECO PMP® 2026 met l'accent sur les résultats, les bénéfices et la valeur — pas seulement les extrants." },
];

// ─── Utilitaires ──────────────────────────────────────────────────────────────
function melanger(arr) {
  const a=[...arr];
  for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}
  return a;
}
function construireExamen(n) {
  const P=TOUTES_QUESTIONS.filter(q=>q.domaine==="Personnes");
  const PR=TOUTES_QUESTIONS.filter(q=>q.domaine==="Processus");
  const EA=TOUTES_QUESTIONS.filter(q=>q.domaine==="Environnement d'affaires");
  const cP=Math.round(n*0.33), cPR=Math.round(n*0.41), cEA=n-cP-cPR;
  const pick=(pool,nb)=>melanger(pool).slice(0,Math.min(nb,pool.length));
  return melanger([...pick(P,cP),...pick(PR,cPR),...pick(EA,cEA)]).slice(0,n);
}
function fmtT(s){const h=Math.floor(s/3600),m=Math.floor((s%3600)/60),sec=s%60;
  if(h>0)return`${h}h${String(m).padStart(2,'0')}m${String(sec).padStart(2,'0')}s`;
  return`${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;}

// ─── Composants ───────────────────────────────────────────────────────────────
function BD({domaine}){const c=DOMAINES[domaine]||{couleur:"#555",fond:"#eee",label:domaine};
  return <span style={{background:c.fond,color:c.couleur,border:`1px solid ${c.couleur}`,borderRadius:20,padding:"2px 10px",fontSize:12,fontWeight:700,whiteSpace:"nowrap"}}>{c.label}</span>;}
function BA({approche}){const c=APPROCHES[approche]||{couleur:"#555",fond:"#eee"};
  return <span style={{background:c.fond,color:c.couleur,border:`1px solid ${c.couleur}`,borderRadius:20,padding:"2px 9px",fontSize:11,fontWeight:600,whiteSpace:"nowrap"}}>{approche}</span>;}
function Bar({v,max,c="#4F46E5",h=6}){return(
  <div style={{background:"#E5E7EB",borderRadius:99,height:h,overflow:"hidden"}}>
    <div style={{background:c,width:`${Math.min(100,(v/max)*100)}%`,height:"100%",transition:"width 0.3s",borderRadius:99}}/>
  </div>);}

// ─── Écran d'accueil ──────────────────────────────────────────────────────────
function Accueil({onDemarrer}){
  const [sel,setSel]=useState(null);
  return(
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0F172A 0%,#1E293B 50%,#0F172A 100%)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,fontFamily:"'Segoe UI',system-ui,sans-serif"}}>
      <div style={{textAlign:"center",marginBottom:32}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:10,background:"rgba(79,70,229,0.15)",border:"1px solid rgba(79,70,229,0.4)",borderRadius:99,padding:"8px 20px",marginBottom:18}}>
          <span style={{color:"#818CF8",fontSize:13,fontWeight:700,letterSpacing:1.5}}>AFRICA TALENT CONSULTING</span>
        </div>
        <h1 style={{color:"#F8FAFC",fontSize:"clamp(26px,5vw,44px)",fontWeight:900,margin:"0 0 8px",letterSpacing:-1}}>Simulateur PMP® 2026</h1>
        <p style={{color:"#94A3B8",fontSize:15,margin:0}}>ECO officiel PMI • Juillet 2026 • 100% en Français</p>
      </div>
      <div style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:16,padding:20,maxWidth:640,width:"100%",marginBottom:24}}>
        <div style={{color:"#CBD5E1",fontSize:12,fontWeight:700,letterSpacing:1,marginBottom:12}}>STRUCTURE OFFICIELLE ECO PMP® 2026 — SOURCE PMI.ORG</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:12}}>
          {Object.entries(DOMAINES).map(([d,c])=>(
            <div key={d} style={{background:"rgba(255,255,255,0.04)",border:`1px solid ${c.couleur}44`,borderRadius:12,padding:14,textAlign:"center"}}>
              <div style={{color:c.couleur,fontSize:28,fontWeight:900}}>{c.pct}%</div>
              <div style={{color:"#94A3B8",fontSize:11,marginTop:4}}>{d}</div>
            </div>))}
        </div>
        <div style={{display:"flex",flexWrap:"wrap",gap:14,color:"#94A3B8",fontSize:12}}>
          <span>📋 180 questions (170 notées + 10 pilotes)</span>
          <span>⏱ 240 minutes</span>
          <span>🤖 IA & Durabilité intégrés</span>
          <span>60% Agile/Hybride · 40% Prédictif</span>
        </div>
      </div>
      <div style={{maxWidth:640,width:"100%",marginBottom:24}}>
        <div style={{color:"#64748B",fontSize:12,fontWeight:700,letterSpacing:1,marginBottom:12,textAlign:"center"}}>CHOISISSEZ VOTRE MODE D'EXAMEN</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10}}>
          {Object.entries(MODES).map(([n,m])=>(
            <button key={n} onClick={()=>setSel(Number(n))}
              style={{background:sel===Number(n)?"rgba(79,70,229,0.25)":"rgba(255,255,255,0.04)",border:sel===Number(n)?"2px solid #6366F1":"1px solid rgba(255,255,255,0.1)",borderRadius:14,padding:"18px 18px",cursor:"pointer",textAlign:"left",transition:"all 0.2s"}}>
              <div style={{color:"#F1F5F9",fontSize:16,fontWeight:700}}>{m.label}</div>
              <div style={{color:"#64748B",fontSize:12,marginTop:4}}>{m.desc}</div>
            </button>))}
        </div>
      </div>
      <button onClick={()=>sel&&onDemarrer(sel)} disabled={!sel}
        style={{background:sel?"linear-gradient(135deg,#4F46E5,#7C3AED)":"rgba(255,255,255,0.05)",color:sel?"#fff":"#374151",border:"none",borderRadius:14,padding:"16px 48px",fontSize:17,fontWeight:700,cursor:sel?"pointer":"not-allowed",transition:"all 0.2s"}}>
        {sel?`🚀 Démarrer — ${MODES[sel].label}`:"Sélectionnez un mode"}
      </button>
    </div>);
}

// ─── Écran d'examen ───────────────────────────────────────────────────────────
function Examen({questions,onTerminer}){
  const [idx,setIdx]=useState(0);
  const [rep,setRep]=useState({});
  const [rev,setRev]=useState({});
  const [tps,setTps]=useState(MODES[questions.length]?.duree||240*60);
  const [sig,setSig]=useState({});
  const [nav,setNav]=useState(false);
  const timerRef=useRef(null);
  useEffect(()=>{timerRef.current=setInterval(()=>setTps(t=>{if(t<=1){clearInterval(timerRef.current);return 0;}return t-1;}),1000);return()=>clearInterval(timerRef.current);},[]);
  const q=questions[idx];
  const repondu=rep[idx]!==undefined, revele=rev[idx];
  const nbRep=Object.keys(rep).length;
  const alerte=tps<600, critique=tps<120;
  const idCas=q.etudeDeCas?.id;
  const ctx=idCas?(q.etudeDeCas?.contexte||questions.find(x=>x.etudeDeCas?.id===idCas&&x.etudeDeCas?.contexte)?.etudeDeCas?.contexte):null;
  const qCas=idCas?questions.filter(x=>x.etudeDeCas?.id===idCas):[];
  const repondre=i=>{if(!revele)setRep(r=>({...r,[idx]:i}));};
  const terminer=()=>{clearInterval(timerRef.current);onTerminer(rep,questions,tps);};
  return(
    <div style={{minHeight:"100vh",background:"#F8FAFC",fontFamily:"'Segoe UI',system-ui,sans-serif"}}>
      <div style={{background:"#0F172A",padding:"12px 18px",display:"flex",alignItems:"center",gap:14,position:"sticky",top:0,zIndex:100}}>
        <div style={{flex:1}}>
          <Bar v={idx+1} max={questions.length} c="#6366F1" h={4}/>
          <div style={{color:"#94A3B8",fontSize:11,marginTop:4}}>Question {idx+1}/{questions.length} · {nbRep} répondues · {Object.keys(sig).length} signalées</div>
        </div>
        <div style={{color:critique?"#EF4444":alerte?"#F59E0B":"#10B981",fontWeight:800,fontSize:18,minWidth:100,textAlign:"right"}}>⏱ {fmtT(tps)}</div>
        <button onClick={()=>setNav(!nav)} style={{background:"rgba(255,255,255,0.1)",border:"none",color:"#fff",borderRadius:8,padding:"6px 12px",cursor:"pointer",fontSize:13}}>📋 Nav</button>
      </div>
      <div style={{maxWidth:880,margin:"0 auto",padding:"22px 14px"}}>
        {q.type==="etude-de-cas"&&ctx&&(
          <div style={{background:"#EFF6FF",border:"1px solid #BFDBFE",borderLeft:"4px solid #3B82F6",borderRadius:12,padding:18,marginBottom:18}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10,flexWrap:"wrap"}}>
              <span style={{background:"#3B82F6",color:"#fff",borderRadius:6,padding:"3px 10px",fontSize:12,fontWeight:700}}>ÉTUDE DE CAS</span>
              <span style={{color:"#1D4ED8",fontWeight:600,fontSize:13}}>{q.etudeDeCas?.titre||"Scénario"}</span>
            </div>
            <div style={{color:"#1E3A5F",fontSize:14,lineHeight:1.7}}>{ctx}</div>
            {qCas.length>1&&<div style={{marginTop:10,display:"flex",gap:8,flexWrap:"wrap"}}>{qCas.map((cq,i)=>{const qi=questions.indexOf(cq);return(<button key={cq.id} onClick={()=>setIdx(qi)} style={{background:qi===idx?"#3B82F6":"#DBEAFE",color:qi===idx?"#fff":"#1E40AF",border:"none",borderRadius:6,padding:"4px 12px",cursor:"pointer",fontSize:12}}>Q{i+1}</button>);})}</div>}
          </div>)}
        <div style={{background:"#fff",borderRadius:16,boxShadow:"0 2px 16px rgba(0,0,0,0.08)",padding:26,marginBottom:18}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14,flexWrap:"wrap"}}>
            <span style={{background:"#F1F5F9",color:"#475569",borderRadius:8,padding:"4px 12px",fontSize:13,fontWeight:700}}>#{idx+1}</span>
            <BD domaine={q.domaine}/><BA approche={q.approche}/>
            {q.type==="etude-de-cas"&&<span style={{background:"#FEF3C7",color:"#92400E",borderRadius:6,padding:"2px 8px",fontSize:11,fontWeight:700}}>Étude de Cas</span>}
            <button onClick={()=>setSig(s=>({...s,[idx]:!s[idx]}))} style={{marginLeft:"auto",background:sig[idx]?"#FEF2F2":"#F8FAFC",border:`1px solid ${sig[idx]?"#EF4444":"#E5E7EB"}`,borderRadius:8,padding:"4px 10px",cursor:"pointer",fontSize:12,color:sig[idx]?"#DC2626":"#94A3B8"}}>{sig[idx]?"🚩 Signalée":"⛳ Signaler"}</button>
          </div>
          <p style={{color:"#1E293B",fontSize:16,lineHeight:1.75,fontWeight:500,marginBottom:22}}>{q.question}</p>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {q.options.map((opt,i)=>{
              const sel=rep[idx]===i,cor=i===q.correct;
              let bg="#F8FAFC",bo="1px solid #E5E7EB",co="#374151";
              if(revele){if(cor){bg="#ECFDF5";bo="2px solid #10B981";co="#065F46";}else if(sel){bg="#FEF2F2";bo="2px solid #EF4444";co="#7F1D1D";}}
              else if(sel){bg="#EEF2FF";bo="2px solid #6366F1";co="#1E1B4B";}
              return(<button key={i} onClick={()=>repondre(i)} disabled={revele}
                style={{background:bg,border:bo,borderRadius:12,padding:"14px 16px",cursor:revele?"default":"pointer",textAlign:"left",color:co,fontSize:14,lineHeight:1.5,transition:"all 0.15s",fontWeight:sel||(revele&&cor)?600:400}}>
                <span style={{display:"inline-flex",alignItems:"center",gap:10}}>
                  <span style={{minWidth:24,height:24,borderRadius:"50%",background:revele&&cor?"#10B981":revele&&sel?"#EF4444":"#E5E7EB",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:12,color:revele&&(cor||sel)?"#fff":"#6B7280",flexShrink:0,fontWeight:700}}>
                    {revele&&cor?"✓":revele&&sel&&!cor?"✗":String.fromCharCode(65+i)}
                  </span>
                  {opt.replace(/^[A-D]\.\s*/,"")}
                </span>
              </button>);})}
          </div>
          {repondu&&!revele&&<button onClick={()=>setRev(r=>({...r,[idx]:true}))} style={{marginTop:14,background:"#4F46E5",color:"#fff",border:"none",borderRadius:10,padding:"10px 22px",cursor:"pointer",fontSize:14,fontWeight:600}}>📖 Voir l'explication</button>}
          {revele&&<div style={{marginTop:18,background:"#FFFBEB",border:"1px solid #FCD34D",borderLeft:"4px solid #F59E0B",borderRadius:12,padding:16}}>
            <div style={{color:"#78350F",fontWeight:700,fontSize:13,marginBottom:8}}>💡 EXPLICATION</div>
            <p style={{color:"#451A03",fontSize:14,lineHeight:1.7,margin:0}}>{q.explication}</p>
          </div>}
        </div>
        <div style={{display:"flex",gap:10,justifyContent:"space-between",flexWrap:"wrap"}}>
          <button onClick={()=>setIdx(i=>Math.max(0,i-1))} disabled={idx===0}
            style={{background:idx===0?"#F1F5F9":"#fff",border:"1px solid #E5E7EB",borderRadius:10,padding:"10px 18px",cursor:idx===0?"not-allowed":"pointer",color:idx===0?"#CBD5E1":"#374151",fontWeight:600,fontSize:14}}>← Précédente</button>
          {nbRep>=Math.floor(questions.length*0.4)&&<button onClick={terminer} style={{background:"#10B981",color:"#fff",border:"none",borderRadius:10,padding:"10px 20px",cursor:"pointer",fontWeight:700,fontSize:14}}>🏁 Terminer l'examen</button>}
          <button onClick={()=>setIdx(i=>Math.min(questions.length-1,i+1))} disabled={idx===questions.length-1}
            style={{background:idx===questions.length-1?"#F1F5F9":"#4F46E5",border:"none",borderRadius:10,padding:"10px 18px",cursor:idx===questions.length-1?"not-allowed":"pointer",color:idx===questions.length-1?"#CBD5E1":"#fff",fontWeight:600,fontSize:14}}>Suivante →</button>
        </div>
        {nav&&<div style={{marginTop:22,background:"#fff",borderRadius:14,padding:18,boxShadow:"0 2px 12px rgba(0,0,0,0.08)"}}>
          <div style={{color:"#374151",fontWeight:700,marginBottom:12,fontSize:14}}>Navigation rapide</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
            {questions.map((_,i)=>{
              let bg="#F1F5F9",co="#64748B";
              if(i===idx){bg="#4F46E5";co="#fff";}
              else if(rep[i]!==undefined&&rev[i]){bg=rep[i]===questions[i].correct?"#ECFDF5":"#FEF2F2";co=rep[i]===questions[i].correct?"#065F46":"#7F1D1D";}
              else if(rep[i]!==undefined){bg="#EEF2FF";co="#4338CA";}
              else if(sig[i]){bg="#FEF2F2";co="#DC2626";}
              return(<button key={i} onClick={()=>{setIdx(i);setNav(false);}} style={{width:34,height:34,borderRadius:8,background:bg,color:co,border:"none",cursor:"pointer",fontWeight:700,fontSize:12}}>{i+1}</button>);
            })}
          </div>
          <div style={{display:"flex",gap:14,marginTop:10,fontSize:11,color:"#64748B",flexWrap:"wrap"}}>
            <span>🟦 En cours</span><span style={{color:"#4338CA"}}>🟪 Répondue</span>
            <span style={{color:"#065F46"}}>🟩 Correcte</span><span style={{color:"#7F1D1D"}}>🟥 Incorrecte</span>
            <span style={{color:"#DC2626"}}>🔴 Signalée</span>
          </div>
        </div>}
      </div>
    </div>);}

// ─── Écran de résultats ───────────────────────────────────────────────────────
function Resultats({reponses,questions,tempsUtilise,onRecommencer}){
  const [filtre,setFiltre]=useState("toutes");
  const total=questions.length;
  const repondues=Object.keys(reponses).length;
  const correctes=questions.filter((q,i)=>reponses[i]===q.correct).length;
  const score=Math.round((correctes/total)*100);
  const reussi=score>=61;
  const parD={};
  Object.keys(DOMAINES).forEach(d=>{const dQ=questions.filter(q=>q.domaine===d);const dC=dQ.filter(q=>{const i=questions.indexOf(q);return reponses[i]===q.correct;});parD[d]={total:dQ.length,c:dC.length};});
  const parA={};
  ["Prédictif","Agile","Hybride"].forEach(a=>{const aQ=questions.filter(q=>q.approche===a);const aC=aQ.filter(q=>{const i=questions.indexOf(q);return reponses[i]===q.correct;});parA[a]={total:aQ.length,c:aC.length};});
  const qF=questions.filter((q,i)=>{
    if(filtre==="correctes")return reponses[i]===q.correct;
    if(filtre==="incorrectes")return reponses[i]!==q.correct&&reponses[i]!==undefined;
    if(filtre==="omises")return reponses[i]===undefined;
    return true;});
  return(
    <div style={{minHeight:"100vh",background:"#F8FAFC",fontFamily:"'Segoe UI',system-ui,sans-serif",padding:"22px 14px"}}>
      <div style={{maxWidth:880,margin:"0 auto"}}>
        <div style={{background:reussi?"linear-gradient(135deg,#065F46,#059669)":"linear-gradient(135deg,#7F1D1D,#B91C1C)",borderRadius:20,padding:36,textAlign:"center",marginBottom:24,color:"#fff"}}>
          <div style={{fontSize:70,fontWeight:900,lineHeight:1}}>{score}%</div>
          <div style={{fontSize:20,fontWeight:700,marginTop:8}}>{reussi?"🎉 FÉLICITATIONS — RÉSULTAT SATISFAISANT":"📚 À AMÉLIORER — POURSUIVEZ L'ENTRAÎNEMENT"}</div>
          <div style={{opacity:0.8,marginTop:10,fontSize:14}}>{correctes}/{total} correctes · {repondues}/{total} répondues · Temps utilisé : {fmtT(tempsUtilise)}</div>
          <div style={{marginTop:12,opacity:0.7,fontSize:13}}>Seuil de réussite estimé PMP® ≈ 61% · Votre score : {score}%</div>
        </div>
        <div style={{background:"#fff",borderRadius:16,padding:22,marginBottom:18,boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
          <div style={{fontWeight:700,color:"#1E293B",marginBottom:18,fontSize:16}}>📊 Performance par Domaine ECO PMP® 2026</div>
          {Object.entries(DOMAINES).map(([d,cfg])=>{const dd=parD[d]||{total:0,c:0};const pct=dd.total?Math.round((dd.c/dd.total)*100):0;return(
            <div key={d} style={{marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                <span style={{color:"#374151",fontWeight:600,fontSize:14}}>{d} <span style={{color:"#94A3B8",fontWeight:400}}>({cfg.pct}% de l'examen)</span></span>
                <span style={{color:cfg.couleur,fontWeight:700}}>{dd.c}/{dd.total} · {pct}%</span>
              </div>
              <Bar v={dd.c} max={dd.total} c={cfg.couleur} h={8}/>
            </div>);})}
        </div>
        <div style={{background:"#fff",borderRadius:16,padding:22,marginBottom:18,boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
          <div style={{fontWeight:700,color:"#1E293B",marginBottom:18,fontSize:16}}>⚡ Performance par Approche</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
            {["Prédictif","Agile","Hybride"].map(a=>{const d=parA[a]||{total:0,c:0};const pct=d.total?Math.round((d.c/d.total)*100):0;const cfg=APPROCHES[a];return(
              <div key={a} style={{background:cfg.fond,border:`1px solid ${cfg.couleur}44`,borderRadius:12,padding:16,textAlign:"center"}}>
                <div style={{color:cfg.couleur,fontSize:28,fontWeight:900}}>{pct}%</div>
                <div style={{color:"#374151",fontWeight:600,fontSize:13}}>{a}</div>
                <div style={{color:"#94A3B8",fontSize:12}}>{d.c}/{d.total}</div>
              </div>);})}
          </div>
        </div>
        <div style={{background:"#fff",borderRadius:16,padding:22,marginBottom:22,boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
          <div style={{fontWeight:700,color:"#1E293B",marginBottom:14,fontSize:16}}>🔍 Revue détaillée des questions</div>
          <div style={{display:"flex",gap:8,marginBottom:18,flexWrap:"wrap"}}>
            {[["toutes","Toutes","#4F46E5"],["correctes","Correctes","#10B981"],["incorrectes","Incorrectes","#EF4444"],["omises","Non répondues","#F59E0B"]].map(([f,lib,c])=>{
              const nb=f==="toutes"?total:f==="correctes"?correctes:f==="incorrectes"?repondues-correctes:total-repondues;
              return(<button key={f} onClick={()=>setFiltre(f)} style={{background:filtre===f?c:"#F1F5F9",color:filtre===f?"#fff":"#64748B",border:"none",borderRadius:8,padding:"6px 14px",cursor:"pointer",fontSize:13,fontWeight:600}}>{lib} ({nb})</button>);})}
          </div>
          <div style={{maxHeight:620,overflowY:"auto"}}>
            {qF.map((q)=>{const i=questions.indexOf(q);const r=reponses[i];const ok=r===q.correct;const omise=r===undefined;return(
              <div key={q.id} style={{borderBottom:"1px solid #F1F5F9",paddingBottom:18,marginBottom:18}}>
                <div style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:8,flexWrap:"wrap"}}>
                  <span style={{background:omise?"#FEF3C7":ok?"#ECFDF5":"#FEF2F2",color:omise?"#92400E":ok?"#065F46":"#7F1D1D",borderRadius:6,padding:"2px 8px",fontWeight:700,fontSize:12,flexShrink:0}}>{omise?"— Non répondue":ok?"✓ Correcte":"✗ Incorrecte"}</span>
                  <BD domaine={q.domaine}/><BA approche={q.approche}/>
                </div>
                <p style={{color:"#374151",fontSize:14,lineHeight:1.65,marginBottom:8}}><strong>Q{i+1}.</strong> {q.question}</p>
                {!omise&&r!==q.correct&&<div style={{color:"#7F1D1D",fontSize:13,marginBottom:6}}>✗ Votre réponse : {q.options[r]}</div>}
                <div style={{color:"#065F46",fontSize:13,marginBottom:8}}>✓ Bonne réponse : {q.options[q.correct]}</div>
                <div style={{background:"#FFFBEB",border:"1px solid #FCD34D",borderRadius:8,padding:12,fontSize:13,color:"#451A03",lineHeight:1.65}}><strong>💡 Explication :</strong> {q.explication}</div>
              </div>);})}
          </div>
        </div>
        <div style={{textAlign:"center"}}>
          <button onClick={onRecommencer} style={{background:"linear-gradient(135deg,#4F46E5,#7C3AED)",color:"#fff",border:"none",borderRadius:14,padding:"16px 48px",fontSize:17,fontWeight:700,cursor:"pointer"}}>🔄 Nouvel Examen</button>
        </div>
      </div>
    </div>);}

// ─── Application principale ───────────────────────────────────────────────────
export default function App(){
  const [phase,setPhase]=useState("accueil");
  const [questions,setQuestions]=useState([]);
  const [res,setRes]=useState(null);
  const demarrer=n=>{setQuestions(construireExamen(n));setPhase("examen");};
  const terminer=(reponses,questions,tpsRestant)=>{
    const duree=MODES[questions.length]?.duree||240*60;
    setRes({reponses,questions,tempsUtilise:duree-tpsRestant});
    setPhase("resultats");};
  const recommencer=()=>{setPhase("accueil");setRes(null);setQuestions([]);};
  if(phase==="accueil") return <Accueil onDemarrer={demarrer}/>;
  if(phase==="examen")  return <Examen questions={questions} onTerminer={terminer}/>;
  if(phase==="resultats") return <Resultats {...res} onRecommencer={recommencer}/>;
  return null;
}
