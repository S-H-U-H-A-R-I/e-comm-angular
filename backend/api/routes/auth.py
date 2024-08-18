from icecream import ic
from fastapi import APIRouter, Body, HTTPException
from api.utils.token import create_access_token, verify_token
from api.models.user import User

router = APIRouter()

@router.post('/register')
async def create_user(name: str = Body(...), email: str = Body(...)):
    ic(name, email)
    user = User(name, email)
    saved_user_id = await user.save_user()
    if 'error' in saved_user_id:
        raise HTTPException(status_code=400, detail=saved_user_id["error"])
    sendOTP: dict[str, str] = await user.send_otp()
    if 'error' in sendOTP:
        raise HTTPException(status_code=400, detail=sendOTP["error"])
    return { "id": saved_user_id, "name": user.name, "email": user.email, "message": sendOTP.get('message') }

@router.post('/login')
async def login(email: str = Body(...), otp: str = Body(...)):
    user = User("", email)
    if await user.verify_otp(otp):
        access_token = create_access_token(data={"sub": email})
        return { "access_token": access_token, "token_type": "bearer" }
    raise HTTPException(status_code=400, detail="Invalid OTP")

@router.post('/logout')
async def logout(token: str = Body(...)):
    user = User("", "")
    await user.blacklist_token(token)
    return { "message": "Token has been blacklisted." }

@router.post('/verify-otp')
async def verify_otp(email: str = Body(...), otp: str = Body(...)):
    user = User("", email)
    if await user.verify_otp(otp):
        access_token = create_access_token(data={"sub": email})
        return { "access_token": access_token, "token_type": "bearer" }
    raise HTTPException(status_code=400, detail="Invalid or expired OTP")

@router.post('/token/verify')
async def verify_user_token(token: str = Body(...)):
    user = User("", "")
    if await user.is_token_blacklisted(token):
        raise HTTPException(status_code=401, detail="Token is blacklisted")
    email = verify_token(token)
    return { "email": email }