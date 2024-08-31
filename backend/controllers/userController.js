const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

const userRegister = async (req, res, next) => {
    try{
        const {name, email, password, confirmPassword} = req.body
        if(password !== confirmPassword){
            return res.status(400).json({msg: "Password doesn't match"})
        }
        const user = await User.findOne({email})
        if(user){
            return res.status(400).json({msg: "User Already Exists"})
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        })
        await newUser.save()
        return res.status(201).json({newUser})
    }
    catch(err){
        return next(err)
    }
}

const userLogin = async (req, res, next) => {
    const {email, password} = req.body
    try{
        const user = await User.findOne({email})
        if(!user || !(await bcrypt.compare(password, user.password))){
            return res.status(401).json({msg: 'Email/Password is Incorrect'})
        }
        const user_Id = user._id
        const token = jwt.sign({user_Id: user._id}, process.env.JWT_SECRET)
        return res.status(200).json({msg: 'User got LoggedIn', token, user_Id})
    }
    catch(err){
        return next(err)
    }
}

const getUserById = async (req, res, next) => {
    const {userId} = req.params
    try{
        const user = await User.findById(userId)
        if(!user) {
            return res.status(401).json({msg: 'User Not Found'})
        }

        const quizzes = user.totalQuizzes
        const questions = user.totalQuestions
        const impressions = user.totalImpressions

        return res.status(200).json({msg: 'User Found', quizzes, questions, impressions})
    }
    catch(err){
        return next(err)
    }
}

module.exports = {userRegister, userLogin, getUserById}