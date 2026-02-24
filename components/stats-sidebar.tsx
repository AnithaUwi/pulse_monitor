export function StatsSidebar({ monitors }: { monitors: any[] }) {
    const total = monitors.length
    const up = monitors.filter(m => m.status === 'active' || m.status === 'up').length
    const down = monitors.filter(m => m.status === 'down').length
    const paused = monitors.filter(m => m.status === 'paused').length
    const pending = monitors.filter(m => m.status === 'pending').length

    const upPercent = total > 0 ? ((up / total) * 100).toFixed(3) : '0.000'

    return (
        <div className="w-80 border-l bg-card/50 p-6 space-y-8 hidden xl:block h-screen sticky top-0">

            {/* Current Status Widget */}
            <div className="space-y-4">
                <h3 className="font-semibold text-lg">Current status.</h3>

                <div className="bg-card border rounded-xl p-6 flex flex-col items-center justify-center space-y-6 shadow-sm">
                    {/* Donut Chart representation (CSS only for simplicity) */}
                    <div className="relative h-24 w-24 rounded-full border-8 border-muted flex items-center justify-center"
                        style={{
                            borderColor: down > 0 ? '#ef4444' : '#22c55e' // Red if any down, else green
                        }}
                    >
                        {down > 0 ? (
                            <div className="text-red-500 text-3xl">!</div>
                        ) : (
                            <div className="h-4 w-4 rounded-full bg-green-500 shadow-[0_0_10px_theme(colors.green.500)]" />
                        )}
                    </div>

                    <div className="grid grid-cols-4 gap-6 w-full text-center">
                        <div>
                            <div className="text-2xl font-bold text-red-500">{down}</div>
                            <div className="text-xs text-muted-foreground uppercase tracking-wider">Down</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-green-500">{up}</div>
                            <div className="text-xs text-muted-foreground uppercase tracking-wider">Up</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-yellow-500">{pending}</div>
                            <div className="text-xs text-muted-foreground uppercase tracking-wider">Pending</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-muted-foreground">{paused}</div>
                            <div className="text-xs text-muted-foreground uppercase tracking-wider">Paused</div>
                        </div>
                    </div>

                    <div className="text-xs text-center text-muted-foreground">
                        Using {total} of 50 monitors.
                    </div>
                </div>
            </div>

            {/* Last 24 Hours Widget */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">Last 24 hours.</h3>
                </div>

                <div className="bg-card border rounded-xl p-6 space-y-4 shadow-sm">
                    <div className="flex items-baseline justify-between">
                        <div>
                            <div className="text-3xl font-bold text-green-500">{upPercent}%</div>
                            <div className="text-xs text-muted-foreground">Overall uptime</div>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold text-foreground">{0}</div>
                            <div className="text-xs text-muted-foreground">Incidents</div>
                        </div>
                    </div>

                    <div className="pt-4 flex items-center justify-between text-sm">
                        <div>
                            <span className="block font-bold">0m</span>
                            <span className="text-muted-foreground text-xs">Without incid.</span>
                        </div>
                        <div className="text-right">
                            <span className="block font-bold">0</span>
                            <span className="text-muted-foreground text-xs">Affected mon.</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
