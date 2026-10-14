// 1. Connexion Supabase
const SUPABASE_URL = "https://pwsdatsdgmvsaptowadl.supabase.co";
const SUPABASE_KEY = "sb_publishable_Ke5kkta-zcmT41TIcQTNiA_aQUoGx_t";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 2. Éléments du DOM
const loginScreen = document.getElementById("login-screen");
const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-button");
const loginMessage = document.getElementById("login-message");
const adminPanel = document.getElementById("admin-panel");
const adminEmail = document.getElementById("admin-email");
const logoutButton = document.getElementById("logout-button");

const pendingCommentsEl = document.getElementById("pending-comments");
const pendingVolunteersEl = document.getElementById("pending-volunteers");
const reportsListEl = document.getElementById("reports-list");

const statCommentsEl = document.getElementById("admin-stat-comments");
const statVolunteersEl = document.getElementById("admin-stat-volunteers");
const statReportsEl = document.getElementById("admin-stat-reports");
const statCardComments = document.getElementById("stat-card-comments");
const statCardVolunteers = document.getElementById("stat-card-volunteers");
const statCardReports = document.getElementById("stat-card-reports");

const editModal = document.getElementById("edit-modal");
const editModalBody = document.getElementById("edit-modal-body");
const editModalClose = document.getElementById("edit-modal-close");

const PLACEHOLDER = "https://placehold.co/200x200?text=No+Photo";

// 2.5 Normalisation du champ classe
function normalizeClass(input) {
  if (!input) return "";

  let s = input.trim().toUpperCase();
  s = s.replace(/\s+/g, " ");

  if (/^(TEACHER|PROF|PROFESSOR|PROFESSEUR|PROFS)$/i.test(s)) {
    return "Teacher";
  }

  const pgeMatch = s.match(/^PGE\s*-?\s*(\d+)\s*-?\s*([A-Z]{2,3})?$/);
  if (pgeMatch) {
    const year = pgeMatch[1];
    const lang = pgeMatch[2];
    return lang ? `PGE${year} ${lang}` : `PGE${year}`;
  }

  return s;
}

// 2.6 Utilitaires
function escapeHtml(text) {
  if (!text) return "";
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function escapeAttr(text) {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// 3. Vérifier la session au chargement
async function checkSession() {
  const { data } = await supabaseClient.auth.getSession();

  if (data.session) {
    showAdminPanel(data.session.user.email);
  } else {
    showLoginScreen();
  }
}

function showAdminPanel(email) {
  loginScreen.classList.add("hidden");
  adminPanel.classList.remove("hidden");
  adminEmail.textContent = email;
  loadAll();
  loadStats();
  setupTabs();
}

function showLoginScreen() {
  adminPanel.classList.add("hidden");
  loginScreen.classList.remove("hidden");
}

// 4. Login
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  loginMessage.textContent = "";
  loginMessage.className = "form-message";

  const email = loginForm.email.value.trim();
  const password = loginForm.password.value;

  loginButton.disabled = true;
  loginButton.textContent = "Signing in...";

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email: email,
    password: password,
  });

  loginButton.disabled = false;
  loginButton.textContent = "Sign in";

  if (error) {
    console.error("Erreur login :", error.message);
    loginMessage.textContent = "Invalid email or password.";
    loginMessage.classList.add("error");
    return;
  }

  loginForm.reset();
  showAdminPanel(data.user.email);
});

// 5. Logout
logoutButton.addEventListener("click", async () => {
  await supabaseClient.auth.signOut();
  showLoginScreen();
});

// 6. Tout charger
function loadAll() {
  loadPendingComments();
  loadPendingVolunteers();
  loadReports();
}

