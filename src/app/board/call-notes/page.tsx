'use client';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CallNotesList from '@/components/board/CallNotesList';

export default function CallNotesPage() {
  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Voice Assistant Call Notes
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mt: 0.5 }}>
          Review and manage calls from the Vapi voice assistant
        </Typography>
      </Box>

      <CallNotesList />
    </Box>
  );
}
