import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

interface NewsItem {
  title: string;
  description: string;
  source: string;
  url: string;
  publishedAt: string;
}

interface NewsCardProps {
  news: NewsItem;
}

export default function NewsCard({ news }: NewsCardProps) {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Link
          href={news.url}
          target="_blank"
          rel="noopener noreferrer"
          underline="hover"
          sx={{ color: 'text.primary', fontWeight: 600, mb: 1.5, fontSize: '1.05rem', lineHeight: 1.4 }}
        >
          {news.title}
        </Link>

        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, lineHeight: 1.7, flex: 1 }}>
          {news.description.length > 150
            ? `${news.description.substring(0, 150)}...`
            : news.description}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 'auto' }}>
          <Chip
            label={news.source}
            size="small"
            variant="outlined"
            color="secondary"
          />
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {new Date(news.publishedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
