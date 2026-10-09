// 1. Connexion à Supabase
const SUPABASE_URL = "https://pwsdatsdgmvsaptowadl.supabase.co";
const SUPABASE_KEY = "sb_publishable_Ke5kkta-zcmT41TIcQTNiA_aQUoGx_t";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ---------- Thème clair / sombre ----------
const THEME_KEY = "gradeeting_theme";

function applyTheme(theme) {
  if (theme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
  const btn = document.getElementById("theme-toggle");
  if (btn) {
    btn.textContent = theme === "dark" ? "☀️" : "🌙";
  }
}

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);

  if (saved) {
    applyTheme(saved);
  } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    applyTheme("dark");
  } else {
    applyTheme("light");
  }

  const btn = document.getElementById("theme-toggle");
  if (btn) {
    btn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
      const next = current === "dark" ? "light" : "dark";
      localStorage.setItem(THEME_KEY, next);
      applyTheme(next);
    });
  }
}

initTheme();

// Éléments du DOM
const listContainer = document.getElementById("volunteers-list");
const detailContainer = document.getElementById("volunteer-detail");
const detailContent = document.getElementById("detail-content");
const backButton = document.getElementById("back-button");
const searchInput = document.getElementById("search-input");
const classFilter = document.getElementById("class-filter");
const clearFiltersBtn = document.getElementById("clear-filters");

let currentVolunteerId = null;
let allVolunteers = [];

const PLACEHOLDER = "https://placehold.co/300x180?text=No+Photo";

// Identifiant visiteur anonyme (persistant dans le navigateur)
function getVisitorId() {
  let id = localStorage.getItem("gradeeting_visitor_id");
  if (!id) {
    id = (crypto.randomUUID && crypto.randomUUID()) ||
         Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem("gradeeting_visitor_id", id);
  }
  return id;
}
const VISITOR_ID = getVisitorId();

// ---------- Blagues du jour ----------
const JOKES = [
  "Why did the student eat his homework? Because the teacher said it was a piece of cake.",
  "Why don't scientists trust atoms? Because they make up everything.",
  "I told my computer I needed a break. It said: no problem, I'll go to sleep.",
  "Why was the math book sad? Because it had too many problems.",
  "I would tell you a joke about UDP, but you might not get it.",
  "Why did the developer go broke? Because he used up all his cache.",
  "There are 10 types of people in the world: those who understand binary, and those who don't.",
  "Why do Java developers wear glasses? Because they don't C#.",
  "I'm reading a book about anti-gravity. It's impossible to put down.",
  "Why did the coffee file a police report? It got mugged.",
  "I only know 25 letters of the alphabet. I don't know y.",
  "Why don't eggs tell jokes? They'd crack each other up.",
  "Why did the scarecrow win an award? Because he was outstanding in his field.",
  "I'm on a seafood diet. I see food, and I eat it.",
  "Why did the bicycle fall over? Because it was two-tired.",
  "What do you call a fake noodle? An impasta.",
  "I used to play piano by ear, but now I use my hands.",
  "Why did the tomato turn red? Because it saw the salad dressing.",
  "What do you call a bear with no teeth? A gummy bear.",
  "Why don't skeletons fight each other? They don't have the guts.",
  "I told my wife she was drawing her eyebrows too high. She looked surprised.",
  "Why did the gym close down? It just didn't work out.",
  "Parallel lines have so much in common. It's a shame they'll never meet.",
  "Why do we tell actors to 'break a leg'? Because every play has a cast.",
  "I'm afraid for the calendar. Its days are numbered.",
  "What do you call cheese that isn't yours? Nacho cheese.",
  "I don't trust stairs. They're always up to something.",
  "Why did the picture go to jail? Because it was framed.",
  "What do you call a factory that makes okay products? A satisfactory.",
  "I have a joke about time travel, but you didn't like it.",
];

