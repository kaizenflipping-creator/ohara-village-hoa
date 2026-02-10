import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import PublicNavbar from '@/components/layout/PublicNavbar';
import Footer from '@/components/layout/Footer';
import NewsFeed from '@/components/news/NewsFeed';

export default function NewsPage() {
  return (
    <>
      <PublicNavbar />
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
            Local News - Jonesboro, GA Area
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            News from Fulton, Henry, and Fayette counties.
          </Typography>
        </Box>
        <NewsFeed />
      </Container>
      <Footer />
    </>
  );
}
