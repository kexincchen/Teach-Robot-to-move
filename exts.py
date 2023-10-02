from flask_limiter.util import get_remote_address
from flask_pymongo import PyMongo
from flask_limiter import Limiter
import config
mongo = PyMongo()
limiter = Limiter(key_func=get_remote_address, storage_uri=config.MONGO_URI)