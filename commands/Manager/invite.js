const {discord, MessageEmbed} = require('discord.js')
require('dotenv').config()

module.exports.run = async (client, message, args, gprefix, level) => {
    message.delete()
    const invite = new MessageEmbed()
        .setDescription(`[Invite Me!](${process.env.INVITE})`)
    message.channel.send({embeds: [invite]}).then(m => setTimeout(() => m.delete(), 5000))
}

module.exports.conf = {
    permLevel: "Bot Owner"
}

module.exports.help = {
    name: 'invite',
    aliases: ['inv'],
    module: "Manager",
    description: "Get bot invite.",
    usage: "invite"
}