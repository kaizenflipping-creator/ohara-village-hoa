import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
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
        <DocumentList />
      </Container>
      <Footer />
    </>
  );
}
