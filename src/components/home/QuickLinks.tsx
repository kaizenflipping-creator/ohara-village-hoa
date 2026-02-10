import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import PaymentOutlined from '@mui/icons-material/PaymentOutlined';
import DescriptionOutlined from '@mui/icons-material/DescriptionOutlined';
import PhoneOutlined from '@mui/icons-material/PhoneOutlined';
import Link from 'next/link';

const quickLinks = [
  {
    icon: PaymentOutlined,
    title: 'Pay HOA Dues',
    description:
      'Pay your annual HOA dues of $498/year securely online through QuickBooks. Keep your account in good standing.',
    buttonLabel: 'Pay Now',
    href: '/pay',
  },
  {
    icon: DescriptionOutlined,
    title: 'HOA Documents',
    description:
      'Access community bylaws, covenants, policies, meeting minutes, and other important HOA documents.',
    buttonLabel: 'View Documents',
    href: '/documents',
  },
  {
    icon: PhoneOutlined,
    title: '24/7 Voice Assistant',
    description:
      'Call our AI-powered voice assistant anytime to report concerns, ask questions, or get information about the community.',
    buttonLabel: null,
    href: null,
  },
];

export default function QuickLinks() {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, textAlign: 'center' }}>
        Community Resources
      </Typography>
      <Grid container spacing={3}>
        {quickLinks.map((item) => {
          const IconComponent = item.icon;
          return (
            <Grid key={item.title} size={{ xs: 12, md: 4 }}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  textAlign: 'center',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  },
                }}
              >
                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }}>
                  <Box
                    sx={{
                      backgroundColor: 'primary.main',
                      borderRadius: '50%',
                      width: 64,
                      height: 64,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                    }}
                  >
                    <IconComponent sx={{ fontSize: 32, color: '#FFFFFF' }} />
                  </Box>
                  <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 600 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, lineHeight: 1.7, flex: 1 }}>
                    {item.description}
                  </Typography>
                  {item.href && item.buttonLabel ? (
                    <Link href={item.href}>
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 'auto' }}
                      >
                        {item.buttonLabel}
                      </Button>
                    </Link>
                  ) : (
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                      Use the voice assistant button in the bottom-right corner
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
