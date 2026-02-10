'use client';

import { useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddOutlined from '@mui/icons-material/AddOutlined';
import AnnouncementForm from '@/components/board/AnnouncementForm';
import AnnouncementTable from '@/components/board/AnnouncementTable';

export default function AnnouncementsPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Manage Announcements
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddOutlined />}
          onClick={() => setFormOpen(true)}
        >
          New Announcement
        </Button>
      </Box>

      <AnnouncementTable key={refreshKey} />

      <AnnouncementForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={() => setRefreshKey((k) => k + 1)}
      />
    </Box>
  );
}
