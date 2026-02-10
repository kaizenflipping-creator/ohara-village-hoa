'use client';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import PaymentOutlined from '@mui/icons-material/PaymentOutlined';
import PublicNavbar from '@/components/layout/PublicNavbar';
import Footer from '@/components/layout/Footer';

export default function PayPage() {
  const paymentUrl = process.env.NEXT_PUBLIC_QUICKBOOKS_PAYMENT_URL;

  const handlePayNow = () => {
    if (paymentUrl) {
      window.open(paymentUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <>
      <PublicNavbar />
      <Box
        sx={{
          background: (theme) =>
            `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          py: 6,
          mb: 4,
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h3" sx={{ color: '#FFFFFF', fontWeight: 700, mb: 1 }}>
            2026 HOA Dues
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 400 }}>
            Keep your account in good standing by paying your annual dues.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ pb: 6 }}>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ height: '100%', textAlign: 'center' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                  Pay in Full
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                  $498.00
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                  Annual dues
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Due: January 1, 2026
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ height: '100%', textAlign: 'center' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                  Split Payment
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                  $249.00
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                  Per installment (2 payments)
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Due: January 1 &amp; May 1, 2026
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ textAlign: 'center' }}>
          {paymentUrl ? (
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<PaymentOutlined />}
              onClick={handlePayNow}
              sx={{ px: 6, py: 1.5, fontSize: '1.1rem' }}
            >
              Pay Now via QuickBooks
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<PaymentOutlined />}
              disabled
              sx={{ px: 6, py: 1.5, fontSize: '1.1rem' }}
            >
              Payment link coming soon
            </Button>
          )}

          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 2 }}>
            Payments are processed securely through QuickBooks.
          </Typography>
        </Box>
      </Container>
      <Footer />
    </>
  );
}
