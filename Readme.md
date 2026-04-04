# Agentic Search

> A system that takes a topic query and produces a structured table of discovered entities — sourced, attributed, and traceable.

## Live Demo
_Coming soon_

## How It Works

1. **Search** — Query is sent to Brave Search API, returning top URLs + snippets
2. **Scrape** — Each URL is fetched concurrently; noise (nav, scripts) is stripped
3. **Schema Inference** — Claude infers what columns make sense for this query type
4. **Entity Extraction** — Claude extracts structured rows from each scraped page
5. **Deduplication** — Entities are merged by name similarity across sources
6. **Table** — Results render with per-row source attribution

## Design Decisions

- **Dynamic schema**: Instead of hardcoded columns, the LLM infers query-appropriate attributes. "AI startups" gets funding/founded/CEO; "pizza places" gets neighborhood/price/specialty.
- **Concurrent scraping**: All pages are scraped in parallel via `asyncio.gather` to keep latency reasonable.
- **Source traceability**: Every row carries its `source_url` — clicking it opens the original page.
- **Snippet fallback**: If scraping fails (paywall, bot block), the search snippet is used as fallback text.

## Trade-offs

| Choice | Trade-off |
|--------|-----------|
| More pages scraped | Better coverage, higher latency + cost |
| Claude for extraction | High quality, but ~$0.01–0.05 per query |
| BeautifulSoup scraper | Simple & fast, fails on JS-heavy SPAs |

## Known Limitations

- Paywalled or JS-rendered pages may return empty content
- LLM may hallucinate attributes for sparse pages
- Deduplication is fuzzy — near-duplicates may slip through
- Rate limits on free-tier Brave API (2000 req/month)

## Setup

### Backend
```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # fill in your API keys
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables
```
BRAVE_API_KEY=your_key_here
ANTHROPIC_API_KEY=your_key_here
```
