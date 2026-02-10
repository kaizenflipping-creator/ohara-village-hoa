'use client';

import { useEffect, useState, useCallback } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { createClient } from '@/lib/supabase/client';

interface Notification {
  id: string;
  subject: string;
  channel: string;
  recipient_count: number;
  created_at: string;
}

interface NotificationHistoryProps {
  refreshKey?: number;
}

export default function NotificationHistory({ refreshKey }: NotificationHistoryProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });
    setNotifications(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications, refreshKey]);

  const channelColor = (ch: string) => {
    switch (ch) {
      case 'email':
        return 'info';
      case 'sms':
        return 'success';
      case 'both':
        return 'primary';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (notifications.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          No notifications sent yet.
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Subject</TableCell>
            <TableCell>Channel</TableCell>
            <TableCell>Recipients</TableCell>
            <TableCell>Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {notifications.map((notification) => (
            <TableRow key={notification.id} hover>
              <TableCell>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {notification.subject}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={notification.channel}
                  color={channelColor(notification.channel) as 'info' | 'success' | 'primary' | 'default'}
                  size="small"
                  variant="outlined"
                />
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {notification.recipient_count}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {new Date(notification.created_at).toLocaleDateString()}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
