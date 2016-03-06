from sqlalchemy.exc import ArgumentError
import re

def validate_email(key,address):
    if re.match(r"[^@]+@[^@]+\.[^@]+",address):
        return address
    raise ArgumentError
