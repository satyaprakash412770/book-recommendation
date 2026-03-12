from sentence_transformers import SentenceTransformer, util
import torch
from typing import List, Dict, Any

_model: SentenceTransformer = None


def load_model():
    global _model
    if _model is None:
        _model = SentenceTransformer("sentence-transformers/all-mpnet-base-v2")
    return _model


def get_recommendations(query: str, books: List[Dict[str, Any]], top_k: int = 6) -> List[Dict[str, Any]]:
    model = load_model()

    books_with_desc = [(i, b) for i, b in enumerate(books) if b.get("description")]
    if not books_with_desc:
        return books[:top_k]

    top_k = min(top_k, len(books_with_desc))
    descriptions = [b["description"] for _, b in books_with_desc]

    corpus_embeddings = model.encode(descriptions, convert_to_tensor=True)
    query_embedding = model.encode(query, convert_to_tensor=True)
    similarities = util.cos_sim(query_embedding, corpus_embeddings)[0]

    top_results = torch.topk(similarities, k=top_k)

    recommendations = []
    for score, idx in zip(top_results[0], top_results[1]):
        _, book = books_with_desc[int(idx)]
        recommendations.append({**book, "score": float(score)})

    return recommendations