// Hash déterministe d'une chaîne (pour un choix stable dans la journée)
function dayHash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h) + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// Normalisation du champ classe
function normalizeClass(input) {
  if (!input) return "";

  let s = input.trim().toUpperCase();
  s = s.replace(/\s+/g, " ");

  // Teacher variants
  if (/^(TEACHER|PROF|PROFESSOR|PROFESSEUR|PROFS)$/i.test(s)) {
    return "Teacher";
  }

  // PGE pattern : PGE + chiffres + (optionnel) code langue
  const pgeMatch = s.match(/^PGE\s*-?\s*(\d+)\s*-?\s*([A-Z]{2,3})?$/);
  if (pgeMatch) {
    const year = pgeMatch[1];
    const lang = pgeMatch[2];
    return lang ? `PGE${year} ${lang}` : `PGE${year}`;
  }

  // Master : placeholder, à affiner plus tard
  // Pour l'instant on retourne la version uppercase + trim

  return s;
}

function safeUrl(url) {
  if (!url) return null;
  if (!/^https?:\/\//i.test(url)) return null;
  return url;
}

function escapeHtml(text) {
  if (!text) return "";
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// 2. Charger les volontaires approuvés
async function loadVolunteers() {
  listContainer.innerHTML = '<p class="loading">Loading volunteers...</p>';

  const { data, error } = await supabaseClient
    .from("volunteers")
    .select("id, name, photo_url, description, class")
    .eq("status", "approved");

  if (error) {
    console.error("Erreur Supabase :", error.message);
    listContainer.innerHTML = `
      <div class="error-box">
        <p>Unable to load volunteers right now.</p>
        <button id="retry-button">Try again</button>
      </div>
    `;
    document.getElementById("retry-button").addEventListener("click", loadVolunteers);
    return;
  }

  allVolunteers = shuffleArray(data);
  populateClassFilter(data);
  renderFeatured(data);
  renderVolunteers(allVolunteers);
  updateStats(allVolunteers);
  loadCommentCount();
}

// Calcul des stats à partir des volontaires chargés
function updateStats(volunteers) {
  const total = volunteers.length;
  const teachers = volunteers.filter((v) => normalizeClass(v.class) === "Teacher").length;

  document.getElementById("stat-volunteers").textContent = total;
  document.getElementById("stat-teachers").textContent = teachers;
}

// Nombre total de commentaires approuvés
async function loadCommentCount() {
  const { count, error } = await supabaseClient
    .from("comments")
    .select("*", { count: "exact", head: true })
    .eq("status", "approved");

  if (error) {
    console.error("Erreur count commentaires :", error.message);
    document.getElementById("stat-comments").textContent = "—";
    return;
  }

  document.getElementById("stat-comments").textContent = count;
}

// 3. Remplir le filtre de classes
function populateClassFilter(volunteers) {
  const classes = [...new Set(volunteers.map((v) => normalizeClass(v.class)).filter(Boolean))].sort();

  classFilter.innerHTML = '<option value="">All classes</option>';
  classes.forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    classFilter.appendChild(opt);
  });
}

// 4. Afficher les volontaires
function renderVolunteers(volunteers) {
  listContainer.innerHTML = "";

  if (volunteers.length === 0) {
    listContainer.innerHTML = '<p class="empty">No volunteers match your search.</p>';
    return;
  }

  volunteers.forEach((v) => {
    const card = document.createElement("div");
    card.className = "volunteer-card";
    card.addEventListener("click", () => showVolunteerDetail(v.id));

    const img = document.createElement("img");
    img.src = v.photo_url || PLACEHOLDER;
    img.alt = v.name;
    img.loading = "lazy";
    img.addEventListener("error", () => {
      img.src = PLACEHOLDER;
    });

    const name = document.createElement("h2");
    name.textContent = v.name;

    const desc = document.createElement("p");
    desc.textContent = v.description || "";

    card.appendChild(img);
    card.appendChild(name);
    card.appendChild(desc);

    const normalizedClass = normalizeClass(v.class);
    if (normalizedClass) {
      const classTag = document.createElement("span");
      classTag.className = "class-tag";
      classTag.textContent = normalizedClass;
      card.appendChild(classTag);
    }

    listContainer.appendChild(card);
  });
}

// 5. Appliquer les filtres
function applyFilters() {
  const search = searchInput.value.trim().toLowerCase();
  const selectedClass = classFilter.value;

  const filtered = allVolunteers.filter((v) => {
    const matchName = v.name.toLowerCase().includes(search);
    const matchClass = !selectedClass || normalizeClass(v.class) === selectedClass;
    return matchName && matchClass;
  });

  renderVolunteers(filtered);
}

