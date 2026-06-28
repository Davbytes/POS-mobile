import threading
import time
from services.sync_service import SyncService
class SyncScheduler:
    @staticmethod
    def start():

        thread = threading.Thread(
            target=SyncScheduler.run,
            daemon=True
        )

        thread.start()

    @staticmethod
    def run():

        while True:

            try:
                SyncService.sync()

            except Exception as e:
                print(f"Sync Error: {e}")

            time.sleep(60)