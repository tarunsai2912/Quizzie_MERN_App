import React, {useState, useEffect} from 'react'
import axios from 'axios';
import ClipLoader from 'react-spinners/ClipLoader';
import './index.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import crossBtn from '../../assets/cross.png'

function UpdateQuiz({handleAnalytics}) {

  const url = 'https://quizzie-backend-app-q8fu.onrender.com/api'
  const token = JSON.parse(localStorage.getItem('authToken'))
  const quizId = localStorage.getItem('quizId2')
  const [isContinue, setIsContinue] = useState(false)
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isSuccess, setIsSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const [bgColor1, setBgColor1] = useState('#FFFFFF');
  const [bgColor2, setBgColor2] = useState('#60B84B');
  const [bgColor6, setBgColor6] = useState('#60B84B');
  const [color1, setColor1] = useState('#9F9F9F');
  const [color2, setColor2] = useState('#FFFFFF');
  const [color6, setColor6] = useState('#FFFFFF');


  const handleFetchQuiz = async () => {
    setLoading(true)
    const reqUrl = `${url}/quiz/each/${quizId}`
    const response = await axios.get(reqUrl)
    if(response.data){
        setQuiz(response.data.quiz)
        setLoading(false)
    }
    else{
        setLoading(false)
    }
  }

  useEffect(() => {
    handleFetchQuiz()
  }, []);

  const handleContinue = () => {
    setIsContinue(true)
    setCurrentQuestion(0)
  }

  const handleOptionChangeText = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[questionIndex].options[optionIndex].text = value;
    setQuiz({...quiz,
        questions: updatedQuestions
    });
  };

  const handleOptionChangeImage = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[questionIndex].options[optionIndex].imageUrl = value;
    setQuiz({...quiz,
        questions: updatedQuestions
    });
  };
  
  const handleClickOff = (index) => {
    const updatedQuestions = [...quiz.questions]
    updatedQuestions[index].timer = 0
    setQuiz({...quiz,
        questions: updatedQuestions
    })
  }

  const handleClick5sec = (index) => {
    const updatedQuestions = [...quiz.questions]
    updatedQuestions[index].timer = 5
    setQuiz({...quiz,
        questions: updatedQuestions
    })
  }

  const handleClick10sec = (index) => {
    const updatedQuestions = [...quiz.questions]
    updatedQuestions[index].timer = 10
    setQuiz({...quiz,
        questions: updatedQuestions
    })
  }

  const handleUpdateQuiz = async () => {
    setLoading(true)
    const reqUrl = `${url}/quiz/edit/${quizId}`
    const response = await axios.put(reqUrl, quiz, {
        headers: {
          'token': `${token['token']}`
        }
    })
    if(response.data){
        setLoading(false)
        setIsSuccess(true)
    }
    else{
        setLoading(false)
    }
  }

  const copyToClipboard = (link) => {
    navigator.clipboard.writeText(link).then(() => {
      toast.success('Link copied to Clipboard', {
        position: 'bottom-center',
        style: {
          bottom: '65vh',
          left: '14vw',
        },
        autoClose: 2000
      })
    }).catch(err => {
      toast.error('Failed to copy link!', {
        position: 'bottom-center',
        style: {
          bottom: '65vh',
          left: '14vw',
        },
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
      {quiz &&
        <div className='update-quiz-container'>
            <ToastContainer />
            {!loading ? <>
            {!isContinue && !isSuccess && 
                <div className='top-div-updatequiz'>
                <input className='title-inp-updatequiz' type='text' name='title' value={quiz.title} readOnly></input>
                <div className='quiztype-div-updatequiz'>
                    <h3 className='quiztype-head-updatequiz'>Quiz Type</h3>
                    <button className='qna-btn-updatequiz' style={{backgroundColor: quiz.quizType === 'qna' ? bgColor2 : bgColor1, color: quiz.quizType === 'qna' ? color2 : color1}} disabled >Q & A</button>
                    <button className='poll-btn-updatequiz' style={{backgroundColor: quiz.quizType === 'poll' ? bgColor2 : bgColor1, color: quiz.quizType === 'poll' ? color2 : color1}} disabled >Poll Type</button>
                </div>
                <div className='next-div-updatequiz'>
                    <button className='cncl-btn-updatequiz' onClick={handleAnalytics}>Cancel</button>
                    <button className='next-btn-updatequiz' onClick={handleContinue}>Continue</button>
                </div>
                </div>
            }
            {isContinue && !isSuccess && 
                <div className='update-ques-container'>
                    <div className='no-div-updateques'>
                        <div className='quest-arr-updateques'>
                            {Array(quiz.questions.length).fill(null).map((_, i) => (<div key={i} className='quest-div-updateques'>
                                <button className='ques-no-updateques' onClick={() => setCurrentQuestion(i)}>{i + 1}</button>
                            </div>))}
                        </div>
                        <h3 className='ques-para-updateques'>Max 5 questions</h3>
                    </div>
                    <div className='top-div-updateques'>
                        {quiz.questions.map((question, questionIndex) => {
                        return (
                        <div key={questionIndex}>
                            {currentQuestion === questionIndex ? <div className='quesf-div-updateques'>
                                <input className='ques-name-updateques' type='text' value={question.questionText}
                                    onChange={(e) => {
                                        const updatedQuestions = [...quiz.questions];
                                        updatedQuestions[questionIndex].questionText = e.target.value;
                                        setQuiz({...quiz,
                                            question: updatedQuestions
                                        });
                                    }} 
                                    placeholder='Poll Question'>
                                </input>
                                <div className='opt-div-updateques'>
                                    <p className='opt-para-updateques'>Option Type
                                        <span className='opt-sel-updateques'>
                                            <div>
                                                <input type='radio' id='text' name="optionType" checked={question.questionType === 'text'} readOnly ></input>
                                                <label className='opt-txt-updateques' for="text">Text</label>
                                            </div>
                                            <div>
                                                <input type='radio' id='image' name="optionType" checked={question.questionType === 'image'} readOnly ></input>
                                                <label className='opt-img-updateques' for="image">Image URL</label>
                                            </div>
                                            <div>
                                                <input type='radio' id='text-image' name="optionType" checked={question.questionType === 'text-image'} readOnly ></input>
                                                <label className='opt-txtimg-updateques' for="text-image">Text & Image URL</label>
                                            </div>
                                        </span>
                                    </p>
                                </div>
                                <div className='optinp-div1-updateques'>
                                    {question.questionType === 'text' && question.options.map((option, oIndex) => (
                                        <div className='optinp-div2-updateques' key={oIndex}>
                                            {quiz.quizType === 'qna' ? <input className='optinp-sel-updateques' type='radio' name='option' checked={question.correctOption === oIndex} readOnly ></input> : <div className='null-div-updateques'></div>}
                                            <div className='optinp-para-updateques'>
                                                {oIndex === question.correctOption && quiz.quizType === 'qna' ? 
                                                <input className='optinp-inp1-updateques' type="text" value={option.text} style={{backgroundColor: bgColor6, color: color6}} placeholder='Text' onChange={(e) => handleOptionChangeText(questionIndex, oIndex, e.target.value)} /> : 
                                                <input className='optinp-inp1-updateques' type="text" value={option.text} placeholder='Text' style={{backgroundColor: "#FFFFFF", color: '#9F9F9F'}} onChange={(e) => handleOptionChangeText(questionIndex, oIndex, e.target.value)} />}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className='optinp-div1-updateques'>
                                    {question.questionType === 'image' && question.options.map((option, oIndex) => (
                                        <div className='optinp-div2-updateques' key={oIndex}>
                                            {quiz.quizType === 'qna' ? <input className='optinp-sel-updateques' type='radio' name='option' checked={question.correctOption === oIndex} readOnly ></input> : <div className='null-div-updateques'></div>}
                                            <div className='optinp-para-updateques'>
                                                {oIndex === question.correctOption && quiz.quizType === 'qna' ? 
                                                <input className='optinp-inp2-updateques' type="text" value={option.imageUrl} style={{backgroundColor: bgColor6, color: color6}} placeholder='Image URL' onChange={(e) => handleOptionChangeImage(questionIndex, oIndex, e.target.value)} /> : 
                                                <input className='optinp-inp2-updateques' type="text" value={option.imageUrl} placeholder='Image URL' style={{backgroundColor: "#FFFFFF", color: '#9F9F9F'}} onChange={(e) => handleOptionChangeImage(questionIndex, oIndex, e.target.value)} />}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className='optinp-div1-updateques'>
                                    {question.questionType === 'text-image' && question.options.map((option, oIndex) => (
                                        <div className='optinp-div2-updateques' key={oIndex}>
                                            {quiz.quizType === 'qna' ? <input className='optinp-sel-updateques' type='radio' name='option' checked={question.correctOption === oIndex} readOnly ></input> : <div className='null-div-updateques'></div>}
                                            <div className='optinp-para-updateques'>
                                                {oIndex === question.correctOption && quiz.quizType === 'qna' ? 
                                                <input className='optinp-inp3-updateques' type="text" value={option.text} style={{backgroundColor: bgColor6, color: color6}} placeholder='Text' onChange={(e) => handleOptionChangeText(questionIndex, oIndex, e.target.value)} /> : 
                                                <input className='optinp-inp3-updateques' type="text" placeholder='Text' value={option.text} style={{backgroundColor: "#FFFFFF", color: '#9F9F9F'}} onChange={(e) => handleOptionChangeText(questionIndex, oIndex, e.target.value)} />}
                                                {oIndex === question.correctOption && quiz.quizType === 'qna' ? 
                                                <input className='optinp-inp4-updateques' type="text" placeholder='image URL' style={{backgroundColor: bgColor6, color: color6}} value={option.imageUrl} onChange={(e) => handleOptionChangeImage(questionIndex, oIndex, e.target.value)} /> : 
                                                <input className='optinp-inp4-updateques' type="text" placeholder='image URL' value={option.imageUrl} style={{backgroundColor: "#FFFFFF", color: '#9F9F9F'}} onChange={(e) => handleOptionChangeImage(questionIndex, oIndex, e.target.value)} />}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div> : 
                            <div className='quesf1-div-updateques'>
                            </div>}
                            {questionIndex === currentQuestion ? 
                                <div className='tim-div-updateques'>
                                    <p className='tim-para-updateques'>Timer</p>
                                    <button className='tim-off-updateques' 
                                        onClick={() => handleClickOff(currentQuestion)} style={{backgroundColor: question.timer === 0 ? '#D60000' : '#FFFFFF', color: question.timer === 0 ? '#FFFFFF' : '#9F9F9F'}}>OFF</button>
                                    <button className='tim-5sec-updateques'
                                        onClick={() => handleClick5sec(currentQuestion)} style={{backgroundColor: question.timer === 5 ? '#D60000' : '#FFFFFF', color: question.timer === 5 ? '#FFFFFF' : '#9F9F9F'}}>5 sec</button>
                                    <button className='tim-10sec-updateques'
                                        onClick={() => handleClick10sec(currentQuestion)} style={{backgroundColor: question.timer === 10 ? '#D60000' : '#FFFFFF', color: question.timer === 10 ? '#FFFFFF' : '#9F9F9F'}}>10 sec</button>
                                </div> : 
                                <div className='tim1-div-updateques'></div>}
                        </div>)
                    })}
                    </div>
                    <div className='foot-div-updateques'>
                        <button className='foot-cncl-updateques' onClick={handleAnalytics}>Cancel</button>
                        <button className='foot-crt-updateques' onClick={handleUpdateQuiz}>Update Quiz</button>
                    </div>
                </div>
            }
            </> : <div style={{position: 'relative', left: '30vw', top: '30vh'}}>
                <ClipLoader color={"#36D7B7"} loading={loading} size={150} />
            </div>}
            {isSuccess && <div className='success-container-updateques'>
                <img className='success-close-updateques' src={crossBtn} alt='cross' width='30vw' height='30vh' onClick={handleAnalytics}></img>
                <div className='success-div-updateques'>
                    <h1 className='success-head-updateques'>Congrats your Quiz is Published!</h1>
                    <input className='link-inp-updateques' type='text' value={`https://quizzie-frontend-sandy.vercel.app/${quizId}/attempt`}></input>
                    <button className='share-btn-updateques' onClick={() => handleShare(quizId)}>Share</button>
                </div>
            </div>}
        </div>}
    </>
  )
}

export default UpdateQuiz
