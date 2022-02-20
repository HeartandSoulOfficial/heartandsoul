const mongoose = require('mongoose')

const rolesSchema = mongoose.Schema({
    _id: {
        type: String,
        require: true,
    },
    allowedRoles: [],
    disallowedRoles: []
})

const model = mongoose.model("SavedRoles", rolesSchema)

module.exports = model;