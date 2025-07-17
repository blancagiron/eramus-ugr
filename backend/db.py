from pymongo import MongoClient

client = MongoClient("mongodb://root:example@localhost:27017")
db = client["erasmus"]  # o "erasmus-ugr" si así la llamaste
