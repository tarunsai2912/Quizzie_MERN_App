import React, {useState, useEffect} from 'react'
import axios from 'axios'
import './index.css'
import editBtn from '../../assets/edit.png'
import shareBtn from '../../assets/share.png'
import ClipLoader from 'react-spinners/ClipLoader';
import deleteBtn from '../../assets/delete.png'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UpdateQuiz from '../UpdateQuiz';
import CreateQuiz from '../CreateQuiz'

function Analytics({showCreateQuiz, showUpdateQuiz, isDelete, setIsDelete, handleCreateQuiz, handleUpdateQuiz, handleQuizAnalytics}) {

  const url = 'https://quizzie-mern-backend.vercel.app/api'
  const token = JSON.parse(localStorage.getItem('authToken'))
  const [quizData, setQuizData] = useState([])
  const [loading, setLoading] = useState(false)
  const [Id, setId] = useState('')

  const handleQuiz = async () => {
    setLoading(true)
    const reqUrl = `${url}/quiz/all`
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

  const handleDelete = async (id) => {
    setLoading(true)
    const reqUrl = `${url}/quiz/delete/${id}`
    const response = await axios.delete(reqUrl, {
      headers: {
        'token': `${token['token']}`
      }
    })
    if(response.data){
      setLoading(false)
      setIsDelete(false)
      setQuizData(response.data.quizzes)
    }
    else{
      setLoading(false)
      setIsDelete(false)
    }
  }

  const handleDeleteCheck = (id) => {
    setIsDelete(true)
    setId(id)
  }

  const handleQuestionDetails = (id) => {
    localStorage.setItem('quizId1', id)
    handleQuizAnalytics()
  }

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

  const handleEdit = (id) => {
    <UpdateQuiz />
    localStorage.setItem('quizId2', id)
    handleUpdateQuiz()
  }

  const handleShare = (id) => {
    const link = `https://quizzie-mern-frontend.vercel.app/${id}/attempt`
    copyToClipboard(link)
  }

  useEffect(() => {
    handleQuiz()
    if(showCreateQuiz){
      <CreateQuiz />
      handleCreateQuiz()
    }
  }, [])

  return (
    <>
    <ToastContainer />
    {quizData && !loading ?
    <div className='analy-container' style={{opacity: isDelete || showUpdateQuiz || showCreateQuiz ? '0.8' : '1', backgroundColor: isDelete || showUpdateQuiz || showCreateQuiz ? '#000000CF' : ''}}>
      <h1 className='head-analy' style={{opacity: isDelete || showUpdateQuiz || showCreateQuiz ? '0.1' : '1'}}>Quiz Analysis</h1>
      <table className='tab-analy' style={{opacity: isDelete || showUpdateQuiz || showCreateQuiz ? '0.1' : '1'}}>
        <thead>
        <tr className='tabh-div-analy'>
          <th className='tabh1-analy'>S.No</th>
          <th className='tabh2-analy'>Quiz Name</th>
          <th className='tabh3-analy'>Created on</th>
          <th className='tabh4-analy'>Impression</th>
          <th className='tabh5-analy'></th>
          <th className='tabh6-analy'></th>
        </tr>
        </thead>
        {quizData.map((each, index) => {
          return (
          <tbody key={each._id}>
          <tr className='tabd-div-analy' style={{backgroundColor: Number(index)%2 == 0 ? '#EDEDED' : '#B3C4FF'}}>
            <td className='tabd1-analy'>{index+1}</td>
            <td className='tabd2-analy'>{each.title}</td>
            <td className='tabd3-analy'>{each.createdAt}</td>
            <td className='tabd4-analy'>{each.quizImpressions}</td>
            <td className='tabd5-analy'>
              <img src={editBtn} alt='edit' style={{cursor: 'pointer'}} onClick={() => handleEdit(each._id)}></img>
              <img src={deleteBtn} alt='delete' style={{cursor: 'pointer'}} onClick={() => handleDeleteCheck(each._id)}></img>
              <img src={shareBtn} alt='share' style={{cursor: 'pointer'}} onClick={() => handleShare(each._id)}></img>
            </td>
            <td className='tabd6-analy' onClick={() => handleQuestionDetails(each._id)}>Question Wise Analysis</td>
          </tr>
          </tbody>
          )
        })}
      </table>
    </div> : <div style={{position: 'relative', left: '30vw', top: '30vh'}}>
        <ClipLoader color={"#36D7B7"} loading={loading} size={150} />
      </div>}
    {isDelete && 
      <div className='del-div-analy'>
        <p className='del-para-analy'>Are you confirm you want to delete ?</p>
        <div className='del-grid-analy'>
          <button className='del-btn-analy' onClick={() => handleDelete(Id)}>Confirm Delete</button>
          <button className='del-cncl-analy' onClick={() => setIsDelete(false)}>Cancel</button>
      </div>
    </div>}
    </>
  )
}

export default Analytics
