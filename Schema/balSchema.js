const mongoose = require('mongoose')

const bal = {
    type: Number,
    default: 0,
    require: true
}
const balSchema = mongoose.Schema({
    _id: {
        type: String,
        require: true,
    },
    balance: bal
})

const model = mongoose.model("Balance", balSchema)

module.exports = model;