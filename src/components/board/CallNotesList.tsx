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
import Collapse from '@mui/material/Collapse';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined';
import KeyboardArrowUpOutlined from '@mui/icons-material/KeyboardArrowUpOutlined';
import { createClient } from '@/lib/supabase/client';

interface CallNote {
  id: string;
  caller_name: string;
  caller_phone: string;
  category: string;
  summary: string;
  transcript: string;
  status: string;
  board_notes: string;
  created_at: string;
}

const categoryColorMap: Record<string, 'error' | 'info' | 'warning' | 'default'> = {
  complaint: 'error',
  request: 'info',
  concern: 'warning',
  emergency: 'error',
  general: 'default',
};

const statusColorMap: Record<string, 'warning' | 'info' | 'primary' | 'success' | 'default'> = {
  new: 'warning',
  reviewed: 'info',
  in_progress: 'primary',
  resolved: 'success',
  dismissed: 'default',
};

export default function CallNotesList() {
  const [callNotes, setCallNotes] = useState<CallNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchCallNotes = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('call_notes')
      .select('*')
      .order('created_at', { ascending: false });
    setCallNotes(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCallNotes();
  }, [fetchCallNotes]);

  const handleExpand = (note: CallNote) => {
    if (expandedId === note.id) {
      setExpandedId(null);
    } else {
      setExpandedId(note.id);
      setEditNotes(note.board_notes ?? '');
      setEditStatus(note.status);
    }
  };

  const handleSave = async (id: string) => {
    setSaving(true);
    const supabase = createClient();
    await supabase
      .from('call_notes')
      .update({ board_notes: editNotes, status: editStatus })
      .eq('id', id);
    setCallNotes((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, board_notes: editNotes, status: editStatus } : n
      )
    );
    setSaving(false);
  };

  const truncate = (text: string, maxLength: number) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (callNotes.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          No call notes yet. They will appear here when the Vapi voice assistant
          receives calls.
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Caller</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Summary</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Date</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {callNotes.map((note) => (
            <>
              <TableRow key={note.id} hover>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {note.caller_name || note.caller_phone || 'Unknown'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={note.category}
                    color={categoryColorMap[note.category] ?? 'default'}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {truncate(note.summary, 80)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={note.status.replace('_', ' ')}
                    color={statusColorMap[note.status] ?? 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {new Date(note.created_at).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => handleExpand(note)}>
                    {expandedId === note.id ? (
                      <KeyboardArrowUpOutlined fontSize="small" />
                    ) : (
                      <VisibilityOutlined fontSize="small" />
                    )}
                  </IconButton>
                </TableCell>
              </TableRow>
              <TableRow key={`${note.id}-detail`}>
                <TableCell colSpan={6} sx={{ py: 0, borderBottom: expandedId === note.id ? undefined : 'none' }}>
                  <Collapse in={expandedId === note.id} timeout="auto" unmountOnExit>
                    <Box sx={{ py: 3, px: 1 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        Full Transcript
                      </Typography>
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 2,
                          mb: 3,
                          maxHeight: 200,
                          overflow: 'auto',
                          backgroundColor: 'grey.50',
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ whiteSpace: 'pre-wrap', color: 'text.secondary' }}
                        >
                          {note.transcript || 'No transcript available.'}
                        </Typography>
                      </Paper>

                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                        <TextField
                          label="Board Notes"
                          value={editNotes}
                          onChange={(e) => setEditNotes(e.target.value)}
                          multiline
                          rows={3}
                          fullWidth
                        />
                        <FormControl sx={{ minWidth: 160 }}>
                          <InputLabel>Status</InputLabel>
                          <Select
                            value={editStatus}
                            label="Status"
                            onChange={(e) => setEditStatus(e.target.value)}
                          >
                            <MenuItem value="new">New</MenuItem>
                            <MenuItem value="reviewed">Reviewed</MenuItem>
                            <MenuItem value="in_progress">In Progress</MenuItem>
                            <MenuItem value="resolved">Resolved</MenuItem>
                            <MenuItem value="dismissed">Dismissed</MenuItem>
                          </Select>
                        </FormControl>
                        <Button
                          variant="contained"
                          onClick={() => handleSave(note.id)}
                          disabled={saving}
                          sx={{ mt: 1, whiteSpace: 'nowrap' }}
                        >
                          {saving ? 'Saving...' : 'Save'}
                        </Button>
                      </Box>
                    </Box>
                  </Collapse>
                </TableCell>
              </TableRow>
            </>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
