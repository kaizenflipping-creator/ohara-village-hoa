import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import DownloadOutlined from '@mui/icons-material/DownloadOutlined';

interface DocumentItem {
  id: string;
  title: string;
  description: string | null;
  category: string;
  file_path: string;
  file_name: string;
  created_at: string;
}

interface DocumentCardProps {
  document: DocumentItem;
}

export default function DocumentCard({ document }: DocumentCardProps) {
  const downloadUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/hoa-documents/${document.file_path}`;

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" sx={{ fontSize: '1.05rem', fontWeight: 600, mb: 1 }}>
          {document.title}
        </Typography>

        {document.description && (
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, lineHeight: 1.7 }}>
            {document.description}
          </Typography>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, mt: 'auto' }}>
          <Chip
            label={document.category}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ textTransform: 'capitalize' }}
          />
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {new Date(document.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </Typography>
        </Box>

        <Button
          variant="outlined"
          color="primary"
          size="small"
          startIcon={<DownloadOutlined />}
          href={downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ alignSelf: 'flex-start' }}
        >
          Download
        </Button>
      </CardContent>
    </Card>
  );
}
