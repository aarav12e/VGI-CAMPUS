# VGI CAMPUS — College Super-App & Administration Platform

**Official Campus Management & Super-App System for Vishveshwarya Group of Institutions (VGI), Greater Noida.**

This repository is organized into three independent, standalone components:
- **`backend`**: Node.js / Express REST API with Prisma ORM & JWT authentication.
- **`mobile`**: Expo / React Native mobile application for Students, Faculty, Parents, and Administrators.
- **`admin`**: React / Vite Web Administration Dashboard for campus registrars, HODs, and deans.

---

## 📂 Project Architecture

```
VGI CAMPUS/
├── backend/            # Express REST API & Database layer
│   ├── prisma/         # Prisma schema and seed scripts
│   ├── src/            # Modular backend services & controllers
│   ├── .env.example    # Environment template
│   └── package.json    # Standalone dependencies
│
├── mobile/             # Student, Faculty & Parent Super-App
│   ├── assets/         # Onboarding illustrations & VGI banners
│   ├── src/            # App screens & role-based components
│   ├── .env.example    # Environment template
│   └── package.json    # Standalone dependencies
│
├── admin/              # College Admin Web Dashboard
│   ├── src/            # Admin pages & analytics components
│   ├── .env.example    # Environment template
│   └── package.json    # Standalone dependencies
│
├── .gitignore          # Repository-wide ignore rules
└── README.md           # This setup & run guide
```

---

## ⚡ Prerequisites

- **Node.js**: `v18.x` or higher (recommended: `v20.x` or `v22.x`)
- **npm**: `v9.x` or higher
- Optional: **Expo Go** app on your phone if testing the mobile app on a physical device.

---

## 🛠️ Step-by-Step Setup & How to Run

### 1. Backend REST API (`backend`)

The backend powers the entire campus platform, including attendance management, timetable schedules, assignments, notices, hostel grievances, fee accounts, and authentication.

```bash
# 1. Navigate into the backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Create your local environment file
cp .env.example .env

# 4. Generate the Prisma database client & sync database
npx prisma generate
npx prisma db push

# 5. (Optional) Seed demo campus data
npm run seed

# 6. Start the development server
npm run dev
```

* **Default URL**: `http://localhost:5050`
* **Health Check**: `http://localhost:5050/api/v1/health`

---

### 2. Mobile Super-App (`mobile`)

The mobile application is built with Expo & React Native. It includes the 4-step onboarding carousel, unified role-based authentication, student portal, faculty attendance roll-call marker, and dedicated parent dashboard.

```bash
# 1. Navigate into the mobile directory
cd mobile

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Create your local environment file
cp .env.example .env

# 4. Start the mobile app on Web browser
npx expo start --web

# (Alternatively, run on Android or iOS)
npx expo start --android
npx expo start --ios
```

* **Web Preview**: Opens automatically at `http://localhost:8081`

---

### 3. Admin Web Dashboard (`admin`)

The admin web portal is built with React and Vite for campus administrative staff.

```bash
# 1. Navigate into the admin directory
cd admin

# 2. Install dependencies
npm install

# 3. Create your local environment file
cp .env.example .env

# 4. Start the Vite development server
npm run dev
```

* **Default URL**: `http://localhost:3000`

---

## 👥 Default Demo Credentials & Roles

| Role | Name | User ID / Email | Password | Primary Feature |
| :--- | :--- | :--- | :--- | :--- |
| **Regular Student** | Aarav Patel | `aarav.patel@vgi.ac.in` (or `24DS001`) | `Password@123` | 84% Attendance Gauge, Coursework, Hostel & Fees |
| **Staff / Faculty** | Dr. Rajesh Sharma | `rajesh.sharma@vgi.ac.in` (or `EMP001`) | `Password@123` | Quick Attendance Roll-Call Marker & Class Roster |
| **Parent** | Suresh Patel | `suresh.patel@vgi.ac.in` (or `PAR24001`) | `Password@123` | Ward Monitoring (Attendance, Fee Receipts, SGPA) |
| **Administrator** | Prof. S. K. Verma | `admin@vgi.ac.in` (or `ADM001`) | `Admin@123` | University-wide Analytics & Department Management |

*Note: The mobile login screen also provides **1-Tap Quick Demo Personas** to switch between any role instantly without typing credentials.*

---

## 📜 Scripts Reference

### Backend (`/backend`):
- `npm run dev`: Starts the TypeScript Express server via `ts-node` with auto-reload.
- `npm run build`: Compiles TypeScript to production JavaScript in `dist/`.
- `npm start`: Runs the compiled server from `dist/server.js`.
- `npm run seed`: Populates SQLite with mock classes, students, notices, and fees.

### Mobile (`/mobile`):
- `npm run web` / `npx expo start --web`: Launches the web-compatible mobile view.
- `npm run android`: Launches on an Android emulator or connected device.
- `npm run ios`: Launches on an iOS simulator.

### Admin (`/admin`):
- `npm run dev`: Runs Vite local dev server on port 3000.
- `npm run build`: Compiles optimized production bundle in `dist/`.
- `npm run preview`: Previews the production build locally.
