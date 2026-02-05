from book_fetcher import fetch_books as _fetch_books

def fetch_books(query, max_results=20):
    """Wrapper for book_fetcher.fetch_books with default parameters."""
    return _fetch_books(query, max_results)