// 6. Réinitialiser les filtres
function clearFilters() {
  searchInput.value = "";
  classFilter.value = "";
  renderVolunteers(allVolunteers);
}

// 7. Afficher le détail d'un volontaire
async function showVolunteerDetail(volunteerId) {
  currentVolunteerId = volunteerId;

  listContainer.style.display = "none";
  detailContainer.style.display = "block";

  // Redémarrer l'animation d'entrée à chaque ouverture
  detailContainer.style.animation = "none";
  void detailContainer.offsetWidth;
  detailContainer.style.animation = "";

  detailContent.innerHTML = '<p class="loading">Loading profile...</p>';

  const { data: volunteer, error: volError } = await supabaseClient
    .from("volunteers")
    .select("id, name, photo_url, description, class")
    .eq("id", volunteerId)
    .single();

  if (volError) {
    console.error("Erreur volontaire :", volError.message);
    detailContent.innerHTML = `
      <div class="error-box">
        <p>Unable to load this profile right now.</p>
        <button id="retry-detail">Try again</button>
      </div>
    `;
    document.getElementById("retry-detail").addEventListener("click", () => {
      showVolunteerDetail(volunteerId);
    });
    return;
  }

  const { data: comments, error: comError } = await supabaseClient
    .from("comments")
    .select("id, body, sentiment, explanation, created_at")
    .eq("volunteer_id", volunteerId)
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (comError) {
    console.error("Erreur commentaires :", comError.message);
  }

    // Charger les réactions pour tous les commentaires affichés
  const reactionsByComment = {};
  if (comments && comments.length > 0) {
    const commentIds = comments.map((c) => c.id);
    const { data: reactions, error: reactError } = await supabaseClient
      .from("reactions")
      .select("comment_id, reaction, visitor_id")
      .in("comment_id", commentIds);

    if (reactError) {
      console.error("Erreur reactions :", reactError.message);
    } else {
      reactions.forEach((r) => {
        if (!reactionsByComment[r.comment_id]) {
          reactionsByComment[r.comment_id] = { agree: 0, disagree: 0, mine: null };
        }
        reactionsByComment[r.comment_id][r.reaction]++;
        if (r.visitor_id === VISITOR_ID) {
          reactionsByComment[r.comment_id].mine = r.reaction;
        }
      });
    }
  }

  // Bouton Share
  // (ajouté plus bas dans le HTML)
  const photo = volunteer.photo_url || PLACEHOLDER;
  const normalizedClass = normalizeClass(volunteer.class);
  const classLine = normalizedClass ? `<p class="detail-class">${normalizedClass}</p>` : "";

  const pronounBadge = volunteer.pronouns
    ? `<span class="pronoun-badge">${escapeHtml(volunteer.pronouns)}</span>`
    : "";

  const socialLinks = [];
  if (volunteer.instagram) {
    socialLinks.push(`<a class="social-link" href="https://instagram.com/${encodeURIComponent(volunteer.instagram)}" target="_blank" rel="noopener">Instagram</a>`);
  }
  if (volunteer.snapchat) {
    socialLinks.push(`<a class="social-link" href="https://snapchat.com/add/${encodeURIComponent(volunteer.snapchat)}" target="_blank" rel="noopener">Snapchat</a>`);
  }
  const li = safeUrl(volunteer.linkedin);
  if (li) {
    socialLinks.push(`<a class="social-link" href="${li}" target="_blank" rel="noopener">LinkedIn</a>`);
  }
  if (volunteer.contact_email) {
    socialLinks.push(`<a class="social-link" href="mailto:${encodeURIComponent(volunteer.contact_email)}">Email</a>`);
  }
  const socialBlock = socialLinks.length
    ? `<div class="social-links">${socialLinks.join("")}</div>`
    : "";

  detailContent.innerHTML = `
    <div class="detail-header">
      <img src="${photo}" alt="${volunteer.name}" onerror="this.src='${PLACEHOLDER}'">
      <div>
        <h2>${volunteer.name}${pronounBadge}</h2>
        ${classLine}
        <p>${volunteer.description || ""}</p>
        <button class="share-button" id="share-button">🔗 Share this profile</button>
      </div>
    </div>

    ${socialBlock}

    <div class="comments-section">
      <h3>Comments</h3>
      <div id="comments-list"></div>
    </div>

    <div class="comment-form">
      <h3>Leave a comment</h3>
      <div class="disclaimer">
        Be honest but constructive. Negative comments must include an explanation,
        otherwise they will be rejected. All comments are reviewed before appearing.
      </div>

      <form id="comment-form">
        <label>Your comment</label>
        <textarea name="body" required maxlength="1000" placeholder="Write your comment here..."></textarea>

        <label>Type</label>
        <div class="sentiment-choice">
          <label><input type="radio" name="sentiment" value="positive" checked> Positive</label>
          <label><input type="radio" name="sentiment" value="negative"> Negative</label>
        </div>

        <div id="explanation-block" class="hidden">
          <label>Explanation (required for negative comments)</label>
          <textarea name="explanation" maxlength="1000" placeholder="Explain what could be improved or why..."></textarea>
        </div>

        <button type="submit" id="submit-button">Submit comment</button>
        <div id="form-message" class="form-message"></div>
      </form>
    </div>
  `;

  const commentsList = document.getElementById("comments-list");

  if (!comments || comments.length === 0) {
    commentsList.innerHTML = '<p class="no-comments">No comments yet.</p>';
  } else {
    comments.forEach((c) => {
      const card = document.createElement("div");
      card.className = "comment-card";

      const sentiment = document.createElement("div");
      sentiment.className = `sentiment ${c.sentiment}`;
      sentiment.textContent = c.sentiment;

      const body = document.createElement("p");
      body.textContent = c.body;

      card.appendChild(sentiment);
      card.appendChild(body);

      if (c.sentiment === "negative" && c.explanation) {
        const expl = document.createElement("p");
        expl.className = "explanation";
        expl.textContent = `Explanation: ${c.explanation}`;
        card.appendChild(expl);
      }

      const date = document.createElement("div");
      date.className = "date";
      date.textContent = new Date(c.created_at).toLocaleDateString();
      card.appendChild(date);

      // Bloc réactions
      const stats = reactionsByComment[c.id] || { agree: 0, disagree: 0, mine: null };

      const reactBar = document.createElement("div");
      reactBar.className = "reaction-bar";

      const agreeBtn = document.createElement("button");
      agreeBtn.type = "button";
      agreeBtn.className = "reaction-btn" + (stats.mine === "agree" ? " active" : "");
      agreeBtn.innerHTML = `👍 <span>${stats.agree}</span>`;

      const disagreeBtn = document.createElement("button");
      disagreeBtn.type = "button";
      disagreeBtn.className = "reaction-btn" + (stats.mine === "disagree" ? " active" : "");
      disagreeBtn.innerHTML = `👎 <span>${stats.disagree}</span>`;

      agreeBtn.addEventListener("click", () => handleReaction(c.id, "agree", agreeBtn, disagreeBtn));
      disagreeBtn.addEventListener("click", () => handleReaction(c.id, "disagree", agreeBtn, disagreeBtn));

      reactBar.appendChild(agreeBtn);
      reactBar.appendChild(disagreeBtn);
      card.appendChild(reactBar);

      const reportBtn = document.createElement("button");
      reportBtn.className = "report-button";
      reportBtn.textContent = "Report";
      reportBtn.addEventListener("click", () => openReportForm(c.id, card));
      card.appendChild(reportBtn);

      commentsList.appendChild(card);
    });
  }

  setupCommentForm();
  setupShareButton(volunteer);
}

