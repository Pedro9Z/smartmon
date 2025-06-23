import asyncio
from external_api.data_sources.client import get_client
import json

async def get_btc_price_data():
    client = get_client()
    try:
        result = await client.yahoo_finance.get_stock_price(
            symbol="BTC-USD",
            start_date="2025-06-01",
            end_date="2025-06-10",
            interval="1d"
        )
        if result["success"]:
            with open("data/btc_data.json", "w") as f:
                json.dump(result["data"], f)
            print("Datos de Bitcoin guardados exitosamente en data/btc_data.json")
        else:
            print(f"Error al obtener los datos de Bitcoin: {result['error']}")
    except Exception as e:
        print(f"Ocurrió un error: {e}")

if __name__ == "__main__":
    asyncio.run(get_btc_price_data())