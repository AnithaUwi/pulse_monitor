'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function CheckNowButton({ monitorId }: { monitorId: number }) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleCheck() {
        setLoading(true)
        try {
            await fetch(`/api/monitors/${monitorId}/check`, { method: 'POST' })
            router.refresh()
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleCheck}
            disabled={loading}
            title="Check Status Now"
        >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
    )
}
