import React, {useState, useEffect} from 'react'
import axios from 'axios'
import './index.css'
import eye from '../../assets/eye.png'
import ClipLoader from "react-spinners/ClipLoader";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Dashboard() {

  const url = 'https://quizzie-mern-backend.vercel.app/api'
  const userId = JSON.parse(localStorage.getItem('userId'))
  const token = JSON.parse(localStorage.getItem('authToken'))
  const [totalQuizzes, setTotalQuizzes] = useState('') 
  const [totalQuestions, setTotalQuestions] = useState('') 
  const [totalImpressions, setTotalImpressions] = useState('') 
  const [loading, setLoading] = useState(false)
  const [reqData, setReqData] = useState(false)
  const [quizData, setQuizData] = useState([])

  const handleUser = async () => {
    setLoading(true)
    const reqUrl = `${url}/user/get/${userId['userId']}`
    const response = await axios.get(reqUrl, {
      headers: {
        'token': `${token['token']}`
      }
    })
    if(response.data){
      setLoading(false)
      setReqData(true)
      setTotalQuizzes(response.data.quizzes)
      setTotalQuestions(response.data.questions)
      if(response.data.impressions >= 1000){
        const impr = Number(response.data.impressions)/1000
        setTotalImpressions(`${impr}K`)
      }
      else{
        setTotalImpressions(response.data.impressions)
      }
    }
    else{
      setLoading(false)
      setTotalQuizzes(0)
      setTotalQuestions(0)
      setTotalImpressions(0)
    }
  }

  const handleQuiz = async () => {
    setLoading(true)
    const reqUrl = `${url}/quiz/all/trending`
    const response = await axios.get(reqUrl, {
      headers: {
        'token': `${token['token']}`
      }
    })
    if(response.data){
      setLoading(false)
      setQuizData(response.data)
    }
    else{
      setLoading(false)
    }
  }

  useEffect(() => {
    handleQuiz()
    handleUser()
  }, [])

  const copyToClipboard = (link) => {
    navigator.clipboard.writeText(link).then(() => {
      toast.success('Link copied to Clipboard', {
        position: 'top-right',
        autoClose: 2000
      })
    }).catch(err => {
      toast.error('Failed to copy link!', {
        position: 'top-right',
        autoClose: 2000
      });
      console.error('Failed to copy: ', err);
    });
  };

  const handleShare = (id) => {
    const link = `https://quizzie-frontend-sandy.vercel.app/${id}/attempt`
    copyToClipboard(link)
  }

  return (
    <>
      <ToastContainer />
      {reqData && !loading ? (
      <div className='dash-container'>
        <div className='top-div-dash'>
          <div className='quiz-div-dash'>
            <p className='quiz-no-dash'>{totalQuizzes}<span className='quiz-para1-dash'>Quiz</span></p>
            <p className='quiz-para2-dash'>Created</p>
          </div>
          <div className='ques-div-dash'>
            <p className='ques-no-dash'>{totalQuestions}<span className='ques-para1-dash'>questions</span></p>
            <p className='ques-para2-dash'>Created</p>
          </div>
          <div className='impr-div-dash'>
            <p className='impr-no-dash'>{totalImpressions}<span className='impr-para1-dash'>Total</span></p>
            <p className='impr-para2-dash'>Impressions</p>
          </div>
        </div>
        <div className='foot-div-dash'>
          <h1 className='foot-head-dash'>Trending Quizs</h1>
          <div className='quiz-array-dash'>
          {quizData.map((each) => {
            return(<div key={each._id} className='quizs-div-dash' onClick={() => handleShare(each._id)}>
              <h1 className='quizs-title-dash'>{each.title}</h1>
              <img className='quizs-img-dash' src={eye} alt='eye'></img>
              <p className='quizs-impr-dash'>{each.quizImpressions}</p>
              <p className='quizs-para-dash'>Created on : <span className='quizs-name-dash'>{each.createdAt}</span></p>
            </div>)
          })}
          </div>
        </div>
      </div>
      ) : <div style={{position: 'relative', left: '30vw', top: '30vh'}}>
        <ClipLoader color={"#36D7B7"} loading={loading} size={150} />
      </div>}
    </>
  )
}

export default Dashboard
