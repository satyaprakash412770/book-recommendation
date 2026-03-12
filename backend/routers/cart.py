from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId
from datetime import datetime

from database import get_collection
from models.schemas import CartItemIn
from services.auth import get_current_user

router = APIRouter()


@router.get("")
async def get_cart(current_user_id: str = Depends(get_current_user)):
    cart_col = get_collection("cart")
    items = await cart_col.find({"user_id": current_user_id}).to_list(length=100)
    for item in items:
        item["id"] = str(item.pop("_id"))
    return {"items": items}


@router.post("")
async def add_to_cart(payload: CartItemIn, current_user_id: str = Depends(get_current_user)):
    cart_col = get_collection("cart")
    existing = await cart_col.find_one({"user_id": current_user_id, "book_id": payload.book_id})
    if existing:
        await cart_col.update_one(
            {"_id": existing["_id"]},
            {"$inc": {"quantity": payload.quantity}},
        )
    else:
        await cart_col.insert_one({
            "user_id": current_user_id,
            "book_id": payload.book_id,
            "title": payload.title,
            "authors": payload.authors,
            "thumbnail": payload.thumbnail,
            "price": payload.price,
            "quantity": payload.quantity,
            "added_at": datetime.utcnow(),
        })
    return {"message": "Cart updated"}


@router.put("/{book_id}")
async def update_cart_item(book_id: str, quantity: int, current_user_id: str = Depends(get_current_user)):
    cart_col = get_collection("cart")
    if quantity <= 0:
        await cart_col.delete_one({"user_id": current_user_id, "book_id": book_id})
    else:
        await cart_col.update_one(
            {"user_id": current_user_id, "book_id": book_id},
            {"$set": {"quantity": quantity}},
        )
    return {"message": "Cart updated"}


@router.delete("/{book_id}")
async def remove_from_cart(book_id: str, current_user_id: str = Depends(get_current_user)):
    cart_col = get_collection("cart")
    await cart_col.delete_one({"user_id": current_user_id, "book_id": book_id})
    return {"message": "Item removed from cart"}


@router.delete("")
async def clear_cart(current_user_id: str = Depends(get_current_user)):
    cart_col = get_collection("cart")
    await cart_col.delete_many({"user_id": current_user_id})
    return {"message": "Cart cleared"}
