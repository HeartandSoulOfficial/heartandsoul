const mongoose = require('mongoose')

const commandSchema = mongoose.Schema({
    _id: {
        type: String,
        require: true
    },
    disabled: []
})

const model = mongoose.model('Commands', commandSchema)

module.exports = model;