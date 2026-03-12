from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime


# ─── Book ────────────────────────────────────────────────────────────────────

class Book(BaseModel):
    google_id: str
    title: str
    authors: str
    description: Optional[str] = ""
    thumbnail: Optional[str] = ""
    link: Optional[str] = ""
    genre: Optional[str] = "General"
    rating: Optional[float] = 4.0
    price: Optional[float] = 14.99
    pages: Optional[int] = 0
    published_date: Optional[str] = ""
    publisher: Optional[str] = ""


class BookOut(Book):
    score: Optional[float] = None


# ─── Auth ────────────────────────────────────────────────────────────────────

class SignupRequest(BaseModel):
    name: str
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: str
    name: str
    email: str
    created_at: datetime


# ─── Search / Recommend ──────────────────────────────────────────────────────

class SearchRequest(BaseModel):
    query: str
    genre: Optional[str] = None
    max_results: int = Field(default=20, le=40)


class RecommendRequest(BaseModel):
    query: str
    top_k: int = Field(default=6, le=20)
    genre: Optional[str] = None


# ─── Cart ────────────────────────────────────────────────────────────────────

class CartItemIn(BaseModel):
    book_id: str
    title: str
    authors: str
    thumbnail: Optional[str] = ""
    price: float
    quantity: int = 1


class CartItemOut(CartItemIn):
    pass


# ─── Order ───────────────────────────────────────────────────────────────────

class OrderItem(BaseModel):
    book_id: str
    title: str
    price: float
    quantity: int


class PlaceOrderRequest(BaseModel):
    items: List[OrderItem]
    total: float
    shipping_address: str
    payment_method: str = "mock"


class OrderOut(BaseModel):
    id: str
    user_id: str
    items: List[OrderItem]
    total: float
    status: str
    created_at: datetime


# ─── Review ──────────────────────────────────────────────────────────────────

class ReviewIn(BaseModel):
    book_id: str
    rating: int = Field(ge=1, le=5)
    comment: str


class ReviewOut(ReviewIn):
    id: str
    user_name: str
    created_at: datetime


# ─── Wishlist ────────────────────────────────────────────────────────────────

class WishlistItem(BaseModel):
    book_id: str
    title: str
    authors: str
    thumbnail: Optional[str] = ""
    price: float
