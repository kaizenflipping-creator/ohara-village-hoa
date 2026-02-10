'use client';

import { useState } from 'react';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import SendOutlined from '@mui/icons-material/SendOutlined';
import EmailOutlined from '@mui/icons-material/EmailOutlined';
import SmsOutlined from '@mui/icons-material/SmsOutlined';

interface NotificationFormProps {
  onSent?: () => void;
}

export default function NotificationForm({ onSent }: NotificationFormProps) {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [channel, setChannel] = useState<string>('email');
  const [sending, setSending] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) return;

    setSending(true);
    try {
      const res = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, body, channel }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to send notification');
      }

      setSnackbar({
        open: true,
        message: 'Notification sent successfully!',
        severity: 'success',
      });
      setSubject('');
      setBody('');
      setChannel('email');
      onSent?.();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err instanceof Error ? err.message : 'Failed to send notification',
        severity: 'error',
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            label="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            fullWidth
            multiline
            rows={6}
          />
          <Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
              Channel
            </Typography>
            <ToggleButtonGroup
              value={channel}
              exclusive
              onChange={(_, value) => {
                if (value !== null) setChannel(value);
              }}
              size="small"
            >
              <ToggleButton value="email">
                <EmailOutlined sx={{ mr: 0.5, fontSize: 18 }} />
                Email
              </ToggleButton>
              <ToggleButton value="sms">
                <SmsOutlined sx={{ mr: 0.5, fontSize: 18 }} />
                SMS
              </ToggleButton>
              <ToggleButton value="both">
                Both
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              startIcon={<SendOutlined />}
              onClick={handleSend}
              disabled={sending || !subject.trim() || !body.trim()}
            >
              {sending ? 'Sending...' : 'Send Notification'}
            </Button>
          </Box>
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
