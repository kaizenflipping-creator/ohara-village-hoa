'use client';

import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { createClient } from '@/lib/supabase/client';

interface Announcement {
  id: string;
  title: string;
  body: string;
  priority: string;
  published: boolean;
}

interface AnnouncementFormProps {
  announcement?: Announcement | null;
  open: boolean;
  onClose: () => void;
  onSave: () => void;
}

export default function AnnouncementForm({
  announcement,
  open,
  onClose,
  onSave,
}: AnnouncementFormProps) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [priority, setPriority] = useState('normal');
  const [published, setPublished] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (announcement) {
      setTitle(announcement.title);
      setBody(announcement.body);
      setPriority(announcement.priority);
      setPublished(announcement.published);
    } else {
      setTitle('');
      setBody('');
      setPriority('normal');
      setPublished(false);
    }
  }, [announcement, open]);

  const handleSave = async () => {
    if (!title.trim() || !body.trim()) return;

    setSaving(true);
    const supabase = createClient();

    if (announcement) {
      await supabase
        .from('announcements')
        .update({ title, body, priority, published })
        .eq('id', announcement.id);
    } else {
      await supabase
        .from('announcements')
        .insert({ title, body, priority, published });
    }

    setSaving(false);
    onSave();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {announcement ? 'Edit Announcement' : 'New Announcement'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            fullWidth
            multiline
            rows={4}
          />
          <FormControl fullWidth>
            <InputLabel>Priority</InputLabel>
            <Select
              value={priority}
              label="Priority"
              onChange={(e) => setPriority(e.target.value)}
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="normal">Normal</MenuItem>
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="urgent">Urgent</MenuItem>
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Switch
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
              />
            }
            label="Published"
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={saving || !title.trim() || !body.trim()}
        >
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
