"use client"

import { useState } from 'react';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AutoRefresh } from '@/components/auto-refresh';
import { CheckNowButton } from '@/components/check-now-button';
import { UptimeBar } from '@/components/uptime-bar';
import { StatsSidebar } from '@/components/stats-sidebar';
import { MonitorActions } from '@/components/monitor-actions';
import { IssueDetailsTrigger } from '@/components/issue-details-trigger';
import { ArrowUp, ArrowDown, Pause, Clock } from 'lucide-react';

function formatInterval(seconds: number) {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
}

export default function MonitorsClient({ monitors }: { monitors: any[] }) {
    const [search, setSearch] = useState("");
    const filtered = monitors.filter(m =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.url.toLowerCase().includes(search.toLowerCase())
    );
    return (
        <div className="flex min-h-screen">
            <div className="flex-1 space-y-6 pb-10">
                <Header title="Monitors" />
                <AutoRefresh />
                <div className="px-6 space-y-6">
                    <div className="flex items-center gap-4 bg-card/50 p-2 rounded-lg border">
                        <div className="flex items-center gap-2 px-2 w-full">
                            <input
                                type="text"
                                placeholder="Search by name or url"
                                className="bg-transparent border-none outline-none text-sm w-64 placeholder:text-muted-foreground"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                    {filtered.length === 0 ? (
                        <div className="text-center py-12 border rounded-lg bg-card border-dashed">
                            <h3 className="text-lg font-medium">No monitors found</h3>
                            <p className="text-muted-foreground mb-4">Try a different search or add a new monitor.</p>
                            <Link href="/dashboard/monitors/new">
                                <Button>Add Monitor</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {filtered.map((monitor) => (
                                <div key={monitor.id} data-monitor-id={monitor.id} className="group flex items-center justify-between p-4 border rounded-lg bg-card hover:border-primary/50 transition-all shadow-sm">
                                    {/* ...existing monitor card code... */}
                                    <div className="min-w-[200px] flex items-center gap-2">
                                        <span className="flex items-center text-sm font-bold">
                                            {monitor.status === 'down' && (
                                                <ArrowDown className="w-4 h-4 text-red-500" />
                                            )}
                                            {(monitor.status === 'up' || monitor.status === 'active') && (
                                                <ArrowUp className="w-4 h-4 text-green-500" />
                                            )}
                                            {monitor.status === 'pending' && (
                                                <Clock className="w-4 h-4 text-yellow-600" />
                                            )}
                                            {monitor.status === 'paused' && (
                                                <Pause className="w-4 h-4 text-gray-400" />
                                            )}
                                        </span>
                                        <h3 className="font-bold text-base">{monitor.name}</h3>
                                        <div className="flex flex-col gap-0.5 text-xs text-muted-foreground mt-0.5">
                                            <div className="flex items-center gap-2">
                                                <span className="uppercase font-semibold tracking-wider text-[10px] bg-muted px-1.5 py-0.5 rounded">{monitor.type}</span>
                                                <a href={monitor.url} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors truncate max-w-[200px]">{monitor.url}</a>
                                            </div>
                                            {monitor.status === 'down' && monitor.incidents[0]?.reason && (
                                                <IssueDetailsTrigger
                                                    error={monitor.incidents[0].reason}
                                                    monitorName={monitor.name}
                                                    monitorUrl={monitor.url}
                                                    timestamp={monitor.incidents[0].start?.toISOString()}
                                                />
                                            )}
                                        </div>
                                    </div>
                                    {/* Middle: Stats Text */}
                                    <div className="hidden md:block text-xs text-muted-foreground text-right">
                                        <div>{formatInterval(monitor.interval)} check</div>
                                    </div>
                                    {/* Right: Check Button & Uptime Bar */}
                                    <div className="flex items-center gap-6">
                                        <div className="hidden lg:flex flex-col items-end gap-1">
                                            <UptimeBar heartbeats={monitor.heartbeats} />
                                            <div className="text-[10px] text-muted-foreground font-mono">
                                                Last 30 checks
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="flex items-center gap-1 text-sm font-bold">
                                                {monitor.status === 'down' && (
                                                    <ArrowDown className="w-4 h-4 text-red-500" />
                                                )}
                                                {monitor.status === 'up' && (
                                                    <ArrowUp className="w-4 h-4 text-green-500" />
                                                )}
                                                {monitor.status === 'pending' && (
                                                    <Clock className="w-4 h-4 text-yellow-600" />
                                                )}
                                                {monitor.status === 'paused' && (
                                                    <Pause className="w-4 h-4 text-gray-400" />
                                                )}
                                                <span className={
                                                    monitor.status === 'down' ? 'text-red-500' :
                                                    monitor.status === 'pending' ? 'text-yellow-600' :
                                                    monitor.status === 'paused' ? 'text-gray-400' :
                                                    'text-green-500'
                                                }>
                                                    {monitor.status === 'down' ? 'DOWN' : monitor.status === 'pending' ? 'PENDING' : monitor.status === 'paused' ? 'PAUSED' : 'UP'}
                                                </span>
                                            </span>
                                            <CheckNowButton monitorId={monitor.id} />
                                            <MonitorActions monitorId={String(monitor.id)} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <StatsSidebar monitors={filtered} />
        </div>
    );
}
