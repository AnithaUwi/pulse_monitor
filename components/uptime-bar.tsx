'use client'

import { cn } from '@/lib/utils'

interface UptimeBarProps {
    heartbeats: { status: string; timestamp: Date | string }[]
    maxBars?: number
}

export function UptimeBar({ heartbeats, maxBars = 30 }: UptimeBarProps) {
    const recentHeartbeats = heartbeats.slice(0, maxBars)

    const totalSlots = maxBars
    const filledSlots = recentHeartbeats.length
    const emptySlots = totalSlots - filledSlots

    const bars = Array(emptySlots).fill('empty')
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
