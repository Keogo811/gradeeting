// security.js

function escapeHtml(text) {
  if (text === null || text === undefined) return "";
  const div = document.createElement("div");
  div.textContent = String(text);
  return div.innerHTML;
}

function escapeAttr(text) {
  if (text === null || text === undefined) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function safeUrl(url) {
  if (!url) return null;
  // N'autorise que http:// et https://
  if (!/^https?:\/\//i.test(url)) return null;
  return url;
}

// Nettoie et valide les pseudos réseaux sociaux
function cleanSocialHandle(handle) {
  if (!handle) return null;
  // Autorise lettres, chiffres, points, tirets et underscores
  if (!/^[A-Za-z0-9._-]{1,30}$/.test(handle)) return null;
  return encodeURIComponent(handle);
}