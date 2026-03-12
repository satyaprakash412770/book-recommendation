from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime

from database import get_collection
from models.schemas import PlaceOrderRequest
from services.auth import get_current_user

router = APIRouter()


@router.post("")
async def place_order(payload: PlaceOrderRequest, current_user_id: str = Depends(get_current_user)):
    orders_col = get_collection("orders")
    cart_col = get_collection("cart")

    order_doc = {
        "user_id": current_user_id,
        "items": [item.dict() for item in payload.items],
        "total": payload.total,
        "shipping_address": payload.shipping_address,
        "payment_method": payload.payment_method,
        "status": "confirmed",
        "created_at": datetime.utcnow(),
    }
    result = await orders_col.insert_one(order_doc)
    # Clear cart after order
    await cart_col.delete_many({"user_id": current_user_id})
    return {"message": "Order placed successfully", "order_id": str(result.inserted_id)}


@router.get("")
async def list_orders(current_user_id: str = Depends(get_current_user)):
    orders_col = get_collection("orders")
    orders = await orders_col.find({"user_id": current_user_id}).sort("created_at", -1).to_list(length=50)
    for o in orders:
        o["id"] = str(o.pop("_id"))
    return {"orders": orders}


@router.get("/{order_id}")
async def get_order(order_id: str, current_user_id: str = Depends(get_current_user)):
    from bson import ObjectId
    orders_col = get_collection("orders")
    try:
        order = await orders_col.find_one({"_id": ObjectId(order_id), "user_id": current_user_id})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid order ID")
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order["id"] = str(order.pop("_id"))
    return order
