from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import asyncio
from search import search_web
from scraper import scrape_page
from extractor import infer_schema, extract_entities

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class SearchRequest(BaseModel):
    query: str

@app.post("/search")
async def run_search(payload: SearchRequest):
    query = payload.query

    # 1. Search
    results = await search_web(query, num_results=10)

    # 2. Infer schema
    columns = await infer_schema(query)

    # 3. Scrape pages concurrently
    texts = await asyncio.gather(*[scrape_page(r["url"]) for r in results])

    # Use snippet as fallback if scrape returned nothing
    texts = list(texts)
    for i, text in enumerate(texts):
        if not text.strip():
            texts[i] = results[i].get("snippet", "")

    # 4. Extract entities concurrently
    all_nested = await asyncio.gather(*[
        extract_entities(texts[i], results[i]["url"], query, columns)
        for i in range(len(results))
    ])

    # 5. Flatten and deduplicate by name
    seen = set()
    all_entities = []
    for sublist in all_nested:
        for entity in sublist:
            name = entity.get("name", "").lower().strip()
            if name and name not in seen:
                seen.add(name)
                all_entities.append(entity)

    return {"columns": columns, "rows": all_entities[:20]}