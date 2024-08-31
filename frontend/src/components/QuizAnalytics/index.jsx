import React, {useState, useEffect} from 'react'
import ClipLoader from 'react-spinners/ClipLoader';
import axios from 'axios'
import './index.css'

function QuizAnalytics({showCreateQuiz, handleCreateQuiz}) {

  const url = 'https://quizzie-backend-app-q8fu.onrender.com/api'
  const token = JSON.parse(localStorage.getItem('authToken'))
  const quizId = localStorage.getItem('quizId1')

  const [analytics, setAnalytics] = useState([])
  const [loading, setLoading] = useState(true)

  const handleAnalytics = async () => {
    const reqUrl = `${url}/quiz/getanalytics/${quizId}`
    const response = await axios.get(reqUrl, {
      headers: {
        'token': `${token['token']}`
      }
    })
    if(response.data){
      setLoading(false)
      setAnalytics(response.data)
    }
  }

  useEffect(() => {
    handleAnalytics()
    if(showCreateQuiz){
      handleCreateQuiz()
    }
  }, [])

  return (
    <>
      {analytics && !loading ? 
      <div className='quizan-container'>
        <div className='top-div-quizan'>
          <h1 className='top-head1-quizan'><span className='top-head2-quizan'>{analytics.quizTitle}</span> Question Analysis</h1>
          <div className='top-grid-quizan'>
            <p className='top-create1-quizan'>Created on : <span className='top-create2-quizan'>{analytics.quizCreation}</span></p>
            <p className='top-impr1-quizan'>Impressions : <span className='top-impr2-quizan'>{analytics.Impressions}</span></p>
          </div>
        </div>
        {!loading && 
          <div className='main-container-quizan'>
            {analytics.analytics.map((each, index) => {
            return (
              <div key={index} className='main-div-quizan'>
                <h3 className='main-para1-quizan'>Q.<span className='main-para2-quizan'>{index+1}</span> Question place holder for analysis ? </h3>
                {analytics.quizType === 'qna' ?  
                <div className='ques-div-quizan'>
                  <div className='main1-grid-quizan'>
                    <div className='att-div-quizan'>
                      <h3 className='att-no-quizan'>{each.attempts}</h3>
                      <h3 className='att-para-quizan'>people Attempted the question</h3>
                    </div>
                    <div className='corr-div-quizan'>
                      <h3 className='corr-no-quizan'>{each.correctCount}</h3>
                      <h3 className='corr-para-quizan'>people Answered Correctly</h3>
                    </div>
                    <div className='inco-div-quizan'>
                      <h3 className='inco-no-quizan'>{each.incorrectCount}</h3>
                      <h3 className='inco-para-quizan'>people Answered Incorrectly</h3>
                    </div>
                  </div> 
                  <p className='ques-null-quizan'></p>
                </div> :
                <div className='opt-div-quizan'>
                  <div className='main2-grid-quizan'>
                    {each.options.map((opt, index) => {
                      return (
                        <div className='opt-grid-quizan' key={index}>
                          <h3 className='opt-no-quizan'>{opt.selectedCount}</h3>
                          <h4 className='opt-para1-quizan'>{opt.text}</h4>
                        </div>)
                    })}
                  </div>
                  <p className='opt-null-quizan'></p>
                </div>}
              </div>)
            })}
          </div>}
      </div> : <div style={{position: 'relative', left: '30vw', top: '30vh'}}>
        <ClipLoader color={"#36D7B7"} loading={loading} size={150} />
      </div>}
    </>
  )
}

export default QuizAnalytics
