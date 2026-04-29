import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createServiceClient } from '@/lib/supabase';

const convertGuestSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  guestSessionId: z.string().uuid().nullable().optional(),
  fullName: z.string().min(1).max(200).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const validation = convertGuestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { email, password, guestSessionId, fullName } = validation.data;
    const supabase = createServiceClient();

    // Create user via Supabase Auth with email verification ENABLED
    // Users must verify their email before accessing their account
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: false, // FIXED: Require email verification
      user_metadata: {
        full_name: fullName || '',
      },
    });

    if (authError) throw authError;

    const userId = authData.user.id;

    // Migrate guest resumes to user
    if (guestSessionId) {
      const { error: migrateError } = await supabase
        .from('resumes')
        .update({ user_id: userId })
        .eq('guest_session_id', guestSessionId)
        .is('user_id', null); // Only migrate resumes without user_id

      if (migrateError) {
        console.error('Failed to migrate guest resumes:', migrateError);
      }
    }

    return NextResponse.json({
      userId,
      email,
      message: 'Account created. Please check your email to verify your account before signing in.'
    });
  } catch (err: any) {
    console.error('Convert guest error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
