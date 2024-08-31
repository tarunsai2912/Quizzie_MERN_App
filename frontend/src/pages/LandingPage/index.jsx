import React, {useState} from 'react'
import './index.css'
import Login from '../../components/Login'
import Register from '../../components/Register'

function LandingPage() {

  const [isClickedReg, setIsClickedReg] = useState(false);
  const [isClickedLog, setIsClickedLog] = useState(true);

  const [showLogin, setShowLogin] = useState(true)
  const [showRegister, setShowRegister] = useState(false)

  const handleLogin = () => {
    setShowLogin(true)
    setIsClickedLog(true)
    setShowRegister(false)
    setIsClickedReg(false)
  }

  const handleRegister = () => {
    setShowRegister(true)
    setIsClickedReg(true)
    setShowLogin(false)
    setIsClickedLog(false)
  }

  const buttonStyleReg = {
    boxShadow: isClickedReg ? '0px 0px 50px 0px #0019FF3D' : '',
    borderRadius: isClickedReg ? '10px' : '0px',
  }

  const buttonStyleLog = {
    boxShadow: isClickedLog ? '0px 0px 50px 0px #0019FF3D' : '',
    borderRadius: isClickedLog ? '10px' : '0px',
  }

  return (
    <div className='land-container'>
      <div className='grid1-land'>
        <h1 className='head-land'>QUIZZIE</h1>
        <div className='head-para-land'>
          <span className='signup-para-land' onClick={handleRegister} style={buttonStyleReg}>Sign Up</span>
          <span className='login-para-land' onClick={handleLogin} style={buttonStyleLog}>Log In</span>
        </div>
      </div>
      <div className='grid2-land'>
        {showLogin && <Login />}
        {showRegister && <Register handleLogin={handleLogin} />}
      </div>
    </div>
  )
}

export default LandingPage
