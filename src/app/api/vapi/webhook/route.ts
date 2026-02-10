import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const messageType = body?.message?.type;
    if (messageType !== 'end-of-call-report') {
      return NextResponse.json(
        { success: true, message: 'Ignored non-end-of-call-report message' },
        { status: 200 }
      );
    }

    const message = body.message;

    const caller_phone =
      message?.call?.customer?.number ||
      body?.customer?.number ||
      '';

    const summary =
      message?.summary ||
      message?.analysis?.summary ||
      '';

    const transcript = message?.transcript || '';

    const caller_name =
      message?.analysis?.structuredData?.caller_name || '';

    const category =
      message?.analysis?.structuredData?.category || 'general';

    const vapi_call_id = message?.call?.id || '';

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error } = await supabase.from('call_notes').insert({
      caller_name,
      caller_phone,
      category,
      summary,
      transcript,
      vapi_call_id,
      status: 'new',
    });

    if (error) {
      console.error('Error inserting call note:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Vapi webhook error:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
