const User = require('../models/user')
const Quiz = require('../models/quiz')

const createQuiz = async (req, res, next) => {
    try{
        const {title, quizType, questions} = req.body
        const user = await User.findById(req.user_Id)
        if(!user){
            return res.status(401).json({message: 'User Not Found'})
        }

        const currentDate = new Date();
        const date = currentDate.getDate();
        const monthNames = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul",
            "Aug", "Sept", "Oct", "Nov", "Dec"
        ];
        const month = monthNames[currentDate.getMonth()];
        const year = currentDate.getFullYear();
        const formattedDate = `${date} ${month}, ${year}`;

        const quiz = new Quiz({
            title, quizType, createdAt: formattedDate, questions, userId: user._id
        })
        const newQuiz = await quiz.save()
        const quiz_Id = newQuiz._id

        user.quizId.push(newQuiz)
        user.totalQuizzes++
        user.totalQuestions += quiz.questions.length
        await user.save()

        return res.status(200).json({msg:'Quiz Added Successfully', quiz_Id})
    }
    catch(err){
        return next(err)
    }
}

const getAllQuizzes = async (req, res, next) => {
    try{
        const user = await User.findById(req.user_Id)
        if(!user){
            return res.status(401).json({message: 'User Not Found'})
        }

        const quizzes = await Quiz.find({userId: req.user_Id}).select('title quizImpressions questions createdAt')
        
        return res.status(200).json(quizzes)
    }
    catch(err){
        return next(err)
    }
}

const getTrendingQuizzes = async (req, res, next) => {
    try{
        const user = await User.findById(req.user_Id)
        if(!user){
            return res.status(401).json({message: 'User Not Found'})
        }

        const quizzes = await Quiz.find({userId: req.user_Id, quizImpressions: { $gt: 10 }})
        
        return res.status(200).json(quizzes)
    }
    catch(err){
        return next(err)
    }
}

const getQuizById = async (req, res, next) => {
    try{
        const {quizId} = req.params

        const quiz = await Quiz.findById(quizId)
        if(!quiz){
            return res.status(401).json({message: 'Quiz Not Found'})
        }

        const userId = quiz.userId[0].toString()
        const user = await User.findById(userId)

        if(!user){
            return res.status(401).json({message: 'User Not Found'})
        }

        quiz.quizImpressions++
        user.totalImpressions++

        await user.save()
        await quiz.save()
        return res.status(200).json({quiz})
    }
    catch(err){
        return next(err)
    }
}

const deleteQuizById = async (req, res, next) => {
    try{
        const {quizId} = req.params

        const user = await User.findById(req.user_Id)
        if(!user){
            return res.status(401).json({message: 'User Not Found'})
        }

        const quiz = await Quiz.findById(quizId)
        if(!quiz){
            return res.status(404).json({error: 'Quiz Not Found'})
        }
        const tot_ques = quiz.questions.length
        const tot_imp = quiz.quizImpressions

        const deletedQuiz = await Quiz.findByIdAndDelete(quizId)
        if(!deletedQuiz){
            return res.status(404).json({error: 'Quiz Not Found'})
        }

        const quizzes = await Quiz.find({userId: req.user_Id}).select('title quizImpressions createdAt')

        await User.updateMany(
            { quizId: quizId },
            { $pull: { quizId: quizId } }
        )

        user.totalQuizzes -= 1
        user.totalQuestions -= tot_ques
        user.totalImpressions -= tot_imp
        await user.save()
        return res.status(200).json({msg:'Quiz Deleted', quizzes})
    }
    catch(err){
        return next(err)
    }
}

const getQuizAnalytics = async (req, res, next) => {
    try {
        const quiz = await Quiz.findById(req.params.quizId);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        const user = await User.findById(req.user_Id)
        if(!user){
            return res.status(401).json({message: 'User Not Found'})
        }

        const analytics = quiz.questions.map((question) => {
            if (quiz.quizType === 'qna') {
                return {
                    attempts: question.attempts,
                    correctCount: question.correctCount,
                    incorrectCount: question.incorrectCount
                };
            } 
            else if (quiz.quizType === 'poll') {
                const optionAnalytics = question.options.map((option, index) => ({
                    optionIndex: index,
                    text: option.text,
                    imageUrl: option.imageUrl,
                    selectedCount: option.selectedCount,
                }));
                return {
                    attempts: question.attempts,
                    options: optionAnalytics
                };
            }
        });

        const quizCreation = quiz.createdAt
        const quizTitle = quiz.title
        const Impressions = user.totalImpressions
        const quizType = quiz.quizType

        return res.status(200).json({ quizCreation, quizTitle, analytics, Impressions, quizType });
    } 
    catch (error) {
        next(error)
    }
};

const attemptQuiz = async (req, res, next) => {
    try{
        const {answers} = req.body

        const quiz = await Quiz.findById(req.params.id)
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        let tot_correct = 0
        let tot_incorrect = 0

        if(quiz.quizType === 'qna'){
            quiz.questions.forEach((question, qIndex) => {
                if (question.correctOption == answers[qIndex]){
                    tot_correct++
                }
                else{
                    tot_incorrect++
                }
                question.attempts++
                question.correctCount += tot_correct
                question.incorrectCount += tot_incorrect
            })
        }
        else{
            quiz.questions.forEach((question, qIndex) => {
                question.options[answers[qIndex]].selectedCount += 1
                question.attempts++
            })
        }

        await quiz.save()
        res.status(200).json({ score: tot_correct });
    }
    catch(err){
        return next(err)
    }
}

const updateQuiz = async (req, res, next) => {
    try{
        const { quizId } = req.params;
        
        const user = await User.findById(req.user_Id)
        if(!user){
            return res.status(401).json({message: 'User Not Found'})
        }

        const updatedQuiz = await Quiz.findByIdAndUpdate(quizId, req.body, { new: true });
        if (!updateQuiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        await updatedQuiz.save();
        return res.status(200).json({ message: 'Question updated successfully', updatedQuiz });
    }
    catch(err){
        return next(err)
    }
}

module.exports = {createQuiz, getAllQuizzes, getQuizById, deleteQuizById, getQuizAnalytics, updateQuiz, attemptQuiz, getTrendingQuizzes} 

