const mongoose = require('mongoose')

//Issue Schema
const issueSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    }
})

module.exports = mongoose.model('Issue', issueSchema)