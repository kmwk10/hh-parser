import psycopg2
from contextlib import contextmanager
from src.env import DB_HOST, DB_PASS, DB_USER, DB_NAME, DB_PORT

EMPLOYMENT_MAP = {"0": "Полная занятость", "1": "Частичная занятость", "2": "Стажировка", "3": "Проектная работа", "4": "Волонтерство"}
SCHEDULE_MAP = {"0": "Полный день", "1": "Удаленная работа", "2": "Сменный график", "3": "Гибкий график", "4": "Вахтовый метод"}
GENDER_MAP = {"0": "Мужчина", "1": "Женщина"}

@contextmanager
def get_db_connection():
    conn = psycopg2.connect(
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASS,
        host=DB_HOST,
        port=DB_PORT
    )
    try:
        yield conn
    finally:
        conn.close()

def create_tables():
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                    CREATE TABLE IF NOT EXISTS vacancies (
                    vacancies_id VARCHAR(9) PRIMARY KEY,
                    name VARCHAR(255),
                    salary VARCHAR(255),
                    area VARCHAR(255),
                    employment VARCHAR(255),
                    schedule VARCHAR(255),
                    experience VARCHAR(255),
                    requirement TEXT,
                    employer VARCHAR(255)
                );"""
            )
            cur.execute("""
                    CREATE TABLE IF NOT EXISTS resumes (
                    resumes_id VARCHAR(38) PRIMARY KEY,
                    name VARCHAR(255),
                    gender VARCHAR(255),
                    age VARCHAR(255),
                    salary VARCHAR(255),
                    employment VARCHAR(255),
                    schedule VARCHAR(255),
                    experience VARCHAR(255),
                    skills TEXT[],
                    languages TEXT[]
                );"""
            )
            conn.commit()

def execute_query(query, params=()):
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(query, params)
            conn.commit()

def fetch_query(query, params=()):
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(query, params)
            return cur.fetchall()

def update_vacancies_table(vac):
    query = """
        INSERT INTO vacancies (vacancies_id, name, salary, area, employment, schedule, experience, requirement, employer)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (vacancies_id) DO UPDATE 
            SET name = excluded.name, 
                salary = excluded.salary,
                area = excluded.area,
                employment = excluded.employment,
                schedule = excluded.schedule,
                experience = excluded.experience,
                requirement = excluded.requirement,  
                employer = excluded.employer;
    """
    execute_query(query, (vac["id"], vac["name"], vac["salary"], vac["area"], vac["employment"], vac["schedule"], vac["experience"], vac["requirement"], vac["employer"]))

def update_resumes_table(res):
    query = """
        INSERT INTO resumes (resumes_id, name, gender, age, salary, employment, schedule, experience, skills, languages)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (resumes_id) DO UPDATE 
            SET name = excluded.name, 
                gender = excluded.gender,
                age = excluded.age,
                salary = excluded.salary,
                employment = excluded.employment,
                schedule = excluded.schedule,
                experience = excluded.experience,  
                skills = excluded.skills,
                languages = excluded.languages;
        
    """
    execute_query(query, (res["id"], res["name"], res["gender"], res["age"], res["salary"], res["employment"], res["schedule"], res["experience"], res["skills"], res["languages"])) 

def get_vacancies_by_params(name, area, emp, sch):
    query = "SELECT * FROM vacancies"
    params = []
    conditions = []
    
    if name:
        conditions.append("name ILIKE %s")
        params.append(f'%{name}%')
    if area:
        conditions.append("area ILIKE %s")
        params.append(area)
    if emp:
        emp_values = [EMPLOYMENT_MAP[e] for e in emp if e in EMPLOYMENT_MAP]
        conditions.append("employment = ANY(%s)")
        params.append(emp_values)
    if sch:
        sch_values = [SCHEDULE_MAP[s] for s in sch if s in SCHEDULE_MAP]
        conditions.append("schedule = ANY(%s)")
        params.append(sch_values)
    
    if conditions:
        query += " WHERE " + " AND ".join(conditions)
    
    fetch = fetch_query(query, params)
    data = [{
        "id": row[0],
        "name": row[1],
        "salary": row[2],
        "area": row[3],
        "employment": row[4],
        "schedule": row[5],
        "experience": row[6],
        "requirement": row[7],
        "employer": row[8]
    } for row in fetch]
    return data

def get_resumes_by_params(name, gender, emp, sch, skills):
    query = "SELECT * FROM resumes"
    params = []
    conditions = []
    
    if name:
        conditions.append("name ILIKE %s")
        params.append(f'%{name}%')
    if gender:
        conditions.append("gender ILIKE %s")
        params.append(GENDER_MAP.get(gender))
    if emp:
        emp_values = [EMPLOYMENT_MAP[e] for e in emp if e in EMPLOYMENT_MAP]
        conditions.append("employment = ANY(%s)")
        params.append(emp_values)
    if sch:
        sch_values = [SCHEDULE_MAP[s] for s in sch if s in SCHEDULE_MAP]
        conditions.append("schedule = ANY(%s)")
        params.append(sch_values)
    if skills:
        for skill in skills.replace(" ", "").split(","):
            conditions.append("%s ILIKE ANY(skills)")
            params.append(skill)
    
    if conditions:
        query += " WHERE " + " AND ".join(conditions)
    
    fetch = fetch_query(query, params)
    data = [{
        "id": row[0],
        "name": row[1],
        "gender": row[2],
        "age": row[3],
        "salary": row[4],
        "employment": row[5],
        "schedule": row[6],
        "experience": row[7],
        "skills": row[8],
        "languages": row[9]
    } for row in fetch]
    return data