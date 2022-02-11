const {discord, MessageEmbed} = require('discord.js')

module.exports.run = async (client, message, args, gprefix) => {
    let userID = args[0]
    let Target = message.mentions.users.first()

    const unfound = new MessageEmbed()
        .setDescription("Couldn't find that user.")
        .setColor('FUCHSIA')
    const found = new MessageEmbed().setTitle("Avatar").setTimestamp()

    if (args.length == 0){
        Target = message.member.user
        found.setAuthor({name: Target.username+"#"+Target.discriminator, iconURL: Target.displayAvatarURL({dynamic: true})})
            .setImage(Target.displayAvatarURL({dynamic: true, size: 512}))
        return message.channel.send({embeds: [found]})
    }
    if(Target){
        found.setAuthor({name: Target.username+"#"+Target.discriminator, iconURL: Target.displayAvatarURL({dynamic: true})})
            .setImage(Target.displayAvatarURL({dynamic: true, size: 512}))
        return message.channel.send({embeds: [found]})
    } else if (!Target && args.length == 1){
        try {
            Target = await message.guild.members.fetch(userID)
        }
        catch(err){
            return message.channel.send({embeds: [unfound]})
        }
        found.setAuthor({name: Target.user.username+"#"+Target.user.discriminator, iconURL: Target.user.displayAvatarURL({dynamic: true})})
            .setImage(Target.displayAvatarURL({dynamic: true, size: 512}))
        return message.channel.send({embeds: [found]})
    } else {
        message.channel.send({embeds: [unfound]})
    }
}

module.exports.help = {
    name: 'avatar',
    aliases: ['av'],
    permLevel: 'User'
}