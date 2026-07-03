# ቃለ ሕይወት ባማ ዘማሪዎች — Kale Hiwot Bama Choir

A full-stack choir song management website.

## Requirements
- Node.js 18+
- MongoDB (running locally on port 27017)

---

## Setup & Run

### 1. Install MongoDB
Download from https://www.mongodb.com/try/download/community and make sure it's running.

### 2. Start the Backend
```bash
cd server
npm install
npm run dev
```
Server runs on http://localhost:5000
Admin seeded automatically: **username: admin / password: Bama1234**

### 3. Start the Frontend
```bash
cd client
npm install
npm run dev
```
App runs on http://localhost:5173

---

## Admin Login
- URL: http://localhost:5173/admin/login
- Username: `admin`
- Password: `Bama1234`

## Features
- 🎵 Browse & search songs with Amharic lyrics
- 📖 Bible verse displayed on homepage
- 📢 Messages / Announcements
- ⚙ Admin panel to add/edit/delete songs and messages
- 🔐 JWT authentication for admin
- 🌙 Dark gold theme
