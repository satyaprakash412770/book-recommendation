from fastapi import APIRouter, Query, HTTPException
from typing import Optional
from services.google_books import fetch_books, fetch_book_by_id

router = APIRouter()


@router.get("")
async def list_books(
    q: str = Query(default="bestseller fiction", description="Search query"),
    genre: Optional[str] = Query(default=None),
    max_results: int = Query(default=20, le=40),
    start_index: int = Query(default=0),
):
    """List books from Google Books API with optional genre filter."""
    books = fetch_books(q, max_results=max_results, genre=genre, start_index=start_index)
    if not books:
        return {"books": [], "total": 0}
    return {"books": books, "total": len(books)}


@router.get("/featured")
async def featured_books():
    """Return curated featured books for the home page."""
    queries = ["science fiction", "mystery thriller", "fantasy", "history", "self improvement"]
    books = []
    for q in queries:
        results = fetch_books(q, max_results=4)
        books.extend(results[:4])
    return {"books": books[:20]}


@router.get("/categories")
async def list_categories():
    """Return available genre categories."""
    categories = [
        "Fiction", "Science Fiction", "Fantasy", "Mystery", "Thriller",
        "Romance", "History", "Biography", "Self Help", "Technology",
        "Philosophy", "Science", "Children", "Comics", "Art"
    ]
    return {"categories": categories}


@router.get("/{book_id}")
async def get_book(book_id: str):
    """Get a single book by Google Books volume ID."""
    book = fetch_book_by_id(book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book
