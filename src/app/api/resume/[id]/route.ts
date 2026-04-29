import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createServiceClient } from '@/lib/supabase';

// FIXED: Complete schema with all resume sections
const updateResumeSchema = z.object({
  userId: z.string().uuid().nullable().optional(),
  guestSessionId: z.string().uuid().nullable().optional(),
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
  // FIXED: Added all sections that were missing
  experience: z.array(z.object({
    id: z.string().optional(),
    jobTitle: z.string().optional(),
    company: z.string().optional(),
    location: z.string().optional().nullable(),
    startMonth: z.number().optional(),
    startYear: z.number().optional(),
    endMonth: z.number().nullable().optional(),
    endYear: z.number().nullable().optional(),
    isCurrent: z.boolean().optional(),
    bullets: z.array(z.object({
      id: z.string().optional(),
      text: z.string().optional(),
      sortOrder: z.number().optional(),
    })).optional(),
    sortOrder: z.number().optional(),
  })).optional(),
  education: z.array(z.object({
    id: z.string().optional(),
    degree: z.string().optional(),
    institution: z.string().optional(),
    location: z.string().optional().nullable(),
    graduationMonth: z.number().nullable().optional(),
    graduationYear: z.number().nullable().optional(),
    gpa: z.string().optional().nullable(),
    thesisProject: z.string().optional().nullable(),
    sortOrder: z.number().optional(),
  })).optional(),
  skills: z.array(z.object({
    id: z.string().optional(),
    name: z.string().optional(),
    sortOrder: z.number().optional(),
  })).optional(),
  languages: z.array(z.object({
    id: z.string().optional(),
    name: z.string().optional(),
    proficiency: z.enum(['beginner', 'intermediate', 'fluent', 'native']).optional(),
    sortOrder: z.number().optional(),
  })).optional(),
  certifications: z.array(z.object({
    id: z.string().optional(),
    name: z.string().optional(),
    organization: z.string().optional(),
    issueMonth: z.number().nullable().optional(),
    issueYear: z.number().nullable().optional(),
    expiryMonth: z.number().nullable().optional(),
    expiryYear: z.number().nullable().optional(),
    noExpiry: z.boolean().optional(),
    trainingMode: z.enum(['online', 'in-person']).nullable().optional(),
    credentialId: z.string().optional().nullable(),
    sortOrder: z.number().optional(),
  })).optional(),
  volunteer: z.array(z.object({
    id: z.string().optional(),
    title: z.string().optional(),
    organization: z.string().optional(),
    category: z.enum(['volunteer', 'club', 'competition', 'student-org', 'community', 'other']).optional(),
    location: z.string().optional().nullable(),
    startMonth: z.number().nullable().optional(),
    startYear: z.number().nullable().optional(),
    endMonth: z.number().nullable().optional(),
    endYear: z.number().nullable().optional(),
    isCurrent: z.boolean().optional(),
    description: z.string().optional(),
    sortOrder: z.number().optional(),
  })).optional(),
  links: z.array(z.object({
    id: z.string().optional(),
    type: z.enum(['linkedin', 'github', 'portfolio', 'twitter', 'instagram', 'behance']).optional(),
    url: z.string().optional(),
    enabled: z.boolean().optional(),
  })).optional(),
});

/**
 * Verify the user owns this resume before allowing modifications
 * SECURITY FIX: Prevents any authenticated user from modifying ANY resume
 */
