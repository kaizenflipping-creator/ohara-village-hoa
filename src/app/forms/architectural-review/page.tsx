'use client';

import { useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import CircularProgress from '@mui/material/CircularProgress';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';
import PublicNavbar from '@/components/layout/PublicNavbar';
import Footer from '@/components/layout/Footer';
import { createClient } from '@/lib/supabase/client';

export default function ArchitecturalReviewPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [residentName, setResidentName] = useState('');
  const [lotNumber, setLotNumber] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [projectType, setProjectType] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [estimatedStartDate, setEstimatedStartDate] = useState('');
  const [estimatedCompletionDate, setEstimatedCompletionDate] = useState('');
  const [contractorName, setContractorName] = useState('');
  const [contractorPhone, setContractorPhone] = useState('');
  const [materials, setMaterials] = useState('');
  const [colors, setColors] = useState('');
  const [acknowledge, setAcknowledge] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acknowledge) {
      setError('Please acknowledge the terms before submitting.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const supabase = createClient();
      const { error: insertError } = await supabase.from('form_submissions').insert({
        form_type: 'architectural_review',
        resident_name: residentName,
        lot_number: lotNumber,
        email: email || null,
        phone: phone || null,
        form_data: {
          project_type: projectType,
          project_description: projectDescription,
          estimated_start_date: estimatedStartDate,
          estimated_completion_date: estimatedCompletionDate,
          contractor_name: contractorName,
          contractor_phone: contractorPhone,
          materials,
          colors,
        },
      });

      if (insertError) throw new Error(insertError.message);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <>
        <PublicNavbar />
        <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
          <CheckCircleOutline sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
            Request Submitted!
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
            Your architectural review request has been submitted successfully.
            The board will review your request and get back to you. You can check
            the status by contacting the HOA board.
          </Typography>
          <Button variant="contained" href="/">
            Return Home
          </Button>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <PublicNavbar />
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
            Architectural Review Request
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Submit this form for any exterior modifications to your property.
            All modifications must be approved by the HOA board before work begins.
          </Typography>
        </Box>

        <Paper sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Homeowner Information
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5, mb: 4 }}>
              <TextField
                label="Full Name"
                value={residentName}
                onChange={(e) => setResidentName(e.target.value)}
                required
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
                fullWidth
                placeholder="+1 (XXX) XXX-XXXX"
              />
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Project Details
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mb: 4 }}>
              <FormControl fullWidth required>
                <InputLabel>Type of Modification</InputLabel>
                <Select
                  value={projectType}
                  label="Type of Modification"
                  onChange={(e) => setProjectType(e.target.value)}
                >
                  <MenuItem value="fence">Fence Installation/Modification</MenuItem>
                  <MenuItem value="paint">Exterior Paint/Color Change</MenuItem>
                  <MenuItem value="roof">Roof Replacement/Repair</MenuItem>
                  <MenuItem value="landscaping">Landscaping Changes</MenuItem>
                  <MenuItem value="driveway">Driveway/Walkway</MenuItem>
                  <MenuItem value="deck_patio">Deck/Patio Addition</MenuItem>
                  <MenuItem value="shed">Shed/Storage Structure</MenuItem>
                  <MenuItem value="solar">Solar Panels</MenuItem>
                  <MenuItem value="windows_doors">Windows/Doors</MenuItem>
                  <MenuItem value="siding">Siding Replacement</MenuItem>
                  <MenuItem value="addition">Home Addition/Extension</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Detailed Description of Proposed Changes"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                required
                multiline
                rows={4}
                fullWidth
                placeholder="Please describe in detail what modifications you plan to make..."
              />

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
                <TextField
                  label="Estimated Start Date"
                  type="date"
                  value={estimatedStartDate}
                  onChange={(e) => setEstimatedStartDate(e.target.value)}
                  slotProps={{ inputLabel: { shrink: true } }}
                  fullWidth
                />
                <TextField
                  label="Estimated Completion Date"
                  type="date"
                  value={estimatedCompletionDate}
                  onChange={(e) => setEstimatedCompletionDate(e.target.value)}
                  slotProps={{ inputLabel: { shrink: true } }}
                  fullWidth
                />
              </Box>

              <TextField
                label="Materials to be Used"
                value={materials}
                onChange={(e) => setMaterials(e.target.value)}
                multiline
                rows={2}
                fullWidth
                placeholder="e.g., Vinyl fence, 6ft white privacy panels..."
              />

              <TextField
                label="Colors"
                value={colors}
                onChange={(e) => setColors(e.target.value)}
                fullWidth
                placeholder="e.g., Sherwin-Williams SW 7006 Extra White"
              />
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Contractor Information (if applicable)
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5, mb: 4 }}>
              <TextField
                label="Contractor Name/Company"
                value={contractorName}
                onChange={(e) => setContractorName(e.target.value)}
                fullWidth
              />
              <TextField
                label="Contractor Phone"
                value={contractorPhone}
                onChange={(e) => setContractorPhone(e.target.value)}
                fullWidth
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={acknowledge}
                    onChange={(e) => setAcknowledge(e.target.checked)}
                    color="primary"
                  />
                }
                label="I acknowledge that all exterior modifications must be approved by the O'Hara Village HOA Board before work begins. Unapproved modifications may be subject to fines and/or required removal."
                sx={{ alignItems: 'flex-start', '& .MuiTypography-root': { fontSize: '0.875rem', color: 'text.secondary', mt: 0.5 } }}
              />
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button variant="outlined" href="/documents">
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={submitting || !residentName || !lotNumber || !projectType || !projectDescription}
                size="large"
              >
                {submitting ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Submit Request'}
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
      <Footer />
    </>
  );
}