// 8. Brancher le formulaire
function setupCommentForm() {
  const form = document.getElementById("comment-form");
  const explanationBlock = document.getElementById("explanation-block");
  const sentimentRadios = form.querySelectorAll('input[name="sentiment"]');
  const message = document.getElementById("form-message");
  const submitButton = document.getElementById("submit-button");

  sentimentRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      if (form.sentiment.value === "negative") {
        explanationBlock.classList.remove("hidden");
      } else {
        explanationBlock.classList.add("hidden");
      }
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    message.textContent = "";
    message.className = "form-message";

    const body = form.body.value.trim();
    const sentiment = form.sentiment.value;
    const explanation = form.explanation.value.trim();

    if (!body) {
      message.textContent = "Please write a comment.";
      message.classList.add("error");
      return;
    }

    if (sentiment === "negative" && !explanation) {
      message.textContent = "Negative comments must include an explanation.";
      message.classList.add("error");
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Sending...";

    const { error } = await supabaseClient.from("comments").insert({
      volunteer_id: currentVolunteerId,
      body: body,
      sentiment: sentiment,
      explanation: sentiment === "negative" ? explanation : null,
      status: "pending",
    });

    submitButton.disabled = false;
    submitButton.textContent = "Submit comment";

    if (error) {
      console.error("Erreur insertion :", error.message);
      message.textContent = "Something went wrong. Please try again.";
      message.classList.add("error");
      return;
    }

    form.reset();
    explanationBlock.classList.add("hidden");
    message.textContent = "Thank you! Your comment will appear after review.";
    message.classList.add("success");
  });
}

