'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'


export default function NewMonitorPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)



    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const data = {
            name: formData.get('name'),
            url: formData.get('url'),
            keyword: formData.get('keyword'),
            type: formData.get('type'),
            interval: Number(formData.get('interval')),
        }

        try {
            const res = await fetch('/api/monitors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })

            if (!res.ok) {
                const payload = await res.json().catch(() => null)
                const message = payload?.error || 'Failed to create monitor'
                throw new Error(message)
            }

            router.push('/dashboard')
            router.refresh()
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error creating monitor'
            console.error(error)
            alert(message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <Header title="Add New Monitor" />
            <div className="px-6 max-w-2xl">
                <form onSubmit={handleSubmit} className="space-y-4 border p-6 rounded-lg bg-card">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Friendly Name</label>
                        <Input name="name" placeholder="My Website" required />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">URL (or IP)</label>
                        <Input name="url" placeholder="https://example.com" required />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Keyword (Optional)</label>
                        <Input name="keyword" placeholder="e.g. Welcome" />
                        <p className="text-xs text-muted-foreground">Mark as DOWN if this text is missing from the page.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Monitor Type</label>
                            <select
                                name="type"
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                defaultValue="http"
                            >
                                <option value="http" className="bg-popover text-popover-foreground">HTTP(s)</option>
                                <option value="ping" className="bg-popover text-popover-foreground" disabled>Ping (coming soon)</option>
                                <option value="port" className="bg-popover text-popover-foreground" disabled>Port (coming soon)</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Monitoring Interval</label>
                            <select
                                name="interval"
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                defaultValue="60"
                            >
                                <option value="60" className="bg-popover text-popover-foreground">Every 1 minute</option>
                                <option value="300" className="bg-popover text-popover-foreground">Every 5 minutes</option>
                                <option value="900" className="bg-popover text-popover-foreground">Every 15 minutes</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-2">
                        <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Monitor'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
