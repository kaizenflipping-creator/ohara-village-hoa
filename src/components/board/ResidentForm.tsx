'use client';

import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { createClient } from '@/lib/supabase/client';

interface Resident {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  lot_number: string;
  address: string;
}

interface ResidentFormProps {
  resident?: Resident | null;
  open: boolean;
  onSave: () => void;
  onCancel: () => void;
}

export default function ResidentForm({
  resident,
  open,
  onSave,
  onCancel,
}: ResidentFormProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [lotNumber, setLotNumber] = useState('');
  const [address, setAddress] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (resident) {
      setFirstName(resident.first_name);
      setLastName(resident.last_name);
      setEmail(resident.email ?? '');
      setPhone(resident.phone ?? '');
      setLotNumber(resident.lot_number);
      setAddress(resident.address);
    } else {
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setLotNumber('');
      setAddress('');
    }
  }, [resident, open]);

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim() || !lotNumber.trim() || !address.trim()) {
      return;
    }

    setSaving(true);
    const supabase = createClient();

    const data = {
      first_name: firstName,
      last_name: lastName,
      email: email || null,
      phone: phone || null,
      lot_number: lotNumber,
      address,
    };

    if (resident) {
      await supabase.from('residents').update(data).eq('id', resident.id);
    } else {
      await supabase.from('residents').insert(data);
    }

    setSaving(false);
    onSave();
  };

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle>
        {resident ? 'Edit Resident' : 'Add Resident'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              fullWidth
            />
          </Box>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
          <TextField
            label="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1XXXXXXXXXX"
            fullWidth
          />
          <TextField
            label="Lot Number"
            value={lotNumber}
            onChange={(e) => setLotNumber(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onCancel} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={
            saving ||
            !firstName.trim() ||
            !lastName.trim() ||
            !lotNumber.trim() ||
            !address.trim()
          }
        >
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
