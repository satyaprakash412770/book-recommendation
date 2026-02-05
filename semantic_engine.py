from semantic_search import semantic_search as _semantic_search

def semantic_search(user_query, books, top_k=5):
    """Wrapper for semantic_search.semantic_search with default parameters."""
    return _semantic_search(user_query, books, top_k)

