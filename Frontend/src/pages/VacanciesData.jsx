import { Flex, Input, Text, Link as ChakraLink, Card, CardHeader, CardBody, Radio, RadioGroup, Stack, Button, Image} from '@chakra-ui/react'
import { Link as ReactRouterLink } from 'react-router-dom'
import { useState } from 'react'
import arrow from '../assets/arrow.svg'

function VacanciesData() {
    const [employment, setEmployment] = useState('')
    const [schedule, setSchedule] = useState('')
    return (
      <>
        <Flex align='baseline'>
          <Text fontSize='5xl' paddingRight='5rem'>hh_parser</Text>
          <ChakraLink as={ReactRouterLink} to='/' fontSize='2xl' paddingRight='5rem'><Text color='blue.600' as='ins'>Вакансии</Text></ChakraLink>
          <ChakraLink as={ReactRouterLink} to='/resumes' fontSize='2xl' paddingRight='5rem'>Резюме</ChakraLink>
        </Flex>
        <Flex align='center' marginTop='2rem'>
            <Image src={arrow} boxSize='1rem' marginLeft='2rem'/>
            <ChakraLink as={ReactRouterLink} to='/' fontSize='l'>Поиск по вакансиям</ChakraLink>
        </Flex>
        <Flex margin='1rem 0'>
            <Flex>
            <Flex direction='column'>
                <Flex w="50vw">
                    <Card align='flex-start' w='100%'>
                    <CardHeader>
                    <ChakraLink><Text fontSize='2xl'>Должность</Text></ChakraLink>
                    </CardHeader>
                    <CardBody textAlign='start' paddingTop='0'>
                        <Text>Зарплата</Text>
                        <Text>Регион</Text>
                        <Text>Занятость</Text>
                        <Text>Расписание</Text>
                        <Text>Опыт</Text>
                        <Text>Требования</Text>
                        <Text>Работодатель</Text>
                    </CardBody>
                    </Card>
                </Flex>
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
                        <Text>Регион</Text>
                        <Input marginBottom='1rem' placeholder='Введите регион'size='sm'/>
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
                        <Button size='xs' onClick={() => setSchedule("")} margin='0.5rem 0 0 2rem'>Сбросить</Button>
                    </CardBody>
                </Card>
            </Flex>
        </Flex>
      </>
    )
  }
  
export {VacanciesData}