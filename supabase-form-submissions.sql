-- ============================================
-- O'Hara Village HOA - Form Submissions Table
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================

-- Architectural Review & other form submissions
CREATE TABLE IF NOT EXISTS form_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  form_type TEXT NOT NULL CHECK (form_type IN ('architectural_review', 'maintenance_request', 'general')),
  resident_name TEXT NOT NULL,
  lot_number TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  -- Architectural review specific fields (stored as JSONB for flexibility)
  form_data JSONB NOT NULL DEFAULT '{}',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied', 'under_review', 'completed')),
  board_notes TEXT,
  reviewed_by TEXT,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_form_submissions_status ON form_submissions(status);
CREATE INDEX IF NOT EXISTS idx_form_submissions_type ON form_submissions(form_type);
CREATE INDEX IF NOT EXISTS idx_form_submissions_created ON form_submissions(created_at DESC);

ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit forms (public insert)
CREATE POLICY "Anon insert form_submissions"
  ON form_submissions FOR INSERT WITH CHECK (true);

-- Board members can view and manage all submissions
CREATE POLICY "Auth access form_submissions"
  ON form_submissions FOR ALL USING (auth.role() = 'authenticated');
