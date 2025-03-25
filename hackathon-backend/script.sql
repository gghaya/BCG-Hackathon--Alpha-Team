-- Insert Job Offers
INSERT INTO job_offers (id, job_title, description) VALUES
(88, 'Software Engineer', 'Develop and maintain software applications.'),
(22, 'Data Scientist', 'Analyze and model data to support business decisions.'),
(32, 'Frontend Developer', 'Implement user-facing features using React or Vue.'),
(42, 'Backend Developer', 'Build scalable server-side APIs and systems.'),
(52, 'DevOps Engineer', 'Manage CI/CD pipelines and cloud infrastructure.'),
(62, 'QA Tester', 'Test applications and ensure software quality.'),
(72, 'UI/UX Designer', 'Design intuitive and appealing interfaces.'),
(82, 'Product Manager', 'Define product roadmap and work with cross-functional teams.'),
(92, 'Business Analyst', 'Analyze business needs and deliver solutions.'),
(120, 'Mobile Developer', 'Build native or cross-platform mobile apps.');

-- Insert Candidates
INSERT INTO candidates (
    full_name, email, job_offer_id, experience, resume_path,
    resume_data, missing_skills, extra_skills, skills_score
) VALUES
('Alice Johnson', 'alice@example.com', 92, '3 years', 'resumes/alice.pdf', '{"education":"BSc CS"}', '["Docker"]', '["React"]', 78),
('Bob Smith', 'bob@example.com', 22, '5 years', 'resumes/bob.pdf', '{"education":"MSc Data Science"}', '["Spark"]', '["Python"]', 82),
('Carol White', 'carol@example.com', 32, '2 years', 'resumes/carol.pdf', '{"education":"BSc IT"}', '["Redux"]', '["TailwindCSS"]', 75),
('David Brown', 'david@example.com', 32, '4 years', 'resumes/david.pdf', '{"education":"BSc SE"}', '["Redis"]', '["Node.js"]', 80),
('Eva Green', 'eva@example.com', 32, '6 years', 'resumes/eva.pdf', '{"education":"BSc CS"}', '["Terraform"]', '["Kubernetes"]', 85),
('Frank Black', 'frank@example.com', 82, '1 year', 'resumes/frank.pdf', '{"education":"Diploma QA"}', '["Postman"]', '["Jest"]', 70),
('Grace Lee', 'grace@example.com', 82, '3 years', 'resumes/grace.pdf', '{"education":"BFA Design"}', '["Figma"]', '["Sketch"]', 79),
('Henry Adams', 'henry@example.com', 92, '7 years', 'resumes/henry.pdf', '{"education":"MBA"}', '["JIRA"]', '["Agile"]', 90),
('Ivy Chen', 'ivy@example.com', 92, '4 years', 'resumes/ivy.pdf', '{"education":"BA Econ"}', '["Power BI"]', '["Excel"]', 74),
('Jack Zhao', 'jack@example.com', 120, '2 years', 'resumes/jack.pdf', '{"education":"BSc CS"}', '["SwiftUI"]', '["Flutter"]', 77);
