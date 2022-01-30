const mongoose = require('mongoose')
const {mongoPath} = require('./config.json')
require('dotenv').config()

module.exports = async () => {
    mongoose.connect(process.env.MONGO, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    return mongoose
}
mongoose.connection.on('connected', () => {
    console.log("Successfully connected to mongo.")
})