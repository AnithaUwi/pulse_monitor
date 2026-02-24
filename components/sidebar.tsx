'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, Activity, Settings, LogOut, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { ShieldAlert } from 'lucide-react';

const navigation = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Monitors', href: '/dashboard/monitors', icon: Activity },
    { name: 'Incidents', href: '/dashboard/incidents', icon: ShieldAlert },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

interface SidebarProps {
    isOpen?: boolean
    onClose?: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname()
    const router = useRouter()

    async function handleLogout() {
        await fetch('/api/auth/logout', { method: 'POST' })
        router.push('/login')
        router.refresh()
    }

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
                    onClick={onClose}
                />
            )}

            <div className={cn(
                "fixed inset-y-0 left-0 z-50 flex h-full w-64 flex-col border-r bg-card backdrop-blur-xl text-card-foreground transition-transform duration-300 lg:static lg:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Logo and pulse icon */}
                <div className="flex h-16 items-center justify-between border-b px-6">
                    <Link href="/dashboard" className="flex items-center gap-2 font-bold text-2xl" onClick={onClose}>
                        <span className="text-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-activity"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
                        </span>
                        <span>PulseMonitor</span>
                    </Link>
                    <button className="lg:hidden p-2 -mr-2" onClick={onClose}>
                        <X className="h-6 w-6" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto py-4">
                    <nav className="space-y-2 px-2">
                        <div className="mb-2 text-xs font-semibold text-muted-foreground tracking-widest uppercase px-3">Main</div>
                        {navigation.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={onClose}
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-3 py-2 text-base font-semibold transition-colors",
                                        isActive
                                            ? "bg-primary/10 text-primary shadow"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    )}
                                >
                                    <item.icon className="h-5 w-5" />
                                    {item.name}
                                </Link>
                            )
                        })}
                        <div className="my-4 border-t border-border" />
                    </nav>
                </div>
                <div className="border-t p-4">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-base font-semibold text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    >
                        <LogOut className="h-5 w-5" />
                        Sign out
                    </button>
                </div>
            </div>
        </>
    )
}
