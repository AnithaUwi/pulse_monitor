# Developer Setup Guide

Follow these steps to set up the development environment for PulseMonitor.

## Local Development

### 1. Database Configuration
PulseMonitor uses Prisma with SQLite for local development.
Ensure your `.env` file has the following set:
```env
DATABASE_URL="file:./dev.db"
```

### 2. Running Migrations
Run the following to initialize the database:
```bash
npx prisma migrate dev --name init
```

### 3. Starting the App
```bash
npm run dev
```

## Environment Variables
The application requires the following:
- `DATABASE_URL`: Prisma connection string.
- `SESSION_SECRET`: Random string for JWT encryption.

## Deployment Preparation
To switch to a cloud database (e.g., Supabase):
1. Update `DATABASE_URL` in `.env`.
2. Update `prisma/schema.prisma` to use `provider = "postgresql"`.
3. Run `npx prisma migrate dev` to sync the new database.
