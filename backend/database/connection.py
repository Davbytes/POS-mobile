import sqlite3
import threading

DB_NAME = "pos.db"
db_lock = threading.Lock()


def get_connection():
    conn = sqlite3.connect(
        DB_NAME,
        timeout=30,
        check_same_thread=False
    )
    conn.execute("PRAGMA foreign_keys = ON")
    conn.execute("PRAGMA busy_timeout = 30000")
    return conn

class DBSession:
    """
    Central transaction manager.
    Ensures all writes are serialized.
    """

    def __init__(self):
        self.conn = get_connection()
        self.cursor = self.conn.cursor()

    def __enter__(self):
        db_lock.acquire()
        return self.cursor

    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_type:
            self.conn.rollback()
        else:
            self.conn.commit()

        self.conn.close()
        db_lock.release()

def read_query(query, params=()):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(query, params)
        return cursor.fetchall()
    finally:
        conn.close()


def read_one(query, params=()):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(query, params)
        return cursor.fetchone()
    finally:
        conn.close()