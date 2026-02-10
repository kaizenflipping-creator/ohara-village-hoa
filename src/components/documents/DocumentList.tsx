'use client';

import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import CircularProgress from '@mui/material/CircularProgress';
import { createClient } from '@/lib/supabase/client';
import DocumentCard from './DocumentCard';

interface DocumentItem {
  id: string;
  title: string;
  description: string | null;
  category: string;
  file_path: string;
  file_name: string;
  created_at: string;
}

const categories = ['All', 'Bylaws', 'Policies', 'Meeting Minutes', 'Forms', 'Other'];

export default function DocumentList() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    async function fetchDocuments() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setDocuments(data);
      }
      setLoading(false);
    }

    fetchDocuments();
  }, []);

  const filteredDocuments =
    activeTab === 0
      ? documents
      : documents.filter(
          (doc) => doc.category.toLowerCase() === categories[activeTab].toLowerCase()
        );

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box>
      <Tabs
        value={activeTab}
        onChange={(_, newValue) => setActiveTab(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 4, borderBottom: 1, borderColor: 'divider' }}
      >
        {categories.map((category) => (
          <Tab key={category} label={category} />
        ))}
      </Tabs>

      {filteredDocuments.length === 0 ? (
        <Typography variant="body1" sx={{ textAlign: 'center', color: 'text.secondary', py: 4 }}>
          No documents found.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {filteredDocuments.map((doc) => (
            <Grid key={doc.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <DocumentCard document={doc} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
