export async function sendNotification(data: {
  subject: string;
  body: string;
  channel: 'email' | 'sms' | 'both';
}) {
  const res = await fetch('/api/notifications/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to send notification');
  return res.json();
}

export async function fetchNews() {
  const res = await fetch('/api/news');
  if (!res.ok) throw new Error('Failed to fetch news');
  return res.json();
}
