import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { email, password, guestSessionId } = await req.json();
    const supabase = createServiceClient();

    // Create user via Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) throw authError;

    const userId = authData.user.id;

    // Migrate guest resumes to user
    if (guestSessionId) {
      await supabase
        .from('resumes')
        .update({ user_id: userId })
        .eq('guest_session_id', guestSessionId);
    }

    return NextResponse.json({ userId, email });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
