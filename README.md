# Monorepo Template

![License](https://img.shields.io/badge/license-MIT-green.svg)

![TypeScript Version](https://img.shields.io/badge/Typescript-v5.8.2-blue.svg?logo=TypeScript)
![Bun Version](https://img.shields.io/badge/Bun-v1.2.4-blue.svg?logo=Bun)
![Svelte Version](https://img.shields.io/badge/Svelte-v5.22.6-blue.svg?logo=Svelte)
![SvelteKit Version](https://img.shields.io/badge/SvelteKit-v2.19.0-blue.svg?logo=Svelte)
![TailwindCSS Version](https://img.shields.io/badge/TailwindCSS-v4.0-blue.svg?logo=TailwindCSS)
![Hono](https://img.shields.io/badge/Hono.js-v4.7.4-blue.svg?logo=Hono)
![Turso Version](https://img.shields.io/badge/Turso-v0.98.2-blue.svg?logo=Turso)
![DrizzleKit Version](https://img.shields.io/badge/DrizzleKit-v0.30.4-blue.svg?logo=Drizzle)
![Vitest Version](https://img.shields.io/badge/Vitest-v3.0.8+-blue.svg?logo=Vitest)

## 📋 Overview

A monorepo template for web application development using Bun. This template adopts a simplified clean architecture directory structure that eliminates anti-patterns. A Todo list is implemented as a usage example.

## 🛠️ Technology Stack

- **Frontend**: SvelteKit + TailwindCSS
  - Svelte Runes for state management
  - CSS custom properties for theming (light/dark mode)
  - Modern UI components with interactive effects
- **Backend**: Hono.js
- **Database**: Turso + Drizzle ORM
- **Testing**: Vitest, Playwright
- **Development Environment**: Docker, Docker Compose, GitHub Actions
- **Others**: TypeScript, Biome, Zod

## 🏗️ Architecture

- **Test-Driven Development (TDD)**: A development approach where tests are written before implementation
- **Domain-Driven Design (DDD)**: A design approach focused on the business domain
- **Practical Clean Architecture**: An architecture that controls dependencies and enhances testability and maintainability
- **Theme System**: A centralized theme system using CSS custom properties for consistent UI across light and dark modes

## 🚀 Project Structure

```txt
.
├── frontend/           # SvelteKit frontend
│   ├── src/
│   │   ├── lib/          # Components and utilities
│   │   │   ├── components/ # UI components
│   │   ├── routes/       # Application routes
│   │   └── app.css       # Global styles and theme variables
├── backend/            # Hono.js backend
│   ├── src/
│   │   ├── application/  # Application layer
│   │   ├── domain/       # Domain layer
│   │   ├── infrastructure/ # Infrastructure layer
│   │   └── presentation/ # Presentation layer
├── database/           # Database related
│   ├── schema/         # Drizzle ORM schema
│   ├── migrations/     # Migration files
├── shared/             # Shared code
├── tools/              # Development tools
├── docker/             # Docker configuration (planned)
└── workflows/          # CI/CD configuration (planned)
```

## 🔄 CI/CD

### CI/CD Workflow Overview

> format:code changes → lint → Unit Test → Integrated Test → E2E Test → Build → Deploy

## 🏁 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) v1.0.0 or higher
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) (optional)
- [Turso CLI](https://docs.turso.tech/reference/cli) (for database management)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd <repository-name>

# Install dependencies
bun install
```

### Environment Setup

Create a `.env` file in the project root with the following variables:

```env
# Backend server port
PORT=3000
BACKEND_URL=http://localhost:${PORT}

# API base URL
API_BASE_URL=${BACKEND_URL}/api

# Frontend URL (for CORS)
PORT_FRONTEND=5173
FRONTEND_URL=http://localhost:${PORT_FRONTEND}

# Turso Database URL
DATABASE_URL=libsql://your-database-url
DATABASE_AUTH_TOKEN=your-auth-token
```

### Database Setup

```bash
# Run database migrations
cd database
bun run migrate
```

### Starting the Development Server

```bash
# Start the frontend development server
cd frontend
bun run dev

# Start the backend development server
cd backend
bun run dev

# Or run everything from the root (requires Turbo)
bun run dev
```

### API Usage

You can test the API using PowerShell:

```powershell
# Get all todos
Invoke-RestMethod -Method GET -Uri "http://localhost:3000/api/todos"

# Create a todo
Invoke-RestMethod -Method POST -Uri "http://localhost:3000/api/todos" -ContentType "application/json" -Body '{"title":"New task"}'

# Update a todo
Invoke-RestMethod -Method PUT -Uri "http://localhost:3000/api/todos/{id}" -ContentType "application/json" -Body '{"completed":true}'

# Delete a todo
Invoke-RestMethod -Method DELETE -Uri "http://localhost:3000/api/todos/{id}"
```

## 🎨 Theme System

The application uses a centralized theme system with CSS custom properties:

### CSS Variables

```css
:root {
  /* Light mode variables */
  --color-bg-primary: #f9fafb;
  --color-text-primary: #111827;
  /* ...other variables */
}

.dark {
  /* Dark mode variables */
  --color-bg-primary: #1e1e1e;
  --color-text-primary: #f9fafb;
  /* ...other variables */
}
```

### Usage in Components

For standard styles:
```html
<div class="bg-theme-primary text-theme-secondary"></div>
```

For hover effects (important):
```html
<!-- Correct way to use theme variables with hover effects -->
<button class="hover:bg-[var(--color-bg-button-hover)]">Button</button>
```

## 📝 License

MIT

## 🚧 Development Status

This project is currently under active development. The following components are implemented:

- ✅ Backend API (Hono.js)
- ✅ Database layer (Turso + Drizzle)
- ✅ Shared modules
- ✅ Todo CRUD functionality
- ✅ Database migrations
- ✅ Frontend (SvelteKit + TailwindCSS)
  - ✅ Responsive UI with light/dark mode
  - ✅ Todo application implementation
  - ✅ Theme system with CSS custom properties

The following components are planned or in progress:

- ⏳ CI/CD configuration
- ⏳ Docker environment
- ⏳ Authentication
- ⏳ Comprehensive testing
