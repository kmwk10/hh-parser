import { useState } from 'react'
import { Vacancies } from './pages/Vacancies'
import { Resumes } from './pages/Resumes'
import { VacanciesData } from './pages/VacanciesData'
import { ResumesData } from './pages/ResumesData'
import { ChakraProvider } from '@chakra-ui/react'
import { Routes, Route } from 'react-router-dom'
import './App.css'

function App() {
  return (
    <ChakraProvider>
      <Routes>
        <Route index element={<Vacancies />} /> 
        <Route exact path="resumes" element={<Resumes />} />
        <Route exact path="data" element={<VacanciesData />} /> 
        <Route exact path="resumes/data" element={<ResumesData />} /> 
      </Routes>
    </ChakraProvider>
  )
}

export default App;