'use client'

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export function Header({ title }: { title?: string }) {
    return (
        <header className="flex h-14 items-center justify-between border-b bg-background/50 backdrop-blur-md px-6 sticky top-0 z-10">
            <h1 className="text-lg font-semibold">{title}</h1>
            <div className="flex items-center gap-4">
                <Link href="/dashboard/monitors/new">
                    <Button size="sm" className="gap-2">
                        <Plus className="h-4 w-4" />
                        New Monitor
                    </Button>
                </Link>
            </div>
        </header>
    )
}
