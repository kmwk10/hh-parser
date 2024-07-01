import { useEffect, useState } from 'react';
import { Flex, Input, Text, Link as ChakraLink, Card, CardHeader, CardBody, Image, Tag, Alert, AlertIcon, Button, CircularProgress} from '@chakra-ui/react'
import { Link as ReactRouterLink } from 'react-router-dom'
import arrow from '../assets/arrow.svg'

function Vacancies() {
  const [text, setText] = useState('')
  const [prevText, setPrevText] = useState('')
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

  function getVacancies(count) {
    fetch("http://127.0.0.1:8000/vacancies?text="+text+"&count="+count, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (prevText == text) {
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
    setPrevText(text);
  }

  const handleKeyDown = event => {
    if (event.key === 'Enter') {
      setProg(true);
      setCount(0);
      getVacancies(0);
    }
  };

  function addVacancies() {
    setProg(true);
    setCount(count+1)
    getVacancies(count+1);
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
      <Flex direction='column' w="50vw">
        <Flex direction='column' align='flex-start'>
          <Flex align='center'>
            <Image src={arrow} boxSize='1rem' margin='1rem 0 0 2rem'/>
            <ChakraLink as={ReactRouterLink} to='/data' fontSize='l' marginTop='1rem'>База данныx по вакансиям</ChakraLink>
          </Flex>
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