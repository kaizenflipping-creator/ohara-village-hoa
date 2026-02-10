'use client';

import { useEffect, useState, useCallback } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import DownloadOutlined from '@mui/icons-material/DownloadOutlined';
import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import { createClient } from '@/lib/supabase/client';

interface Document {
  id: string;
  title: string;
  category: string;
  file_name: string;
  file_path: string;
  created_at: string;
}

function getDocUrl(filePath: string) {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/hoa-documents/${filePath}`;
}

const categoryColorMap: Record<string, 'primary' | 'secondary' | 'info' | 'warning' | 'default'> = {
  bylaws: 'primary',
  policy: 'secondary',
  meeting_minutes: 'info',
  form: 'warning',
  other: 'default',
};

const categoryLabel: Record<string, string> = {
  bylaws: 'Bylaws',
  policy: 'Policy',
  meeting_minutes: 'Meeting Minutes',
  form: 'Form',
  other: 'Other',
};

interface DocumentManagerProps {
  refreshKey?: number;
}

export default function DocumentManager({ refreshKey }: DocumentManagerProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDoc, setDeleteDoc] = useState<Document | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const fetchDocuments = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false });
    setDocuments(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments, refreshKey]);

  const handleDelete = async () => {
    if (!deleteDoc) return;
    const supabase = createClient();

    await supabase.storage.from('hoa-documents').remove([deleteDoc.file_path]);
    await supabase.from('documents').delete().eq('id', deleteDoc.id);

    setDocuments((prev) => prev.filter((d) => d.id !== deleteDoc.id));
    setDeleteDoc(null);
    setDeleteOpen(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (documents.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          No documents uploaded yet.
        </Typography>
      </Paper>
    );
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>File Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.id} hover>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {doc.title}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={categoryLabel[doc.category] ?? doc.category}
                    color={categoryColorMap[doc.category] ?? 'default'}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {doc.file_name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {new Date(doc.created_at).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    component="a"
                    href={getDocUrl(doc.file_path)}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Download"
                  >
                    <DownloadOutlined fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => {
                      setDeleteDoc(doc);
                      setDeleteOpen(true);
                    }}
                    title="Delete"
                  >
                    <DeleteOutlined fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Delete Document</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete &quot;{deleteDoc?.title}&quot;? This
            will remove the file from storage and cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
