import re
from icecream import ic
from datetime import datetime
from typing import Union, Dict

from api.firebasedb import get_db
from api.utils.user_utils import validate_email, email_exists, send_otp, is_token_blacklisted

class User:
    def __init__(self, name: str, email: str):
        self.name = name
        self.email = email
        self.otp = None
        self.otp_expiration = None
    
    async def save_user(self) -> Union[str, Dict[str, str]]:
        db = await get_db()
        if not validate_email(self.email):
            return { "error": "Invalid email format." }
        if await email_exists(db, self.email):
            return { "error": "Email already exists." }
        user_ref = await db.collection('user').add({
            'name': self.name,
            'email': self.email
        })
        doc_ref = user_ref[1]
        return doc_ref.id
    
    async def send_otp(self) -> str:
        db = await get_db()
        try:
            self.otp, self.otp_expiration = await send_otp(self.email)
            user_doc = await db.collection('user').where(field_path='email', op_string='==', value=self.email).get()
            if user_doc:
                doc_ref = user_doc[0].reference
                await doc_ref.update({
                    'otp': self.otp,
                    'otp_expiration': self.otp_expiration
                })
            return { "message": "OTP sent successfully" }
        except Exception as e:
            return { "error": str(e) }
    
    async def verify_otp(self, otp: str) -> bool:
        db = await get_db()
        user_doc = await db.collection('user').where(field_path='email', op_string='==', value=self.email).get()
        if user_doc:
            user_data = user_doc.to_dict()
            stored_otp = user_data.get('otp')
            expiration_time = user_data.get('otp_expiration')
            if stored_otp == otp and datetime.utcnow() < expiration_time:
                return True
        return False

    def validate_email(self) -> bool:
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(pattern, self.email) is not None
    
    async def blacklist_token(self, token: str) -> None:
        db = await get_db()
        await db.collection('blacklisted_tokens').add({ 'token': token })
        
    async def is_token_blacklisted(self, token: str) -> bool:
        db = await get_db()
        return await is_token_blacklisted(db, token)