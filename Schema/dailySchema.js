const mongoose = require('mongoose')

const time = {
    type: Number,
    require: true
}

const dailySchema = mongoose.Schema({
    _id: {
        type: String,
        require:true
    },
    daily: time
})

const model = mongoose.model('Daily', dailySchema)

module.exports = model;