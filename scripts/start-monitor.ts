// This script is meant to be run with ts-node or similar.
// npx tsx scripts/start-monitor.ts

import { runChecks } from '../lib/monitor'

console.log('Starting PulseMonitor Engine...')

async function loop() {
    try {
        await runChecks()
    } catch (error) {
        console.error('Error in monitoring loop:', error)
    }

    // Simple loop: run every 60 seconds (simplification of individual intervals)
    // A real system would use a priority queue based on nextCheckTime.
    // For MVP, we just check ALL active monitors every 1 minute.
    setTimeout(loop, 60000)
}

// Initial run
loop()
