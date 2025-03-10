import requests
from bs4 import BeautifulSoup
import fake_useragent

EMPLOYMENT_MAP = {"0": "full", "1": "part", "2": "probation", "3": "project", "4": "volunteer"}
SCHEDULE_MAP = {"0": "fullDay", "1": "remote", "2": "shift", "3": "flexible", "4": "flyInFlyOut"}

HEADERS = {"User-Agent": fake_useragent.UserAgent().random}

def build_query_params(text, emp, sch, page):
    params = {"page": page, "per_page": 20, "text": text}
    if emp:
        params["employment"] = [EMPLOYMENT_MAP[e] for e in emp if e in EMPLOYMENT_MAP]
    if sch:
        params["schedule"] = [SCHEDULE_MAP[s] for s in sch if s in SCHEDULE_MAP]
    return params

def get_vacancy_data(text, emp, sch, page):
    params = build_query_params(text, emp, sch, page)
    response = requests.get("https://api.hh.ru/vacancies", params=params, headers=HEADERS)
    
    if response.status_code != 200:
        print(f"Ошибка запроса: {response.status_code}")
        return []
    
    data = response.json()
    for item in data["items"]:
        yield item

def get_vacancy(item):
    salary = ""
    if item["salary"]:
        salary_from = item["salary"]["from"]
        salary_to = item["salary"]["to"]
        currency = item["salary"]["currency"]
        if salary_from and salary_to:
            salary = f"{salary_from}-{salary_to} {currency}"
        elif salary_from:
            salary = f"От {salary_from} {currency}"
        else:
            salary = f"До {salary_to} {currency}"

    requirement = ""
    if item["snippet"]["requirement"]:
        requirement = item["snippet"]["requirement"].replace("<highlighttext>", "").replace("</highlighttext>", "")
    
    vacancy = {
        "id": item["id"],
        "name": item["name"],
        "salary": salary,
        "area": item["area"]["name"],
        "schedule": item["schedule"]["name"],
        "employment": item["employment"]["name"],
        "experience": item["experience"]["name"],
        "requirement": requirement,
        "employer" : item["employer"]["name"]
    }
    return vacancy

def get_resume_links(text, emp, sch, page):
    params = build_query_params(text, emp, sch, page)
    url = f"https://hh.ru/search/resume?&area=1&isDefaultArea=true&ored_clusters=true&order_by=relevance&search_period=0&logic=normal&pos=full_text&exp_period=all_time&items_on_page=20"
    
    response = requests.get(url, params=params, headers=HEADERS)
    if response.status_code != 200:
        print(f"Ошибка запроса: {response.status_code}")
        return []
    
    soup = BeautifulSoup(response.content, "lxml")
    for a in soup.find_all("a", attrs={"data-qa":"serp-item__title"}):
        yield f"https://hh.ru{a.attrs['href'].split('?')[0]}"

def get_resume(link):
    response = requests.get(link, headers=HEADERS)
    if response.status_code != 200:
        print(f"Ошибка запроса: {response.status_code}")
        return None
    
    soup = BeautifulSoup(response.content, "lxml")

    name = soup.find(attrs={"data-qa":"resume-block-title-position"}).text
    gender = soup.find(attrs={"data-qa":"resume-personal-gender"}).text

    age = soup.find(attrs={"data-qa":"resume-personal-age"})
    age = age.text.replace("\xa0", " ") if age else ""
        
    salary = soup.find(attrs={"class":"resume-block__salary"})
    salary = salary.text.split(" ")[0].replace("\u2009", "").replace("\xa0", " ") if salary else ""

    work_type = [p.text for p in soup.find(attrs={"class":"resume-block-item-gap"}).find_all("p")]
    employment = work_type[0].replace("Employment: ", "").replace("Занятость: ", "")
    schedule = work_type[1].replace("Work schedule: ", "").replace("График работы: ", "")

    experience = " ".join([span.text.replace("\xa0", " ")
                            for span in soup.find(attrs={"class": "resume-block__title-text_sub"}).find_all("span")])

    skills = [skill.text for skill in soup.find_all(attrs={"data-qa": "bloko-tag__text"})]
    languages = [lang.text for lang in soup.find_all(attrs={"data-qa": "resume-block-language-item"})]

    return {
        "id": link[21:],
        "name": name,
        "gender": gender,
        "age": age,
        "salary": salary,
        "employment": employment,
        "schedule": schedule,
        "experience": experience,
        "skills": skills,
        "languages": languages
    }