const {discord, MessageEmbed} = require('discord.js')
const moment = require('moment')
const {Fix} = require('../../functions')

module.exports.run = async (client, message, args, gprefix, level) => {
    const unfound = new MessageEmbed()
        .setDescription("Couldn't find that role.")
        .setColor('FUCHSIA')

    let role = message.mentions.roles.first() || await message.guild.roles.fetch(args[0])
    let keyPerms = ['MENTION_EVERYONE', 'ADMINISTRATOR', 'KICK_MEMBERS', 'BAN_MEMBERS', 'MANAGE_CHANNELS', 'MANAGE_GUILD', 'MANAGE_MESSAGES', 'MANAGE_NICKNAMES', 'MANAGE_ROLES', 'MANAGE_WEBHOOKS', 'MANAGE_EMOJIS_AND_STICKERS', 'MODERATE_MEMBERS']
    let hasKeyPerms = []
    
    if(!role) return message.channel.send({embeds: [unfound]})

    const roleID = role.id
    const roleName = role.name
    let roleColor = Fix(role.hexColor)
    const mention = `\`<@&${role.id}>\``
    let hoisted = Fix(role.hoist)
    const location = role.position
    let isMentionable = Fix(role.mentionable)
    let manage = Fix(role.managed)
    let perms = role.permissions.toArray()
    let created = role.createdAt

    for(let i=0; i<perms.length; i++){
       if(keyPerms.includes(perms[i])){
           if(perms[i] == 'MANAGE_GUILD'){
               perms[i] = 'MANAGE_SERVER'
           }
           if(perms[i] == 'MODERATE_MEMBERS'){
               perms[i] = 'TIMEOUT_MEMBERS'
           }
           let words = perms[i].split("_")
           let combined = []
           for(let j of words){
               let word = j.toLowerCase()
               combined.push(word[0].toUpperCase()+word.substring(1))
           }
           hasKeyPerms.push(combined.join(' '))
        }
    }


    hasKeyPerms = hasKeyPerms.join(", ")

    let roleinfo = new MessageEmbed()
    .addFields(
        {name: 'ID', value: `${roleID}`, inline: true},
        {name: 'Name', value: `${roleName}`, inline: true},
        {name: 'Color', value: `${roleColor}`, inline: true}
    )
    .addFields(
        {name: 'Mention', value: `${mention}`, inline: true},
        {name: 'Hoisted', value: `${hoisted}`, inline: true},
        {name: 'Role Position', value: `${location}`, inline: true}
    )
    .addFields(
        {name: 'Mentionable', value: `${isMentionable}`, inline: true},
        {name: 'Managed', value: `${manage}`, inline: true},
        {name: 'Key Permissions', value: `${hasKeyPerms}`, inline: false}
    )
    .setColor(`${role.hexColor}`)
    .setFooter({text: 'Role Created • '+moment(created).format('MM/D/YY')})
    message.channel.send({embeds: [roleinfo]})

}

module.exports.conf = {
    permLevel: "User"
}

module.exports.help = {
    name: 'roleinfo',
    aliases: ['rinfo'],
    module: "Miscellaneous",
    description: "Get information about a role.",
    usage: "roleinfo [role]"
}