# Photo Passport Editor - Professional Background Removal & Passport Size Maker

## Overview

This is a web-based photo editing application specifically designed for creating professional passport-sized photos. The application provides AI-powered background removal, custom background colors, image adjustments, and the ability to generate print sheets with multiple passport photos arranged for printing.

The application is built as a modern single-page application with client-side image processing for privacy and performance, complemented by server-side image optimization and export functionality.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

### November 16, 2025 - Print Sheet Preview Feature
- Added real-time print sheet preview with debounced generation (800ms delay)
- Implemented dedicated `/api/print-sheet/preview` endpoint with optimized quality (60-70) and 50% scale for faster generation
- Created `PrintSheetPreview` component to display preview with loading states
- Implemented robust race condition prevention with request ID tracking and AbortController
- Added proper memory management with blob URL cleanup and state invalidation
- Preview updates automatically when user changes passport size, print sheet, or any image adjustments
- Feature properly handles enable/disable cycles without memory leaks or stale data

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server for fast hot-module replacement
- Wouter for lightweight client-side routing
- Single-page application architecture with all major functionality on the main `/` route

**UI Component System**
- Shadcn UI components built on Radix UI primitives for accessible, customizable components
- Tailwind CSS for utility-first styling with custom design tokens
- Material Design principles for professional, utility-focused interface
- Custom theming system with CSS variables supporting light/dark modes
- Typography: Inter for interface text, Roboto for data/numbers, Roboto Mono for measurements

**State Management**
- React hooks for local component state
- Custom `useImageEditor` hook encapsulating all image editing state and operations
- TanStack Query (React Query) for server state management and caching
- No global state management library - relying on React context and composition

**Image Processing**
- Client-side background removal using `@imgly/background-removal` library for privacy
- Canvas API for image manipulation (rotation, flipping, adjustments, cropping)
- Real-time preview updates with debounced server requests for print sheet generation
- All image adjustments applied client-side before final server export

**Layout System**
- Responsive design with mobile-first approach
- Desktop: Fixed left sidebar (280px) with canvas preview area
- Tablet: Toggleable side drawer for tools
- Mobile: Collapsible bottom sheet for tools with full-width canvas
- Breakpoint: 768px for mobile/desktop distinction

### Backend Architecture

**Server Framework**
- Express.js for HTTP server and API routing
- Node.js runtime with ESM modules
- TypeScript for type safety across the stack
- Development: Vite middleware mode for HMR and SPA serving
- Production: Static file serving with pre-built client bundle

**API Design**
- RESTful endpoints for image processing operations
- `/api/upload` - Image upload with validation (JPEG/PNG, max 10MB)
- `/api/process` - Server-side image processing and export
- `/api/print-sheet` - Generate print sheet layouts with multiple photos
- Multipart form data handling via Multer middleware
- In-memory file processing (no persistent file storage)

**Image Processing Server-Side**
- Sharp library for high-performance image manipulation
- Supports format conversion (JPEG/PNG), quality adjustment, resizing
- Applies transformations: rotation, flipping, brightness/contrast/saturation
- Background color application for passport photos
- Print sheet generation: arranges multiple passport photos on standard print sizes

### Data Storage Solutions

**Current Implementation**
- No database - application is stateless and client-focused
- In-memory storage only during request processing
- All user data lives client-side (uploaded images, editing state)
- Images processed on-demand and discarded after response

**Schema Configuration**
- Drizzle ORM configured for PostgreSQL (via `@neondatabase/serverless`)
- Database schema defined in `shared/schema.ts` but not actively used
- Passport size presets and print sheet configurations defined as static TypeScript constants
- Ready for future features requiring persistence (user accounts, saved edits, templates)

**Shared Types**
- Zod schemas for runtime validation of passport sizes, print sheets, and image adjustments
- Shared TypeScript types between client and server via `shared/` directory
- Type-safe API contracts using shared schemas

### Authentication and Authorization

**Current State**
- No authentication or authorization implemented
- Application is fully client-side and anonymous
- No user accounts or session management

**Session Infrastructure (Configured but Unused)**
- Express session middleware with PostgreSQL session store (`connect-pg-simple`)
- Cookie-based sessions configured in development
- Ready for future implementation of user accounts

### External Dependencies

**Third-Party Libraries**

*AI/ML Services*
- `@imgly/background-removal` (v1.7.0) - Client-side AI-powered background removal using WebAssembly

*Image Processing*
- `sharp` - Server-side high-performance image processing (resize, format conversion, color manipulation)
- Native Canvas API - Client-side image manipulation and preview rendering

*UI Framework*
- Radix UI component primitives (accordion, dialog, dropdown, slider, select, etc.)
- Tailwind CSS for styling
- Lucide React for icons
- `class-variance-authority` and `clsx` for conditional styling

*State & Data Management*
- `@tanstack/react-query` (v5.60.5) - Server state management and caching
- `react-hook-form` with `@hookform/resolvers` - Form validation
- `zod` - Schema validation and type inference

*Database (Configured)*
- `@neondatabase/serverless` - PostgreSQL serverless driver
- `drizzle-orm` - TypeScript ORM
- `connect-pg-simple` - PostgreSQL session store

*Build Tools*
- Vite - Build tool and dev server
- esbuild - Server bundle compilation
- TypeScript compiler
- PostCSS with Autoprefixer

**Asset Management**
- Sample stock images stored in `attached_assets/stock_images/`
- Images bundled via Vite's asset handling
- Static assets served from `/public` in production

**API Endpoints (Internal)**
- No external API dependencies
- All processing happens locally (client or server)

**Future Integration Points**
- Ready for cloud storage integration (S3, Cloudinary) for saved photos
- Database schema prepared for user accounts and persistent data
- Session management infrastructure in place for authentication