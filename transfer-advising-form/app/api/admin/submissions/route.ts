import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { submissionQuerySchema } from '@/lib/validations';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const query = submissionQuerySchema.parse({
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '20',
      search: searchParams.get('search') || undefined,
      formMode: searchParams.get('formMode') || undefined,
      termSeason: searchParams.get('termSeason') || undefined,
      termYear: searchParams.get('termYear') || undefined,
      from: searchParams.get('from') || undefined,
      to: searchParams.get('to') || undefined,
    });

    const skip = (query.page - 1) * query.limit;

    // Build where clause
    const where: any = {};

    if (query.search) {
      where.OR = [
        { fullName: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
        { phone: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.formMode) {
      where.formMode = query.formMode;
    }

    if (query.termSeason) {
      where.termSeason = query.termSeason;
    }

    if (query.termYear) {
      where.termYear = query.termYear;
    }

    if (query.from || query.to) {
      where.createdAt = {};
      if (query.from) {
        where.createdAt.gte = query.from;
      }
      if (query.to) {
        where.createdAt.lte = query.to;
      }
    }

    // Fetch submissions
    const [submissions, total] = await Promise.all([
      prisma.submission.findMany({
        where,
        skip,
        take: query.limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          createdAt: true,
          formMode: true,
          fullName: true,
          email: true,
          phone: true,
          studyLevel: true,
          termSeason: true,
          termYear: true,
          major: true,
        },
      }),
      prisma.submission.count({ where }),
    ]);

    return NextResponse.json({
      submissions,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        pages: Math.ceil(total / query.limit),
      },
    });
  } catch (error) {
    console.error('Failed to fetch submissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}
