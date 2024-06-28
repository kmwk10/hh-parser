import psycopg2
from src.parsing import get_vacancy_data, get_vacancy, get_resume_links, get_resume
from src.env import DB_HOST, DB_PASS, DB_USER, DB_NAME, DB_PORT

def create_tables():
    conn = psycopg2.connect(
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASS,
        host=DB_HOST,
        port=DB_PORT
    )
    cur = conn.cursor()
    cur.execute("""
            CREATE TABLE IF NOT EXISTS vacancies (
            vacancies_id VARCHAR(9) PRIMARY KEY,
            name VARCHAR(255),
            salary VARCHAR(255),
            area VARCHAR(255),
            schedule VARCHAR(255),
            employment VARCHAR(255),
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
    cur.close()
    conn.close()

def update_vacancies_table(vac):
    conn = psycopg2.connect(
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASS,
        host=DB_HOST,
        port=DB_PORT
    )
    cur = conn.cursor()
    cur.execute("""
                INSERT INTO vacancies (vacancies_id, name, salary, area, schedule, employment, experience, requirement, employer)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (vacancies_id) DO UPDATE 
                    SET name = excluded.name, 
                        salary = excluded.salary,
                        area = excluded.area,
                        schedule = excluded.schedule,
                        employment = excluded.employment,
                        experience = excluded.experience,
                        requirement = excluded.requirement,  
                        employer = excluded.employer;
                
                """,
                (vac["id"], vac["name"], vac["salary"], vac["area"], vac["schedule"], vac["employment"], vac["experience"], vac["requirement"], vac["employer"])
            )
    conn.commit()  
    cur.close()
    conn.close()

def update_resumes_table(res):
    conn = psycopg2.connect(
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASS,
        host=DB_HOST,
        port=DB_PORT
    )
    cur = conn.cursor()
    cur.execute("""
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
        
        """,
        (res["id"], res["name"], res["gender"], res["age"], res["salary"], res["employment"], res["schedule"], res["experience"], res["skills"], res["languages"])
    )
    conn.commit()
    cur.close()
    conn.close()

# def get_vacancies_table():
#     conn = psycopg2.connect(
#             dbname=DB_NAME,
#             user=DB_USER,
#             password=DB_PASS,
#             host=DB_HOST,
#             port=DB_PORT
#         )
#     cur = conn.cursor()
#     cur.execute("SELECT * FROM vacancies;")
#     return cur.fetchmany(20)

