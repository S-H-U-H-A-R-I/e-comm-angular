import re
import random
from datetime import datetime, timedelta

from api.utils.email import send_otp_email

def validate_email(email: str) -> bool:
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

async def email_exists(db, email: str) -> bool:
    existing_users = await db.collection('user').where(field_path='email', op_string='==', value=email).get()
    return bool(existing_users)

async def is_token_blacklisted(db, token: str) -> bool:
    blacklisted = await db.collection('blacklisted_tokens').where(field_path='token', op_string='==', value=token).get()
    return len(blacklisted) > 0

async def send_otp(email: str) -> str:
    otp = str(random.randint(100000, 999999))
    otp_expiration = datetime.utcnow() + timedelta(minutes=5)
    send_otp_email(email, otp)
    return otp, otp_expiration