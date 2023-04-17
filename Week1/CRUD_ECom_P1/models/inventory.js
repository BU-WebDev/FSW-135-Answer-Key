const mongoose = require('mongoose')

//Inventory Schema
const inventorySchema = new mongoose.Schema({
    title:{
        type: String,
        require: true
    },
    description:{
        type: String,
        required: true,
        maxLength: 20
    },
    value: {
        type: Number,
        required: true,
        min: 0
    }
})

module.exports = mongoose.model('Inventory', inventorySchema)