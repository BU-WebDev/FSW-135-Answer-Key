const express = require('express')
const app = express()
const morgan = require('morgan')
const mongoose = require('mongoose')

//Middleware (for every request)
app.use(express.json())
app.use(morgan('dev'))

//Connect to DB
mongoose.connect('mongodb://localhost:27017/climate_action_p1').then(
    console.log('MongoDB connected with the Server'))


//Routes
app.use('/authrouter', require('./routes/authRouter'))

//Error Handler
app.use((err, req, res, next) => {
    console.log(err)
    return res.send({errMsg: err.message})
})

//Server Listen
app.listen(9000, () => {
    console.log("The Server is running on Port 9000")
})