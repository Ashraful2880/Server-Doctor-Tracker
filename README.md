# Doctor Tracker (Server)

## Description

This is the backend REST API for Doctor Tracker, built with Node.js, Express, TypeScript, and MongoDB (Mongoose). It handles admin authentication with JWT, doctor and patient CRUD operations, server-side pagination, multi-criteria filtering, and aggregation endpoints for the dashboard charts.

## Live Deployment

- **API Base URL:** https://server-doctor-tracker.onrender.com/api/v1
- **Health Check:** https://server-doctor-tracker.onrender.com/health
- **Frontend App:** https://client-doctor-tracker.vercel.app
- **Seeded Admin:** `admin@dt.com` / `Admin@123`

## Setup Guide

### What You Need
- Node.js v20+
- MongoDB (local or MongoDB Atlas)
- npm v10+

### 1. Clone and install

```bash
git clone https://github.com/Ashraful2880/Server-Doctor-Tracker.git
cd Server-Doctor-Tracker
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

`.env.example`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/doctor_tracker
JWT_SECRET=change_this_to_a_long_random_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
```

### 3. Seed and run

```bash
npm run seed
npm run dev
```

The seed script creates 1 admin (`admin@dt.com` / `Admin@123`), 12 doctors, and 28 patients so you can test search, filters, and charts right away.

For a production build:

```bash
npm run build
npm start
```

## API Routes (`/api/v1`)

| Module | Endpoint | What it does | Auth |
| :--- | :--- | :--- | :--- |
| Health | `GET /health` | Basic uptime check | Public |
| Auth | `POST /api/v1/auth/login` | Admin login, returns JWT | Public |
| Auth | `GET /api/v1/auth/me` | Current admin profile | Bearer JWT |
| Doctors | `GET /api/v1/doctors` | List doctors with search, filters, pagination | Bearer JWT |
| Doctors | `POST /api/v1/doctors` | Create a doctor | Bearer JWT |
| Doctors | `GET /api/v1/doctors/:id` | Doctor profile + assigned patients | Bearer JWT |
| Doctors | `PATCH /api/v1/doctors/:id` | Update doctor details | Bearer JWT |
| Doctors | `DELETE /api/v1/doctors/:id` | Delete a doctor | Bearer JWT |
| Patients | `GET /api/v1/patients` | List patients with search, filters, pagination | Bearer JWT |
| Patients | `POST /api/v1/patients` | Add a patient under a doctor | Bearer JWT |
| Patients | `PATCH /api/v1/patients/:id` | Update patient details | Bearer JWT |
| Patients | `DELETE /api/v1/patients/:id` | Delete a patient | Bearer JWT |
| Analytics | `GET /api/v1/analytics/overview` | Dashboard totals, charts, date stats | Bearer JWT |

## System Architecture

Requests enter Express through `helmet`, `cors` (restricted to `CLIENT_URL`), and JSON body parsing. Protected routes pass through `authenticate` (verifies the Bearer JWT) and `validate` (checks body/query/params against Zod schemas) before reaching the service layer, which runs Mongoose queries and passes errors to a central error handler.

## Technical Decisions

### 1. Feature-based modules with Zod validation
Each resource (`auth`, `doctor`, `patient`, `analytics`) keeps its model, Zod schemas, service functions, controller, and routes in one folder. Validating requests at the middleware level keeps controllers clean and ensures invalid payloads return consistent 400 errors before touching MongoDB.

### 2. Compound indexes and aggregation pipelines
List endpoints run `.find().lean()` and `.countDocuments()` in parallel using `Promise.all()`, backed by compound indexes on `specialization + createdAt`, `hospital + createdAt`, `doctorId + createdAt`, and `condition + createdAt`. Dashboard stats (`patientsPerDoctor`, condition breakdown, and daily counts) are computed directly in MongoDB via `$lookup`, `$group`, and `$dateToString` instead of in-memory loops.
