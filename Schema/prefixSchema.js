const mongoose = require('mongoose')

const defString = {
    type: String,
    default: "hns",
    require: true
}
 

const PrefixSchema = mongoose.Schema({
    _id: {
        type: String,
        require: true
    },
    newPrefix: defString
})
const model = mongoose.model("Prefixes", PrefixSchema)

module.exports = model;