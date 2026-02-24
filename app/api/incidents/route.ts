import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';

export async function GET(request: Request) {
  const session = await getSession();
  if (!session || !session.userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const userId = Number(session.userId);
  const url = new URL(request.url);
  const page = Number(url.searchParams.get('page') || 1);
  const pageSize = 10;
  const skip = (page - 1) * pageSize;

  const where = {
    monitor: {
      userId: userId,
      status: { not: 'paused' }
    }
  };

  const [incidents, total] = await Promise.all([
    prisma.incident.findMany({
      where,
      orderBy: { start: 'desc' },
      include: { monitor: true },
      skip,
      take: pageSize
    }),
    prisma.incident.count({ where })
  ]);

  const totalPages = Math.ceil(total / pageSize);

  return Response.json({ incidents, totalPages });
}
