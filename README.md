# LifeLink - Organ & Blood Donor Finder Platform

## Overview

LifeLink is a location-based donor matching platform that connects people in need of blood or organ donations with nearby verified donors in real-time. The application provides an interactive map interface for finding donors, detailed donor profiles with contact information, and a multi-step registration process for new donors. Built as a healthcare emergency-use application, it prioritizes trust, clarity, and quick information scanning to facilitate life-saving connections.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server for fast HMR and optimized production builds
- Wouter for client-side routing (lightweight alternative to React Router)

**UI Component System**
- Shadcn/ui component library with Radix UI primitives providing accessible, composable components
- Tailwind CSS for utility-first styling with a custom design system
- Material Design-inspired approach optimized for medical applications (trust, clarity, accessibility)
- New York style variant with custom color tokens and spacing system

**State Management**
- TanStack Query (React Query) for server state management, caching, and data synchronization
- React Hook Form with Zod validation for form state and validation
- Local component state using React hooks for UI interactions

**Mapping & Geolocation**
- Leaflet.js for interactive map rendering and marker placement
- React-Leaflet for React integration
- Browser Geolocation API for user location tracking
- Geolib library for distance calculations between coordinates

**Design System Principles**
- Typography: Inter font family with hierarchical sizing (4xl headers to xs metadata)
- Spacing: Tailwind units of 2, 4, 6, and 8 for consistent component padding and gaps
- Color System: HSL-based custom properties for theme support with primary (red accent), secondary, muted, and destructive variants
- Accessibility-first: High contrast, clear visual feedback, ARIA labels

### Backend Architecture

**Server Framework**
- Express.js REST API with TypeScript
- HTTP server created via Node's built-in `http` module
- Middleware stack: JSON body parsing, URL encoding, request/response logging

**Storage Layer**
- In-memory storage implementation (MemStorage class) with demo data seeding
- IStorage interface defining contract for donor CRUD operations
- Designed for easy migration to persistent database (PostgreSQL planned)
- Drizzle ORM ready with schema definitions and migration configuration

**API Endpoints**
- `GET /api/donors` - Retrieve all donors
- `GET /api/donors/:id` - Retrieve specific donor by ID
- `POST /api/donors` - Create new donor with Zod validation

**Data Validation**
- Zod schemas for runtime type validation
- Drizzle-Zod integration for automatic schema generation from database models
- Input validation on blood types, organ donations, coordinates, and contact information

### Database Schema

**Donors Table** (PostgreSQL via Drizzle ORM)
- Primary key: UUID (generated via `gen_random_uuid()`)
- Personal data: name, email, phone
- Medical data: bloodType (enum), organDonations (text array)
- Location data: latitude, longitude (real), address (text)
- Status fields: available (boolean), lastActive, createdAt (timestamps)

**Type System**
- Blood types: A+, A-, B+, B-, AB+, AB-, O+, O-
- Organ types: Heart, Kidney, Liver, Lungs, Pancreas, Intestines, Corneas, Bone Marrow

### Key Features & User Flows

**Donor Search Flow**
1. Landing page with hero image and CTA buttons
2. Find Donors page with interactive map centered on user location
3. Filter panel for range (1-50km), blood type, organ type, and availability
4. Real-time distance calculation and donor card display
5. Contact modal for phone/email communication

**Donor Registration Flow**
1. Multi-step form (Personal Info → Medical Details → Contact & Location)
2. Location permission request with browser geolocation
3. Form validation with inline error messages
4. Progress indicator showing completion percentage
5. Success confirmation with navigation to find donors

**Responsive Design**
- Mobile-first approach with breakpoint at 768px
- Hamburger menu navigation on mobile
- Collapsible filter sheet on mobile vs fixed sidebar on desktop
- Touch-optimized UI elements (larger tap targets)

## External Dependencies

### Core Libraries
- **React Ecosystem**: react, react-dom, @tanstack/react-query
- **Routing**: wouter
- **Forms & Validation**: react-hook-form, @hookform/resolvers, zod, drizzle-zod
- **UI Components**: @radix-ui/* (20+ component primitives)
- **Styling**: tailwindcss, autoprefixer, postcss, clsx, tailwind-merge, class-variance-authority

### Mapping & Geolocation
- **leaflet**: Open-source mapping library
- **react-leaflet**: React components for Leaflet
- **geolib**: Geolocation utility for distance calculations
- **@types/leaflet**: TypeScript definitions

### Backend & Database
- **express**: Web server framework
- **drizzle-orm**: TypeScript ORM for SQL databases
- **drizzle-kit**: Schema management and migrations
- **@neondatabase/serverless**: PostgreSQL connection driver (Neon DB)
- **connect-pg-simple**: PostgreSQL session store (for future session management)

### Build Tools & Development
- **vite**: Frontend build tool and dev server
- **@vitejs/plugin-react**: React support for Vite
- **tsx**: TypeScript execution for Node.js
- **esbuild**: JavaScript bundler for server build
- **typescript**: Type checking and compilation

### Utilities
- **date-fns**: Date formatting and manipulation
- **nanoid**: Unique ID generation
- **cmdk**: Command palette component

### Replit-Specific Integrations
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay
- **@replit/vite-plugin-cartographer**: Code exploration tool
- **@replit/vite-plugin-dev-banner**: Development mode indicator

### Fonts & Assets
- **Google Fonts**: Inter font family (weights 400, 500, 600, 700)
- **Leaflet CDN**: Map tile stylesheets and marker icons

### Database Configuration
- PostgreSQL database via Neon (serverless)
- Connection via DATABASE_URL environment variable
- Drizzle migrations stored in `/migrations` directory
- Schema defined in `/shared/schema.ts`
