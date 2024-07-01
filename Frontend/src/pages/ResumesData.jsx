import { Flex, Input, Text, Link as ChakraLink, Card, CardHeader, CardBody, Radio, RadioGroup, Stack, Button, Image, Box, Tag, CircularProgress, Alert, AlertIcon} from '@chakra-ui/react'
import { Link as ReactRouterLink } from 'react-router-dom'
import { useState } from 'react'
import arrow from '../assets/arrow.svg'

function ResumesData() {
  const [name, setName] = useState('')
  const [gender, setGender] = useState('')
  const [employment, setEmployment] = useState('')
  const [schedule, setSchedule] = useState('')
  const [skills, setSkills] = useState('')
  const [resData, setResData] = useState([])
  const [prog, setProg] = useState(false)
  const [stat, setStat] = useState('')

  function getResumesData() {
    setProg(true);
    let url = "http://127.0.0.1:8000/resumes/data?"
    if (name.length !=0) {
      url += "name="+name+'&'
    }
    if (gender.length !=0) {
      url += "gender="+gender+'&'
    }
    if (employment.length !=0) {
      url += "employment="+employment+'&'
    }
    if (schedule.length !=0) {
      url += "schedule="+schedule+'&'
    }
    if (skills.length !=0) {
      url += "skills="+skills+'&'
    }
    fetch(url, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setResData(data);
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

  const resDataCards = resData.map((res) => (
    <Card align='flex-start' w='100%' marginBottom='1rem' key={res[0]}>
      <CardHeader paddingBottom='0.5rem'>
        <ChakraLink href={'https://hh.ru/resume/'+res[0]} isExternal><Text fontSize='2xl'>{res[1]}</Text></ChakraLink>
      </CardHeader>
      <CardBody textAlign='start' paddingTop='0'>
        <Text as='b'>{res[4]}</Text>
        <Text>{res[2]}</Text>
        <Text>{res[3]}</Text>
        <Text>Опыт работы: {res[7]}</Text>
        <Text>{res[5][0].toUpperCase() + res[5].slice(1)}</Text>
        <Text>{res[6][0].toUpperCase() + res[6].slice(1)}</Text>
        <Box>
          {res[8].length!=0 ? <Text>Навыки: </Text> : <></>}
          {res[8].map((item) => (
            <Tag key={item} margin='0.2rem 1rem 0.2rem 0'>{item}</Tag>
          ))}
        </Box>
        <Box>
          {res[9].length!=0 ? <Text>Знание языков: </Text> : <></>}
          {res[9].map((item) => (
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
      <Flex align='center' marginTop='1rem'>
        <Image src={arrow} boxSize='1rem' marginLeft='2rem'/>
        <ChakraLink as={ReactRouterLink} to='/resumes' fontSize='l'>Поиск по резюме</ChakraLink>
      </Flex>
      <Flex margin='1rem 0'>
        <Flex direction='column' w="50vw">
          {resDataCards}
        </Flex>
        <Flex w='30vw' direction='column' justify='flex-start' padding='0 2rem'>
          <Card>
            <CardHeader>
              <Text fontSize='xl' align='left'>Фильтры</Text>
            </CardHeader>
            <CardBody textAlign='start' paddingTop='0'>
              <Text>Должность</Text>
              <Input marginBottom='1rem' placeholder='Введите должность' size='sm' onChange={e => setName(e.target.value)}/>
              <Text>Пол</Text>
              <RadioGroup onChange={setGender} value={gender}>
                <Stack marginLeft='1rem'>
                  <Radio size='sm' value='0'>Мужчина</Radio>
                  <Radio size='sm' value='1'>Женщина</Radio>
                </Stack>
              </RadioGroup>
              <Button size='xs' onClick={() => setGender("")} margin='0.5rem 0 1rem 2rem'>Сбросить</Button>
              <Text>Занятость</Text>
              <RadioGroup onChange={setEmployment} value={employment}>
                <Stack marginLeft='1rem'>
                  <Radio size='sm' value='0'>Полная занятость</Radio>
                  <Radio size='sm' value='1'>Частичная занятость</Radio>
                  <Radio size='sm' value='2'>Стажировка</Radio>
                  <Radio size='sm' value='3'>Проектная работа</Radio>
                  <Radio size='sm' value='4'>Волонтерство</Radio>
                </Stack>
              </RadioGroup>
              <Button size='xs' onClick={() => setEmployment("")} margin='0.5rem 0 1rem 2rem'>Сбросить</Button>
              <Text>График</Text>
              <RadioGroup onChange={setSchedule} value={schedule}>
                <Stack marginLeft='1rem'>
                  <Radio size='sm' value='0'>Полный день</Radio>
                  <Radio size='sm' value='1'>Удаленная работа</Radio>
                  <Radio size='sm' value='2'>Сменный график</Radio>
                  <Radio size='sm' value='3'>Гибкий график</Radio>
                  <Radio size='sm' value='4'>Вахтовый метод</Radio>
                </Stack>
              </RadioGroup>
              <Button size='xs' onClick={() => setSchedule("")} margin='0.5rem 0 1rem 2rem'>Сбросить</Button>
              <Text>Навыки</Text>
              <Input marginBottom='1rem' placeholder='Введите навыки через запятую'size='sm' onChange={e => setSkills(e.target.value)}/>
              <Flex>
                <Button size='sm' onClick={getResumesData}>Показать результаты</Button>
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
          В базе данных найдено {resData.length} резюме!
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
  
export {ResumesData}