from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.server_api import ServerApi
import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "bookai")

client: AsyncIOMotorClient = None


def get_client() -> AsyncIOMotorClient:
    global client
    if client is None:
        client = AsyncIOMotorClient(MONGODB_URI, server_api=ServerApi("1"))
    return client


def get_db():
    return get_client()[DB_NAME]


def get_collection(name: str):
    return get_db()[name]
