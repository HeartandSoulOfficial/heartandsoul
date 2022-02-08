const {discord, MessageEmbed} = require('discord.js')

module.exports.run = async (client, message, args, gprefix) => {
    const unfound = new MessageEmbed()
        .setDescription("Couldn't find that role.")
        .setColor('FUCHSIA')
    const perms = new MessageEmbed()
        .setDescription('I don\'t have permissions to change role color.')
        .setColor('RED')
    const unable = new MessageEmbed()
        .setDescription('That role is above me.')
        .setColor('RED')
    const invalid = new MessageEmbed()
        .setDescription("Provide a color in hex.")
        .setColor('YELLOW')
    const deny = new MessageEmbed()
        .setDescription('You don\'t have permissions to use this command')
        .setColor('RED')
    let changed = new MessageEmbed()

    let Target = await message.guild.members.fetch(client.user.id)
    let role = message.mentions.roles.first() || await message.guild.roles.fetch(args[0])

    if(!message.member.permissions.has('ADMINISTRATOR')) return message.channel.send({embeds: [deny]})

    if(!message.channel.permissionsFor(Target).has('MANAGE_ROLES')){
        return message.channel.send({embeds: [perms]})
    }

    if(!role) return message.channel.send({embeds: [unfound]})

    if(Target.roles.highest.position < role.position){
        return message.channel.send({embeds: [unable]})
    }

    if(args.length == 1) return message.channel.send({embeds: [invalid]})

    let roleColor = `#${role.color.toString(16)}`
    let newColor = args[1].split('#').join('');
    let random = ((1 << 24) * Math.random() | 0).toString(16)
    let Color;
    const reg = /^[0-9A-F]{6}$/i

    if (!reg.test(newColor)) {
        newColor = '000000'
    }

    if(args[1] == 'random'){
        newColor = random
        Color = `#${random}`
        role.setColor(`#${random}`)
    }else{
        Color = `#${newColor}`
        role.setColor(`#${newColor}`)
    }

    if(roleColor == '#0'){
        roleColor = 'transparent'
    }
    if(newColor == '000000'){
        Color = `transparent`
    }

    changed.setDescription(`Changed the role color for <@&${role.id}> from ${roleColor} \nto ${Color}`).setColor(`#${newColor}`)

    message.channel.send({embeds: [changed]})

}

module.exports.help = {
    name: 'rolecolor',
    aliases: ['rc']
}