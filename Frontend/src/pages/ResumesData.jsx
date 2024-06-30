import { Flex, Input, Text, Link as ChakraLink, Card, CardHeader, CardBody, Radio, RadioGroup, Stack, Button, Image} from '@chakra-ui/react'
import { Link as ReactRouterLink } from 'react-router-dom'
import { useState } from 'react'
import arrow from '../assets/arrow.svg'

function ResumesData() {
    const [gender, setGender] = useState('')
    const [employment, setEmployment] = useState('')
    const [schedule, setSchedule] = useState('')
    return (
      <>
        <Flex align='baseline'>
          <Text fontSize='5xl' paddingRight='5rem'>hh_parser</Text>
          <ChakraLink as={ReactRouterLink} to='/' fontSize='2xl' paddingRight='5rem'>Вакансии</ChakraLink>
          <ChakraLink as={ReactRouterLink} to='/resumes' fontSize='2xl' paddingRight='5rem'><Text color='blue.600' as='ins'>Резюме</Text></ChakraLink>
        </Flex>
        <Flex align='center' marginTop='2rem'>
          <Image src={arrow} boxSize='1rem' marginLeft='2rem'/>
          <ChakraLink as={ReactRouterLink} to='/resumes' fontSize='l'>Поиск по резюме</ChakraLink>
        </Flex>
        <Flex margin='1rem 0'>
          <Flex direction='column'>
              <Flex w="50vw">
                <Card align='flex-start' w='100%'>
                  <CardHeader>
                    <ChakraLink><Text fontSize='2xl'>Должность</Text></ChakraLink>
                  </CardHeader>
                  <CardBody textAlign='start' paddingTop='0'>
                    <Text>Пол</Text>
                    <Text>Возраст</Text>
                    <Text>Зарплата</Text>
                    <Text>Занятость</Text>
                    <Text>Расписание</Text>
                    <Text>Опыт</Text>
                    <Text>Навыки</Text>
                    <Text>Языки</Text>
                  </CardBody>
                </Card>
              </Flex>
          </Flex>
          <Flex w='30vw' direction='column' justify='flex-start' padding='0 2rem'>
              <Card>
                <CardHeader>
                  <Text fontSize='xl' align='left'>Фильтры</Text>
                </CardHeader>
                <CardBody textAlign='start' paddingTop='0'>
                  <Text>Должность</Text>
                  <Input marginBottom='1rem' placeholder='Введите должность' size='sm'/>
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
                  <Input marginBottom='1rem' placeholder='Введите навыки через запятую'size='sm'/>
                </CardBody>
              </Card>
            </Flex>
        </Flex>
      </>
    )
  }
  
export {ResumesData}