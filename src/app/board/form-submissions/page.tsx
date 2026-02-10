'use client';

import { useEffect, useState, useCallback } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { createClient } from '@/lib/supabase/client';

interface FormSubmission {
  id: string;
  form_type: string;
  resident_name: string;
  lot_number: string;
  email: string | null;
  phone: string | null;
  form_data: Record<string, string>;
  status: string;
  board_notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
}

const statusColors: Record<string, 'warning' | 'info' | 'success' | 'error' | 'default'> = {
  pending: 'warning',
  under_review: 'info',
  approved: 'success',
  denied: 'error',
  completed: 'default',
};

const projectTypeLabels: Record<string, string> = {
  fence: 'Fence',
  paint: 'Exterior Paint',
  roof: 'Roof',
  landscaping: 'Landscaping',
  driveway: 'Driveway/Walkway',
  deck_patio: 'Deck/Patio',
  shed: 'Shed/Storage',
  solar: 'Solar Panels',
  windows_doors: 'Windows/Doors',
  siding: 'Siding',
  addition: 'Home Addition',
  other: 'Other',
};

function SubmissionRow({ sub, onUpdate }: { sub: FormSubmission; onUpdate: () => void }) {
  const [open, setOpen] = useState(false);
  const [boardNotes, setBoardNotes] = useState(sub.board_notes || '');
  const [status, setStatus] = useState(sub.status);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();
    await supabase.from('form_submissions').update({
      status,
      board_notes: boardNotes || null,
      reviewed_at: new Date().toISOString(),
    }).eq('id', sub.id);
    setSaving(false);
    onUpdate();
  };

  const data = sub.form_data;

  return (
    <>
      <TableRow hover sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>{sub.resident_name}</Typography>
        </TableCell>
        <TableCell>{sub.lot_number}</TableCell>
        <TableCell>
          <Chip
            label={projectTypeLabels[data.project_type] || data.project_type || 'N/A'}
            size="small"
            variant="outlined"
          />
        </TableCell>
        <TableCell>
          <Chip label={sub.status.replace('_', ' ')} color={statusColors[sub.status]} size="small" sx={{ textTransform: 'capitalize' }} />
        </TableCell>
        <TableCell>
          {new Date(sub.created_at).toLocaleDateString()}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ py: 3, px: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Contact</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                Email: {sub.email || 'N/A'} | Phone: {sub.phone || 'N/A'}
              </Typography>

              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Project Description</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, whiteSpace: 'pre-wrap' }}>
                {data.project_description || 'No description provided'}
              </Typography>

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mb: 2 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>Start Date</Typography>
                  <Typography variant="body2">{data.estimated_start_date || 'N/A'}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>Completion Date</Typography>
                  <Typography variant="body2">{data.estimated_completion_date || 'N/A'}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>Materials</Typography>
                  <Typography variant="body2">{data.materials || 'N/A'}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>Colors</Typography>
                  <Typography variant="body2">{data.colors || 'N/A'}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>Contractor</Typography>
                  <Typography variant="body2">{data.contractor_name || 'N/A'}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>Contractor Phone</Typography>
                  <Typography variant="body2">{data.contractor_phone || 'N/A'}</Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', mt: 3 }}>
                <FormControl size="small" sx={{ minWidth: 160 }}>
                  <InputLabel>Status</InputLabel>
                  <Select value={status} label="Status" onChange={(e) => setStatus(e.target.value)}>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="under_review">Under Review</MenuItem>
                    <MenuItem value="approved">Approved</MenuItem>
                    <MenuItem value="denied">Denied</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="Board Notes"
                  size="small"
                  value={boardNotes}
                  onChange={(e) => setBoardNotes(e.target.value)}
                  multiline
                  rows={2}
                  sx={{ flex: 1 }}
                />
                <Button
                  variant="contained"
                  onClick={handleSave}
                  disabled={saving}
                  sx={{ mt: 0.5 }}
                >
                  {saving ? <CircularProgress size={20} /> : 'Save'}
                </Button>
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function FormSubmissionsPage() {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubmissions = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('form_submissions')
      .select('*')
      .order('created_at', { ascending: false });
    setSubmissions(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Form Submissions
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
        Review and manage architectural review requests and other form submissions from residents.
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : submissions.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            No form submissions yet.
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell width={50} />
                <TableCell>Resident</TableCell>
                <TableCell>Lot</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {submissions.map((sub) => (
                <SubmissionRow key={sub.id} sub={sub} onUpdate={fetchSubmissions} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
