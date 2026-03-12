from fastapi import APIRouter, HTTPException, Depends, status
from datetime import datetime
from bson import ObjectId

from database import get_collection
from models.schemas import SignupRequest, LoginRequest
from services.auth import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter()


@router.post("/signup")
async def signup(payload: SignupRequest):
    users = get_collection("users")
    existing = await users.find_one({"email": payload.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user_doc = {
        "name": payload.name,
        "email": payload.email,
        "password": hash_password(payload.password),
        "wishlist": [],
        "reading_history": [],
        "created_at": datetime.utcnow(),
    }
    result = await users.insert_one(user_doc)
    user_id = str(result.inserted_id)
    token = create_access_token({"sub": user_id})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {"id": user_id, "name": payload.name, "email": payload.email},
    }


@router.post("/login")
async def login(payload: LoginRequest):
    users = get_collection("users")
    user = await users.find_one({"email": payload.email})
    if not user or not verify_password(payload.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    user_id = str(user["_id"])
    token = create_access_token({"sub": user_id})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {"id": user_id, "name": user["name"], "email": user["email"]},
    }


@router.get("/me")
async def get_me(current_user_id: str = Depends(get_current_user)):
    users = get_collection("users")
    user = await users.find_one({"_id": ObjectId(current_user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"],
        "created_at": user.get("created_at"),
    }
