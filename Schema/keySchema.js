const mongoose = require('mongoose')

const keySchema = mongoose.Schema({
    _id: {
        type: String,
        require: true
    },
    key: {
        type: String,
        require: true
    }
})

const model = mongoose.model('Key', keySchema)

module.exports = model;