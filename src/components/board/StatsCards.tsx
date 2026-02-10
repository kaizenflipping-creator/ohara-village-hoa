'use client';

import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import PeopleOutlined from '@mui/icons-material/PeopleOutlined';
import PhoneCallbackOutlined from '@mui/icons-material/PhoneCallbackOutlined';
import PaymentOutlined from '@mui/icons-material/PaymentOutlined';
import CampaignOutlined from '@mui/icons-material/CampaignOutlined';
import { createClient } from '@/lib/supabase/client';

interface Stats {
  activeResidents: number;
  newCallNotes: number;
  paidPayments: number;
  publishedAnnouncements: number;
}

export default function StatsCards() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const supabase = createClient();

      const [residentsRes, callNotesRes, paymentsRes, announcementsRes] =
        await Promise.all([
          supabase
            .from('residents')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'active'),
          supabase
            .from('call_notes')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'new'),
          supabase
            .from('payments')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'paid'),
          supabase
            .from('announcements')
            .select('*', { count: 'exact', head: true })
            .eq('published', true),
        ]);

      setStats({
        activeResidents: residentsRes.count ?? 0,
        newCallNotes: callNotesRes.count ?? 0,
        paidPayments: paymentsRes.count ?? 0,
        publishedAnnouncements: announcementsRes.count ?? 0,
      });
      setLoading(false);
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const cards = [
    {
      label: 'Active Residents',
      count: stats?.activeResidents ?? 0,
      icon: <PeopleOutlined sx={{ fontSize: 32 }} />,
      color: 'primary.main',
      bgColor: 'rgba(46, 125, 50, 0.1)',
    },
    {
      label: 'New Call Notes',
      count: stats?.newCallNotes ?? 0,
      icon: <PhoneCallbackOutlined sx={{ fontSize: 32 }} />,
      color: 'warning.main',
      bgColor: 'rgba(251, 140, 0, 0.1)',
    },
    {
      label: 'Paid Payments',
      count: stats?.paidPayments ?? 0,
      icon: <PaymentOutlined sx={{ fontSize: 32 }} />,
      color: 'success.main',
      bgColor: 'rgba(67, 160, 71, 0.1)',
    },
    {
      label: 'Published Announcements',
      count: stats?.publishedAnnouncements ?? 0,
      icon: <CampaignOutlined sx={{ fontSize: 32 }} />,
      color: 'info.main',
      bgColor: 'rgba(2, 136, 209, 0.1)',
    },
  ];

  return (
    <Grid container spacing={3}>
      {cards.map((card) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={card.label}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: card.bgColor,
                    color: card.color,
                  }}
                >
                  {card.icon}
                </Box>
                <Box>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: card.color }}
                  >
                    {card.count}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: 'text.secondary', mt: 0.25 }}
                  >
                    {card.label}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
