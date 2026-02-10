'use client';

import { useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import NotificationForm from '@/components/board/NotificationForm';
import NotificationHistory from '@/components/board/NotificationHistory';

export default function NotificationsPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Send Notifications
        </Typography>
      </Box>

      <NotificationForm onSent={() => setRefreshKey((k) => k + 1)} />

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Notification History
        </Typography>
        <NotificationHistory refreshKey={refreshKey} />
      </Box>
    </Box>
  );
}
