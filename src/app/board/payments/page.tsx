'use client';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import PaymentTable from '@/components/board/PaymentTable';

export default function PaymentsPage() {
  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Payment Tracking
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mt: 0.5 }}>
          Track HOA dues payments (payments processed via QuickBooks)
        </Typography>
      </Box>

      <PaymentTable />
    </Box>
  );
}
