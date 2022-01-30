const {discord, MessageEmbed} = require('discord.js')

module.exports.run = async (client, message, args, gprefix) => {
    if (message.member.user.id === '274909438366973953' || message.member.user.id === '493163747704045568'){
        message.delete()
        const invite = new MessageEmbed()
            .setDescription(`[Invite Me!](https://discordapp.com/oauth2/authorize?client_id=920885512208793652&permissions=18432&scope=bot&permissions=2134207679)`)
        message.channel.send({embeds: [invite]}).then(m => setTimeout(() => m.delete(), 10000))
    }
}

module.exports.help = {
    name: 'invite'
}