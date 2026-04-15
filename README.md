# 🎬 ChaiCode Cinema - Ticket Booking System

A high-performance, secure, and modern Single Page Application (SPA) for movie ticket booking. Features real-time seat locking, JWT-based authentication, and a transactional PostgreSQL backend.

---

https://github.com/user-attachments/assets/3c24e05b-97a7-4d80-a277-d1fe0ffce629



## 🚀 Features

- **Standardized Auth**: Secure User Registration and Login using JWT and BCrypt password hashing.
- **Real-Time Seat Locking**: 2-minute temporary locks on seats during the checkout phase to prevent race conditions.
- **Transactional Integrity**: Uses PostgreSQL Row-Level Locking (`SELECT FOR UPDATE`) to ensure a seat can never be double-booked.
- **Vercel-Inspired UI**: A sleek, monochromatic dark-mode interface built with Vanilla JS and Tailwind CSS, following Vercel's accessibility and interface guidelines.
- **Production-Ready Setup**: Automated database migrations and seeding logic.

---

## 🛠️ Tech Stack

- **Runtime**: [Bun](https://bun.sh/) (or Node.js)
- **Backend**: Express.js
- **Database**: PostgreSQL
- **Styling**: Tailwind CSS (CDN) + Vanilla CSS
- **Authentication**: JsonWebToken (JWT)

---

## 🛠️ Prerequisites

- **Bun** (Recommended) or **Node.js**
- **Docker** (Required for the local PostgreSQL instance)

---

## 📦 Installation & Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd book-my-ticket
```

### 2. Install Dependencies
```bash
bun install
```

### 3. Environment Configuration
Create a `.env` file in the root directory and add the following:
```env
PORT=8080

POSTGRES_USER=admin
POSTGRES_PASSWORD=admin123
POSTGRES_DB=bookticket

DATABASE_URL=postgresql://admin:admin123@localhost:5433/bookticket

JWT_SECRET=your_super_secret_key_here
```

### 4. Start the Database
The project includes a `docker-compose.yml` configured for PostgreSQL on port `5433`.
```bash
docker-compose up -d
```

### 5. Initialize & Seed the Database
Run the setup script to create tables (`users`, `movies`, `seats`, `payments`) and seed the initial "Recommended Movies" and seat maps.
```bash
bun run setup
```

---

## 🏃 Running the Application

### Development Mode (with hot-reload)
```bash
bun run dev
```

### Production Mode
```bash
bun start
```

Your application will be live at `http://localhost:8080`.

---

## 📂 Project Structure

- `index.mjs`: Server entry point and API routing.
- `index.html`: The SPA frontend.
- `src/controllers/`: Business logic for Auth, Booking, Movies, and Payments.
- `src/db/`: Database connection pool and setup/migration scripts.
- `src/middlewares/`: JWT Authentication middleware.
- `src/models/models.js`: Centralized SQL schema definitions.
- `public/image/`: Static assets for movie posters.

---

## ⚡ Quick Verification Flow
1. Open the site.
2. Browse the **Recommended Movies** (no login required).
3. Select a movie to view the seat map.
4. Try to click an available seat — you will be prompted to **Sign In**.
5. Once signed in, click a seat to trigger a **2-minute Lock**.
6. Complete the checkout (Mock Payment) to finalize your booking!
