const {discord, MessageEmbed} = require('discord.js')
const balSchema = require('../../Schema/balSchema')

module.exports.run = async (client, message, args, gprefix) => {
    const Target = message.member.user
    let data = await balSchema.findOne({ _id: Target.id })
    if(!data) {
        await balSchema.create({ _id: Target.id, balanace: 0 })
        const create = new MessageEmbed()
            .setDescription(`Current balance is \`0\`.`)
            .setColor('GREEN')
        return message.channel.send({embeds: [create]})
    } else {
    const success = new MessageEmbed()
        .setDescription(`Current balance is \`${data.balance.toLocaleString()}\`.`)
        .setColor('GREEN')
    message.channel.send({embeds: [success]})
    }
}
module.exports.help = {
    name: 'bal'
}