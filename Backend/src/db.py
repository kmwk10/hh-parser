import psycopg2
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
                
                """,
                (vac["id"], vac["name"], vac["salary"], vac["area"], vac["employment"], vac["schedule"], vac["experience"], vac["requirement"], vac["employer"])
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

def get_vacancies_by_params(name, area, emp, sch):
    conn = psycopg2.connect(
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASS,
        host=DB_HOST,
        port=DB_PORT
    )
    cur = conn.cursor()
    select = "SELECT * FROM vacancies"
    params = []
    employment = {"0": "Полная занятость", "1": "Частичная занятость", "2": "Стажировка", "3": "Проектная работа", "4": "Волонтерство"}
    schedule ={"0": "Полный день", "1": "Удаленная работа", "2": "Сменный график", "3": "Гибкий график", "4": "Вахтовый метод"}
    if name or area or emp or sch:
        select += " WHERE"
    if name:
        select += " name ILIKE %s AND"
        params.append('%'+name+'%')
    if area:
        select += " area ILIKE %s AND"
        params.append(area)
    if emp:
        emp = list(emp)
        select += " ("
        for e in emp:
            select += " employment=%s OR"
            params.append(employment[e])
        select = select[:-3] + ") AND"
    if sch:
        sch = list(sch)
        select += " ("
        for s in sch:
            select += " schedule=%s OR"
            params.append(schedule[s])
        select = select[:-3] + ") AND"
    if name or area or emp or sch:
        select = select[:-4]
    cur.execute(select, params)
    fetch = cur.fetchall()
    data = []
    for row in fetch:
        data.append({
            "id": row[0],
            "name": row[1],
            "salary": row[2],
            "area": row[3],
            "employment": row[4],
            "schedule": row[5],
            "experience": row[6],
            "requirement": row[7],
            "employer": row[8]
        })
    cur.close()
    conn.close()
    return data

def get_resumes_by_params(name, gender, emp, sch, skills):
    conn = psycopg2.connect(
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASS,
        host=DB_HOST,
        port=DB_PORT
    )
    cur = conn.cursor()

    select = "SELECT * FROM resumes"
    params = []
    employment = {"0": "Полная занятость", "1": "Частичная занятость", "2": "Стажировка", "3": "Проектная работа", "4": "Волонтерство"}
    schedule ={"0": "Полный день", "1": "Удаленная работа", "2": "Сменный график", "3": "Гибкий график", "4": "Вахтовый метод"}
    genders = ['Мужчина', 'Женщина']
    if name or gender or emp or sch or skills:
        select += " WHERE"
    if name:
        select += " name ILIKE %s AND"
        params.append('%'+name+'%')
    if gender:
        select += " gender ILIKE %s AND"
        params.append(genders[gender])
    if emp:
        emp = list(emp)
        select += " ("
        for e in emp:
            select += " employment ILIKE %s OR"
            params.append('%'+employment[e]+'%')
        select = select[:-3] + ") AND"
    if sch:
        sch = list(sch)
        select += " ("
        for s in sch:
            select += " schedule ILIKE %s OR"
            params.append('%'+schedule[s]+'%')
        select = select[:-3] + ") AND"
    if skills:
        skills = skills.replace(" ", "").split(",")
        for skill in skills:
            select += " %s ILIKE ANY(skills) AND"
            params.append(skill)
    if name or gender or emp or sch or skills:
        select = select[:-4]
    cur.execute(select, params)
    fetch = cur.fetchall()
    data = []
    for row in fetch:
        data.append({
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
        })
    cur.close()
    conn.close()
    return data