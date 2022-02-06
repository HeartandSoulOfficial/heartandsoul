const {discord, MessageEmbed} = require('discord.js')

module.exports.run = async (client, message, args, gprefix) => {
    const unfound = new MessageEmbed()
        .setDescription("Couldn't find that user.")
        .setColor('FUCHSIA')
    const perms = new MessageEmbed()
        .setDescription('I don\'t have permissions to change role color.')
        .setColor('RED')
    const unable = new MessageEmbed()
        .setDescription('That role is above me.')
        .setColor('RED')
    let changed = new MessageEmbed()

    let Target = await message.guild.members.fetch(client.user.id)
    let role = message.mentions.roles.first() || await message.guild.roles.fetch(args[0])

    if(!message.channel.permissionsFor(Target).has('MANAGE_ROLES')){
        return message.channel.send({embeds: [perms]})
    }
    if(Target.roles.highest.position < role.position){
        return message.channel.send({embeds: [unable]})
    }

    if(!role) return message.channel.send({embeds: [unfound]})

    let roleColor = role.color.toString(16)
    role.setColor(`#${args[1]}`)
    let newColor = args[1].toString(16)

    changed.setDescription(`Changed the role color for <@&${role.id}> from #${roleColor} \nto #${newColor}`).setColor(`#${args[1]}`)

    message.channel.send({embeds: [changed]})

}

module.exports.help = {
    name: 'rolecolor',
    aliases: ['rc']
}