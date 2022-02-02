const Discord = require('discord.js')

module.exports.run = async (client, message, args, gprefix) => {
    message.reply("Hello!")
}
module.exports.help = {
    name: 'hello',
    aliases: ['hi']
}