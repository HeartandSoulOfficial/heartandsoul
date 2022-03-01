const {discord, MessageEmbed} = require('discord.js')
const savedRolesSchema = require('../../Schema/savedRolesSchema')
const rolesSchema = require('../../Schema/rolesSchema')
const {fixRoleMention} = require('../../functions')


module.exports.run = async (client, message, args, gprefix, level) => {
    let roleArray = []

    let success = new MessageEmbed().setAuthor({name: message.author.username+"#"+message.author.discriminator, iconURL: message.author.displayAvatarURL({dynamic: true})}).setColor('GREEN')
    let unable = new MessageEmbed().setAuthor({name: message.author.username+"#"+message.author.discriminator, iconURL: message.author.displayAvatarURL({dynamic: true})}).setDescription("Unable to find your saved roles, or no roles were saved.").setColor('RED')

    let data = await savedRolesSchema.findOne({ _id: message.author.id })
    if(!data || (data.savedRoles.length < 1)){
        return message.channel.send({embeds: [unable]})
    }

    for(let i=0; i<data.savedRoles.length; i++){
        let role = await message.guild.roles.fetch(data.savedRoles[i])
        if(!role){
            let targetRole = data.savedRoles.indexOf(data.savedRoles[i])
            data.savedRoles.splice(targetRole, 1)
            continue
        }
        roleArray.push(role.id)
    }
    success.addField('Saved Roles', fixRoleMention(message, roleArray.reverse()))
    message.channel.send({embeds: [success]})
}

module.exports.conf = {
    permLevel: 'User'
}

module.exports.help = {
    name: 'mysavedroles',
    aliases: ['msr'],
    module: 'Role',
    description: 'View all your saved roles.',
    usage: 'mysavedroles'
}