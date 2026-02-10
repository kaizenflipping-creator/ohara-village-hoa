-- ============================================
-- O'Hara Village HOA - Supabase Schema Setup
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================

-- 1. Residents table
CREATE TABLE IF NOT EXISTS residents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  lot_number TEXT NOT NULL UNIQUE,
  address TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  published BOOLEAN DEFAULT true,
  author_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Documents table
CREATE TABLE IF NOT EXISTS documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('bylaws', 'policy', 'meeting_minutes', 'form', 'other')),
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  uploaded_by TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Payments table (HOA dues tracking)
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  resident_id UUID REFERENCES residents(id) ON DELETE SET NULL,
  lot_number TEXT NOT NULL,
  amount_cents INTEGER NOT NULL,
  status TEXT DEFAULT 'unpaid' CHECK (status IN ('unpaid', 'paid')),
  period TEXT NOT NULL,
  payment_option TEXT DEFAULT 'full' CHECK (payment_option IN ('full', 'split')),
  paid_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Vapi call notes
CREATE TABLE IF NOT EXISTS call_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  caller_phone TEXT,
  caller_name TEXT,
  category TEXT DEFAULT 'general' CHECK (category IN ('complaint', 'request', 'concern', 'general', 'emergency')),
  summary TEXT NOT NULL,
  transcript TEXT,
  vapi_call_id TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'in_progress', 'resolved', 'dismissed')),
  board_notes TEXT,
  resolved_by TEXT,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Notifications log
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  channel TEXT NOT NULL CHECK (channel IN ('email', 'sms', 'both')),
  recipient_count INTEGER DEFAULT 0,
  sent_by TEXT,
  status TEXT DEFAULT 'sent' CHECK (status IN ('queued', 'sent', 'failed')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- Indexes
-- ============================================
CREATE INDEX IF NOT EXISTS idx_residents_lot ON residents(lot_number);
CREATE INDEX IF NOT EXISTS idx_residents_status ON residents(status);
CREATE INDEX IF NOT EXISTS idx_announcements_published ON announcements(published);
CREATE INDEX IF NOT EXISTS idx_announcements_created ON announcements(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_documents_category ON documents(category);
CREATE INDEX IF NOT EXISTS idx_payments_lot ON payments(lot_number);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_call_notes_status ON call_notes(status);
CREATE INDEX IF NOT EXISTS idx_call_notes_category ON call_notes(category);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC);

-- ============================================
-- Row Level Security
-- ============================================
ALTER TABLE residents ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- PUBLIC read for announcements and documents
CREATE POLICY "Public read published announcements"
  ON announcements FOR SELECT USING (published = true);

CREATE POLICY "Auth full access announcements"
  ON announcements FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public read documents"
  ON documents FOR SELECT USING (true);

CREATE POLICY "Auth full access documents"
  ON documents FOR ALL USING (auth.role() = 'authenticated');

-- AUTHENTICATED only for residents, payments, call_notes, notifications
CREATE POLICY "Auth access residents"
  ON residents FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Auth access payments"
  ON payments FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Auth access call_notes"
  ON call_notes FOR ALL USING (auth.role() = 'authenticated');

-- Allow anon insert for Vapi webhook
CREATE POLICY "Anon insert call_notes"
  ON call_notes FOR INSERT WITH CHECK (true);

CREATE POLICY "Auth access notifications"
  ON notifications FOR ALL USING (auth.role() = 'authenticated');
