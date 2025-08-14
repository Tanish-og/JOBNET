-- Insert sample data (run this after the tables are created)
INSERT INTO users (id, email, full_name, bio, skills, location) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'john@example.com', 'John Doe', 'Full-stack developer with 5 years experience', 'JavaScript,React,Node.js,Python', 'San Francisco, CA'),
('550e8400-e29b-41d4-a716-446655440001', 'jane@example.com', 'Jane Smith', 'UI/UX Designer passionate about user experience', 'Figma,Adobe XD,Sketch,Prototyping', 'New York, NY'),
('550e8400-e29b-41d4-a716-446655440002', 'mike@example.com', 'Mike Johnson', 'DevOps engineer specializing in cloud infrastructure', 'AWS,Docker,Kubernetes,Terraform', 'Austin, TX');

INSERT INTO jobs (posted_by, title, description, company, skills_required, budget_min, budget_max, job_type, location, remote_allowed) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Senior React Developer', 'We are looking for an experienced React developer to join our team', 'TechCorp Inc', 'React,TypeScript,Node.js', 80000, 120000, 'full-time', 'San Francisco, CA', true),
('550e8400-e29b-41d4-a716-446655440001', 'UI/UX Designer', 'Design beautiful and intuitive user interfaces', 'DesignStudio', 'Figma,Adobe Creative Suite,Prototyping', 60000, 90000, 'full-time', 'New York, NY', false),
('550e8400-e29b-41d4-a716-446655440002', 'Freelance Web Developer', 'Build a modern e-commerce website', 'StartupXYZ', 'JavaScript,React,E-commerce', 5000, 15000, 'freelance', 'Remote', true);
