const {discord, MessageEmbed} = require('discord.js')
const savedRolesSchema = require('../../Schema/savedRolesSchema')
const rolesSchema = require('../../Schema/rolesSchema')
const {commonPerms, fixRoleMention} = require('../../functions')

module.exports.run = async (client, message, args, gprefix, level) => {

    let user = await message.guild.members.fetch(message.author)
    let userRoles = user._roles
    let savedRolesArray = []
    let allowedRoles;
    let disallowedRoles;

    let keyPerms = ['ADMINISTRATOR', 'KICK_MEMBERS', 'BAN_MEMBERS', 'MANAGE_CHANNELS', 'MANAGE_GUILD', 'MANAGE_MESSAGES', 'MANAGE_ROLES', 'MANAGE_EMOJIS_AND_STICKERS', 'MODERATE_MEMBERS']

    let success = new MessageEmbed().setAuthor({name: message.author.username+"#"+message.author.discriminator, iconURL: message.author.displayAvatarURL({dynamic: true})}).setDescription("Successfully saved your **current** roles that are allowed to be saved.").setColor('GREEN')
    let unable = new MessageEmbed().setAuthor({name: message.author.username+"#"+message.author.discriminator, iconURL: message.author.displayAvatarURL({dynamic: true})}).setDescription("Unable to save your roles or no roles to be saved.").setColor('RED')

    let roleData = await rolesSchema.findOne({ _id: message.guild.id })
    if(roleData){
        allowedRoles = roleData.allowedRoles
        disallowedRoles = roleData.disallowedRoles
    }

    if(userRoles.length < 1) return message.channel.send({embeds: [unable]})

    for(let i=0; i<userRoles.length; i++){
        let role = await message.guild.roles.fetch(userRoles[i])
        let similar = commonPerms(message, keyPerms, role.permissions.toArray())
        if(allowedRoles.includes(role.id)){
            savedRolesArray.push(role.id)
        } else if(disallowedRoles.includes(role.id) || similar.length > 0 || role.managed){
            continue
        } else if(role.name.toLowerCase() == 'muted'){
            return message.channel.send({embeds: [unable]})
        }else{
            savedRolesArray.push(role.id)
        }
    }

    let data = await savedRolesSchema.findOne({ _id: message.author.id })
    if(!data){
        await savedRolesSchema.create({ _id: message.author.id, savedRoles: savedRolesArray })
        success.addField('Saved', fixRoleMention(message, savedRolesArray))
    } else {
        data.savedRoles = savedRolesArray
        success.addField('Saved', fixRoleMention(message, savedRolesArray.reverse()))
        await data.save()
    }

    message.channel.send({embeds: [success]})
}

module.exports.conf = {
    permLevel: 'User'
}

module.exports.help = {
    name: 'savemyroles',
    aliases: ['saveroles','smr'],
    module: 'Role',
    description: 'Saves your current roles.',
    usage: 'savemyroles'
}