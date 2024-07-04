import { useState } from 'react';
import { Flex, Input, Text, Link as ChakraLink, Card, CardHeader, CardBody, Checkbox, CheckboxGroup, Stack, Image, Tag, Alert, AlertIcon, Button, Box, CircularProgress} from '@chakra-ui/react'
import { Link as ReactRouterLink } from 'react-router-dom'
import arrow from '../assets/arrow.svg'

function Resumes() {
  const [text, setText] = useState('')
  const [employment, setEmployment] = useState({"0": false, "1": false, "2": false, "3": false, "4": false})
  const [schedule, setSchedule] = useState({"0": false, "1": false, "2": false, "3": false, "4": false})
  const [resumes, setResumes] = useState([])
  const [stat, setStat] = useState('')
  const [count, setCount] = useState(0)
  const [prog, setProg] = useState(false);
  
  function getResumes(count, add) {
    let url = "http://127.0.0.1:8000/resumes?text="+text+"&count="+count
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
          const newRes = [...resumes, ...data]
          setResumes(newRes);
        } else {
          setResumes(data);
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

  function updateResumes() {
    setProg(true);
    setCount(0);
    getResumes(0, false);
  }

  function addResumes() {
    setProg(true);
    setCount(count+1)
    getResumes(count+1, true);
  }

  const handleKeyDown = event => {
    if (event.key === 'Enter') {
      updateResumes();
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

  const resumesCards = resumes.map((res) => (
    <Card align='flex-start' w='100%' marginBottom='1rem' key={res['id']}>
      <CardHeader paddingBottom='0.5rem'>
        <ChakraLink href={'https://hh.ru/resume/'+res["id"]} isExternal><Text fontSize='2xl' textAlign='left'>{res["name"]}</Text></ChakraLink>
      </CardHeader>
      <CardBody textAlign='start' paddingTop='0'>
        <Text as='b'>{res["salary"]}</Text>
        <Text>{res["gender"]}</Text>
        <Text>{res["age"]}</Text>
        <Text>Опыт работы: {res["experience"]}</Text>
        <Text>{res["employment"][0].toUpperCase() + res["employment"].slice(1)}</Text>
        <Text>{res["schedule"][0].toUpperCase() + res["schedule"].slice(1)}</Text>
        <Box>
          {res["skills"].length!=0 ? <Text>Навыки: </Text> : <></>}
          {res["skills"].map((item) => (
            <Tag key={item} margin='0.2rem 1rem 0.2rem 0'>{item}</Tag>
          ))}
        </Box>
        <Box>
          {res["languages"].length!=0 ? <Text>Знание языков: </Text> : <></>}
          {res["languages"].map((item) => (
            <Tag key={item} margin='0.2rem 1rem 0.2rem 0'>{item}</Tag>
          ))}
        </Box>
      </CardBody>
    </Card>
  ));

  return (
    <>
      <Flex align='baseline'>
        <Text fontSize='5xl' paddingRight='5rem'>hh_parser</Text>
        <ChakraLink as={ReactRouterLink} to='/' fontSize='2xl' paddingRight='5rem'>Вакансии</ChakraLink>
        <ChakraLink as={ReactRouterLink} to='/resumes' fontSize='2xl' paddingRight='5rem'><Text color='blue.600' as='ins'>Резюме</Text></ChakraLink>
      </Flex>
      <Flex align='center'>
        <Image src={arrow} boxSize='1rem' margin='1rem 0 0 2rem'/>
        <ChakraLink as={ReactRouterLink} to='/resumes/data' fontSize='l' marginTop='1rem'>База данныx по резюме</ChakraLink>
      </Flex>
      <Flex>
        <Flex direction='column' w="50vw">
          <Flex direction='column' align='flex-start'>
            <Input placeholder='Поиск по резюме' margin='1rem 0' onChange={e => setText(e.target.value)} onKeyDown={handleKeyDown}/>
          </Flex>
          <Flex direction='column'>
            {resumesCards}
          </Flex>
          {resumes.length!=0 ? 
          <Button marginBottom='1rem' onClick={addResumes}>Найти ещё</Button>
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
                <Button size='sm' onClick={updateResumes}>Показать результаты</Button>
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
          Найденные резюме загружены в базу данныx!
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
  
export {Resumes};