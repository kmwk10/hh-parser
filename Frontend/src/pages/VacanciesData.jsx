import { Flex, Input, Text, Link as ChakraLink, Card, CardHeader, CardBody, Checkbox, CheckboxGroup, Stack, Button, Image, Tag, CircularProgress, Alert, AlertIcon} from '@chakra-ui/react';
import { Link as ReactRouterLink } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import arrow from '../assets/arrow.svg';

const employmentOptions = [
  { label: 'Полная занятость', value: '0' },
  { label: 'Частичная занятость', value: '1' },
  { label: 'Стажировка', value: '2' },
  { label: 'Проектная работа', value: '3' },
  { label: 'Волонтерство', value: '4' }
];

const scheduleOptions = [
  { label: 'Полный день', value: '0' },
  { label: 'Удаленная работа', value: '1' },
  { label: 'Сменный график', value: '2' },
  { label: 'Гибкий график', value: '3' },
  { label: 'Вахтовый метод', value: '4' }
];

function VacanciesData() {
  const [name, setName] = useState('');
  const [area, setArea] = useState('');
  const [employment, setEmployment] = useState({ "0": false, "1": false, "2": false, "3": false, "4": false });
  const [schedule, setSchedule] = useState({ "0": false, "1": false, "2": false, "3": false, "4": false });
  const [vacData, setVacData] = useState([]);
  const [prog, setProg] = useState(false);
  const [stat, setStat] = useState('');

  const buildQuery = useCallback(() => {
    const params = new URLSearchParams();

    if (name) params.append('name', name);
    if (area) params.append('area', area);
    
    Object.keys(employment).forEach(key => {
      if (employment[key]) params.append('employment', key);
    });

    Object.keys(schedule).forEach(key => {
      if (schedule[key]) params.append('schedule', key);
    });

    return `http://127.0.0.1:8000/vacancies/data?${params.toString()}`;
  }, [name, area, employment, schedule]);

  const getVacanciesData = useCallback(() => {
    setProg(true);
    const url = buildQuery();
    
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json;charset=utf-8' } })
      .then(response => response.json())
      .then(data => {
        setVacData(data);
        setStat(data.length === 0 ? 'nothing' : 'success');
        setProg(false);
      })
      .catch(error => {
        console.error(error);
        setStat('error');
        setProg(false);
      });
  }, [buildQuery]);

  useEffect(() => {
    getVacanciesData();
  }, [getVacanciesData]);

  const updateEmployment = (value) => {
    setEmployment(prev => ({ ...prev, [value]: !prev[value] }));
  };

  const updateSchedule = (value) => {
    setSchedule(prev => ({ ...prev, [value]: !prev[value] }));
  };

  const vacDataCards = vacData.map((vac) => (
    <Card align='flex-start' w='100%' marginBottom='1rem' key={vac["id"]}>
      <CardHeader paddingBottom='0.5rem'>
        <ChakraLink href={`https://hh.ru/vacancy/${vac["id"]}`} isExternal>
          <Text fontSize='2xl'>{vac["name"]}</Text>
        </ChakraLink>
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
        <ChakraLink as={ReactRouterLink} to='/' fontSize='2xl' paddingRight='5rem'>
          <Text color='blue.600' as='ins'>Вакансии</Text>
        </ChakraLink>
        <ChakraLink as={ReactRouterLink} to='/resumes' fontSize='2xl' paddingRight='5rem'>Резюме</ChakraLink>
      </Flex>
      <Flex align='center' marginTop='1rem'>
        <Image src={arrow} boxSize='1rem' marginLeft='2rem'/>
        <ChakraLink as={ReactRouterLink} to='/' fontSize='l'>Поиск по вакансиям</ChakraLink>
      </Flex>
      <Flex margin='1rem 0'>
        <Flex direction='column' w="50vw">
          {vacDataCards}
        </Flex>
        <Flex w='30vw' direction='column' justify='flex-start' padding='0 2rem'>
          <Card>
            <CardHeader>
              <Text fontSize='xl' align='left'>Фильтры</Text>
            </CardHeader>
            <CardBody textAlign='start' paddingTop='0'>
              <Text>Должность</Text>
              <Input marginBottom='1rem' placeholder='Введите должность' size='sm' onChange={e => setName(e.target.value)}/>
              <Text>Регион</Text>
              <Input marginBottom='1rem' placeholder='Введите регион' size='sm' onChange={e => setArea(e.target.value)}/>
              <Text>Занятость</Text>
              <CheckboxGroup>
                <Stack marginLeft='1rem' marginBottom="1rem">
                  {employmentOptions.map(opt => (
                    <Checkbox key={opt.value} size='sm' onChange={() => updateEmployment(opt.value)}>{opt.label}</Checkbox>
                  ))}
                </Stack>
              </CheckboxGroup>
              <Text>График</Text>
              <CheckboxGroup>
                <Stack marginLeft='1rem' marginBottom="1rem">
                  {scheduleOptions.map(opt => (
                    <Checkbox key={opt.value} size='sm' onChange={() => updateSchedule(opt.value)}>{opt.label}</Checkbox>
                  ))}
                </Stack>
              </CheckboxGroup>
              <Flex>
                <Button size='sm' onClick={getVacanciesData}>Показать результаты</Button>
              </Flex>
            </CardBody>
          </Card>
        </Flex>
      </Flex>
      {prog ? (
        <CircularProgress isIndeterminate marginBottom='1rem' zIndex={2} pos="fixed" right='2rem' top='2rem'/>
      ) : stat === 'success' ? (
        <Alert status='success' zIndex={2} pos="fixed" w='auto' right='2rem' top='2rem'>
          <AlertIcon />
          В базе данных найдено {vacData.length} вакансий!
        </Alert>
      ) : stat === 'error' ? (
        <Alert status='error' zIndex={2} pos="fixed" w='auto' right='2rem' top='2rem'>
          <AlertIcon />
          При обработке вашего запроса произошла ошибка!
        </Alert>
      ) : stat === 'nothing' ? (
        <Alert status='info' zIndex={2} pos="fixed" w='auto' right='2rem' top='2rem'>
          <AlertIcon />
          По вашему запросу ничего не найдено!
        </Alert>
      ) : null}
    </>
  );
}

export { VacanciesData };
