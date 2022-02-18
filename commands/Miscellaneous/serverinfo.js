const {discord, MessageEmbed} = require('discord.js')
const moment = require('moment')
const {fixTier, fixVanity}= require('../../functions')

module.exports.run = async (client, message, args, gprefix, level) => {
    let owner = (await message.guild.fetchOwner()).user
    let categorySize = (await message.guild.channels.fetch()).filter(c => c?.type == 'GUILD_CATEGORY').size
    let textSize = (await message.guild.channels.fetch()).filter(c => c?.type == 'GUILD_TEXT').size
    let voiceSize = (await message.guild.channels.fetch()).filter(c => c?.type == 'GUILD_VOICE').size
    let roleSize = (await message.guild.roles.fetch()).size
    let memberSize = message.guild.memberCount
    let boostCount = message.guild.premiumSubscriptionCount
    let boostTier = fixTier(message.guild.premiumTier)
    let vanity = fixVanity(message.guild.vanityURLCode)
    let serverIcon = message.guild.iconURL({dynamic: true})
    if(serverIcon == null){
        serverIcon = 'https://techyhost.com/wp-content/uploads/2021/06/Discord-logo.png'
    }

    let serverinfo = new MessageEmbed()
    .setAuthor({name: message.guild.name})
    .addFields(
        {name: `Categories`, value: `${categorySize}`, inline: true},
        {name: `Text Channels`, value: `${textSize}`, inline: true},
        {name: `Voice Channels`, value: `${voiceSize}`, inline: true}
    )
    .addFields(
        {name: `Owner`, value: `${owner.username}#${owner.discriminator}`, inline: true},
        {name: `Members`, value: `${memberSize}`, inline: true},
        {name: `Roles`, value: `${roleSize}`, inline: true}
    )
    .addFields(
        {name: `Boosters`, value: `${boostCount}`, inline: true},
        {name: `Boost Tier`, value: `${boostTier}`, inline: true},
        {name: `Vanity URL`, value: `${vanity}`, inline: true}
    )
    .setThumbnail(serverIcon)
    .setColor('RANDOM')
    .setFooter({text: `ID: ${message.guild.id} | Server Created • ${moment(message.guild.createdAt).format('MM/D/YYYY')}`})

    message.channel.send({embeds: [serverinfo]})
}

module.exports.conf = {
    permLevel: "User"
}

module.exports.help = {
    name: 'serverinfo',
    aliases: ['server'],
    module: "Miscellaneous",
    description: "Get server info/stats.",
    usage: "serverinfo"
}