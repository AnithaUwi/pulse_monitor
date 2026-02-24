
import { getSession } from '@/lib/session';
import MonitorsClient from './MonitorsClient'

export default async function MonitorsPage() {
    const session = await getSession()
    if (!session) redirect('/login')

    const monitors = await prisma.monitor.findMany({
        where: { userId: Number(session.userId) },
        orderBy: { createdAt: 'desc' },
        include: {
            heartbeats: {
                take: 30, // Get last 30 heartbeats for the bar
                orderBy: { timestamp: 'desc' }
            },
            incidents: {
                take: 1,
                orderBy: { start: 'desc' },
                select: { reason: true, start: true }
            },
            _count: {
                select: { incidents: true }
            }
        }
    })

    return <MonitorsClient monitors={monitors} />
}