// ---------- COMMENTAIRES EN ATTENTE ----------
async function loadPendingComments() {
  pendingCommentsEl.innerHTML = '<p class="loading">Loading...</p>';

  const { data, error } = await supabaseClient
    .from("comments")
    .select("id, body, sentiment, explanation, created_at, volunteers(name)")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erreur chargement commentaires :", error.message);
    pendingCommentsEl.innerHTML = '<p class="empty-state">Error loading comments.</p>';
    return;
  }

  if (data.length === 0) {
    pendingCommentsEl.innerHTML = '<p class="empty-state">No pending comments.</p>';
    return;
  }

  pendingCommentsEl.innerHTML = "";
  data.forEach((c) => {
    const card = document.createElement("div");
    card.className = "admin-card";

    const volunteerName = c.volunteers ? c.volunteers.name : "Unknown";
    const tagClass = c.sentiment === "positive" ? "tag-positive" : "tag-negative";

    card.innerHTML = `
      <div class="admin-card-header">
        <div class="admin-card-title">About ${escapeHtml(volunteerName)}</div>
        <div class="admin-card-meta">${new Date(c.created_at).toLocaleString()}</div>
      </div>
      <div class="admin-card-body">
        <span class="tag ${tagClass}">${c.sentiment}</span>
        <p style="margin-top: 0.5rem;">${escapeHtml(c.body)}</p>
        ${c.explanation ? `<p style="margin-top:0.5rem;font-style:italic;color:#666;">Explanation: ${escapeHtml(c.explanation)}</p>` : ""}
      </div>
    `;

    const actions = document.createElement("div");
    actions.className = "admin-card-actions";

    const approveBtn = document.createElement("button");
    approveBtn.className = "btn-approve";
    approveBtn.textContent = "Approve";
    approveBtn.addEventListener("click", () => updateComment(c.id, "approved"));

    const rejectBtn = document.createElement("button");
    rejectBtn.className = "btn-reject";
    rejectBtn.textContent = "Reject";
    rejectBtn.addEventListener("click", () => updateComment(c.id, "rejected"));

    actions.appendChild(approveBtn);
    actions.appendChild(rejectBtn);
    card.appendChild(actions);

    pendingCommentsEl.appendChild(card);
  });
}

async function updateComment(commentId, newStatus) {
  const { error } = await supabaseClient
    .from("comments")
    .update({ status: newStatus })
    .eq("id", commentId);

  if (error) {
    console.error("Erreur mise à jour :", error.message);
    alert("Error updating comment. Please try again.");
    return;
  }

  loadPendingComments();
  loadStats();
}

// ---------- VOLONTAIRES EN ATTENTE ----------
async function loadPendingVolunteers() {
  pendingVolunteersEl.innerHTML = '<p class="loading">Loading...</p>';

  const { data, error } = await supabaseClient
    .from("volunteers")
    .select("id, name, class, description, photo_url, consent_given, consent_date, created_at, pronouns, instagram, snapchat, linkedin, contact_email")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erreur chargement volontaires :", error.message);
    pendingVolunteersEl.innerHTML = '<p class="empty-state">Error loading volunteers.</p>';
    return;
  }

  if (data.length === 0) {
    pendingVolunteersEl.innerHTML = '<p class="empty-state">No pending volunteers.</p>';
    return;
  }

  pendingVolunteersEl.innerHTML = "";
  data.forEach((v) => {
    const card = document.createElement("div");
    card.className = "admin-card";

    const photo = v.photo_url || PLACEHOLDER;

    card.innerHTML = `
      <div class="admin-card-header">
        <div style="display:flex;gap:1rem;align-items:center;">
          <img class="admin-card-image" src="${photo}" alt="${escapeHtml(v.name)}" onerror="this.src='${PLACEHOLDER}'">
          <div>
            <div class="admin-card-title">${escapeHtml(v.name)}${v.pronouns ? ` <span class="tag tag-pending">${escapeHtml(v.pronouns)}</span>` : ""}</div>
            <div class="admin-card-meta">${escapeHtml(normalizeClass(v.class) || "No class")}</div>
            <div class="admin-card-meta">Consent: ${v.consent_given ? "Yes" : "No"} ${v.consent_date ? `(${v.consent_date})` : ""}</div>
            <div class="admin-card-meta">
              ${v.instagram ? `IG: ${escapeHtml(v.instagram)} · ` : ""}
              ${v.snapchat ? `Snap: ${escapeHtml(v.snapchat)} · ` : ""}
              ${v.linkedin ? `LI ✓ · ` : ""}
              ${v.contact_email ? `Email: ${escapeHtml(v.contact_email)}` : ""}
            </div>
          </div>
        </div>
        <div class="admin-card-meta">${new Date(v.created_at).toLocaleString()}</div>
      </div>
      <div class="admin-card-body">
        <p>${escapeHtml(v.description || "")}</p>
      </div>
    `;

    const actions = document.createElement("div");
    actions.className = "admin-card-actions";

    const approveBtn = document.createElement("button");
    approveBtn.className = "btn-approve";
    approveBtn.textContent = "Approve";
    approveBtn.addEventListener("click", () => updateVolunteer(v.id, "approved"));

    const rejectBtn = document.createElement("button");
    rejectBtn.className = "btn-reject";
    rejectBtn.textContent = "Reject";
    rejectBtn.addEventListener("click", () => updateVolunteer(v.id, "rejected"));

    actions.appendChild(approveBtn);
    actions.appendChild(rejectBtn);
    card.appendChild(actions);

    pendingVolunteersEl.appendChild(card);
  });
}

