const {discord, MessageEmbed} = require('discord.js')

module.exports.run = async (client, message, args, gprefix, level) => {
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

    let changed = new MessageEmbed()

    let Target = await message.guild.members.fetch(client.user.id) //Fetch client from guild
    let role = message.mentions.roles.first() || await message.guild.roles.fetch(args[0]) //fetch role from mentinon if not fetch from ID
    //If client doesn't have Manage Roles return perms
    if(!message.channel.permissionsFor(Target).has('MANAGE_ROLES')){
        return message.channel.send({embeds: [perms]})
    }
    //If unable to find role return unfound
    if(!role) return message.channel.send({embeds: [unfound]})
    //If role is above bot send unable
    if(Target.roles.highest.position < role.position){
        return message.channel.send({embeds: [unable]})
    }
    //if args length is less than or equal to 1 return invalid
    if(args.length <= 1) return message.channel.send({embeds: [invalid]})
    //Current role color to hex
    let roleColor = `#${role.color.toString(16)}`
    let newColor = args[1].split('#').join('');//Splits and strips # of new color
    let random = ((1 << 24) * Math.random() | 0).toString(16) //Random color
    let Color;
    const reg = /^[0-9A-F]{6}$/i //Reg chr for hex
    //Reg test newColor if False then set newColor to transparent
    if (!reg.test(newColor)) {
        newColor = '000000'
    }
    //If args[1] is random set rolecolor to random
    if(args[1] == 'random'){
        newColor = random
        Color = `#${random}`
        role.setColor(`#${random}`)
    }else{ //Set color to newColor
        Color = `#${newColor}`
        role.setColor(`#${newColor}`)
    }
    //If roleColor or newColor is transparent set it to transparent
    if(roleColor == '#0'){
        roleColor = 'transparent'
    }
    if(newColor == '000000'){
        Color = `transparent`
    }

    changed.setDescription(`Changed the role color for <@&${role.id}> from ${roleColor} \nto ${Color}`).setColor(`#${newColor}`)

    message.channel.send({embeds: [changed]})

}

module.exports.conf = {
    permLevel: "Administrator"
}

module.exports.help = {
    name: 'rolecolor',
    aliases: ['rc'],
    module: "Manager",
    description: "Change the color of a role.",
    usage: "rolecolor [role] [hex color]"
}