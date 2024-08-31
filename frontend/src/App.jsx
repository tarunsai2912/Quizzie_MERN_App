import React from 'react'
import './App.css'
import LandingPage from './pages/LandingPage'
import HomePage from './pages/HomePage'
import AttemptQuiz from './pages/AttemptQuiz'
import {Routes, Route} from 'react-router-dom'

function App() {
  return (
    <div className='app'>
      <Routes>
        <Route path='/home' element={<HomePage />}></Route>
        <Route path='/' element={<LandingPage />}></Route>
        <Route path='/:id/attempt' element={<AttemptQuiz />}></Route>
      </Routes>
    </div>
  )
}

export default App
