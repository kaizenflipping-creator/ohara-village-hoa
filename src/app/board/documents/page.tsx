'use client';

import { useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import DocumentUpload from '@/components/board/DocumentUpload';
import DocumentManager from '@/components/board/DocumentManager';

export default function DocumentsPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Manage Documents
        </Typography>
      </Box>

      <DocumentUpload onUpload={() => setRefreshKey((k) => k + 1)} />

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          All Documents
        </Typography>
        <DocumentManager refreshKey={refreshKey} />
      </Box>
    </Box>
  );
}
