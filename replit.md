# TaskFlow - Project Management & Collaboration Tool

## Overview

TaskFlow is a minimalist project management and collaboration tool designed for small teams and freelancers. It provides task management through Kanban boards, time tracking, client management, invoicing, and team communication features. The application follows a modern full-stack architecture with a React frontend and Express.js backend.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API**: RESTful API design
- **Authentication**: Replit Auth with OpenID Connect (OIDC)
- **Session Management**: Express sessions with PostgreSQL store

### Database Architecture
- **Primary Database**: PostgreSQL (configured for Neon serverless)
- **ORM**: Drizzle ORM with type-safe schema definitions
- **Migrations**: Drizzle Kit for schema management
- **Connection**: Connection pooling with Neon serverless driver

## Key Components

### Authentication System
- Replit Auth integration with OIDC strategy
- Session-based authentication with secure cookies
- User profile management with automatic user creation
- Protected routes with middleware validation

### Core Data Models
- **Users**: Profile management and authentication
- **Workspaces**: Team organization and collaboration
- **Projects**: Project lifecycle management with client association
- **Tasks**: Kanban-style task management with priorities and assignments
- **Time Entries**: Time tracking with project/task association
- **Messages**: Project-based team communication
- **Clients**: Customer relationship management
- **Invoices**: Billing and invoice generation
- **Notes**: Team knowledge management

### UI Components
- Comprehensive component library using Radix UI primitives
- Consistent design system with CSS custom properties
- Responsive design with mobile-first approach
- Accessible components following ARIA standards

## Data Flow

### Client-Server Communication
1. **API Requests**: RESTful endpoints with JSON payloads
2. **Authentication**: Session-based with automatic redirects
3. **Real-time Updates**: Polling-based updates for messages and time tracking
4. **Error Handling**: Centralized error handling with toast notifications

### State Management Flow
1. **Server State**: TanStack Query manages API data with caching
2. **Local State**: React useState for component-local state
3. **Form State**: React Hook Form for form validation and submission
4. **Navigation State**: Wouter for client-side routing

### Data Persistence
1. **Database Operations**: Drizzle ORM with type-safe queries
2. **File Uploads**: Multer middleware with local file storage
3. **Session Storage**: PostgreSQL-backed session store
4. **Schema Evolution**: Migration-based database changes

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL serverless driver
- **drizzle-orm**: Type-safe ORM with PostgreSQL support
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI component primitives
- **express**: Web framework for Node.js
- **passport**: Authentication middleware

### Development Tools
- **Vite**: Frontend build tool and development server
- **TypeScript**: Type safety across the stack
- **Tailwind CSS**: Utility-first CSS framework
- **ESLint/Prettier**: Code quality and formatting

### Replit Integration
- **@replit/vite-plugin-cartographer**: Development mode enhancements
- **@replit/vite-plugin-runtime-error-modal**: Error handling overlay

## Deployment Strategy

### Development Environment
- **Hot Module Replacement**: Vite HMR for rapid development
- **TypeScript Compilation**: Real-time type checking
- **Database Migrations**: Development-friendly schema updates
- **Environment Variables**: Secure configuration management

### Production Build
1. **Frontend Build**: Vite production optimization
2. **Backend Bundle**: ESBuild for server-side bundling
3. **Static Assets**: Optimized asset serving
4. **Database Setup**: Automated migration execution

### Runtime Configuration
- **Environment Variables**: DATABASE_URL, SESSION_SECRET, REPL_ID
- **Session Security**: HTTPS-only cookies in production
- **File Storage**: Local filesystem with configurable paths
- **Process Management**: Single-process Node.js application

## Changelog

- July 02, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.