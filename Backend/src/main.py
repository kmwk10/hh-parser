from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from env import DB_HOST, DB_PASS, DB_USER, DB_NAME, DB_PORT
from pydantic import BaseModel
from db import create_tables, update_vacancies_table, update_resumes_table, get_vacancies_by_params, get_resumes_by_params
from parsing import get_vacancy_data, get_vacancy, get_resume_links, get_resume

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1м :5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    try:
        create_tables()
        return "Таблица создалась"
    except Exception as e:
        return f"{e}"

@app.get("/vacancies")
def get_vacancies(text: str, count: int = 0):
    try:
        data = []
        for item in get_vacancy_data(text, count):
            vacancy = get_vacancy(item)
            data.append(vacancy)
            update_vacancies_table(vacancy)
        return data
    except Exception as e:
        return f"{e}"

@app.get("/resumes")
def get_resumes(text: str, count: int = 0):
    try:
        data = []
        for link in get_resume_links(text, count):
            resume = get_resume(link)
            data.append(resume)
            update_resumes_table(resume)
        return data
    except Exception as e:
        return f"{e}"

@app.get("/vacancies/data")
def get_vacancies_data(name: str | None = None, area: str | None = None, employment: int | None = None, schedule: int | None = None):
    try:
        data = get_vacancies_by_params(name, area, employment, schedule)
        return data
    except Exception as e:
        return f"{e}"

@app.get("/resumes/data")
def get_resumes_data(name: str | None = None, gender: int | None = None, employment: int | None = None, schedule: int | None = None, skills: str | None = None):
    try:
        data = get_resumes_by_params(name, gender, employment, schedule, skills)
        return data
    except Exception as e:
        return f"{e}"

