from fastapi import FastAPI
from app.database import init_db
from app.routes import router

app = FastAPI()

init_db()
app.include_router(router)


@app.get("/")
def read_root():
    return {"message": "Expense Tracker API is running"}