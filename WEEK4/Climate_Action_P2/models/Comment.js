const mongoose = require('mongoose')

//Comment Schema
const commentSchema = new mongoose.Schema({
    comment: {
        type: String,
        require: true,
        maxLength: 100
    },
    issue: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Issue",
        require: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    }
})

module.exports = mongoose.model('Comment', commentSchema)