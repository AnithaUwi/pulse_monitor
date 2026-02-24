import { NextResponse } from 'next/server'
import { runChecks } from '@/lib/monitor'

// This route should be protected by a secret key in real production
export async function GET() {
    await runChecks()
    return NextResponse.json({ success: true })
}
