import { Flex, Input, Text, Link, Card, CardHeader, CardBody} from '@chakra-ui/react'

function Vacancies() {
    return (
      <>
        <Flex align='baseline'>
          <Text fontSize='5xl' paddingRight='5rem'>hh_parser</Text>
          <Text fontSize='2xl' paddingRight='5rem'>вакансии</Text>
          <Text fontSize='2xl'>резюме</Text>
        </Flex>
        <Flex>
          <Flex direction='column' w="60vw">
            <Input placeholder='Введите название вакансии' margin='2rem 0' />
            <Flex>
                <Card align='flex-start' w='100%'>
                <CardHeader>
                  <Link><Text fontSize='2xl'>Название</Text></Link>
                </CardHeader>
                  <CardBody textAlign='start' paddingTop='0'>
                    <Text>Зарплата</Text>
                    <Text>Опыт</Text>
                    <Text>Место</Text>
                    <Text>Расписание</Text>
                    <Text>Занятость</Text>
                    <Text>Требования</Text>
                  </CardBody>
                </Card>
            </Flex>
          
          </Flex>
          <Flex w='20vw'>
            
          </Flex>
        </Flex>
      </>
    )
  }
  
  export {Vacancies}