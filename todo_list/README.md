# Full Stack Todo List Application

A modern full stack todo list application built with TypeScript, React, and Express.

## Tech Stack

### Backend
- Node.js
- Express
- TypeScript
- SQLite (with better-sqlite3)

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS

## Project Structure

```
fullstack-todo-app/
├── packages/
│   ├── backend/     # Express API server
│   └── frontend/    # React application
└── package.json     # Yarn workspace configuration
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Yarn (v1.22 or higher)

### Installation

1. Install dependencies:
```bash
yarn install
```

### Development

Run both frontend and backend in development mode:
```bash
yarn dev
```

Or run them separately:

Backend (http://localhost:3001):
```bash
yarn workspace backend dev
```

Frontend (http://localhost:5173):
```bash
yarn workspace frontend dev
```

### Build

Build both projects:
```bash
yarn build
```

### Production

Start the backend server:
```bash
yarn start
```

## API Endpoints

- `GET /api/todos` - Get all todos
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo

## Features

- Create, read, update, and delete todos
- Mark todos as complete/incomplete
- Persistent storage with SQLite
- Modern, responsive UI
- Full TypeScript support
