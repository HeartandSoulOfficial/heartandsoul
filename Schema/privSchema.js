const mongoose = require('mongoose')

const privSchema = mongoose.Schema({
    _id: {
        type: String,
        require: true
    },
    priv: []
})

const model = mongoose.model('Private', privSchema)

module.exports = model;