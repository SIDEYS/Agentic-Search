import httpx
import os
from dotenv import load_dotenv
load_dotenv()

BRAVE_API_KEY = os.getenv("BRAVE_API_KEY")

async def search_web(query: str, num_results: int = 8) -> list[dict]:
    headers = {"X-Subscription-Token": BRAVE_API_KEY}
    params = {"q": query, "count": num_results}
    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.get(
            "https://api.search.brave.com/res/v1/web/search",
            headers=headers,
            params=params
        )
    data = r.json()
    results = data.get("web", {}).get("results", [])
    return [
        {"title": r["title"], "url": r["url"], "snippet": r.get("description", "")}
        for r in results
    ]