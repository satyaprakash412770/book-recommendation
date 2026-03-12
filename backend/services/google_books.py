import requests
import os
import hashlib
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv

load_dotenv()

GOOGLE_BOOKS_API_KEY = os.getenv("GOOGLE_BOOKS_API_KEY", "")
GOOGLE_BOOKS_URL = "https://www.googleapis.com/books/v1/volumes"

# Mock prices seeded by book id for consistency
def _mock_price(google_id: str) -> float:
    seed = int(hashlib.md5(google_id.encode()).hexdigest(), 16) % 2000
    return round(9.99 + (seed / 100), 2)


def _parse_item(item: Dict[str, Any]) -> Dict[str, Any]:
    info = item.get("volumeInfo", {})
    sale = item.get("saleInfo", {})
    image_links = info.get("imageLinks", {})
    google_id = item.get("id", "")

    # Try to get real price from API, else generate mock
    price = None
    if sale.get("saleability") == "FOR_SALE":
        rp = sale.get("retailPrice", {})
        price = rp.get("amount")
    if not price:
        price = _mock_price(google_id)

    categories = info.get("categories", [])
    genre = categories[0].split("/")[0].strip() if categories else "General"

    thumbnail = image_links.get("thumbnail") or image_links.get("smallThumbnail", "")
    # Force HTTPS
    if thumbnail.startswith("http://"):
        thumbnail = thumbnail.replace("http://", "https://", 1)

    return {
        "google_id": google_id,
        "title": info.get("title", "Unknown Title"),
        "authors": ", ".join(info.get("authors", ["Unknown Author"])),
        "description": info.get("description", ""),
        "thumbnail": thumbnail,
        "link": info.get("infoLink") or info.get("previewLink", ""),
        "genre": genre,
        "rating": info.get("averageRating", 4.0),
        "price": price,
        "pages": info.get("pageCount", 0),
        "published_date": info.get("publishedDate", ""),
        "publisher": info.get("publisher", ""),
    }


def fetch_books(
    query: str,
    max_results: int = 20,
    genre: Optional[str] = None,
    start_index: int = 0,
) -> List[Dict[str, Any]]:
    q = query
    if genre and genre.lower() not in ("all", "general", ""):
        q = f"{query}+subject:{genre}"

    params = {
        "q": q,
        "maxResults": min(max_results, 40),
        "startIndex": start_index,
        "printType": "books",
        "langRestrict": "en",
    }
    if GOOGLE_BOOKS_API_KEY:
        params["key"] = GOOGLE_BOOKS_API_KEY

    try:
        resp = requests.get(GOOGLE_BOOKS_URL, params=params, timeout=10)
        data = resp.json()
        items = data.get("items", [])
        return [_parse_item(item) for item in items]
    except Exception as e:
        print(f"Google Books API error: {e}")
        return []


def fetch_book_by_id(google_id: str) -> Optional[Dict[str, Any]]:
    url = f"{GOOGLE_BOOKS_URL}/{google_id}"
    params = {}
    if GOOGLE_BOOKS_API_KEY:
        params["key"] = GOOGLE_BOOKS_API_KEY
    try:
        resp = requests.get(url, params=params, timeout=10)
        item = resp.json()
        return _parse_item(item)
    except Exception as e:
        print(f"Google Books fetch by ID error: {e}")
        return None
