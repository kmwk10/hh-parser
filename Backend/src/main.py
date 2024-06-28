from fastapi import FastAPI
from pydantic import BaseModel
from src.db import create_tables, update_vacancies_table, update_resumes_table
from src.parsing import get_vacancy_data, get_vacancy, get_resume_links, get_resume

app = FastAPI()

@app.get("/")
def root():
    try:
        create_tables()
        return "Таблица создалась"
    except:
        return "Ошибка"

@app.get("/vacancies")
def gat_vacancies(text: str, count: int):
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
def gat_resumes(text: str, count: int):
    try:
        data = []
        for link in get_resume_links(text, count):
            resume = get_resume(link)
            data.append(resume)
            update_resumes_table(resume)
        return data
    except Exception as e:
        return f"{e}"
