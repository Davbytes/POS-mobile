from repositories.base_repository import BaseRepository


class PurchaseRepository(BaseRepository):

    TABLE = "purchases"
    PRIMARY_KEY = "purchase_id"