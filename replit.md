# VideoWalker

## Overview

VideoWalker is an interactive sponsor ad platform that gamifies the advertisement viewing experience. Users watch sponsor ads, reveal secret codes when countdowns expire, and compete to be the first to submit the code to win prizes. The application follows a "Watch. Reveal. Win." concept with a mobile-first design inspired by modern gaming and social platforms.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **UI Library**: Radix UI primitives with shadcn/ui components
- **Styling**: Tailwind CSS with custom design system
- **State Management**: TanStack Query for server state management
- **Build Tool**: Vite with custom configuration for development and production

### Design System
- **Color Scheme**: Gaming-inspired with vibrant purple primary (280 85% 60%), dark backgrounds for mobile viewing
- **Typography**: Inter and Poppins fonts for clean mobile-optimized text
- **Layout**: Mobile-first 70/30 split (sponsor ad dominant, gift section secondary)
- **Components**: Card-based UI with rounded corners and generous touch targets
- **Themes**: Light/dark mode support with CSS custom properties

### Backend Architecture
- **Runtime**: Node.js with Express server
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Session Storage**: PostgreSQL session store
- **Development**: Vite middleware integration for hot reloading

### Database Design
- **Primary Tables**: 
  - `advertisements` - Stores sponsor ad data, countdown timers, secret codes, and winner information
  - `users` - Admin authentication for platform management
- **Key Features**: UUID primary keys, timestamp-based countdown system, winner tracking

### Page Structure
- **Homepage**: Displays active sponsor ad with countdown timer and gift section
- **Secret Code Page**: Reveals secret code with animation after countdown expires
- **Winners Page**: Historical view of past winners and their prizes
- **Admin Panel**: Management interface for creating and managing advertisement campaigns

### Real-time Features
- **Countdown Timers**: Client-side countdown with automatic state transitions
- **Code Reveal System**: Animated secret code revelation when timer expires
- **Winner Declaration**: Dynamic UI updates when winners are announced

### Mobile-First Design
- **Responsive Layout**: 70% sponsor ad, 30% gift section on mobile
- **Touch Optimization**: Minimum 44px touch targets throughout
- **Bottom Navigation**: Mobile tab navigation for core pages
- **Gaming Aesthetics**: Celebration animations, pulsing effects, and visual feedback

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, TypeScript support
- **Routing**: Wouter for lightweight routing
- **State Management**: TanStack Query for server state and caching

### UI and Styling
- **Component Library**: Radix UI primitives for accessible components
- **Styling**: Tailwind CSS with PostCSS and Autoprefixer
- **Icons**: Lucide React for consistent iconography
- **Utilities**: class-variance-authority, clsx for component styling

### Database and Backend
- **Database**: PostgreSQL via Neon serverless
- **ORM**: Drizzle ORM with Drizzle Kit for migrations
- **Validation**: Zod for runtime type validation
- **Session Management**: connect-pg-simple for PostgreSQL sessions

### Development Tools
- **Build System**: Vite with custom configuration
- **Development**: tsx for TypeScript execution, esbuild for production builds
- **Replit Integration**: Custom plugins for development environment
- **Type Checking**: TypeScript with strict configuration

### Authentication (Prepared)
- **Firebase**: Ready for Google authentication integration
- **Services**: Auth, Firestore, and Storage configured but not yet implemented

### Date and Utilities
- **Date Handling**: date-fns for countdown calculations and formatting
- **Form Management**: React Hook Form with Hookform resolvers for validation
- **Carousel**: Embla Carousel for potential image galleries