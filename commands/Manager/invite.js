const {discord, MessageEmbed} = require('discord.js')
require('dotenv').config()

module.exports.run = async (client, message, args, gprefix) => {
    if (message.member.user.id === '274909438366973953' || message.member.user.id === '493163747704045568'){
        message.delete()
        const invite = new MessageEmbed()
            .setDescription(`[Invite Me!](${process.env.INVITE})`)
        message.channel.send({embeds: [invite]}).then(m => setTimeout(() => m.delete(), 5000))
    }
}

module.exports.help = {
    name: 'invite',
    aliases: ['inv']
}