// 9. Revenir à la liste
function showList() {
  detailContainer.style.display = "none";
  listContainer.style.display = "grid";

  // Redémarrer l'animation d'entrée de la liste
  listContainer.style.animation = "none";
  void listContainer.offsetWidth;
  listContainer.style.animation = "";

  detailContent.innerHTML = "";
  currentVolunteerId = null;
  if (window.location.hash.startsWith("#volunteer=")) {
    history.replaceState(null, "", window.location.pathname);
  }
}

backButton.addEventListener("click", showList);

// 10. Brancher les filtres
searchInput.addEventListener("input", applyFilters);
classFilter.addEventListener("change", applyFilters);
clearFiltersBtn.addEventListener("click", clearFilters);

// 11. Lancer au chargement
loadVolunteers();
handleHashOnLoad();

// 12. Ouvrir le formulaire de signalement
function openReportForm(commentId, card) {
  // Éviter les doublons
  if (card.querySelector(".report-form")) return;

  const form = document.createElement("div");
  form.className = "report-form";
  form.innerHTML = `
    <label>Why are you reporting this comment?</label>
    <textarea maxlength="500" placeholder="Explain briefly..."></textarea>
    <div class="report-actions">
      <button type="button" class="report-submit">Send report</button>
      <button type="button" class="report-cancel">Cancel</button>
    </div>
    <div class="report-message"></div>
  `;

  const textarea = form.querySelector("textarea");
  const submitBtn = form.querySelector(".report-submit");
  const cancelBtn = form.querySelector(".report-cancel");
  const message = form.querySelector(".report-message");

  cancelBtn.addEventListener("click", () => form.remove());

  submitBtn.addEventListener("click", async () => {
    const reason = textarea.value.trim();

    if (!reason) {
      message.textContent = "Please explain your report.";
      message.className = "report-message error";
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    const { error } = await supabaseClient.from("reports").insert({
      comment_id: commentId,
      reason: reason,
      status: "pending",
    });

    submitBtn.disabled = false;
    submitBtn.textContent = "Send report";

    if (error) {
      console.error("Erreur signalement :", error.message);
      message.textContent = "Something went wrong. Please try again.";
      message.className = "report-message error";
      return;
    }

    message.textContent = "Thank you. The admin will review this comment.";
    message.className = "report-message success";
    textarea.disabled = true;
    submitBtn.style.display = "none";
    cancelBtn.textContent = "Close";
  });

  card.appendChild(form);
}

// 13. Inscription d'un volontaire
const openSignupBtn = document.getElementById("open-signup");
const closeSignupBtn = document.getElementById("close-signup");
const signupModal = document.getElementById("signup-modal");
const signupForm = document.getElementById("signup-form");

openSignupBtn.addEventListener("click", () => {
  signupModal.classList.remove("hidden");
  document.getElementById("signup-message").textContent = "";
  document.getElementById("signup-message").className = "form-message";
});

closeSignupBtn.addEventListener("click", () => {
  signupModal.classList.add("hidden");
});

// Fermer si on clique en dehors
signupModal.addEventListener("click", (e) => {
  if (e.target === signupModal) {
    signupModal.classList.add("hidden");
  }
});

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const message = document.getElementById("signup-message");
  const submitBtn = document.getElementById("signup-submit");

  message.textContent = "";
  message.className = "form-message";

  const name = signupForm.name.value.trim();
  const className = normalizeClass(signupForm.class.value);
  const description = signupForm.description.value.trim();
  const photoFile = signupForm.photo.files[0];
  const consent = signupForm.consent.checked;
  const pronouns = signupForm.pronouns.value || null;
  const instagram = signupForm.instagram.value.trim() || null;
  const snapchat = signupForm.snapchat.value.trim() || null;
  const linkedin = signupForm.linkedin.value.trim() || null;
  const contactEmail = signupForm.contact_email.value.trim() || null;

  if (!name || !className || !description || !photoFile || !consent) {
    message.textContent = "Please fill all fields and accept the consent.";
    message.classList.add("error");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Uploading...";

  // 1. Upload de la photo
  const fileExt = photoFile.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

  const { error: uploadError } = await supabaseClient.storage
    .from("volunteer-photos")
    .upload(fileName, photoFile);

  if (uploadError) {
    console.error("Erreur upload :", uploadError.message);
    message.textContent = "Photo upload failed. Please try a smaller image or try again.";
    message.classList.add("error");
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit";
    return;
  }

  // 2. Récupérer l'URL publique
  const { data: urlData } = supabaseClient.storage
    .from("volunteer-photos")
    .getPublicUrl(fileName);

  const photoUrl = urlData.publicUrl;

  // 3. Insérer dans la table volunteers
  submitBtn.textContent = "Submitting...";

  const { error: insertError } = await supabaseClient.from("volunteers").insert({
    name: name,
    class: className,
    description: description,
    photo_url: photoUrl,
    consent_given: true,
    consent_date: new Date().toISOString().split("T")[0],
    status: "pending",
    pronouns: pronouns,
    instagram: instagram,
    snapchat: snapchat,
    linkedin: linkedin,
    contact_email: contactEmail,
  });

  if (insertError) {
    console.error("Erreur insertion :", insertError.message);
    message.textContent = "Something went wrong. Please try again.";
    message.classList.add("error");
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit";
    return;
  }

  signupForm.reset();
  message.textContent = "Thank you! Your profile will appear after admin review.";
  message.classList.add("success");
  submitBtn.disabled = false;
  submitBtn.textContent = "Submit";
});

