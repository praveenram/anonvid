"""
Anonvid Data model
"""

import uuid
import os
import hashlib, binascii
from pymongo import MongoClient

def generate_conf_id():
	return str(uuid.uuid4())

def generate_password_hash(password):
	salt = os.environ['PASSWORD_SALT']
	dk = hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 100000)
	return str(binascii.hexlify(dk))

class Database(object):
	def __init__(self, mongo_host='localhost', mongo_port=27017):
		if(mongo_host.startswith("mongodb")):
			self._db_client = MongoClient(host=mongo_host)
			parts = mongo_host.split('/')
			db_name = parts[len(parts) - 1]
			self._db = self._db_client[db_name]
		else:
			self._db_client = MongoClient(mongo_host, mongo_port)
			self._db = self._db_client.anonvid_prod

	def create_conference(self, name, password):
		conf_id = generate_conf_id()
		password_hash = generate_password_hash(password)

		conferences = self._db.conferences
		conference = { 'name': name.strip(), 'conf_id': conf_id, 'password': password_hash }
		c_id = conferences.insert_one(conference).inserted_id

		if(c_id is None):
			return -1

		return conf_id

	def get_conference(self, conf_id):
		conferences = self._db.conferences

		conf = conferences.find_one({ 'conf_id': conf_id.strip() })

		if conf is not None:
			return conf
		else:
			return None

	def find_conference(self, conf_id, password):
		conferences = self._db.conferences
		password_hash = generate_password_hash(password)

		print(conf_id)
		print(password_hash)

		conf = conferences.find_one({ 'conf_id': conf_id.strip(), 'password': password_hash })

		if conf is not None:
			return conf
		else:
			return -1
