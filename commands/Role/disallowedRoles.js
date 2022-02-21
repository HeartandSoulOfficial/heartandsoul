const {discord, MessageEmbed} = require('discord.js')
const rolesSchema = require('../../Schema/rolesSchema')

module.exports.run = async (client, message, args, gprefix, level) => {
    let role = message.mentions.roles.first() || await message.guild.roles.fetch(args[0]) //Fetch role from mention if not ID
    let Target = await message.guild.members.fetch(client.user.id) //Fetch client from guild
    let user = await message.guild.members.fetch(message.author) //Fetch author from guild
    let roleID = role.id

    const unfound = new MessageEmbed()
        .setDescription("Couldn't find that role.")
        .setColor('FUCHSIA')
    const unable = new MessageEmbed()
        .setDescription('That role is above me.')
        .setColor('RED')
    const userUnable = new MessageEmbed()
        .setDescription('That role is above you.')
        .setColor('RED')
    let success = new MessageEmbed()
        .setColor('GREEN')
    const allowed = new MessageEmbed()
        .setDescription("That role is saved in allowed roles. Please remove from allowed roles and try again.")
        .setColor('WHITE')
    //If unable to find role return unfound
    if(!role) return message.channel.send({embeds: [unfound]})
    //If role is above user send userUnable
    if(user.roles.highest.position < role.position){
        return message.channel.send({embeds: [userUnable]})
    }
    //If role is above bot send unable
    if(Target.roles.highest.position < role.position){
        return message.channel.send({embeds: [unable]})
    }
    //Fetch rolesSchema
    let data = await rolesSchema.findOne({ _id: message.guild.id })
    //If no data or data exists and doesn't include roleID add to saved roles
    if(!data || !data.disallowedRoles.includes(roleID)){
        //If data doesn't exist create one
        if(!data){
            await rolesSchema.create({ _id: message.guild.id, allowedRoles: [roleID], disallowedRoles: []})
            success.setDescription(`Added ${role.name} to disallowed saved roles.`)
        } else if(!data.disallowedRoles.includes(roleID)){ //Else if it does exist push into allowed roles
            if(data.allowedRoles.includes(roleID)) return message.channel.send({embeds: [allowed]})
            data.disallowedRoles.push(roleID)
            success.setDescription(`Added ${role.name} to disallowed saved roles.`)
            await data.save()
        }
    } else {//If data does include roleID remove from allowedRoles
        let targetRole = data.disallowedRoles.indexOf(roleID)
        data.disallowedRoles.splice(targetRole, 1)
        success.setDescription(`Removed ${role.name} from disallowed saved roles.`)
        await data.save()
    }
    return message.channel.send({embeds: [success]})
}

module.exports.conf = {
    permLevel: 'Administrator'
}

module.exports.help = {
    name: 'disallowed-role',
    aliases: ['dr', 'disallow'],
    module: 'Role',
    description: 'Added roles to the disallowed saved roles.',
    usage: 'disallow-role [role]'
}