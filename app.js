// 1. Connexion à Supabase
const SUPABASE_URL = "https://pwsdatsdgmvsaptowadl.supabase.co";
const SUPABASE_KEY = "sb_publishable_Ke5kkta-zcmT41TIcQTNiA_aQUoGx_t";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

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

// 2. Charger les volontaires approuvés
async function loadVolunteers() {
  listContainer.innerHTML = '<p class="loading">Loading volunteers...</p>';

  const { data, error } = await supabaseClient
    .from("volunteers")
    .select("id, name, photo_url, description, class")
    .eq("status", "approved")
    .order("name", { ascending: true });

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

  allVolunteers = data;
  populateClassFilter(data);
  renderVolunteers(data);
}

// 3. Remplir le filtre de classes
function populateClassFilter(volunteers) {
  const classes = [...new Set(volunteers.map((v) => v.class).filter(Boolean))].sort();

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

    if (v.class) {
      const classTag = document.createElement("span");
      classTag.className = "class-tag";
      classTag.textContent = v.class;
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
    const matchClass = !selectedClass || v.class === selectedClass;
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

  const photo = volunteer.photo_url || PLACEHOLDER;
  const classLine = volunteer.class ? `<p class="detail-class">${volunteer.class}</p>` : "";

  detailContent.innerHTML = `
    <div class="detail-header">
      <img src="${photo}" alt="${volunteer.name}" onerror="this.src='${PLACEHOLDER}'">
      <div>
        <h2>${volunteer.name}</h2>
        ${classLine}
        <p>${volunteer.description || ""}</p>
      </div>
    </div>

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

      const reportBtn = document.createElement("button");
      reportBtn.className = "report-button";
      reportBtn.textContent = "Report";
      reportBtn.addEventListener("click", () => openReportForm(c.id, card));
      card.appendChild(reportBtn);

      commentsList.appendChild(card);
    });
  }

  setupCommentForm();
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
  detailContent.innerHTML = "";
  currentVolunteerId = null;
}

backButton.addEventListener("click", showList);

// 10. Brancher les filtres
searchInput.addEventListener("input", applyFilters);
classFilter.addEventListener("change", applyFilters);
clearFiltersBtn.addEventListener("click", clearFilters);

// 11. Lancer au chargement
loadVolunteers();

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

// 13. Année dynamique dans le footer
document.getElementById("year").textContent = new Date().getFullYear();