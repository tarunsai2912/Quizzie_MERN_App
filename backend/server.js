const express = require('express')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const userRoutes = require('./routes/userRoutes')
const quizRoutes = require('./routes/quizRoutes')
const mongoose = require('mongoose')
const fs = require('fs')
const cors = require('cors')
dotenv.config()

const app = express()
const port = process.env.Port || 3001

app.use(cors())

app.use((req, res, next) => {
    const log = `${req.method} - ${req.url} - ${req.ip} - ${new Date()}`
    fs.appendFile('log.txt', log, (err) => {
        if(err){
            console.log(err);
        }
    })
    next()
})

app.use(bodyParser.json())
app.get('/', (req, res) => {
    res.send('Hello User Welcome to Quizzie')
})

app.use('/api/user', userRoutes)
app.use('/api/quiz', quizRoutes)

app.use((err, req, res, next) => {
    let log = err.stack
    log += `/n${req.method} - ${req.url} - ${req.ip} - ${new Date()}`
    fs.appendFile('error.txt', log, (err) => {
        if(err){
            console.log(err);
        }
    })
    res.status(500).send("Something went wrong")
})

mongoose.connect(process.env.MONGO_URI)

mongoose.connection.on('connected', () => {
    console.log('MongoDb is connected...');
})

app.listen(port, () => {
    console.log(`Server is running on ${port} port number`);
})