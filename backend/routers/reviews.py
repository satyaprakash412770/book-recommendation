from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime
from bson import ObjectId

from database import get_collection
from models.schemas import ReviewIn
from services.auth import get_current_user

router = APIRouter()


@router.get("/{book_id}")
async def get_reviews(book_id: str):
    reviews_col = get_collection("reviews")
    users_col = get_collection("users")
    reviews = await reviews_col.find({"book_id": book_id}).sort("created_at", -1).to_list(length=50)
    result = []
    for r in reviews:
        user = await users_col.find_one({"_id": ObjectId(r["user_id"])})
        result.append({
            "id": str(r["_id"]),
            "book_id": r["book_id"],
            "rating": r["rating"],
            "comment": r["comment"],
            "user_name": user["name"] if user else "Anonymous",
            "created_at": r["created_at"],
        })
    return {"reviews": result}


@router.post("")
async def add_review(payload: ReviewIn, current_user_id: str = Depends(get_current_user)):
    reviews_col = get_collection("reviews")
    existing = await reviews_col.find_one({"user_id": current_user_id, "book_id": payload.book_id})
    if existing:
        await reviews_col.update_one(
            {"_id": existing["_id"]},
            {"$set": {"rating": payload.rating, "comment": payload.comment, "updated_at": datetime.utcnow()}},
        )
        return {"message": "Review updated"}
    await reviews_col.insert_one({
        "user_id": current_user_id,
        "book_id": payload.book_id,
        "rating": payload.rating,
        "comment": payload.comment,
        "created_at": datetime.utcnow(),
    })
    return {"message": "Review added"}
