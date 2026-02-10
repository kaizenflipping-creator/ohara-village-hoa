import Container from '@mui/material/Container';
import PublicNavbar from '@/components/layout/PublicNavbar';
import Footer from '@/components/layout/Footer';
import HeroBanner from '@/components/home/HeroBanner';
import AnnouncementsList from '@/components/home/AnnouncementsList';
import QuickLinks from '@/components/home/QuickLinks';

export default function Home() {
  return (
    <>
      <PublicNavbar />
      <HeroBanner />
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <AnnouncementsList />
      </Container>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <QuickLinks />
      </Container>
      <Footer />
    </>
  );
}
