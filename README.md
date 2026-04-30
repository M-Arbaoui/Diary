# 📔 My Diary

A minimalist, premium personal diary app — built with **React + Tailwind** on the frontend, **Node.js + Express + MongoDB** on the backend, and fully **containerized with Docker**.

> A calm place to write. Soft paper aesthetics, mood tags, a timeline of you.

---

## ✨ Features

- 📝 Create, edit, delete diary entries
- 🔍 Search across all entries
- 🌿 Mood tags (happy, calm, grateful, thoughtful, sad, excited)
- 📅 Timeline-style dashboard grouped by month
- 🌗 Light & dark mode (paper / dusk)
- ⚡ Auto-save simulation in the editor
- 💾 Export your journal as JSON
- 📱 Fully responsive

---

## 🧱 Project Structure

```
my-diary/
├── frontend/              # Dockerfile + nginx config (React app source is at repo root)
│   ├── Dockerfile
│   └── nginx.conf
├── backend/               # Express + MongoDB REST API
│   ├── src/
│   │   ├── server.js
│   │   ├── models/Entry.js
│   │   └── routes/entries.js
│   ├── package.json
│   ├── .env.example
│   └── Dockerfile
├── src/                   # React (Vite) frontend source
├── docker-compose.yml
└── README.md
```

---

## 🚀 Run with Docker (recommended)

```bash
# 1. Clone the repo
git clone <your-repo-url> my-diary && cd my-diary

# 2. Spin up the whole stack
docker compose up --build
```

Services:

| Service   | URL                          |
|-----------|------------------------------|
| Frontend  | http://localhost:8080        |
| Backend   | http://localhost:5000/api    |
| MongoDB   | mongodb://localhost:27017    |

To stop:

```bash
docker compose down            # keep data
docker compose down -v         # also wipe MongoDB volume
```

---

## 🛠 Local development (without Docker)

**Frontend**

```bash
npm install
npm run dev          # http://localhost:8080
```

**Backend**

```bash
cd backend
cp .env.example .env
npm install
npm run dev          # http://localhost:5000
```

You'll need a local MongoDB running on `mongodb://localhost:27017`.

---

## 🔌 API Reference

Base URL: `/api`

| Method | Endpoint              | Description                  |
|--------|-----------------------|------------------------------|
| GET    | `/health`             | Health check                 |
| GET    | `/entries`            | List entries (`?search=&mood=`) |
| GET    | `/entries/:id`        | Get one entry                |
| POST   | `/entries`            | Create entry                 |
| PUT    | `/entries/:id`        | Update entry                 |
| DELETE | `/entries/:id`        | Delete entry                 |

**Entry shape**

```json
{
  "_id": "…",
  "title": "Morning light",
  "content": "Woke up earlier than usual…",
  "mood": "calm",
  "createdAt": "2026-04-30T08:12:00.000Z",
  "updatedAt": "2026-04-30T08:12:00.000Z"
}
```

---

## 🎨 Design

| Token              | Value     |
|--------------------|-----------|
| Background         | `#F7F5F2` |
| Card               | `#FFFFFF` |
| Sage accent        | `#A8BFA3` |
| Beige accent       | `#C9B8A6` |
| Border             | `#E8E5E0` |
| Ink                | `#2B2B2B` |
| Muted ink          | `#6B6B6B` |

Typography: **Fraunces** (serif titles) + **Inter** (sans body).

---

## 📦 Tech Stack

- **Frontend:** React 18, Vite, TailwindCSS, React Router, shadcn/ui, lucide-react
- **Backend:** Node.js, Express, Mongoose
- **Database:** MongoDB 7
- **Infra:** Docker, Docker Compose, nginx

---

Made with quiet care. ✍️
