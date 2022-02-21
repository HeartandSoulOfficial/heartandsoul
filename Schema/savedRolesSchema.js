const mongoose = require('mongoose')

const savedRolesSchema = mongoose.Schema({
    _id: {
        type: String,
        require: true,
    },
    savedRoles: []
})

const model = mongoose.model("SavedUserRoles", savedRolesSchema)

module.exports = model;