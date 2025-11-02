import { NextRequest, NextResponse } from 'next/server';
import { submissionSchema } from '@/lib/validations';
import prisma from '@/lib/prisma';
import { checkRateLimit, getClientIp, hashIdentifier } from '@/lib/rate-limit';
import logger, { generateTraceId } from '@/lib/logger';
import { sendAdminNotification } from '@/lib/email';

export async function POST(request: NextRequest) {
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

    // Check rate limit by email
    if (body.email) {
      const emailRateLimit = await checkRateLimit(body.email, 'email');
      if (!emailRateLimit.success) {
        logger.warn({ traceId, email: body.email }, 'Email rate limit exceeded');
        return NextResponse.json(
          {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many submissions from this email. Please try again later.',
            traceId,
            retryAfter: emailRateLimit.reset,
          },
          { status: 429 }
        );
      }
    }

    // Validate input
    const validated = submissionSchema.parse(body);

    // Hash IP for privacy
    const ipHash = hashIdentifier(clientIp, 'ip');
    const userAgent = request.headers.get('user-agent') || undefined;

    // Create submission in database
    const submission = await prisma.submission.create({
      data: {
        formMode: validated.formMode,
        fullName: validated.fullName,
        email: validated.email,
        phone: validated.phone,
        consent: validated.consent,
        ipHash,
        ua: userAgent,
        
        // Conditional fields based on form mode
        ...(validated.formMode === 'full' && {
          dateOfBirth: validated.dateOfBirth,
          address: validated.address,
          studyLevel: validated.studyLevel,
          previousCollege: validated.previousCollege,
          previousCreditHours: validated.previousCreditHours,
          currentCollege: validated.currentCollege,
          currentCreditHours: validated.currentCreditHours,
          intendedCollege: validated.intendedCollege,
          plannedCreditHours: validated.plannedCreditHours,
          termYear: validated.termYear,
          termSeason: validated.termSeason,
          major: validated.major,
          switchingMajor: validated.switchingMajor,
          switchMajorDetails: validated.switchMajorDetails,
          previousGPA: validated.previousGPA,
          expectedGPA: validated.expectedGPA,
          previousTuition: validated.previousTuition,
          currentTuition: validated.currentTuition,
          hasScholarship: validated.hasScholarship,
          scholarshipAmount: validated.scholarshipAmount,
          payingPerSemester: validated.payingPerSemester,
          transferReason: validated.transferReason,
          institutionReason: validated.institutionReason,
          extracurriculars: validated.extracurriculars,
          immigrationStatus: validated.immigrationStatus,
          specialCircumstances: validated.specialCircumstances,
          referredBy: validated.referredBy,
          howDidYouKnow: validated.howDidYouKnow,
          preferredChannelLink: validated.preferredChannelLink,
          preferredChannel: validated.preferredChannel,
        }),
      },
    });

    logger.info(
      { traceId, submissionId: submission.id, formMode: submission.formMode },
      'Submission created successfully'
    );

    // Send admin notification email (async, don't wait)
    sendAdminNotification({
      id: submission.id,
      fullName: submission.fullName,
      email: submission.email,
      formMode: submission.formMode,
    }).catch((err) => {
      logger.error({ traceId, error: err }, 'Failed to send admin notification');
    });

    return NextResponse.json(
      {
        success: true,
        id: submission.id,
        traceId,
      },
      { status: 201 }
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
    logger.error({ traceId, error }, 'Submission failed');
    return NextResponse.json(
      {
        code: 'INTERNAL_ERROR',
        message: 'Failed to process submission. Please try again.',
        traceId,
      },
      { status: 500 }
    );
  }
}
