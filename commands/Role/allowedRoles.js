const {discord, MessageEmbed} = require('discord.js')
const rolesSchema = require('../../Schema/rolesSchema')
const {commonPerms, awaitReply, unfound, unable, userUnable, cancelled} = require('../../functions')

module.exports.run = async (client, message, args, gprefix, level) => {
    let role = message.mentions.roles.first() || await message.guild.roles.fetch(args[0]) //Fetch role from mention if not ID
    let Target = await message.guild.members.fetch(client.user.id) //Fetch client from guild
    let user = await message.guild.members.fetch(message.author) //Fetch author from guild
    let keyPerms = ['ADMINISTRATOR', 'KICK_MEMBERS', 'BAN_MEMBERS', 'MANAGE_CHANNELS', 'MANAGE_GUILD', 'MANAGE_MESSAGES', 'MANAGE_ROLES', 'MANAGE_EMOJIS_AND_STICKERS', 'MODERATE_MEMBERS']

    const disallowed = new MessageEmbed()
        .setDescription("That role is saved in disallowed roles. Please remove from disallowed roles and try again.")
        .setColor('WHITE')
    let success = new MessageEmbed()
        .setColor('GREEN')
    let managed = new MessageEmbed()
        .setDescription('That role is managed externally unable to save.')
        .setColor('WHITE')
    //If unable to find role return unfound
    if(!role || args.length == 0) return unfound(message, 'that role.')

    let roleID = role.id
    //let perms = role.permissions.toArray()
    let similar = commonPerms(message, keyPerms, perms)

    //If role is above user send userUnable
    if(user.roles.highest.position < role.position){
        return message.channel.send({embeds: [userUnable]})
    }
    //If role is managed return managed
    if(role.managed) return message.channel.send({embeds: [managed]})
    //If role is above bot send unable
    if(Target.roles.highest.position < role.position){
        return unable(message)
    }
    //Fetch rolesSchema
    let data = await rolesSchema.findOne({ _id: message.guild.id })
    //If no data or data exists and doesn't include roleID add to saved roles
    if(!data || !data.allowedRoles.includes(roleID)){
        //Check if there is dangerous permissions
        if(similar.length > 0){
            const response = await awaitReply(message, `This role contains **${similar.join(", ")}** permissions. Are you sure you want to add ${role.name} into saved roles? y/n`);
            // If they respond with y or yes, continue.
            if(["y", "yes"].includes(response)) {
                message.channel.send("Allowed")
            } else if(["n","no","cancel"].includes(response)) { //Else if no return cancelled
              return cancelled(message)
            } else return cancelled(message)
        }
        //If data doesn't exist create one
        if(!data){
            await rolesSchema.create({ _id: message.guild.id, allowedRoles: [roleID], disallowedRoles: []})
            success.setDescription(`Added ${role.name} to allowed saved roles.`)
        } else if(!data.allowedRoles.includes(roleID)){ //Else if it does exist push into allowed roles
            if(data.disallowedRoles.includes(roleID)) return message.channel.send({embeds: [disallowed]})
            data.allowedRoles.push(roleID)
            success.setDescription(`Added \`${role.name}\` to allowed saved roles.`)
            await data.save()
        }
    } else {//If data does include roleID remove from allowedRoles
        let targetRole = data.allowedRoles.indexOf(roleID)
        data.allowedRoles.splice(targetRole, 1)
        success.setDescription(`Removed \`${role.name}\` from allowed saved roles.`)
        await data.save()
    }
    return message.channel.send({embeds: [success]})
}

module.exports.conf = {
    permLevel: 'Administrator'
}

module.exports.help = {
    name: 'allow-role',
    aliases: ['ar', 'allow'],
    module: 'Role',
    description: 'Added roles to the allowed saved roles.',
    usage: 'allow-role [role]'
}