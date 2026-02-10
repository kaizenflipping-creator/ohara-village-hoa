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
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import UnpublishedOutlined from '@mui/icons-material/UnpublishedOutlined';
import AddOutlined from '@mui/icons-material/AddOutlined';
import { createClient } from '@/lib/supabase/client';

interface Payment {
  id: string;
  resident_id: string;
  amount: number;
  period: string;
  status: string;
  date_paid: string | null;
  created_at: string;
  residents: {
    first_name: string;
    last_name: string;
    lot_number: string;
  } | null;
}

interface Resident {
  id: string;
  first_name: string;
  last_name: string;
  lot_number: string;
}

export default function PaymentTable() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newResidentId, setNewResidentId] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newPeriod, setNewPeriod] = useState('');
  const [newStatus, setNewStatus] = useState('unpaid');
  const [adding, setAdding] = useState(false);

  const fetchPayments = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('payments')
      .select('*, residents(first_name, last_name, lot_number)')
      .order('created_at', { ascending: false });
    setPayments(data ?? []);
    setLoading(false);
  }, []);

  const fetchResidents = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('residents')
      .select('id, first_name, last_name, lot_number')
      .eq('status', 'active')
      .order('lot_number', { ascending: true });
    setResidents(data ?? []);
  }, []);

  useEffect(() => {
    fetchPayments();
    fetchResidents();
  }, [fetchPayments, fetchResidents]);

  const togglePaymentStatus = async (payment: Payment) => {
    const supabase = createClient();
    const newStatus = payment.status === 'paid' ? 'unpaid' : 'paid';
    const datePaid = newStatus === 'paid' ? new Date().toISOString() : null;

    await supabase
      .from('payments')
      .update({ status: newStatus, date_paid: datePaid })
      .eq('id', payment.id);

    setPayments((prev) =>
      prev.map((p) =>
        p.id === payment.id
          ? { ...p, status: newStatus, date_paid: datePaid }
          : p
      )
    );
  };

  const handleAddPayment = async () => {
    if (!newResidentId || !newAmount || !newPeriod) return;

    setAdding(true);
    const supabase = createClient();

    const datePaid = newStatus === 'paid' ? new Date().toISOString() : null;

    await supabase.from('payments').insert({
      resident_id: newResidentId,
      amount: parseFloat(newAmount),
      period: newPeriod,
      status: newStatus,
      date_paid: datePaid,
    });

    setNewResidentId('');
    setNewAmount('');
    setNewPeriod('');
    setNewStatus('unpaid');
    setShowAddForm(false);
    setAdding(false);
    fetchPayments();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="outlined"
          startIcon={<AddOutlined />}
          onClick={() => setShowAddForm(!showAddForm)}
        >
          Add Payment Record
        </Button>
      </Box>

      <Collapse in={showAddForm}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            New Payment Record
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'flex-start' }}>
            <FormControl sx={{ minWidth: 220 }}>
              <InputLabel>Resident</InputLabel>
              <Select
                value={newResidentId}
                label="Resident"
                onChange={(e) => setNewResidentId(e.target.value)}
              >
                {residents.map((r) => (
                  <MenuItem key={r.id} value={r.id}>
                    {r.first_name} {r.last_name} (Lot {r.lot_number})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Amount"
              type="number"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              sx={{ width: 140 }}
            />
            <TextField
              label="Period"
              value={newPeriod}
              onChange={(e) => setNewPeriod(e.target.value)}
              placeholder="e.g. Q1 2026"
              sx={{ width: 160 }}
            />
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={newStatus}
                label="Status"
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <MenuItem value="unpaid">Unpaid</MenuItem>
                <MenuItem value="paid">Paid</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              onClick={handleAddPayment}
              disabled={adding || !newResidentId || !newAmount || !newPeriod}
              sx={{ mt: 1 }}
            >
              {adding ? 'Adding...' : 'Add'}
            </Button>
            <Button
              color="inherit"
              onClick={() => setShowAddForm(false)}
              sx={{ mt: 1 }}
            >
              Cancel
            </Button>
          </Box>
        </Paper>
      </Collapse>

      {payments.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            No payment records yet.
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Resident Name</TableCell>
                <TableCell>Lot #</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Period</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date Paid</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {payment.residents
                        ? `${payment.residents.first_name} ${payment.residents.last_name}`
                        : 'Unknown'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {payment.residents?.lot_number ?? '-'}
                  </TableCell>
                  <TableCell>
                    ${payment.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>{payment.period}</TableCell>
                  <TableCell>
                    <Chip
                      label={payment.status}
                      color={payment.status === 'paid' ? 'success' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {payment.date_paid
                        ? new Date(payment.date_paid).toLocaleDateString()
                        : '-'}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      color={payment.status === 'paid' ? 'default' : 'success'}
                      onClick={() => togglePaymentStatus(payment)}
                      title={
                        payment.status === 'paid'
                          ? 'Mark as unpaid'
                          : 'Mark as paid'
                      }
                    >
                      {payment.status === 'paid' ? (
                        <UnpublishedOutlined fontSize="small" />
                      ) : (
                        <CheckCircleOutlined fontSize="small" />
                      )}
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
}
