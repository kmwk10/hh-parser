import { useEffect, useState } from 'react';
import { Flex, Input, Text, Link as ChakraLink, Card, CardHeader, CardBody, Checkbox, CheckboxGroup, Stack, Image, Tag, Alert, AlertIcon, Button, CircularProgress} from '@chakra-ui/react'
import { Link as ReactRouterLink } from 'react-router-dom'
import arrow from '../assets/arrow.svg'

function Vacancies() {
  const [text, setText] = useState('')
  const [employment, setEmployment] = useState({"0": false, "1": false, "2": false, "3": false, "4": false})
  const [schedule, setSchedule] = useState({"0": false, "1": false, "2": false, "3": false, "4": false})
  const [vacancies, setVacancies] = useState([])
  const [stat, setStat] = useState('')
  const [count, setCount] = useState(0)
  const [prog, setProg] = useState(false);
  
  useEffect(() => {
    fetch("http://127.0.0.1:8000", {
      method: "GET",
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
    })
      .then((response) => response.json())
      .catch((error) => console.log(error));
  }, []);
  
  function getVacancies(count, add) {
    let url = "http://127.0.0.1:8000/vacancies?text="+text+"&count="+count
    let strEmp = ''
    for (let item in employment) {
      if (employment[item]) {
        strEmp += item
      }
    }
    if (strEmp.length !=0) {
      url += "&employment="+strEmp
    }
    let strSch = ''
    for (let item in schedule) {
      if (schedule[item]) {
        strSch += item
      }
    }
    if (strSch.length !=0) {
      url += "&schedule="+strSch
    }
    fetch(url, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (add) {
          const newVac = [...vacancies, ...data]
          setVacancies(newVac);
        } else {
          setVacancies(data);
        }
        if (data.length == 0) {
          setStat('nothing')
        } else {
          setStat('success')
        }
        setProg(false);
      })
      .catch((error) => {
        console.log(error)
        setStat('error')
      })
  }

  function updateVacancies() {
    setProg(true);
    setCount(0);
    getVacancies(0, false);
  }

  function addVacancies() {
    setProg(true);
    setCount(count+1)
    getVacancies(count+1, true);
  }

  const handleKeyDown = event => {
    if (event.key === 'Enter') {
      updateVacancies();
    }
  };

  function updateEmployment(value) {
    let newEmployment = employment;
    newEmployment[value] = !newEmployment[value];
    setEmployment(newEmployment);
  }

  function updateSchedule(value) {
    let newSchedule = schedule;
    newSchedule[value] = !newSchedule[value];
    setSchedule(newSchedule);
  }

  const vacanciesCards = vacancies.map((vac) => (
    <Card align='flex-start' w='100%' marginBottom='1rem' key={vac['id']}>
      <CardHeader paddingBottom='0.5rem'>
        <ChakraLink href={'https://hh.ru/vacancy/'+vac["id"]} isExternal><Text fontSize='2xl' textAlign='left'>{vac["name"]}</Text></ChakraLink>
      </CardHeader>
      <CardBody textAlign='start' paddingTop='0'>
        <Text as='b'>{vac["salary"]}</Text>
        <Text>{vac["employer"]}</Text>
        <Text>{vac["area"]}</Text>
        <Tag margin='0.2rem 1rem 0.2rem 0'>{vac["experience"]}</Tag>
        <Tag margin='0.2rem 1rem 0.2rem 0'>{vac["employment"]}</Tag>
        <Tag margin='0.2rem 0'>{vac["schedule"]}</Tag>
        <Text>{vac["requirement"]}</Text>
      </CardBody>
    </Card>
  ));

  return (
    <>
      <Flex align='baseline'>
        <Text fontSize='5xl' paddingRight='5rem'>hh_parser</Text>
        <ChakraLink as={ReactRouterLink} to='/' fontSize='2xl' paddingRight='5rem'><Text color='blue.600' as='ins'>Вакансии</Text></ChakraLink>
        <ChakraLink as={ReactRouterLink} to='/resumes' fontSize='2xl' paddingRight='5rem'>Резюме</ChakraLink>
      </Flex>
      <Flex align='center'>
        <Image src={arrow} boxSize='1rem' margin='1rem 0 0 2rem'/>
        <ChakraLink as={ReactRouterLink} to='/data' fontSize='l' marginTop='1rem'>База данныx по вакансиям</ChakraLink>
      </Flex>
      <Flex>
        <Flex direction='column' w="50vw">
          <Flex direction='column' align='flex-start'>
            <Input placeholder='Поиск по вакансиям' margin='1rem 0' onChange={e => setText(e.target.value)} onKeyDown={handleKeyDown}/>
          </Flex>
          <Flex direction='column'>
              {vacanciesCards}
          </Flex>
          {vacancies.length!=0 ? 
          <Button marginBottom='1rem' onClick={addVacancies}>Найти ещё</Button>
          : 
          <></>
          }
        </Flex>
        <Flex w='30vw' direction='column' justify='flex-start' padding='0 2rem' marginTop='1rem'>
          <Card>
            <CardHeader>
              <Text fontSize='xl' align='left'>Фильтры</Text>
            </CardHeader>
            <CardBody textAlign='start' paddingTop='0'>
              <Text>Занятость</Text>
              <CheckboxGroup>
                <Stack marginLeft='1rem' marginBottom="1rem">
                  <Checkbox size='sm' onChange={() => updateEmployment('0')}>Полная занятость</Checkbox>
                  <Checkbox size='sm' onChange={() => updateEmployment('1')}>Частичная занятость</Checkbox>
                  <Checkbox size='sm' onChange={() => updateEmployment('2')}>Стажировка</Checkbox>
                  <Checkbox size='sm' onChange={() => updateEmployment('3')}>Проектная работа</Checkbox>
                  <Checkbox size='sm' onChange={() => updateEmployment('4')}>Волонтерство</Checkbox>
                </Stack>
              </CheckboxGroup>
              <Text>График</Text>
              <CheckboxGroup>
                <Stack marginLeft='1rem' marginBottom="1rem">
                  <Checkbox size='sm' onChange={() => updateSchedule('0')}>Полный день</Checkbox>
                  <Checkbox size='sm' onChange={() => updateSchedule('1')}>Удаленная работа</Checkbox>
                  <Checkbox size='sm' onChange={() => updateSchedule('2')}>Сменный график</Checkbox>
                  <Checkbox size='sm' onChange={() => updateSchedule('3')}>Гибкий график</Checkbox>
                  <Checkbox size='sm' onChange={() => updateSchedule('4')}>Вахтовый метод</Checkbox>
                </Stack>
              </CheckboxGroup>
              <Flex>
                <Button size='sm' onClick={updateVacancies}>Показать результаты</Button>
              </Flex>
            </CardBody>
          </Card>
        </Flex>
      </Flex>
      {prog ?
        <CircularProgress isIndeterminate marginBottom='1rem' zIndex={2} pos="fixed" right='2rem' top='2rem'/>
      :
      stat=='success' ? 
        <Alert status='success' zIndex={2} pos="fixed" w='auto' right='2rem' top='2rem'>
          <AlertIcon />
          Найденные вакансии загружены в базу данныx!
        </Alert>
      :
      stat=="error" ?
        <Alert status='error' zIndex={2} pos="fixed" w='auto' right='2rem' top='2rem'>
          <AlertIcon />
          При обработке вашего запроса произошла ошибка!
        </Alert>
      :
      stat=="nothing" ?
        <Alert status='info' zIndex={2} pos="fixed" w='auto' right='2rem' top='2rem'>
          <AlertIcon />
          По вашему запросу ничего не найдено!
        </Alert>
      :
        <></>
      }
    </>
  )
}
  
export {Vacancies}