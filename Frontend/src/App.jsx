import { useState } from 'react'
import { Vacancies } from './pages/Vacancies';
import { ChakraProvider } from '@chakra-ui/react'
import { Routes, Route } from 'react-router-dom';
import './App.css'

function App() {
  return (
    <ChakraProvider>
      <Vacancies/>
    </ChakraProvider>
  )
}

export default App