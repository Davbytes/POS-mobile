import requests
import json
from collections import defaultdict
from services.api_service import ApiService
from repositories.product_repository import ProductRepository
from repositories.supplier_repository import SupplierRepository
from repositories.order_repository import OrderRepository
from repositories.purchase_repository import PurchaseRepository
from repositories.sync_repository import SyncRepository
from repositories.order_item_repository import OrderItemRepository
from repositories.purchase_item_repository import PurchaseItemRepository
from repositories.stock_product_repository import StockProductRepository
from repositories.stock_ledger_repository import StockLedgerRepository
from repositories.company_details_repository import CompanyDetailsRepository
from repositories.product_categories_repository import ProductCategoriesRepository
from repositories.product_departments import ProductDepartmentsRepository
from repositories.production_repository import ProductionRepository
from repositories.shift_products_snapshot_repository import ShiftProductsSnapshotRepository
from repositories.shift_stock_snapshot_repository import ShiftStockSnapshotRepository
from repositories.shifts_repository import ShiftsRepository
from repositories.stock_issues_repository import StockIssuesRepository
from repositories.store_departments import StoreDepartmentRepository
from repositories.sync_state_repository import SyncStateRepository
from repositories.tax_types import TaxTypesRepository
from repositories.user_product_departments_repository import UserProductDepartmentsRepository
from repositories.user_store_department_repository import UserStoreDepartmentRepository
from repositories.users import UserRepository
from repositories.voided_orders_repository import VoidedOrdersRepository
TABLE_REPOSITORIES = {
    "products": ProductRepository,
    "orders": OrderRepository,
    "order_items": OrderItemRepository,
    "suppliers": SupplierRepository,
    "purchases": PurchaseRepository,
    "purchase_items": PurchaseItemRepository,
    "stock_products": StockProductRepository,
    "stock_ledger": StockLedgerRepository,
    "productions": ProductionRepository,
    "company_details": CompanyDetailsRepository,
    "product_categories": ProductCategoriesRepository,
    "product_departments": ProductDepartmentsRepository,
    "shift_products_snapshot": ShiftProductsSnapshotRepository,
    "shift_stock_snapshot": ShiftStockSnapshotRepository,
    "shifts": ShiftsRepository,
    "stock_issues": StockIssuesRepository,
    "store_departments": StoreDepartmentRepository,
    "sync_state": SyncStateRepository,
    "tax_types": TaxTypesRepository,
    "user_product_departments": UserProductDepartmentsRepository,
    "user_store_departments": UserStoreDepartmentRepository,
    "users": UserRepository,
    "voided_orders": VoidedOrdersRepository,
    "sync_queue": SyncRepository,
}
BASE_URL = "http://127.0.0.1:8000"
class NetworkService:

    @staticmethod
    def is_connected() -> bool:

        try:
            response = requests.get(
                f"{ApiService.BASE_URL}/sync/health",
                timeout=3
            )

            return response.status_code == 200

        except requests.RequestException:
            return False

class SyncService:

    @staticmethod
    def sync():
        if not NetworkService.is_connected():
            print("No internet connection. Sync skipped.")
            return

        SyncService.upload()
        SyncService.download()

    @staticmethod
    def upload():

        queue = SyncRepository.get_pending_changes()

        if not queue:
            return True

        payload = {
            "changes": defaultdict(list)
        }

        queue_ids = []

        for item in queue:

            payload["changes"][item["table_name"]].append({
                "queue_id": item["id"],
                "operation": item["operation"],
                "data": json.loads(item["payload"])
            })

            queue_ids.append(item["id"])

        response = ApiService.post(
            "/sync",
            dict(payload)
        )

        if response is None:
            return False

        if not response.get("success", False):

            # Increase retry count for failed uploads
            for queue_id in queue_ids:
                SyncRepository.increment_retry(queue_id)

            return False

        SyncRepository.mark_synced(queue_ids)
        return True

    @staticmethod
    def download():

        last_queue_id = SyncRepository.get_last_queue_id()

        response = ApiService.get(
            "/sync",
            params={
                "after": last_queue_id
            }
        )

        if response is None:
            return False

        if not response.get("success", False):
            return False

        data = response.get("data", {})

        if not data:
            return True

        new_queue_id = data.get(
            "last_queue_id",
            last_queue_id
        )

        for table_name, records in data.items():

            if table_name == "last_queue_id":
                continue

            repository = TABLE_REPOSITORIES.get(
                table_name
            )

            if repository is None:
                print(
                    f"No repository registered for '{table_name}'"
                )
                continue

            for record in records:

                try:

                    repository.upsert(record)

                except Exception as e:

                    print(
                        f"Failed syncing "
                        f"{table_name}: {e}"
                    )

        SyncRepository.save_last_queue_id(
            new_queue_id
        )

        return True