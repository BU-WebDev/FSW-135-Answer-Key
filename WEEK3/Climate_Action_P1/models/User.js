const mongoose = require('mongoose')

//User Schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    isAdmin: {
        type: Boolean,
        default: false,
        require: true
    } 
})

module.exports = mongoose.model('User', userSchema)