import prisma from './prisma'

export async function checkMonitor(monitorId: number) {
    const monitor = await prisma.monitor.findUnique({
        where: { id: monitorId },
    })

    if (!monitor || monitor.status === 'paused') return

    const start = Date.now()
    let status = 'up'
    let latency = 0
    let errorReason = ''

    try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 15000) // 15s timeout

        console.log(`Checking ${monitor.url} ...`)
        const res = await fetch(monitor.url, {
            method: 'GET',
            signal: controller.signal,
            cache: 'no-store',
            headers: {
                'User-Agent': 'PulseMonitor/1.0'
            }
        })
        clearTimeout(timeoutId)

        latency = Date.now() - start

        if (res.ok) {
            // Check for keyword if it exists
            if (monitor.keyword) {
                const text = await res.text()
                if (text.includes(monitor.keyword)) {
                    status = 'up'
                    console.log(`[UP] ${monitor.url} - Keyword "${monitor.keyword}" found.`)
                } else {
                    status = 'down'
                    errorReason = `Keyword "${monitor.keyword}" missing`
                    console.log(`[DOWN] ${monitor.url} - Keyword missing.`)
                }
            } else {
                status = 'up'
                console.log(`[UP] ${monitor.url} - ${res.status}`)
            }
        } else {
            status = 'down'
            // Provide specific HTTP status descriptions
            const statusDescriptions: Record<number, string> = {
                400: 'Bad Request',
                401: 'Unauthorized',
                403: 'Forbidden',
                404: 'Not Found',
                408: 'Request Timeout',
                429: 'Too Many Requests',
                500: 'Internal Server Error',
                502: 'Bad Gateway',
                503: 'Service Unavailable',
                504: 'Gateway Timeout'
            }
            const description = statusDescriptions[res.status] || res.statusText || 'Error'
            errorReason = `HTTP ${res.status}: ${description}`
            console.log(`[DOWN] ${monitor.url} - ${res.status} ${description}`)
        }
    } catch (error: any) {
        status = 'down'
        latency = Date.now() - start
        
        // Parse error for more specific messages
        const errorMsg = error.message || ''
        
        if (error.name === 'AbortError' || errorMsg.includes('aborted')) {
            errorReason = 'Request Timeout (15s)'
        } else if (errorMsg.includes('ENOTFOUND') || errorMsg.includes('getaddrinfo')) {
            errorReason = 'DNS Resolution Failed (Domain not found)'
        } else if (errorMsg.includes('ECONNREFUSED')) {
            errorReason = 'Connection Refused (Server not responding)'
        } else if (errorMsg.includes('ETIMEDOUT')) {
            errorReason = 'Connection Timeout'
        } else if (errorMsg.includes('ECONNRESET')) {
            errorReason = 'Connection Reset by Server'
        } else if (errorMsg.includes('EHOSTUNREACH')) {
            errorReason = 'Host Unreachable'
        } else if (errorMsg.includes('ENETUNREACH')) {
            errorReason = 'Network Unreachable'
        } else if (errorMsg.includes('certificate') || errorMsg.includes('SSL') || errorMsg.includes('TLS')) {
            errorReason = 'SSL/TLS Certificate Error'
        } else if (errorMsg.includes('fetch failed')) {
            errorReason = 'Network Error (Unable to reach host)'
        } else {
            errorReason = errorMsg || 'Unknown Network Error'
        }
        
        console.log(`[DOWN] ${monitor.url} - ${errorReason}`)
    }

    // Record Heartbeat
    await prisma.heartbeat.create({
        data: {
            monitorId,
            status,
            latency,
        },
    })

    // Check for status change
    // We need to decide if we want to confirm downtime (e.g. 2 fails in a row) but for MVP direct change is fine.
    // Actually, let's just compare with current monitor status.
    // Note: monitor.status in DB is 'active', 'paused', 'down'. 
    // We should probably split 'active' into 'up' and 'down' in the DB column or have a separate 'health' column.
    // For now: 'active' = UP, 'down' = DOWN.

    // If status is pending, we force an update regardless of current 'up'/'down' matching
    const currentStatus = monitor.status === 'down' ? 'down' : (monitor.status === 'pending' ? 'pending' : 'up')

    if (status !== currentStatus || monitor.status === 'pending') {
        // Status Changed!

        // 1. Update Monitor
        // If coming back UP, set to 'active'. If going DOWN, set to 'down'.
        const newDbStatus = status === 'up' ? 'active' : 'down'

        await prisma.monitor.update({
            where: { id: monitorId },
            data: { status: newDbStatus }
        })

        // 2. Handle Incidents
        if (status === 'down') {
            // Create Incident
            await prisma.incident.create({
                data: {
                    monitorId,
                    start: new Date(),
                    reason: errorReason
                }
            })
            // TODO: Send Alert Email
            console.log(`[ALERT] Monitor ${monitor.name} is DOWN: ${errorReason}`)
        } else {
            // Close Incident
            // Find latest open incident
            const lastIncident = await prisma.incident.findFirst({
                where: { monitorId, end: null },
                orderBy: { start: 'desc' }
            })

            if (lastIncident) {
                await prisma.incident.update({
                    where: { id: lastIncident.id },
                    data: { end: new Date() }
                })
            }
            console.log(`[ALERT] Monitor ${monitor.name} is back UP.`)
        }
    }
}

export async function runChecks() {
    console.log('Running checks...')
    const monitors = await prisma.monitor.findMany({
        where: {
            status: { not: 'paused' }
        },
        include: {
            heartbeats: {
                orderBy: { timestamp: 'desc' },
                take: 1
            }
        }
    })

    const now = Date.now()

    for (const monitor of monitors) {
        const lastHeartbeat = monitor.heartbeats[0]
        const lastCheckAt = lastHeartbeat ? lastHeartbeat.timestamp.getTime() : 0
        const nextCheckAt = lastCheckAt + monitor.interval * 1000

        if (lastHeartbeat && now < nextCheckAt) {
            continue
        }
        // We could run these in parallel but for SQLite connection limit, maybe sequential or limited concurrency is better.
        // For MVP, sequential or Promise.all is fine.
        await checkMonitor(monitor.id)
    }
    console.log(`Checked ${monitors.length} monitors.`)
}
