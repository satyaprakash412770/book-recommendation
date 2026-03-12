from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from routers import books, search, auth, cart, orders, reviews, wishlist
from services.semantic import load_model


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load the semantic model once at startup
    print("Loading semantic model...")
    load_model()
    print("Semantic model loaded.")
    yield


app = FastAPI(
    title="BookAI API",
    description="AI-powered book recommendation platform API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(books.router, prefix="/books", tags=["Books"])
app.include_router(search.router, tags=["Search"])
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(cart.router, prefix="/cart", tags=["Cart"])
app.include_router(orders.router, prefix="/orders", tags=["Orders"])
app.include_router(reviews.router, prefix="/reviews", tags=["Reviews"])
app.include_router(wishlist.router, prefix="/wishlist", tags=["Wishlist"])


@app.get("/", tags=["Health"])
async def root():
    return {"message": "BookAI API is running", "docs": "/docs"}
