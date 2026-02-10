import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Link from 'next/link';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#F5F5F0',
        py: 6,
        px: 3,
        mt: 'auto',
      }}
    >
      <Grid container spacing={4} sx={{ maxWidth: 1200, mx: 'auto' }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'primary.main' }}>
            About
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
            O&apos;Hara Village HOA is a residential community dedicated to maintaining the beauty,
            safety, and property values of our neighborhood. We work together to create a welcoming
            environment for all residents.
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'primary.main' }}>
            Quick Links
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {[
              { label: 'Home', href: '/' },
              { label: 'Documents', href: '/documents' },
              { label: 'Pay Dues', href: '/pay' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{ color: '#5F6368', textDecoration: 'none', fontSize: '0.875rem' }}
              >
                {link.label}
              </Link>
            ))}
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'primary.main' }}>
            Contact
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
            O&apos;Hara Village HOA
            <br />
            Jonesboro, GA 30028
          </Typography>
        </Grid>
      </Grid>

      <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 4, pt: 3, borderTop: '1px solid rgba(0,0,0,0.1)' }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
          &copy; 2026 O&apos;Hara Village HOA. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}
