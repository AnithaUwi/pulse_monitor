import { Header } from '@/components/header'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { notFound, redirect } from 'next/navigation'
import { CheckCircle, XCircle, AlertTriangle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function MonitorDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await getSession()
    if (!session) redirect('/login')

    const { id: idParam } = await params
    const id = Number(idParam)
    if (isNaN(id)) notFound()

    const monitor = await prisma.monitor.findUnique({
        where: { id },
        include: {
            heartbeats: {
                orderBy: { timestamp: 'desc' },
                take: 50
            },
            incidents: {
                orderBy: { start: 'desc' },
                take: 10
            }
        }
    })

    if (!monitor || monitor.userId !== Number(session.userId)) notFound()

    return (
        <div className="space-y-6">
            <div className="px-6 pt-4">
                <Link href="/dashboard/monitors" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="mr-1 h-4 w-4" /> Back to Monitors
                </Link>
            </div>
            <Header title={`Monitor: ${monitor.name}`} />

            <div className="px-6 space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                    <Card
                        title="Current Status"
                        value={formatStatus(monitor.status)}
                        icon={monitor.status === 'active' || monitor.status === 'up' ? CheckCircle : monitor.status === 'pending' ? AlertTriangle : XCircle}
                        className={monitor.status === 'active' || monitor.status === 'up' ? 'text-green-500' : monitor.status === 'pending' ? 'text-yellow-600' : 'text-red-500'}
                    />
                    <Card title="URL" value={monitor.url} className="truncate text-sm" />
                    <Card title="Check Interval" value={`${monitor.interval}s`} />
                </div>

                <div className="border rounded-lg bg-card overflow-hidden">
                    <div className="p-4 border-b">
                        <h3 className="font-medium">Recent Heartbeats</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto p-0">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 text-muted-foreground sticky top-0">
                                <tr>
                                    <th className="p-3">Time</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3">Latency</th>
                                </tr>
                            </thead>
                            <tbody>
                                {monitor.heartbeats.map(hb => (
                                    <tr key={hb.id} className="border-t hover:bg-muted/50">
                                        <td className="p-3">{new Date(hb.timestamp).toLocaleString()}</td>
                                        <td className="p-3">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${hb.status === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {hb.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="p-3">{hb.latency}ms</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="border rounded-lg bg-card overflow-hidden">
                    <div className="p-4 border-b">
                        <h3 className="font-medium">Incidents History</h3>
                    </div>
                    <div className="p-0">
                        {monitor.incidents.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground">No incidents recorded. Good job!</div>
                        ) : (
                            <table className="w-full text-sm text-left">
                                <thead className="bg-muted/50 text-muted-foreground">
                                    <tr>
                                        <th className="p-3">Started</th>
                                        <th className="p-3">Ended</th>
                                        <th className="p-3">Reason</th>
                                        <th className="p-3">Duration</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {monitor.incidents.map(inc => (
                                        <tr key={inc.id} className="border-t hover:bg-muted/50">
                                            <td className="p-3">{new Date(inc.start).toLocaleString()}</td>
                                            <td className="p-3">{inc.end ? new Date(inc.end).toLocaleString() : 'Ongoing'}</td>
                                            <td className="p-3">{inc.reason}</td>
                                            <td className="p-3">
                                                {inc.end
                                                    ? `${Math.round((new Date(inc.end).getTime() - new Date(inc.start).getTime()) / 1000 / 60)} mins`
                                                    : '-'
                                                }
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

function Card({ title, value, icon: Icon, className }: any) {
    return (
        <div className="p-4 border rounded-lg bg-card shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                {Icon && <Icon className="h-4 w-4" />}
                {title}
            </h3>
            <div className={`mt-2 text-xl font-bold ${className}`}>{value}</div>
        </div>
    )
}

function formatStatus(status: string) {
    if (status === 'active' || status === 'up') return 'UP'
    if (status === 'pending') return 'PENDING'
    if (status === 'paused') return 'PAUSED'
    return 'DOWN'
}
