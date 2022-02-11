const {discord, MessageEmbed} = require('discord.js')

module.exports.run = async (client, message, args, gprefix) => {
    let server = message.guild
    let fetching = new MessageEmbed().setDescription('Fetching info...')
    let wait = message.channel.send({embeds: [fetching]})
    let human = await server.members.fetch().then(human => human.filter(member => !member.user.bot).size)
    let bot = await server.members.fetch().then(bot => bot.filter(member => member.user.bot).size)
    let online = (await server.members.fetch()).filter(member => member.presence?.status === "online").size
    let offline = (await server.members.fetch()).filter(member => !member.presence || member.presence?.status === "offline").size

    let count = new MessageEmbed()
        .addField('Members', `${server.memberCount}`)
        .addFields(
            {name: 'Human', value: `:bust_in_silhouette:${human}`, inline: true},
            {name: '​', value: '​', inline: true},
            {name: 'Bot', value: `:robot:${bot}`, inline: true}
        )
        .addFields(
            {name:'Online', value: `<:online:939692639660425217>${online}`, inline: true},
            {name: '​', value: '​', inline: true},
            {name: 'Offline', value: `<:offline:939692660921344100>${offline}`, inline: true}
        )
        .setColor('RANDOM')
    wait.then(msg => msg.edit({embeds: [count]}))
    
}

module.exports.help = {
    name: 'membercount',
    aliases: ['count', 'mc'],
    permLevel: 'User'
}