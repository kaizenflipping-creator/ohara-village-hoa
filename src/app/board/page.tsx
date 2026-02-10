'use client';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import StatsCards from '@/components/board/StatsCards';

export default function BoardDashboardPage() {
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Dashboard
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mt: 0.5 }}>
          Overview of O&apos;Hara Village HOA
        </Typography>
      </Box>

      <StatsCards />

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Recent Activity
        </Typography>
        <Card>
          <CardContent>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Activity feed will appear here as announcements are published,
              call notes are received, and payments are recorded. Check the
              individual sections in the sidebar for detailed management.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
