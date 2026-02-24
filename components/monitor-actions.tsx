'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export function MonitorActions({ monitorId }: { monitorId: number | string }) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const rootRef = useRef<HTMLDivElement>(null)

    async function handleDelete() {
        let id = typeof monitorId === 'string' ? Number(monitorId) : monitorId
        if (!Number.isFinite(id)) {
            const attr = rootRef.current?.closest('[data-monitor-id]')?.getAttribute('data-monitor-id')
            id = attr ? Number(attr) : id
        }
        if (!Number.isFinite(id)) {
            const raw = typeof monitorId === 'string' ? monitorId : JSON.stringify(monitorId)
            alert(`Invalid monitor id: ${raw}`)
            return
        }

        const confirmed = window.confirm('Delete this monitor and all its history?')
        if (!confirmed) return

        setLoading(true)
        try {
            const res = await fetch(`/api/monitors/${encodeURIComponent(String(id))}`, { method: 'DELETE' })
            if (!res.ok) {
                const payload = await res.json().catch(() => null)
                const message = payload?.error || 'Failed to delete monitor'
                throw new Error(message)
            }
            router.refresh()
        } catch (error) {
            console.error(error)
            alert(error instanceof Error ? error.message : 'Failed to delete monitor')
        } finally {
            setLoading(false)
            setOpen(false)
        }
    }

    return (
        <div className="relative" ref={rootRef}>
            <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground"
                onClick={() => setOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={open}
            >
                <span className="sr-only">Menu</span>
                <svg width="15" height="4" viewBox="0 0 15 4" fill="none" xmlns="http://www.w3.org/2000/svg" className="fill-current">
                    <path d="M2.5 0C3.88071 0 5 1.11929 5 2.5C5 3.88071 3.88071 5 2.5 5C1.11929 5 0 3.88071 0 2.5C0 1.11929 1.11929 0 2.5 0Z" />
                    <path d="M7.5 0C8.88071 0 10 1.11929 10 2.5C10 3.88071 8.88071 5 7.5 5C6.11929 5 5 3.88071 5 2.5C5 1.11929 6.11929 0 7.5 0Z" />
                    <path d="M12.5 0C13.8807 0 15 1.11929 15 2.5C15 3.88071 13.8807 5 12.5 5C11.1193 5 10 3.88071 10 2.5C10 1.11929 11.1193 0 12.5 0Z" />
                </svg>
            </Button>

            {open && (
                <div
                    className="absolute right-0 mt-2 w-40 rounded-md border bg-popover text-popover-foreground shadow-lg z-10"
                    role="menu"
                >
                    <button
                        type="button"
                        className="w-full text-left px-3 py-2 text-sm hover:bg-muted"
                        onClick={handleDelete}
                        disabled={loading}
                        role="menuitem"
                    >
                        {loading ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            )}
        </div>
    )
}
