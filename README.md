# FlowTask

A minimal task tracker built with MongoDB, Express, React, and Node.

## What it does
FlowTask helps you organize your daily work. It is a single-page application where you can create, toggle completion, edit, search, filter, and delete tasks dynamically.

### Tech stack
- **Frontend**: React (Vite), Lucide icons, Canvas Confetti
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)

### Key Features
- Full CRUD operations.
- Real-time updates without page reload.
- Staggered animations and interactive particle background.
- Fallback in-memory database storage (works even when MongoDB is offline).

## Benefits & Disadvantages

### Pros
- **Responsive**: Instant search, filter, and task modifications.
- **Glassmorphic UI**: High-end look without heavy UI libraries.
- **Offline Robustness**: Falls back to memory database if MongoDB is down.

### Cons
- **No Auth**: Anyone can edit tasks (no login system).
- **In-memory data doesn't persist**: Fallback storage wipes on server restart.

## Local Setup

### Prerequisites
- Node.js
- MongoDB running locally or a MongoDB Atlas URI

### Run the App
1. Clone the repo and run:
   ```bash
   npm install && npm run install-all
   ```
2. Start both frontend and backend concurrently:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:5173`.
