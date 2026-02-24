import { Header } from '@/components/header'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { Activity, ArrowDown, ArrowUp, AlertCircle, PlayCircle, PauseCircle } from 'lucide-react'
import { redirect } from 'next/navigation'
import Link from 'next/link'

async function getStats(userId: number) {
    const monitors = await prisma.monitor.findMany({
        where: { userId },
    })

    const total = monitors.length
    const up = monitors.filter(m => m.status === 'active').length
    const down = monitors.filter(m => m.status === 'down').length
    const paused = monitors.filter(m => m.status === 'paused').length

    return { total, up: monitors.filter(m => m.status === 'active').length, down, paused }
}

export default async function DashboardPage() {
    const session = await getSession()
    if (!session) redirect('/login')

    const stats = await getStats(Number(session.userId))

    return (
        <div className="space-y-6 pb-8">
            <Header title="Dashboard Overview" />
            <div className="px-4 md:px-6">
                <div className="bg-card rounded-xl shadow-sm border p-6 flex flex-col md:flex-row items-center gap-4 mb-8">
                    <div className="p-3 bg-primary/10 rounded-full">
                        <Activity className="text-primary w-8 h-8" />
                    </div>
                    <div className="text-center md:text-left">
                        <h2 className="text-xl md:text-2xl font-bold">Welcome back!</h2>
                        <p className="text-muted-foreground text-sm">Monitor your services in real time with PulseMonitor.</p>
                    </div>
                </div>
            </div>

            <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-4 md:px-6">
                <StatsCard title="Total Monitors" value={stats.total} icon={Activity} />
                <StatsCard title="Up" value={stats.up} icon={ArrowUp} iconColor="text-green-500" />
                <StatsCard title="Down" value={stats.down} icon={ArrowDown} iconColor="text-red-500" />
                <StatsCard title="Paused" value={stats.paused} icon={PauseCircle} iconColor="text-gray-500" />
            </div>

            <div className="px-4 md:px-6">
                <div className="bg-card rounded-xl border p-8 flex flex-col items-center text-center">
                    <h2 className="text-xl font-semibold mb-4 text-foreground">Want to monitor something new?</h2>
                    <Link href="/dashboard/monitors/new" className="flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 transition shadow-lg shadow-primary/20">
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
