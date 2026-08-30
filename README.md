# Travio

An online travel and tour booking system built for CSE 323. It follows the project proposal with React, Node.js/Express, MongoDB, JWT authentication, bookings, hotel reservations, wishlist, reviews, contact support, and an admin dashboard.

## Run locally

1. Copy `server/.env.example` to `server/.env` and add your MongoDB Atlas URI and JWT secret.
2. Run `npm run install:all` from the repository root.
3. Run `npm run dev`, then open the Vite address (normally `http://localhost:5173`). If Node.js is not available in your terminal, double-click `start-travio.cmd` instead.

The client uses polished demo data until the API is connected. The Express API exposes `/api/health`, `/api/auth/register`, `/api/auth/login`, and protected `/api/bookings` routes.

## Deployment

Deploy `client` to Vercel and `server` to Render. Add the production API URL as `VITE_API_URL` in Vercel and configure `MONGODB_URI` and `JWT_SECRET` on Render.
