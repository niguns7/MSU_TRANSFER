import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { submissionQuerySchema } from '@/lib/validations';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse query parameters (same as list endpoint)
    const searchParams = request.nextUrl.searchParams;
    const query = submissionQuerySchema.parse({
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '999999', // Get all for export
      search: searchParams.get('search') || undefined,
      formMode: searchParams.get('formMode') || undefined,
      termSeason: searchParams.get('termSeason') || undefined,
      termYear: searchParams.get('termYear') || undefined,
      from: searchParams.get('from') || undefined,
      to: searchParams.get('to') || undefined,
    });

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

    // Fetch all matching submissions
    const submissions = await prisma.submission.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    // Generate CSV
    const headers = [
      'ID',
      'Created At',
      'Form Mode',
      'Full Name',
      'Email',
      'Phone',
      'Date of Birth',
      'Address',
      'Study Level',
      'Previous College',
      'Previous Credit Hours',
      'Current College',
      'Current Credit Hours',
      'Intended College',
      'Planned Credit Hours',
      'Term Year',
      'Term Season',
      'Major',
      'Switching Major',
      'Switch Major Details',
      'Previous GPA',
      'Expected GPA',
      'Previous Tuition',
      'Current Tuition',
      'Has Scholarship',
      'Scholarship Amount',
      'Paying Per Semester',
      'Transfer Reason',
      'Institution Reason',
      'Extracurriculars',
      'Immigration Status',
      'Special Circumstances',
      'Referred By',
      'How Did You Know',
      'Preferred Channel Link',
      'Preferred Channel',
      'Consent',
    ];

    const rows = submissions.map((s) => [
      s.id,
      s.createdAt.toISOString(),
      s.formMode,
      s.fullName,
      s.email,
      s.phone,
      s.dateOfBirth?.toISOString().split('T')[0] || '',
      s.address || '',
      s.studyLevel || '',
      s.previousCollege || '',
      s.previousCreditHours || '',
      s.currentCollege || '',
      s.currentCreditHours || '',
      s.intendedCollege || '',
      s.plannedCreditHours || '',
      s.termYear || '',
      s.termSeason || '',
      s.major || '',
      s.switchingMajor || '',
      s.switchMajorDetails || '',
      s.previousGPA?.toString() || '',
      s.expectedGPA?.toString() || '',
      s.previousTuition?.toString() || '',
      s.currentTuition?.toString() || '',
      s.hasScholarship || '',
      s.scholarshipAmount?.toString() || '',
      s.payingPerSemester?.toString() || '',
      s.transferReason || '',
      s.institutionReason || '',
      s.extracurriculars || '',
      s.immigrationStatus || '',
      s.specialCircumstances || '',
      s.referredBy || '',
      s.howDidYouKnow || '',
      s.preferredChannelLink || '',
      s.preferredChannel || '',
      s.consent,
    ]);

    // Escape CSV values
    const escapeCsvValue = (value: any): string => {
      const str = String(value ?? '');
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const csv = [
      headers.map(escapeCsvValue).join(','),
      ...rows.map((row) => row.map(escapeCsvValue).join(',')),
    ].join('\n');

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="submissions-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Failed to export submissions:', error);
    return NextResponse.json(
      { error: 'Failed to export submissions' },
      { status: 500 }
    );
  }
}
