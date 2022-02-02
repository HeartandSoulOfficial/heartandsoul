const {discord, MessageEmbed} = require('discord.js')
const balSchema = require('../../Schema/balSchema')

module.exports.run = async (client, message, args, gprefix) => {
    let amount;
    let Target = message.mentions.users.first()

    const unfound = new MessageEmbed()
        .setDescription("Couldn't find that user.")
        .setColor('FUCHSIA')
    const invalid = new MessageEmbed()
        .setDescription("Enter a valid number to set money to the user.")
        .setColor('YELLOW')
    const deny = new MessageEmbed()
        .setDescription('You don\'t have permissions to use this command')
        .setColor('RED')
    
    if(!message.member.permissions.has('ADMINISTRATOR')) return message.channel.send({embeds: [deny]});
    
    if(args.length == 0) return message.channel.send({embeds: [invalid]})

    if(!Target){
        try{ Target = await message.guild.members.fetch(args[0]) }
        catch(err){ return message.channel.send({embeds: [unfound]}) }
    }

    amount = parseInt(args[1])
    if(Number.isNaN(amount) || amount < 0) return message.channel.send({embeds: [invalid]})

    let data = await balSchema.findOne({ _id: Target.id })
    let success = new MessageEmbed().setColor('GREEN')

    if(!data){
        success.setDescription(`Set ${amount.toLocaleString()} to ${Target} balance. New balance is \`${amount.toLocaleString()}\`.`)
        await balSchema.create({ _id: Target.id, balance: amount })
    } else {
        data.balance = amount
        await data.save()
        success.setDescription(`Set ${amount.toLocaleString()} to ${Target} balance. New balance is \`${amount.toLocaleString()}\`.`)
    }
    message.channel.send({embeds: [success]})
}

module.exports.help = {
    name: 'set-money',
    aliases: ['set']
}