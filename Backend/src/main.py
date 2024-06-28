from fastapi import FastAPI
from pydantic import BaseModel
 
app = FastAPI()

@app.get("/")
def root():
    return {"message": "Hello World"}

@app.get("/vacancies")
def gat_vacancies(text: str):
    return text

@app.get("/resumes")
def gat_resumes(text: str):
    return text

class Vacancy(BaseModel):
        id: str
        name: str
        salary: str
        area: str
        schedule: str
        employment: str
        experience: str
        requirement: str
        employer : str

# @app.post("/vacancies")
# def add_vacancies(vacancies: List[Vacancy]):
#      return {"status": 200, "data": vacancies}