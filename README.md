# Todo App with PGlite & Drizzle

A simple frontend todo application that demonstrates using PGlite (Postgres in WebAssembly) with Drizzle ORM.

## Tech Stack

- **Frontend**: React with TypeScript
- **Database**: PGlite (Postgres in WebAssembly)
- **ORM**: Drizzle ORM
- **Build Tool**: Vite

## Features

- Create, read, update, and delete todos
- Persistent storage using PGlite (saves to local file or IndexedDB in browser)
- Type-safe database operations with Drizzle ORM
- Schema migrations with Drizzle Kit

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Generate migrations:
   ```
   npm run generate
   ```
4. Start the development server:
   ```
   npm run dev
   ```

## Project Structure

- `src/db/schema/` - Database schema definitions
- `src/db/migrate.ts` - Migration utilities
- `src/services/` - Business logic and data access
- `src/components/` - React components
- `src/context/` - React context for state management
- `migrations/` - Generated SQL migrations

## How It Works

This application uses PGlite, which is a WebAssembly build of PostgreSQL that can run directly in the browser or Node.js. The data is persisted to a local file (in Node.js) or IndexedDB (in the browser).

Drizzle ORM provides a type-safe interface for interacting with the database, and Drizzle Kit handles schema migrations.

## License

MIT

