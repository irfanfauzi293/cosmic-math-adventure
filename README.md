# 🚀 Cosmic Math Adventure

**Cosmic Math Adventure** is an interactive, space-themed educational web application specifically designed to teach basic math concepts to 6-year-old children (1st grade). In this game, children take on the role of "Captain Astronaut", exploring various planets in the galaxy and solving fun math missions at each stop.

This application is built with a **"Plushy Sci-Fi"** design aesthetic, combining *glassmorphism*, *neon glow* elements, and a kid-friendly, tactile interface.

---

## ✨ Key Features

- **Journey Map:** A progressive exploration map featuring 4 interactive planets. Each new planet unlocks automatically after successfully completing the mission on the previous one.
- **Fun Math Missions:**
  - 🔢 **Mission 1: Counting Colony** (Learn to count objects)
  - ➕ **Mission 2: Addition Asteroid** (Add two groups of objects together)
  - ➖ **Mission 3: Subtraction Star** (Calculate remaining objects)
  - ⚖️ **Mission 4: Comparison Comet** (Compare and find the largest amount)
- **Gamification & Rewards:** Earn star scores (⭐), trigger celebration animations (confetti), and rank up (from *New Explorer* to *Galaxy Captain*)!
- **Secure Authentication:** Easy and secure email/password login to save and persist each child's progress across sessions.

---

## 🛠️ Tech Stack

This application is built using a modern technology ecosystem:

- **Framework:** [Nuxt 3](https://nuxt.com/) (Vue 3 + SSR)
- **Styling:** [Tailwind CSS v3](https://tailwindcss.com/)
- **BaaS (Backend as a Service):** [Supabase](https://supabase.com/) (PostgreSQL, Auth, Storage)
- **Typography & Icons:** Google Fonts (Quicksand) & Material Symbols Outlined
- **Audio Engine:** Web Audio API (for smooth, gapless background music playback)

---

## ⚙️ Getting Started (Setup & Installation)

Ensure you have **Node.js** (v18+) installed on your machine.

### 1. Clone the Repository
```bash
git clone <repository-url>
cd cosmic-math-adventure
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables Configuration
Create a `.env` file in the root of your project and add your Supabase keys:
```env
SUPABASE_URL=https://[your-project-id].supabase.co
SUPABASE_KEY=[your-anon-public-key]
```

### 4. Database Setup
Make sure to execute the SQL migrations located in the `supabase/migrations/` folder into your Supabase project's SQL Editor. This will set up the required tables (`profiles`, `mission_progress`, and `game_sessions`), as well as Row Level Security (RLS) policies and database triggers.

### 5. Run the Development Server
```bash
npm run dev
```

The application will be accessible at `http://localhost:3000`.

---

## 📦 Build for Production

To build the application for production:

```bash
npm run build
```

To locally preview the production build:

```bash
npm run preview
```

## 📄 License
This project was created for educational purposes.
