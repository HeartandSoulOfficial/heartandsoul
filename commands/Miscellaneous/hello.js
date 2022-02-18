const Discord = require('discord.js')

module.exports.run = async (client, message, args, gprefix, level) => {
    message.reply("Hello!")
}

module.exports.conf = {
    permLevel: "User"
}

module.exports.help = {
    name: 'hello',
    aliases: ['hi'],
    module: "Miscellaneous",
    description: "Greets you hello.",
    usage: "hello"
}