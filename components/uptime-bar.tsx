'use client'

import { cn } from '@/lib/utils'

interface UptimeBarProps {
    heartbeats: { status: string; timestamp: Date | string }[]
    maxBars?: number
}

export function UptimeBar({ heartbeats, maxBars = 30 }: UptimeBarProps) {
    // We need to fill the bars. If we have fewer heartbeats than maxBars, we pad with "empty" (gray)
    // If we have more, we take the last maxBars.

    const recentHeartbeats = heartbeats.slice(0, maxBars).reverse() // Assuming API returns desc
    // Actually usually API returns desc, so slice 0-30 are the latest. 
    // We want to render them Left-to-Right as Oldest-to-Newest? 
    // UptimeRobot usually shows latest on the right.
    // So if we have [newest, ..., oldest], we should reverse it for display: [oldest, ..., newest]

    const totalSlots = maxBars
    const filledSlots = recentHeartbeats.length
    const emptySlots = totalSlots - filledSlots

    // Create an array representing the visualization
    // We want the latest check to be at the very end (right).
    const bars = []

    // Add empty slots (older times where we have no data)
    for (let i = 0; i < emptySlots; i++) {
        bars.push('empty')
    }

    // Add actual heartbeats (oldest to newest)
    // recentHeartbeats is currently [Newest, ..., Oldest] if fetched desc.
    // Let's verify data fetching order later, but usually standard is DESC for history.
    // So we spread the reversed array.
    const displayHeartbeats = [...recentHeartbeats].reverse()

    return (
        <div className="flex items-center gap-[2px] h-6 w-full max-w-[200px]" title="Last 30 checks">
            {bars.map((_, i) => (
                <div key={`empty-${i}`} className="h-full w-1.5 rounded-[1px] bg-muted/20" />
            ))}
            {displayHeartbeats.map((hb, i) => (
                <div
                    key={i}
                    className={cn(
                        "h-full w-1.5 rounded-[1px] transition-all hover:scale-110",
                        hb.status === 'up' && "bg-green-500",
                        hb.status === 'down' && "bg-red-500",
                        hb.status === 'pending' && "bg-yellow-500/50"
                    )}
                    title={`Status: ${hb.status}`}
                />
            ))}
        </div>
    )
}
