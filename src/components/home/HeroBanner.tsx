import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Link from 'next/link';

export default function HeroBanner() {
  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)',
        minHeight: 400,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="md" sx={{ textAlign: 'center', py: 8 }}>
        <Typography
          variant="h3"
          sx={{
            color: '#FFFFFF',
            mb: 2,
            fontWeight: 700,
          }}
        >
          Welcome to O&apos;Hara Village
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: 'rgba(255,255,255,0.9)',
            mb: 4,
            fontWeight: 400,
          }}
        >
          Your neighborhood, your community, your home.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/pay">
            <Button
              variant="outlined"
              size="large"
              sx={{
                color: '#FFFFFF',
                borderColor: '#FFFFFF',
                px: 4,
                py: 1.5,
                '&:hover': {
                  borderColor: '#FFFFFF',
                  backgroundColor: 'rgba(255,255,255,0.15)',
                },
              }}
            >
              Pay Dues
            </Button>
          </Link>
          <Link href="/documents">
            <Button
              variant="outlined"
              size="large"
              sx={{
                color: '#FFFFFF',
                borderColor: '#FFFFFF',
                px: 4,
                py: 1.5,
                '&:hover': {
                  borderColor: '#FFFFFF',
                  backgroundColor: 'rgba(255,255,255,0.15)',
                },
              }}
            >
              View Documents
            </Button>
          </Link>
        </Box>
      </Container>
    </Box>
  );
}
