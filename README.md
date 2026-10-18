# 🌸 Gradeeting

**Gradeeting** is a free, voluntary web platform built by and for Aivancity students. It helps first-year students and teachers discover each other, break the ice, and build a warmer campus community through anonymous, moderated feedback.

> *✨ Discover the stars of Aivancity. ✨*

## 🚀 Live Demo
Visit the platform: **[hidden](hidden)** *(Contact Keogo to have the link)*

---

## 📖 The Concept

Arriving at a new school can be intimidating. Gradeeting solves this by allowing students and teachers to volunteer their profiles (photo, class, description). Visitors can leave anonymous, constructive comments to help others know who they are before the first conversation.

### Core Principles
*   **100% Voluntary:** Nobody appears without explicit consent.
*   **Anonymous & Moderated:** Comments are anonymous but reviewed by an admin. Negative comments must include a constructive explanation.
*   **No Login Required:** Visitors can browse and comment instantly.
*   **Kindness First:** The platform is designed to build people up, not tear them down.

---

## ✨ Features

### For Visitors
*   Browse and search volunteer profiles by name or class.
*   Leave anonymous, moderated comments (Positive / Negative with explanation).
*   React to comments (👍 / 👎) and report inappropriate behavior.
*   **Dark Mode** and **Glassmorphism** aesthetic.
*   **Star of the Day:** A daily featured volunteer with a joke of the day.

### For Volunteers
*   **Passwordless Login:** Secure access via unique magic links (Tokens) sent by the admin.
*   **Volunteer Hub:** A private dashboard to edit profiles (description, social links, pronouns).
*   **Direct Replies:** Reply instantly and publicly to comments received, without moderation delays.

### For Admins
*   **Complete CRUD:** Edit, delete, or manage volunteers, comments, and reports.
*   **Dashboard Counters:** Real-time overview of pending items.
*   **Export to CSV:** Download volunteer data for external use.
*   **Public Stats Page:** Interactive charts (Chart.js) showing platform growth and sentiment.

### 🎮 Mini-Games (Take a Break)
*   **Swipe & Meet:** A Tinder-style card game to discover volunteers. Features "Blind Mode" and synthesized audio effects.
*   **Guess Who?:** A detective game where you eliminate suspects based on class and name clues.
*   **Grow a Flower & Flower Memory:** Relaxing garden-themed mini-games.

---

## 🛠️ Tech Stack

This project was built with **zero budget**, prioritizing simplicity, security, and maintainability.

*   **Frontend:** Vanilla HTML5, CSS3, JavaScript (No frameworks, no build step).
*   **Backend / Database:** [Supabase](https://supabase.com/) (PostgreSQL, Row Level Security, Storage).
*   **Hosting:** [Netlify](https://www.netlify.com/) (Continuous deployment from GitHub).
*   **Design:** Google Fonts (Fredoka & Nunito), custom CSS variables.
*   **Libraries:** Chart.js (Stats), Supabase JS Client.
*   **Audio:** Web Audio API (Synthesized game sounds), HTML5 Audio (Background music).

---

## 🔒 Security & Architecture

*   **Row Level Security (RLS):** Enabled on every database table. Anonymous users can only read approved content and insert pending content. Admin access is strictly controlled.
*   **Token-Based Auth:** Volunteers do not use passwords. They receive a unique, secure UUID link to access their dashboard, preventing brute-force attacks and email spam.
*   **Input Sanitization:** All user-generated content is escaped before being rendered in the DOM to prevent XSS attacks.

---

## 🚀 How to Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/Keogo811/gradeeting.git

2. Open the project folder in VS Code.

3. Launch the index.html file using the Live Server extension.

4. Note: You will need to configure your own Supabase URL and Anon Key in app.js, admin.js, and volunteer.html if you are using your own database.

## 👨‍💻 Author
Keogo — Founder & Developer
Aivancity Student

## 📸 Screenshots (they are coming in next version because lasy, project already deployed still)

| Homepage | Volunteer Hub |
| :---: | :---: |
| ![Homepage](screenshots/homepage.png) | ![Volunteer Hub](screenshots/volunteer-hub.png) |
| *Discover the Aivancity community with Glassmorphism UI.* | *The private dashboard where volunteers manage their profile and replies.* |

| Admin Dashboard | Mini-Games |
| :---: | :---: |
| ![Admin](screenshots/admin-panel.png) | ![Swipe Game](screenshots/swipe-game.png) |
| *Complete CRUD interface with statistics and moderation.* | *Swipe & Meet: A fun, Tinder-style way to discover volunteers.* |
