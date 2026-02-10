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
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import EditOutlined from '@mui/icons-material/EditOutlined';
import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import SearchOutlined from '@mui/icons-material/SearchOutlined';
import { createClient } from '@/lib/supabase/client';
import ResidentForm from './ResidentForm';

interface Resident {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  lot_number: string;
  address: string;
  status: string;
}

export default function ResidentTable() {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editResident, setEditResident] = useState<Resident | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const fetchResidents = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('residents')
      .select('*')
      .order('lot_number', { ascending: true });
    setResidents(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchResidents();
  }, [fetchResidents]);

  const handleDelete = async () => {
    if (!deleteId) return;
    const supabase = createClient();
    await supabase.from('residents').delete().eq('id', deleteId);
    setResidents((prev) => prev.filter((r) => r.id !== deleteId));
    setDeleteId(null);
    setDeleteOpen(false);
  };

  const filtered = residents.filter((r) => {
    const q = search.toLowerCase();
    const fullName = `${r.first_name} ${r.last_name}`.toLowerCase();
    return fullName.includes(q) || r.lot_number.toLowerCase().includes(q);
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <TextField
        placeholder="Search by name or lot number..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        size="small"
        sx={{ mb: 2, maxWidth: 400 }}
        fullWidth
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlined fontSize="small" />
              </InputAdornment>
            ),
          },
        }}
      />

      {filtered.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            {residents.length === 0
              ? 'No residents yet. Add your first resident!'
              : 'No residents match your search.'}
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Lot #</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((resident) => (
                <TableRow key={resident.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {resident.first_name} {resident.last_name}
                    </Typography>
                  </TableCell>
                  <TableCell>{resident.lot_number}</TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {resident.email || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {resident.phone || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={resident.status}
                      color={resident.status === 'active' ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => {
                        setEditResident(resident);
                        setEditOpen(true);
                      }}
                    >
                      <EditOutlined fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => {
                        setDeleteId(resident.id);
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
      )}

      <ResidentForm
        resident={editResident}
        open={editOpen}
        onSave={() => {
          setEditOpen(false);
          setEditResident(null);
          fetchResidents();
        }}
        onCancel={() => {
          setEditOpen(false);
          setEditResident(null);
        }}
      />

      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Delete Resident</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this resident? This action cannot be
            undone.
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
