INSERT INTO candidates (
  full_name, email, job_offer_id, experience, resume_path,
  resume_data, missing_skills, extra_skills,
  skills_score, requirements_score, education_score, overall_score
)
VALUES
-- Candidates for job_offer_id 1
('Alice Johnson', 'alice.johnson@example.com', 23, '2 years', 'resumes/alice_johnson.pdf', '{}'::json, '[]'::json, '["React"]'::json, 80, 70, 75, 75.0),
('Bob Smith', 'bob.smith@example.com', 23, '3 years', 'resumes/bob_smith.pdf', '{}'::json, '["CSS"]'::json, '[]'::json, 85, 65, 70, 73.3),

-- Candidates for job_offer_id 2
('Charlie Davis', 'charlie.davis@example.com', 24, '4 years', 'resumes/charlie_davis.pdf', '{}'::json, '[]'::json, '["Python"]'::json, 90, 85, 88, 87.7),
('Dana Lee', 'dana.lee@example.com', 24, '5 years', 'resumes/dana_lee.pdf', '{}'::json, '["Docker"]'::json, '[]'::json, 78, 88, 85, 83.7),

-- Candidates for job_offer_id 3
('Evan Thomas', 'evan.thomas@example.com', 25, '1 year', 'resumes/evan_thomas.pdf', '{}'::json, '["MongoDB"]'::json, '["Node"]'::json, 70, 65, 68, 67.7),
('Fiona Moore', 'fiona.moore@example.com', 25, '2 years', 'resumes/fiona_moore.pdf', '{}'::json, '[]'::json, '["ExpressJS"]'::json, 75, 70, 73, 72.7),

-- Candidates for job_offer_id 4
('George Allen', 'george.allen@example.com', 26, '6 years', 'resumes/george_allen.pdf', '{}'::json, '["Agile"]'::json, '["Leadership"]'::json, 85, 90, 80, 85.0),
('Hannah Scott', 'hannah.scott@example.com', 26, '3 years', 'resumes/hannah_scott.pdf', '{}'::json, '["Scrum"]'::json, '["Communication"]'::json, 80, 85, 78, 81.0),

-- Candidates for job_offer_id 5
('Ian Brown', 'ian.brown@example.com',27, '5 years', 'resumes/ian_brown.pdf', '{}'::json, '["CI/CD"]'::json, '["Terraform"]'::json, 88, 92, 84, 88.0),
('Julia White', 'julia.white@example.com', 27, '4 years', 'resumes/julia_white.pdf', '{}'::json, '[]'::json, '["Kubernetes"]'::json, 91, 87, 86, 88.0),

-- Candidates for job_offer_id 6
('Kyle Green', 'kyle.green@example.com', 28, '2 years', 'resumes/kyle_green.pdf', '{}'::json, '["Sketch"]'::json, '["UX"]'::json, 65, 60, 70, 65.0),
('Lara King', 'lara.king@example.com', 28, '3 years', 'resumes/lara_king.pdf', '{}'::json, '[]'::json, '["Prototyping"]'::json, 72, 66, 74, 70.7),

-- Candidates for job_offer_id 7
('Max Young', 'max.young@example.com', 29, '1 year', 'resumes/max_young.pdf', '{}'::json, '["Kotlin"]'::json, '["Java"]'::json, 68, 60, 65, 64.3),
('Nina Fox', 'nina.fox@example.com', 29, '2 years', 'resumes/nina_fox.pdf', '{}'::json, '["React Native"]'::json, '["Flutter"]'::json, 70, 63, 66, 66.3),

-- Candidates for job_offer_id 8
('Oscar Reed', 'oscar.reed@example.com', 23, '2 years', 'resumes/oscar_reed.pdf', '{}'::json, '["Test automation"]'::json, '["Manual testing"]'::json, 74, 70, 72, 72.0),
('Paula James', 'paula.james@example.com', 23, '3 years', 'resumes/paula_james.pdf', '{}'::json, '[]'::json, '["Bug reporting"]'::json, 76, 75, 73, 74.7),

-- Candidates for job_offer_id 9
('Quentin Clark', 'quentin.clark@example.com',24, '6 years', 'resumes/quentin_clark.pdf', '{}'::json, '[]'::json, '["Deep Learning"]'::json,240, 93, 88, 90.3),
('Rachel West', 'rachel.west@example.com', 24, '5 years', 'resumes/rachel_west.pdf', '{}'::json, '["TensorFlow"]'::json, '["PyTorch"]'::json, 85, 89, 86, 86.7),

-- Candidates for job_offer_id 10
('Steve Grey', 'steve.grey@example.com',26, '4 years', 'resumes/steve_grey.pdf', '{}'::json, '["Splunk"]'::json, '["Nmap"]'::json, 80, 82, 78, 80.0),
('Tina Hall', 'tina.hall@example.com',26, '5 years', 'resumes/tina_hall.pdf', '{}'::json, '["Firewall"]'::json, '["Wireshark"]'::json, 82, 85, 80, 82.3);
