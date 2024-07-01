import { useState } from 'react';
import { Flex, Input, Text, Link as ChakraLink, Card, CardHeader, CardBody, Image, Tag, Alert, AlertIcon, Button, Box, CircularProgress} from '@chakra-ui/react'
import { Link as ReactRouterLink } from 'react-router-dom'
import arrow from '../assets/arrow.svg'

function Resumes() {
  const [text, setText] = useState('')
  const [prevText, setPrevText] = useState('')
  const [resumes, setResumes] = useState([])
  const [stat, setStat] = useState('')
  const [count, setCount] = useState(0)
  const [prog, setProg] = useState(false);
  
  function getResumes(count) {
    fetch("http://127.0.0.1:8000/resumes?text="+text+"&count="+count, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (prevText == text) {
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
        console.log(data)
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
      getResumes(0);
    }
  };

  function addResumes() {
    setProg(true);
    setCount(count+1)
    getResumes(count+1);
  }

  const resumesCards = resumes.map((res) => (
    <Card align='flex-start' w='100%' marginBottom='1rem' key={res['id']}>
      <CardHeader paddingBottom='0.5rem'>
        <ChakraLink href={'https://hh.ru/resumes/'+res["id"]} isExternal><Text fontSize='2xl'>{res["name"]}</Text></ChakraLink>
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
      <Flex direction='column' w="50vw">
        <Flex direction='column' align='flex-start'>
          <Flex align='center'>
            <Image src={arrow} boxSize='1rem' margin='1rem 0 0 2rem'/>
            <ChakraLink as={ReactRouterLink} to='/resumes/data' fontSize='l' marginTop='1rem'>База данныx по резюме</ChakraLink>
          </Flex>
          <Input placeholder='Поиск по резюме' margin='1rem 0' onChange={e => setText(e.target.value)} onKeyDown={handleKeyDown}/>
        </Flex>
        <Flex direction='column'>
          {resumesCards}
        </Flex>
        {resumes.length!=0 ? 
        <Button marginBottom='1rem' onClick={addResumes}>Загрузить ещё</Button>
        : 
        <></>
        }
      </Flex>
      {prog ?
        <CircularProgress isIndeterminate marginBottom='1rem' zIndex={2} pos="fixed" right='2rem' top='2rem'/>
      :
      stat=='success' ? 
        <Alert status='success' zIndex={2} pos="fixed" w='28vw' right='2rem' top='2rem'>
          <AlertIcon />
          Найденные резюме загружены в базу данныx!
        </Alert>
      :
      stat=="error" ?
        <Alert status='error' zIndex={2} pos="fixed" w='28vw' right='2rem' top='2rem'>
          <AlertIcon />
          При обработке вашего запроса произошла ошибка!
        </Alert>
      :
      stat=="nothing" ?
        <Alert status='info' zIndex={2} pos="fixed" w='28vw' right='2rem' top='2rem'>
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