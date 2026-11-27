// i18n.js — traduction FR / EN de tout le site.
//
// Comment ça marche :
//  - Le site reste écrit en anglais dans le HTML et le JS.
//  - Quand la langue est "fr", ce script remplace chaque texte anglais connu par sa traduction
//    (textes, placeholders, title, aria-label, alt, titre de l'onglet, alert/confirm/prompt).
//  - Il surveille la page (MutationObserver) : tout ce que les scripts ajoutent plus tard
//    (profils, messages, jeux) est traduit aussi.
//  - Le contenu écrit par les gens (noms, descriptions, commentaires) n'est jamais traduit :
//    seuls les textes présents dans le dictionnaire ci-dessous sont remplacés, à l'identique.
//  - Un bouton 🇫🇷 / 🇬🇧 en bas à gauche change la langue ; le choix est gardé dans le navigateur.
//
// AJOUTER UN TEXTE : si tu ajoutes du texte anglais au site, ajoute sa traduction dans FR
// (clé = le texte anglais exact, espaces multiples réduits à un seul).
// En français, ouvre la console et tape  GradeetingI18n.missing()  pour voir ce qui manque.
//
// Charger ce script dans le <head> (avant le contenu) pour éviter un flash d'anglais.
(function () {
  const STORAGE_KEY = "gradeeting_lang";

  const FR = {
    // ---------- Commun ----------
    "GRADEETING — Aivancity student project": "GRADEETING — Projet étudiant Aivancity",
    "← Back to Gradeeting": "← Retour à Gradeeting",
    "Loading...": "Chargement...",
    "Close": "Fermer",
    "Submit": "Envoyer",
    "Something went wrong. Please try again.": "Une erreur est survenue. Réessaie.",
    "Teacher": "Prof",
    "Positive": "Positif",
    "Negative": "Négatif",
    "positive comment": "commentaire positif",
    "negative comment": "commentaire négatif",
    "Dark": "Sombre",
    "Light": "Clair",
    "Off": "Coupée",
    "On": "Activée",

    // ---------- Titres d'onglet ----------
    "Page not found — GRADEETING": "Page introuvable — GRADEETING",
    "Volunteer Hub — GRADEETING": "Espace volontaire — GRADEETING",
    "FAQ — GRADEETING": "FAQ — GRADEETING",
    "Changelog — GRADEETING": "Nouveautés — GRADEETING",
    "Stats — GRADEETING": "Stats — GRADEETING",
    "Team — GRADEETING": "Équipe — GRADEETING",
    "QR Code — GRADEETING": "QR code — GRADEETING",
    "Thank you — GRADEETING": "Merci — GRADEETING",
    "Swipe & Meet — GRADEETING": "Swipe & Meet — GRADEETING",
    "Guess Who? — GRADEETING": "Qui est-ce ? — GRADEETING",

    // ---------- 404 ----------
    "Oops, nothing here": "Oups, il n'y a rien ici",
    "Looks like this page wandered off the campus.": "On dirait que cette page s'est perdue sur le campus.",
    "Let's get you back to the stars of Aivancity.": "On te ramène vers les stars d'Aivancity.",

    // ---------- Accueil : en-tête ----------
    "🎉 Gradeeting v36 is live — Working Volunteer Hub, Magic Links, and two 🎮NEW GAMES🎮!":
      "🎉 Gradeeting v36 est en ligne — Espace volontaire, liens magiques et deux 🎮NOUVEAUX JEUX🎮 !",
    "Open menu": "Ouvrir le menu",
    "Menu": "Menu",
    "🔐 Volunteer Hub": "🔐 Espace volontaire",
    "📊 Stats": "📊 Stats",
    "❓ FAQ": "❓ FAQ",
    "📝 Changelog": "📝 Nouveautés",
    "🌸 Team": "🌸 Équipe",
    "📱 QR Code": "📱 QR code",
    "✨ Discover the stars of Aivancity ✨": "✨ Découvre les stars d'Aivancity ✨",
    "Already a volunteer?": "Déjà volontaire ?",
    "Sign in": "Se connecter",
    "✏️": "✏️",
    "Edit my profile": "Modifier mon profil",
    "✏️ Edit my profile": "✏️ Modifier mon profil",
    "🌸 About": "🌸 À propos",
    "✨ Become a volunteer": "✨ Deviens volontaire",
    "🎮Guess Who?🎮": "🎮Qui est-ce ?🎮",
    "Detective-style": "Façon détective",
    "🎮Swipe & Meet🎮!": "🎮Swipe & Meet🎮 !",
    "Tinder-style": "Façon Tinder",
    "volunteers": "volontaires",
    "comments": "commentaires",
    "teachers": "profs",
    "⭐ Star of the day": "⭐ Star du jour",
    "Search by name...": "Rechercher un nom...",
    "All classes": "Toutes les classes",
    "Clear": "Effacer",
    "👇 Tap on a card to discover more about a volunteer": "👇 Touche une carte pour en savoir plus sur un volontaire",
    "Loading volunteers...": "Chargement des volontaires...",
    "No volunteers match your search.": "Aucun volontaire ne correspond à ta recherche.",
    "← Back to list": "← Retour à la liste",
    "🌸 Become a volunteer": "🌸 Deviens volontaire",

    // ---------- Accueil : profil ----------
    "Loading profile...": "Chargement du profil...",
    "Unable to load this profile right now.": "Impossible de charger ce profil pour le moment.",
    "Try again": "Réessayer",
    "🔗 Share this profile": "🔗 Partager ce profil",
    "✅ Link copied!": "✅ Lien copié !",
    "Copy this link:": "Copie ce lien :",
    "Instagram": "Instagram",
    "Snapchat": "Snapchat",
    "LinkedIn": "LinkedIn",
    "Email": "Email",
    "Comments": "Commentaires",
    "No comments yet.": "Pas encore de commentaires.",
    "Leave a comment": "Laisser un commentaire",
    "Be honest but constructive. Negative comments must include an explanation, otherwise they will be rejected. All comments are reviewed before appearing.":
      "Sois honnête mais constructif. Les commentaires négatifs doivent être expliqués, sinon ils seront refusés. Tous les commentaires sont vérifiés avant d'apparaître.",
    "Your comment": "Ton commentaire",
    "Write your comment here...": "Écris ton commentaire ici...",
    "Type": "Type",
    "Explanation": "Explication",
    "Explanation (required for negative comments)": "Explication (obligatoire pour un commentaire négatif)",
    "Explain what could be improved or why...": "Explique ce qui pourrait être amélioré, ou pourquoi...",
    "Submit comment": "Envoyer le commentaire",
    "Please write a comment.": "Écris un commentaire.",
    "Negative comments must include an explanation.": "Un commentaire négatif doit être expliqué.",
    "Thank you! Your comment will appear after review.": "Merci ! Ton commentaire apparaîtra après vérification.",
    "Report": "Signaler",
    "Why are you reporting this comment?": "Pourquoi signales-tu ce commentaire ?",
    "Explain briefly...": "Explique en quelques mots...",
    "Send report": "Envoyer le signalement",
    "Cancel": "Annuler",
    "Please explain your report.": "Explique ton signalement.",
    "Thank you. The admin will review this comment.": "Merci. L'admin va vérifier ce commentaire.",
    "Agree": "D'accord",
    "Disagree": "Pas d'accord",
    "Explanation:": "Explication :",

    // ---------- Accueil : mini-jeux ----------
    "🌸 Take a break": "🌸 Fais une pause",
    "A little garden to relax between two profiles.": "Un petit jardin pour souffler entre deux profils.",
    "🌱 Grow a Flower": "🌱 Fais pousser une fleur",
    "Click to water and watch it bloom.": "Arrose-la et regarde-la fleurir.",
    "💧 Water": "💧 Arroser",
    "Flowers grown:": "Fleurs écloses :",
    "🌸 Flower Memory": "🌸 Memory des fleurs",
    "Match the flowers.": "Retrouve les paires de fleurs.",
    "🔄 New game": "🔄 Nouvelle partie",
    "Pairs found:": "Paires trouvées :",
    "🎲 Campus Match": "🎲 Rencontre campus",
    "Discover a random volunteer.": "Découvre un volontaire au hasard.",
    "Click below to start!": "Clique en dessous pour commencer !",
    "🎲 Draw a card": "🎲 Tirer une carte",
    "🎲 Draw another": "🎲 En tirer une autre",
    "Drawing...": "Tirage...",
    "Click then look up for profile": "Clique, puis regarde plus haut pour voir le profil",
    "positive": "positif",
    "negative": "négatif",
    "View profile": "Voir le profil",
    "👀 View profile": "👀 Voir le profil",

    // ---------- Accueil : à propos ----------
    "About Gradeeting": "À propos de Gradeeting",
    "A voluntary platform by and for Aivancity students": "Une plateforme basée sur le volontariat, par et pour les étudiants d'Aivancity",
    "What is Gradeeting?": "C'est quoi, Gradeeting ?",
    "Gradeeting helps you recognize faces on campus and start conversations more easily — especially if you are shy or new. Volunteers choose to appear with a photo and a short description, so you can discover the community at your own pace.":
      "Gradeeting t'aide à reconnaître les visages du campus et à lancer des conversations plus facilement — surtout si tu es timide ou nouveau. Les volontaires choisissent d'apparaître avec une photo et une courte description, pour que tu découvres la communauté à ton rythme.",
    "The rules": "Les règles",
    "100% voluntary.": "100 % volontaire.",
    "Only volunteers appear.": "Seuls les volontaires apparaissent.",
    "No account needed.": "Pas besoin de compte.",
    "Comments are anonymous.": "Les commentaires sont anonymes.",
    "Be honest, but kind.": "Honnête, mais bienveillant.",
    "Feedback should help, not hurt.": "Un avis doit aider, pas blesser.",
    "Negative comments need an explanation": "Les commentaires négatifs doivent être expliqués",
    ", or they will be rejected.": ", sinon ils seront refusés.",
    "Moderated.": "Modéré.",
    "All comments are reviewed before appearing.": "Tous les commentaires sont vérifiés avant d'apparaître.",
    "Legal & privacy": "Mentions légales et vie privée",
    "This is a student project. Photos and names are published only with the explicit consent of the volunteers. Any volunteer can request the removal of their profile or a comment at any time.":
      "C'est un projet étudiant. Les photos et les noms ne sont publiés qu'avec le consentement explicite des volontaires. Chaque volontaire peut demander la suppression de son profil ou d'un commentaire à tout moment.",
    "No personal data is collected from visitors, and no cookies or tracking are used.":
      "Aucune donnée personnelle n'est collectée sur les visiteurs, et il n'y a ni cookies ni suivi.",
    "Any question?": "Une question ?",
    "To become a volunteer, request removal or report a comment, just use the buttons on the platform. For anything else, contact the admin directly at school —":
      "Pour devenir volontaire, demander une suppression ou signaler un commentaire, utilise simplement les boutons du site. Pour tout le reste, contacte l'admin directement à l'école —",
    "Back to top": "Retour en haut",
    "About": "À propos",
    "Become a volunteer": "Deviens volontaire",
    "Suggest an idea": "Suggérer une idée",
    "FAQ": "FAQ",
    "Changelog": "Nouveautés",
    "Team": "Équipe",
    "📊 Stats ": "📊 Stats ",
    "Aivancity student project —": "Projet étudiant Aivancity —",
    "visits so far": "visites jusqu'ici",

    // ---------- Accueil : inscription ----------
    "Fill this form to appear on Gradeeting. Your profile will be reviewed by the admin before appearing publicly.":
      "Remplis ce formulaire pour apparaître sur Gradeeting. Ton profil sera vérifié par l'admin avant d'être publié.",
    "Your email *": "Ton email *",
    "firstname.lastname@...": "prenom.nom@...",
    "We'll send you a code to confirm it. You'll use it to edit your profile later. Never shown publicly.":
      "On t'envoie un code pour le confirmer. Il te servira à modifier ton profil plus tard. Jamais affiché publiquement.",
    "Your name *": "Ton nom *",
    "First name + last initial or full name": "Prénom + initiale du nom, ou nom complet",
    "Your class *": "Ta classe *",
    "e.g. PGE2 EN": "ex. PGE2 EN",
    "Format: PGE1 FR / PGE2 EN / Teacher ...": "Format : PGE1 FR / PGE2 EN / Teacher ...",
    "Short description *": "Courte description *",
    "A few words about you...": "Quelques mots sur toi...",
    "Pronouns (optional)": "Pronoms (facultatif)",
    "he": "il",
    "she": "elle",
    "Social links (optional, leave blank if you don't want to share)": "Réseaux sociaux (facultatif, laisse vide si tu ne veux pas les partager)",
    "Instagram username": "Pseudo Instagram",
    "Snapchat username": "Pseudo Snapchat",
    "LinkedIn profile URL": "Lien du profil LinkedIn",
    "Public contact email (shown on your profile)": "Email de contact public (affiché sur ton profil)",
    "Your photo *": "Ta photo *",
    "I agree that my name, class, photo and description appear publicly on Gradeeting. I understand I can ask for removal at any time by contacting the admin.":
      "J'accepte que mon nom, ma classe, ma photo et ma description apparaissent publiquement sur Gradeeting. Je sais que je peux demander leur suppression à tout moment en contactant l'admin.",
    "📬 We sent a 6-digit code to": "📬 On a envoyé un code à 6 chiffres à",
    ". It can take a minute; check your spam folder too.": ". Ça peut prendre une minute ; regarde aussi dans tes spams.",
    "Code": "Code",
    "Confirm and submit my profile": "Confirmer et envoyer mon profil",
    "← Back to the form": "← Retour au formulaire",
    "Send a new code": "Renvoyer un code",
    "Thank you!": "Merci !",
    "Your profile is now": "Ton profil est maintenant",
    "awaiting review": "en attente de validation",
    "by the admin. It will appear on Gradeeting once approved.": "par l'admin. Il apparaîtra sur Gradeeting une fois validé.",
    "You can already change it anytime with": "Tu peux déjà le modifier quand tu veux avec",
    "at the top of the page, no password needed.": "en haut de la page, sans mot de passe.",
    "Please enter a valid email.": "Entre un email valide.",
    "Please fill all fields and accept the consent.": "Remplis tous les champs et accepte le consentement.",
    "Your photo is too large (max 5 MB). Please choose a smaller one.": "Ta photo est trop lourde (5 Mo max). Choisis-en une plus petite.",
    "Only image files are allowed (JPG, PNG, etc.).": "Seules les images sont acceptées (JPG, PNG, etc.).",
    "Sending code...": "Envoi du code...",
    "Checking...": "Vérification...",
    "Uploading...": "Envoi...",
    "Submitting...": "Envoi...",
    "Enter the code from the email.": "Entre le code reçu par email.",
    "New code sent. Use the latest email.": "Nouveau code envoyé. Utilise le dernier email.",
    "You already have a profile with this email. Use ✏️ Edit my profile at the top of the page.":
      "Tu as déjà un profil avec cet email. Utilise ✏️ Modifier mon profil en haut de la page.",
    "Photo upload failed. Please try a smaller image or try again.": "L'envoi de la photo a échoué. Essaie une image plus petite, ou réessaie.",
    "That code is wrong or has expired. Check the latest email, or send a new code.":
      "Ce code est faux ou a expiré. Vérifie le dernier email, ou demande un nouveau code.",
    "Please wait a minute before asking for another code.": "Attends une minute avant de demander un autre code.",
    "Sign-ups are turned off right now. Contact the admin.": "Les inscriptions sont fermées pour le moment. Contacte l'admin.",

    // ---------- Accueil : suggestion & réglages ----------
    "💡 Suggest an idea": "💡 Suggérer une idée",
    "Have an idea to improve Gradeeting? Share it with the admin. It can be a feature, a fix, a design idea — anything.":
      "Une idée pour améliorer Gradeeting ? Partage-la avec l'admin. Une fonctionnalité, une correction, une idée de design — tout est bienvenu.",
    "Your idea": "Ton idée",
    "I think it would be great if...": "Je pense que ce serait génial si...",
    "Send suggestion": "Envoyer la suggestion",
    "Please write something.": "Écris quelque chose.",
    "✅ Thank you! Your suggestion has been sent to the admin.": "✅ Merci ! Ta suggestion a été envoyée à l'admin.",
    "Sending...": "Envoi...",
    "Customize display": "Personnaliser l'affichage",
    "⚙️ Display settings": "⚙️ Affichage",
    "Theme": "Thème",
    "🌙 Dark Mode": "🌙 Mode sombre",
    "☀️ Light Mode": "☀️ Mode clair",
    "Music": "Musique",
    "🔇 Play Music": "🔇 Lancer la musique",
    "🔊 Pause Music": "🔊 Mettre en pause",
    "🎵 Can-Can (Default)": "🎵 French Cancan (par défaut)",
    "🎧 Lofi German": "🎧 Lofi allemand",
    "🐎 Mongol Throats": "🐎 Chant diphonique mongol",
    "🌿 Russian Sounds": "🌿 Sons russes",
    "🔇 No Music": "🔇 Pas de musique",
    "Text Size": "Taille du texte",
    "Page Width": "Largeur de page",
    "Normal": "Normale",
    "Full": "Pleine",

    // ---------- Espace volontaire ----------
    "🌸 Volunteer Hub": "🌸 Espace volontaire",
    "Manage your profile and reply to your comments": "Gère ton profil et réponds à tes commentaires",
    "Enter your email and we'll send you a 6-digit code. No password needed.": "Entre ton email et on t'envoie un code à 6 chiffres. Pas besoin de mot de passe.",
    "🔗 You opened your personal link. Sign in with your email once to connect it to your profile. After that, you won't need the link any more.":
      "🔗 Tu as ouvert ton lien personnel. Connecte-toi une fois avec ton email pour le relier à ton profil. Ensuite, tu n'auras plus besoin du lien.",
    "Your email": "Ton email",
    "Send me a code": "Envoie-moi un code",
    "📬 Check your email": "📬 Regarde tes emails",
    "We sent a code to": "On a envoyé un code à",
    "← Use another email": "← Utiliser un autre email",
    "🌱 No profile yet": "🌱 Pas encore de profil",
    "You're signed in as": "Tu es connecté avec",
    ", but no profile is connected to this email.": ", mais aucun profil n'est relié à cet email.",
    "Ask the admin for your personal link and open it on this device: it connects your profile to this email.":
      "Demande ton lien personnel à l'admin et ouvre-le sur cet appareil : il relie ton profil à cet email.",
    "Sign out / use another email": "Se déconnecter / utiliser un autre email",
    "Welcome back! 👋": "Content de te revoir ! 👋",
    "Signed in as": "Connecté avec",
    "Sign out": "Se déconnecter",
    "Total Comments": "Commentaires",
    "Replies Sent": "Réponses envoyées",
    "Awaiting Reply": "En attente de réponse",
    "📸 My photo": "📸 Ma photo",
    "Your current photo": "Ta photo actuelle",
    "Current photo": "Photo actuelle",
    "Your new photo, awaiting review": "Ta nouvelle photo, en attente de validation",
    "⏳ New photo, awaiting review": "⏳ Nouvelle photo, en attente de validation",
    "Change my photo": "Changer ma photo",
    "Upload new photo": "Envoyer la nouvelle photo",
    "New photos are checked by the admin before they appear. Your current photo stays until then.":
      "Les nouvelles photos sont vérifiées par l'admin avant d'apparaître. Ta photo actuelle reste affichée d'ici là.",
    "Name (Locked)": "Nom (verrouillé)",
    "Class": "Classe",
    "Pronouns": "Pronoms",
    "Username": "Pseudo",
    "Description": "Description",
    "LinkedIn URL": "Lien LinkedIn",
    "💾 Save profile": "💾 Enregistrer le profil",
    "Saving...": "Enregistrement...",
    "Name locked?": "Nom verrouillé ?",
    "Contact the admin on campus to change it.": "Contacte l'admin sur le campus pour le changer.",
    "💬 Your comments": "💬 Tes commentaires",
    "Please sign in again.": "Reconnecte-toi.",
    "⏳ Your profile is awaiting review by the admin. It will appear on Gradeeting once approved. You can still edit it below.":
      "⏳ Ton profil attend la validation de l'admin. Il apparaîtra sur Gradeeting une fois validé. Tu peux quand même le modifier ci-dessous.",
    "Your profile wasn't approved. Contact the admin on campus if you'd like to know why or try again.":
      "Ton profil n'a pas été validé. Contacte l'admin sur le campus si tu veux savoir pourquoi ou réessayer.",
    "✅ Sent! Your new photo will appear once the admin approves it.": "✅ Envoyée ! Ta nouvelle photo apparaîtra quand l'admin l'aura validée.",
    "✅ Photo updated.": "✅ Photo mise à jour.",
    "Loading comments...": "Chargement des commentaires...",
    "Error loading comments.": "Erreur de chargement des commentaires.",
    "You have no approved comments yet.": "Tu n'as pas encore de commentaire validé.",
    "Write a public reply...": "Écris une réponse publique...",
    "Please write a reply first.": "Écris d'abord une réponse.",
    "Reply": "Répondre",
    "🌸 Your reply:": "🌸 Ta réponse :",
    "✅ Profile updated successfully!": "✅ Profil mis à jour !",
    "This link is not valid any more. Ask the admin for a new one.": "Ce lien n'est plus valable. Demande-en un nouveau à l'admin.",
    "This profile is already linked to another email. Contact the admin.": "Ce profil est déjà relié à un autre email. Contacte l'admin.",
    "Your email is already linked to another profile. Contact the admin.": "Ton email est déjà relié à un autre profil. Contacte l'admin.",
    "🌸 Volunteer replied:": "🌸 Réponse du volontaire :",
    // Ancien Espace volontaire (connexion par lien personnel)
    "🔒 Access Denied": "🔒 Accès refusé",
    "You need a valid login link to access this page, 🚨this link is given to you by the admin🚨.":
      "Il te faut un lien de connexion valide pour accéder à cette page, 🚨c'est l'admin qui te le donne🚨.",
    "Please check your messages (WhatsApp or Email) for the personal link the admin sent you.":
      "Regarde tes messages (WhatsApp ou email) : l'admin t'y a envoyé ton lien personnel.",
    "Lost your link? Contact the admin on campus to get a new one.": "Lien perdu ? Contacte l'admin sur le campus pour en avoir un nouveau.",
    "You are securely logged in.": "Tu es connecté en toute sécurité.",
    "Log out": "Se déconnecter",
    "Access your hub here": "Accède à ton espace ici",
    "Contact email": "Email de contact",
    "Thank you! Your profile will appear after admin review.": "Merci ! Ton profil apparaîtra après validation par l'admin.",

    // ---------- FAQ ----------
    "Everything you need to know about Gradeeting": "Tout ce qu'il faut savoir sur Gradeeting",
    "Gradeeting is a": "Gradeeting est une",
    "voluntary platform": "plateforme basée sur le volontariat",
    "made by and for Aivancity students. It helps you recognize faces on campus and start conversations more easily — especially if you are shy or new.":
      "faite par et pour les étudiants d'Aivancity. Elle t'aide à reconnaître les visages du campus et à lancer des conversations plus facilement — surtout si tu es timide ou nouveau.",
    "Volunteers appear with a photo and a short description. Visitors can read anonymous, moderated comments about them.":
      "Les volontaires apparaissent avec une photo et une courte description. Les visiteurs peuvent lire des commentaires anonymes et modérés à leur sujet.",
    "Who appears on Gradeeting?": "Qui apparaît sur Gradeeting ?",
    "Only people who": "Seulement les personnes qui",
    "agreed to be shown": "ont accepté d'apparaître",
    ". Being on Gradeeting is 100% voluntary. Nobody is added without their consent.": ". Être sur Gradeeting est 100 % volontaire. Personne n'est ajouté sans son accord.",
    "How do I become a volunteer?": "Comment devenir volontaire ?",
    "Click the": "Clique sur le bouton",
    "button. Fill the form with your name, class, a short description, a photo, and your consent. Your profile will be reviewed by the admin before appearing publicly.":
      ". Remplis le formulaire avec ton nom, ta classe, une courte description, une photo et ton consentement. Ton profil sera vérifié par l'admin avant d'être publié.",
    "Can I remove my profile later?": "Est-ce que je peux supprimer mon profil plus tard ?",
    "Yes. At any time, you can contact the admin directly at school": "Oui. À tout moment, tu peux contacter l'admin directement à l'école",
    "(PGE2 EN)": "(PGE2 EN)",
    "and ask for removal. Your profile and comments will be deleted as soon as possible.": "et demander la suppression. Ton profil et tes commentaires seront supprimés dès que possible.",
    "Are comments really anonymous?": "Les commentaires sont vraiment anonymes ?",
    "Yes. Comments are anonymous.": "Oui. Les commentaires sont anonymes.",
    "No account is needed": "Pas besoin de compte",
    "to write one. No personal data is collected from visitors, and no cookies or tracking are used.":
      "pour en écrire un. Aucune donnée personnelle n'est collectée sur les visiteurs, et il n'y a ni cookies ni suivi.",
    "Why do some comments not appear?": "Pourquoi certains commentaires n'apparaissent pas ?",
    "Every comment is": "Chaque commentaire est",
    "moderated before appearing": "modéré avant d'apparaître",
    ". Negative comments must include a constructive explanation, or they are rejected. This keeps the platform kind and useful.":
      ". Les commentaires négatifs doivent contenir une explication constructive, sinon ils sont refusés. C'est ce qui garde la plateforme bienveillante et utile.",
    "How long does moderation take?": "Combien de temps prend la modération ?",
    "Usually between 24 and 48 hours. Moderation is done by the admin.": "En général entre 24 et 48 heures. La modération est faite par l'admin.",
    "Can I report a comment?": "Est-ce que je peux signaler un commentaire ?",
    "Yes. Under every comment, click": "Oui. Sous chaque commentaire, clique sur",
    "and explain why. The admin will review it.": "et explique pourquoi. L'admin le vérifiera.",
    "What do the 👍 and 👎 reactions mean?": "Que veulent dire les réactions 👍 et 👎 ?",
    "They let you say whether you": "Elles te permettent de dire si tu es",
    "agree or disagree": "d'accord ou pas d'accord",
    "with a comment. You can react once per comment, and change your mind later.": "avec un commentaire. Tu peux réagir une fois par commentaire, et changer d'avis plus tard.",
    "Why no user accounts?": "Pourquoi pas de comptes utilisateurs ?",
    "To lower the barrier. Anyone can browse and comment without signing up. Anonymity helps shy students participate too.":
      "Pour que ce soit plus simple. Tout le monde peut naviguer et commenter sans s'inscrire. L'anonymat aide aussi les étudiants timides à participer.",
    "Who is behind Gradeeting?": "Qui est derrière Gradeeting ?",
    "It is a": "C'est un",
    "student project": "projet étudiant",
    ". See the": ". Va voir la",
    "Team page": "page Équipe",
    "for more details.": "pour plus de détails.",
    "I have an idea to improve Gradeeting. Where can I send it?": "J'ai une idée pour améliorer Gradeeting. Où l'envoyer ?",
    "💡 lightbulb": "💡 ampoule",
    "button in the bottom-right corner of any page. It opens a suggestion form that goes directly to the admin.":
      "en bas à droite de n'importe quelle page. Il ouvre un formulaire de suggestion qui va directement à l'admin.",
    "Still have a question?": "Encore une question ?",
    "Contact the admin directly at school — PGE2 EN.": "Contacte l'admin directement à l'école — PGE2 EN.",

    // ---------- Nouveautés (changelog) ----------
    "Every improvement, big and small": "Chaque amélioration, petite ou grande",
    "Latest": "Dernière version",
    "October 2026": "Octobre 2026",
    "September 2026": "Septembre 2026",
    "November 2026": "Novembre 2026",
    "Working Volunteer Hub: Volunteers can now log in to edit their profile and reply to comments.":
      "Espace volontaire fonctionnel : les volontaires peuvent se connecter pour modifier leur profil et répondre aux commentaires.",
    "Token Authentication: Secure, passwordless access for volunteers.": "Connexion par jeton : accès sécurisé et sans mot de passe pour les volontaires.",
    "New Game: Swipe & Meet (Tinder-style discovery).": "Nouveau jeu : Swipe & Meet (découverte façon Tinder).",
    "New Game: Guess Who? (Find the volunteer).": "Nouveau jeu : Qui est-ce ? (trouve le volontaire).",
    "Fancy UI Update: Glassmorphism, glowing cards, and new background decorations.": "Nouveau look : effet verre, cartes lumineuses et nouvelles décorations.",
    "Volunteer Hub": "Espace volontaire",
    "New fancy redesign": "Nouveau design",
    "New crazy music box": "Nouvelle boîte à musique déjantée",
    "And too much to say!": "Et bien plus encore !",
    "BDE Collaboration": "Collaboration avec le BDE",
    "Public stats page with charts": "Page de stats publique avec graphiques",
    "About section redesigned with cards": "Section À propos refaite avec des cartes",
    "FAQ, Changelog, Team pages": "Pages FAQ, Nouveautés et Équipe",
    "Suggestion box (floating 💡 button)": "Boîte à idées (bouton 💡 flottant)",
    "Admin can edit and delete any volunteer, comment or report": "L'admin peut modifier et supprimer volontaires, commentaires et signalements",
    "Refresh buttons in the admin panel": "Boutons d'actualisation dans le panneau admin",
    "Anonymous reactions (👍 👎) on comments": "Réactions anonymes (👍 👎) sur les commentaires",
    "Star of the day + Joke of the day": "Star du jour + blague du jour",
    "Dark mode toggle": "Mode sombre",
    "Admin dashboard with counters": "Tableau de bord admin avec compteurs",
    "Floral side decorations": "Décorations florales sur les côtés",
    "Two mini-games: Grow a Flower and Flower Memory": "Deux mini-jeux : Fais pousser une fleur et Memory des fleurs",
    "Public stats bar (volunteers, comments, teachers)": "Barre de stats publique (volontaires, commentaires, profs)",
    "Share button on each profile": "Bouton de partage sur chaque profil",
    "Direct profile links via URL hash": "Liens directs vers les profils",
    "Pronouns (he / she / ?) and optional social links": "Pronoms (il / elle / ?) et réseaux sociaux facultatifs",
    "Class auto-normalization (PGE2EN → PGE2 EN)": "Classes harmonisées automatiquement (PGE2EN → PGE2 EN)",
    "Volunteer self-signup form": "Formulaire d'inscription des volontaires",
    "Admin approval queue": "File de validation pour l'admin",
    "QR code page for campus promotion": "Page QR code pour la promo sur le campus",
    "Live site deployed on Netlify": "Site en ligne sur Netlify",
    "Auto-deploy from GitHub": "Déploiement automatique depuis GitHub",
    "Custom 404 page": "Page 404 personnalisée",
    "First version: volunteer list, detail page and anonymous comments": "Première version : liste des volontaires, page de profil et commentaires anonymes",
    "Admin moderation via Supabase dashboard": "Modération par l'admin via Supabase",

    // ---------- Stats ----------
    "📊 Gradeeting Stats": "📊 Stats de Gradeeting",
    "A live look at the Aivancity community": "La communauté Aivancity en direct",
    "🌸 Volunteers": "🌸 Volontaires",
    "🎓 Teachers": "🎓 Profs",
    "💬 Comments": "💬 Commentaires",
    "👀 Visits": "👀 Visites",
    "Loading stats...": "Chargement des stats...",
    "Unable to load stats right now.": "Impossible de charger les stats pour le moment.",
    "No comments yet": "Pas encore de commentaires",
    "🌸 Volunteers by class": "🌸 Volontaires par classe",
    "💬 Comments by sentiment": "💬 Commentaires par ton",
    "📈 Comments over the last 30 days": "📈 Commentaires sur les 30 derniers jours",
    "⭐ Top 5 most commented volunteers": "⭐ Top 5 des volontaires les plus commentés",

    // ---------- Équipe ----------
    "🌸 The Team": "🌸 L'équipe",
    "Small team, big heart": "Petite équipe, grand cœur",
    "Founder & Admin \\ Future President of Cooking Club 😎": "Fondateur et admin \\ Futur président du club cuisine 😎",
    "Designer and Master Coder of Gradeeting. Built the whole platform, from idea to deployment. Handles moderation, answers questions, and keeps the site alive. I definitely vibe coded the website. \"I can put my profile here... or let you search for it.\"":
      "Designer et maître codeur de Gradeeting. A construit toute la plateforme, de l'idée à la mise en ligne. S'occupe de la modération, répond aux questions et fait vivre le site. J'ai clairement vibe codé le site. « Je pourrais mettre mon profil ici... ou te laisser le chercher. »",
    "The Volunteers": "Les volontaires",
    "The stars of Aivancity": "Les stars d'Aivancity",
    "Gradeeting exists because": "Gradeeting existe parce que des",
    "students and teachers": "étudiants et des profs",
    "agreed to appear. They chose to be visible, open to honest feedback, and welcoming to new faces. They are the real soul of the project.":
      "ont accepté d'apparaître. Ils ont choisi d'être visibles, ouverts aux avis honnêtes et accueillants envers les nouveaux visages. Ce sont eux, l'âme du projet.",
    "The Community": "La communauté",
    "Commenters & supporters": "Commentateurs et soutiens",
    "Everyone who leaves a kind comment, reports abuse, suggests an idea or shares the site with a friend. Your participation makes the campus warmer.":
      "Tous ceux qui laissent un commentaire sympa, signalent un abus, proposent une idée ou partagent le site avec un ami. Ta participation rend le campus plus chaleureux.",
    "Our values": "Nos valeurs",
    "Voluntary first.": "Le volontariat d'abord.",
    "Nobody appears without agreeing to.": "Personne n'apparaît sans l'avoir accepté.",
    "Kind honesty.": "Honnêteté bienveillante.",
    "Feedback should help, never hurt.": "Un avis doit aider, jamais blesser.",
    "Anonymity protects.": "L'anonymat protège.",
    "No accounts, no tracking, no pressure.": "Pas de comptes, pas de suivi, pas de pression.",
    "Simple and Reliable before Complexity.": "Simple et fiable avant d'être complexe.",
    "Vibe coded but well-tested.": "Vibe codé, mais bien testé.",
    "Community over code.": "La communauté avant le code.",
    "The people matter more than the tech.": "Les gens comptent plus que la technique.",

    // ---------- QR ----------
    "Scan to meet your campus.": "Scanne pour rencontrer ton campus.",
    "Point your phone camera at the code.": "Vise le code avec l'appareil photo de ton téléphone.",
    "🖨️ Print": "🖨️ Imprimer",
    "🔗 Copy link": "🔗 Copier le lien",

    // ---------- Merci ----------
    "Your submission has been received.": "On a bien reçu ton envoi.",
    "It will be reviewed by the admin and appear shortly.": "Il sera vérifié par l'admin et apparaîtra bientôt.",
    "Welcome aboard! 🌸": "Bienvenue à bord ! 🌸",
    "Your volunteer profile has been submitted. The admin will review it and approve it soon.": "Ton profil de volontaire a été envoyé. L'admin va le vérifier et le valider bientôt.",
    "Idea received! 💡": "Idée reçue ! 💡",
    "Thank you for helping improve Gradeeting. Your suggestion has been sent to the admin.": "Merci de nous aider à améliorer Gradeeting. Ta suggestion a été envoyée à l'admin.",
    "Comment sent! 💬": "Commentaire envoyé ! 💬",
    "Your comment is now pending review. It will appear after moderation.": "Ton commentaire attend maintenant la modération. Il apparaîtra ensuite.",

    // ---------- Swipe & Meet ----------
    "NOPE": "BOF",
    "LIKE": "J'AIME",
    "← Back": "← Retour",
    "Swipe & Meet 🎯": "Swipe & Meet 🎯",
    "Discover your campus like never before. Swipe the cards to see who you'd like to meet!":
      "Découvre ton campus comme jamais. Fais glisser les cartes pour voir qui tu aimerais rencontrer !",
    "👉 ❤️ Right = Like": "👉 ❤️ À droite = J'aime",
    "👈 ❌ Left = Pass": "👈 ❌ À gauche = Je passe",
    "Use the 👁️ button to better see": "Utilise le bouton 👁️ pour mieux voir les",
    "Info": "infos",
    "Let's go!": "C'est parti !",
    "That's everyone! 🌸": "C'est tout le monde ! 🌸",
    "You liked": "Tu as aimé",
    "people.": "personnes.",
    "Go say hi to them on campus!": "Va leur dire bonjour sur le campus !",
    "Play again": "Rejouer",
    "Toggle Blind Mode": "Activer/désactiver le mode aveugle",
    "🌙 Theme": "🌙 Thème",
    "🎵 Music": "🎵 Musique",

    // ---------- Qui est-ce ? ----------
    "Guess Who? 🕵️‍♂️": "Qui est-ce ? 🕵️‍♂️",
    "The computer is thinking of one specific volunteer on this board.": "L'ordinateur pense à un volontaire précis sur ce plateau.",
    "Read the clue and click on the wrong people to eliminate them. Find the right one!":
      "Lis l'indice et clique sur les mauvaises personnes pour les éliminer. Trouve la bonne !",
    "Start Game": "Commencer",
    "You found them! 🎉": "Trouvé ! 🎉",
    "It was": "C'était",
    "all along!": "depuis le début !",
    "Play Again": "Rejouer",
    "Guess Who?": "Qui est-ce ?",
    "Loading clue...": "Chargement de l'indice...",
    "Shuffling suspects...": "On mélange les suspects...",
    "Not enough volunteers to play.": "Pas assez de volontaires pour jouer.",
    "Unknown": "Inconnu",
    "I am thinking of someone in": "Je pense à quelqu'un en",
    "whose name starts with": "dont le prénom commence par",

    // ---------- Blagues du jour (adaptées, pas traduites mot à mot) ----------
    "Why did the student eat his homework? Because the teacher said it was a piece of cake.":
      "Pourquoi l'étudiant a mangé son devoir ? Parce que le prof a dit que c'était du gâteau.",
    "Why don't scientists trust atoms? Because they make up everything.":
      "Que fait une fraise sur un cheval ? Tagada, tagada.",
    "I told my computer I needed a break. It said: no problem, I'll go to sleep.":
      "J'ai dit à mon ordi que j'avais besoin d'une pause. Il m'a répondu : pas de souci, je me mets en veille.",
    "Why was the math book sad? Because it had too many problems.":
      "Pourquoi le livre de maths est triste ? Parce qu'il a trop de problèmes.",
    "I would tell you a joke about UDP, but you might not get it.":
      "Je te raconterais bien une blague sur l'UDP, mais tu risques de ne pas la recevoir.",
    "Why did the developer go broke? Because he used up all his cache.":
      "Quel est le comble pour un développeur ? De ne pas avoir de classe.",
    "There are 10 types of people in the world: those who understand binary, and those who don't.":
      "Il y a 10 types de personnes dans le monde : celles qui comprennent le binaire, et les autres.",
    "Why do Java developers wear glasses? Because they don't C#.":
      "Une requête SQL entre dans un bar, va voir deux tables et leur demande : « Je peux vous joindre ? »",
    "I'm reading a book about anti-gravity. It's impossible to put down.":
      "Je lis un livre sur l'antigravité. Impossible de le poser.",
    "Why did the coffee file a police report? It got mugged.":
      "Que dit une imprimante dans l'eau ? « J'ai papier ! »",
    "I only know 25 letters of the alphabet. I don't know y.":
      "Quel est le comble pour un électricien ? De ne pas être au courant.",
    "Why don't eggs tell jokes? They'd crack each other up.":
      "Que dit un oignon quand il se cogne ? Aïe.",
    "Why did the scarecrow win an award? Because he was outstanding in his field.":
      "Qu'est-ce qui est petit, carré et jaune ? Un petit carré jaune.",
    "I'm on a seafood diet. I see food, and I eat it.":
      "Quel est le comble pour un jardinier ? De raconter des salades.",
    "Why did the bicycle fall over? Because it was two-tired.":
      "Pourquoi le vélo est tombé ? Parce qu'il était crevé.",
    "What do you call a fake noodle? An impasta.":
      "Qu'est-ce qu'un canif ? Un petit fien.",
    "I used to play piano by ear, but now I use my hands.":
      "Avant, je jouais du piano à l'oreille. Maintenant, j'utilise mes mains.",
    "Why did the tomato turn red? Because it saw the salad dressing.":
      "Comment appelle-t-on un boomerang qui ne revient pas ? Un bâton.",
    "What do you call a bear with no teeth? A gummy bear.":
      "Quel est l'animal le plus heureux ? Le hibou, parce que sa femme est chouette.",
    "Why don't skeletons fight each other? They don't have the guts.":
      "Pourquoi les squelettes ne se battent jamais ? Ils n'ont pas les tripes.",
    "I told my wife she was drawing her eyebrows too high. She looked surprised.":
      "Pourquoi les plongeurs plongent-ils en arrière ? Parce que sinon, ils tombent dans le bateau.",
    "Why did the gym close down? It just didn't work out.":
      "Quel est le sport le plus silencieux ? Le parachute.",
    "Parallel lines have so much in common. It's a shame they'll never meet.":
      "Les droites parallèles ont tellement en commun. Dommage qu'elles ne se rencontrent jamais.",
    "Why do we tell actors to 'break a leg'? Because every play has a cast.":
      "Pourquoi les canards sont toujours à l'heure ? Parce qu'ils sont dans l'étang.",
    "I'm afraid for the calendar. Its days are numbered.":
      "J'ai peur pour le calendrier : ses jours sont comptés.",
    "What do you call cheese that isn't yours? Nacho cheese.":
      "Monsieur et Madame Térieur ont deux fils. Comment s'appellent-ils ? Alain et Alex.",
    "I don't trust stairs. They're always up to something.":
      "Qu'est-ce qui est jaune et qui attend ? Jonathan.",
    "Why did the picture go to jail? Because it was framed.":
      "Pourquoi les poissons n'aiment pas les ordinateurs ? À cause du Net.",
    "What do you call a factory that makes okay products? A satisfactory.":
      "Que dit un informaticien quand il s'ennuie ? « Je me fichier. »",
    "I have a joke about time travel, but you didn't like it.":
      "J'ai une blague sur le voyage dans le temps, mais tu ne l'as pas aimée.",
  };

  // Textes qui contiennent une partie variable (nom, nombre...)
  const PATTERNS = [
    [/^Welcome back, (.+)! 👋$/, "Content de te revoir, $1 ! 👋"],
    [/^Send a new code \((\d+)s\)$/, "Renvoyer un code ($1 s)"],
    [/^Check out (.+) on Gradeeting$/, "Découvre $1 sur Gradeeting"],
    [/^🌸 Volunteer replied: (.*)$/, "🌸 Réponse du volontaire : $1"],
    [/^😄 Joke of the day: (.*)$/, (m, j) => "😄 Blague du jour : " + (FR[j] || j)],
    [/^🤣 Joke of the day: (.*)$/, (m, j) => "🤣 Blague du jour : " + (FR[j] || j)],
    [/^Joke of the day: (.*)$/, (m, j) => "Blague du jour : " + (FR[j] || j)],
    [/^I am thinking of someone in (.+) whose name starts with (.+)$/, "Je pense à quelqu'un en $1 dont le prénom commence par $2"],
    [/^(\d+) visits? so far$/, "$1 visites jusqu'ici"],
    [/^Error: (.*)$/, (m, e) => "Erreur : " + (FR[e] || e)],
    [/^❌ Error: (.*)$/, (m, e) => "❌ Erreur : " + (FR[e] || e)],
    [/^❌ (.*)$/, (m, e) => (FR[e] ? "❌ " + FR[e] : null)],
    [/^Note: (.*)$/, (m, e) => "Remarque : " + (FR[e] || e)],
  ];

  const ATTRS = ["placeholder", "title", "aria-label", "alt"];
  const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA", "CODE", "PRE", "svg"]);

  let lang = readLang();
  const textState = new WeakMap(); // Text node -> { en, fr }
  const attrState = new WeakMap(); // Element -> { attr: { en, fr } }
  const missing = new Set();

  function readLang() {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      return v === "fr" ? "fr" : "en";
    } catch (e) {
      return "en";
    }
  }

  function lookup(core) {
    if (Object.prototype.hasOwnProperty.call(FR, core)) return FR[core];
    for (const [re, rep] of PATTERNS) {
      const m = core.match(re);
      if (m) {
        const out = typeof rep === "function" ? rep(...m) : core.replace(re, rep);
        if (out !== null && out !== undefined) return out;
      }
    }
    return undefined;
  }

  // Traduit une chaîne en gardant les espaces autour ; renvoie null si inconnue
  function translate(str) {
    if (!str || !/[A-Za-z]/.test(str)) return null;
    const m = str.match(/^(\s*)([\s\S]*?)(\s*)$/);
    const core = m[2].replace(/\s+/g, " ");
    if (!core) return null;
    const t = lookup(core);
    if (t === undefined) {
      missing.add(core);
      return null;
    }
    return m[1] + t + m[3];
  }

  function skipped(el) {
    for (let e = el; e; e = e.parentElement) {
      if (SKIP_TAGS.has(e.tagName)) return true;
      if (e.getAttribute && (e.getAttribute("translate") === "no" || e.classList.contains("notranslate"))) return true;
    }
    return false;
  }

  function handleText(node) {
    if (!node.parentElement || skipped(node.parentElement)) return;
    const value = node.nodeValue;
    let st = textState.get(node);
    if (st && (value === st.fr || value === st.en)) {
      // Déjà connu : on remet juste la bonne langue
    } else {
      // Nouveau texte (ou texte changé par un script) : c'est la version anglaise
      const fr = translate(value);
      if (fr === null) {
        textState.delete(node);
        return;
      }
      st = { en: value, fr };
      textState.set(node, st);
    }
    const want = lang === "fr" ? st.fr : st.en;
    if (node.nodeValue !== want) node.nodeValue = want;
  }

  function handleAttrs(el) {
    if (skipped(el)) return;
    let map = attrState.get(el);
    for (const a of ATTRS) {
      if (!el.hasAttribute(a)) continue;
      const value = el.getAttribute(a);
      let st = map && map[a];
      if (!(st && (value === st.fr || value === st.en))) {
        const fr = translate(value);
        if (fr === null) continue;
        st = { en: value, fr };
        if (!map) { map = {}; attrState.set(el, map); }
        map[a] = st;
      }
      const want = lang === "fr" ? st.fr : st.en;
      if (value !== want) el.setAttribute(a, want);
    }
  }

  function walk(root) {
    if (root.nodeType === 3) return handleText(root);
    if (root.nodeType !== 1) return;
    if (SKIP_TAGS.has(root.tagName)) return;
    handleAttrs(root);
    const tw = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    let n;
    while ((n = tw.nextNode())) {
      if (n.nodeType === 3) handleText(n);
      else if (!SKIP_TAGS.has(n.tagName)) handleAttrs(n);
    }
  }

  const observer = new MutationObserver((mutations) => {
    for (const mu of mutations) {
      if (mu.type === "characterData") handleText(mu.target);
      else if (mu.type === "attributes") handleAttrs(mu.target);
      else mu.addedNodes.forEach(walk);
    }
  });

  function start() {
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ATTRS,
    });
    walk(document.documentElement);
  }

  function setLang(next) {
    lang = next === "fr" ? "fr" : "en";
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
    document.documentElement.lang = lang;
    walk(document.documentElement);
    updateToggle();
    // Les graphiques (canvas) ne se re-traduisent pas : on recharge la page
    if (window.Chart && document.querySelector("canvas")) window.location.reload();
  }

  // Les boîtes de dialogue natives sont traduites aussi
  const nativeAlert = window.alert.bind(window);
  const nativeConfirm = window.confirm.bind(window);
  const nativePrompt = window.prompt.bind(window);
  const tr = (msg) => (lang === "fr" ? translate(String(msg)) || msg : msg);
  window.alert = (msg) => nativeAlert(tr(msg));
  window.confirm = (msg) => nativeConfirm(tr(msg));
  window.prompt = (msg, def) => nativePrompt(tr(msg), def);

  // ---------- Bouton de langue ----------
  let toggle = null;
  function addToggle() {
    if (toggle || !document.body) return;
    const style = document.createElement("style");
    style.textContent = `
      .lang-toggle { position: absolute; right: 1rem; top: 1rem; z-index: 650; display: inline-flex; align-items: center; gap: 0.35rem;
        padding: 0.45rem 0.85rem; border-radius: 999px; border: 2px solid rgba(232, 93, 117, 0.35);
        background: rgba(255, 255, 255, 0.92); color: #C73E56; font: 600 0.85rem 'Fredoka', 'Nunito', system-ui, sans-serif;
        cursor: pointer; box-shadow: 0 4px 14px rgba(199, 62, 86, 0.18); backdrop-filter: blur(6px); }
      .lang-toggle:hover { transform: translateY(-2px); }
      [data-theme="dark"] .lang-toggle { background: rgba(46, 37, 39, 0.92); color: #F07C90; border-color: rgba(240, 124, 144, 0.35); }
      @media (max-width: 600px) { .lang-toggle { top: 0.6rem; right: 0.6rem; padding: 0.4rem 0.7rem; font-size: 0.8rem; } }
      @media print { .lang-toggle { display: none; } }`;
    document.head.appendChild(style);
    toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "lang-toggle";
    toggle.setAttribute("translate", "no");
    toggle.addEventListener("click", () => setLang(lang === "fr" ? "en" : "fr"));
    // Sur l'accueil : en haut à droite de l'en-tête, en face du bouton Menu.
    // Ailleurs : en haut à droite de la page. (Pas en "fixed", pour ne rien cacher en défilant.)
    const header = document.querySelector(".site-header");
    if (header && getComputedStyle(header).position !== "static") header.appendChild(toggle);
    else {
      if (getComputedStyle(document.body).position === "static") document.body.style.position = "relative";
      document.body.appendChild(toggle);
    }
    updateToggle();
  }
  function updateToggle() {
    if (!toggle) return;
    // Pas de drapeaux : Windows les affiche en lettres ("GB", "FR")
    if (lang === "fr") {
      toggle.textContent = "🌐 English";
      toggle.setAttribute("aria-label", "Switch to English");
    } else {
      toggle.textContent = "🌐 Français";
      toggle.setAttribute("aria-label", "Passer en français");
    }
  }

  document.documentElement.lang = lang;
  start();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => { walk(document.documentElement); addToggle(); });
  } else {
    addToggle();
  }

  // Pour les scripts (ex. graphiques dessinés dans un <canvas>, que l'observateur ne voit pas)
  window.GradeetingI18n = {
    t: (s) => (lang === "fr" ? (translate(String(s)) || s) : s),
    lang: () => lang,
    setLang,
    missing: () => [...missing].sort(),
  };
})();
