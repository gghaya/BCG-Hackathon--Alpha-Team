import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import psycopg2
from psycopg2 import sql

# Create a simple app for context
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://user:password@db:5432/resume'

# Direct PostgreSQL connection for running ALTER TABLE commands
def run_alter_tables():
    conn = psycopg2.connect(
        dbname="resume_db",
        user="user",
        password="password",
        host="localhost"
    )
    conn.autocommit = True
    cursor = conn.cursor()
    
    print("Adding new columns to job_offers table...")
    
    # Add columns to job_offers table
    alter_commands = [
        "ALTER TABLE job_offers ADD COLUMN IF NOT EXISTS requirements TEXT",
        "ALTER TABLE job_offers ADD COLUMN IF NOT EXISTS responsibilities JSONB",
        "ALTER TABLE job_offers ADD COLUMN IF NOT EXISTS skills JSONB",
        "ALTER TABLE job_offers ADD COLUMN IF NOT EXISTS education VARCHAR(255)",
        # Create enum type if it doesn't exist
        "DO $$ BEGIN CREATE TYPE prioritylevel AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'); EXCEPTION WHEN duplicate_object THEN NULL; END $$",
        "ALTER TABLE job_offers ADD COLUMN IF NOT EXISTS skills_priority prioritylevel DEFAULT 'MEDIUM'",
        "ALTER TABLE job_offers ADD COLUMN IF NOT EXISTS requirements_priority prioritylevel DEFAULT 'MEDIUM'",
        "ALTER TABLE job_offers ADD COLUMN IF NOT EXISTS education_priority prioritylevel DEFAULT 'MEDIUM'"
    ]
    
    # Add columns to candidates table
    alter_commands += [
        "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS requirements_score INTEGER DEFAULT 0",
        "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS education_score INTEGER DEFAULT 0",
        "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS overall_score FLOAT DEFAULT 0.0"
    ]
    
    # Execute all commands
    for cmd in alter_commands:
        try:
            cursor.execute(cmd)
            print(f"Executed: {cmd}")
        except Exception as e:
            print(f"Error executing {cmd}: {e}")
    
    cursor.close()
    conn.close()
    
    print("Migration completed!")

# Run the migration
run_alter_tables()