import os
import firebase_admin
from firebase_admin import credentials
from google.cloud import firestore
from dotenv import load_dotenv

load_dotenv()

cred = credentials.Certificate(os.getenv('GOOGLE_APPLICATION_CREDENTIALS'))
firebase_admin.initialize_app(cred)

db = firestore.AsyncClient()

async def get_db():
    return db

