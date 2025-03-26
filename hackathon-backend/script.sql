-- Create the job_offers table with description
CREATE TABLE IF NOT EXISTS job_offers (
    id SERIAL PRIMARY KEY,
    job_title VARCHAR(255) NOT NULL,
    description TEXT
);

-- Insert sample data into job_offers with descriptions
INSERT INTO job_offers (job_title, description) VALUES
    ('Software Engineer', 'Develop and maintain software applications.'),
    ('Data Scientist', 'Analyze large datasets to extract valuable insights.'),
    ('Product Manager', 'Oversee product development and strategy.'),
    ('Developer', 'Write and optimize code for various applications.'),
    ('Analyst', 'Analyze data and provide reports for decision-making.');

-- Create the candidates table with resume_path column to store the resume file path
CREATE TABLE IF NOT EXISTS candidates (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    job_offer_id INT REFERENCES job_offers(id) ON DELETE CASCADE,
    experience VARCHAR(50),
    resume_path TEXT  -- Add column to store the resume file path
);