# replit.md

## Overview

A modern calculator web application with calculation history persistence. Built as a full-stack TypeScript application featuring a React frontend with an animated, glassmorphic UI and an Express backend that stores calculation history in a PostgreSQL database. The app uses mathjs for safe expression evaluation and Framer Motion for smooth animations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state and caching
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming, dark mode by default
- **Animations**: Framer Motion for button interactions and history panel transitions
- **Math Evaluation**: mathjs library for safe mathematical expression parsing

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **API Design**: RESTful endpoints defined in shared routes module with Zod validation
- **Build System**: esbuild for server bundling, Vite for client bundling

### Code Organization
```
client/           # React frontend application
  src/
    components/   # UI components (Display, Keypad, HistoryPanel)
    hooks/        # Custom React hooks for calculations
    pages/        # Route page components
    lib/          # Utilities and query client setup
server/           # Express backend
  routes.ts       # API route handlers
  storage.ts      # Database access layer
  db.ts           # Drizzle database connection
shared/           # Shared code between frontend/backend
  schema.ts       # Drizzle table definitions
  routes.ts       # API contract definitions with Zod schemas
```

### API Structure
- `GET /api/calculations` - Retrieve calculation history (last 50)
- `POST /api/calculations` - Save a new calculation
- `DELETE /api/calculations` - Clear all history

### Database Schema
Single `calculations` table with:
- `id`: Serial primary key
- `expression`: Text field for the math expression
- `result`: Text field for the computed result
- `createdAt`: Timestamp with automatic default

## External Dependencies

### Database
- **PostgreSQL**: Primary data store, connection via `DATABASE_URL` environment variable
- **Drizzle Kit**: Database migrations stored in `/migrations` directory

### Key NPM Packages
- `mathjs`: Mathematical expression evaluation
- `framer-motion`: Animation library
- `@tanstack/react-query`: Async state management
- `drizzle-orm` / `drizzle-zod`: Database ORM with schema validation
- `zod`: Runtime type validation for API contracts
- Radix UI primitives: Accessible component foundations

### Development Tools
- Vite with HMR for development
- Replit-specific plugins for development experience (`@replit/vite-plugin-runtime-error-modal`, `@replit/vite-plugin-cartographer`)