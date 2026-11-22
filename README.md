# Enterprise Internship Portal — Production-Ready Capstone

[![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=flat&logo=docker&logoColor=white)](https://www.docker.com/)
[![Render](https://img.shields.io/badge/Render-Cloud%20Deployment-46E3B7?style=flat&logo=render&logoColor=black)](https://render.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-Framework-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/SQLite-Persistent%20Store-003B57?style=flat&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![Vite](https://img.shields.io/badge/Vite-Frontend-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)

## 📌 Project Overview
The **Enterprise Internship Portal** is the capstone evolution of the EdVyro full-stack engineering curriculum. It represents a fully production-hardened web application designed to manage student internship postings, applications, and applicant reviews. The project features automated containerization via **Docker**, declarative cloud configuration (`render.yaml`), and strict quality/security checklists.

---

## 🎯 Problem Statement & Objectives
- **Bridging Prototypes to Production:** Transitioning academic full-stack prototypes into resilient, containerized, and deployable cloud software.
- **Objectives:**
  1. Build a decoupled frontend SPA with React / Vite and a secure backend service with Node.js/Express.
  2. Implement persistent data storage using SQLite with schema migration scripts.
  3. Containerize the unified web service into an optimized multi-stage Docker image.
  4. Enforce production standards verified through security and quality audits (`quality-checklist.md`, `security-checklist.md`).

---

## 🛠️ Technologies Used
- **Frontend:** React, Vite, Modern CSS
- **Backend:** Node.js, Express.js, CORS, Helmet
- **Database:** SQLite (`better-sqlite3` / `sql.js`)
- **DevOps & Infrastructure:** Docker, Dockerfile, `render.yaml` infrastructure-as-code

---

## 🚀 Key Features
- **Containerized Architecture:** Fully reproducible environments using Docker for seamless local execution and cloud parity.
- **Infrastructure as Code:** Declarative cloud deployment manifest via `render.yaml`.
- **Hardened Web Security:** Protective HTTP headers (Helmet), input sanitization, and structured error handling.
- **Persistent Data Store:** Relational SQLite database tracking companies, listings, and applicants.

---

## 📂 Project Folder Structure
```
enterprise-internship-portal/
├── Dockerfile             # Multi-stage production container configuration
├── render.yaml            # Render Cloud PaaS infrastructure manifest
├── quality-checklist.md   # Production readiness and quality assurance audit
├── security-checklist.md  # Threat mitigation and security compliance audit
├── backend/               # Express.js REST API
│   ├── server.js
│   └── package.json
├── frontend/              # React Vite SPA
│   ├── src/
│   ├── index.html
│   └── vite.config.js
└── docs/                  # Architectural documentation
```

---

## 💻 Installation & Execution Instructions

### Option 1: Run with Docker (Recommended)
```bash
git clone https://github.com/Dhanusheyap755/enterprise-internship-portal.git
cd enterprise-internship-portal
docker build -t internship-portal .
docker run -p 3000:3000 internship-portal
```

### Option 2: Local Node.js Development
```bash
# 1. Backend
cd backend && npm install && npm start

# 2. Frontend
cd ../frontend && npm install && npm run dev
```

---

## 🔮 Future Enhancements
- Kubernetes Helm chart for distributed cluster deployment.
- Role-based applicant interview scheduling integration with Google Calendar.
