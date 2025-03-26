from config import Config
import psycopg2

def get_db_connection():
    conn = psycopg2.connect(Config.DATABASE_URL)
    return conn
