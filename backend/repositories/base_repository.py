from database.database import (
    execute_query,
    read_one
)


class BaseRepository:

    TABLE = ""
    PRIMARY_KEY = "id"
    SERVER_KEY = "server_id"

    @classmethod
    def get_by_id(cls, record_id):

        query = f"""
            SELECT *
            FROM {cls.TABLE}
            WHERE {cls.PRIMARY_KEY} = ?
        """

        return read_one(
            query,
            (record_id,)
        )

    @classmethod
    def get_by_server_id(cls, server_id):

        query = f"""
            SELECT *
            FROM {cls.TABLE}
            WHERE {cls.SERVER_KEY} = ?
        """

        return read_one(
            query,
            (server_id,)
        )

    @classmethod
    def upsert(cls, record):

        existing = cls.get_by_server_id(
            record["server_id"]
        )

        if existing:
            cls.update(record)
        else:
            cls.insert(record)

    @classmethod
    def insert(cls, record):

        data = dict(record)

        data.pop(cls.PRIMARY_KEY, None)

        columns = ", ".join(data.keys())

        placeholders = ", ".join(
            "?" for _ in data
        )

        values = tuple(data.values())

        query = f"""
            INSERT INTO {cls.TABLE}
            ({columns})
            VALUES ({placeholders})
        """

        execute_query(
            query,
            values
        )

    @classmethod
    def update(cls, record):

        data = dict(record)

        server_id = data.pop(
            cls.SERVER_KEY
        )

        data.pop(
            cls.PRIMARY_KEY,
            None
        )

        assignments = ", ".join(
            f"{column}=?"
            for column in data.keys()
        )

        values = list(data.values())

        values.append(server_id)

        query = f"""
            UPDATE {cls.TABLE}
            SET {assignments}
            WHERE {cls.SERVER_KEY}=?
        """

        execute_query(
            query,
            tuple(values)
        )