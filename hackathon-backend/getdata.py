from flask import Flask, jsonify
import psycopg2
import os
from config import Config
# from app import get_db_connection

def get_db_connection():
    """Connect to PostgreSQL database."""
    return psycopg2.connect(Config.DATABASE_URL)

def get_all_candidates(request):
    conn = get_db_connection()
    cur = conn.cursor()

    query = """
        SELECT c.id, c.full_name, c.email, c.job_offer_id, j.job_title, c.experience,
               c.resume_path, c.resume_data, c.missing_skills, c.extra_skills, c.skills_score
        FROM candidates c
        LEFT JOIN job_offers j ON c.job_offer_id = j.id;
    """
    cur.execute(query)
    rows = cur.fetchall()

    columns = [desc[0] for desc in cur.description]
    candidates = [dict(zip(columns, row)) for row in rows]

    cur.close()
    conn.close()

    return jsonify(candidates)

# @app.route('/api/job_titles', methods=['GET'])
def get_job_titles(request):
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("SELECT id, job_title FROM job_offers;")
    rows = cur.fetchall()

    job_titles = [{"id": row[0], "job_title": row[1]} for row in rows]

    cur.close()
    conn.close()
    return jsonify(job_titles)


def filter_candidates():
    # Get filter parameters from query string
    min_score = request.args.get('skills_score', type=int)
    job_id = request.args.get('job_id', type=int)

    if min_score is None or job_id is None:
        return jsonify({"error": "Both 'skills_score' and 'job_id' are required"}), 400

    conn = get_db_connection()
    cur = conn.cursor()

    query = """
        SELECT c.id, c.full_name, c.email, c.job_offer_id, j.job_title,
               c.experience, c.resume_path, c.resume_data, c.missing_skills,
               c.extra_skills, c.skills_score
        FROM candidates c
        LEFT JOIN job_offers j ON c.job_offer_id = j.id
        WHERE c.skills_score >= %s AND c.job_offer_id = %s;
    """
    cur.execute(query, (min_score, job_id))
    rows = cur.fetchall()
    columns = [desc[0] for desc in cur.description]
    data = [dict(zip(columns, row)) for row in rows]

    cur.close()
    conn.close()

    return jsonify(data)