import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useParams } from 'react-router-dom';
import cupImg from '../../assets/cup.png'
import './index.css'

function AttemptQuiz() {

  const { id } = useParams()
  const url = 'https://quizzie-backend-app-q8fu.onrender.com/api'
  const [quiz, setQuiz] = useState(null)
  const [answers, setAnswers] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isSelected, setIsSelected] = useState('')
  const [border1, setBorder1] = useState('')
  const [isSubmit, setIsSubmit] = useState(false)
  const [score, setScore] = useState('')
  const [timeLeft, setTimeLeft] = useState(0);

  const handleClickOption = (index) => {
    handleAnswer(index)
    setIsSelected(index)
    setBorder1('5px solid #5076FF')
  }

  const handleNext = () => {
    setCurrentQuestionIndex(currentQuestionIndex+1)
    setIsSelected('')
    setBorder1('')
  }

  const handleFetchQuiz = async () => {
    const reqUrl = `${url}/quiz/each/${id}`
    const response = await axios.get(reqUrl)
    if(response.data){
      setQuiz(response.data.quiz)
    }
  }

  useEffect(() => {
    handleFetchQuiz()
  }, [])

  const handleAnswer = (optionIndex) => {
    const updatedAnswers = [...answers]
    updatedAnswers[currentQuestionIndex] = optionIndex
    setAnswers(updatedAnswers)
  }

  useEffect(() => {
    if (quiz && quiz.questions[currentQuestionIndex].timer > 0) {
      setTimeLeft(quiz.questions[currentQuestionIndex].timer);
      const interval = setInterval(() => {
          setTimeLeft(prev => prev - 1);
      }, 1000);
      const timeout = setTimeout(() => {
          handleNextQuestion();
      }, quiz.questions[currentQuestionIndex].timer * 1000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [quiz, currentQuestionIndex]);

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
        handleSubmitQuiz();
    }
  };

  const handleSubmitQuiz = async () => {
    const response = await axios.post(`${url}/quiz/${id}/attempt`, {answers})
    if(response.data){
      setIsSubmit(true)
      setScore(response.data.score)
      console.log(`Quiz Completed! Your score is: ${response.data.score}/${quiz.questions.length}`)
    }
  }

  return (
    <div className='attemptquiz-container'>
      {(!isSubmit && quiz) && 
        <div className='attemptquiz-div-container'>
          <div className='top-div-attquiz'>
            <p className='top-para-attquiz'>0{currentQuestionIndex+1}/0{quiz.questions.length}</p>
            {quiz.questions[currentQuestionIndex].timer > 0 && <p className='top-timer-attquiz'>00:{timeLeft}s</p>}
          </div>
          <div className='mid-div-attquiz'>
            <h1 className='mid-head-attquiz'>{quiz.questions[currentQuestionIndex].questionText}</h1>
            {quiz.questions[currentQuestionIndex].questionType === 'text' && <div className='opts-div-attquiz'>
            {quiz.questions[currentQuestionIndex].options.map((opt, oIndex) => {
              return (
                isSelected == oIndex ? <div className='opt-div1-attquiz' key={oIndex} onClick={() => handleClickOption(oIndex)} style={{border: border1}}>
                  {opt.text && <p className='opt-para1-attquiz'>{opt.text}</p>}
                </div> : 
                <div className='opt-div1-attquiz' key={oIndex} onClick={() => handleClickOption(oIndex)}>
                  {opt.text && <p className='opt-para1-attquiz'>{opt.text}</p>}
                </div>
              )
            })}
            </div>}
            {quiz.questions[currentQuestionIndex].questionType === 'image' && <div className='opts-div-attquiz'>
            {quiz.questions[currentQuestionIndex].options.map((opt, oIndex) => {
              return (
                isSelected == oIndex ? <div className='opt-div2-attquiz' key={oIndex} onClick={() => handleClickOption(oIndex)} style={{border: border1}}>
                  {opt.imageUrl && <img className='opt-img1-attquiz' src={opt.imageUrl} alt='image' width='153vw' height='95vh'></img>}
                </div> : 
                <div className='opt-div2-attquiz' key={oIndex} onClick={() => handleClickOption(oIndex)}>
                  {opt.imageUrl && <img className='opt-img1-attquiz' src={opt.imageUrl} alt='image' width='153vw' height='95vh'></img>}
                </div>
              )
            })}
            </div>}
            {quiz.questions[currentQuestionIndex].questionType === 'text-image' && <div className='opts-div-attquiz'>
            {quiz.questions[currentQuestionIndex].options.map((opt, oIndex) => {
              return (
                isSelected == oIndex ? <div className='opt-div3-attquiz' key={oIndex} onClick={() => handleClickOption(oIndex)} style={{border: border1}}>
                  {opt.text && <p className='opt-para2-attquiz'>{opt.text}</p>}
                  {opt.imageUrl && <img className='opt-img2-attquiz' src={opt.imageUrl} alt='image' width='84vw' height='81vh'></img>}
                </div> : 
                <div className='opt-div3-attquiz' key={oIndex} onClick={() => handleClickOption(oIndex)}>
                  {opt.text && <p className='opt-para2-attquiz'>{opt.text}</p>}
                  {opt.imageUrl && <img className='opt-img2-attquiz' src={opt.imageUrl} alt='image' width='84vw' height='81vh'></img>}
                </div>
              )
            })}
            </div>}
          </div>
          <div className='foot-div-attquiz'>
            {currentQuestionIndex + 1 === quiz.questions.length ? <button className='foot-btn-attquiz' onClick={handleSubmitQuiz}>SUBMIT</button> : <button className='foot-btn-attquiz' onClick={handleNext}>NEXT</button>}
          </div>
        </div>}
        {quiz && isSubmit && 
        <div className='submit-container-attquiz'>
          {quiz.quizType === 'qna' ? 
          <div className='div-container1-attquiz'>
            <h3 className='div-para1-attquiz'>Congrats Quiz is completed</h3>
            <img className='div-img-attquiz' src={cupImg} alt='cup'></img>
            <h3 className='div-para2-attquiz'>Your Score is <span className='div-score-attquiz'>0{score}/0{quiz.questions.length}</span></h3>
          </div> : 
          <div className='div-container2-attquiz'>
            <p className='div-para3-attquiz'>Thank you<br></br>
            for participating in the Poll</p>
          </div>}
        </div>}
    </div>
  )
}

export default AttemptQuiz
