import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createServiceClient } from '@/lib/supabase';
import { createClient } from '@/lib/supabase';

const updateResumeSchema = z.object({
  userId: z.string().uuid().nullable().optional(),
  language: z.enum(['en', 'ar']).optional(),
  title: z.string().min(1).max(200).optional(),
  selectedTemplate: z.string().optional(),
  status: z.enum(['draft', 'finalized']).optional(),
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

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(params.id)) {
      return NextResponse.json({ error: 'Invalid resume ID format' }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from('resumes')
      .select('*, resume_personal_info(*), resume_links(*), resume_experience(*, resume_experience_bullets(*)), resume_education(*), resume_skills(*), resume_languages(*), resume_certifications(*)')
      .eq('id', params.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error('Get resume error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(params.id)) {
      return NextResponse.json({ error: 'Invalid resume ID format' }, { status: 400 });
    }

    const body = await req.json().catch(() => ({}));
    const validation = updateResumeSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const data = validation.data;
    const supabase = createServiceClient();

    // Build update payload
    const updatePayload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (data.language) updatePayload.language = data.language;
    if (data.title) updatePayload.title = data.title;
    if (data.selectedTemplate) updatePayload.selected_template = data.selectedTemplate;
    if (data.status) updatePayload.status = data.status;

    const { error: updateError } = await supabase
      .from('resumes')
      .update(updatePayload)
      .eq('id', params.id);

    if (updateError) throw updateError;

    // Upsert personal info if provided
    if (data.personalInfo) {
      const { error: piError } = await supabase.from('resume_personal_info').upsert({
        resume_id: params.id,
        full_name: data.personalInfo.fullName || '',
        job_title: data.personalInfo.jobTitle || '',
        email: data.personalInfo.email || '',
        phone: data.personalInfo.phone || '',
        location: data.personalInfo.location || '',
        date_of_birth: data.personalInfo.dateOfBirth || null,
        photo_url: data.personalInfo.photoUrl || null,
        summary: data.personalInfo.summary || null,
      }, { onConflict: 'resume_id' });

      if (piError) {
        console.error('Failed to upsert personal info:', piError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Update resume error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(params.id)) {
      return NextResponse.json({ error: 'Invalid resume ID format' }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { error } = await supabase
      .from('resumes')
      .delete()
      .eq('id', params.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Delete resume error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
