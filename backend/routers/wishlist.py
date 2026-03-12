from fastapi import APIRouter, Depends
from datetime import datetime
from bson import ObjectId

from database import get_collection
from models.schemas import WishlistItem
from services.auth import get_current_user

router = APIRouter()


@router.get("")
async def get_wishlist(current_user_id: str = Depends(get_current_user)):
    users_col = get_collection("users")
    user = await users_col.find_one({"_id": ObjectId(current_user_id)})
    return {"wishlist": user.get("wishlist", []) if user else []}


@router.post("")
async def add_to_wishlist(payload: WishlistItem, current_user_id: str = Depends(get_current_user)):
    users_col = get_collection("users")
    await users_col.update_one(
        {"_id": ObjectId(current_user_id)},
        {"$addToSet": {"wishlist": payload.dict()}},
    )
    return {"message": "Added to wishlist"}


@router.delete("/{book_id}")
async def remove_from_wishlist(book_id: str, current_user_id: str = Depends(get_current_user)):
    users_col = get_collection("users")
    await users_col.update_one(
        {"_id": ObjectId(current_user_id)},
        {"$pull": {"wishlist": {"book_id": book_id}}},
    )
    return {"message": "Removed from wishlist"}


@router.post("/history/{book_id}")
async def add_to_reading_history(
    book_id: str,
    title: str,
    thumbnail: str = "",
    current_user_id: str = Depends(get_current_user),
):
    users_col = get_collection("users")
    await users_col.update_one(
        {"_id": ObjectId(current_user_id)},
        {
            "$push": {
                "reading_history": {
                    "$each": [{"book_id": book_id, "title": title, "thumbnail": thumbnail, "viewed_at": datetime.utcnow()}],
                    "$slice": -20,  # keep last 20
                }
            }
        },
    )
    return {"message": "Added to reading history"}