async function updateVolunteer(volunteerId, newStatus) {
  const { error } = await supabaseClient
    .from("volunteers")
    .update({ status: newStatus })
    .eq("id", volunteerId);

  if (error) {
    console.error("Erreur mise à jour :", error.message);
    alert("Error updating volunteer. Please try again.");
    return;
  }

  loadPendingVolunteers();
  loadStats();
}

// ---------- SIGNALEMENTS ----------
async function loadReports() {
  reportsListEl.innerHTML = '<p class="loading">Loading...</p>';

  const { data, error } = await supabaseClient
    .from("reports")
    .select("id, reason, status, created_at, comments(body, sentiment, volunteers(name))")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erreur chargement reports :", error.message);
    reportsListEl.innerHTML = '<p class="empty-state">Error loading reports.</p>';
    return;
  }

  if (data.length === 0) {
    reportsListEl.innerHTML = '<p class="empty-state">No pending reports.</p>';
    return;
  }

  reportsListEl.innerHTML = "";
  data.forEach((r) => {
    const card = document.createElement("div");
    card.className = "admin-card";

    const comment = r.comments;
    const volunteerName = comment && comment.volunteers ? comment.volunteers.name : "Unknown";
    const commentBody = comment ? comment.body : "(comment deleted)";
    const commentSentiment = comment ? comment.sentiment : "unknown";

    card.innerHTML = `
      <div class="admin-card-header">
        <div class="admin-card-title">Report on comment about ${escapeHtml(volunteerName)}</div>
        <div class="admin-card-meta">${new Date(r.created_at).toLocaleString()}</div>
      </div>
      <div class="admin-card-body">
        <p style="margin-bottom:0.4rem;"><strong>Reported comment:</strong></p>
        <p style="font-style:italic;color:#666;">"${escapeHtml(commentBody)}" (${commentSentiment})</p>
        <p style="margin-top:0.6rem;"><strong>Reason:</strong> ${escapeHtml(r.reason)}</p>
      </div>
    `;

    const actions = document.createElement("div");
    actions.className = "admin-card-actions";

    const reviewedBtn = document.createElement("button");
    reviewedBtn.className = "btn-approve";
    reviewedBtn.textContent = "Mark as reviewed";
    reviewedBtn.addEventListener("click", () => updateReport(r.id, "reviewed"));

    const dismissBtn = document.createElement("button");
    dismissBtn.className = "btn-neutral";
    dismissBtn.textContent = "Dismiss";
    dismissBtn.addEventListener("click", () => updateReport(r.id, "dismissed"));

    actions.appendChild(reviewedBtn);
    actions.appendChild(dismissBtn);
    card.appendChild(actions);

    reportsListEl.appendChild(card);
  });
}

async function updateReport(reportId, newStatus) {
  const { error } = await supabaseClient
    .from("reports")
    .update({ status: newStatus })
    .eq("id", reportId);

  if (error) {
    console.error("Erreur mise à jour report :", error.message);
    alert("Error updating report. Please try again.");
    return;
  }

  loadReports();
  loadStats();
}

// ---------- Compteurs dashboard ----------
async function loadStats() {
  const [commentsRes, volunteersRes, reportsRes] = await Promise.all([
    supabaseClient
      .from("comments")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
    supabaseClient
      .from("volunteers")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
    supabaseClient
      .from("reports")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
  ]);

  updateStatCard(statCommentsEl, statCardComments, commentsRes.count ?? 0);
  updateStatCard(statVolunteersEl, statCardVolunteers, volunteersRes.count ?? 0);
  updateStatCard(statReportsEl, statCardReports, reportsRes.count ?? 0);
}

function updateStatCard(numberEl, cardEl, count) {
  numberEl.textContent = count;
  if (count > 0) {
    cardEl.classList.add("has-items");
  } else {
    cardEl.classList.remove("has-items");
  }
}

