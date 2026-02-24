'use client'

import { useState } from 'react'
import { ErrorDetailsModal } from './error-details-modal'

interface IssueDetailsTriggerProps {
    error: string
    monitorName: string
    monitorUrl: string
    timestamp?: string
}

export function IssueDetailsTrigger({ error, monitorName, monitorUrl, timestamp }: IssueDetailsTriggerProps) {
    const [open, setOpen] = useState(false)

    return (
        <>
            <button
                type="button"
                className="text-red-500 text-xs mt-1 font-medium hover:underline"
                onClick={() => setOpen(true)}
            >
                Issue: {error}
            </button>
            <ErrorDetailsModal
                isOpen={open}
                onClose={() => setOpen(false)}
                error={error}
                monitorName={monitorName}
                monitorUrl={monitorUrl}
                timestamp={timestamp}
            />
        </>
    )
}
