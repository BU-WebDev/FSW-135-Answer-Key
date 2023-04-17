const express = require("express")
const app = express()
const morgan = require("morgan")
const mongoose = require("mongoose")

//Middleware
app.use(express.json())
app.use(morgan('dev'))

//Connect to DB
//Use mongoose version 6.10.0
mongoose.connect('mongodb://localhost:27017/inventory').then(
    console.log('MongoDB connected with the Server')
)

//Routes
app.use("/inventory", require("./routes/inventory.js"))

//Error Handler
app.use((err, req, res, next) => {
    console.log(err)
    return res.send({errMsg: err.message})
})

//Server Listen
app.listen(9000, () => {
    console.log("The Server is running on Port 9000")
})