// ---------- Navigation par onglets ----------
function setupTabs() {
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabPanels = document.querySelectorAll(".tab-panel");

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.tab;

      tabButtons.forEach((b) => b.classList.toggle("active", b === btn));
      tabPanels.forEach((p) => p.classList.toggle("active", p.dataset.panel === target));

      // Charger les données de l'onglet au premier clic
      if (target === "volunteers" && !btn.dataset.loaded) {
        loadAllVolunteers();
        btn.dataset.loaded = "1";
      }
      if (target === "comments" && !btn.dataset.loaded) {
        loadAllComments();
        btn.dataset.loaded = "1";
      }
      if (target === "reports" && !btn.dataset.loaded) {
        loadAllReports();
        btn.dataset.loaded = "1";
      }
    });
  });

  // Compteurs cliquables : basculer sur l'onglet Pending
  document.querySelectorAll(".stat-card").forEach((card) => {
    card.addEventListener("click", () => {
      const target = card.dataset.tab;
      const btn = document.querySelector(`.tab-button[data-tab="${target}"]`);
      if (btn) btn.click();
    });
    card.style.cursor = "pointer";
  });
}

// ---------- Onglet Volunteers : tous les volontaires ----------
let allVolunteersCache = [];

async function loadAllVolunteers() {
  const container = document.getElementById("all-volunteers");
  container.innerHTML = '<p class="loading">Loading...</p>';

  const { data, error } = await supabaseClient
    .from("volunteers")
    .select("id, name, class, description, photo_url, status, pronouns, instagram, snapchat, linkedin, contact_email, consent_given, consent_date, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erreur chargement volontaires :", error.message);
    container.innerHTML = '<p class="empty-state">Error loading volunteers.</p>';
    return;
  }

  allVolunteersCache = data;
  renderAllVolunteers();
}

function renderAllVolunteers() {
  const container = document.getElementById("all-volunteers");
  const search = document.getElementById("volunteers-search").value.trim().toLowerCase();
  const statusFilter = document.getElementById("volunteers-status-filter").value;

  const filtered = allVolunteersCache.filter((v) => {
    const matchName = v.name.toLowerCase().includes(search);
    const matchStatus = !statusFilter || v.status === statusFilter;
    return matchName && matchStatus;
  });

  container.innerHTML = "";

  if (filtered.length === 0) {
    container.innerHTML = '<p class="empty-state">No volunteers match your filters.</p>';
    return;
  }

  filtered.forEach((v) => {
    const card = document.createElement("div");
    card.className = "admin-card";

    const photo = v.photo_url || PLACEHOLDER;
    const statusTag = `<span class="tag tag-${v.status === "approved" ? "positive" : v.status === "rejected" ? "negative" : "pending"}">${v.status}</span>`;

    card.innerHTML = `
      <div class="admin-card-header">
        <div style="display:flex;gap:1rem;align-items:center;">
          <img class="admin-card-image" src="${photo}" alt="${escapeHtml(v.name)}" onerror="this.src='${PLACEHOLDER}'">
          <div>
            <div class="admin-card-title">${escapeHtml(v.name)} ${statusTag}</div>
            <div class="admin-card-meta">${escapeHtml(normalizeClass(v.class) || "No class")}</div>
            <div class="admin-card-meta">Added: ${new Date(v.created_at).toLocaleDateString()}</div>
          </div>
        </div>
      </div>
      <div class="admin-card-body">
        <p>${escapeHtml(v.description || "")}</p>
      </div>
    `;

    const actions = document.createElement("div");
    actions.className = "admin-card-actions";

    const editBtn = document.createElement("button");
    editBtn.className = "btn-neutral";
    editBtn.textContent = "✏️ Edit";
    editBtn.addEventListener("click", () => openEditVolunteerModal(v));

    actions.appendChild(editBtn);
    card.appendChild(actions);

    container.appendChild(card);
  });
}

// ---------- Modal d'édition d'un volontaire ----------
editModalClose.addEventListener("click", closeEditModal);
editModal.addEventListener("click", (e) => {
  if (e.target === editModal) closeEditModal();
});

function closeEditModal() {
  editModal.classList.add("hidden");
  editModalBody.innerHTML = "";
}

