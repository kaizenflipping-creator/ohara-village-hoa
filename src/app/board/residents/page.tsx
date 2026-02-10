'use client';

import { useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import PersonAddOutlined from '@mui/icons-material/PersonAddOutlined';
import ResidentForm from '@/components/board/ResidentForm';
import ResidentTable from '@/components/board/ResidentTable';

export default function ResidentsPage() {
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
          Manage Residents
        </Typography>
        <Button
          variant="contained"
          startIcon={<PersonAddOutlined />}
          onClick={() => setFormOpen(true)}
        >
          Add Resident
        </Button>
      </Box>

      <ResidentTable key={refreshKey} />

      <ResidentForm
        open={formOpen}
        onSave={() => {
          setFormOpen(false);
          setRefreshKey((k) => k + 1);
        }}
        onCancel={() => setFormOpen(false)}
      />
    </Box>
  );
}
