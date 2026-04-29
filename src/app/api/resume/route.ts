import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createServiceClient } from '@/lib/supabase';
import { MAX_DRAFT_CVS, API_PATHS } from '@/lib/constants';

const createResumeSchema = z.object({
  userId: z.string().uuid().nullable().optional(),
  guestSessionId: z.string().uuid().nullable().optional(),
  language: z.enum(['en', 'ar']).default('en'),
  title: z.string().min(1).max(200).default('My Resume'),
  selectedTemplate: z.string().default('balanced-modern'),
  personalInfo: z.object({
    fullName: z.string().optional(),
    jobTitle: z.string().optional(),
    email: z.string().email().optional().or(z.literal('')),
    phone: z.string().optional(),
    location: z.string().optional(),
    dateOfBirth: z.string().nullable().optional(),
    photoUrl: z.string().nullable().optional(),
    summary: z.string().optional(),
  }).optional(),
});

export async function POST(req: NextRequest) {
  try {
    // 1. Parse and validate input
    const body = await req.json().catch(() => ({}));
    const validation = createResumeSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const data = validation.data;
    const supabase = createServiceClient();
    const isSignedInUser = !!data.userId;

    // Enforce 3-draft limit only for signed-in users
    if (isSignedInUser) {
      const { count, error: countError } = await supabase
        .from('resumes')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', data.userId)
        .eq('status', 'draft');

      if (countError) {
        throw countError;
      }

      if ((count || 0) >= MAX_DRAFT_CVS) {
        return NextResponse.json(
          { error: 'You can only have 3 saved draft CVs at the same time.' },
          { status: 409 }
        );
      }
    }

    const { data: resume, error } = await supabase
      .from('resumes')
      .insert({
        guest_session_id: data.guestSessionId || null,
        user_id: data.userId || null,
        language: data.language,
        title: data.title,
        selected_template: data.selectedTemplate,
        status: 'draft',
      })
      .select()
      .single();

    if (error) throw error;

    if (data.personalInfo) {
      const { error: piError } = await supabase.from('resume_personal_info').insert({
        resume_id: resume.id,
        full_name: data.personalInfo.fullName || '',
        job_title: data.personalInfo.jobTitle || '',
        email: data.personalInfo.email || '',
        phone: data.personalInfo.phone || '',
        location: data.personalInfo.location || '',
        date_of_birth: data.personalInfo.dateOfBirth || null,
        photo_url: data.personalInfo.photoUrl || null,
        summary: data.personalInfo.summary || null,
      });

      if (piError) {
        console.error('Failed to insert personal info:', piError);
      }
    }

    return NextResponse.json({ id: resume.id });
  } catch (err: any) {
    console.error('Resume creation error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
