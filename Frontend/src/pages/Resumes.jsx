import { useState } from 'react';
import {
  Flex, Input, Text, Link as ChakraLink, Card, CardHeader, CardBody,
  Checkbox, CheckboxGroup, Stack, Image, Tag, Alert, AlertIcon, Button,
  Box, CircularProgress
} from '@chakra-ui/react';
import { Link as ReactRouterLink } from 'react-router-dom';
import arrow from '../assets/arrow.svg';

const EMPLOYMENT_OPTIONS = [
  'Полная занятость',
  'Частичная занятость',
  'Стажировка',
  'Проектная работа',
  'Волонтерство'
];

const SCHEDULE_OPTIONS = [
  'Полный день',
  'Удаленная работа',
  'Сменный график',
  'Гибкий график',
  'Вахтовый метод'
];

function Resumes() {
  const [text, setText] = useState('');
  const [employment, setEmployment] = useState({});
  const [schedule, setSchedule] = useState({});
  const [resumes, setResumes] = useState([]);
  const [stat, setStat] = useState('');
  const [count, setCount] = useState(0);
  const [prog, setProg] = useState(false);

  function buildQuery() {
    const params = new URLSearchParams({ text, count });

    const emp = Object.entries(employment)
      .filter(([, value]) => value)
      .map(([key]) => key)
      .join('');
    if (emp) params.append('employment', emp);

    const sch = Object.entries(schedule)
      .filter(([, value]) => value)
      .map(([key]) => key)
      .join('');
    if (sch) params.append('schedule', sch);

    return `http://127.0.0.1:8000/resumes?${params.toString()}`;
  }

  function getResumes(countValue, append) {
    fetch(buildQuery(), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) throw new Error('Invalid response');

        setResumes((prev) => append ? [...prev, ...data] : data);
        setStat(data.length === 0 ? 'nothing' : 'success');
        setProg(false);
      })
      .catch((error) => {
        console.error(error);
        setStat('error');
        setProg(false);
      });
  }

  function updateResumes() {
    setProg(true);
    setCount(0);
    getResumes(0, false);
  }

  function addResumes() {
    const newCount = count + 1;
    setProg(true);
    setCount(newCount);
    getResumes(newCount, true);
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.target.blur();
      updateResumes();
    }
  };

  const toggleEmployment = (index) => {
    setEmployment(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleSchedule = (index) => {
    setSchedule(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const ResumeCard = ({ res }) => (
    <Card align="flex-start" w="100%" marginBottom="1rem" key={res.id}>
      <CardHeader paddingBottom="0.5rem">
        <ChakraLink href={`https://hh.ru/resume/${res.id}`} isExternal>
          <Text fontSize="2xl" textAlign="left">{res.name}</Text>
        </ChakraLink>
      </CardHeader>
      <CardBody textAlign="start" paddingTop="0">
        <Text as="b">{res.salary}</Text>
        <Text>{res.gender}</Text>
        <Text>{res.age}</Text>
        <Text>Опыт работы: {res.experience}</Text>
        <Text>{res.employment?.[0]?.toUpperCase() + res.employment?.slice(1)}</Text>
        <Text>{res.schedule?.[0]?.toUpperCase() + res.schedule?.slice(1)}</Text>
        {res.skills.length > 0 && (
          <Box>
            <Text>Навыки:</Text>
            {res.skills.map((skill) => (
              <Tag key={skill} margin="0.2rem 1rem 0.2rem 0">{skill}</Tag>
            ))}
          </Box>
        )}
        {res.languages.length > 0 && (
          <Box>
            <Text>Знание языков:</Text>
            {res.languages.map((lang) => (
              <Tag key={lang} margin="0.2rem 1rem 0.2rem 0">{lang}</Tag>
            ))}
          </Box>
        )}
      </CardBody>
    </Card>
  );

  return (
    <>
      <Flex align="baseline">
        <Text fontSize="5xl" paddingRight="5rem">hh_parser</Text>
        <ChakraLink as={ReactRouterLink} to="/" fontSize="2xl" paddingRight="5rem">Вакансии</ChakraLink>
        <ChakraLink as={ReactRouterLink} to="/resumes" fontSize="2xl" paddingRight="5rem">
          <Text color="blue.600" as="ins">Резюме</Text>
        </ChakraLink>
      </Flex>

      <Flex align="center">
        <Image src={arrow} boxSize="1rem" margin="1rem 0 0 2rem" />
        <ChakraLink as={ReactRouterLink} to="/resumes/data" fontSize="l" marginTop="1rem">
          База данныx по резюме
        </ChakraLink>
      </Flex>

      <Flex>
        <Flex direction="column" w="50vw">
          <Flex direction="column" align="flex-start">
            <Input
              placeholder="Поиск по резюме"
              margin="1rem 0"
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </Flex>
          <Flex direction="column">
            {resumes.map((res) => <ResumeCard key={res.id} res={res} />)}
          </Flex>
          {resumes.length > 0 && (
            <Button marginBottom="1rem" onClick={addResumes}>Найти ещё</Button>
          )}
        </Flex>

        <Flex w="30vw" direction="column" justify="flex-start" padding="0 2rem" marginTop="1rem">
          <Card>
            <CardHeader>
              <Text fontSize="xl" align="left">Фильтры</Text>
            </CardHeader>
            <CardBody textAlign="start" paddingTop="0">
              <Text>Занятость</Text>
              <CheckboxGroup>
                <Stack marginLeft="1rem" marginBottom="1rem">
                  {EMPLOYMENT_OPTIONS.map((label, index) => (
                    <Checkbox key={index} size="sm" onChange={() => toggleEmployment(index.toString())}>
                      {label}
                    </Checkbox>
                  ))}
                </Stack>
              </CheckboxGroup>
              <Text>График</Text>
              <CheckboxGroup>
                <Stack marginLeft="1rem" marginBottom="1rem">
                  {SCHEDULE_OPTIONS.map((label, index) => (
                    <Checkbox key={index} size="sm" onChange={() => toggleSchedule(index.toString())}>
                      {label}
                    </Checkbox>
                  ))}
                </Stack>
              </CheckboxGroup>
              <Flex>
                <Button size="sm" onClick={updateResumes}>Показать результаты</Button>
              </Flex>
            </CardBody>
          </Card>
        </Flex>
      </Flex>

      {prog && (
        <CircularProgress isIndeterminate marginBottom="1rem" zIndex={2} pos="fixed" right="2rem" top="2rem" />
      )}
      {stat === 'success' && (
        <Alert status="success" zIndex={2} pos="fixed" w="auto" right="2rem" top="2rem">
          <AlertIcon />
          Найденные резюме загружены в базу данныx!
        </Alert>
      )}
      {stat === 'error' && (
        <Alert status="error" zIndex={2} pos="fixed" w="auto" right="2rem" top="2rem">
          <AlertIcon />
          При обработке вашего запроса произошла ошибка!
        </Alert>
      )}
      {stat === 'nothing' && (
        <Alert status="info" zIndex={2} pos="fixed" w="auto" right="2rem" top="2rem">
          <AlertIcon />
          По вашему запросу ничего не найдено!
        </Alert>
      )}
    </>
  );
}

export { Resumes };
