-- Cvistan Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Guest Sessions ───
CREATE TABLE IF NOT EXISTS guest_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_token TEXT UNIQUE NOT NULL,
  language TEXT NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'ar')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- ─── Resumes ───
CREATE TABLE IF NOT EXISTS resumes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  guest_session_id UUID REFERENCES guest_sessions(id) ON DELETE SET NULL,
  language TEXT NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'ar')),
  title TEXT NOT NULL DEFAULT 'My Resume',
  selected_template TEXT NOT NULL DEFAULT 'balanced-modern',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'finalized')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_resumes_user_id ON resumes(user_id);
CREATE INDEX idx_resumes_guest_session ON resumes(guest_session_id);

-- ─── Personal Info ───
CREATE TABLE IF NOT EXISTS resume_personal_info (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resume_id UUID NOT NULL UNIQUE REFERENCES resumes(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  job_title TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  date_of_birth DATE,
  photo_url TEXT,
  summary TEXT
);

-- ─── Social Links ───
CREATE TABLE IF NOT EXISTS resume_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resume_id UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
  link_type TEXT NOT NULL CHECK (link_type IN ('linkedin', 'github', 'portfolio', 'twitter', 'instagram', 'behance')),
  url TEXT NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0
);

CREATE INDEX idx_resume_links_resume ON resume_links(resume_id);

-- ─── Experience ───
CREATE TABLE IF NOT EXISTS resume_experience (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resume_id UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
  sort_order INT NOT NULL DEFAULT 0,
  job_title TEXT NOT NULL DEFAULT '',
  company TEXT NOT NULL DEFAULT '',
  location TEXT,
  start_month INT NOT NULL DEFAULT 1,
  start_year INT NOT NULL DEFAULT 2024,
  end_month INT,
  end_year INT,
  is_current BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_resume_experience_resume ON resume_experience(resume_id);

-- ─── Experience Bullets ───
CREATE TABLE IF NOT EXISTS resume_experience_bullets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  experience_id UUID NOT NULL REFERENCES resume_experience(id) ON DELETE CASCADE,
  bullet_text TEXT NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0
);

CREATE INDEX idx_experience_bullets_exp ON resume_experience_bullets(experience_id);

-- ─── Education ───
CREATE TABLE IF NOT EXISTS resume_education (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resume_id UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
  sort_order INT NOT NULL DEFAULT 0,
  degree TEXT NOT NULL DEFAULT '',
  institution TEXT NOT NULL DEFAULT '',
  location TEXT,
  graduation_month INT,
  graduation_year INT,
  gpa TEXT,
  thesis_project TEXT
);

CREATE INDEX idx_resume_education_resume ON resume_education(resume_id);

-- ─── Skills ───
CREATE TABLE IF NOT EXISTS resume_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resume_id UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE INDEX idx_resume_skills_resume ON resume_skills(resume_id);

-- ─── Languages ───
CREATE TABLE IF NOT EXISTS resume_languages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resume_id UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
  language_name TEXT NOT NULL,
  proficiency TEXT NOT NULL DEFAULT 'intermediate' CHECK (proficiency IN ('beginner', 'intermediate', 'fluent', 'native')),
  sort_order INT NOT NULL DEFAULT 0
);

CREATE INDEX idx_resume_languages_resume ON resume_languages(resume_id);

-- ─── Certifications ───
CREATE TABLE IF NOT EXISTS resume_certifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resume_id UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
  sort_order INT NOT NULL DEFAULT 0,
  certification_name TEXT NOT NULL DEFAULT '',
  organization TEXT NOT NULL DEFAULT '',
  issue_month INT,
  issue_year INT,
  expiry_month INT,
  expiry_year INT,
  no_expiry BOOLEAN NOT NULL DEFAULT TRUE,
  training_mode TEXT CHECK (training_mode IS NULL OR training_mode IN ('online', 'in-person')),
  credential_id TEXT
);

CREATE INDEX idx_resume_certifications_resume ON resume_certifications(resume_id);

-- ─── Generated Documents ───
CREATE TABLE IF NOT EXISTS generated_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resume_id UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
  cv_pdf_url TEXT,
  cover_letter_docx_url TEXT,
  faq_pdf_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Delivery Logs ───
CREATE TABLE IF NOT EXISTS delivery_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resume_id UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
  delivery_type TEXT NOT NULL CHECK (delivery_type IN ('download', 'email', 'telegram')),
  target TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Telegram Connections ───
CREATE TABLE IF NOT EXISTS telegram_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chat_id TEXT UNIQUE NOT NULL,
  username TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Row Level Security ───
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_personal_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_experience_bullets ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_sessions ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read/write their own resumes
CREATE POLICY "Users can manage own resumes" ON resumes
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Guest sessions are accessible by service role only (API routes use service client)
-- For guest access, API routes use the service role key

-- Allow authenticated users to manage their own resume data
CREATE POLICY "Users manage own personal_info" ON resume_personal_info
  FOR ALL USING (resume_id IN (SELECT id FROM resumes WHERE user_id = auth.uid()));

CREATE POLICY "Users manage own links" ON resume_links
  FOR ALL USING (resume_id IN (SELECT id FROM resumes WHERE user_id = auth.uid()));

CREATE POLICY "Users manage own experience" ON resume_experience
  FOR ALL USING (resume_id IN (SELECT id FROM resumes WHERE user_id = auth.uid()));

CREATE POLICY "Users manage own bullets" ON resume_experience_bullets
  FOR ALL USING (experience_id IN (
    SELECT id FROM resume_experience WHERE resume_id IN (SELECT id FROM resumes WHERE user_id = auth.uid())
  ));

CREATE POLICY "Users manage own education" ON resume_education
  FOR ALL USING (resume_id IN (SELECT id FROM resumes WHERE user_id = auth.uid()));

CREATE POLICY "Users manage own skills" ON resume_skills
  FOR ALL USING (resume_id IN (SELECT id FROM resumes WHERE user_id = auth.uid()));

CREATE POLICY "Users manage own languages" ON resume_languages
  FOR ALL USING (resume_id IN (SELECT id FROM resumes WHERE user_id = auth.uid()));

CREATE POLICY "Users manage own certifications" ON resume_certifications
  FOR ALL USING (resume_id IN (SELECT id FROM resumes WHERE user_id = auth.uid()));

CREATE POLICY "Users view own documents" ON generated_documents
  FOR ALL USING (resume_id IN (SELECT id FROM resumes WHERE user_id = auth.uid()));

CREATE POLICY "Users view own delivery logs" ON delivery_logs
  FOR ALL USING (resume_id IN (SELECT id FROM resumes WHERE user_id = auth.uid()));

-- ─── Updated_at trigger ───
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER resumes_updated_at BEFORE UPDATE ON resumes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER guest_sessions_updated_at BEFORE UPDATE ON guest_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
