import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/session'

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id: idParam } = await params
    const id = parseInt(idParam, 10)
    if (Number.isNaN(id)) {
        return NextResponse.json({ error: `Invalid monitor id: ${idParam}` }, { status: 400 })
    }

    const monitor = await prisma.monitor.findUnique({ where: { id } })
    if (!monitor || monitor.userId !== Number(session.userId)) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    await prisma.monitor.update({
        where: { id },
        data: { status: 'deleted' }
    });

    return NextResponse.json({ success: true })
}
