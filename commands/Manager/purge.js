const {discord, MessageEmbed} = require('discord.js')
const {invalid} = require('../../functions')

module.exports.run = async (client, message, args, gprefix) => {

    const perms = new MessageEmbed()
        .setDescription('I don\'t have permissions to set slowmode in this channel')
        .setColor('RED')
    
    let Target = await message.guild.members.fetch(client.user.id) //Fetch client on guild
    //If client doesn't have manage channel perms return perms
    if(!message.channel.permissionsFor(Target).has('MANAGE_CHANNELS')){
        return message.channel.send({embeds: [perms]})
    }
    //Parse int
    let amount = parseInt(args[0])
    if(Number.isNaN(amount) || amount < 1) return invalid(message, 'purge.') //If amount is NaN or less than 1 return invalid
    //Fetch amount messages and then filter where messages aren't pinned and bulk delete
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