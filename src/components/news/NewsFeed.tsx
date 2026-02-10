'use client';

import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import NewsCard from './NewsCard';

interface NewsItem {
  title: string;
  description: string;
  source: string;
  url: string;
  publishedAt: string;
}

export default function NewsFeed() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const response = await fetch('/api/news');
        if (response.ok) {
          const data = await response.json();
          setNews(data.articles || []);
        }
      } catch {
        // Silently handle fetch errors
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, []);

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (news.length === 0) {
    return (
      <Typography variant="body1" sx={{ textAlign: 'center', color: 'text.secondary', py: 4 }}>
        No local news available.
      </Typography>
    );
  }

  return (
    <Grid container spacing={3}>
      {news.map((item, index) => (
        <Grid key={index} size={{ xs: 12, md: 4 }}>
          <NewsCard news={item} />
        </Grid>
      ))}
    </Grid>
  );
}
