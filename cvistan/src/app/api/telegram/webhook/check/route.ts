import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const supabase = createServiceClient();
    
    // Check if any recent telegram connection exists (last 5 minutes)
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    
    const { data } = await supabase
      .from('telegram_connections')
      .select('chat_id, username')
      .gte('updated_at', fiveMinAgo)
      .order('updated_at', { ascending: false })
      .limit(1);

    if (data && data.length > 0) {
      return NextResponse.json({ connected: true, chatId: data[0].chat_id });
    }

    return NextResponse.json({ connected: false });
  } catch (err: any) {
    return NextResponse.json({ connected: false });
  }
}
