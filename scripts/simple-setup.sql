-- Simple Database Setup for Job Portal
-- Run this single script in Supabase SQL Editor

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  bio TEXT,
  skills TEXT,
  linkedin_url TEXT,
  wallet_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  company TEXT,
  location TEXT,
  job_type TEXT DEFAULT 'full-time',
  salary_min INTEGER,
  salary_max INTEGER,
  skills_required TEXT,
  posted_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES jobs(id),
  user_id UUID REFERENCES users(id),
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  job_id UUID REFERENCES jobs(id),
  amount DECIMAL(10,8),
  currency TEXT,
  transaction_hash TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Create basic policies
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Anyone can view jobs" ON jobs FOR SELECT TO authenticated;
CREATE POLICY "Users can create jobs" ON jobs FOR INSERT TO authenticated WITH CHECK (auth.uid() = posted_by);

-- Insert sample data
INSERT INTO users (id, email, full_name, bio, skills) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'john@example.com', 'John Doe', 'Full-stack developer', 'React, Node.js, Python'),
('550e8400-e29b-41d4-a716-446655440001', 'jane@example.com', 'Jane Smith', 'UI/UX Designer', 'Figma, Adobe XD, React')
ON CONFLICT (email) DO NOTHING;

INSERT INTO jobs (title, description, company, location, posted_by) VALUES 
('Frontend Developer', 'Looking for a React developer', 'Tech Corp', 'Remote', '550e8400-e29b-41d4-a716-446655440000'),
('UI Designer', 'Need a creative designer', 'Design Studio', 'New York', '550e8400-e29b-41d4-a716-446655440001')
ON CONFLICT DO NOTHING;
