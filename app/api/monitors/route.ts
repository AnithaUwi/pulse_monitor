import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/session'

export async function POST(request: Request) {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const data = await request.json()
        const { name, url, type, interval, keyword } = data

        if (type !== 'http') {
            return NextResponse.json({ error: 'Only HTTP monitors are supported right now.' }, { status: 400 })
        }

        const rawUrl = typeof url === 'string' ? url.trim() : ''
        if (!rawUrl) {
            return NextResponse.json({ error: 'URL is required.' }, { status: 400 })
        }

        const normalizedUrl = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`
        let parsedUrl: URL

        try {
            parsedUrl = new URL(normalizedUrl)
        } catch {
            return NextResponse.json({ error: 'Invalid URL. Use a full domain like https://example.com.' }, { status: 400 })
        }

        if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
            return NextResponse.json({ error: 'Only http/https URLs are supported.' }, { status: 400 })
        }

        const monitor = await prisma.monitor.create({
            data: {
                userId: Number(session.userId),
                name,
                url: parsedUrl.toString(),
                type,
                interval,
                keyword,
                status: 'pending'
            },
        })

        return NextResponse.json(monitor)
    } catch (error) {
        console.error('Error creating monitor:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function GET(request: Request) {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const monitors = await prisma.monitor.findMany({
        where: { userId: Number(session.userId) },
        orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(monitors)
}
