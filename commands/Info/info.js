const {discord, MessageEmbed} = require('discord.js')
const moment = require('moment')
require('dotenv').config()

module.exports.run = async (client, message, args, gprefix) => {
    let guilds = await client.guilds.fetch()
    let ownerGuild = await client.guilds.fetch(process.env.OWNER_GUILD)
    let owner = (await ownerGuild.members.fetch(process.env.OWNER_ID)).user
    let ownerName = `${owner.username}#${owner.discriminator}` || 'Flaming'
    let userCount = client.users.cache.size || 0

    let info = new MessageEmbed()
    .setAuthor({name: client.user.username, iconURL: client.user.displayAvatarURL({dynamic: true})})
    .addFields(
        {name: 'Dedicated For', value: 'Gosu General', inline: true},
        {name: 'Version', value: '1.0.0', inline: true},
        {name: 'Library', value: 'Javascript', inline: true}
    )
    .addFields(
        {name: 'Creator', value: ownerName, inline: true},
        {name: 'Created', value: `${moment(client.user.createdAt).format('MM/D/YYYY hh:mma')}`, inline: true},
        {name: 'Server', value: '[Link](https://discord.gg/gosugeneral)', inline: true}
    )
    .addFields(
        {name: 'Servers', value: `${guilds.size}`, inline: true},
        {name: 'Users', value: `${userCount}`, inline: true},
        {name: `Joined`, value: `${moment(client.user.joinedAt).format('MM/DD/YY')}`, inline: true}
    )
    .setColor("#820300")

    message.channel.send({embeds: [info]})
}

module.exports.help = {
    name: 'info',
    aliases: [],
    permLevel: "User"
}