import requests
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def fetch_books(query, max_results=10):
    url = "https://www.googleapis.com/books/v1/volumes"
    params = {
        "q": query,
        "maxResults": max_results,
        "printType": "books"
    }
    
    # Add API key if available (increases rate limits)
    # Check environment variable first, then config.py
    api_key = os.getenv("GOOGLE_BOOKS_API_KEY")
    if not api_key:
        try:
            from config import GOOGLE_BOOKS_API_KEY
            api_key = GOOGLE_BOOKS_API_KEY
        except ImportError:
            pass
    
    if api_key:
        params["key"] = api_key

    response = requests.get(url, params=params)
    data = response.json()

    books = []

    for item in data.get("items", []):
        info = item.get("volumeInfo", {})
        image_links = info.get("imageLinks", {})
        
        books.append({
            "title": info.get("title", "Unknown"),
            "authors": ", ".join(info.get("authors", ["Unknown"])),
            "description": info.get("description", ""),
            "thumbnail": image_links.get("thumbnail") or image_links.get("smallThumbnail", ""),
            "link": info.get("infoLink") or info.get("previewLink", "")
        })

    return books

