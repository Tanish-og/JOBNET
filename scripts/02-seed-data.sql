-- Insert sample users
INSERT INTO users (email, full_name, bio, skills, location) VALUES
('john.doe@example.com', 'John Doe', 'Full-stack developer with 5 years of experience in React and Node.js', ARRAY['React', 'Node.js', 'TypeScript', 'PostgreSQL'], 'San Francisco, CA'),
('jane.smith@example.com', 'Jane Smith', 'UI/UX Designer passionate about creating beautiful and functional user experiences', ARRAY['Figma', 'Adobe Creative Suite', 'User Research', 'Prototyping'], 'New York, NY'),
('mike.johnson@example.com', 'Mike Johnson', 'DevOps engineer specializing in cloud infrastructure and automation', ARRAY['AWS', 'Docker', 'Kubernetes', 'Terraform'], 'Austin, TX'),
('sarah.wilson@example.com', 'Sarah Wilson', 'Product Manager with expertise in SaaS and fintech products', ARRAY['Product Strategy', 'Agile', 'Data Analysis', 'User Research'], 'Seattle, WA')
ON CONFLICT (email) DO NOTHING;

-- Insert sample jobs
INSERT INTO jobs (user_id, title, description, required_skills, budget_min, budget_max, job_type, location, remote_allowed) 
SELECT 
  u.id,
  'Senior React Developer',
  'We are looking for a senior React developer to join our team and help build the next generation of our web application.',
  ARRAY['React', 'TypeScript', 'Node.js'],
  80000,
  120000,
  'full-time',
  'San Francisco, CA',
  true
FROM users u WHERE u.email = 'john.doe@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO jobs (user_id, title, description, required_skills, budget_min, budget_max, job_type, location, remote_allowed)
SELECT 
  u.id,
  'UI/UX Designer for Mobile App',
  'Looking for a creative UI/UX designer to design our new mobile application from scratch.',
  ARRAY['Figma', 'Mobile Design', 'User Research'],
  5000,
  15000,
  'contract',
  'Remote',
  true
FROM users u WHERE u.email = 'jane.smith@example.com'
ON CONFLICT DO NOTHING;

-- Insert sample posts
INSERT INTO posts (user_id, content, post_type, tags)
SELECT 
  u.id,
  'Just completed a major refactor of our authentication system using Next.js and Supabase. The performance improvements are incredible! 🚀',
  'achievement',
  ARRAY['nextjs', 'supabase', 'authentication']
FROM users u WHERE u.email = 'john.doe@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO posts (user_id, content, post_type, tags)
SELECT 
  u.id,
  'What are your favorite tools for user research? I''ve been using Maze and Hotjar lately, but always looking for new recommendations.',
  'question',
  ARRAY['userresearch', 'tools', 'ux']
FROM users u WHERE u.email = 'jane.smith@example.com'
ON CONFLICT DO NOTHING;
