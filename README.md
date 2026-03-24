# Daily — Your Gentle Diary 📖

A full-stack journaling web app built with:
- **Frontend**: React + Vite + Tailwind CSS + React Router
- **Backend**: Node.js + Express + LowDB (file-based JSON DB)
- **Auth**: JWT (bcrypt password hashing)

---

## Project Structure

```
daily-app/
├── frontend/               # React + Tailwind frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   ├── calendar/   # CalendarPage.jsx
│   │   │   ├── layout/     # Sidebar.jsx, AppLayout.jsx
│   │   │   ├── profile/    # ProfilePage.jsx
│   │   │   ├── today/      # MoodSelector, ActivityList, EditActivityModal
│   │   │   └── ui/         # Modal, Toast, ChipGroup
│   │   ├── context/        # AuthContext, JournalContext
│   │   ├── hooks/          # useToast
│   │   ├── pages/          # LandingPage, AuthPage, TodayPage
│   │   └── utils/          # api.js (axios), constants.js
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── backend/                # Express REST API
    ├── controllers/        # authController, entriesController, activitiesController
    ├── db/                 # database.js (LowDB), database.json (auto-created)
    ├── middleware/         # auth.js (JWT)
    ├── routes/             # auth.js, entries.js, activities.js
    └── server.js
```

---

## Getting Started

### 1. Install Backend
```bash
cd backend
npm install
npm run dev     # runs on http://localhost:3001
```

### 2. Install Frontend
```bash
cd frontend
npm install
npm run dev     # runs on http://localhost:5173
```

### 3. Open in browser
Go to **http://localhost:5173**

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | /api/auth/signup | Register a new user |
| POST | /api/auth/login  | Login, returns JWT |
| GET  | /api/auth/me     | Get current user |
| GET  | /api/entries     | Get all entries (auth) |
| GET  | /api/entries/:date | Get entry by date |
| POST | /api/entries     | Create/update entry |
| DELETE | /api/entries/:date | Delete entry |
| GET  | /api/activities/:date | Get activities for date |
| POST | /api/activities  | Create activity |
| PUT  | /api/activities/:id | Update activity |
| DELETE | /api/activities/:id | Delete activity |
| PUT  | /api/activities/reorder | Reorder activities |

---

## Features

- **Journal entries** with rich textarea (auto line-texture)
- **Mood tracking** with 5 moods (Lucide icons, no emoji)
- **Activity timeline** with categories (Study/Exercise/Relax) and time periods
- **Drag & drop** reordering of activities
- **Calendar view** with mood indicators per day
- **Profile** with stats, streak counter, 7-day mood chart
- **Guest mode** (localStorage) or full auth (JWT + LowDB)
- **Future date protection** — can't write entries for the future
- **Responsive** — mobile-friendly sidebar collapses to icons

---

## Rubric Coverage

| Criterion | Implementation |
|-----------|---------------|
| Functionality (20) | Full CRUD via REST API, routing with React Router |
| React & Structure (15) | Separated components, Props/State/useEffect throughout |
| API & Data (15) | Axios with loading/error states, JWT auth |
| UI/UX (15) | Clean parchment aesthetic, responsive, accessible |
| Tailwind CSS (15) | Utility classes throughout, responsive breakpoints |
| State Management (10) | useState, useEffect, React Context (Auth + Journal) |
| Presentation (10) | Clear MVC architecture, documented API |
