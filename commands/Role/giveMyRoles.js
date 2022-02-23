const {discord, MessageEmbed} = require('discord.js')
const savedRolesSchema = require('../../Schema/savedRolesSchema')
const rolesSchema = require('../../Schema/rolesSchema')
const {commonPerms, fixRoleMention} = require('../../functions')


module.exports.run = async (client, message, args, gprefix, level) => {
    let Target = await message.guild.members.fetch(client.user.id) //Fetch client from guild
    let user = await message.guild.members.fetch(message.author)
    let allowedRoles;
    let disallowedRoles;
    let roleArray = []

    let keyPerms = ['ADMINISTRATOR', 'KICK_MEMBERS', 'BAN_MEMBERS', 'MANAGE_CHANNELS', 'MANAGE_GUILD', 'MANAGE_MESSAGES', 'MANAGE_ROLES', 'MANAGE_EMOJIS_AND_STICKERS', 'MODERATE_MEMBERS']

    let success = new MessageEmbed().setDescription("Successfully returned your saved roles that are allowed to be returned.").setColor('GREEN')
    let unable = new MessageEmbed().setDescription("Unable to find your saved roles, no allowed roles to be returned, or no roles were saved.").setColor('RED')

    let roleData = await rolesSchema.findOne({ _id: message.guild.id })
    if(roleData){
        allowedRoles = roleData.allowedRoles
        disallowedRoles = roleData.disallowedRoles
    }

    let data = await savedRolesSchema.findOne({ _id: message.author.id })
    if(!data || (data.savedRoles.length == 1 && disallowedRoles.includes(data.savedRoles[0]))){
        return message.channel.send({embeds: [unable]})
    }

    for(let i=0; i<data.savedRoles.length; i++){
        let role = await message.guild.roles.fetch(data.savedRoles[i])
        if(!role){
            let targetRole = data.savedRoles.indexOf(data.savedRoles[i])
            data.savedRoles.splice(targetRole, 1)
            continue
        }
        let similar = commonPerms(message, keyPerms, role.permissions.toArray())
        if(Target.roles.highest.position < role.position || disallowedRoles.includes(role.id) || role.managed){
            continue
        }
        if(similar.length > 0 && !allowedRoles.includes(role.id)){
            continue
        } else{
            user.roles.add(role)
            roleArray.push(role.id)
        }
    }
    if(roleArray.length < 1) return message.channel.send({embeds: [unable]})
    success.addField('Roles Returned', fixRoleMention(message, roleArray))
    message.channel.send({embeds: [success]})
}

module.exports.conf = {
    permLevel: 'User'
}

module.exports.help = {
    name: 'givemyroles',
    aliases: ['gmr'],
    module: 'Role',
    description: 'Returns all the roles that allowed/can be returned.',
    usage: 'givemyroles'
}