import { NextResponse } from 'next/server'
import { checkMonitor } from '@/lib/monitor'
import { getSession } from '@/lib/session'

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id: idParam } = await params
    const id = Number(idParam)
    await checkMonitor(id)

    return NextResponse.json({ success: true })
}
