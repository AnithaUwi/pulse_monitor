# Architecture Overview

PulseMonitor is built with efficiency and clarity in mind.

## System Components

### 1. Web Frontend (Next.js)
The frontend is built using Next.js 15, utilizing both Server and Client components.
- **Server Components**: Used for initial page loads and secure data fetching from Prisma.
- **Client Components**: Used for interactive elements like the Incident Table and Monitoring Dashboard.

### 2. Database (Prisma + SQLite/Postgres)
Prisma acts as the ORM, providing type-safety across the application.
- **Local**: SQLite for zero-config development.
- **Production**: PostgreSQL for reliability and scaling.

### 3. API Routes
Route Handlers handle asynchronous tasks:
- `/api/monitors`: CRUD operations for monitors.
- `/api/incidents`: Paginated fetching of service incidents.
- `/api/cron`: Trigger point for health checks.

### 4. Monitoring Engine
A background process (triggered via cron) that performs HTTP requests to registered URLs and records 'heartbeats' and 'incidents' based on response status codes and timeouts.

## Data Model

- **User**: Authentication and ownership.
- **Monitor**: Service configuration (URL, interval, status).
- **Heartbeat**: Periodic health checks.
- **Incident**: Log of service failures and resolutions.
