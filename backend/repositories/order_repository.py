from repositories.base_repository import BaseRepository


class OrderRepository(BaseRepository):

    TABLE = "orders"
    PRIMARY_KEY = "order_id"