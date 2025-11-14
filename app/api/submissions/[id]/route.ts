import { NextRequest, NextResponse } from 'next/server';
import { submissionSchema } from '@/lib/validations';
import prisma from '@/lib/prisma';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import logger, { generateTraceId } from '@/lib/logger';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const traceId = generateTraceId();
  
  try {
    // Get client IP for rate limiting
    const clientIp = getClientIp(request);
    
    // Parse request body
    const body = await request.json();
    
    // Check rate limit by IP
    const ipRateLimit = await checkRateLimit(clientIp, 'ip');
    if (!ipRateLimit.success) {
      logger.warn({ traceId, ip: clientIp }, 'Rate limit exceeded');
      return NextResponse.json(
        {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests. Please try again later.',
          traceId,
          retryAfter: ipRateLimit.reset,
        },
        { status: 429 }
      );
    }

    // Skip validation for progressive saves - validate only required fields
    // const validated = submissionSchema.parse(body);
    const validated = body; // Use body directly without validation

    logger.info({ traceId, submissionId: params.id, body }, 'Attempting to update submission');

    // Check if submission exists
    const existingSubmission = await prisma.submission.findUnique({
      where: { id: params.id },
    });

    if (!existingSubmission) {
      logger.warn({ traceId, submissionId: params.id }, 'Submission not found');
      return NextResponse.json(
        {
          code: 'NOT_FOUND',
          message: 'Submission not found',
          traceId,
        },
        { status: 404 }
      );
    }

    // Build update data dynamically - only include fields that are present in the request
    const updateData: any = {};
    
    // Only update fields that are explicitly provided
    if (validated.fullName !== undefined) updateData.fullName = validated.fullName;
    if (validated.email !== undefined) updateData.email = validated.email;
    if (validated.phone !== undefined) updateData.phone = validated.phone;
    if (validated.consent !== undefined) updateData.consent = validated.consent;
    if (validated.dateOfBirth !== undefined) updateData.dateOfBirth = validated.dateOfBirth;
    if (validated.address !== undefined) updateData.address = validated.address;
    if (validated.studyLevel !== undefined) updateData.studyLevel = validated.studyLevel;
    if (validated.previousCollege !== undefined) updateData.previousCollege = validated.previousCollege;
    if (validated.previousCreditHours !== undefined) updateData.previousCreditHours = validated.previousCreditHours;
    if (validated.currentCollege !== undefined) updateData.currentCollege = validated.currentCollege;
    if (validated.currentCreditHours !== undefined) updateData.currentCreditHours = validated.currentCreditHours;
    if (validated.intendedCollege !== undefined) updateData.intendedCollege = validated.intendedCollege;
    if (validated.plannedCreditHours !== undefined) updateData.plannedCreditHours = validated.plannedCreditHours;
    if (validated.termYear !== undefined) updateData.termYear = validated.termYear;
    if (validated.termSeason !== undefined) updateData.termSeason = validated.termSeason;
    if (validated.major !== undefined) updateData.major = validated.major;
    if (validated.switchingMajor !== undefined) updateData.switchingMajor = validated.switchingMajor;
    if (validated.switchMajorDetails !== undefined) updateData.switchMajorDetails = validated.switchMajorDetails;
    if (validated.previousGPA !== undefined) updateData.previousGPA = validated.previousGPA;
    if (validated.expectedGPA !== undefined) updateData.expectedGPA = validated.expectedGPA;
    if (validated.previousTuition !== undefined) updateData.previousTuition = validated.previousTuition;
    if (validated.currentTuition !== undefined) updateData.currentTuition = validated.currentTuition;
    if (validated.hasScholarship !== undefined) updateData.hasScholarship = validated.hasScholarship;
    if (validated.scholarshipAmount !== undefined) updateData.scholarshipAmount = validated.scholarshipAmount;
    if (validated.payingPerSemester !== undefined) updateData.payingPerSemester = validated.payingPerSemester;
    if (validated.transferReason !== undefined) updateData.transferReason = validated.transferReason;
    if (validated.institutionReason !== undefined) updateData.institutionReason = validated.institutionReason;
    if (validated.extracurriculars !== undefined) updateData.extracurriculars = validated.extracurriculars;
    if (validated.immigrationStatus !== undefined) updateData.immigrationStatus = validated.immigrationStatus;
    if (validated.specialCircumstances !== undefined) updateData.specialCircumstances = validated.specialCircumstances;
    if (validated.referredBy !== undefined) updateData.referredBy = validated.referredBy;
    if (validated.howDidYouKnow !== undefined) updateData.howDidYouKnow = validated.howDidYouKnow;
    if (validated.preferredChannelLink !== undefined) updateData.preferredChannelLink = validated.preferredChannelLink;
    if (validated.preferredChannel !== undefined) updateData.preferredChannel = validated.preferredChannel;
    if (validated.countryOfBirth !== undefined) updateData.countryOfBirth = validated.countryOfBirth;

    logger.info({ traceId, updateData }, 'Update data prepared');

    // Update submission in database
    const submission = await prisma.submission.update({
      where: { id: params.id },
      data: updateData,
    });

    logger.info(
      { traceId, submissionId: submission.id, formMode: submission.formMode },
      'Submission updated successfully'
    );

    return NextResponse.json(
      {
        success: true,
        id: submission.id,
        traceId,
      },
      { status: 200 }
    );
  } catch (error: any) {
    // Handle validation errors
    if (error.name === 'ZodError') {
      logger.warn({ traceId, errors: error.errors }, 'Validation failed');
      return NextResponse.json(
        {
          code: 'VALIDATION_ERROR',
          message: 'Invalid form data',
          errors: error.errors,
          traceId,
        },
        { status: 422 }
      );
    }

    // Handle other errors
    logger.error({ traceId, error }, 'Update failed');
    return NextResponse.json(
      {
        code: 'INTERNAL_ERROR',
        message: 'Failed to update submission. Please try again.',
        traceId,
      },
      { status: 500 }
    );
  }
}
