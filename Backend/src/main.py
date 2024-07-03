from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from src.db import create_tables, update_vacancies_table, update_resumes_table, get_vacancies_by_params, get_resumes_by_params
from src.parsing import get_vacancy_data, get_vacancy, get_resume_links, get_resume

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Vacancy(BaseModel):
    id: str
    name: str
    salary: str
    area: str
    employment: str
    schedule: str
    experience: str
    requirement: str
    employer: str

class Resume(BaseModel):
    id: str
    name: str
    gender: str
    age: str
    salary: str
    employment: str
    schedule: str
    experience: str
    skills: list[str]
    languages: list[str]

@app.get("/")
def root():
    try:
        create_tables()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    return {"status_code": 200}

@app.get("/vacancies")
def get_vacancies(text: str, count: int = 0) -> list[Vacancy]:
    try:
        data = []
        for item in get_vacancy_data(text, count):
            vacancy = get_vacancy(item)
            data.append(vacancy)
            update_vacancies_table(vacancy)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    return data

@app.get("/resumes")
def get_resumes(text: str, count: int = 0) -> list[Resume]:
    try:
        data = []
        for link in get_resume_links(text, count):
            resume = get_resume(link)
            data.append(resume)
            update_resumes_table(resume)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    return data

@app.get("/vacancies/data")
def get_vacancies_data(name: str | None = None, area: str | None = None, employment: str | None = None, schedule: str | None = None) -> list[Vacancy]:
    try:
        data = get_vacancies_by_params(name, area, employment, schedule)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    return data

@app.get("/resumes/data")
def get_resumes_data(name: str | None = None, gender: int | None = None, employment: str | None = None, schedule: str | None = None, skills: str | None = None) -> list[Resume]:
    try:
        data = get_resumes_by_params(name, gender, employment, schedule, skills)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    return data

