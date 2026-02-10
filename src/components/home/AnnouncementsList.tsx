'use client';

import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import { createClient } from '@/lib/supabase/client';

interface Announcement {
  id: string;
  title: string;
  body: string;
  priority: 'urgent' | 'high' | 'normal' | 'low';
  published: boolean;
  created_at: string;
}

const priorityColorMap: Record<string, 'error' | 'warning' | 'primary' | 'default'> = {
  urgent: 'error',
  high: 'warning',
  normal: 'primary',
  low: 'default',
};

export default function AnnouncementsList() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnnouncements() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(6);

      if (!error && data) {
        setAnnouncements(data);
      }
      setLoading(false);
    }

    fetchAnnouncements();
  }, []);

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, textAlign: 'center' }}>
        Latest Announcements
      </Typography>

      {announcements.length === 0 ? (
        <Typography variant="body1" sx={{ textAlign: 'center', color: 'text.secondary', py: 4 }}>
          No announcements yet.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {announcements.map((announcement) => (
            <Grid key={announcement.id} size={{ xs: 12, md: 4 }}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                    <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 600, flex: 1, mr: 1 }}>
                      {announcement.title}
                    </Typography>
                    <Chip
                      label={announcement.priority}
                      color={priorityColorMap[announcement.priority] || 'default'}
                      size="small"
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, lineHeight: 1.7 }}>
                    {announcement.body.length > 150
                      ? `${announcement.body.substring(0, 150)}...`
                      : announcement.body}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {new Date(announcement.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
