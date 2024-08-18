from pymongo import MongoClient

client = MongoClient('mongodb://localhost:27017')
db = client['e-comm']
products_collection = db['products']