# PulseMonitor

Advanced uptime and service monitoring application. PulseMonitor helps you track the reliability of your websites and services with real-time alerts and high-fidelity incident logging.

![PulseMonitor Dashboard](/pulse-banner.png)

## Features

- **Real-time Monitoring**: HTTP(s) monitoring with configurable intervals.
- **Incident Management**: Detailed incident logs with root cause analysis and downtime duration.
- **Visual Status Pages**: High-fidelity uptime bars and status indicators.
- **User Segregation**: Each user manages their own monitors and incidents.
- **Modern UI**: Sleek dark-themed interface inspired by professional monitoring tools.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Database**: [Prisma](https://www.prisma.io/) with SQLite (local) / PostgreSQL (production)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) & [Lucide React](https://lucide.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Authentication**: JWT-based secure sessions

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/AnithaUwi/pulse_monitor.git
   cd pulse_monitor
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root:
   ```env
   DATABASE_URL="file:./dev.db"
   SESSION_SECRET="your-super-secret-key"
   ```

4. Initialize the database:
   ```bash
   npx prisma migrate dev
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Architecture

PulseMonitor follows a modern full-stack architecture:
- **Frontend**: React Server Components for data fetching and Client Components for interactivity.
- **API**: Edge-ready Next.js Route Handlers.
- **Monitoring Engine**: Background cron jobs for service health checks.

## License

This project is licensed under the MIT License.
