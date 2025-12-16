import { NextRequest, NextResponse } from 'next/server';
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
    const clientIp = getClientIp(request);
    const body = await request.json();
    
    logger.info({ traceId, body }, 'Received initial form submission');

    // Check rate limits
    const [ipRateLimit, emailRateLimit] = await Promise.all([
      checkRateLimit(clientIp, 'ip'),
      body.email ? checkRateLimit(body.email, 'email') : Promise.resolve({ success: true, remaining: 0, reset: new Date() })
    ]);
    
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

    // Validate required fields
    const requiredFields = ['fullName', 'phone', 'email', 'studyLevel', 'currentCollege', 'intendedMajor', 'transferTime'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          code: 'VALIDATION_ERROR',
          message: 'Missing required fields',
          errors: missingFields,
          traceId,
        },
        { status: 422 }
      );
    }

    // Hash IP for privacy
    const ipHash = hashIdentifier(clientIp, 'ip');
    const userAgent = request.headers.get('user-agent') || undefined;

    // Parse transferTime to get termSeason
    let termSeason = 'Other';
    if (body.transferTime) {
      if (body.transferTime.includes('fall')) termSeason = 'Fall';
      else if (body.transferTime.includes('spring')) termSeason = 'Spring';
    }

    // Create submission in database
    const submission = await prisma.submission.create({
      data: {
        formMode: 'initial',
        fullName: body.fullName,
        email: body.email,
        phone: body.phone,
        studyLevel: body.studyLevel,
        currentCollege: body.currentCollege,
        major: body.intendedMajor,
        termSeason: termSeason as any,
        consent: true, // Implicit consent by submitting
        ipHash,
        ua: userAgent,
      },
    });

    logger.info(
      { traceId, submissionId: submission.id, formMode: 'initial', perf: `Total time: ${Date.now() - startTime}ms` },
      'Initial form submission created successfully'
    );

    // Send admin notification email (async, don't wait)
    sendAdminNotification({
      id: submission.id,
      fullName: submission.fullName,
      email: submission.email,
      formMode: 'initial',
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
    logger.error({ traceId, error, errorMessage: error.message, errorStack: error.stack }, 'Initial form submission failed');
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
