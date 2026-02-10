import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { subject, body, channel } = await request.json();

    if (!subject || !body || !channel) {
      return NextResponse.json(
        { error: 'Subject, body, and channel are required' },
        { status: 400 }
      );
    }

    const { data: residents, error: residentsError } = await supabase
      .from('residents')
      .select('id, first_name, last_name, email, phone')
      .eq('status', 'active');

    if (residentsError) {
      return NextResponse.json(
        { error: 'Failed to fetch residents' },
        { status: 500 }
      );
    }

    const recipients = residents ?? [];

    const webhookUrl = process.env.N8N_NOTIFICATION_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subject,
            body,
            channel,
            recipients: recipients.map((r) => ({
              name: `${r.first_name} ${r.last_name}`,
              email: r.email,
              phone: r.phone,
            })),
          }),
        });
      } catch (webhookErr) {
        console.error('n8n webhook error:', webhookErr);
      }
    }

    const { error: insertError } = await supabase
      .from('notifications')
      .insert({
        subject,
        body,
        channel,
        recipient_count: recipients.length,
        sent_by: user.id,
      });

    if (insertError) {
      return NextResponse.json(
        { error: 'Failed to record notification' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      recipient_count: recipients.length,
    });
  } catch (err) {
    console.error('Notification send error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
