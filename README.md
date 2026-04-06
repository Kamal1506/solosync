# SoloSync — Freelancer Productivity & Workflow Management System

> An all-in-one operating system for freelancers to manage work, time, and money efficiently.

---

## What is SoloSync?

SoloSync solves the problem of freelancers juggling 5 different tools — Notion for tasks, Excel for payments, WhatsApp for clients, a timer app, and a spreadsheet for invoices — by combining everything into **one platform with a smart dashboard**.

It provides a centralized hub that gives real-time visibility into tasks, deadlines, active projects, and pending payments. By combining workflow management with financial tracking and time monitoring, SoloSync enables freelancers to improve productivity, avoid missed deadlines, and maintain clear financial control.

---

## Screenshots

> Dashboard · Task Board · Clients · Payments

*(Add screenshots here after deployment — drag images into this section on GitHub)*

---

## Features

### Core
- **JWT Authentication** — Secure register/login with bcrypt password hashing and JSON Web Token sessions
- **Client Management** — Add and manage freelance clients with contact details
- **Project Tracking** — Create projects linked to clients with status, deadlines, and budget
- **Kanban Task Board** — Drag tasks across To-do / In Progress / Done columns with priority indicators
- **Payment Tracker** — Track invoices, mark payments as paid, view pending amounts
- **Smart Dashboard** — Real-time overview: today's tasks, urgent deadlines, earnings summary

### Advanced
- **Time Tracking** — Start/stop timer per task, view daily hours logged
- **Analytics** — Total earnings, weekly work hours, task completion rate
- **Deadline Alerts** — Color-coded countdown (green → amber → red) based on days remaining
- **Project Completion %** — Computed via SQL aggregation, shown as a progress bar
- **Search & Filter** — Filter tasks by status/priority, projects by status

---

## Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| Vite | Build tool (10x faster than CRA) |
| React Router v6 | Client-side routing |
| Axios | HTTP client with interceptors |
| Tailwind CSS | Utility-first styling |
| Context API | Global auth state management |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js 18 | JavaScript runtime |
| Express.js | Web framework |
| PostgreSQL | Relational database |
| Supabase | Managed database hosting |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT auth tokens |
| node-cron | Scheduled jobs for notifications |

### Deployment
| Service | Purpose |
|---------|---------|
| Vercel | Frontend hosting (auto-deploy on git push) |
| Render | Backend hosting |
| Supabase | Database (free tier) |

---

## Architecture

```
solosync/
├── solosync-frontend/          # React + Vite app
│   └── src/
│       ├── context/            # AuthContext — global auth state
│       ├── api/                # Axios instance + API functions per resource
│       ├── pages/              # One file per route (Dashboard, Clients, Tasks...)
│       ├── components/         # Reusable UI (Navbar, ProtectedRoute, Modal)
│       └── utils/              # Helpers (deadline calculator)
│
└── solosync-backend/           # Node.js + Express API
    └── src/
        ├── routes/             # URL definitions — thin, just map to controllers
        ├── controllers/        # Business logic — reads request, queries DB, sends response
        ├── middleware/         # JWT auth middleware — runs before protected routes
        ├── utils/              # JWT sign/verify helpers
        └── db.js               # PostgreSQL connection pool
```

### Request flow
```
React → Axios (+ JWT header) → CORS → express.json() → Auth Middleware → Controller → PostgreSQL → JSON response
```

---

## Database Schema

```sql
users         id, name, email, password_hash, created_at
clients       id, user_id (FK), name, email, phone, company
projects      id, client_id (FK), title, status, deadline, budget
tasks         id, project_id (FK), title, status, priority, due_date
payments      id, project_id (FK), amount, status, due_date, paid_date
time_logs     id, task_id (FK), start_time, end_time, duration_minutes
```

All tables use UUID primary keys. `ON DELETE CASCADE` ensures referential integrity throughout the hierarchy.

---

## Getting Started

