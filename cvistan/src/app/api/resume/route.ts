import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = createServiceClient();

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

    // Insert personal info
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
