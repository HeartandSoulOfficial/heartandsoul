const {discord, MessageEmbed} = require('discord.js')

module.exports.run = async (client, message, args, gprefix) => {
    const invalid = new MessageEmbed()
        .setDescription("Enter a valid number to purge.")
        .setColor('YELLOW')

    let amount = parseInt(args[0])
    if(Number.isNaN(amount) || args.length != 1){
        return message.channel.send({embeds: [invalid]})
    }
    message.channel.messages.fetch({ limit: amount+1 }).then(fetched => {
      const notPinned = fetched.filter(fetchedMsg => !fetchedMsg.pinned);
      message.channel.bulkDelete(notPinned, true);
    })
}

module.exports.help = {
    name: 'purge',
    aliases: ['prune'],
    permLevel: "Server Moderator"
}