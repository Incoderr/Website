from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
from fastapi.middleware.cors import CORSMiddleware

# Инициализация приложения FastAPI
app = FastAPI()

# Настройка CORS для работы с React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173, https://test-site-jk7hhk6uy74hg72i4i.netlify.app"],  # Замените на конкретный адрес вашего React-приложения
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключение к MongoDB
MONGO_URI = "mongodb://localhost:27017"
client = AsyncIOMotorClient(MONGO_URI)
db = client["auth_db"]
users_collection = db["users"]

# Настройка шифрования паролей
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# Модели данных
class LoginModel(BaseModel):
    login: str
    password: str

class SignupModel(BaseModel):
    signupLogin: str
    email: EmailStr
    signupPassword: str

# Роут для регистрации
@app.post("/api/signup")
async def signup(user: SignupModel):
    # Проверка наличия пользователя с таким логином или email
    existing_user = await users_collection.find_one({
        "$or": [
            {"login": user.signupLogin},
            {"email": user.email}
        ]
    })

    if existing_user:
        raise HTTPException(status_code=400, detail="Пользователь с таким логином или email уже существует")

    hashed_password = hash_password(user.signupPassword)
    new_user = {
        "login": user.signupLogin,
        "email": user.email,
        "password": hashed_password
    }

    await users_collection.insert_one(new_user)
    return {"message": "Регистрация успешна"}

# Роут для входа
@app.post("/api/login")
async def login(user: LoginModel):
    existing_user = await users_collection.find_one({"login": user.login})

    if not existing_user or not verify_password(user.password, existing_user["password"]):
        raise HTTPException(status_code=400, detail="Неправильный логин или пароль")

    return {"message": "Вход выполнен успешно"}

@app.post("/check-email")
async def check_email(data: dict):
    email = data.get("email")
    existing_user = await users_collection.find_one({"email": email})
    return {"available": not bool(existing_user)}

# Тестовый роут
@app.get("/")
async def root():
    return {"message": "API работает"}
