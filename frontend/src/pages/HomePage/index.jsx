import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import SideBar from '../../components/SideBar'
import Dashboard from '../../components/Dashboard'
import Analytics from '../../components/Analytics'
import CreateQuiz from '../../components/CreateQuiz'
import QuizAnalytics from '../../components/QuizAnalytics'
import UpdateQuiz from '../../components/UpdateQuiz'
import './index.css'

function HomePage() {

  const [showDashboard, setShowDashboard] = useState(true)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [showCreateQuiz, setShowCreateQuiz] = useState(false)
  const [isDelete, setIsDelete] = useState(false)
  const [showQuizAnalytics, setShowQuizAnalytics] = useState(false)
  const [showUpdateQuiz, setShowUpdateQuiz] = useState(false)
  const [isToken, setIsToken] = useState(false)

  const token = JSON.parse(localStorage.getItem('authToken'))
  const navigate = useNavigate()

  const handleDashboard = () => {
    setShowDashboard(true)
    setShowAnalytics(false)
    setShowCreateQuiz(false)
    setShowQuizAnalytics(false)
    setShowUpdateQuiz(false)
  }

  const handleAnalytics = () => {
    setShowAnalytics(true)
    setShowDashboard(false)
    setShowCreateQuiz(false)
    setShowQuizAnalytics(false)
    setShowUpdateQuiz(false)
  }

  const handleCreateQuiz = () => {
    setShowCreateQuiz(true)
    setShowAnalytics(true)
    setShowDashboard(false)
    setShowQuizAnalytics(false)
    setShowUpdateQuiz(false)
  }

  const handleQuizAnalytics = () => {
    setShowCreateQuiz(false)
    setShowAnalytics(false)
    setShowDashboard(false)
    setShowQuizAnalytics(true)
  }

  const handleUpdateQuiz = () => {
    setShowCreateQuiz(false)
    setShowDashboard(false)
    setShowQuizAnalytics(false)
    setShowUpdateQuiz(true)
  }

  const tokenCheck = () => {
    if(token['token']){
      setIsToken(true)
    }
    else{
      navigate('/')
    }
  }

  useEffect(() => {
    tokenCheck()
  }, [])

  return (
    <>
      {isToken && 
      <div className='home-container'>
        <div className='grid1-home'>
          <SideBar isDelete={isDelete} showUpdateQuiz={showUpdateQuiz} showQuizAnalytics={showQuizAnalytics} showAnalytics={showAnalytics} showCreateQuiz={showCreateQuiz} handleDashboard={handleDashboard} handleAnalytics={handleAnalytics} handleCreateQuiz={handleCreateQuiz} />
        </div>
        <div className='grid2-home'>
          {showDashboard && <Dashboard />}
          {showAnalytics && <Analytics showCreateQuiz={showCreateQuiz} showUpdateQuiz={showUpdateQuiz} isDelete={isDelete} setIsDelete={setIsDelete} handleCreateQuiz={handleCreateQuiz} handleUpdateQuiz={handleUpdateQuiz} handleQuizAnalytics={handleQuizAnalytics} />}
          {showQuizAnalytics && <QuizAnalytics showCreateQuiz={showCreateQuiz} handleCreateQuiz={handleCreateQuiz} />}
          {showUpdateQuiz && <UpdateQuiz handleAnalytics={handleAnalytics} />}
          {showCreateQuiz && <CreateQuiz handleAnalytics={handleAnalytics} />}
        </div>
      </div>}
    </>
  )
}

export default HomePage
