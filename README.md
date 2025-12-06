# Ultimate React Focus Timer ⏱️

![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0+-38B2AC?style=for-the-badge&logo=tailwind-css)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-Animation-0055FF?style=for-the-badge&logo=framer)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

A highly interactive, aesthetically crafted productivity application featuring multiple specialized themes. Built with **React** and **Framer Motion**, this project demonstrates complex SVG animations, state management, and persistent user preferences.

---

## 📸 Theme Showcase

> **Note:** This application features three distinct UI paradigms to suit different user personas.

### 1. Developer Theme (The "Caffeine" Mode)
*Target Audience: Programmers & Night Owls*
* **Visuals:** Dynamic SVG coffee cup that depletes as time passes.
* **Features:** "Console" style state logging, hex-code color pickers, and steam/liquid physics animations.
* **Vibe:** Dark mode, monospaced fonts, IDE aesthetic.

### 2. Classic Theme
*Target Audience: Minimalists*
* **Visuals:** Clean lines, high contrast, and traditional digital clock layouts.
* **Features:** Distraction-free interface focusing purely on the countdown.

### 3. Modern Theme
*Target Audience: Designers & Creatives*
* **Visuals:** Glassmorphism, soft gradients, and fluid UI transitions.
* **Features:** Floating controls and ambient background effects.

---

## ✨ Key Features

* **⚡ Multi-Modal Functionality:**
    * **Pomodoro:** Customizable Focus/Short Break/Long Break cycles.
    * **Timer:** Standard countdown for specific tasks (e.g., brewing coffee).
    * **Stopwatch:** Track elapsed time.
    * **Clock:** Live digital clock display.
* **💾 Smart Persistence:**
    * Uses `localStorage` to remember the user's preferred theme across sessions.
    * State retention logic to prevent accidental resets.
* **🎨 Advanced UI/UX:**
    * **SVG Animations:** Complex paths and masks used for liquid fill effects.
    * **Responsive Design:** Fully fluid layouts using Tailwind CSS.
    * **Micro-interactions:** Buttons and toggles feature satisfying Framer Motion spring physics.

---

## 🛠️ Tech Stack

* **Frontend Framework:** [React](https://react.dev/) (Vite)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Animation:** [Framer Motion](https://www.framer.com/motion/)
* **Icons:** [Lucide React](https://lucide.dev/)
* **State Management:** React Hooks (`useState`, `useEffect`)

---

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites
* Node.js (v16.0.0 or higher)
* npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/your-username/ultimate-focus-timer.git](https://github.com/your-username/ultimate-focus-timer.git)
    cd ultimate-focus-timer
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Start the development server**
    ```bash
    npm run dev
    ```

4.  **Open in browser**
    Visit `http://localhost:5173` (or the port shown in your terminal).

---

## 📂 Project Structure

```text
src/
├── components/
│   ├── UltimateTimerTemplate1.jsx  # Classic Theme
│   ├── UltimateTimerTemplate2.jsx  # Developer Theme (SVG Logic)
│   └── UltimateTimerTemplate3.jsx  # Modern Theme
├── App.jsx                         # Main Layout & Theme Switcher Logic
├── main.jsx                        # Entry Point
└── index.css                       # Tailwind Directives
💡 Code Highlight: Theme Persistence
The application uses a robust effect hook to manage theme state, ensuring the user's preference is respected immediately upon load to prevent "flash of wrong theme" (FOWT).

JavaScript

// src/App.jsx

const THEME_STORAGE_KEY = 'ultimate_timer_theme';

// Load theme on mount
useEffect(() => {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    // Validation check to ensure valid theme string
    if (['classic', 'developer', 'modern'].includes(saved)) {
      setTheme(saved);
    }
  } catch (err) {
    console.error('Error reading theme', err);
  }
}, []);
🤝 Contributing
Contributions are welcome! Please follow these steps:

Fork the project.

Create your feature branch (git checkout -b feature/AmazingFeature).

Commit your changes (git commit -m 'Add some AmazingFeature').

Push to the branch (git push origin feature/AmazingFeature).

Open a Pull Request.

📄 License
Distributed under the MIT License. See LICENSE for more information.

<p align="center"> Built with ❤️ by [Your Name] </p>
