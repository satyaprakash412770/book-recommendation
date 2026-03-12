from fastapi import APIRouter
from models.schemas import SearchRequest, RecommendRequest
from services.google_books import fetch_books
from services.semantic import get_recommendations

router = APIRouter()


@router.post("/search")
async def search_books(payload: SearchRequest):
    """Keyword search via Google Books API."""
    books = fetch_books(
        payload.query,
        max_results=payload.max_results,
        genre=payload.genre,
    )
    return {"books": books, "total": len(books), "query": payload.query}


@router.post("/recommend")
async def recommend_books(payload: RecommendRequest):
    """AI-powered semantic book recommendations using sentence-transformers."""
    # Fetch a broader pool to run semantic ranking on
    books = fetch_books(payload.query, max_results=30, genre=payload.genre)
    if not books:
        return {"books": [], "total": 0, "query": payload.query}

    recommendations = get_recommendations(payload.query, books, top_k=payload.top_k)
    return {
        "books": recommendations,
        "total": len(recommendations),
        "query": payload.query,
    }
