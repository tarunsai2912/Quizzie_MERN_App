const express = require('express')
const router = express.Router()
const quizController = require('../controllers/quizController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/create', authMiddleware, quizController.createQuiz)
router.get('/all', authMiddleware, quizController.getAllQuizzes)
router.get('/each/:quizId', quizController.getQuizById)
router.delete('/delete/:quizId', authMiddleware, quizController.deleteQuizById)
router.get('/getanalytics/:quizId', authMiddleware, quizController.getQuizAnalytics)
router.put('/edit/:quizId', authMiddleware, quizController.updateQuiz)
router.post('/:id/attempt', quizController.attemptQuiz)
router.get('/all/trending', authMiddleware, quizController.getTrendingQuizzes)

module.exports = router


