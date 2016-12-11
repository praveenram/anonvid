#!/usr/local/bin/python3

import hashlib, binascii
import names, uuid
import random

salt_uuid = str(uuid.uuid4())

salt_base = str(uuid.uuid4())
random_name = names.get_full_name()
random_number = random.random() * random.randrange(0, 10**6)

salt_base += random_name
salt_base += str(random_number)

dk = hashlib.pbkdf2_hmac('sha256', salt_base.encode(), salt_uuid.encode(), 100000)
print(str(binascii.hexlify(dk)))