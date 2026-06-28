from database.connection import get_connection
from database.database import init_db

def main():
    get_connection()
    init_db()

if __name__ == "__main__":
    main()