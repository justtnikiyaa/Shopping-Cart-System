# Shopping Cart System (MERN Starter)

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
- Create product and cart models in `server/src/models`
- Add product/cart controllers and routes
- Connect frontend API calls to backend
