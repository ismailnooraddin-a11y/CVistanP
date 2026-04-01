import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    const { language } = await req.json();
    const supabase = createServiceClient();
    const sessionToken = uuidv4();

    const { data, error } = await supabase
      .from('guest_sessions')
      .insert({
        session_token: sessionToken,
        language: language || 'en',
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ sessionId: data.id, sessionToken: data.session_token });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create session' }, { status: 500 });
  }
}
