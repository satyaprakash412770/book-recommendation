from sentence_transformers import SentenceTransformer, util
import torch

# Load model once
model = SentenceTransformer("sentence-transformers/all-mpnet-base-v2")

def semantic_search(user_query, books, top_k=3):
    # Filter books with descriptions and track their indices
    books_with_descriptions = []
    indices = []
    for i, book in enumerate(books):
        if book.get("description"):
            books_with_descriptions.append(book["description"])
            indices.append(i)
    
    if not books_with_descriptions:
        return []
    
    # Adjust top_k if there are fewer books than requested
    top_k = min(top_k, len(books_with_descriptions))
    
    corpus_embeddings = model.encode(books_with_descriptions, convert_to_tensor=True)
    query_embedding = model.encode(user_query, convert_to_tensor=True)

    similarities = util.cos_sim(query_embedding, corpus_embeddings)[0]

    top_results = torch.topk(similarities, k=top_k)

    recommendations = []
    for score, idx in zip(top_results[0], top_results[1]):
        book = books[indices[int(idx)]]
        recommendations.append({
            "title": book["title"],
            "authors": book["authors"],
            "score": float(score),
            "thumbnail": book.get("thumbnail", ""),
            "link": book.get("link", ""),
            "description": book.get("description", "")
        })

    return recommendations