### Prerequisites
- Node.js v18 or higher
- A free [Supabase](https://supabase.com) account

### 1. Clone the repository

```bash
git clone https://github.com/Kamal1506/solosync.git
cd solosync
```

### 2. Set up the database

1. Create a new project on [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the full schema from `solosync-backend/database/schema.sql`
3. Copy your connection string from **Project Settings → Database → Connection string**

### 3. Set up the backend

```bash
cd solosync-backend
npm install
```

Create a `.env` file:

```env
DATABASE_URL=postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres
JWT_SECRET=your_64_character_random_secret_here
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

Generate a JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Start the backend:
```bash
npm run dev
# Server running on port 5000
# Database connected ✓
```

### 4. Set up the frontend

```bash
cd ../solosync-frontend
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm run dev
# App running at http://localhost:5173
```

### 5. Test the app

Open `http://localhost:5173`, register an account, and start adding clients and projects.

---

## API Reference

All protected routes require `Authorization: Bearer <token>` header.

### Auth
```
POST   /api/auth/register     Create account → returns { user, token }
POST   /api/auth/login        Login → returns { user, token }
```

### Clients (protected)
```
GET    /api/clients           List all clients for the logged-in user
POST   /api/clients           Create a new client
PUT    /api/clients/:id       Update client details
DELETE /api/clients/:id       Delete client (cascades to projects)
```

### Projects (protected)
```
GET    /api/projects          List all projects with completion %
POST   /api/projects          Create project linked to a client
PUT    /api/projects/:id      Update project status or deadline
DELETE /api/projects/:id      Delete project
```

### Tasks (protected)
```
GET    /api/tasks             List tasks (filter: ?project_id=&status=)
POST   /api/tasks             Create task
PUT    /api/tasks/:id/status  Move task on kanban board
DELETE /api/tasks/:id         Delete task
```

### Payments (protected)
```
GET    /api/payments          List all payments (filter: ?status=)
POST   /api/payments          Log new invoice
PUT    /api/payments/:id      Update payment status (mark as paid)
```

### Dashboard (protected)
```
GET    /api/dashboard         Stats + today's tasks + urgent projects (single query)
```

### Utility
```
GET    /health                Health check — returns { status: 'ok' }
```

---

## Deployment

### Backend → Render

1. Push your code to GitHub
2. Create a new **Web Service** on [render.com](https://render.com)
3. Connect your GitHub repository
4. Set these environment variables in the Render dashboard:

```env
DATABASE_URL      = (your Supabase connection string)
JWT_SECRET        = (your 64-char secret)
JWT_EXPIRES_IN    = 7d
NODE_ENV          = production
FRONTEND_URL      = https://your-app.vercel.app
```

5. Set the start command to `npm start`

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → Import Git Repository
2. Select your frontend folder as root
3. Add environment variable:

```env
VITE_API_URL = https://your-backend.onrender.com/api
```

4. Deploy. Every push to `main` auto-deploys.

---

## Key Implementation Decisions

**Why JWT over Sessions?**
JWT is stateless — any server instance can verify any token without shared session storage. This makes horizontal scaling easy and is ideal for an API consumed by both a web app and potentially a mobile app.

**Why PostgreSQL over MongoDB?**
The data model is strictly relational (users → clients → projects → tasks → payments). PostgreSQL foreign keys enforce referential integrity and `ON DELETE CASCADE` handles cleanup automatically. Complex analytics queries (multi-table JOINs with aggregate filters) are cleaner in SQL.

**Why Vite over Create React App?**
Vite uses native ES modules and esbuild — rebuilds under 100ms vs 2–4s with Webpack. CRA is also no longer actively maintained.

**Optimistic UI in the Kanban board**
Moving a task updates local state instantly, then fires the API. If the API fails, state rolls back via a re-fetch. This makes the UI feel instant while staying consistent with the server.

**Single dashboard query**
Instead of 5 separate API calls from the frontend (one for each stat), one endpoint uses LEFT JOINs across 5 tables with FILTER aggregations to compute everything in one database round trip.

---

## What I Learned

- Designing a normalized relational schema with proper foreign key constraints
- JWT authentication flow: sign on login, verify in middleware, attach user ID to all protected requests
- The difference between Session-based auth and Stateless JWT auth
- React Context for global state without prop drilling
- Axios interceptors for centralized JWT attachment and 401 handling
- Optimistic UI updates with rollback on API failure
- SQL aggregate queries using `FILTER (WHERE ...)` syntax for conditional counts and sums
- Deploying a full-stack app across Vercel + Render + Supabase with proper environment variable management

---

## Future Improvements

- [ ] AI-powered task estimation using historical time logs
- [ ] Invoice PDF generation with jsPDF
- [ ] Real-time notifications via WebSockets
- [ ] Client-facing project status page (read-only shareable link)
- [ ] Mobile app using Expo (React Native) — same backend, new client
- [ ] Redis caching for dashboard stats

---

## Project Context

Built as a full-stack portfolio project to demonstrate:
- REST API design with Node.js + Express
- Relational database design with PostgreSQL
- React frontend architecture with Context API and React Router v6
- JWT-based authentication
- Full-stack deployment pipeline

**Resume one-liner:**
> *Built SoloSync — a full-stack freelancer productivity platform with React, Node.js, and PostgreSQL featuring JWT auth, Kanban task management, time tracking, and an analytics dashboard deployed on Vercel and Render.*

---

## License

MIT — feel free to fork, use, and modify.

---

## Author

**Your Name**
- GitHub: [@Kamal1506](https://github.com/Kamal1506)
- LinkedIn: (https://www.linkedin.com/in/kamal-arumugam-a84149338/)

---

*If this helped you, leave a ⭐ — it helps others find the project.*