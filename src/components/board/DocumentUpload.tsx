'use client';

import { useState, useRef } from 'react';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import LinearProgress from '@mui/material/LinearProgress';
import CloudUploadOutlined from '@mui/icons-material/CloudUploadOutlined';
import { createClient } from '@/lib/supabase/client';

interface DocumentUploadProps {
  onUpload: () => void;
}

export default function DocumentUpload({ onUpload }: DocumentUploadProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('other');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState<{
    text: string;
    severity: 'success' | 'error';
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async () => {
    if (!title.trim() || !file) return;

    setUploading(true);
    setProgress(20);
    setMessage(null);

    try {
      const supabase = createClient();

      const timestamp = Date.now();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const filePath = `${timestamp}_${sanitizedName}`;

      setProgress(40);

      const { error: uploadError } = await supabase.storage
        .from('hoa-documents')
        .upload(filePath, file);

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      setProgress(70);

      const { data: urlData } = supabase.storage
        .from('hoa-documents')
        .getPublicUrl(filePath);

      setProgress(85);

      const { error: insertError } = await supabase.from('documents').insert({
        title,
        description: description || null,
        category,
        file_name: file.name,
        file_path: filePath,
        file_url: urlData.publicUrl,
        file_size: file.size,
        content_type: file.type,
      });

      if (insertError) {
        throw new Error(insertError.message);
      }

      setProgress(100);
      setMessage({ text: 'Document uploaded successfully!', severity: 'success' });
      setTitle('');
      setDescription('');
      setCategory('other');
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      onUpload();
    } catch (err) {
      setMessage({
        text: err instanceof Error ? err.message : 'Upload failed',
        severity: 'error',
      });
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1500);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
        Upload Document
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          fullWidth
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
        />
        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            label="Category"
            onChange={(e) => setCategory(e.target.value)}
          >
            <MenuItem value="bylaws">Bylaws</MenuItem>
            <MenuItem value="policy">Policy</MenuItem>
            <MenuItem value="meeting_minutes">Meeting Minutes</MenuItem>
            <MenuItem value="form">Form</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Select>
        </FormControl>
        <Box>
          <Button
            variant="outlined"
            component="label"
            startIcon={<CloudUploadOutlined />}
          >
            {file ? file.name : 'Choose File'}
            <input
              type="file"
              hidden
              ref={fileInputRef}
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </Button>
          {file && (
            <Typography variant="caption" sx={{ ml: 2, color: 'text.secondary' }}>
              {(file.size / 1024).toFixed(1)} KB
            </Typography>
          )}
        </Box>

        {progress > 0 && (
          <LinearProgress variant="determinate" value={progress} />
        )}

        {message && (
          <Alert severity={message.severity}>{message.text}</Alert>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={uploading || !title.trim() || !file}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
