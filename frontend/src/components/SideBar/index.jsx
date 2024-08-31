import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom'
import './index.css'

function SideBar({isDelete, showUpdateQuiz, showQuizAnalytics, showAnalytics, showCreateQuiz, handleDashboard, handleAnalytics, handleCreateQuiz}) {

  const [isClickedDash, setIsClickedDash] = useState(true)
  const [isClickedAnaly, setIsClickedAnaly] = useState(false)
  const [isClickedCreate, setIsClickedCreate] = useState(false)

  const navigate = useNavigate()

  const handleDash = () => {
    setIsClickedDash(true)
    setIsClickedAnaly(false)
    setIsClickedCreate(false)
  }

  const handleAnaly = () => {
    setIsClickedDash(false)
    setIsClickedAnaly(true)
    setIsClickedCreate(false)
  }

  const handleCreate = () => {
    setIsClickedDash(false)
    setIsClickedAnaly(false)
    setIsClickedCreate(true)
  }

  const handleDashClick = () => {
    handleDashboard()
    handleDash()
  }

  const handleAnalyClick = () => {
    handleAnalytics()
    handleAnaly()
  }

  const handleCreateClick = () => {
    handleCreate()
    handleCreateQuiz()
  }

  const handleLogout = () => {
    localStorage.clear()
    navigate('/')
  }

  const buttonStyleDash = {
    borderRadius: isClickedDash ? '10px' : '',
    boxShadow: isClickedDash ? '0px 0px 14px 0px #0000001F' : ''
  }

  const buttonStyleAnaly = {
    borderRadius: isClickedAnaly || showAnalytics || showQuizAnalytics || showUpdateQuiz ? '10px' : '',
    boxShadow: isClickedAnaly || showAnalytics || showQuizAnalytics || showUpdateQuiz ? '0px 0px 14px 0px #0000001F' : ''
  }

  const buttonStyleCreate = {
    borderRadius: isClickedCreate && !showAnalytics && !showQuizAnalytics && !showUpdateQuiz ? '10px' : '',
    boxShadow: isClickedCreate && !showAnalytics && !showQuizAnalytics && !showUpdateQuiz ? '0px 0px 14px 0px #0000001F' : ''
  }

  return (
    <div className='sidebar-container' style={{backgroundColor: isDelete || showCreateQuiz || showUpdateQuiz ? '#000000CF' : '#FFFFFF', opacity: isDelete || showCreateQuiz || showUpdateQuiz ? '0.9' : '1'}}>
      <div className='head-div-sidebar'>
        <h1 className='head-sidebar' onClick={handleDashClick}>QUIZZIE</h1>
      </div>
      <div className='mid-div-sidebar'>
        <div className='dash-sidebar' style={buttonStyleDash} onClick={handleDashClick}>Dashboard</div>
        <div className='analy-sidebar' style={buttonStyleAnaly} onClick={handleAnalyClick}>Analytics</div>
        <div className='create-sidebar' style={buttonStyleCreate} onClick={handleCreateClick}>Create Quiz</div>
      </div>
      <div className='foot-div-sidebar'>
        <div className='line-sidebar'></div>
        <p className='logout-sidebar' onClick={handleLogout}>LOGOUT</p>
      </div>
    </div>
  )
}

export default SideBar
