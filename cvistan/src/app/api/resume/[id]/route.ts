import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from('resumes')
      .select('*, resume_personal_info(*), resume_links(*), resume_experience(*, resume_experience_bullets(*)), resume_education(*), resume_skills(*), resume_languages(*), resume_certifications(*)')
      .eq('id', params.id)
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 404 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const supabase = createServiceClient();

    const { error } = await supabase
      .from('resumes')
      .update({
        language: body.language,
        title: body.title,
        selected_template: body.selectedTemplate,
        status: body.status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id);

    if (error) throw error;

    // Upsert personal info
    if (body.personalInfo) {
      await supabase.from('resume_personal_info').upsert({
        resume_id: params.id,
        full_name: body.personalInfo.fullName,
        job_title: body.personalInfo.jobTitle,
        email: body.personalInfo.email,
        phone: body.personalInfo.phone,
        location: body.personalInfo.location,
        date_of_birth: body.personalInfo.dateOfBirth || null,
        photo_url: body.personalInfo.photoUrl || null,
        summary: body.personalInfo.summary || null,
      }, { onConflict: 'resume_id' });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
