from google_books import fetch_books
from semantic_engine import semantic_search

def recommend_books(user_query):
    # Reduced to 10 books for faster response time (was 20)
    books = fetch_books(user_query, max_results=10)
    if not books:
        return "No books found."

    # Reduced to top 3 recommendations for faster processing
    recommendations = semantic_search(user_query, books, top_k=3)

    output = ""
    for i, book in enumerate(recommendations, 1):
        # Build the book entry with image, link, and blog description
        book_entry = f"### 📘 {i}. {book['title']}\n\n"
        
        # Add thumbnail image if available
        if book.get('thumbnail'):
            book_entry += f"![{book['title']}]({book['thumbnail']})\n\n"
        
        book_entry += f"**👤 Author(s):** {book['authors']}  \n"
        book_entry += f"**⭐ Similarity Score:** {round(book['score'], 3)}  \n"
        
        # Add link if available
        if book.get('link'):
            book_entry += f"**🔗 [View on Google Books]({book['link']})**  \n\n"
        
        # Add blog-style description
        if book.get('description'):
            description = book['description']
            # Truncate if too long (keep first 500 characters)
            if len(description) > 500:
                description = description[:500] + "..."
            
            book_entry += f"**📖 About this book:**\n\n"
            book_entry += f"> {description}\n\n"
        
        book_entry += "---\n\n"
        output += book_entry
    
    return output

