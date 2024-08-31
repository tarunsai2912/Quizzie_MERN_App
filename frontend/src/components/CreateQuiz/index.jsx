import React, {useState} from 'react'
import plusBtn from '../../assets/plus.png'
import deleteBtn from '../../assets/delete.png'
import crossBtn from '../../assets/cross.png'
import axios from 'axios';
import ClipLoader from 'react-spinners/ClipLoader';
import './index.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CreateQuiz({handleAnalytics}) {

  const url = 'https://quizzie-mern-backend.vercel.app/api'
  const token = JSON.parse(localStorage.getItem('authToken'))
  const [loading, setLoading] = useState(false)
  const [isContinue, setIsContinue] = useState(false)
  const [bgColor1, setBgColor1] = useState('#FFFFFF');
  const [bgColor2, setBgColor2] = useState('#FFFFFF');
  const [bgColor6, setBgColor6] = useState('#60B84B');
  const [color1, setColor1] = useState('#9F9F9F');
  const [color2, setColor2] = useState('#9F9F9F');
  const [color6, setColor6] = useState('#FFFFFF');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [startIndex, setStartIndex] = useState(0)
  const [isSuccess, setIsSuccess] = useState('')
  const [quizId, setQuizId] = useState('')

  const [title, setTitle] = useState('');
  const [quizType, setQuizType] = useState('');
  const [questions, setQuestions] = useState([
    { questionText: '', questionType: 'text', options: [{ text: '' , imageUrl: ''}, { text: '' , imageUrl: ''}], correctOption: null, timer: 0 },    
  ])

  const handleClickQna = () => {
    setQuizType('qna')
    setBgColor1(bgColor1 === '#FFFFFF' ? '#60B84B' : '#FFFFFF');
    setBgColor2('#FFFFFF')
    setColor1(color1 === '#9F9F9F' ? '#FFFFFF' : '9F9F9F')
    setColor2('#9F9F9F')
  }

  const handleClickPoll = () => {
    setQuizType('poll')
    setBgColor2(bgColor2 === '#FFFFFF' ? '#60B84B' : '#FFFFFF');
    setBgColor1('#FFFFFF')
    setColor2(color2 === '#9F9F9F' ? '#FFFFFF' : '9F9F9F')
    setColor1('#9F9F9F')
  }

  const handleClickOff = (index) => {
    const updatedQuestions = [...questions]
    updatedQuestions[index].timer = 0
    setQuestions(updatedQuestions)
  }

  const handleClick5sec = (index) => {
    const updatedQuestions = [...questions]
    updatedQuestions[index].timer = 5
    setQuestions(updatedQuestions)
  }

  const handleClick10sec = (index) => {
    const updatedQuestions = [...questions]
    updatedQuestions[index].timer = 10
    setQuestions(updatedQuestions)
  }

  const handleAddQuestion = () => {
    if (questions.length < 5) {
      setStartIndex(startIndex+1)
      setQuestions([...questions, { questionText: '', questionType: 'text', options: [{ text: '' , imageUrl: ''}, { text: '' , imageUrl: ''}], correctOption: null, timer : 0 }]);
    }
  }

  const handleRemoveQuestion = (index) => {
    if (questions.length > 1) {
      setStartIndex(startIndex-1)
      setQuestions(questions.filter((_, i) => i !== index));
      setCurrentQuestion(0);
    }
  };

  const handleOptionChangeText = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex].text = value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChangeImage = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex].imageUrl = value;
    setQuestions(updatedQuestions);
  };

  const handleAddOption = (questionIndex) => {
    const updatedQuestions = [...questions];
    if (updatedQuestions[questionIndex].options.length < 5) {
      updatedQuestions[questionIndex].options.push({ text: '' , imageUrl: ''});
      setQuestions(updatedQuestions);
    }
  };

  const handleRemoveOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...questions];
    if (updatedQuestions[questionIndex].options.length > 2) {
      updatedQuestions[questionIndex].options = updatedQuestions[questionIndex].options.filter((_, i) => i !== optionIndex);
      setQuestions(updatedQuestions);
    }
  };

  const handleContinue = () => {
    setIsContinue(true)
    setCurrentQuestion(0)
  }

  const handleCreateQuiz = async () => {
    setLoading(true)
    const reqUrl = `${url}/quiz/create`
    const response = await axios.post(reqUrl, {title: title, quizType: quizType, questions}, {
      headers: {
        'token': `${token['token']}`
      }
    });
    if(response.data){
      setLoading(false)
      setQuizId(response.data.quiz_Id)
      setIsSuccess(true)
    }
    else{
      setLoading(false)
    }
  };

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
    const link = `https://quizzie-mern-frontend.vercel.app/${id}/attempt`
    copyToClipboard(link)
  }

  return (
    <div className='create-quiz-container'>
      <ToastContainer />
      {!loading ? <>
      {!isContinue && !isSuccess && <div className='top-div-createquiz'>
        <input className='title-inp-createquiz' type='text' name='title' value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Quiz name'></input>
        <div className='quiztype-div-createquiz'>
          <h3 className='quiztype-head-createquiz'>Quiz Type</h3>
          <button className='qna-btn-createquiz' onClick={handleClickQna} style={{backgroundColor: bgColor1, color: color1}}>Q & A</button>
          <button className='poll-btn-createquiz'  onClick={handleClickPoll} style={{backgroundColor: bgColor2, color: color2}}>Poll Type</button>
        </div>
        <div className='next-div-createquiz'>
          <button className='cncl-btn-createquiz' onClick={handleAnalytics}>Cancel</button>
          <button className='next-btn-createquiz' onClick={handleContinue}>Continue</button>
        </div>
      </div>}
      {isContinue && !isSuccess && <div className='create-ques-container'>
        <div className='no-div-createques'>
          <div className='quest-arr-createques'>
            {Array(startIndex+1).fill(null).map((_, i) => (<div key={i} className='quest-div-createques'>
              <button className='ques-no-createques' onClick={() => setCurrentQuestion(i)}>{i + 1}</button>
              {i !== 0 && <img className='ques-del-createques' src={crossBtn} alt='cross' width='15vw' height='18vh' onClick={() => handleRemoveQuestion(i)}></img>}
            </div>))}
            {questions.length < 5 && <img className='ques-add-createques' src={plusBtn} alt='plus' width='30vw' height='30vh' onClick={handleAddQuestion}></img>}
          </div>
          <h3 className='ques-para-createques'>Max 5 questions</h3>
        </div>
        <div className='top-div-createques'>
        {questions.map((question, questionIndex) => {
          return (
          <div key={questionIndex}>
            {currentQuestion === questionIndex ? <div className='quesf-div-createques'>
              <input className='ques-name-createques' 
                type='text' 
                value={question.questionText} 
                onChange={(e) => {
                  const updatedQuestions = [...questions];
                  updatedQuestions[questionIndex].questionText = e.target.value;
                  setQuestions(updatedQuestions);
                }} 
                placeholder='Poll Question'>
              </input>
              <div className='opt-div-createques'>
                <p className='opt-para-createques'>Option Type
                  <span className='opt-sel-createques'>
                    <div>
                      <input type='radio' id='text' name="optionType" value="text" checked={question.questionType === 'text'}
                        onClick={(e) => {
                          const updatedQuestions = [...questions]
                          updatedQuestions[questionIndex].questionType = e.target.value
                          setQuestions(updatedQuestions)
                      }}></input>
                      <label className='opt-txt-createques' for="text">Text</label>
                    </div>
                    <div>
                      <input type='radio' id='image' name="optionType" value="image" checked={question.questionType === 'image'}
                        onClick={(e) => {
                          const updatedQuestions = [...questions]
                          updatedQuestions[questionIndex].questionType = e.target.value
                          setQuestions(updatedQuestions)
                      }}></input>
                      <label className='opt-img-createques' for="image">Image URL</label>
                    </div>
                    <div>
                      <input type='radio' id='text-image' name="optionType" value="text-image" checked={question.questionType === 'text-image'}
                        onClick={(e) => {
                          const updatedQuestions = [...questions]
                          updatedQuestions[questionIndex].questionType = e.target.value
                          setQuestions(updatedQuestions)
                      }}></input>
                      <label className='opt-txtimg-createques' for="text-image">Text & Image URL</label>
                    </div>
                  </span>
                </p>
              </div>
              <div className='optinp-div1-createques'>
                {question.questionType === 'text' && question.options.map((option, oIndex) => (
                  <div className='optinp-div2-createques' key={oIndex}>
                    {quizType === 'qna' ? <input className='optinp-sel-createques' type='radio' name='option' value={oIndex} checked={question.correctOption === oIndex}
                      onClick={() => {
                        const updatedQuestions = [...questions]
                        updatedQuestions[questionIndex].correctOption = oIndex
                        setQuestions(updatedQuestions)
                    }}></input> : <div className='null-div-createques'></div>}
                    <div className='optinp-para-createques'>
                      {oIndex === question.correctOption && quizType === 'qna' ? 
                      <input className='optinp-inp1-createques' type="text" value={option.text} style={{backgroundColor: bgColor6, color: color6}} placeholder='Text' onChange={(e) => handleOptionChangeText(questionIndex, oIndex, e.target.value)} /> : 
                      <input className='optinp-inp1-createques' type="text" value={option.text} placeholder='Text' style={{backgroundColor: "#FFFFFF", color: '#9F9F9F'}} onChange={(e) => handleOptionChangeText(questionIndex, oIndex, e.target.value)} />}
                      {oIndex > 1 && <img className='optinp-del1-createques' src={deleteBtn} alt='delete' width='15vw' height='18vh' onClick={() => handleRemoveOption(questionIndex, oIndex)}></img>}
                    </div>
                  </div>
                ))}
              </div>
              <div className='optinp-div1-createques'>
                {question.questionType === 'image' && question.options.map((option, oIndex) => (
                  <div className='optinp-div2-createques' key={oIndex}>
                    {quizType === 'qna' ? <input className='optinp-sel-createques' type='radio' name='option' value={oIndex} checked={question.correctOption === oIndex}
                      onClick={() => {
                        const updatedQuestions = [...questions]
                        updatedQuestions[questionIndex].correctOption = oIndex
                        setQuestions(updatedQuestions)
                        setSelectedIndex(oIndex+1)
                    }}></input> : <div className='null-div-createques'></div>}
                    <div className='optinp-para-createques'>
                      {oIndex === question.correctOption && quizType === 'qna' ? 
                      <input className='optinp-inp2-createques' type="text" value={option.imageUrl} style={{backgroundColor: bgColor6, color: color6}} placeholder='Image URL' onChange={(e) => handleOptionChangeImage(questionIndex, oIndex, e.target.value)} /> : 
                      <input className='optinp-inp2-createques' type="text" value={option.imageUrl} placeholder='Image URL' style={{backgroundColor: "#FFFFFF", color: '#9F9F9F'}} onChange={(e) => handleOptionChangeImage(questionIndex, oIndex, e.target.value)} />}
                      {oIndex > 1 && <img className='optinp-del2-createques' src={deleteBtn} alt='delete' width='15vw' height='18vh' onClick={() => handleRemoveOption(questionIndex, oIndex)}></img>}
                    </div>
                  </div>
                ))}
              </div>
              <div className='optinp-div1-createques'>
                {question.questionType === 'text-image' && question.options.map((option, oIndex) => (
                  <div className='optinp-div2-createques' key={oIndex}>
                    {quizType === 'qna' ? <input className='optinp-sel-createques' type='radio' name='option' value={oIndex} checked={question.correctOption === oIndex}
                      onClick={() => {
                        const updatedQuestions = [...questions]
                        updatedQuestions[questionIndex].correctOption = oIndex
                        setQuestions(updatedQuestions)
                        setSelectedIndex(oIndex+1)
                    }}></input> : <div className='null-div-createques'></div>}
                    <div className='optinp-para-createques'>
                      {oIndex === question.correctOption && quizType === 'qna' ? 
                      <input className='optinp-inp3-createques' type="text" value={option.text} style={{backgroundColor: bgColor6, color: color6}} placeholder='Text' onChange={(e) => handleOptionChangeText(questionIndex, oIndex, e.target.value)} /> : 
                      <input className='optinp-inp3-createques' type="text" placeholder='Text' value={option.text} style={{backgroundColor: "#FFFFFF", color: '#9F9F9F'}} onChange={(e) => handleOptionChangeText(questionIndex, oIndex, e.target.value)} />}
                      {oIndex === question.correctOption && quizType === 'qna' ? 
                      <input className='optinp-inp4-createques' type="text" placeholder='image URL' style={{backgroundColor: bgColor6, color: color6}} value={option.imageUrl} onChange={(e) => handleOptionChangeImage(questionIndex, oIndex, e.target.value)} /> : 
                      <input className='optinp-inp4-createques' type="text" placeholder='image URL' value={option.imageUrl} style={{backgroundColor: "#FFFFFF", color: '#9F9F9F'}} onChange={(e) => handleOptionChangeImage(questionIndex, oIndex, e.target.value)} />}
                      {oIndex > 1 && <img className='optinp-del3-createques' src={deleteBtn} alt='delete' width='15vw' height='18vh' onClick={() => handleRemoveOption(questionIndex, oIndex)}></img>}
                    </div>
                  </div>
                ))}
              </div>
              {question.options.length < 4 && <button className='optinp-add-createques' onClick={() => handleAddOption(questionIndex)}>Add Option</button>}
            </div> : <div className='quesf1-div-createques'></div>}
            {questionIndex === currentQuestion ? 
              <div className='tim-div-createques'>
                <p className='tim-para-createques'>Timer</p>
                <button className='tim-off-createques' 
                  onClick={() => handleClickOff(currentQuestion)} style={{backgroundColor: question.timer === 0 ? '#D60000' : '#FFFFFF', color: question.timer === 0 ? '#FFFFFF' : '#9F9F9F'}}>OFF</button>
                <button className='tim-5sec-createques'
                  onClick={() => handleClick5sec(currentQuestion)} style={{backgroundColor: question.timer === 5 ? '#D60000' : '#FFFFFF', color: question.timer === 5 ? '#FFFFFF' : '#9F9F9F'}}>5 sec</button>
                <button className='tim-10sec-createques'
                  onClick={() => handleClick10sec(currentQuestion)} style={{backgroundColor: question.timer === 10 ? '#D60000' : '#FFFFFF', color: question.timer === 10 ? '#FFFFFF' : '#9F9F9F'}}>10 sec</button>
              </div> : 
              <div className='tim1-div-createques'></div>}
          </div>)
        })}
        </div>
        <div className='foot-div-createques'>
          <button className='foot-cncl-createques' onClick={handleAnalytics}>Cancel</button>
          <button className='foot-crt-createques' onClick={handleCreateQuiz}>Create Quiz</button>
        </div>
      </div>}
      </> : <div style={{position: 'relative', left: '30vw', top: '30vh'}}>
        <ClipLoader color={"#36D7B7"} loading={loading} size={150} />
      </div>}
      {isSuccess && <div className='success-container-createquiz'>
        <img className='success-close-createquiz' src={crossBtn} alt='cross' width='30vw' height='30vh' onClick={handleAnalytics}></img>
        <div className='success-div-createquiz'>
          <h1 className='success-head-createquiz'>Congrats your Quiz is Published!</h1>
          <input className='link-inp-createquiz' type='text' value={`https://quizzie-frontend-sandy.vercel.app/${quizId}/attempt`}></input>
          <button className='share-btn-createquiz' onClick={() => handleShare(quizId)}>Share</button>
        </div>
      </div>}
    </div>
  )
}

export default CreateQuiz