// 14. Mélange aléatoire (Fisher-Yates)
function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// 15. Bouton Back to top
const backToTopBtn = document.getElementById("back-to-top");

window.addEventListener("scroll", () => {
  if (window.scrollY > 400) {
    backToTopBtn.classList.remove("hidden");
  } else {
    backToTopBtn.classList.add("hidden");
  }
});

backToTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// 16. Navigation depuis le header
const navAbout = document.getElementById("nav-about");
const navVolunteer = document.getElementById("nav-volunteer");

navAbout.addEventListener("click", () => {
  document.querySelector(".about-section").scrollIntoView({ behavior: "smooth" });
});

navVolunteer.addEventListener("click", () => {
  // Réutilise le bouton existant pour ouvrir le modal
  document.getElementById("open-signup").click();
});

// 17. Bouton Share
function setupShareButton(volunteer) {
  const shareBtn = document.getElementById("share-button");
  if (!shareBtn) return;

  const shareUrl = `${window.location.origin}${window.location.pathname}#volunteer=${volunteer.id}`;
  const shareText = `Check out ${volunteer.name} on Gradeeting`;

  shareBtn.addEventListener("click", async () => {
    // Sur mobile : utilise le partage natif
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Gradeeting",
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch (e) {
        // L'utilisateur a annulé ou erreur → fallback copie
      }
    }

    // Fallback : copie dans le presse-papier
    try {
      await navigator.clipboard.writeText(shareUrl);
      shareBtn.textContent = "✅ Link copied!";
      setTimeout(() => {
        shareBtn.textContent = "🔗 Share this profile";
      }, 2000);
    } catch (e) {
      console.error("Erreur copie :", e);
      prompt("Copy this link:", shareUrl);
    }
  });
}

