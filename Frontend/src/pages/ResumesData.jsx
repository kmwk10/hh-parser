import { Flex, Input, Text, Link as ChakraLink, Card, CardHeader, CardBody, Radio, RadioGroup, Checkbox, CheckboxGroup, Stack, Button, Image, Box, Tag, CircularProgress, Alert, AlertIcon} from '@chakra-ui/react'
import { Link as ReactRouterLink } from 'react-router-dom'
import { useState, useEffect } from 'react'
import arrow from '../assets/arrow.svg'

function ResumesData() {
  const [name, setName] = useState('')
  const [gender, setGender] = useState('')
  const [employment, setEmployment] = useState({"0": false, "1": false, "2": false, "3": false, "4": false})
  const [schedule, setSchedule] = useState({"0": false, "1": false, "2": false, "3": false, "4": false})
  const [skills, setSkills] = useState('')
  const [resData, setResData] = useState([])
  const [prog, setProg] = useState(false)
  const [stat, setStat] = useState('')

  const buildQuery = () => {
    let url = "http://127.0.0.1:8000/resumes/data?";
    const params = new URLSearchParams();

    if (name) params.append('name', name);
    if (gender) params.append('gender', gender);

    const empFilter = Object.keys(employment).filter(key => employment[key]).join('');
    if (empFilter) params.append('employment', empFilter);

    const schFilter = Object.keys(schedule).filter(key => schedule[key]).join('');
    if (schFilter) params.append('schedule', schFilter);

    if (skills) params.append('skills', skills);

    return url + params.toString();
  };

  function getResumesData() {
    setProg(true);
    fetch(buildQuery(), {
      method: "GET",
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setResData(data);
        setStat(data.length === 0 ? 'nothing' : 'success');
        setProg(false);
      })
      .catch((error) => {
        console.log(error);
        setStat('error');
        setProg(false);
      });
  }

  useEffect(() => {
    getResumesData();
  }, []);

  function updateEmployment(value) {
    setEmployment(prev => ({ ...prev, [value]: !prev[value] }));
  }

  function updateSchedule(value) {
    setSchedule(prev => ({ ...prev, [value]: !prev[value] }));
  }

  const resDataCards = resData.map((res) => (
    <Card align='flex-start' w='100%' marginBottom='1rem' key={res['id']}>
      <CardHeader paddingBottom='0.5rem'>
        <ChakraLink href={'https://hh.ru/resume/' + res['id']} isExternal>
          <Text fontSize='2xl'>{res["name"]}</Text>
        </ChakraLink>
      </CardHeader>
      <CardBody textAlign='start' paddingTop='0'>
        <Text as='b'>{res["salary"]}</Text>
        <Text>{res["gender"]}</Text>
        <Text>{res["age"]}</Text>
        <Text>Опыт работы: {res["experience"]}</Text>
        <Text>{res["employment"][0].toUpperCase() + res["employment"].slice(1)}</Text>
        <Text>{res["schedule"][0].toUpperCase() + res["schedule"].slice(1)}</Text>
        <Box>
          {res["skills"].length ? <Text>Навыки: </Text> : null}
          {res["skills"].map((item) => (
            <Tag key={item} margin='0.2rem 1rem 0.2rem 0'>{item}</Tag>
          ))}
        </Box>
        <Box>
          {res["languages"].length ? <Text>Знание языков: </Text> : null}
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
              <Text>Навыки</Text>
              <Input marginBottom='1rem' placeholder='Введите навыки через запятую' size='sm' onChange={e => setSkills(e.target.value)}/>
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
      stat === 'success' ? 
        <Alert status='success' zIndex={2} pos="fixed" w='auto' right='2rem' top='2rem'>
          <AlertIcon />
          В базе данных найдено {resData.length} резюме!
        </Alert>
      :
      stat === "error" ? 
        <Alert status='error' zIndex={2} pos="fixed" w='auto' right='2rem' top='2rem'>
          <AlertIcon />
          При обработке вашего запроса произошла ошибка!
        </Alert>
      :
      stat === "nothing" ? 
        <Alert status='info' zIndex={2} pos="fixed" w='auto' right='2rem' top='2rem'>
          <AlertIcon />
          По вашему запросу ничего не найдено!
        </Alert>
      :
        <></>
      }
    </>
  );
}

export { ResumesData }
