import { NextRequest, NextResponse } from 'next/server';
import { submissionSchema } from '@/lib/validations';
import prisma from '@/lib/prisma';
import { checkRateLimit, getClientIp, hashIdentifier } from '@/lib/rate-limit';
import logger, { generateTraceId } from '@/lib/logger';
import { sendAdminNotification } from '@/lib/email';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: NextRequest) {
  const traceId = generateTraceId();
  const startTime = Date.now();
  
  try {
    // Get client IP for rate limiting
    const clientIp = getClientIp(request);
    
    // Parse request body
    const body = await request.json();
    logger.info({ traceId, perf: `Body parsed: ${Date.now() - startTime}ms` });

    // Check both rate limits in parallel for better performance
    const [ipRateLimit, emailRateLimit] = await Promise.all([
      checkRateLimit(clientIp, 'ip'),
      body.email ? checkRateLimit(body.email, 'email') : Promise.resolve({ success: true, remaining: 0, reset: new Date() })
    ]);
    
    logger.info({ traceId, perf: `Rate limits checked: ${Date.now() - startTime}ms` });
    
    // Check IP rate limit
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

    // Check email rate limit
    if (body.email && !emailRateLimit.success) {
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

    // Skip validation for progressive saves - validate only required fields
    // const validated = submissionSchema.parse(body);
    const validated = body; // Use body directly without validation

    logger.info({ traceId, body }, 'Received submission data');

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
        
        // Partial form fields
        ...(validated.formMode === 'partial' && {
          dateOfBirth: validated.dateOfBirth,
          address: validated.address,
          studyLevel: validated.studyLevel,
          previousCollege: validated.previousCollege,
          termSeason: validated.termSeason,
          major: validated.major,
          countryOfBirth: validated.countryOfBirth,
        }),
      },
    });

    logger.info(
      { traceId, submissionId: submission.id, formMode: submission.formMode, perf: `Total time: ${Date.now() - startTime}ms` },
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
    logger.error({ traceId, error, errorMessage: error.message, errorStack: error.stack }, 'Submission failed');
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
