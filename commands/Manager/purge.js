const {discord, MessageEmbed} = require('discord.js')

module.exports.run = async (client, message, args, gprefix) => {
    const deny = new MessageEmbed()
        .setDescription('You don\'t have permissions to use this command')
        .setColor('RED')
    const invalid = new MessageEmbed()
        .setDescription("Enter a valid number to purge.")
        .setColor('YELLOW')

    if(!message.member.permissions.has('MANAGE_MESSAGES')){
        return message.channel.send({embeds: [deny]})
    }

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
    aliases: ['prune']
}