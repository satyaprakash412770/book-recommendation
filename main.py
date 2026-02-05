from book_fetcher import fetch_books
from semantic_search import semantic_search

def main():
    # Fetch books
    search_query = input("Enter a book search query: ")
    max_results = int(input("Enter maximum number of results (default 20): ") or "20")
    
    print(f"\nSearching for books matching '{search_query}'...\n")
    
    books = fetch_books(search_query, max_results)
    
    if not books:
        print("No books found.")
        return
    
    print(f"Found {len(books)} book(s).\n")
    
    # Semantic search
    user_query = input("Enter your preference/interest for semantic search: ")
    top_k = int(input("Enter number of recommendations (default 5): ") or "5")
    
    print(f"\nFinding books semantically similar to '{user_query}'...\n")
    
    recommendations = semantic_search(user_query, books, top_k=top_k)
    
    if recommendations:
        print(f"Top {len(recommendations)} recommendations:\n")
        for i, rec in enumerate(recommendations, 1):
            print(f"{i}. {rec['title']}")
            print(f"   Authors: {rec['authors']}")
            print(f"   Similarity Score: {rec['score']:.4f}")
            if rec.get('thumbnail'):
                print(f"   Cover Image: {rec['thumbnail']}")
            if rec.get('link'):
                print(f"   Google Books Link: {rec['link']}")
            print()
    else:
        print("No recommendations found (books may be missing descriptions).")

if __name__ == "__main__":
    main()

