# CIS 3339 Homework 1: Completed Application Setup

## Required Software

- Node.js and npm
- MongoDB Community Edition running locally
- A modern web browser

## Environment

The submitted `backend/.env` file contains the local configuration:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/cis3339_homework1
MONGODB_DB_NAME=cis3339_homework1
PORT=3000
```

No cloud database, password, or external service is required.

## Start MongoDB

Start the MongoDB Community Edition service using the normal service controls for your operating system. Verify that MongoDB is available at `127.0.0.1:27017` before starting the application.

The application automatically creates its collections and indexes when it starts. No database creation, migration, seed, or import command is required.

## Install, Build, and Start

From the repository root:

```bash
npm install
npm run build
npm start
```

The commands install the backend and frontend dependencies, build the Vue production assets, and start Express with the MongoDB connection.

## Open the Application

Open the completed application at:

```text
http://localhost:3000
```

Express serves the production Vue files and supports refreshing routed pages such as `/students`, `/courses`, and `/enrollments`.

## Development Frontend

To run Vite while developing the frontend, keep the backend running in one terminal and run this from a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Vite normally serves the development application at `http://localhost:5173`.