function openEditVolunteerModal(volunteer) {
  const photo = volunteer.photo_url || PLACEHOLDER;

  editModalBody.innerHTML = `
    <h2>Edit volunteer</h2>

    <label>Name</label>
    <input type="text" id="edit-name" maxlength="80" value="${escapeAttr(volunteer.name)}">

    <label>Class</label>
    <input type="text" id="edit-class" maxlength="40" value="${escapeAttr(volunteer.class || "")}">

    <label>Pronouns</label>
    <select id="edit-pronouns">
      <option value="">—</option>
      <option value="he"${volunteer.pronouns === "he" ? " selected" : ""}>he</option>
      <option value="she"${volunteer.pronouns === "she" ? " selected" : ""}>she</option>
      <option value="?"${volunteer.pronouns === "?" ? " selected" : ""}>?</option>
    </select>

    <label>Description</label>
    <textarea id="edit-description" maxlength="500">${escapeHtml(volunteer.description || "")}</textarea>

    <label>Photo URL</label>
    <input type="text" id="edit-photo-url" value="${escapeAttr(volunteer.photo_url || "")}">
    <img class="preview" id="edit-photo-preview" src="${photo}" alt="preview" onerror="this.src='${PLACEHOLDER}'">

    <label>Instagram</label>
    <input type="text" id="edit-instagram" maxlength="50" value="${escapeAttr(volunteer.instagram || "")}">

    <label>Snapchat</label>
    <input type="text" id="edit-snapchat" maxlength="50" value="${escapeAttr(volunteer.snapchat || "")}">

    <label>LinkedIn URL</label>
    <input type="url" id="edit-linkedin" maxlength="200" value="${escapeAttr(volunteer.linkedin || "")}">

    <label>Contact email</label>
    <input type="email" id="edit-contact-email" maxlength="100" value="${escapeAttr(volunteer.contact_email || "")}">

    <label>Status</label>
    <select id="edit-status">
      <option value="approved"${volunteer.status === "approved" ? " selected" : ""}>Approved</option>
      <option value="pending"${volunteer.status === "pending" ? " selected" : ""}>Pending</option>
      <option value="rejected"${volunteer.status === "rejected" ? " selected" : ""}>Rejected</option>
    </select>

    <div class="modal-actions">
      <button class="btn-save" id="edit-save">💾 Save</button>
      <button class="btn-cancel" id="edit-cancel">Cancel</button>
    </div>
    <div class="modal-message" id="edit-message"></div>
  `;

  editModal.classList.remove("hidden");

  document.getElementById("edit-photo-url").addEventListener("input", (e) => {
    const preview = document.getElementById("edit-photo-preview");
    preview.src = e.target.value || PLACEHOLDER;
  });

  document.getElementById("edit-cancel").addEventListener("click", closeEditModal);
  document.getElementById("edit-save").addEventListener("click", () => saveVolunteer(volunteer.id));
}

async function saveVolunteer(volunteerId) {
  const message = document.getElementById("edit-message");
  const saveBtn = document.getElementById("edit-save");

  message.textContent = "";
  message.className = "modal-message";

  const updates = {
    name: document.getElementById("edit-name").value.trim(),
    class: normalizeClass(document.getElementById("edit-class").value),
    pronouns: document.getElementById("edit-pronouns").value || null,
    description: document.getElementById("edit-description").value.trim(),
    photo_url: document.getElementById("edit-photo-url").value.trim() || null,
    instagram: document.getElementById("edit-instagram").value.trim() || null,
    snapchat: document.getElementById("edit-snapchat").value.trim() || null,
    linkedin: document.getElementById("edit-linkedin").value.trim() || null,
    contact_email: document.getElementById("edit-contact-email").value.trim() || null,
    status: document.getElementById("edit-status").value,
  };

  if (!updates.name) {
    message.textContent = "Name is required.";
    message.classList.add("error");
    return;
  }

  saveBtn.disabled = true;
  saveBtn.textContent = "Saving...";

  const { error } = await supabaseClient
    .from("volunteers")
    .update(updates)
    .eq("id", volunteerId);

  saveBtn.disabled = false;
  saveBtn.textContent = "💾 Save";

  if (error) {
    console.error("Erreur sauvegarde :", error.message);
    message.textContent = "Error saving. Please try again.";
    message.classList.add("error");
    return;
  }

  message.textContent = "✅ Saved!";
  message.classList.add("success");

  setTimeout(() => {
    closeEditModal();
    loadAllVolunteers();
    loadPendingVolunteers();
    loadStats();
  }, 800);
}

// ---------- Onglet Comments (placeholder) ----------
async function loadAllComments() {
  document.getElementById("all-comments").innerHTML =
    '<p class="empty-state">Coming soon...</p>';
}

// ---------- Onglet Reports (placeholder) ----------
async function loadAllReports() {
  document.getElementById("all-reports").innerHTML =
    '<p class="empty-state">Coming soon...</p>';
}

// ---------- Brancher les filtres Volunteers ----------
document.getElementById("volunteers-search").addEventListener("input", renderAllVolunteers);
document.getElementById("volunteers-status-filter").addEventListener("change", renderAllVolunteers);

// 7. Lancer au chargement
checkSession();