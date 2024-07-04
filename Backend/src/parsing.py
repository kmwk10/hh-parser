import requests
from bs4 import BeautifulSoup
import fake_useragent

def get_vacancy_data(text, emp, sch, page):
    employment = {"0": "full", "1": "part", "2": "probation", "3": "project", "4": "volunteer"}
    schedule ={"0": "fullDay", "1": "remote", "2": "shift", "3": "flexible", "4": "flyInFlyOut"}

    params = f'page={page}&per_page=20&text={text}'
    if emp:
        emp = list(emp)
        for e in emp:
            params += f'&employment={employment[e]}'
    if sch:
        sch = list(sch)
        for s in sch:
            params += f'&schedule={schedule[s]}'
    data = requests.get("https://api.hh.ru/vacancies?"+params)
    if data:
        data = data.json()
        for item in data["items"]:
            yield item

def get_vacancy(item):
    salary = ""
    if item["salary"]:
        if item["salary"]["from"] and item["salary"]["to"]:
            salary = str(item["salary"]["from"]) + '-' + str(item["salary"]["to"]) + " " + item["salary"]["currency"]
        elif item["salary"]["from"]:
            salary = "От " + str(item["salary"]["from"]) + " " + item["salary"]["currency"]
        else:
            salary = "До " + str(item["salary"]["to"]) + " " + item["salary"]["currency"]

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
    employment = {"0": "full", "1": "part", "2": "probation", "3": "project", "4": "volunteer"}
    schedule ={"0": "fullDay", "1": "remote", "2": "shift", "3": "flexible", "4": "flyInFlyOut"}

    params = ''
    if emp:
        emp = list(emp)
        for e in emp:
            params += f'&employment={employment[e]}'
    if sch:
        sch = list(sch)
        for s in sch:
            params += f'&schedule={schedule[s]}'

    ua = fake_useragent.UserAgent()
    data = requests.get(
        url=f"https://hh.ru/search/resume?text={text}&area=1&isDefaultArea=true&ored_clusters=true&order_by=relevance&search_period=0&logic=normal&pos=full_text&exp_period=all_time&page=1"+params,
        headers={"user-agent":ua.random}
    )
    if data.status_code != 200:
        return
    soup = BeautifulSoup(data.content, "lxml")
    try:
        number_of_page = int(soup.find("div", attrs={"class":"pager"}).find_all("span", recursive=False)[-1].find("a").find("span").text)
    except:
        return
    if page > number_of_page:
        return "Error"
    try:
        data = requests.get(
            url=f"https://hh.ru/search/resume?text={text}&area=1&isDefaultArea=true&ored_clusters=true&order_by=relevance&search_period=0&logic=normal&pos=full_text&exp_period=all_time&page={page}&items_on_page=20"+params,
            headers={"user-agent":ua.random}
        )
        soup = BeautifulSoup(data.content, "lxml")
        for a in soup.find_all("a", attrs={"data-qa":"serp-item__title"}):
            yield f"https://hh.ru{a.attrs['href'].split('?')[0]}"
    except Exception as e:
        print(f"{e}")

def get_resume(link):
    ua = fake_useragent.UserAgent()
    data = requests.get(
        url=link,
        headers={"user-agent":ua.random}
    )
    if data.status_code != 200:
        return
    soup = BeautifulSoup(data.content, "lxml")

    name = soup.find(attrs={"data-qa":"resume-block-title-position"}).text

    gender = soup.find(attrs={"data-qa":"resume-personal-gender"}).text

    age = soup.find(attrs={"data-qa":"resume-personal-age"})
    if age:
        age = age.text.replace("\xa0", " ")
    else:
        age = ""
        
    salary = soup.find(attrs={"class":"resume-block__salary"})
    if salary:
        salary = salary.text.split(" ")[0].replace("\u2009", "").replace("\xa0", " ")
    else:
        salary = ""

    work_type = [p.text for p in soup.find(attrs={"class":"resume-block-item-gap"}).find_all("p")]
    employment = work_type[0].replace("Employment: ", "").replace("Занятость: ", "")
    schedule = work_type[1].replace("Work schedule: ", "").replace("График работы: ", "")

    experience = soup.find(attrs={"class":"resume-block__title-text_sub"})
    if experience:
        experience = [span.text.replace("\xa0", " ") for span in experience.find_all("span")]
        s = ''
        for i in experience:
            s += i+" "
        experience = s[:-1]
    else:
        experience = ""

    skills = soup.find(attrs={"data-qa":"skills-table"})
    if skills:
        skills = [skill.text for skill in skills.find_all(attrs={"data-qa":"bloko-tag__text"})]
    else:
        skills = []

    languages = soup.find(attrs={"data-qa":"resume-block-languages"})
    if languages:
        languages = [lang.text for lang in languages.find_all(attrs={"data-qa":"resume-block-language-item"})]
    else:
        languages = []

    resume = {
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
    return resume