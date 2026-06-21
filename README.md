# Job Board Platform

A full-stack job board built with Angular-style component architecture, .NET-style API patterns, and SQL Server.

## Tech Stack

- **Frontend:** React + TypeScript + Vite (Angular-style component structure)
- **Backend:** Express.js + TypeScript (.NET-style route/controller pattern)
- **Auth:** JWT with bcrypt password hashing
- **RBAC:** Employer and Candidate roles

## Getting Started

### Backend
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Features

- **Job Search** with text, type, and location filters
- **Apply to Jobs** with cover letter
- **Employer Dashboard** post, edit, delete jobs; view applicants
- **Role-Based Access** employers post/manage jobs; candidates apply
- **JWT Authentication** register and login
