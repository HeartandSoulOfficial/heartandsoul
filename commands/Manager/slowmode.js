const {discord, MessageEmbed} = require('discord.js')

module.exports.run = async (client, message, args, gprefix) => {
    message.delete()
    let time = parseInt(args[0])
    let option = args[0]

    let Target = await message.guild.members.fetch(client.user.id)
    const perms = new MessageEmbed()
        .setDescription('I don\'t have permissions to set slowmode in this channel')
        .setColor('RED')
    const invalid = new MessageEmbed()
        .setDescription("Enter a valid time to set slowmode.")
        .setColor('YELLOW')

    if(!message.channel.permissionsFor(Target).has('MANAGE_CHANNELS')){
        return message.channel.send({embeds: [perms]}).then(m => setTimeout(() => m.delete(), 3000))
    }

    if(!message.member.permissions.has('MANAGE_MESSAGES')) return

    if(args.length == 0 || option == 'off'){
        return message.channel.setRateLimitPerUser('0')
    } else if(option == 'on'){
        return message.channel.setRateLimitPerUser('2')
    } else if(option == 'ont'){
        return message.channel.setRateLimitPerUser('3')
    } else if(option == 'onf'){
        return message.channel.setRateLimitPerUser('5')
    }

    if(Number.isNaN(amount) && args.length != 0){
        return message.channel.send({embeds: [invalid]}).then(m => setTimeout(() => m.delete(), 3000))
    } else {
        message.channel.setRateLimitPerUser(time)
    }
}

module.exports.help = {
    name: 'slowmode',
    aliases: ['slow', 'ratelimit', 'rate', 'rm', 'sm'],
    permLevel: "Server Moderator"
}