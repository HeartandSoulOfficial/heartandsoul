/*const Discord = require('discord.js')

module.exports.run = async (client, message, args, prefix) => {
    if (!message.content.startsWith(prefix)) return;
    message.channel.send('Hello!')
}

module.exports.help = {
    name: 'hello'
}*/


/*module.exports.run = (client, message, prefix) => {
    if (messgae.content.startsWith(prefix))
    message.channel.send("Hello!").catch(console.error);
}*/

const Discord = require('discord.js')

module.exports.run = async (client, message, args, gprefix) => {
    message.channel.send("Hello!").catch(console.error)
}
module.exports.help = {
    name: 'hello'
}