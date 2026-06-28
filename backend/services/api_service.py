import requests
class ApiService:

    BASE_URL = "http://127.0.0.1:8000"

    session = requests.Session()

    session.headers.update({
        "Content-Type": "application/json"
    })

    @classmethod
    def get(
        cls,
        endpoint,
        params=None,
        timeout=30
    ):
        try:

            response = cls.session.get(
                cls.BASE_URL + endpoint,
                params=params,
                timeout=timeout
            )

            response.raise_for_status()

            if response.content:
                return response.json()

            return None

        except requests.exceptions.RequestException as e:

            print(f"GET Error: {e}")

            return None

    @classmethod
    def post(
        cls,
        endpoint,
        data=None,
        timeout=30
    ):
        try:

            response = cls.session.post(
                cls.BASE_URL + endpoint,
                json=data,
                timeout=timeout
            )

            response.raise_for_status()

            if response.content:
                return response.json()

            return None

        except requests.exceptions.RequestException as e:

            print(f"POST Error: {e}")

            return None

    @classmethod
    def put(
        cls,
        endpoint,
        data=None,
        timeout=30
    ):
        try:

            response = cls.session.put(
                cls.BASE_URL + endpoint,
                json=data,
                timeout=timeout
            )

            response.raise_for_status()

            if response.content:
                return response.json()

            return None

        except requests.exceptions.RequestException as e:

            print(f"PUT Error: {e}")

            return None

    @classmethod
    def delete(
        cls,
        endpoint,
        timeout=30
    ):
        try:

            response = cls.session.delete(
                cls.BASE_URL + endpoint,
                timeout=timeout
            )

            response.raise_for_status()

            if response.content:
                return response.json()

            return None

        except requests.exceptions.RequestException as e:

            print(f"DELETE Error: {e}")

            return None