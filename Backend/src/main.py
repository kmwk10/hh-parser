from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Callable, Any
from functools import wraps
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
    skills: List[str]
    languages: List[str]

def handle_exceptions(func: Callable[..., Any]) -> Callable[..., Any]:
    @wraps(func)
    async def wrapper(*args: Any, **kwargs: Any) -> Any:
        try:
            return await func(*args, **kwargs)
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    return wrapper

@app.get("/")
@handle_exceptions
async def root():
    create_tables()
    return {"status_code": 200}

@app.get("/vacancies", response_model=List[Vacancy])
@handle_exceptions
async def get_vacancies(text: str, employment: Optional[str] = None, schedule: Optional[str] = None, count: int = 0):
    data = [get_vacancy(item) for item in get_vacancy_data(text, employment, schedule, count)]
    for vacancy in data:
        update_vacancies_table(vacancy)
    return data

@app.get("/resumes", response_model=List[Resume])
@handle_exceptions
async def get_resumes(text: str, employment: Optional[str] = None, schedule: Optional[str] = None, count: int = 0):
    data = [get_resume(link) for link in get_resume_links(text, employment, schedule, count)]
    for resume in data:
        update_resumes_table(resume)
    return data

@app.get("/vacancies/data", response_model=List[Vacancy])
@handle_exceptions
async def get_vacancies_data(name: Optional[str] = None, area: Optional[str] = None, employment: Optional[str] = None, schedule: Optional[str] = None):
    return get_vacancies_by_params(name, area, employment, schedule)

@app.get("/resumes/data", response_model=List[Resume])
@handle_exceptions
async def get_resumes_data(name: Optional[str] = None, gender: Optional[str] = None, employment: Optional[str] = None, schedule: Optional[str] = None, skills: Optional[str] = None):
    return get_resumes_by_params(name, gender, employment, schedule, skills)