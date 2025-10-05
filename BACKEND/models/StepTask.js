const mongoose = require('mongoose')

const Schema =  mongoose.Schema



const stepTaskSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    order: {
        type: Number,
        required: true
    }
});

module.exports = stepTaskSchema;