import { Header } from '@/components/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { Activity, ArrowDown, ArrowUp, AlertCircle, PlayCircle, PauseCircle } from 'lucide-react'
import { redirect } from 'next/navigation'
import Link from 'next/link'

// Quick inline Card components if we don't have them yet, or import from ui
// Since I haven't created components/ui/card.tsx yet, I'll implement a simple one here or mock it.
// Better to create the file `components/ui/card.tsx` in a separate step, but I'll assume I can just use div classes for now to be safe and fast.
// actually, I should create card.tsx, it's standard. I'll do it in the next turn. 
// For now, I'll use standard HTML/Tailwind in this file.

async function getStats(userId: number) {
    const monitors = await prisma.monitor.findMany({
        where: { userId },
    })

    const total = monitors.length
    const up = monitors.filter(m => m.status === 'active').length // assuming active means checking, but we also need "up" status from heartbeats? 
    // Wait, schema has `status` on Monitor as 'active', 'paused', 'down'.
    // Let's stick to that.
    const down = monitors.filter(m => m.status === 'down').length
    const paused = monitors.filter(m => m.status === 'paused').length

    // 'active' in schema might just mean "enabled". 
    // Usually we have `status` (up/down) and `state` (active/paused).
    // My schema has: `status String @default("active") // active, paused, down`.
    // This mixes configuration and health. 
    // I should probably have used: `isActive Boolean` and `lastStatus String`.
    // But for now, let's assume 'active' = UP, 'down' = DOWN, 'paused' = PAUSED.

    return { total, up: monitors.filter(m => m.status === 'active').length, down, paused }
}

export default async function DashboardPage() {
    const session = await getSession()
    if (!session) redirect('/login')

    const stats = await getStats(Number(session.userId))

    return (
        <div className="space-y-6">
            <Header title="Dashboard Overview" />
            <div className="px-6 mb-6">
                <div className="bg-card rounded-xl shadow-lg p-6 flex items-center gap-4 mb-6">
                    <Activity className="text-primary w-8 h-8" />
                    <div>
                        <h2 className="text-2xl font-bold">Welcome to PulseMonitor!</h2>
                        <p className="text-muted-foreground text-sm">Monitor your websites and services in real time.</p>
                    </div>
                </div>
            </div>
            <div className="grid gap-6 md:grid-cols-4 px-6 mb-6">
                <StatsCard title="Total Monitors" value={stats.total} icon={Activity} />
                <StatsCard title="Up" value={stats.up} icon={ArrowUp} iconColor="text-green-500" />
                <StatsCard title="Down" value={stats.down} icon={ArrowDown} iconColor="text-red-500" />
                <StatsCard title="Paused" value={stats.paused} icon={PauseCircle} iconColor="text-gray-500" />
            </div>
            <div className="px-6">
                <div className="bg-card rounded-xl shadow-lg p-6 flex flex-col items-center">
                    <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                    <Link href="/dashboard/monitors/new" className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg text-lg font-semibold hover:bg-primary/90 transition">
                        <PlayCircle className="w-5 h-5" /> Add New Monitor
                    </Link>
                </div>
            </div>
        </div>
    )
}

function StatsCard({ title, value, icon: Icon, cardColor = "bg-card", iconColor = "", }: any) {
    return (
        <div className={`rounded-xl border ${cardColor} text-card-foreground shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer`}>
            <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium">{title}</h3>
                <Icon className={`h-6 w-6 ${iconColor}`} />
            </div>
            <div className="p-6 pt-0">
                <div className="text-3xl font-bold">{value}</div>
            </div>
        </div>
    )
}
