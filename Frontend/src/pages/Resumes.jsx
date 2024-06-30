import { Flex, Input, Text, Link as ChakraLink, Card, CardHeader, CardBody, Image} from '@chakra-ui/react'
import { Link as ReactRouterLink } from 'react-router-dom'
import arrow from '../assets/arrow.svg'

function Resumes() {
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
            <Image src={arrow} boxSize='1rem' margin='2rem 0 0 2rem'/>
            <ChakraLink as={ReactRouterLink} to='/resumes/data' fontSize='l' marginTop='2rem'>База данныx по резюме</ChakraLink>
          </Flex>
          <Input placeholder='Поиск по вакансиям' margin='1rem 0'/>
        </Flex>
        <Flex>
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
      </>
    )
}
  
export {Resumes};