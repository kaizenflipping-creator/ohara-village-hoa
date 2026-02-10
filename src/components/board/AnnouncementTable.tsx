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
import Switch from '@mui/material/Switch';
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
import EditOutlined from '@mui/icons-material/EditOutlined';
import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import { createClient } from '@/lib/supabase/client';
import AnnouncementForm from './AnnouncementForm';

interface Announcement {
  id: string;
  title: string;
  body: string;
  priority: string;
  published: boolean;
  created_at: string;
}

const priorityColor = (priority: string) => {
  switch (priority) {
    case 'urgent':
      return 'error';
    case 'high':
      return 'warning';
    case 'normal':
      return 'info';
    case 'low':
      return 'default';
    default:
      return 'default';
  }
};

export default function AnnouncementTable() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [editAnnouncement, setEditAnnouncement] = useState<Announcement | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const fetchAnnouncements = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false });
    setAnnouncements(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const handlePublishedToggle = async (id: string, published: boolean) => {
    const supabase = createClient();
    await supabase.from('announcements').update({ published }).eq('id', id);
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, published } : a))
    );
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const supabase = createClient();
    await supabase.from('announcements').delete().eq('id', deleteId);
    setAnnouncements((prev) => prev.filter((a) => a.id !== deleteId));
    setDeleteId(null);
    setDeleteOpen(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (announcements.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          No announcements yet. Create your first one!
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
              <TableCell>Priority</TableCell>
              <TableCell>Published</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {announcements.map((announcement) => (
              <TableRow key={announcement.id} hover>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {announcement.title}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={announcement.priority}
                    color={priorityColor(announcement.priority) as 'error' | 'warning' | 'info' | 'default'}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Switch
                    checked={announcement.published}
                    onChange={(e) =>
                      handlePublishedToggle(announcement.id, e.target.checked)
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {new Date(announcement.created_at).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => {
                      setEditAnnouncement(announcement);
                      setEditOpen(true);
                    }}
                  >
                    <EditOutlined fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => {
                      setDeleteId(announcement.id);
                      setDeleteOpen(true);
                    }}
                  >
                    <DeleteOutlined fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <AnnouncementForm
        announcement={editAnnouncement}
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setEditAnnouncement(null);
        }}
        onSave={fetchAnnouncements}
      />

      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Delete Announcement</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this announcement? This action cannot
            be undone.
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
