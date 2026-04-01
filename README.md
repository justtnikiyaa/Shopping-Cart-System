# Shopping Cart System (MERN Starter)

A clean, beginner-friendly MERN starter structure for a shopping cart web application.

## Project Structure

```text
shopping-cart-system/
  client/                 # React + Vite + Tailwind CSS frontend
    src/
      App.jsx
      index.css
      main.jsx
    index.html
    package.json
    postcss.config.js
    tailwind.config.js
    vite.config.js

  server/                 # Node.js + Express backend
    src/
      app.js
      server.js
      config/
        env.js
      controllers/
        healthController.js
      middleware/
        errorHandler.js
        notFound.js
      models/
        README.js
      routes/
        healthRoutes.js
        index.js
    .env.example
    package.json
```

## Prerequisites

- Node.js 18+
- npm 9+

## Setup and Run

### 1) Install dependencies

In one terminal:

```bash
cd client
npm install
```

In another terminal:

```bash
cd server
npm install
```

### 2) Configure backend environment

```bash
cd server
copy .env.example .env
```

Default environment values:

- `PORT=5000`
- `NODE_ENV=development`
- `CLIENT_URL=http://localhost:5173`

### 3) Start backend server

```bash
cd server
npm run dev
```

Backend runs at: `http://localhost:5000`

Health check endpoint:

- `GET http://localhost:5000/api/health`

### 4) Start frontend app

```bash
cd client
npm run dev
```

Frontend runs at: `http://localhost:5173`

## What is already configured

- Separate `client` and `server` apps
- React with Vite
- Tailwind CSS setup (content paths + PostCSS)
- Express server with:
  - `cors`
  - `dotenv`
  - `express.json()`
  - Basic health-check route
- Scalable backend folder layout:
  - `config`, `controllers`, `middleware`, `models`, `routes`

## Next Steps

- Add MongoDB + Mongoose connection in `server/src/config`
- Create product and cart models in `server/src/models`
- Add product/cart controllers and routes
- Connect frontend API calls to backend