async function verifyResumeOwnership(
  supabase: ReturnType<typeof createServiceClient>,
  resumeId: string,
  userId: string | null,
  guestSessionId?: string | null
): Promise<{ authorized: boolean; guestSessionId?: string | null }> {
  const { data: resume, error } = await supabase
    .from('resumes')
    .select('id, user_id, guest_session_id')
    .eq('id', resumeId)
    .single();

  if (error || !resume) {
    return { authorized: false };
  }

  // Check if user owns this resume (either by user_id or by matching guest_session_id)
  if (userId && resume.user_id === userId) {
    return { authorized: true };
  }

  // For guest sessions, verify the guest_session_id matches
  if (!userId && guestSessionId) {
    // CRITICAL: Only allow access if the guest session matches
    if (resume.guest_session_id === guestSessionId) {
      return { authorized: true, guestSessionId: resume.guest_session_id };
    }
    // Log potential unauthorized access attempt
    console.warn(`Guest session authorization failed: ${guestSessionId} tried to access resume ${resumeId} owned by ${resume.guest_session_id}`);
    return { authorized: false };
  }

  return { authorized: false };
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(params.id)) {
      return NextResponse.json({ error: 'Invalid resume ID format' }, { status: 400 });
    }

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    let userId: string | null = null;
    let guestSessionId: string | null = null;

    if (authHeader?.startsWith('Bearer ')) {
      const supabase = createServiceClient();
      const { data: { user } } = await supabase.auth.getUser(
        authHeader.replace('Bearer ', '')
      );
      userId = user?.id ?? null;

      // Also check for guest session header
      guestSessionId = req.headers.get('x-guest-session') || null;
    }

    // Verify ownership
    const supabase = createServiceClient();
    const ownership = await verifyResumeOwnership(supabase, params.id, userId, guestSessionId);

    if (!ownership.authorized) {
      return NextResponse.json({ error: 'Resume not found or access denied' }, { status: 403 });
    }

    const { data, error } = await supabase
      .from('resumes')
      .select(`
        *,
        resume_personal_info(*),
        resume_links(*),
        resume_experience(*, resume_experience_bullets(*)),
        resume_education(*),
        resume_skills(*),
        resume_languages(*),
        resume_certifications(*),
        resume_volunteer(*)
      `)
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

    // SECURITY FIX: Verify ownership before updating
    const authHeader = req.headers.get('Authorization');
    let userId: string | null = null;

    if (authHeader?.startsWith('Bearer ')) {
      const { data: { user } } = await supabase.auth.getUser(
        authHeader.replace('Bearer ', '')
      );
      userId = user?.id ?? null;
    }

    const ownership = await verifyResumeOwnership(supabase, params.id, userId, data.guestSessionId || null);

    if (!ownership.authorized) {
      return NextResponse.json({ error: 'Resume not found or access denied' }, { status: 403 });
    }

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

    // FIXED: Now save all sections, not just personal info

    // Save experience with bullets
    if (data.experience !== undefined) {
      // Delete existing experience and bullets
      const { data: existingExp } = await supabase
        .from('resume_experience')
        .select('id')
        .eq('resume_id', params.id);

      if (existingExp?.length) {
        const expIds = existingExp.map(e => e.id);
        await supabase
          .from('resume_experience_bullets')
          .delete()
          .in('experience_id', expIds);
        await supabase
          .from('resume_experience')
          .delete()
          .eq('resume_id', params.id);
      }

      // Insert new experience entries
      for (const exp of data.experience) {
        const { data: newExp, error: expError } = await supabase
          .from('resume_experience')
          .insert({
            resume_id: params.id,
            job_title: exp.jobTitle || '',
            company: exp.company || '',
            location: exp.location || null,
            start_month: exp.startMonth || null,
            start_year: exp.startYear || null,
            end_month: exp.endMonth,
            end_year: exp.endYear,
            is_current: exp.isCurrent || false,
            sort_order: exp.sortOrder || 0,
          })
          .select()
          .single();

        if (!expError && newExp && exp.bullets?.length) {
          // Insert bullets
          const bulletsToInsert = exp.bullets
            .filter(b => b.text)
            .map((b, idx) => ({
              experience_id: newExp.id,
              text: b.text,
              sort_order: b.sortOrder ?? idx,
            }));

          if (bulletsToInsert.length > 0) {
            await supabase.from('resume_experience_bullets').insert(bulletsToInsert);
          }
        }
      }
    }

    // Save education
    if (data.education !== undefined) {
      // Delete existing education
      await supabase.from('resume_education').delete().eq('resume_id', params.id);

      // Insert new education entries
      for (const edu of data.education) {
        await supabase.from('resume_education').insert({
          resume_id: params.id,
          degree: edu.degree || '',
          institution: edu.institution || '',
          location: edu.location || null,
          graduation_month: edu.graduationMonth,
          graduation_year: edu.graduationYear,
          gpa: edu.gpa || null,
          thesis_project: edu.thesisProject || null,
          sort_order: edu.sortOrder || 0,
        });
      }
    }

    // Save skills
    if (data.skills !== undefined) {
      await supabase.from('resume_skills').delete().eq('resume_id', params.id);

      const skillsToInsert = data.skills.map((s, idx) => ({
        resume_id: params.id,
        skill_name: s.name || '',
        sort_order: s.sortOrder ?? idx,
      }));

      if (skillsToInsert.length > 0) {
        await supabase.from('resume_skills').insert(skillsToInsert);
      }
    }

    // Save languages
    if (data.languages !== undefined) {
      await supabase.from('resume_languages').delete().eq('resume_id', params.id);

      const langsToInsert = data.languages.map((l, idx) => ({
        resume_id: params.id,
        language_name: l.name || '',
        proficiency: l.proficiency || 'intermediate',
        sort_order: l.sortOrder ?? idx,
      }));

      if (langsToInsert.length > 0) {
        await supabase.from('resume_languages').insert(langsToInsert);
      }
    }

    // Save certifications
    if (data.certifications !== undefined) {
      await supabase.from('resume_certifications').delete().eq('resume_id', params.id);

      for (const cert of data.certifications) {
        await supabase.from('resume_certifications').insert({
          resume_id: params.id,
          name: cert.name || '',
          organization: cert.organization || '',
          issue_month: cert.issueMonth,
          issue_year: cert.issueYear,
          expiry_month: cert.expiryMonth,
          expiry_year: cert.expiryYear,
          no_expiry: cert.noExpiry ?? true,
          training_mode: cert.trainingMode,
          credential_id: cert.credentialId || null,
          sort_order: cert.sortOrder || 0,
        });
      }
    }

    // Save volunteer
    if (data.volunteer !== undefined) {
      await supabase.from('resume_volunteer').delete().eq('resume_id', params.id);

      for (const vol of data.volunteer) {
        await supabase.from('resume_volunteer').insert({
          resume_id: params.id,
          title: vol.title || '',
          organization: vol.organization || '',
          category: vol.category || 'volunteer',
          location: vol.location || null,
          start_month: vol.startMonth,
          start_year: vol.startYear,
          end_month: vol.endMonth,
          end_year: vol.endYear,
          is_current: vol.isCurrent || false,
          description: vol.description || '',
          sort_order: vol.sortOrder || 0,
        });
      }
    }

    // Save links
    if (data.links !== undefined) {
      await supabase.from('resume_links').delete().eq('resume_id', params.id);

      const linksToInsert = data.links
        .filter(l => l.url)
        .map(l => ({
          resume_id: params.id,
          link_type: l.type || 'portfolio',
          url: l.url,
          enabled: l.enabled ?? true,
        }));

      if (linksToInsert.length > 0) {
        await supabase.from('resume_links').insert(linksToInsert);
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

    // SECURITY FIX: Verify ownership before deleting
    const authHeader = req.headers.get('Authorization');
    let userId: string | null = null;
    let guestSessionId: string | null = req.headers.get('x-guest-session') || null;

    if (authHeader?.startsWith('Bearer ')) {
      const { data: { user } } = await supabase.auth.getUser(
        authHeader.replace('Bearer ', '')
      );
      userId = user?.id ?? null;
    }

    const ownership = await verifyResumeOwnership(supabase, params.id, userId, guestSessionId);

    if (!ownership.authorized) {
      return NextResponse.json({ error: 'Resume not found or access denied' }, { status: 403 });
    }

    // Delete is handled by CASCADE from resumes table
    // But we should also delete the main resume record
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