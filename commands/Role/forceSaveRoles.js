const {discord, MessageEmbed} = require('discord.js')
const savedRolesSchema = require('../../Schema/savedRolesSchema')
const rolesSchema = require('../../Schema/rolesSchema')
const {commonPerms, fixRoleMention, unfound, awaitReply} = require('../../functions')

module.exports.run = async (client, message, args, gprefix, level) => {

    let Target = message.mentions.users.first()
    let savedRolesArray = []
    let allowedRoles;
    let disallowedRoles;
    let user;
    let keyPerms = ['ADMINISTRATOR', 'KICK_MEMBERS', 'BAN_MEMBERS', 'MANAGE_CHANNELS', 'MANAGE_GUILD', 'MANAGE_MESSAGES', 'MANAGE_ROLES', 'MANAGE_EMOJIS_AND_STICKERS', 'MODERATE_MEMBERS']

    if(Target){
        user = await message.guild.members.fetch(Target.id)
    } else if (!Target && args.length > 0){
        try {
            user = await message.guild.members.fetch(args[0])
        } catch(err){
            return unfound(message, 'that user.')
        }
    } else if (args.length < 1){
        return unfound(message, 'that user.')
    }

    let success = new MessageEmbed().setDescription(`Successfully saved <@!${user.id}> **current** roles that are allowed to be saved.`).setColor('GREEN')
    let unable = new MessageEmbed().setDescription(`Unable to save <@!${user.id}> roles or no roles to be saved.`).setColor('RED')
    const cancelled = new MessageEmbed()
        .setDescription('Ignored.')
        .setColor('DARK_BUT_NOT_BLACK')

    let userRoles = user._roles

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
            const response = await awaitReply(message, `Are you sure you want to add ${role.name} into their saved roles? y/n`);
            // If they respond with y or yes, continue.
            if(["y", "yes"].includes(response)) {
                savedRolesArray.push(role.id)
                message.channel.send("Allowed")
            } else if(["n", "no"].includes(response)) {
                message.channel.send({embeds: [cancelled]}) 
            } else return
        } else{
            savedRolesArray.push(role.id)
        }
    }

    let data = await savedRolesSchema.findOne({ _id: user.id })
    if(!data){
        await savedRolesSchema.create({ _id: user.id, savedRoles: savedRolesArray })
        success.setAuthor({name: user.username+"#"+user.discriminator, iconURL: user.displayAvatarURL({dynamic: true})}).addField('Saved', fixRoleMention(message, savedRolesArray))
    } else {
        data.savedRoles = savedRolesArray
        success.setAuthor({name: user.username+"#"+user.discriminator, iconURL: user.displayAvatarURL({dynamic: true})}).addField('Saved', fixRoleMention(message, savedRolesArray.reverse()))
        await data.save()
    }

    message.channel.send({embeds: [success]})
}

module.exports.conf = {
    permLevel: 'Server Moderator'
}

module.exports.help = {
    name: 'forcesave',
    aliases: ['fs'],
    module: 'Role',
    description: 'Force saves a user\'s current roles.',
    usage: 'forcesave [user]'
}