const express = require("express")
const app = express()
const morgan = require("morgan")
const mongoose = require("mongoose")
const Inventory = require('./models/Inventory')

//Middleware
app.use(express.json())
app.use(morgan('dev'))

//Connect to DB
//Use mongoose version 6.10.0
mongoose.connect('mongodb://localhost:27017').then(
    console.log('MongoDB connected with the Server')
)

//Routes
app.get('/',(req, res) => {
    res.send(inventory)    
})

//Error Handler
app.use((err, req, res, next) => {
    console.log(err)
    return res.send({errMsg: err.message})
})

//Server Listen
app.listen(9000, () => {
    console.log("The Server is running on Port 9000")
})