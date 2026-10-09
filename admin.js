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

// 3. Vérifier la session au chargement
async function checkSession() {
  const { data } = await supabaseClient.auth.getSession();

  if (data.session) {
    showAdminPanel(data.session.user.email);
  } else {
    showLoginScreen();
  }
}

// 4. Afficher le panel admin
function showAdminPanel(email) {
  loginScreen.classList.add("hidden");
  adminPanel.classList.remove("hidden");
  adminEmail.textContent = email;
  // Les listes seront chargées dans le Morceau 3
}

// 5. Afficher l'écran de login
function showLoginScreen() {
  adminPanel.classList.add("hidden");
  loginScreen.classList.remove("hidden");
}

// 6. Login
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

// 7. Logout
logoutButton.addEventListener("click", async () => {
  await supabaseClient.auth.signOut();
  showLoginScreen();
});

// 8. Lancer au chargement
checkSession();