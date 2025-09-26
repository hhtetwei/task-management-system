# Task Management System

A full-stack task management application with secure authentication, task CRUD, and a minimal UI.  

Built with **NestJS + TypeORM + MySQL (Docker)** for the backend and **Next.js + React Query** for the frontend.

---

## 📦 Tech Stack

- **Backend**: NestJS, TypeORM, MySQL, JWT, bcrypt, Docker Compose  
- **Frontend**: Next.js (App Router), React Query, Mantine UI, Tailwind CSS  
- **Testing**: Jest + Supertest (backend), React Testing Library (frontend)  
- **Infra**: Docker Compose for one-command startup  

---

## ⚖️ Design Decisions

- **API Style**: REST — simple, predictable, easy to test.  
- **Auth Strategy**: JWT with httpOnly cookies (access + refresh tokens).  
- **Pagination**: Offset-based (`page` + `limit`) for clarity and simplicity.  

---

## 🚀 Getting Started

### 1. Clone & Configure
```bash
git clone https://github.com/hhtetwei/task-management-system.git
cd task-management-system
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
