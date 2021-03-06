const {discord, MessageEmbed} = require('discord.js')
const moment = require('moment')
require('dotenv').config()

module.exports.run = async (client, message, args, gprefix, level) => {
    let guilds = await client.guilds.fetch() //Fetch all guilds of client
    let ownerGuild = await client.guilds.fetch(process.env.OWNER_GUILD) //Fetch bot owner guild
    let owner = (await ownerGuild.members.fetch(process.env.OWNER_ID)).user //Fetch owner from owner guild
    let ownerName = `${owner.username}#${owner.discriminator}` || 'Flaming' //Set owner name to owner username else Flaming
    let userCount = client.users.cache.size || 0 //Fetch client user count cache size or 0
    //Put all into info Embed
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

module.exports.conf = {
    permLevel: "User"
}

module.exports.help = {
    name: 'info',
    aliases: [],
    module: "Info",
    description: "Get bot info.",
    usage: "info"
}