// 18. Ouvrir un profil via #volunteer=<id> dans l'URL
function handleHashOnLoad() {
  const hash = window.location.hash;
  const match = hash.match(/^#volunteer=([0-9a-f-]{36})$/i);
  if (match) {
    showVolunteerDetail(match[1]);
  }
}

window.addEventListener("hashchange", handleHashOnLoad);

// 19. Gestion des réactions
async function handleReaction(commentId, reaction, agreeBtn, disagreeBtn) {
  const wasAgree = agreeBtn.classList.contains("active");
  const wasDisagree = disagreeBtn.classList.contains("active");

  // Cas 1 : clic sur la même réaction → on retire
  if ((reaction === "agree" && wasAgree) || (reaction === "disagree" && wasDisagree)) {
    const { error } = await supabaseClient
      .from("reactions")
      .delete()
      .eq("comment_id", commentId)
      .eq("visitor_id", VISITOR_ID);

    if (error) { console.error(error); return; }

    const btn = reaction === "agree" ? agreeBtn : disagreeBtn;
    btn.classList.remove("active");
    const span = btn.querySelector("span");
    span.textContent = Math.max(0, parseInt(span.textContent, 10) - 1);
    return;
  }

  // Cas 2 : aucune réaction → insertion
  if (!wasAgree && !wasDisagree) {
    const { error } = await supabaseClient.from("reactions").insert({
      comment_id: commentId,
      visitor_id: VISITOR_ID,
      reaction: reaction,
    });

    if (error) { console.error(error); return; }

    const btn = reaction === "agree" ? agreeBtn : disagreeBtn;
    btn.classList.add("active");
    const span = btn.querySelector("span");
    span.textContent = parseInt(span.textContent, 10) + 1;
    return;
  }

  // Cas 3 : changement de réaction
  const { error } = await supabaseClient
    .from("reactions")
    .update({ reaction: reaction })
    .eq("comment_id", commentId)
    .eq("visitor_id", VISITOR_ID);

  if (error) { console.error(error); return; }

  if (wasAgree) {
    agreeBtn.classList.remove("active");
    const s = agreeBtn.querySelector("span");
    s.textContent = Math.max(0, parseInt(s.textContent, 10) - 1);
  }
  if (wasDisagree) {
    disagreeBtn.classList.remove("active");
    const s = disagreeBtn.querySelector("span");
    s.textContent = Math.max(0, parseInt(s.textContent, 10) - 1);
  }

  const newBtn = reaction === "agree" ? agreeBtn : disagreeBtn;
  newBtn.classList.add("active");
  const newSpan = newBtn.querySelector("span");
  newSpan.textContent = parseInt(newSpan.textContent, 10) + 1;
}

// 20. Star of the day
function renderFeatured(volunteers) {
  const section = document.getElementById("featured-section");

  if (!volunteers || volunteers.length === 0) {
    section.classList.add("hidden");
    return;
  }

  // Tri stable par id pour que le choix soit identique pour tout le monde
  const sorted = [...volunteers].sort((a, b) => a.id.localeCompare(b.id));
  const seed = dayHash(getTodayKey());

  const featured = sorted[seed % sorted.length];
  const joke = JOKES[seed % JOKES.length];

  const photo = document.getElementById("featured-photo");
  photo.src = featured.photo_url || PLACEHOLDER;
  photo.alt = featured.name;
  photo.onerror = () => { photo.src = PLACEHOLDER; };

  document.getElementById("featured-name").textContent = featured.name;
  document.getElementById("featured-desc").textContent = featured.description || "";
  document.getElementById("featured-joke").textContent = `😄 Joke of the day: ${joke}`;

  section.classList.remove("hidden");

  // Ouvrir le profil au clic
  section.onclick = () => showVolunteerDetail(featured.id);
  section.style.cursor = "pointer";
}

// 21. Mini-jeu : Grow a Flower
const GROW_STAGES = [
  { emoji: "🌱", size: 22 }, // 0 : départ
  { emoji: "🌿", size: 38 }, // 1
  { emoji: "🌷", size: 54 }, // 2
  { emoji: "🌸", size: 70 }, // 3
  { emoji: "🌸", size: 86 }, // 4 : pleine floraison
];

function initGrowGame() {
  const plantEl = document.getElementById("grow-plant");
  const waterBtn = document.getElementById("grow-water");
  const countEl = document.getElementById("grow-count");

  if (!plantEl || !waterBtn || !countEl) return;

  const STORAGE_KEY = "gradeeting_flowers_grown";
  let growStage = 0;

  // Compteur persistant
  function getCount() {
    return parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10);
  }

  countEl.textContent = getCount();

  function updatePlant() {
    const stage = GROW_STAGES[growStage];
    plantEl.textContent = stage.emoji;
    plantEl.style.fontSize = stage.size + "px";
  }

  waterBtn.addEventListener("click", () => {
    // Fin de floraison : on ne fait rien tant que le reset n'est pas fait
    if (growStage >= GROW_STAGES.length - 1) return;

    growStage++;
    updatePlant();

    // Fleur éclose
    if (growStage === GROW_STAGES.length - 1) {
      plantEl.classList.add("bloomed");
      waterBtn.disabled = true;
      waterBtn.textContent = "✨ Bloomed!";

      const newCount = getCount() + 1;
      localStorage.setItem(STORAGE_KEY, newCount);
      countEl.textContent = newCount;

      setTimeout(() => {
        growStage = 0;
        updatePlant();
        plantEl.classList.remove("bloomed");
        waterBtn.disabled = false;
        waterBtn.textContent = "💧 Water";
      }, 2500);
    }
  });

  updatePlant();
}

