const {discord, MessageEmbed} = require('discord.js')
const rolesSchema = require('../../Schema/rolesSchema')
const {commonPerms, awaitReply, fixRoleMention} = require('../../functions')

module.exports.run = async (client, message, args, gprefix, level) => {

    let success = new MessageEmbed()
        .setColor('GREEN')

    //Fetch rolesSchema
    let data = await rolesSchema.findOne({ _id: message.guild.id })
    //If no data or data exists and doesn't include roleID add to saved roles
    if(!data){
        //If data doesn't exist create one
        success.setDescription(`No saved roles found for this server.`)
    } else {//If data does include roleID remove from allowedRoles
        for(let i=0; i<data.allowedRoles.length; i++){
            let targetRole = data.allowedRoles.indexOf(data.allowedRoles[i])
            if(!(await message.guild.roles.fetch(data.allowedRoles[i]))) data.allowedRoles.splice(targetRole, 1)
        }
        for(let i=0; i<data.disallowedRoles.length; i++){
            let targetRole = data.disallowedRoles.indexOf(data.disallowedRoles[i])
            if(!(await message.guild.roles.fetch(data.disallowedRoles[i]))) data.disallowedRoles.splice(targetRole, 1)
        }
        success.setTitle("Recached Server Saved Roles").setDescription(`**Allowed Roles: **\n${fixRoleMention(message, data.allowedRoles)}\n**Disallowed Roles:**\n${fixRoleMention(message, data.disallowedRoles)}`)
    }
    await data.save()
    return message.channel.send({embeds: [success]})
}

module.exports.conf = {
    permLevel: 'Server Moderator'
}

module.exports.help = {
    name: 'recache-saved-roles',
    aliases: ['rsr', 'recache-roles', 'cache-roles', 'cache-saved-roles'],
    module: 'Role',
    description: 'Recache and removes any unavailable saved server roles.',
    usage: 'recache-saved-roles'
}