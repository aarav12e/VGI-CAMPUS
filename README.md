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

### 1. Backend REST API (`backend`) - Pure Node.js & Express

The backend powers the entire campus platform in pure, easy-to-understand Node.js (JavaScript). It runs directly with Node without any TypeScript or build steps required.

```bash
# 1. Navigate into the backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Create your local environment file
cp .env.example .env

# 4. Generate the database client & sync database
npm run prisma:generate
npm run prisma:db:push

# 5. Seed demo campus data (Students, Faculty, Admin accounts)
npm run seed

# 6. Start the Node.js development server (runs with native hot-reload)
npm run dev
# -> Runs: node --watch src/server.js on http://localhost:5050
```

* **Default URL**: `http://localhost:5050`
* **Health Check**: `http://localhost:5050/api/v1/health`

---

### 2. Mobile Super-App (`mobile`) - Pure React Native (JavaScript)

The mobile application is written in standard React Native JavaScript with Expo. The entry point is `App.js` right in the root, making it simple to read, customize, and extend. It includes the 4-step onboarding carousel, unified role-based authentication, student portal, faculty attendance roll-call marker, and dedicated parent dashboard.

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

### 3. Institutional Administration & Faculty Web Portal (`admin`)

The web portal is built with React, Vite, and modern Vanilla CSS. It provides synchronized workspaces for **College Administrators, Heads of Department (HODs), and Faculty Members**, working in real-time sync with student & parent mobile apps:

- **👑 Institutional Administrator**: University analytics, academic hierarchy (departments, programs, batches, semesters, sections), student roster, campus amenities (Hostel, Mess, Library), security audit trail.
- **🏛️ Head of Department (HOD)**: Department Command Center, faculty course teaching allocations, at-risk attendance monitoring (<75%), class cohort creation, and department broadcasts.
- **👨‍🏫 Faculty / Teachers**: Interactive Classroom Roll-Call Marker (instant sync to parents & students), Coursework Assignments & Submissions grading suite, Syllabus curriculum builder, and Examination Marks & SGPA registry.
- **⚡ Real-Time Mobile Sync**: All actions taken in the Web portal (attendance marked, assignments published, grades awarded, results posted) immediately reflect on student & parent phones.

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
| **👑 Administrator** | College Registrar | `admin@vgi.ac.in` (or `ADM001`) | `admin123` / `Admin@123` | Institutional Analytics, Student/Faculty Roster, Audit Logs |
| **🏛️ Head of Dept (HOD)** | Dr. Rajesh Sharma | `rajesh.sharma@vgi.ac.in` (or `EMP001`) | `teacher123` / `Password@123` | Faculty Teaching Allocations, Section Setup, Dept Analytics |
| **👨‍🏫 Faculty Member** | Prof. Priya Verma | `priya.verma@vgi.ac.in` (or `EMP002`) | `teacher123` / `Password@123` | Roll-Call Attendance, Assignments & Grading, Syllabus Upload |
| **🎓 Student** | Aarav Patel | `aarav.patel@vgi.ac.in` (or `24DS001`) | `student123` / `Password@123` | 84% Attendance Gauge, Coursework, Hostel & Fees |
| **👨‍👦 Parent** | Suresh Patel | `suresh.patel@vgi.ac.in` (or `PAR24001`) | `parent123` / `Password@123` | Ward Monitoring (Attendance, Fee Receipts, SGPA) |

*Note: Both the web login screen and mobile login screen provide **1-Click Quick Demo Personas** to switch between any role instantly without typing credentials.*

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