initGrowGame();

// 22. Mini-jeu : Flower Memory
const MEMORY_FLOWERS = ["🌸", "🌷", "🌻", "🌺"];

function initMemoryGame() {
  const gridEl = document.getElementById("memory-grid");
  const resetBtn = document.getElementById("memory-reset");
  const pairsEl = document.getElementById("memory-pairs");

  if (!gridEl || !resetBtn || !pairsEl) return;

  let firstCard = null;
  let secondCard = null;
  let lockBoard = false;
  let pairsFound = 0;

  function shuffle(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function buildGrid() {
    gridEl.innerHTML = "";
    pairsEl.textContent = "0";
    pairsFound = 0;
    firstCard = null;
    secondCard = null;
    lockBoard = false;

    const deck = shuffle([...MEMORY_FLOWERS, ...MEMORY_FLOWERS]);

    deck.forEach((flower) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "memory-card";
      btn.textContent = flower;
      btn.addEventListener("click", () => flipCard(btn));
      gridEl.appendChild(btn);
    });
  }

  function flipCard(card) {
    if (lockBoard) return;
    if (card === firstCard) return;
    if (card.classList.contains("flipped") || card.classList.contains("matched")) return;

    card.classList.add("flipped");

    if (!firstCard) {
      firstCard = card;
      return;
    }

    secondCard = card;
    lockBoard = true;

    if (firstCard.textContent === secondCard.textContent) {
      // Paire trouvée
      setTimeout(() => {
        firstCard.classList.add("matched");
        secondCard.classList.add("matched");
        pairsFound++;
        pairsEl.textContent = pairsFound;
        resetTurn();
      }, 400);
    } else {
      // Mauvaise paire
      setTimeout(() => {
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        resetTurn();
      }, 800);
    }
  }

  function resetTurn() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
  }

  resetBtn.addEventListener("click", buildGrid);

  buildGrid();
}

initMemoryGame();

// 23. Bandeau d'annonce dismissible
const ANNOUNCEMENT_VERSION = "v20"; // Change cette valeur pour réafficher le bandeau à tout le monde
const ANNOUNCEMENT_KEY = "gradeeting_announcement_dismissed";

function initAnnouncement() {
  const banner = document.getElementById("announcement");
  const closeBtn = document.getElementById("announcement-close");

  if (!banner || !closeBtn) return;

  const dismissed = localStorage.getItem(ANNOUNCEMENT_KEY);

  if (dismissed !== ANNOUNCEMENT_VERSION) {
    banner.classList.remove("hidden");
  }

  closeBtn.addEventListener("click", () => {
    banner.classList.add("hidden");
    localStorage.setItem(ANNOUNCEMENT_KEY, ANNOUNCEMENT_VERSION);
  });
}

initAnnouncement();

// 24. Année dynamique dans le footer
document.getElementById("year").textContent = new Date().getFullYear();