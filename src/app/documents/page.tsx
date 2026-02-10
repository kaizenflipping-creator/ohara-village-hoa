import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import AssignmentOutlined from '@mui/icons-material/AssignmentOutlined';
import Link from 'next/link';
import PublicNavbar from '@/components/layout/PublicNavbar';
import Footer from '@/components/layout/Footer';
import DocumentList from '@/components/documents/DocumentList';

export default function DocumentsPage() {
  return (
    <>
      <PublicNavbar />
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
            HOA Documents &amp; Policies
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Access important community documents, bylaws, policies, and meeting minutes.
          </Typography>
        </Box>
        <Paper
          sx={{
            p: 3,
            mb: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
            backgroundColor: 'rgba(46, 125, 50, 0.05)',
            border: '1px solid rgba(46, 125, 50, 0.2)',
          }}
        >
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Submit a Form Online
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Fill out and submit an Architectural Review Request directly online — no printing needed.
            </Typography>
          </Box>
          <Link href="/forms/architectural-review">
            <Button variant="contained" startIcon={<AssignmentOutlined />}>
              Architectural Review Form
            </Button>
          </Link>
        </Paper>
        <DocumentList />
      </Container>
      <Footer />
    </>
  );
}
