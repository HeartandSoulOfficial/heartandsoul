const mongo = require('mongoose')
const {mongoPath} = require('./config.json')
module.exports = async () => {
    await mongo.connect(mongoPath, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: true
    })
}