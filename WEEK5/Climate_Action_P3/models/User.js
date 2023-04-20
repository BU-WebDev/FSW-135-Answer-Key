const mongoose = require('mongoose')
const bcrypt = require("bcrypt")

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

//function to encrypt the password
userSchema.pre('save', function(next){
    const user = this
    if(!user.isModified('password')) return next()
    bcrypt.hash(user.password, 8, (err, hash) => {
        if(err) return next(err)
        user.password = hash
        next()
    })
})

//Function to check if encryted password matches
userSchema.methods.checkPassword = function(passwordAttempt, callback) {
    bcrypt.compare(passwordAttempt, this.password, (err, isMatch) => {
        if(err) return callback(err)
        return callback(null, isMatch)
    })
}

userSchema.methods.withoutPassword = function () {
    const user = this.toObject()
    delete user.password
    return user
}

module.exports = mongoose.model('User', userSchema)