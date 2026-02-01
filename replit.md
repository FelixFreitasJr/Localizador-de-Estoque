# Estoque INI - Fiocruz Inventory Management System

## Overview

This is a full-stack inventory management application for Fiocruz's INI (Instituto Nacional de Infectologia) department. The system allows users to manage inventory items with features including creating, editing, deleting, duplicating, and bulk importing items via Excel files. The application is built with a React frontend and Express backend, using PostgreSQL for data persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack React Query for server state caching and synchronization
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom Fiocruz-inspired green color palette
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Framework**: Express 5 with TypeScript
- **API Pattern**: RESTful API with typed route definitions in `shared/routes.ts`
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Validation**: Zod schemas shared between frontend and backend via `drizzle-zod`
- **Build**: esbuild for production bundling with selective dependency bundling

### Data Layer
- **Database**: PostgreSQL
- **Schema Location**: `shared/schema.ts` - defines the `items` table with fields for code, name, description, and location tracking
- **Migrations**: Drizzle Kit for schema migrations (`drizzle-kit push`)

### Shared Code Pattern
The `shared/` directory contains code used by both frontend and backend:
- `schema.ts`: Database schema and Zod validation schemas
- `routes.ts`: API route definitions with input/output types

### Key Design Decisions

1. **Monorepo Structure**: Client code in `client/`, server in `server/`, shared types in `shared/`. This enables type safety across the full stack.

2. **Type-Safe API Layer**: The `shared/routes.ts` file defines API contracts with Zod schemas, ensuring runtime validation matches TypeScript types.

3. **Component-Based UI**: Using shadcn/ui provides accessible, customizable components that integrate with the Fiocruz branding through CSS variables.

4. **Query-Based Data Fetching**: React Query handles caching, refetching, and optimistic updates for all server interactions.

## External Dependencies

### Database
- **PostgreSQL**: Primary data store, connection via `DATABASE_URL` environment variable
- **Drizzle ORM**: Type-safe database queries and migrations

### UI Libraries
- **Radix UI**: Headless component primitives for accessibility
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Icon library

### Data Processing
- **xlsx**: Excel file parsing for bulk item imports
- **date-fns**: Date formatting with Portuguese (Brazil) locale support

### Development
- **Vite**: Development server with HMR
- **tsx**: TypeScript execution for server
- **esbuild**: Production bundling