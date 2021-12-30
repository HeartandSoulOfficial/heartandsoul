const Discord = require('discord.js')

module.exports.run = async (client, message, args, gprefix) => {
    message.channel.send("Hello!").catch(console.error)
}
module.exports.help = {
    name: 'hello'
}