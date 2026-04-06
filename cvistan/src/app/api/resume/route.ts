import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

const MAX_DRAFT_CVS = 3;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = createServiceClient();

    const isSignedInUser = !!body.userId;

    // Enforce 3-draft limit only for signed-in users
    if (isSignedInUser) {
      const { count, error: countError } = await supabase
        .from('resumes')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', body.userId)
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
        guest_session_id: body.guestSessionId || null,
        user_id: body.userId || null,
        language: body.language || 'en',
        title: body.title || 'My Resume',
        selected_template: body.selectedTemplate || 'balanced-modern',
        status: 'draft',
      })
      .select()
      .single();

    if (error) throw error;

    if (body.personalInfo) {
      await supabase.from('resume_personal_info').insert({
        resume_id: resume.id,
        full_name: body.personalInfo.fullName,
        job_title: body.personalInfo.jobTitle,
        email: body.personalInfo.email,
        phone: body.personalInfo.phone,
        location: body.personalInfo.location,
        date_of_birth: body.personalInfo.dateOfBirth || null,
        photo_url: body.personalInfo.photoUrl || null,
        summary: body.personalInfo.summary || null,
      });
    }

    return NextResponse.json({ id: resume.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
