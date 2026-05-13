# Motion

A full-stack gym tracking application built with React, Node.js, Express, and MongoDB.

## Prerequisites

- Node.js v23.1.0
- MongoDB instance (local or Atlas)

## Setup

1. Copy the environment template and rename it:
   ```bash
   cp example.env .env.development
   ```
2. Open `.env.development` and enter your MongoDB URI and any other required values.
3. Ensure `.env*` is in your `.gitignore`.

## Install Dependencies

```bash
# Install root dependencies (backend + concurrently)
npm install

# Install frontend dependencies
npm install --prefix frontend
```

## Database

```bash
# Seed the database with sample data
npm run data:import

# Clear the database
npm run data:destroy
```

## Running the App

```bash
# Run both frontend and backend concurrently (development)
npm run develop

# Run backend only
npm run server

# Run frontend only
npm run client
```

The backend runs on `http://localhost:8000` and the frontend on `http://localhost:5173` by default.
