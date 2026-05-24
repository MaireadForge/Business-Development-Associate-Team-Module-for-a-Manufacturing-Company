# BDA Pro — Business Development Associate Team Module

A full-stack MERN application for managing Business Development Associate teams, built as part of a technical assessment. It includes lead pipeline management, client tracking, task assignment, and team performance overview.

---

## 🚀 Features

- 🔐 JWT-based Authentication with role-based access (Admin / BDA)
- 🎯 Lead Pipeline with Kanban drag-and-drop (react-beautiful-dnd)
- 👥 Client Management with search and filters
- ✅ Task Management with priority levels, due dates, and status tracking
- 📊 Dashboard with charts (BarChart + PieChart via Recharts)
- 👤 Team Overview with per-member stats
- 🔒 Protected routes with persistent login via localStorage

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, Tailwind CSS, Recharts, React Router v6 |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Drag & Drop | react-beautiful-dnd |
| HTTP Client | Axios |

---

## 📁 Folder Structure
bda-module/
├── client/                     # React frontend
│   ├── public/
│   └── src/
│       ├── api/
│       │   └── axios.js        # Axios instance with interceptors
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Sidebar.jsx
│       │   ├── ProtectedRoute.jsx
│       │   └── KanbanBoard.jsx
│       ├── context/
│       │   └── AuthContext.jsx  # Global auth state
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Dashboard.jsx
│       │   ├── Leads.jsx
│       │   ├── Clients.jsx
│       │   ├── Tasks.jsx
│       │   └── Team.jsx
│       └── App.jsx
│
├── server/                     # Express backend
│   ├── middleware/
│   │   └── auth.js             # JWT verification middleware
│   ├── models/
│   │   ├── User.js
│   │   ├── Lead.js
│   │   ├── Client.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── leads.js
│   │   ├── clients.js
│   │   └── tasks.js
│   ├── .env
│   └── index.js
│
└── README.md

---

## ⚙️ Environment Variables

### Server — `server/.env`

| Variable | Description | Example |
|---|---|---|
| `MONGO_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster0.mongodb.net/bda-module` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `your_secret_key_here` |
| `PORT` | Port for Express server | `5000` |

### Client — `client/.env`

| Variable | Description | Example |
|---|---|---|
| `REACT_APP_API_URL` | Base URL for backend API | `http://localhost:5000/api` |

---

## 🔧 Local Setup Instructions

### Prerequisites

- Node.js v18+
- npm v9+
- MongoDB Atlas account (free tier works)

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/bda-module.git
cd bda-module
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file inside `server/`:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/bda-module?retryWrites=true&w=majority
JWT_SECRET=bda_super_secret_jwt_key_2024
PORT=5000
```

Start the backend server:

```bash
npm run dev
```

Server will run at: `http://localhost:5000`

---

### 3. Frontend Setup

```bash
cd ../client
npm install
```

Create a `.env` file inside `client/`:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

Start the React app:

```bash
npm start
```

App will run at: `http://localhost:3000`

---

### 4. MongoDB Atlas Setup

1. Go to [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas) and create a free account
2. Create a new cluster (free M0 tier)
3. Under **Database Access**, create a user with read/write permissions
4. Under **Network Access**, add IP `0.0.0.0/0` to allow all connections
5. Click **Connect** → **Compass or Driver** → copy the connection string
6. Replace `<username>` and `<password>` in your `server/.env` with your actual credentials

---

## 👤 Default Roles

| Role | Access |
|---|---|
| `admin` | Full access — manage team, all leads, clients, tasks |
| `bda` | Access to own leads, tasks, and clients |

Register your first user via `/register` and select **Admin** to get full access.

---

## 📦 Scripts

### Backend (`server/`)

| Command | Description |
|---|---|
| `npm run dev` | Start server with nodemon (hot reload) |
| `npm start` | Start server without hot reload |

### Frontend (`client/`)

| Command | Description |
|---|---|
| `npm start` | Start React development server |
| `npm run build` | Build for production |

---

## 🌐 Live Demo

> Coming soon 

---

## 👨‍💻 Author

**Anshita Shrivastava**  
GitHub: [@MaireadForge](https://github.com/MaireadForge)  


---

## 📄 License

This project was built as part of a technical assessment for ISAII. Not for commercial use.
