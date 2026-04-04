import os
import json
from openai import AsyncOpenAI
from dotenv import load_dotenv
load_dotenv()

client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

async def infer_schema(query: str) -> list[str]:
    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{
            "role": "user",
            "content": f"For the search query '{query}', what 4-6 attributes should I extract per entity? Reply ONLY with a JSON array of column names. Example: [\"name\", \"location\", \"founded\"]. Always include 'name' as the first column."
        }],
        max_tokens=100
    )
    text = response.choices[0].message.content.strip()
    text = text.replace("```json", "").replace("```", "").strip()
    return json.loads(text)

async def extract_entities(text: str, url: str, query: str, columns: list[str]) -> list[dict]:
    if not text.strip():
        return []
    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{
            "role": "user",
            "content": f"""From this web page content, extract entities relevant to: '{query}'

For each entity extract these fields: {columns}
Also include 'source_url' set to '{url}'.

IMPORTANT RULES:
- Extract ANY entity that is even partially relevant to the query
- If a field value is not found, use "—" 
- Even if content is short or a snippet, try to extract what you can
- Do not skip entities just because some fields are missing
- Return ONLY a JSON array of objects, no other text
- If truly no relevant entities found, return []

Content:
{text}"""
        }],
        max_tokens=1500
    )
    text_out = response.choices[0].message.content.strip()
    text_out = text_out.replace("```json", "").replace("```", "").strip()
    try:
        result = json.loads(text_out)
        # Replace null with "—" for display
        for entity in result:
            for key in entity:
                if entity[key] is None:
                    entity[key] = "—"
        return result
    except Exception:
        return []