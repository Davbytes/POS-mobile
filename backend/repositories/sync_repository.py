from datetime import datetime
from database.connection import (
    DBSession,
    read_query,
    read_one
)
from repositories.base_repository import BaseRepository
current_time = datetime.now().strftime(
    "%Y-%m-%d %H:%M:%S"
)

class SyncRepository(BaseRepository):

    TABLE = "sync_queue"

    @staticmethod
    def get_pending_changes():
        query = """
            SELECT *
            FROM sync_queue
            WHERE sync_status = 'PENDING'
            ORDER BY id
        """

        return read_query(query)

    @staticmethod
    def mark_synced(queue_ids):

        if not queue_ids:
            return

        placeholders = ",".join(
            "?"
            for _ in queue_ids
        )
        with DBSession() as cursor:
            query = f"""
                UPDATE sync_queue
                SET
                    sync_status='SYNCED',
                    synced_at=?
                WHERE id IN ({placeholders})
            """

            cursor.execute(
                query,
                (tuple(queue_ids), current_time)
            )

    @staticmethod
    def increment_retry(queue_id):
        with DBSession() as cursor:
            query = """
                UPDATE sync_queue
                SET retry_count = retry_count + 1
                WHERE id = ?
            """

            cursor.execute(
                query,
                (queue_id,)
            )

    @staticmethod
    def get_last_queue_id():

        row = read_one("""
            SELECT last_queue_id
            FROM sync_state
            WHERE id = 1
        """)

        if row is None:
            return 0

        return row["last_queue_id"]

    @staticmethod
    def save_last_queue_id(last_queue_id):
        with DBSession() as cursor:
            exists = read_one("""
                SELECT id
                FROM sync_state
                WHERE id = 1
            """)

            if exists:

                cursor.execute(
                    """
                    UPDATE sync_state
                    SET
                        last_queue_id=?,
                        last_sync=?
                    WHERE id=1
                    """,
                    (
                        last_queue_id,current_time
                    )
                )

            else:

                cursor.execute(
                    """
                    INSERT INTO sync_state(
                        id,
                        last_queue_id,
                        last_sync
                    )
                    VALUES(
                        1,
                        ?,
                        ?
                    )
                    """,
                    (
                        last_queue_id,current_time
                    )
                )

    @staticmethod
    def add_to_queue(
        table_name,
        record_id,
        operation,
        payload
    ):
        with DBSession() as cursor:
            cursor.execute(
                """
                INSERT INTO sync_queue(
                    table_name,
                    record_id,
                    operation,
                    payload,
                    sync_status,
                    created_at,
                    synced_at
                )
                VALUES(
                    ?,
                    ?,
                    ?,
                    ?,
                    'PENDING',
                    ?,
                    ?
                )
                """,
                (
                    table_name,
                    record_id,
                    operation,
                    payload,
                    current_time,
                    current_time
                )
            )