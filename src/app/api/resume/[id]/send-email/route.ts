import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient, createServiceClient } from '@/lib/supabase';
import { sendCvPackageEmail } from '@/services/email-service';

/**
 * Send Email API Route
 *
 * Sends CV package (CV + Cover Letter + FAQ) via email
 *
 * Security:
 * - Validates input with Zod schema
 * - Verifies resume ownership via user_id check
 * - Sanitizes email content
 *
 * @version 2.0.0
 */

// Input validation schema
const sendEmailSchema = z.object({
  email: z.string().email('Valid email is required'),
  resume: z.object({
    personalInfo: z.object({
      fullName: z.string().optional(),
      jobTitle: z.string().optional(),
      email: z.string().optional(),
      phone: z.string().optional(),
    }).passthrough(),
    experience: z.array(z.any()).optional(),
    education: z.array(z.any()).optional(),
    skills: z.array(z.any()).optional(),
    languages: z.array(z.any()).optional(),
    certifications: z.array(z.any()).optional(),
    volunteer: z.array(z.any()).optional(),
    links: z.array(z.any()).optional(),
  }),
  language: z.enum(['en', 'ar']).default('en'),
});

/**
 * POST /api/resume/[id]/send-email
 *
 * Sends the complete CV package to the specified email
 *
 * @param req - Request with email, resume data, and language
 * @param params.id - Resume ID for authorization check
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const resumeId = params.id;

  try {
    // Parse and validate request body
    const body = await req.json();
    const validationResult = sendEmailSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, resume, language } = validationResult.data;

    // Get authenticated user
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify resume ownership (CRITICAL SECURITY CHECK)
    const serviceClient = createServiceClient();
    const { data: resumeData, error: fetchError } = await serviceClient
      .from('resumes')
      .select('user_id, id')
      .eq('id', resumeId)
      .single();

    if (fetchError || !resumeData) {
      return NextResponse.json(
        { error: 'Resume not found' },
        { status: 404 }
      );
    }

    if (resumeData.user_id !== user.id) {
      // Log potential unauthorized access attempt
      console.warn(`Unauthorized email send attempt: User ${user.id} tried to access resume ${resumeId}`);
      return NextResponse.json(
        { error: 'Unauthorized access to this resume' },
        { status: 403 }
      );
    }

    // Send email with CV package
    const result = await sendCvPackageEmail({
      to: email,
      resume,
      language,
    });

    if (!result.success) {
      console.error('Email send failed:', result.error);
      return NextResponse.json(
        { error: result.error || 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      messageId: result.messageId,
    });
  } catch (err) {
    console.error('Send email error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
