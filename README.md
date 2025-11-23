# 🌐 CORS Visualized

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-purple?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-cyan?logo=tailwindcss)](https://tailwindcss.com/)

> **Master Cross-Origin Resource Sharing once and for all.**
>
> 🚀 **Live Demo:** [https://cors-visualized.lvrpiz.com](https://cors-visualized.lvrpiz.com)

**CORS Visualized** is the ultimate interactive educational tool for developers, students, and security enthusiasts. Stop guessing why your requests are failing and start visualizing the invisible handshake between your browser and the server.

---

<div align="center">
  <video src="https://github.com/user-attachments/assets/f607babb-3daf-4bc5-81ab-3d2c9f2fa872" width="100%" controls autoplay loop muted></video>
</div>

---

## 🧐 What is CORS?

**Cross-Origin Resource Sharing (CORS)** is a browser security mechanism that restricts cross-origin HTTP requests. It's the reason why your frontend at `localhost:3000` can't just talk to your backend at `api.example.com` without permission.

This tool turns abstract headers and dry documentation into a **visual, interactive playground**.

## ✨ Key Features

### 🎮 Interactive Simulation
Design your own Client vs. Server scenarios. Tweak `Origin`, `Methods`, `Headers`, and `Credentials` in real-time and watch the browser's decision logic unfold.

### 🏆 Challenge Mode (Gamified Learning)
Put your skills to the test with **5 levels of increasing difficulty**:
1.  **The Basic Block:** Fix simple Origin mismatches.
2.  **Unknown Method:** Handle Preflight requests for DELETE/PUT.
3.  **Cross-Credentials:** Master the complex rules of `Access-Control-Allow-Credentials`.
4.  **Custom Headers:** Learn to whitelist API Keys (`X-Api-Key`).
5.  **Expert Level:** Expose hidden headers (`Access-Control-Expose-Headers`) to the frontend.

### 🛡️ Security Audit
Get instant feedback on your configuration. The tool analyzes your setup for common vulnerabilities:
*   Wildcard (`*`) usage with Credentials.
*   Excessive exposure of sensitive headers.
*   Insecure `Max-Age` caching configurations.

### 💻 Multi-Language Code Generator
Don't just learn it—implement it. Generate production-ready CORS configurations for your stack:
*   **Node.js** (Express)
*   **Python** (FastAPI)
*   **Java** (Spring Boot)
*   **Go** (Gin)
*   **C#** (ASP.NET Core)
*   **Infrastructure:** Nginx, Apache, AWS S3, Vercel, Next.js.

## 🚀 Getting Started

Clone the repository and run it locally to experiment without internet access.

```bash
# Clone the repo
git clone https://github.com/alvarogarciapiz/cors-visualized.git

# Enter the directory
cd cors-visualized

# Install dependencies
npm install

# Start the development server
npm run dev
```

## 🛠️ Tech Stack

Built with love and modern web standards:
*   **React 18** - UI Library
*   **Vite** - Blazing fast build tool
*   **Tailwind CSS** - Utility-first styling
*   **Framer Motion** - Smooth animations
*   **Lucide React** - Beautiful icons

## 🤝 Contributing

Contributions are welcome! Whether it's a new challenge level, a translation, or a bug fix. Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Credits & Resources

*   Created by **[@lvrpiz](https://github.com/alvarogarciapiz)**.
*   Based on an article from **[The Bulletin Newsletter](https://www.bulletin.lvrpiz.com)**.
*   Check out my website: [lvrpiz.com](https://lvrpiz.com).

---

### 🔍 Keywords for Discovery
CORS, Cross-Origin Resource Sharing, Web Security, Developer Tools, Educational, React, Interactive Simulation, CORS Policy, Frontend Development, Backend Configuration, Express, FastAPI, Spring Boot, Nginx, Apache, AWS S3, Vercel, Next.js, Web Development, HTTP Headers, Preflight Request, SOP, Same-Origin Policy.
