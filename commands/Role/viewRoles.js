const {discord, MessageEmbed} = require('discord.js')
const rolesSchema = require('../../Schema/rolesSchema')
const {fixRoleMention} = require('../../functions')

module.exports.run = async (client, message, args, gprefix, level) => {
    let success = new MessageEmbed()
        .setColor('GREEN')

    //Fetch rolesSchema
    let data = await rolesSchema.findOne({ _id: message.guild.id })
    //If data doesn't exist create one
    if(!data){
        await rolesSchema.create({ _id: message.guild.id, allowedRoles: [roleID], disallowedRoles: []})
        success.setDescription(`**Allowed Roles: **\nNone\n**Disallowed Roles:**\nNone`)
    } else {//Else
        let allowed = fixRoleMention(message, data.allowedRoles)
        let disallowed = fixRoleMention(message, data.disallowedRoles)
        success.setDescription(`**Allowed Roles: **\n${allowed}\n**Disallowed Roles:**\n${disallowed}`)
    }
    return message.channel.send({embeds: [success]})
}

module.exports.conf = {
    permLevel: 'Administrator'
}

module.exports.help = {
    name: 'view-roles',
    aliases: ['vr','list-roles','lr'],
    module: 'Role',
    description: 'View all allowed and disallowed saved roles.',
    usage: 'view-roles'
}